import {OAuth} from '@prisma/client';
import {Context} from '../../../../../types/contextType';
import {EntityTypes} from '../../../../../utils/constants';
import {NexusGenArgTypes} from '../../../../generated/nexus';
import {NotFoundError} from '../../../errors';
import {USER_NOT_FOUND_ERROR_MESSAGE} from '../../../errors/messages';
import {USER_NOT_FOUND} from '../../../errors/Shedule';
import {getAccessTokenAsync} from "../../../../../utils/commonBusinessLogic";
import {checkTokenValidity} from "../../../../../utils/googleLogic";

export default {
  updateOauth: async (
    _: any,
    { data }: NexusGenArgTypes['Mutation']['updateAuth'],
    ctx: Context,
  ) => {
    const { email, token, refreshToken, tokenExpiryDateTime } = data;
    // const user = await ctx.prisma.user.findUnique({
    //   where: { id: ctx.currentUser.id },
    //   include: { OAuth: true },
    // });
    const user = await ctx.prisma.user.findUnique({ where: { email }, include: { OAuth: true } });
    let updatedUserOAuth: OAuth | null = null;
    if (user) {
      // p3
      console.log("Invalid-tocken-checker P3: in updateOauth line 24", refreshToken);
      updatedUserOAuth = await ctx.prisma.oAuth.update({
        where: { email },
        data: {
          token,
          refreshToken,
          tokenExpiryDateTime,
        },
      });
      console.log("updateOauth line 31", updatedUserOAuth);

      if (user.oauthStatus === 'INACTIVE') {
        if (user.mailService === 'GOOGLE'){
          if (updatedUserOAuth.tokenExpiryDateTime && updatedUserOAuth.refreshToken) {
            const verifiedToken = await checkTokenValidity(
                new Date(),
                ctx.oAuth2Client,
                email,
                updatedUserOAuth.refreshToken || '',
                ctx,
                updatedUserOAuth.token!,
            );

            ctx.oAuth2Client.setCredentials({ access_token: verifiedToken });

            console.log(`User id to pass in watchMyLabel: ${user.id}`);
            await ctx.googleClient.watchMyLabel(ctx.oAuth2Client, user.id, ctx);
          }

        } else if (user.mailService === 'MICROSOFT'){
          const accessToken = await getAccessTokenAsync(updatedUserOAuth, ctx);

        }
      }

      const usernew = await ctx.prisma.user.update({
        where: { id: user.id },
        data: {
          oauthStatus: 'ACTIVE',
      }
        });

      console.log("updateOauth line 38", usernew);
    } else {
      throw new NotFoundError(
        USER_NOT_FOUND_ERROR_MESSAGE,
        'id',
        ctx.userId,
        EntityTypes.USER,
        USER_NOT_FOUND,
      );
    }

    return updatedUserOAuth.token;
  },
};
