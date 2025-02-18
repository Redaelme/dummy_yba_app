/* eslint-disable no-console */
import { OAuth, PrismaClient, Room, SheduleStatus } from '@prisma/client';
import { google } from 'googleapis';
import moment from 'moment';
import { v4 as uuid_v4 } from 'uuid';
import { credentials, EmailTemplateStaticFilesPaths } from '../configs/config';
import { NO_FREE_SLOT_ERROR, UNHAUTHORIZED_ERROR } from '../schema/graphql/errors/messages';
import {
  NO_FREE_SLOT,
  NoFreeSlotFoundError,
  UnhauthorizedError,
} from '../schema/graphql/errors/Shedule';
import { Context } from '../types/contextType';
import { OAuth2Client, SlotProps } from '../types/types';
import { buildEmail, buildUserName } from './commonBusinessLogic';
import {
  EntityTypes,
  GCalendarColor,
  GCalendarStatus,
  NotificationTypes,
  RedisHashKeys,
  ScheduleStatus,
  TemplateNames,
} from './constants';
import { sendNotificationPush } from './firebase';
import { Events } from './googleInterface';
import { checkAvailabilityRoom } from './sheduleLogic/checkAvailabilityRoom';

import { buildIntersect, Iintersect, slotsFromEvents } from './utils';
import login from "../schema/graphql/resolvers/Mutation/Authentication/login";
const credentialstmp = require('../mail/google/credentials.json');

export const googleLogic = async (
  ctx: Context,
  email: string,
  userInvited:
    | ({
        email: string;
        required: boolean;
      } | null)[]
    | null
    | undefined,
  tokenOfCreator: OAuth,
  debut: Date,
  fin: Date,
  duration: number,
  UTC: number,
) => {
  const { oAuth2Client, redis } = ctx;
  try {
    const availableTimesForAllUsers = await Promise.all(
      [
        {
          email,
          required: true,
        },
        ...(userInvited || []),
      ].map(async (item) => {
        if (item && item.email) {
          const result = await getAvailableTimes(
            oAuth2Client,
            duration,
            debut,
            fin,
            item.email,
            item.required,
            email,
            ctx,
            UTC,
          );

          return result;
        }
        return [];
      }),
    );

    if ((availableTimesForAllUsers[0] as any) === []) {
      throw new NoFreeSlotFoundError(
        NO_FREE_SLOT_ERROR,
        'slots',
        availableTimesForAllUsers[0],
        '',
        EntityTypes.SCHEDULE,
      );
    }

    const data = buildIntersect(availableTimesForAllUsers);
    return data;
  } catch (error) {
    console.log('EEROOORR in google logics =>', error);

    throw new Error(error as string);
  }
};

