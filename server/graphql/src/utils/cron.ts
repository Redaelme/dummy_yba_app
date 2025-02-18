import {PrismaClient, User} from '.prisma/client';
import moment from 'moment';
import {EmailTemplateStaticFilesPaths} from '../configs/config';
import {Context} from '../types/contextType';
import {ISendMEmail, OAuth2Client} from '../types/types';
import {buildEmail, buildUserName, findUserOAuth, getAccessTokenAsync,} from './commonBusinessLogic';
import {NotificationTypes, RedisHashKeys, TemplateNames} from './constants';

import * as cronJob from 'node-cron';
import {checkTokenValidity} from './googleLogic';
import {sendNotificationPush} from './firebase';

export const initCronJobForResendMail = async (
  messageList: ISendMEmail[],
  ctx: Context,
  keyRedis: string,
  user: User,
  dateDebut: Date,
  fin: Date,
) => {
  const { oAuth2Client, redis, prisma } = ctx;
  let newDateDebut = moment();
  let newDateFin = moment(fin);
  let intervalDay = newDateFin.diff(newDateDebut, 'days');
  let minutesToAdd = intervalDay < 3 ? 240 : intervalDay === 3 ? 1440 : 2880;
  let dateNow = moment().add(minutesToAdd, 'm').add(1, 'M').toDate();
  let min = dateNow.getMinutes();
  let hours = dateNow.getHours();
  let date = dateNow.getDate();
  let month = dateNow.getMonth();

  try {
    cronJob.schedule(`${min} ${hours} ${date} ${month} *`, async () => {
      console.log('++++++++++++ INIT CRON FILE RESEND MAIL FUNCT ++++++++++++++++++');

      const slotToSaveValue = await redis.hget(RedisHashKeys.TIME_SLOTS, keyRedis);
      if (slotToSaveValue !== null) {
        try {
          let parsedSavedSlots: {
            saved: {
              start: Date;
              end: Date;
            }[];
            recipients: (
              | {
                  email: string;
                  responded: boolean;
                  required: boolean;
                }
              | undefined
            )[];
            response?: {
              email: string;
              slots: {
                start: Date;
                end: Date;
              }[];
            }[];
            iterationNumber: number;
          } = JSON.parse(slotToSaveValue);
          const userNotRespondMails = parsedSavedSlots.recipients.filter((recipient) => {
            if (recipient?.responded === false && recipient.required === true) {
              return recipient;
            }
            return null;
          });
          for (const message of messageList) {
            message.subject = 'Rappel YesBoss : ' + message.subject;
            message.template = TemplateNames.RESEND_SLOT_PROPOSAL;
            message.from;

            const isNotResponded = userNotRespondMails.some(
              (usr) =>
                usr &&
                message.toRecipients &&
                message.toRecipients.some((rec) => rec.emailAddress.address === usr.email),
            );

            if (isNotResponded !== false) {
              if (user.mailService === 'MICROSOFT') {
                const oAuth = await findUserOAuth(ctx.userId, ctx);
                const accessToken = await getAccessTokenAsync(oAuth[0], ctx);
                await ctx.outLookClient.sendNewMessage(accessToken, message);
              }
              // If mail service is Google
              else {
                const userOauth = await ctx.prisma.oAuth.findUnique({
                  where: { email: user.email as string },
                });
                if (userOauth) {
                  const verifiedToken = await checkTokenValidity(
                    userOauth.tokenExpiryDateTime || new Date(),
                    oAuth2Client,
                    user.email as string,
                    userOauth.refreshToken || '',
                    ctx,
                    userOauth.token!,
                  );

                  oAuth2Client.setCredentials({ access_token: verifiedToken });
                  await ctx.googleClient.sendRealMessage(oAuth2Client, message, user.lang);
                }
              }
              console.log('Resend mail done');
            }
          }
        } catch (error) {
          console.log('error in initCronJobForResendMail', error);
          throw error;
        }
      }
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const initCronJobReminderMail = async (
  meetingTime: Date, // || google shedule time zone
  reminderTime: number,
  userInvited: string[],
  objet: string,
  location: string,
  sujet: string,
  from: string,
  graphqlToken: string,
  utc: number,
  userMailService: string,
  ctx: Context,
) => {
  console.log(
    '-------------------------------------------------INIT REMINDER CRON REMINDER MAIL FUNC ---------------------------------------------------------',
  );
  const { prisma } = ctx;
  const user = await prisma.user.findFirst({ where: { email: from } });

  const diffOfMeetingTimeAndNewDate = moment(
    moment(
      new Date(new Date(meetingTime).setMinutes(new Date(meetingTime).getMinutes() - reminderTime)),
    ).toISOString(),
  )
    .add(userMailService === 'GOOGLE' ? 0 : -utc, 'minutes')
    .diff(moment(new Date()).add(-utc, 'minutes').toISOString());

  const reminderDate: Date = new Date(
    new Date(meetingTime).setMinutes(
      new Date(meetingTime).getMinutes() - (diffOfMeetingTimeAndNewDate > 5000 ? reminderTime : 15),
    ),
  );

  const reminderDateAfterCheckMailService =
    userMailService === 'GOOGLE'
      ? reminderDate
      : moment(reminderDate).add(-utc, 'minutes').toDate();

  const newValueMeetingDay = reminderDateMustDisplayed(
    diffOfMeetingTimeAndNewDate > 5000 ? reminderTime : 15,
  );
  userInvited.push(from);
  const message: ISendMEmail = buildEmail(
      (user.lang === 'fr' ? 'Rappel : ' : 'Reminder : ') + objet,
    userInvited,
    TemplateNames.REMINDER_MEETING,
    {
      subject: objet,
      location: location,
      timezone: user.timezone,
      firstname: user.firstName,
      calendar: (sujet && sujet.includes('\n')) || sujet,
      meetingDay: newValueMeetingDay,
      ...EmailTemplateStaticFilesPaths,
      userName: buildUserName(user?.firstName, user?.lastName),
    },
    from,
  );

  try {
    cronJob.schedule(
      `${reminderDateAfterCheckMailService.getMinutes()} ${moment(reminderDateAfterCheckMailService)
        .add(utc, 'minutes')
        .format('H')} ${reminderDateAfterCheckMailService.getDate()} ${
        reminderDateAfterCheckMailService.getMonth() + 1
      } *`,
      async () => {
        const user = await prisma.user.findFirst({ where: { email: from } });
      },
    );
  } catch (error) {
    throw error;
  }
};

const reminderDateMustDisplayed = (reminderTime: number) => {
  let newValueMeetingDay: string;
  if (reminderTime < 60) {
    return (newValueMeetingDay = reminderTime + ' minutes');
  } else if (reminderTime === 60) {
    return (newValueMeetingDay = 'une heure');
  } else if (reminderTime === 1440) {
    return (newValueMeetingDay = 'un jour');
  } else {
    return (newValueMeetingDay = 'deux jours');
  }
};
export const initCronJobForGmailWatch = async (
  oAuth2Client: OAuth2Client,
  userId: string,
  ctx: Context,
) => {
  let dateNow = moment(new Date()).add(3, 'days').add(1, 'M').toDate();
  let min = dateNow.getMinutes();
  let hours = dateNow.getHours();
  let date = dateNow.getDate();
  let month = dateNow.getMonth();
  try {
    cronJob.schedule(`${min} ${hours} ${date} ${month} *`, async () => {
      const userOauth = await ctx.prisma.oAuth.findFirst({
        where: { userId },
      });

      const user = await ctx.prisma.user.findUnique({ where: { id: userId } });

      if (userOauth && user) {
        const verifiedToken = await checkTokenValidity(
          userOauth.tokenExpiryDateTime || new Date(),
          oAuth2Client,
          user.email as string,
          userOauth.refreshToken || '',
          ctx,
          userOauth.token!,
        );
        oAuth2Client.setCredentials({ access_token: verifiedToken });

        await ctx.googleClient.watchMyLabel(oAuth2Client, userId, ctx);
      }
    });
  } catch (err) {
    console.log('error when cron gmail watch:', err);
  }
};

export const deleteOutdatedMeeting = async () => {
  console.log('Periodically schedule deletion set up 👌');

  try {
    cronJob.schedule('0 0 * * *', async () => {
      const prisma = new PrismaClient();
      const schedules = await prisma.shedule.findMany({
        where: {
          OR: [
            {
              status: 'ACCEPTED',
              acceptedSlot: { lt: new Date() },
            },
            {
              status: { in: ['PENDING', 'RESCHEDULING_PENDING'] },
              fin: { lt: moment(new Date()).add(-5, 'days').toDate() },
            },
          ],
        },
      });
      for (const schedule of schedules) {
        await prisma.shedule.delete({ where: { id: schedule.id } });
        console.log('👌 successfully deleted schedule of id', schedule.id);
      }
    });
  } catch (error) {
    console.log('Error while deleting schedule', error);
  }
};

export const checkSubscriberAccount = async () => {
  console.log(' 🚀🚀🚀 Daily checking subscriber 🚀🚀🚀');

  try {
    // Do sommething
    const prisma = new PrismaClient();
    cronJob.schedule('0 0 * * *', async () => {
      const users = await prisma.user.findMany({
        where: {
          modeFree: false,
          isPayed: false,
        },
      });
      for (const user of users) {
        await prisma.user.update({ where: { id: user.id }, data: { isActive: false } });
        console.log('👌 successfully update user of id', user.id);
      }
    });
  } catch (error) {
    console.log('Update user subscriber error: ', error);
  }
};

export const deleteOudatedIncomingRequest = async () => {
  const prisma = new PrismaClient();
  console.log('Periodically incoming request appointment deletion set up 👌');

  try {
    cronJob.schedule('0 0 * * *', async () => {
      const incomingAppointments = await prisma.incomingMeetingRequest.findMany({
        where: {
          appointmentUserAction: { in: ['APPROUVER', 'REPLANIFIER', 'REFUSER', ''] },
        },
      });

      if (incomingAppointments.length > 0) {
        // incomingAppointments.forEach(async (incomingAppointment) => {
        //   const dateOfIncomingAppointment = JSON.parse(incomingAppointment.dateEntity)[0].date
        //     ? parsedDate(JSON.parse(incomingAppointment.dateEntity)[0].date[0])
        //     : parsedDate(JSON.parse(incomingAppointment.dateEntity)[0].new_date[0]);
        //
        //   const differenceTime = moment(dateOfIncomingAppointment).diff(
        //     new Date(new Date().setDate(new Date().getDate() - 1)),
        //   );
        //
        //   if (differenceTime < 0 || incomingAppointment.appointmentUserAction !== '') {
        //     const incomingToDeleted = await prisma.incomingMeetingRequest.delete({
        //       where: { id: incomingAppointment.id },
        //     });
        //     if (incomingToDeleted) {
        //       console.log(
        //         '👌 successfully incoming request apppointment schedule of id',
        //         incomingAppointment.id,
        //       );
        //     }
        //   }
        // });
      }
    });
  } catch (error) {
    console.log('Error while deleting incoming request appointment', error);
  }
};

export const checkSubscriber = async (
  ctx: Context,
  month: string,
  day: string,
  hours: string,
  min: string,
) => {
  console.log(' 🚀🚀🚀  🚀🚀🚀 Daily 🚀🚀🚀 🚀🚀🚀', day, ' ', min);
  // used to set day for free mode and sub mode
  const { currentUser } = ctx;
  if (currentUser) {
    cronJob.schedule(`${min} ${hours} ${day} ${month} *`, async () => {
      console.log('🚀Send notification');
      currentUser.modeFree
        ? await ctx.prisma.user.update({
            data: { isPayed: false, modeFree: false },
            where: { id: currentUser.id },
          })
        : await ctx.prisma.user.update({ data: { isPayed: false }, where: { id: currentUser.id } });
      await sendNotificationPush(
        currentUser.lang === 'fr' ? "Expiration de l'abonnement" : `Subscription Expired`,
        currentUser.lang === 'fr' ? `Boss, votre abonnement a expiré.` : 'Boss, your subscription has expired.',
        currentUser.email as string,
        {
          messageId: '',
          mail: '',
          type: NotificationTypes.SUB,
        },
      );
    });
  }
};
