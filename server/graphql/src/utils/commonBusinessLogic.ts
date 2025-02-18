/* eslint-disable @typescript-eslint/ban-types */
import * as msal from '@azure/msal-node';
import {OAuth, OAuthOutlookAccount, PrismaClient} from '@prisma/client';
import * as cheerio from 'cheerio';
import fs from 'fs';
import * as handleBars from 'handlebars';
import moment from 'moment';
import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import readline from 'readline';
import {adminEmail, adminPassword, EmailTemplateStaticFilesPaths, msalConfiguration,} from '../configs/config';
import {OutLookClient} from '../mail/outlook/outlookClient';
import {GraphError, NotFoundError} from '../schema/graphql/errors';
import {O_AUTH_TOKEN_NOT_FOUND, WrongValueError} from '../schema/graphql/errors/common';
import {
  O_AUTH_TOKEN_NOT_FOUND_ERROR_MESSAGE,
  OUTLOOK_OAUTH_ACCOUNT_NOT_FOUND_MESSAGE,
  RECIPIENTS_VALUE_ERROR,
  USER_NOT_FOUND_ERROR_MESSAGE,
} from '../schema/graphql/errors/messages';
import {Context} from '../types/contextType';
import {
  EmailAddress,
  EmailValue,
  ISendMEmail,
  MSEventInput,
  OAuth2Client,
  OutlookEvent,
  OutlookEventValue,
  OutlookSchedule,
  SlotProps,
} from '../types/types';
import {EntityTypes, GraphErrorTypes, NotificationTypes, RedisHashKeys, TemplateNames,} from './constants';
import {buildIntersect, buildOutlookScheduleInfo, eventExists, Iintersect, slotsFromEvents,} from './utils';
import {sendNotificationPush} from './firebase';
import {handleReAuth} from "./handleReAuth";
import crypto = require('crypto');

require('isomorphic-fetch');

const TOKEN_PATH = 'token.json';

const appScopes = [
  'openid',
  'email',
  'offline_access',
  'profile',
  'User.Read',
  'MailboxSettings.Read',
  'Calendars.Read',
  'Calendars.ReadWrite',
  'Mail.Read',
  'User.Read.All',
  'Calendars.ReadWrite.Shared',
  'Mail.Send',
  'Group.ReadWrite.All',
  'User.ReadWrite',
  'User.ReadWrite.All',
  'Contacts.Read',
  'Contacts.ReadWrite',
  'Place.Read.All',
  'People.Read',
  'People.Read.All',
];

const SCOPES = [
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/gmail.send',
];

export const generateAccessToken = (value = 256) => crypto.randomBytes(value).toString('hex');

export const getAccessTokenAsync = async (
  oAuth: OAuth & { oAuthOutlookAccount: OAuthOutlookAccount | null },
  ctx: Context,
) => {
  const expireTime = oAuth.tokenExpiryDateTime;
  console.log('Enter in get access token async');

  if (expireTime !== null) {
    // Get expiration time - 5 minutes
    // If it's <= 5 minutes before expiration, then refresh
    const expire = moment(expireTime).subtract(5, 'minutes');
    const now = moment();
    console.log('before', now.isSameOrAfter(expire));

    if (now.isSameOrAfter(expire)) {
      // Expired, refresh
      console.log('Refreshing token');
      const refreshToken = oAuth.refreshToken || '';
      console.log(`Refresh token: ${refreshToken}`);
      try {
        const result = await ctx.outLookClient.msalClient?.acquireTokenByRefreshToken({
          refreshToken,
          scopes: appScopes,
          authority: msalConfiguration.authority,
        });

        if (result) {
          console.log('there is a result', result.authority);

          const { accessToken, expiresOn } = result;
          if (result.account) {
            await ctx.prisma.oAuth.update({
              where: { id: oAuth.id },
              data: {
                oAuthOutlookAccount: {
                  upsert: { update: { ...result.account }, create: { ...result.account } },
                },
                token: accessToken,
                tokenExpiryDateTime: expiresOn,
              },
            });
          } else {
            await ctx.prisma.oAuth.update({
              where: { id: oAuth.id },
              data: {
                token: accessToken,
                tokenExpiryDateTime: expiresOn,
              },
            });
          }
          return accessToken || '';
        }
      } catch (error: any) {
        console.log('******************', error);

        if (error.errorCode)
        if (error.errorCode === GraphErrorTypes.INVALID_GRANT) {
          if (ctx.currentUser?.oauthStatus === "ACTIVE") await handleReAuth(error, ctx.currentUser, ctx.prisma);
            if (oAuth.oAuthOutlookAccount) {
              const result = await ctx.outLookClient?.msalClient.acquireTokenSilent({
                account: {
                  ...oAuth.oAuthOutlookAccount,
                  name: oAuth.oAuthOutlookAccount.name ? oAuth.oAuthOutlookAccount.name : undefined,
                  idTokenClaims: oAuth.oAuthOutlookAccount.idTokenClaims
                    ? (oAuth.oAuthOutlookAccount.idTokenClaims as Object)
                    : undefined,
                },
                scopes: appScopes,
              });
              if (result) {
                return result.accessToken;
              }
            } else
              throw new NotFoundError(
                OUTLOOK_OAUTH_ACCOUNT_NOT_FOUND_MESSAGE,
                '',
                '',
                EntityTypes.OUTLOOK_OAUTH_ACCOUNT,
              );
          } else throw new GraphError(error.errorCode, error.errorMessage, EntityTypes.O_AUTH);
      }
    } else {
      console.log('not expired');
    }

    // Not expired, just return saved access token
    const accessToken = oAuth.token || '';
    return accessToken;
  }
  return '';
};

