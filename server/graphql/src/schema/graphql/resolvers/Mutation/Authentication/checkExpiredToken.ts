import { Context } from '../../../../../types/contextType';
import { RESET_PASSWORD_KEY } from '../../../../../utils/constants';
import { NexusGenArgTypes } from '../../../../generated/nexus';

export default {
  checkExpiredToken: async (
    _: any,
    { email, token }: NexusGenArgTypes['Mutation']['checkExpiredToken'],
    ctx: Context,
  ) => {
    const user = await ctx.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return {
        success: false,
        message: 'User not found',
      };
    }
    const tokenRedis = await ctx.redis.get(`${RESET_PASSWORD_KEY}:${user.id}`);
    if (!tokenRedis) {
      return {
        success: false,
        message: 'Code expired',
      };
    }
    if (tokenRedis === token) {
      return {
        success: true,
        message: 'Valid code',
      };
    }
    return {
      success: false,
      message: 'Error code',
    };
  },
};
