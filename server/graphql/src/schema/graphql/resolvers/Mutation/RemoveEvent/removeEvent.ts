import { OutLookClient } from '../../../../../mail/outlook/outlookClient';
import { Context } from '../../../../../types/contextType';
import { findUserOAuth, getAccessTokenAsync } from '../../../../../utils/commonBusinessLogic';
import { EntityTypes } from '../../../../../utils/constants';
import { checkTokenValidity, g_deleteEvents } from '../../../../../utils/googleLogic';
import { NexusGenArgTypes } from '../../../../generated/nexus';
import { NotFoundError } from '../../../errors';
import { USER_NOT_FOUND_ERROR_MESSAGE } from '../../../errors/messages';

export default {
  removeEvent: async (_: any, args: NexusGenArgTypes['Mutation']['removeEvent'], ctx: Context) => {
    const { data } = args;
    const { email, eventId } = data;
    const { oAuth2Client } = ctx;

    const user = await ctx.prisma.user.findUnique({ where: { email } });
    const tokenOfCreator = await ctx.prisma.oAuth.findUnique({
      where: { email },
    });

    if (!ctx.userId || !user || !tokenOfCreator) {
      throw new NotFoundError(
        USER_NOT_FOUND_ERROR_MESSAGE,
        'email',
        ctx.userId,
        '',
        EntityTypes.SCHEDULE,
      );
    }

    try {
      if (user.mailService === 'GOOGLE') {
        const verifiedToken = await checkTokenValidity(
          tokenOfCreator.tokenExpiryDateTime || new Date(),
          oAuth2Client,
          email,
          tokenOfCreator.refreshToken || '',
          ctx,
          tokenOfCreator.token!,
        );
        oAuth2Client.setCredentials({ access_token: verifiedToken });
        const status = await g_deleteEvents(oAuth2Client, eventId);
        console.log('remove event status:', status);
      }
      if (user.mailService === 'MICROSOFT') {
        const outlookClient = new OutLookClient();

        const OAuthTokens = await findUserOAuth(user.id, ctx);
        const accessToken = await getAccessTokenAsync(OAuthTokens[0], ctx);
        await outlookClient.removeEvent(accessToken, eventId);
      }
      const shedule = await ctx.prisma.shedule.findFirst({ where: { eventId } });
      if (!shedule) {
        throw new Error('shedule not found');
      }
      await ctx.prisma.shedule.delete({ where: { id: shedule.id } });
      return true;
    } catch (error) {
      console.log('error when remove event:', error);
      throw new Error(error as string);
    }
  },
};