export const getGoogleToken = async (oAuth2Client: any, callback: any) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err: any, token: string) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token || '{}');
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err: any) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
};

export const findUserOAuth = async (userId: string, ctx: Context) => {
  const OAuthTokens = await ctx.prisma.oAuth.findMany({
    where: {
      userId,
    },
    include: { oAuthOutlookAccount: true },
  });

  if (!OAuthTokens.length)
    throw new NotFoundError(
      O_AUTH_TOKEN_NOT_FOUND_ERROR_MESSAGE,
      'userId',
      ctx.userId,
      EntityTypes.O_AUTH,
      O_AUTH_TOKEN_NOT_FOUND,
    );

  return OAuthTokens;
};

export const buildEmail = (
  subject: string,
  toRecipients: string[],
  template: string,
  params?: Object,
  from?: string,
  ccRecipients?: string[],
  replyTo?: string[],
  bccRecipients?: string[],
  content?: string,
): ISendMEmail => {
  if (!toRecipients.length) throw new WrongValueError(RECIPIENTS_VALUE_ERROR, 'toRecipients', 0);

  return {
    from: from ? { emailAddress: { name: from, address: from } } : undefined,
    subject,
    template,
    toRecipients: toRecipients.map(
      (toRecipient): EmailAddress => {
        return { emailAddress: { name: toRecipient, address: toRecipient } };
      },
    ), // To verify
    ccRecipients:
      ccRecipients && ccRecipients.length
        ? ccRecipients.map(
            (ccRecipient): EmailAddress => {
              return { emailAddress: { name: ccRecipient, address: ccRecipient } };
            },
          )
        : undefined, // To verify
    bccRecipients:
      bccRecipients && bccRecipients.length
        ? bccRecipients.map(
            (bccRecipient): EmailAddress => {
              return { emailAddress: { name: bccRecipient, address: bccRecipient } };
            },
          )
        : undefined, // To verify
    replyTo:
      replyTo && replyTo.length
        ? replyTo.map(
            (bccRecipient): EmailAddress => {
              return { emailAddress: { name: bccRecipient, address: bccRecipient } };
            },
          )
        : undefined, // To verify
    params,
    body: {
      content: content || '',
      contentType: 'html',
    },
  };
};

// MSAL config
const msalConfig: msal.Configuration = {
  auth: {
    clientId: process.env.OAUTH_APP_ID || '',
    authority: process.env.OAUTH_AUTHORITY
      ? process.env.OAUTH_AUTHORITY.replace('common', process.env.OUTLOOK_ADMIN_TENANT_ID || '')
      : '',
    clientSecret: process.env.OAUTH_APP_SECRET,
  },
  system: {
    loggerOptions: {
      loggerCallback(loglevel, message, containsPii) {
        console.log(message);
      },
      piiLoggingEnabled: false,
      logLevel: msal.LogLevel.Verbose,
    },
  },
};

/**
 * @description get the ms AAD admin for anonymous service, ex: sending email anonymously
 * @param ctx
 * @returns
 */
export const getAdminToken = async () => {
  try {
    const msalClient = new msal.PublicClientApplication(msalConfig);

    if (msalClient && adminEmail && adminPassword) {
      const token = await msalClient.acquireTokenByUsernamePassword({
        username: adminEmail,
        password: adminPassword,
        scopes: ['Mail.Send', 'Calendars.ReadWrite.Shared'],
      });
      return token ? token.accessToken : null;
    }
  } catch (error: any) {
    console.log('error on get admin token', error.message);
  }
};

