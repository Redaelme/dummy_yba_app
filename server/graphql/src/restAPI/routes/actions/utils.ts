import { PrismaClient } from '@prisma/client';
import { NextFunction, Response } from 'express';
import { google } from 'googleapis';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import {
  credentials,
  EmailTemplateStaticFilesPaths,
  JWT_SECRET,
  serverConfiguration,
} from '../../../configs/config';
import { configureRedis } from '../../../configs/redis';
import { GoogleClient } from '../../../mail/google/googleClient';
import { OutLookClient } from '../../../mail/outlook/outlookClient';
import { InvalidTokenError, NotFoundError } from '../../../schema/graphql/errors';
import {
  O_AUTH_TOKEN_NOT_FOUND,
  SLOT_NOT_FOUND,
  UnauthorizedError,
  USER_NOT_FOUND,
} from '../../../schema/graphql/errors/common';
import { regleDeGestion } from '../../../schema/graphql/resolvers/Mutation/Google/regleDeGestion';
import { Context } from '../../../types/contextType';
import { ISendMEmail, OAuth2Client, ParsedSavedSlotsProps } from '../../../types/types';
import {
  buildEmail,
  buildUserName,
  checkSlotAvailability,
  checkTokenValidityWithoutCtx,
  getAccessTokenAsyncWithoutCtx,
} from '../../../utils/commonBusinessLogic';
import {
  AppointmentEntity,
  CTX_REGISTER,
  EntityTypes,
  NotificationTypes,
  RedisHashKeys,
  REMOVED_EVENTS,
  TemplateNames,
} from '../../../utils/constants';
import { CtxRegister } from '../../../utils/ctxRegisterr';
import { sendNotificationPush } from '../../../utils/firebase';
import { Register } from '../../../utils/Register';
import { rescheduling } from '../../../utils/Rescheduligng';
import {filterSlotProposal, getLocationTextTranslated} from '../../../utils/utils';
import {setViewsDirectory} from "../../index";

const _ = require('lodash');

const { redis } = configureRedis();

export const get2DArray = (
  response?: {
    email: string;
    slots: {
      start: string | Date;
      end: string | Date;
    }[];
  }[],
) => {
  if (response && response.length) {
    return response.map((res) => res.slots);
  }
  return [];
};

export const findUserOAuthWithoutCtx = async (
  prisma: PrismaClient,
  userId: string,
  next: NextFunction,
) => {
  const OAuth = await prisma.oAuth.findFirst({
    where: { userId },
    include: { oAuthOutlookAccount: true },
  });

  if (!OAuth) {
    const err = new NotFoundError(O_AUTH_TOKEN_NOT_FOUND, 'userId', userId, EntityTypes.O_AUTH);
    err.status = 404;
    next(err);
    throw err;
  }

  return OAuth;
};
export const updateSchedule = async (prisma: PrismaClient, id: string, eventId: string) => {
  try {
    await prisma.shedule.update({ data: { status: 'ACCEPTED', eventId }, where: { id } });
  } catch (error) {
    console.log('error while update schedule', error);
  }
};