export const g_locationVerification = async (
  auth: OAuth2Client,
  intersect: Iintersect[],
  location: {
    location: string;
    visioConf: boolean;
  },
  duration: number,
  margin: number,
) => {
  const newIntersect = (
    await Promise.all(
      intersect.map(async (item) => {
        let { start, end } = item;

        const eventBefore: any = await getEventList(
          auth,
          moment(item.start).subtract(margin, 'minutes').toDate(),
          item.start,
          'primary',
        );

        const eventAfter: any = await getEventList(
          auth,
          item.end,
          moment(item.end).add(margin, 'minutes').toDate(),
          'primary',
        );
        console.log({ location });

        if (eventBefore[0]) {
          if (
            location.location !== 'Aucune localisation' &&
            eventBefore[0].location &&
            !(eventBefore[0].location.toLowerCase() as string).includes(
              location.location.toLowerCase(),
            )
          ) {
            start = moment(start).add(margin, 'minutes').toDate();
          } else {
            start = moment(start).add(5, 'minutes').toDate();
          }
        }
        if (eventAfter[0]) {
          if (
            location.location !== 'Aucune localisation' &&
            eventAfter[0].location &&
            !(eventAfter[0].location.toLowerCase() as string).includes(
              location.location.toLowerCase().split('(')[0],
            )
          ) {
            end = moment(end).subtract(margin, 'minutes').toDate();
          } else {
            end = moment(end).subtract(5, 'minutes').toDate();
          }
        }
        console.log(
          `${moment(start).format('dddd Do HH:mm')}-${moment(end).format('dddd Do HH:mm')}`,
        );
        return { start, end, duration: moment(end).diff(start, 'minutes') };
      }),
    )
  ).filter((item) => item.duration >= duration);

  return Promise.all(newIntersect);
};
export const getEventList = (client: OAuth2Client, debut: Date, fin: Date, id: string) => {
  const calendar = google.calendar({ version: 'v3', auth: client });

  return new Promise<Events[]>((resolve, reject) => {
    calendar.events.list(
      {
        calendarId: id,
        timeMin: new Date(debut).toISOString(),
        timeMax: new Date(fin).toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
      },
      (err: any, res: any) => {
        const events = res ? (res.data.items as Events[]) : [];
        if (err) {
          console.log('Access denied for event list', err.message);
          // reject(new Error('Access denied'));
        }

        resolve(events);
      },
    );
  });
};
export const g_checkHolidays = async (
  auth: OAuth2Client,
  intersect: Iintersect[],
  debut: Date,
  fin: Date,
  duration: number,
) => {
  const start = new Date(debut);
  const end = new Date(fin);
  const IID = 'en.french#holiday@group.v.calendar.google.com';

  const holiday = await getEventList(auth, start, end, IID);

  if (holiday) {
    const holidaysEvents = (holiday as any).map((item: any) => ({
      start: new Date(item.start.dateTime || item.start.date),
      end: new Date(item.end.dateTime || item.end.date),
    }));
    const result = intersect.map((item) => slotsFromEvents(holidaysEvents, item.start, item.end));

    return result.reduce((acc, current) => {
      if (current.length) {
        return [...acc, ...current];
      }
      return acc;
    }, []);
  }

  return intersect.filter((item) => item.duration >= duration);
};
export const g_removeEvent = async (
  niveau: string[],
  auth: OAuth2Client,
  start: Date,
  end: Date,
  ctx: Context,
) => {
  const { redis, prisma, currentUser } = ctx;
  const allEvents: Events[] = (await getEventList(auth, start, end, 'primary')) as Events[];

  const allEventstoDelete: Events[] = [];

  let result = [];

  for (const niv of niveau) {
    console.log('niv.toLowerCase():', niv.toLowerCase());
    //   // eslint-disable-next-line array-callback-return
    //   const eventToDelete = allEvents.filter(async (item) => {
    //     const event = await ctx.prisma.shedule.findFirst({ where: { eventId: item.id } });

    //     if (event && event.niveau.toLowerCase() === niv.toLowerCase()) {
    //       await prisma.shedule.update({ where: { id: event.id }, data: { acceptedSlot: null } });
    //       await redis.hdel(RedisHashKeys.TIME_SLOTS, event.id);
    //       console.log('item==>', item);
    //       return true;
    //     } else return false;
    //   });
    //   allEventstoDelete.push(...eventToDelete);
    // });
    for (const item of allEvents) {
      console.log('item.summary:', item.summary);
      const event = await ctx.prisma.shedule.findFirst({ where: { eventId: item.id } });
      if (event && event.niveau.toLowerCase() === niv.toLowerCase()) {
        allEventstoDelete.push(item);
      }
    }
  }
  console.log(
    'allEventstoDelete===>',
    allEventstoDelete.map((item) => item.summary),
  );

  if (allEventstoDelete.length === 0) {
    return [];
  }

  result = await Promise.all(
    allEventstoDelete.map(async (element) => {
      await g_deleteEvents(auth, element.id);
      const schedule = await ctx.prisma.shedule.findFirst({ where: { eventId: element.id } });
      if (schedule) {
        const language = schedule.lang || currentUser.lang || 'en'
        const emailMessage = buildEmail(
            (language === 'fr' ? 'Annulation de rendez-vous : ' : 'Meeting cancellation: ') + schedule.objet,
          currentUser?.email
            ? [
                currentUser.email,
                ...(schedule.userInvited as { email: string; required: boolean }[]).map(
                  (item: { email: string }) => item.email,
                ),
              ]
            : [],
          TemplateNames.REFUSAL_MAIL_INCOMING_REQUEST,
          {
            timezone: currentUser.timezone,
            userName: currentUser
              ? buildUserName(currentUser.firstName, currentUser.lastName)
              : buildUserName(schedule.email, ''),
            firstname: currentUser.firstName,
            date: moment(schedule.acceptedSlot).format('DD/MM/YYYY'),
            heur: moment(schedule.acceptedSlot).format('HH:mm'),
            ...EmailTemplateStaticFilesPaths,
          },
        );

        await ctx.googleClient.sendRealMessage(ctx.oAuth2Client, emailMessage, language);
        await prisma.shedule.update({ where: { id: schedule.id }, data: { acceptedSlot: null } });
        await redis.hdel(RedisHashKeys.TIME_SLOTS, element.id);
      }

      return element;
    }),
  );
  return allEventstoDelete.map((item) => item.id);
};