// Get free slots
export const getFreeSlots = (start: string, end: string, events: SlotProps[]) => {
  const freeSlots: SlotProps[] = [];

  let rootStart = new Date(start);
  const rootEnd = new Date(end);
  if (!events.length) {
    freeSlots.push({
      start: rootStart,
      end: rootEnd,
      duration: moment(end).diff(moment(start), 'minutes'),
    });
  }

  events.forEach((event) => {
    if (moment(rootStart).isBefore(event.start)) {
      freeSlots.push({
        start: rootStart,
        end: event.start,
        duration: moment(event.start).diff(rootStart, 'minutes'),
      });
      rootStart = event.end;
    } else if (moment(rootStart).isBefore(event.end)) {
      rootStart = event.end;
    }
  });

  if (moment(rootStart).isBefore(rootEnd)) {
    freeSlots.push({
      start: rootStart,
      end: rootEnd,
      duration: moment(rootEnd).diff(moment(rootStart), 'hours'),
    });
  }

  return freeSlots;
};

export const buildSlotFromOutlookEvent = (events: OutlookEvent): SlotProps[] => {
  return events.value && events.value.length
    ? events.value.map((event) => {
        return {
          end: moment.utc(event.start.dateTime).toDate(),
          start: moment.utc(event.end.dateTime).toDate(),
          duration: moment(event.end.dateTime).diff(event.start.dateTime),
        };
      })
    : [];
};

export const buildSlotFromScheduleResult = (schedule: OutlookSchedule): SlotProps[][] => {
  const slots: SlotProps[][] = [];

  if (schedule.value && schedule.value.length) {
    schedule.value.map((value) => {
      if (value.scheduleItems) {
        const slotPerUser: SlotProps[] = [];
        value.scheduleItems.map((scheduleItem) => {
          console.log('build debut ===>', scheduleItem.start.dateTime);
          console.log('build end ===>', scheduleItem.end.dateTime);

          slotPerUser.push({
            start: moment.utc(scheduleItem.start.dateTime).toDate(),
            end: moment.utc(scheduleItem.end.dateTime).toDate(),
            duration: moment(scheduleItem.end.dateTime).diff(
              scheduleItem.start.dateTime,
              'minutes',
            ),
          });
        });

        slots.push(slotPerUser);
      } else {
        slots.push([]);
      }
      // throw new Error('test');
    });
  }

  console.log('SLOTS ========++>', slots);

  return slots;
};

export const sendCommonNewMessage = (message: ISendMEmail, sendEmailFn: Function, lang: string = 'en'): Promise<any> => {
  return new Promise((resolve, reject) => {
    const handlebarOptions = {
      viewEngine: {
        extName: '.hbs',
        partialsDir: `./src/views/${lang}`,
        layoutsDir: `./src/views/${lang}/layouts`,
        defaultLayout: 'layout', // set this one empty and provide your template below,
      },
      viewPath: `./src/views/${lang}`,
      extName: '.hbs',
    };

    const transport = {
      name: 'minimal',
      version: '0.1.0',
      send: async (mail: any, callback: any) => {
        try {
          const template = handleBars.compile(mail.data.html);
          const response = await sendEmailFn(mail); // Await and get the response from sendGmailMail

          console.log(
              'Email successfully sent to ',
              message.toRecipients?.map((rec) => rec.emailAddress.address),
          );
          callback(null, response);
          resolve(response);  // Resolve the promise with the response from Gmail
        } catch (error) {
          console.error('Failed to send email:', error);
          callback(error);
          reject(error);  // Reject the promise with the error
        }
      },
    };

    const mailOptions = {
      template: message.template, // this is the template of your hbs file
      subject: message.subject,
      context: message.params,
      // to: message.toRecipients?.map((rec) => rec.emailAddress.address),
      // from: message.from,
      // replyTo: message.replyTo,
      // cc: message.ccRecipients?.map((rec) => rec.emailAddress.address),
      // bcc: message.bccRecipients?.map((rec) => rec.emailAddress.address),
    };

    const transporter = nodemailer.createTransport(transport);
    transporter.use('compile', hbs(handlebarOptions));

    transporter.sendMail(mailOptions, (error: any, info: any) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);  // Resolve with the info from Nodemailer if applicable
      }
    });
  });
};


export const getOutlookAvailableTimes = (
  slots: SlotProps[][],
  start: Date | string,
  end: Date | string,
) => {
  const availableTimes: SlotProps[][] = [];
  slots.map((slot) => {
    const freeSlots = slotsFromEvents(slot, start, end);
    availableTimes.push(freeSlots);
  });

  return availableTimes;
};
export const getOutlookAvailableTimesForOneUsers = async (
  debut: Date,
  fin: Date,
  email: string,
  accessToken: string,
  ctx: Context,
) => {
  const scheduleInformation = buildOutlookScheduleInfo(
    debut,
    fin,
    email,
    [],
    Math.abs(moment(debut).diff(fin, 'minutes')),
  );
  console.log('scheduleInformation:', scheduleInformation);
  const schedules = await ctx.outLookClient.getFreeBusyTimes(accessToken, scheduleInformation);
  const slots = buildSlotFromScheduleResult(schedules);
  console.log('test=', slots);

  const freeSlots = getOutlookAvailableTimes(slots, debut, fin);
  console.log('FREE SLOTS :', freeSlots);

  const intersect = buildIntersect(freeSlots);
  console.log('intersect', intersect);

  return intersect;
};

