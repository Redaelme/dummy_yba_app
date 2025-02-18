import moment from 'moment';
import { IMessage } from '../../../../../mail/google/googleClient';
import { Context } from '../../../../../types/contextType';
import { EmailValue, OutlookEmail } from '../../../../../types/types';
import { v4 as uuid_v4 } from 'uuid';
import {
  buildMS_MLEmails,
  findUserOAuth,
  getAccessTokenAsync,
} from '../../../../../utils/commonBusinessLogic';
import { EntityTypes, NotificationTypes, RECEIVED_DATETIME } from '../../../../../utils/constants';
import { checkTokenValidity } from '../../../../../utils/googleLogic';
import { NexusGenArgTypes } from '../../../../generated/nexus';
import { NotFoundError } from '../../../errors';
import { USER_NOT_FOUND_ERROR_MESSAGE } from '../../../errors/messages';
import { sendNotificationPush } from '../../../../../utils/firebase';

export default {
  getUserMailResolvers: async (
    _: any,
    args: NexusGenArgTypes['Mutation']['getUserMail'],
    ctx: Context,
  ) => {
    const { data } = args;

    console.log(`######### Get email input data: ${JSON.stringify(data)} #########`);

    const { currentUser, redis } = ctx;

    if (!currentUser) {
      throw new Error('Not connected');
    }

    let query = '';
    let mail: IMessage[] | undefined = [];
    const redisData =
      data?.maxResult === 1
        ? moment(new Date()).subtract(1, 'day').toISOString()
        : await redis.hget(RECEIVED_DATETIME, currentUser.id);

    const lastDate = redisData ? redisData : moment(new Date()).toISOString();

    if (currentUser.email && data) {
      const email = currentUser.email;
      const userAuth = await ctx.prisma.oAuth.findUnique({ where: { email } });
      const user = await ctx.prisma.user.findUnique({ where: { email } });

      const { oAuth2Client } = ctx;
      if (!userAuth || !user) {
        console.log('failed to check');
        throw new NotFoundError(
          USER_NOT_FOUND_ERROR_MESSAGE,
          'email',
          userAuth,
          '',
          EntityTypes.SCHEDULE,
        );
      }

      query = 'after:' + moment(lastDate).unix();

      if (user.mailService === 'GOOGLE' && userAuth && userAuth.token) {
        if (userAuth.tokenExpiryDateTime && userAuth.refreshToken) {
          oAuth2Client.setCredentials({ refresh_token: userAuth.refreshToken });
          const verifiedToken = await checkTokenValidity(
            new Date(),
            oAuth2Client,
            currentUser.email,
            userAuth.refreshToken || '',
            ctx,
            userAuth.token!,
          );

          oAuth2Client.setCredentials({ access_token: verifiedToken });
          mail = await ctx.googleClient.getMailMessage(
            oAuth2Client,
            data.maxResult === 0 ? 1 : 15000,
            data.maxResult === 0 ? '' : query,
          );
          console.log('send message to ', user.id);

          if (mail && data.maxResult === 0) {
            // console.log('mail is:', mail[0]);

            // console.log('send mail to notifcation');

            // await sendNotificationPush(
            //   `Un nouveau mail de test :`,
            //   `${mail && mail[0].id}`,
            //   email as string,
            //   {
            //     messageId: mail[0].id,
            //     mail: 'GET_MAIL',
            //     type: NotificationTypes.INCOMING_EMAIL,
            //   },
            // );
          }

          // envoie de la requet POST vers mahanamana
        }
      } else if (user.mailService === 'MICROSOFT') {
        const OAuthTokens = await findUserOAuth(user.id, ctx);
        const { refreshToken, token, tokenExpiryDateTime } = OAuthTokens[0];
        console.log('Found OAuthToken', OAuthTokens[0]);
        const accessToken = await getAccessTokenAsync(OAuthTokens[0], ctx);
        // console.log('times:', redisData);

        const messages: OutlookEmail = await ctx.outLookClient.getMailList(
          accessToken,
          moment.utc(lastDate).add(1, 'seconds').toISOString(),
        );
        const newMessage = messages.value.reduce<EmailValue[]>((acc, current) => {
          if (current) {
            return [...acc, current];
          }
          return acc;
        }, []);

        mail = newMessage.length > 0 ? buildMS_MLEmails(newMessage) : [];
      }
      if (mail && mail.length) {
        // const mailToReverse = mail.reverse();
        const mailToReverse = mail.reverse().filter((itemToFilter) => {
          return moment(itemToFilter.receivedDateTime).diff(lastDate) > 0;
        })[0];

        // mailToReverse.length > 10 && mailToReverse.splice(10, mailToReverse.length - 10);

        const tempMail = mailToReverse
          ? [mailToReverse].map((item) => {
              const {
                cc,
                content,
                htmlBody,
                isRead,
                object,
                receivedDateTime: date,
                recipients,
                sender,
                subject,
                id,
              } = item;
              const receivedDateTimeTransformed = new Date(date).toISOString();

              return {
                cc: cc.map((item) => item || ''),
                content,
                htmlBody,
                id: user.mailService === 'MICROSOFT' ? receivedDateTimeTransformed : id,
                isRead,
                object,
                receivedDateTime: receivedDateTimeTransformed,
                recipients: recipients.map((item) => item || ''),
                sender,
                subject,
              };
            })
          : [];

        // console.log(`=============> Get email result: ${JSON.stringify(tempMail)} <=============`);

        return tempMail;
      }
    }

    return [];
  },
};