export const g_deleteEvents = async (auth: OAuth2Client, idEvents: string) => {
  const calendar = google.calendar({ version: 'v3', auth });
  return new Promise(async (resolve, reject) => {
    try {
      const res = await calendar.events.delete({
        // Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the &quot;primary&quot; keyword.
        calendarId: 'primary',
        // Event identifier.
        eventId: idEvents,
        // Whether to send notifications about the deletion of the event. Note that some emails might still be sent even if you set the value to false. The default is false.
        sendUpdates: 'all',
        // Guests who should receive notifications about the deletion of the event.
      });
      resolve(res.status);
    } catch (error) {
      console.log('EROOR in Delete ==>', error);
      reject(error);
    }
  });
};
export const addEvent = async (
  access_token: string,
  start: string,
  end: string,
  summary: string,
  description: string,
  location: string | undefined,
  attendees: string[],
  UTC: number,
  ctx: Context,
  id?: string,
  capacity?: number,
  reminder?: number,
  selectedRoom?: string,
) => {
  const { client_id, redirect_uri, client_secret } = credentials;
  const oAuth2Client: OAuth2Client = new google.auth.OAuth2({
    clientId: client_id,
    clientSecret: client_secret,
    redirectUri: redirect_uri,
  });
  oAuth2Client.setCredentials({ access_token });
  const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

  try {
    const res: any = await calendar.events.insert(
      {
        // Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the &quot;primary&quot; keyword.
        calendarId: 'primary',
        // Version number of conference data supported by the API client. Version 0 assumes no conference data support and ignores conference data in the event&#39;s body. Version 1 enables support for copying of ConferenceData as well as for creating new conferences using the createRequest field of conferenceData. The default is 0.

        // Deprecated. Please use sendUpdates instead.
        //
        // Whether to send notifications about the creation of the new event. Note that some emails might still be sent even if you set the value to false. The default is false.
        sendNotifications: true,
        // Whether to send notifications about the creation of the new event. Note that some emails might still be sent. The default is false.
        sendUpdates: 'all',
        conferenceDataVersion: 1,
        // Whether API client performing operation supports event attachments. Optional. The default is False.
        requestBody: {
          anyoneCanAddSelf: false,
          summary,
          conferenceData: {
            createRequest: {
              requestId: uuid_v4(),
              conferenceSolutionKey: { type: 'hangoutsMeet' },
            },
          },
          status: 'tentative',
          description,
          location: location,
          attendees:
            selectedRoom
              ? [
                  ...attendees.map((item) => ({
                    email: item,
                    responseStatus: GCalendarStatus.ACCEPTED,
                  })),
                  // ...roomsAvailable.map((item) => ()),
                  { email: selectedRoom, resource: true },
                ]
              : [
                  ...attendees.map((item) => ({
                    email: item,
                    responseStatus: GCalendarStatus.ACCEPTED,
                  })),
                ],
          start: { dateTime: moment.utc(start).utcOffset(-UTC, true).toISOString() },
          end: { dateTime: moment.utc(end).utcOffset(-UTC, true).toISOString() },
          guestsCanInviteOthers: false,
          guestsCanModify: false,
          guestsCanSeeOtherGuests: true,
          colorId: GCalendarColor.BOLD_GREEN.toString(),
          reminders: {
            useDefault: false,
            overrides: [
              { method: 'email', minutes: reminder ? reminder * 24 : 0 },
              { method: 'popup', minutes: reminder ? reminder : 0 },
            ],
          },
        },
      },

      async (err: any, result: any) => {
        console.log('error:', err);
        console.log('data====>', JSON.stringify(result));
        let invitMessageId = null;
        if (result && result.data && result.data.id) {

          // try {
          //   const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
          //   console.log('Event iCalUID:', result?.data?.iCalUID);
          //   // Adding a delay to ensure the email is indexed by Gmail
          //   await new Promise((resolve) => setTimeout(resolve, 5000));
          //   const query = `rfc822msgid:${result?.data?.iCalUID}`;
          //   const emailRes = await gmail.users.messages.list({
          //     userId: 'me',
          //     q: query,
          //     maxResults: 1,
          //   });
          //     console.log('[[emailRes]].data.messages:', emailRes);
          //   if (emailRes.data.messages && emailRes.data.messages.length > 0) {
          //     console.log('[[emailRes]].data.messages:', emailRes.data.messages);
          //     const messageId = emailRes.data.messages[0].id;
          //     const emailDetails = await gmail.users.messages.get({
          //       userId: 'me',
          //       id: messageId,
          //     });
          //     console.log('emailDetails.data.payload?.headers:', emailDetails.data.payload?.headers);
          //     const messageIdHeader = emailDetails.data.payload?.headers?.find(header => header.name?.toLowerCase() === 'message-id');
          //     if (messageIdHeader) {
          //       invitMessageId = messageIdHeader?.value;
          //     }
          //   }
          // }
          // catch (error) {
          //   console.log('Error:', error);
          // }

          if (id) {
            const { prisma } = ctx;
            const shedule = await prisma.shedule.findUnique({
              where: { id },
            });
            if (!shedule) {
              console.log('shedule not found');
            }
            console.log('[[Message]]-ID of invit:', invitMessageId);
            const updated = await prisma.shedule.update({
              where: { id },
              data: {
                eventId: result.data.id,
                status: ScheduleStatus.ACCEPTED,
                messageId: `${shedule.messageId}, ${invitMessageId}`,
              },
            });
            console.log('updated:', updated.eventId);
          }
        }
      },
    );
    console.log('res*****>:', res);

    // ctx.prisma;
  } catch (error) {
    console.log('EROOR in Add ==>', error);
  }
};