export const getOutlookIntersect = async (
  userInvited:
    | ({
        email: string;
        required: boolean;
      } | null)[]
    | null
    | undefined,
  debut: Date,
  fin: Date,
  duration: number,
  email: string,
  ctx: Context,
  UTC: number,
) => {
  const currentUser = await ctx.prisma.user.findUnique({ where: { email } });

  if (!currentUser)
    throw new NotFoundError(USER_NOT_FOUND_ERROR_MESSAGE, 'email', email, EntityTypes.USER);

  const OAuthTokens = await findUserOAuth(currentUser.id, ctx);
  const accessToken = await getAccessTokenAsync(OAuthTokens[0], ctx);
  let allEventReserved: SlotProps[] = [];
  console.log('FROM GET OUTLOOK INTERSECT', debut, fin);

  const scheduleInformation = buildOutlookScheduleInfo(
    debut,
    fin,
    email,
    userInvited && userInvited.length
      ? userInvited.map((user) => {
          if (user) {
            return user.email;
          }
          return '';
        })
      : [],
    duration,
  );
  console.log('INFO ===>', scheduleInformation);

  const now = new Date().toISOString();
  // const updatedDebut = moment
  //   .utc(debut)
  //   .utcOffset(+UTC, true)
  //   .toDate();
  // const updateFin = moment
  //   .utc(fin)
  //   .utcOffset(+UTC, true)
  //   .toDate();
  // const schedule = await ctx.prisma.shedule.findMany({
  //   where: {
  //     AND: [
  //       { email: currentUser.email || '' },
  //       {
  //         OR: [{ status: ScheduleStatus.PENDING }, { status: SheduleStatus.RESCHEDULING_PENDING }],
  //       },
  //       { NOT: { OR: [{ debut: { gte: updateFin } }, { fin: { lte: updatedDebut } }] } },
  //       { reservationExpirationDate: { gte: now } },
  //     ],
  //   },
  //   orderBy: {
  //     debut: 'desc',
  //   },
  // });

  // if (schedule && schedule.length) {
  //   const eventsReserved = [...schedule.map((item) => JSON.parse(item.reservedSlot))];
  //   console.log('event reserved====>', eventsReserved);

  //   if (eventsReserved.length > 0) {
  //     allEventReserved.push(...eventsReserved[0]);
  //     allEventReserved = allEventReserved.map((item) => ({
  //       start: moment.utc(moment.utc(item.start).toDate()).utcOffset(-UTC, true).toDate(),
  //       end: moment.utc(moment.utc(item.end).toDate()).utcOffset(-UTC, true).toDate(),
  //       duration: Math.abs(
  //         moment(moment.utc(item.end).utcOffset(-UTC, true).toDate()).diff(
  //           moment.utc(item.start).utcOffset(-UTC, true).toDate(),
  //         ),
  //       ),
  //     }));
  //   }
  // }

  const schedules = await ctx.outLookClient.getFreeBusyTimes(accessToken, scheduleInformation);
  console.log('SCHEDULES', JSON.stringify(schedules));
  console.log(
    '---->!:',
    schedules.value[0].scheduleItems?.map((item) => item.end),
  );
  const slots = buildSlotFromScheduleResult(schedules);
  console.log('test=', slots);

  const freeSlots = getOutlookAvailableTimes([...slots], debut, fin);
  console.log('FREE SLOTS :', freeSlots);

  const intersect = buildIntersect(freeSlots);
  console.log('intersect', intersect);

  return intersect;
};

/**
 *
 * @param content
 * @param start
 * @param end
 * @param subject
 * @param location
 * @param recipients
 * @param isReminderOn
 * @param reminderMinutesBeforeStart
 * @param capacity
 * @param isOnlineMeeting
 * @param ctx
 * @param id
 * @param selectedRoom
 * @param creatorUserId
 * @returns
 * @example
 *       const event = {
 subject: "Let's go for lunch",
 body: {
 contentType: 'HTML',
 content: 'Does noon work for you?',
 },
 start: {
 dateTime: '2021-07-09T13:00:00',
 timeZone: 'UTC',
 },
 end: {
 dateTime: '2021-07-09T14:00:00',
 timeZone: 'UTC',
 },
 location: {
 displayName: "Harry's Bar",
 },
 attendees: [
 {
 emailAddress: {
 address: 'Michelr@yesbossassistants.onmicrosoft.com',
 name: 'Samantha Booth',
 },
 type: 'required',
 },
 ],
 allowNewTimeProposals: true,
 // transactionId: '7E163156-7762-4BEB-A1C6-729EA81755A7',
 };

 */
