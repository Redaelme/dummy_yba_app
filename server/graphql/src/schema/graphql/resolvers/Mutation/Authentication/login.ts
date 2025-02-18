import { compare } from 'bcrypt';
import { Context } from '../../../../../types/contextType';
import { getAccessTokenAsync } from '../../../../../utils/commonBusinessLogic';
import { checkTokenValidity } from '../../../../../utils/googleLogic';
import { NexusGenArgTypes } from '../../../../generated/nexus';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../../../../configs/config';
import {handleReAuth} from "../../../../../utils/handleReAuth";

const ERROR_MESSAGE = [
  'invalid_grant',
  'invalid_rapt',
  'invalid_token',
  'invalid credentials',
  'no access, refresh token or api key is set'
]

export default {
  login: async (
    _: any,
    { email, password, deviceToken }: NexusGenArgTypes['Mutation']['login'],
    ctx: Context,
  ) => {
    const { oAuth2Client, redis } = ctx;
    let user = await ctx.prisma.user.findUnique({
      where: { email },
    });

    console.log("#########deviceToken#########", deviceToken);
    if (!user) {
      throw new Error(`invalid-email`);
    }

    try {
      // Fetch the notification record by userId
      const existingNotification = await ctx.prisma.notification.findFirst({
        where: { userId: user.id },
      });
      console.log('##### Existing notification: in login #####', existingNotification);
      if (existingNotification) {
        // Update the token
        if(existingNotification.token !== deviceToken) {
        const result = await ctx.prisma.notification.update({
          where: { id: existingNotification.id },
          data: { token: deviceToken },
        });
        console.log('##### Update token token on login successful: #####', result);
        }else {
          console.log('##### same Token already exists: #####', existingNotification.token);
        }
      } else {
        // Create a new notification record
        const result = await ctx.prisma.notification.create({
          data: { userId: user.id, token: deviceToken },
        });
        console.log('##### Create token on login successful: #####', result);
      }
    } catch (error) {
        console.error('Failed to save user FCM token when login:', error);
    }

    const completedSignUp = user.signupCompleted;

    const isPasswordValid = await compare(password, (user.password || '').trim());
    const userOauth = await ctx.prisma.oAuth.findUnique({
      where: { email },
      include: { oAuthOutlookAccount: true },
    });
    if (!isPasswordValid) {
      throw new Error('invalid-password');
    }
    if (userOauth) {
      try {
        if (user.mailService === 'GOOGLE' && userOauth.token) {
          if (userOauth.tokenExpiryDateTime && userOauth.refreshToken) {
            const verifiedToken = await checkTokenValidity(
                new Date(),
                oAuth2Client,
                email,
                userOauth.refreshToken || '',
                ctx,
                userOauth.token!,
            );

            oAuth2Client.setCredentials({ access_token: verifiedToken });

            console.log(`User id to pass in watchMyLabel: ${user.id}`);
            await ctx.googleClient.watchMyLabel(oAuth2Client, user.id, ctx);
          }
        } else if (user.mailService === 'MICROSOFT') {
          console.log(userOauth);

          const accessToken = await getAccessTokenAsync(userOauth, ctx);

        }
      }
      catch (error) {
        console.log('Error in creating subscription', error);
        if (user.oauthStatus === "ACTIVE"){
          if (ERROR_MESSAGE.some(msg => error.message?.toLowerCase().includes(msg))) {
            user = await ctx.prisma.user.update({
                where: { id: user.id },
                data: { oauthStatus: 'INACTIVE' },
            });
          }
          }
      }

    }

    const accessToken = jwt.sign({ id: user.id }, JWT_SECRET);

    return {
      token: accessToken,
      user,
      completedSignUp,
    };
  },

  loginBO: async (
    _: any,
    { email, password }: NexusGenArgTypes['Mutation']['loginBO'],
    ctx: Context,
  ) => {
    const userBO = await ctx.prisma.backOfficeUser.findUnique({
      where: { email },
    });

    if (!userBO) {
      throw new Error(`invalid-email`);
    }

    const isPasswordValid = await compare(password, (userBO.password || '').trim());
    if (!isPasswordValid) {
      throw new Error('invalid-password');
    }

    const accessToken = jwt.sign({ id: userBO.id }, JWT_SECRET);
    return {
      token: accessToken,
      userBO,
    };
  },
};