export const proposeNewSlotsWithEmailSending = async (
  niveau: string,
  payloadValue: {
    id: string;
    subject: string;
    location: string;
    calendar: string;
    email: string;
    required: boolean;
    index: number;
    hasMoreChoices?: boolean;
    iterationNumber: number;
    reminder: string;
    lang?: string;
  },
  res: Response,
  next: NextFunction,
  ctx: Context,
  rescheduling: boolean,
) => {
  const { prisma } = ctx;

  const {
    id,
    subject,
    location: initialLocation,
    calendar,
    email,
    required,
    index,
    iterationNumber,
    reminder,
      lang
  } = payloadValue;

  const emailOfUser = id.split('-')[1];

  const user = await prisma.user.findFirst({ where: { email: emailOfUser } });

  if (!user) {
    const err = new NotFoundError(USER_NOT_FOUND, 'email', emailOfUser, EntityTypes.USER);
    err.status = 404;
    next(err);
    throw err;
  }
  let location = initialLocation;

    setViewsDirectory(lang || "en");
  const OAuth = await findUserOAuthWithoutCtx(prisma, user.id, next);

  const savedSlots = await redis.hget(RedisHashKeys.TIME_SLOTS, id);
  if (!savedSlots) {
    const err = new NotFoundError(SLOT_NOT_FOUND, 'id', id);
    err.status = 404;
    next(err);
    throw err;
  }

  try {
    let parsedSavedSlots: ParsedSavedSlotsProps = JSON.parse(savedSlots);
    location = parsedSavedSlots.location || location;

    // If asking user is required, cancel all confirmed slots and propose new ones
    if (required) {
      //Check shedule
      const sheduleData = await prisma.shedule.findUnique({ where: { id } });
      if (!sheduleData) {
        throw new Error('No Shedule found');
      }
      const UTC = sheduleData.GMT;
      let slotToSend = parsedSavedSlots.saved.map((item) => ({
        start: moment.utc(item.start).toDate(),
        end: moment.utc(item.end).toDate(),
      }));

      const { debut, fin, proposedSlots, id: sheduleID } = sheduleData;
      let proposedSlotData: {
        available: boolean;
        start: Date;
        end: Date;
      }[] = JSON.parse(proposedSlots);

      const slot = await filterSlotProposal(
        debut,
        fin,
        emailOfUser,
        slotToSend.map((slot) => {
          return { ...slot, available: true };
        }),
        ctx,
        UTC,
        id,
      );

      const slotsAvailability_Date = await checkSlotAvailability(
        slot.slotFiltered as { start: Date; end: Date; available?: boolean | undefined }[],
        prisma,
        user.id,
      );
      console.log({ slotsAvailability_Date });
      proposedSlotData.push(
        ...(slotsAvailability_Date as { start: Date; end: Date; available: boolean }[]),
      );
      await ctx.prisma.shedule.update({
        where: { id },
        data: {
          reservedSlot: JSON.stringify(slotsAvailability_Date),
          proposedSlots: JSON.stringify(proposedSlotData),
        },
      });
      let slotsAvailability = slotsAvailability_Date.map((item) => ({
        start: moment.utc(item.start).toISOString(),
        end: moment.utc(item.end).toISOString(),
        available: item.available,
      }));

      slotsAvailability = _.orderBy(slotsAvailability, 'start', 'asc');

      // .map((slot) => moment(slot.start).locale('fr').format('Do MMMM  HH:mm'));

      /*********************BEGIN OF LOGIC************************* */
      if (parsedSavedSlots.iterationNumber >= 2) {
        // throw new SlotProposalTrialExceededError(SLOT_PROPOSAL_TRIAL_EXCEEDED_ERROR_MESSAGE);
        const recipients = parsedSavedSlots.recipients
          .filter((recipient) => {
            if (recipient) {
              return recipient.email !== email;
            }
            return false;
          })
          .map((recipient) => {
            if (recipient) {
              return recipient.email;
            }
          });
          const language = lang || sheduleData.lang || user.lang || 'en'
          setViewsDirectory(language);
        const message: ISendMEmail = buildEmail(
          subject,
          recipients ? [...(recipients as string[]), emailOfUser] : [emailOfUser],
          TemplateNames.SLOT_PROPOSAL_COUNT_EXCEEDED,
          {
            userName: buildUserName(user.firstName, user.lastName),
              timezone: user.timezone,
              firstname: user.firstName,
            ...EmailTemplateStaticFilesPaths,
          },
        );
        if (user.mailService === 'MICROSOFT') {
          const outLookClient = new OutLookClient();

          const accessToken = await getAccessTokenAsyncWithoutCtx(OAuth, prisma, outLookClient);

          await outLookClient.sendNewMessage(accessToken, message);
        } else if (user.mailService === 'GOOGLE') {
          if (niveau === AppointmentEntity.HAUTE) {
          } else {
            const { client_id, redirect_uri, client_secret } = credentials;
            const googleClient = new GoogleClient();

            const oAuth2Client: OAuth2Client = new google.auth.OAuth2({
              clientId: client_id,
              clientSecret: client_secret,
              redirectUri: redirect_uri,
            });

            const verifiedToken = await checkTokenValidityWithoutCtx(
              OAuth.tokenExpiryDateTime || new Date(),
              oAuth2Client,
              user.email as string,
              OAuth.refreshToken || '',
              prisma,
              OAuth.token!,
            );

            oAuth2Client.setCredentials({ access_token: verifiedToken });


              const response = await googleClient.sendRealMessage(oAuth2Client, message, language);
              //updateSchedule(prisma, id);
              try {
                  const sentMessage = await ctx.googleClient.getMessage(oAuth2Client, response?.id);
                  const messageIdHeader = sentMessage.payload?.headers.find(
                      (header) => header.name.toLowerCase() === 'message-id'
                  );
                  await ctx.prisma.shedule.update({
                      where: {id: sheduleData.id},
                      data: {
                          messageId: `${sheduleData.messageId}, ${messageIdHeader?.value}`,
                          // confirmedMessageId: messageIdHeader?.value,
                      },
                  });

              } catch (error) {
                  console.error('Failed to handle the Message-ID:', error);
              }
          }
        }
        parsedSavedSlots = await toggleResponse(id, email, true, parsedSavedSlots, required);
        await ctx.prisma.shedule.update({
          data: { reservedSlot: '', status: 'RESCHEDULING_PENDING' },
          where: { id },
        });

        await sendNotificationPush(
            language === 'fr' ? 'Planification échouée' : 'Scheduling Unsuccessful',
            language === 'fr' ? `Boss, je n'ai pas pu planifier votre réunion. Veuillez appuyer ici pour l'annuler ou la modifier.` : 'Boss, I couldn\'t schedule your meeting. Please tap here to cancel or modify it.',
          user.email as string,
          { scheduleId: id, type: NotificationTypes.SCHEDULE },
        );

        res.render(TemplateNames.SUCCESSFUL_RESPONSE);
      } else if (slotsAvailability.length) {
        for (const invitedUser of parsedSavedSlots.recipients) {
          if (invitedUser) {
            const askOtherSlotsLink = jwt.sign(
              {
                id,
                subject,
                location,
                calendar,
                email: invitedUser.email,
                required,
                iterationNumber: iterationNumber + 1,
                name: buildUserName(user.firstName, user.lastName),
                reminder,
              },
              JWT_SECRET,
            );
            const acceptLink = jwt.sign(
              {
                id,
                slots: slotsAvailability,
                subject,
                location,
                calendar,
                askOtherSlots: `${serverConfiguration.REST_API_URL}/slot/${lang}/askOther/${askOtherSlotsLink}`,
                email: invitedUser.email,
                required,
                iterationNumber: iterationNumber + 1,
                reminder,
              },
              JWT_SECRET,
            );
              const language = lang || sheduleData.lang || user.lang || 'en'

              const message: ISendMEmail = buildEmail(
              `${language === 'fr' ? 'Nouveaux créneaux' : 'New slots'} : ${subject}`,
              [invitedUser.email],
              TemplateNames.REQUIRED_ATTENDEE_UNAVAILABLE,
              {
                subject,
                  timezone: user.timezone,
                  firstname: user.firstName,
                location: getLocationTextTranslated(location, language),
                calendar:
                  calendar !== '' && calendar !== undefined ? calendar.split('\n') : undefined,
                slots: slotsAvailability.map(
                  (slot) =>
                    `${moment.utc(slot.start).locale(language || 'en').format('Do MMMM  HH:mm')} - ${moment
                      .utc(slot.end)
                      .locale(language || 'en')
                      .format('HH:mm')}`,
                ),
                choseSlotUrl: `${serverConfiguration.REST_API_URL}/slot/${language}/choose/${acceptLink}`,
                askOtherSlots: `${serverConfiguration.REST_API_URL}/slot/${language}/askOtherConfirm/${askOtherSlotsLink}`,
                hasMoreChoices: !!parsedSavedSlots.saved.slice(6, parsedSavedSlots.saved.length)
                  .length,
                userName: buildUserName(user.firstName, user.lastName),
                yesBoss: id,
                ...EmailTemplateStaticFilesPaths,
              },
              user.email as string,
            );

            console.log('user Mail :', user.mailService);
            if (user.mailService === 'GOOGLE') {
              const { client_id, redirect_uri, client_secret } = credentials;
              const googleClient = new GoogleClient();

              const oAuth2Client: OAuth2Client = new google.auth.OAuth2({
                clientId: client_id,
                clientSecret: client_secret,
                redirectUri: redirect_uri,
              });

              const verifiedToken = await checkTokenValidityWithoutCtx(
                OAuth.tokenExpiryDateTime || new Date(),
                oAuth2Client,
                user.email as string,
                OAuth.refreshToken || '',
                prisma,
                OAuth.token!,
              );

              oAuth2Client.setCredentials({ access_token: verifiedToken });

              await googleClient.sendRealMessage(oAuth2Client, message, language);
              // await ctx.prisma.shedule.update({
              //   where: { id },
              //   data: { reservedSlot: JSON.stringify(slotsAvailability) },
              // });
            } else if (user.mailService === 'MICROSOFT') {
              // const adminToken = await getAdminToken();
              // console.log('adminToken', adminToken);

              const outLookClient = new OutLookClient();

              const accessToken = await getAccessTokenAsyncWithoutCtx(OAuth, prisma, outLookClient);

              if (!accessToken) {
                const err = new InvalidTokenError();
                err.status = 400;
                next(err);
              }
              await outLookClient.sendNewMessage(accessToken, message);
              // await ctx.prisma.shedule.update({
              //   where: { id },
              //   data: { reservedSlot: JSON.stringify(slotsAvailability) },
              // });
            }
          }
        }
        const recipientWithTrueResponse: (
          | {
              email: string;
              responded: boolean;
              required: boolean;
            }
          | undefined
        )[] = parsedSavedSlots.recipients
          .filter((item) => item && item.responded === true)
          .map((item) => {
            if (item) {
              const { email, required, responded } = item;
              return { email, required, responded: !responded };
            }
          });
        const recipientWithFalseResponse = parsedSavedSlots.recipients.filter(
          (item) => item && item.responded === false,
        );

        parsedSavedSlots = {
          ...parsedSavedSlots,
          saved: parsedSavedSlots.saved.slice(6, parsedSavedSlots.saved.length),
          iterationNumber: parsedSavedSlots.iterationNumber + 1,
          response: [],
          recipients: [...recipientWithTrueResponse, ...recipientWithFalseResponse],
        };

        console.log('SLOT TO SAVE ===>', parsedSavedSlots);

        await redis.hset(RedisHashKeys.TIME_SLOTS, id, JSON.stringify(parsedSavedSlots));

        res.render(TemplateNames.SUCCESSFUL_RESPONSE);
      } else {
        if (!rescheduling) {
          await handleRescheduling(id, prisma, ctx);
        }
        res.render(TemplateNames.SUCCESSFUL_RESPONSE);
      }
    }
    // If not, the current user will have immediately new slots
    else {
      // Verified if user required is already responded
      const allResponsed = parsedSavedSlots.response
        ?.filter((response) => response.slots.length > 0)
        .reduce((acc: any, element) => {
          const { slots } = element;
          return [...acc, slots];
        }, []);

      const slotToShow =
        allResponsed && allResponsed.length > 0
          ? allResponsed.map((slot: any) => {
              return {
                text: `${moment
                  .utc(slot.start)
                  .locale(user.lang || 'en')
                  .format('Do MMMM  HH:mm')} - ${moment
                  .utc(slot.end)
                  .locale(user.lang || 'en')
                  .format('HH:mm')}`,
                value: JSON.stringify(slot),
              };
            })
          : parsedSavedSlots.saved.slice(index, index + 6).map((slot) => {
              return {
                text: `${moment
                  .utc(slot.start)
                  .locale(user.lang || 'en')
                  .format('Do MMMM  HH:mm')} - ${moment
                  .utc(slot.end)
                  .locale(user.lang || 'en')
                  .format('HH:mm')}`,
                value: JSON.stringify(slot),
              };
            });

      const askOtherSlotsLink = jwt.sign(
        {
          id,
          subject,
          location,
          calendar,
          email,
          required,
          index: slotToShow.length ? index + 6 : index,
          name: buildUserName(user.firstName, user.lastName),
          reminder,
        },
        JWT_SECRET,
      );
      slotToShow.length > 0
        ? res.render(TemplateNames.CHOOSE_SLOTS, {
            slots: slotToShow,
            subject,
            location,
            calendar: calendar !== '' && calendar !== undefined ? calendar.split('\n') : undefined,
            askOtherSlots: `${serverConfiguration.REST_API_URL}/slot/${user.lang}/askOtherConfirm/${askOtherSlotsLink}`,
            token: askOtherSlotsLink,
            reminder,
          })
        : res.render(TemplateNames.SUCCESSFUL_RESPONSE);
    }
  } catch (error: any) {
    console.log('error on propose new time slots', error);
      const language = user.lang || 'en'
      await sendNotificationPush(
          language === 'fr' ? 'Planification échouée' : 'Scheduling Unsuccessful',
          language === 'fr' ? `Boss, je n'ai pas pu planifier votre réunion. Veuillez appuyer ici pour l'annuler ou la modifier.` : 'Boss, I couldn\'t schedule your meeting. Please tap here to cancel or modify it.',
          user.email as string,
          { scheduleId: id, type: NotificationTypes.SCHEDULE },
      );
      res.render(TemplateNames.SUCCESSFUL_RESPONSE);
  }
};