export const buildMSEventInput = async (
  content: string,
  start: string,
  end: string,
  subject: string,
  location: string,
  recipients: {
    email: string;
    responded: boolean;
    required: boolean;
  }[],
  isReminderOn: boolean,
  reminderMinutesBeforeStart: number,
  capacity: number,
  isOnlineMeeting?: boolean,
  ctx?: Context,
  id?: string,
  selectedRoom?: string,
  creatorUserId?: string,
): Promise<MSEventInput> => {
  console.log('====---====selectedRoom:', selectedRoom)

  let room: { emailAddress: { address: string; name: string }; type: string }[] = [];
  let addressEvent: {
    street: string;
    city: string;
    state: string;
    countryOrRegion: string;
    postalCode: string;
  } | null = null;
  if (ctx && ctx.currentUser && capacity >= 0 && location.length) {

    if (capacity >= 0) {
      // const stockedRoom = await ctx.prisma.room.findFirst({ where: { address } });
      // console.log('stockedRoom:===>', JSON.stringify(stockedRoom));
      console.log('===========selectedRoom:', selectedRoom)
      if (selectedRoom) {
        const OAuthTokens = await findUserOAuth(creatorUserId || ctx.currentUser.id, ctx);
        const accessToken = await getAccessTokenAsync(OAuthTokens[0], ctx);
        const rooms = await ctx.outLookClient.getRooms(accessToken, selectedRoom);
        console.log('=========rooms:', rooms);

        if (rooms) {
          const scheduleInformation = buildOutlookScheduleInfo(
            start,
            end,
            rooms[0].resourceEmail || '',
            [],
            Math.abs(moment(new Date(start)).diff(new Date(end), 'minutes')),
          );

          const schedules = await ctx.outLookClient.getFreeBusyTimes(
            accessToken,
            scheduleInformation,
          );

          // console.log(
          //   'available:',
          //   schedules.value.filter((item) => item.scheduleItems && item.scheduleItems.length === 0),
          // );
          const res = schedules.value.filter(
            (item) => item.scheduleItems && item.scheduleItems.length === 0,
          );
          if (res.length === 0) {
            await sendNotificationPush(
              ctx.currentUser?.lang === 'fr' ? 'Recherche Salle': 'Room Search',
                ctx.currentUser?.lang === 'fr' ? `YesBoss indique que la salle séléctionnée est indisponible` : `YesBoss indicates that the selected room is unavailable`,
              ctx.currentUser.email || '',
              { scheduleId: id, type: NotificationTypes.ROOM },
            );
          }
        }

        if (rooms && rooms.length > 0) {
          addressEvent = rooms[0].address;
          room = [
            {
              emailAddress: {
                address: rooms[0].resourceEmail || '',
                name: rooms[0].resourceEmail || '',
              },
              type: 'resource',
            },
          ];
          console.log('room:', room);
        }
      }
    }
  }
  const attendees = [
    ...recipients.map((recipient) => {
      return {
        emailAddress: {
          address: recipient.email,
          name: recipient.email,
        },
        //type: 'resource',
        type: recipient.required ? 'required' : 'optional',
      };
    }),
    ...room,
  ];

  console.log('attendees:', attendees);
  const message: MSEventInput = {
    attendees,
    body: { content, contentType: 'html' },
    start: {
      dateTime: start,
      timeZone: 'UTC',
    },
    end: {
      dateTime: end,
      timeZone: 'UTC',
    },
    location: {
      displayName: capacity >= 0 ? location.split('(')[0] : location,
      locationType: room.length ? 'conferenceRoom' : 'default',
      locationEmailAddress: room.length ? room[0].emailAddress.address : '',
      address: addressEvent,
    },
    subject,
    allowNewTimeProposals: true,
    isOnlineMeeting,
    isReminderOn,
    reminderMinutesBeforeStart,
  };
  return message;
};