export const checkTokenValidity = async (
  expiry_date: Date,
  oAuth2Client: OAuth2Client,
  email: string,
  refreshToken: string,
  ctx: Context,
  token: string,
) => {
  // console.log("expiry_date:", expiry_date);
  // console.log("########## checkTokenValidity ##########");
  const now = moment(new Date()).add(15, 'minutes').toDate();
  // console.log("Current time plus 15 minutes:", now);
  // console.log("Current time:", new Date());

  if (moment(expiry_date).isAfter(now)) {
    console.log("Token is still valid.");
    return token;
  }

  console.log("########## token expired ##########", refreshToken);
  // console.log("########### credentialstmp.web", credentialstmp.web.client_id);
  // console.log("########## credentials ##########", credentials);

  // oAuth2Client.setCredentials({
  //   refresh_token: refreshToken,
  //   client_id: credentials.client_id,
  //   client_secret: credentials.client_secret,
  // });

  const oAuth2Client2 = new google.auth.OAuth2({
    clientId: credentials.client_id,
    clientSecret: credentials.client_secret,
    redirectUri: credentials.redirect_uri,
  });

  oAuth2Client2.setCredentials({refresh_token: refreshToken});

  console.log("########## oAuth2Client.getAccessToken() ##########");
  const new_token = await oAuth2Client2.getAccessToken();
  console.log("########## DONE oAuth2Client.getAccessToken() ##########", new_token);

  oAuth2Client.setCredentials({ access_token: new_token.token });

  if (new_token.res) {
    // p2
    console.log("Invalid-tocken-checker P1: in googleLogic line 502", JSON.stringify(new_token.res.data))
    console.log("Invalid-tocken-checker P1: in googleLogic line 502 refresh_token", JSON.stringify(new_token.res.data.refresh_token))
    console.log("Invalid-tocken-checker P1: in googleLogic line 502 email", email)
    await ctx.prisma.oAuth.update({
      data: {
        token: new_token.token,
        refreshToken: new_token.res.data.refresh_token,
        tokenExpiryDateTime: new Date(new_token.res.data.expiry_date).toISOString(),
      },
      where: { email },
    });
  }

  return new_token.token;
};