export const checkUserInteraction = (
  email: string,
  parsedSavedSlots: {
    saved: {
      start: string | Date;
      end: string | Date;
    }[];
    response?: {
      email: string;
      slots: {
        start: string | Date;
        end: string | Date;
      }[];
    }[];
    recipients: (
      | {
          email: string;
          responded: boolean;
          required: boolean;
        }
      | undefined
    )[];
    iterationNumber: number;
  },
) => {
  const user = parsedSavedSlots.recipients.length
    ? parsedSavedSlots.recipients.find((recipient) => {
        if (recipient) {
          return recipient.email === email;
        }
        return false;
      })
    : undefined;
  return user && !user.responded;
};

export const toggleResponse = async (
  id: string,
  email: string,
  responded: boolean,
  parsedSavedSlots: ParsedSavedSlotsProps,
  required: boolean,
): Promise<ParsedSavedSlotsProps> => {
  const remainingRecipients = parsedSavedSlots.recipients.filter((recipient) => {
    if (recipient) {
      return recipient.email !== email;
    }
  });

  // Change redis value
  parsedSavedSlots = {
    ...parsedSavedSlots,
    saved: parsedSavedSlots.saved.slice(6, parsedSavedSlots.saved.length),
    recipients: [...remainingRecipients, { email, responded, required }],
  };

  // Save the information into redis
  await redis.hset(RedisHashKeys.TIME_SLOTS, id, JSON.stringify(parsedSavedSlots));
  return parsedSavedSlots;
};