export const MSRemoveEvent = async (
  accessToken: string,
  begin: Date,
  end: Date,
  outLookClient: OutLookClient,
  level: string[],
  ctx: Context,
) => {
  console.log('MS REMOVE EVENT', begin, end);
  const { redis, prisma, currentUser } = ctx;
  const events = await outLookClient.getEventsList(accessToken, { begin, end });

  const allEventsToDelete: OutlookEventValue[] = [];

  if (!events.value.length) {
    console.log('there are no events to remove');
    return [];
  }
  for (const lev of level) {
    for (const item of events.value) {
      const event = await ctx.prisma.shedule.findFirst({ where: { eventId: item.id } });
      console.log('event from prisma:', event);

      if (event && event.niveau.toLowerCase() === lev.toLowerCase()) {
        await redis.hdel(RedisHashKeys.TIME_SLOTS, event.id);
        allEventsToDelete.push(item);
      }
    }
  }

  if (!allEventsToDelete.length) {
    console.log('there are no events to delete into the array');
    return [];
  }

  for (const event of allEventsToDelete) {
    try {
      await outLookClient.removeEvent(accessToken, event.id);
      const schedule = await ctx.prisma.shedule.findFirst({ where: { eventId: event.id } });

      if (schedule) {
        const language = schedule.lang || currentUser.lang || 'en'
        const emailMessage = buildEmail(
            (language === 'fr' ? 'Annulation de rendez-vous : ' : 'Meeting cancellation: ') + schedule.objet,
          currentUser && currentUser.email
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
            firstname: currentUser.firstName,
            userName: currentUser
              ? buildUserName(currentUser.firstName, currentUser.lastName)
              : buildUserName(schedule.email, ''),
            date: moment(schedule.acceptedSlot).format('DD/MM/YYYY'),
            heur: moment(schedule.acceptedSlot).format('HH:mm'),
            ...EmailTemplateStaticFilesPaths,
          },
        );

        await ctx.outLookClient.sendNewMessage(accessToken, emailMessage);
        await prisma.shedule.update({ where: { id: schedule.id }, data: { acceptedSlot: null } });
      }
    } catch (error) {
      console.log('error while deleting event of id', event.id, error);
    }
  }

  return allEventsToDelete.map((event) => event.id);
};

export const MSLocationVerification = async (
  accessToken: string,
  intersects: Iintersect[],
  location: {
    location: string;
    visioConf: boolean;
  },
  duration: number,
  margin: number,
  ctx: Context,
  email: string,
) => {
  const intersections: Iintersect[] = [];

  console.log('intersects', intersects);

  for (const intersect of intersects) {
    let { start, end } = intersect;

    const eventBeforeInformation = buildOutlookScheduleInfo(
      moment(start).subtract(margin, 'minutes').toDate(),
      start,
      email,
      [],
      moment(start).diff(moment(start).subtract(margin, 'minutes'), 'minutes'),
    );

    const eventBefore = await ctx.outLookClient.getFreeBusyTimes(
      accessToken,
      eventBeforeInformation,
    );

    if (eventExists(eventBefore)) {
      if (
        location.location === 'Aucune localisation' &&
        eventBefore.value[0].scheduleItems &&
        eventBefore.value[0].scheduleItems.length &&
        eventBefore.value[0].scheduleItems[0].location.toLowerCase().includes('visioconférence')
      ) {
        start = moment(start).add(5, 'minutes').toDate();
      } else {
        start = moment(start).add(margin, 'minutes').toDate();
      }
    }
    const eventAfterInformation = buildOutlookScheduleInfo(
      end,
      moment(end).add(margin, 'minutes').toDate(),
      email,
      [],
      moment(moment(end).add(margin, 'minutes')).diff(end, 'minutes'),
    );
    const eventAfter = await ctx.outLookClient.getFreeBusyTimes(accessToken, eventAfterInformation);
    if (eventExists(eventAfter)) {
      if (
        location.location === 'Aucune localisation' &&
        eventAfter.value[0].scheduleItems &&
        eventAfter.value[0].scheduleItems.length &&
        eventAfter.value[0].scheduleItems[0].location.toLowerCase().includes('visioconférence')
      ) {
        end = moment(end).subtract(5, 'minutes').toDate();
      } else {
        end = moment(end).subtract(margin, 'minutes').toDate();
      }
    }

    intersections.push({ start, end, duration: moment(end).diff(start, 'minutes') });
  }
  return intersections.filter((intersection) => intersection.duration >= duration);
};