export const getAvailableTimes = async (
  auth: OAuth2Client,
  duration: number,
  debut: Date,
  fin: Date,
  mail: string,
  required: boolean,
  creator: string,
  ctx: Context,
  UTC: number,
) => {
  return new Promise((resolve, reject) => {
    const calendar = google.calendar({ version: 'v3', auth });

    calendar.freebusy.query(
      {
        alt: 'JSON',
        auth,
        requestBody: {
          timeMin: new Date(debut).toISOString(),
          timeMax: new Date(fin).toISOString(),
          items: [{ id: mail }],
        },
      },
      (err: any, data: any) => {
        if (err || !data) {
          console.log('Access denied for:', mail, err.errors);
          if (mail === creator) {
            reject(
              new UnhauthorizedError(
                UNHAUTHORIZED_ERROR,
                'appointment',
                mail,
                '',
                EntityTypes.UNHAUTHORIZED,
              ),
            );
          }
        } else {
          console.log('-----------------------', mail, '--------------------------');
        }
        // console.log('data.data.calendars[mail].busy:', data.data.calendars[mail].busy);

        // then calculate free slots
        let availableSlot = slotsFromEvents(
          data.data.calendars[mail].busy as SlotProps[],
          new Date(debut),
          new Date(fin),
        );

        // if (allEventReserved.length) {
        //   availableSlot = availableSlot.reduce<SlotProps[]>((acc, current) => {
        //     const available = slotsFromEvents(
        //       allEventReserved,
        //       new Date(current.start),
        //       new Date(current.end),
        //     );

        //     return [...acc, ...available];
        //   }, []);
        // }

        if (availableSlot.length === 0 && required === true) {
          console.log('new roor:', new NoFreeSlotFoundError(NO_FREE_SLOT, 'appointment', mail, ''));

          reject(new NoFreeSlotFoundError(NO_FREE_SLOT_ERROR, 'appointment', mail, ''));
        }
        // console.log('availableSlot  ', availableSlot);
        // console.log(
        //   'available ==>',
        //   availableSlot.map((item: { start: moment.MomentInput; end: moment.MomentInput }) => [
        //     `${moment.utc(item.start).format('dddd Do HH:mm:ss')}-${moment
        //       .utc(item.end)
        //       .format('dddd Do HH:mm:ss')}-${moment(item.end).diff(
        //       moment(item.start),
        //       'minutes',
        //       true,
        //     )}`,
        //   ]),
        // );

        resolve(availableSlot);
      },
    );
  });
};

export const getAvailableTimesForUniqueUser = (
  auth: OAuth2Client,
  debut: Date,
  fin: Date,
  mail: string,
) => {
  return new Promise<SlotProps[]>((resolve, reject) => {
    const calendar = google.calendar({ version: 'v3', auth });

    calendar.freebusy.query(
      {
        alt: 'JSON',
        auth,
        requestBody: {
          timeMin: moment.utc(debut).toISOString(),
          timeMax: moment.utc(fin).toISOString(),
          items: [{ id: mail }],
        },
      },
      (err: any, data: any) => {
        if (err || !data) {
          console.log('Access denied for:', mail, err.errors);
        } else {
          console.log('-----------------------', mail, '--------------------------');
        }

        // then calculate free slots
        const availableSlot = slotsFromEvents(
          data.data.calendars[mail].busy as SlotProps[],
          new Date(debut),
          new Date(fin),
        ).map(({ start, end }) => ({
          start,
          end,
          duration: moment(end).diff(moment(start), 'minutes', true),
        }));

        resolve(availableSlot);
      },
    );
  });
};
export const applyMarginDefault = (
  intersect: Iintersect[],
  location: {
    location: string;
    visioConf: boolean;
  },
  duration: number,
) => {
  const result: Iintersect[] = intersect
    .map((item) => ({
      start: moment(item.start).add(5, 'minutes').toDate(),
      end: moment(item.end).subtract(5, 'minutes').toDate(),
      duration: Math.abs(
        moment(moment(item.start).add(5, 'minutes').toDate()).diff(
          moment(item.end).subtract(5, 'minutes').toDate(),
        ),
      ),
    }))
    .filter((item) => item.duration >= duration);
  return result;
};