export const checkSlotExistence = (iterationNumber: number, index: number) => {
  return iterationNumber === index;
};

const handleRescheduling = async (
  id: string,
  prisma: PrismaClient,
  ctx: Context,
): Promise<void> => {
  const sheduleData = await prisma.shedule.findUnique({ where: { id } });

  if (sheduleData && sheduleData.userInvited) {
    const {
      debut,
      duration,
      email,
      fin,
      localisation: local,
      objet,
      niveau,
      userInvited: invited,
      sujet,
      id: redisRemovedEventKey,
      reminder,
      GMT: UTC,
    } = sheduleData;
    const localisation: { location: string; visioConf: boolean } = {
      location: local,
      visioConf: true,
    };
    const userInvited =
      ((invited as unknown) as {
        email: string;
        required: boolean;
      }[]) || [];
      await regleDeGestion(
          UTC,
          userInvited || [],
          debut,
          fin,
          duration,
          email,
          localisation,
          "",
          ctx,
          niveau,
          true,
          reminder,
          true,
          sujet,
          objet,
          redisRemovedEventKey,
      );

    const removedEvents = await redis.hget(REMOVED_EVENTS, redisRemovedEventKey);
    console.log('removed events ::', removedEvents);
    /* RECHEDULING */
    if (removedEvents) {
      rescheduling(JSON.parse(removedEvents), ctx, false);
    }

  }
};