export const getAccessTokenAsyncWithoutCtx = async (
  oAuth: OAuth & { oAuthOutlookAccount: OAuthOutlookAccount | null },
  prisma: PrismaClient,
  outLookClient: OutLookClient,
) => {
  const expireTime = oAuth.tokenExpiryDateTime;
  console.log('Enter in get access token async');

  if (expireTime !== null) {
    // Get expiration time - 5 minutes
    // If it's <= 5 minutes before expiration, then refresh
    const expire = moment(expireTime).subtract(5, 'minutes');
    const now = moment();

    if (now.isSameOrAfter(expire)) {
      // Expired, refresh
      console.log('Refreshing token');
      const refreshToken = oAuth.refreshToken || '';
      console.log(`Refresh token: ${refreshToken}`);
      try {
        console.log('enter in try');

        const result = await outLookClient.msalClient?.acquireTokenByRefreshToken({
          refreshToken,
          scopes: appScopes,
          authority: msalConfiguration.authority,
        });

        if (result) {
          const { accessToken, expiresOn } = result;
          if (result.account) {
            await prisma.oAuth.update({
              where: { id: oAuth.id },
              data: {
                oAuthOutlookAccount: {
                  upsert: { update: { ...result.account }, create: { ...result.account } },
                },
                token: accessToken,
                tokenExpiryDateTime: expiresOn,
              },
            });
          } else {
            await prisma.oAuth.update({
              where: { id: oAuth.id },
              data: {
                token: accessToken,
                tokenExpiryDateTime: expiresOn,
              },
            });
          }
          return accessToken || '';
        }
      } catch (error: any) {
        if (error.errorCode)
          if (error.errorCode === GraphErrorTypes.INVALID_GRANT) {
            console.log(error);
            if (oAuth?.id){
              const userOauth = await prisma.oAuth.findFirst({
                where: { id: oAuth.id },
              });
              if (!userOauth) {
                console.log("no user found for oAuth");
                throw new NotFoundError(
                    OUTLOOK_OAUTH_ACCOUNT_NOT_FOUND_MESSAGE,
                    '',
                    '',
                    EntityTypes.OUTLOOK_OAUTH_ACCOUNT,
                    );
              }
              const user = await prisma.user.findFirst({
                where: { id: userOauth.userId },
                });
              if (!user) {
                console.log("no user found for oAuth");
                throw new NotFoundError(
                    USER_NOT_FOUND_ERROR_MESSAGE,
                    '',
                    '',
                    EntityTypes.USER,
                    );
              }
              if (user?.oauthStatus === "ACTIVE") await handleReAuth(error, user, prisma);
            } else {
              console.log("no id found for oAuth");
              throw new NotFoundError(
                OUTLOOK_OAUTH_ACCOUNT_NOT_FOUND_MESSAGE,
                '',
                '',
                EntityTypes.OUTLOOK_OAUTH_ACCOUNT,
              );
            }


            if (oAuth.oAuthOutlookAccount) {
              const result = await outLookClient?.msalClient.acquireTokenSilent({
                account: {
                  ...oAuth.oAuthOutlookAccount,
                  name: oAuth.oAuthOutlookAccount.name ? oAuth.oAuthOutlookAccount.name : undefined,
                  idTokenClaims: oAuth.oAuthOutlookAccount.idTokenClaims
                    ? (oAuth.oAuthOutlookAccount.idTokenClaims as Object)
                    : undefined,
                },
                scopes: appScopes,
              });
              if (result) {
                return result.accessToken;
              }
            } else
              throw new NotFoundError(
                OUTLOOK_OAUTH_ACCOUNT_NOT_FOUND_MESSAGE,
                '',
                '',
                EntityTypes.OUTLOOK_OAUTH_ACCOUNT,
              );
          } else throw new GraphError(error.errorCode, error.errorMessage, EntityTypes.O_AUTH);
      }
    }

    // Not expired, just return saved access token
    const accessToken = oAuth.token || '';
    return accessToken;
  }
  return '';
};

