import { Context } from '../../../../../types/contextType';
import { EntityTypes } from '../../../../../utils/constants';
import { NexusGenArgTypes } from '../../../../generated/nexus';
import { NotFoundError } from '../../../errors';
import { USER_NOT_FOUND_ERROR_MESSAGE } from '../../../errors/messages';
import { USER_NOT_FOUND } from '../../../errors/Shedule';

export default {
  Oauth: async (_: any, { data }: NexusGenArgTypes['Mutation']['createOauth'], ctx: Context) => {
    const { access_token, email } = data;
    const user = await ctx.prisma.user.findUnique({ where: { email }, include: { OAuth: true } });
    let created = null;
    if (user) {
      created = await ctx.prisma.oAuth.create({
        data: { email, token: access_token, userId: user.id },
      });
    } else {
      throw new NotFoundError(
        USER_NOT_FOUND_ERROR_MESSAGE,
        'id',
        ctx.userId,
        EntityTypes.USER,
        USER_NOT_FOUND,
      );
    }

    return {
      access_token: created?.token,
      email: created?.email,
      id: created && created.id ? created.id : '',
    };
  },
};