export const checkTokenValidityWithoutCtx = async (
  expiry_date: Date,
  oAuth2Client: OAuth2Client,
  email: string,
  refreshToken: string,
  prisma: PrismaClient,
  token: string,
) => {
  const now = moment(new Date()).add(15, 'minutes').toDate();
  console.log(
    `now:${moment(now).format('dddd Do HH:mm')}-expiry_date:${moment(expiry_date).format(
      'dddd Do HH:mm',
    )}`,
    moment(now).isAfter(expiry_date),
  );
  if (moment(expiry_date).isAfter(now)) {
    return token;
  }

  oAuth2Client.setCredentials({ refresh_token: refreshToken });
  const new_token = await oAuth2Client.getAccessToken();
  oAuth2Client.setCredentials({ access_token: new_token.token });

  if (new_token.res) {
    // p1
    console.log("Invalid-tocken-checker P1: in communbusnlogic line 1053", new_token.res.data.refresh_token);
    console.log("Invalid-tocken-checker P1: in communbusnlogic line new_token ", new_token);
    await prisma.oAuth.update({
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

export const checkSlotAvailability = async (
  slots: { start: Date; end: Date; available?: boolean }[],
  prisma: PrismaClient,
  id: string,
) => {
  const tokenSlots = [];
  // These comments represent the old logic of the algorithm used to determine slot availability.

  // for (const slot of slots) {
  //   const schedules = await prisma.shedule.findMany({
  //     where: { status: 'ACCEPTED', acceptedSlot: { gte: slot.start, lte: slot.end }, userId: id },
  //   });

  //   if (schedules.length) {
  //     tokenSlots.push({ ...slot, available: false });
  //   } else {
  //     tokenSlots.push({ ...slot, available: true });
  //   }
  // }

  const schedules = await prisma.shedule.findMany({
    where: { status: 'ACCEPTED', userId: id },
  });

  if (schedules.length) {
    const schedulesTimes = schedules.map((schedule) => ({
      start: moment(schedule.acceptedSlot).toDate(),
      end: moment(schedule.acceptedSlot).add(schedule.duration, 'minutes').toDate(),
    }));

    for (const slot of slots) {
      const isInside = schedulesTimes.some(
        (scheduleTime) =>
          moment(scheduleTime.start).isBetween(slot.start, slot.end, undefined, '[]') ||
          moment(scheduleTime.end).isBetween(slot.start, slot.end, undefined, '[]'),
      );

      tokenSlots.push({ ...slot, available: isInside ? false : true });
    }
  } else {
    tokenSlots.push(...slots);
  }

  return tokenSlots;
};

export const buildMS_MLEmails = (outlookEmails: EmailValue[]) => {
  const MS_MLEmails = [];

  for (const email of outlookEmails) {
    const str = cheerio.load(
      email.body.content
        .replace(/<p(.|\n)*?>/g, '\n')
        .replace(/<li(.|\n)*?>/g, '\n')
        .replace(/<br>/gi, '\\n')
        .replace(/\xa0/gi, ' '),
    );
    const buff = Buffer.from(str.text());
    console.log('Buff:', str.text());

    const htmlBody = Buffer.from(email.body.content);
    MS_MLEmails.push({
      sender: {
        emailAddress:
          (email &&
            email.sender &&
            email.sender.emailAddress &&
            email.sender.emailAddress.address) ||
          '',
        name:
          email && email.sender && email.sender.emailAddress && email.sender.emailAddress.name
            ? email.sender.emailAddress.name
            : email.sender.emailAddress.address
            ? email.sender.emailAddress.address
            : '',
      },
      recipients: email.toRecipients.length
        ? email.toRecipients.map((recipient) => {
            if (recipient && recipient.emailAddress) {
              return recipient.emailAddress.address;
            }
          })
        : [],
      cc:
        email.ccRecipients && email.ccRecipients.length
          ? email.ccRecipients.map((cc) => {
              if (cc) return cc.emailAddress.address;
            })
          : [],
      object: email.subject || '',
      content: buff.toString('base64') || '',
      id: email.id || '',
      isRead: email.isRead || true,
      receivedDateTime: email.receivedDateTime || '', //"moment(new Date()).subtract(3, 'hours').toISOString()",
      subject: email.subject || '',
      htmlBody: htmlBody.toString('base64'),
    });
  }
  return MS_MLEmails;
};

export const buildUserName = (firstName?: string | null, lastName?: string | null) => {
  const name = `${lastName || ''}${firstName ? ` ${firstName}` : ''}`;
  return {
    fullName: name.length ? name : 'N/A',
    partialName: lastName || firstName || 'N/A',
  };
};
export const checkOutlookAvailabilityRoom = async (
  ctx: Context,
  mail: string,
  start: string,
  end: string,
  location: string,
) => {
  console.log('email:', mail);

  const { prisma } = ctx;
  const currentUser = await prisma.user.findUnique({ where: { email: mail } });
  if (!currentUser) {
    throw new NotFoundError(USER_NOT_FOUND_ERROR_MESSAGE, 'email', mail, '', EntityTypes.SCHEDULE);
  }
  const room = await prisma.room.findFirst({ where: { generateResourceName: location } });

  console.log('room:', room);

  const OAuthTokens = await findUserOAuth(currentUser.id, ctx);
  const accessToken = await getAccessTokenAsync(OAuthTokens[0], ctx);
  if (room) {
    const duration = Math.abs(moment(new Date(start)).diff(new Date(end), 'minutes'));
    const scheduleInformation = buildOutlookScheduleInfo(
      start,
      end,
      room.resourceEmail || '',
      [],
      Math.abs(moment(new Date(start)).diff(new Date(end), 'minutes')),
    );

    const schedules = await ctx.outLookClient.getFreeBusyTimes(accessToken, scheduleInformation);

    console.log(
      'available:',
      schedules.value.filter((item) => item.scheduleItems && item.scheduleItems.length === 0),
    );
    const res = schedules.value.filter(
      (item) => item.scheduleItems && item.scheduleItems.length === 0,
    );
    return res.length === 0;
  }

  return true;
};
