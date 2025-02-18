import { hash } from 'bcrypt';
import { Context } from '../../../../../types/contextType';
import { RESET_PASSWORD_KEY } from '../../../../../utils/constants';
import { NexusGenArgTypes } from '../../../../generated/nexus';

export default {
  resetPassword: async (
    _: any,
    { input }: NexusGenArgTypes['Mutation']['resetPassword'],
    ctx: Context,
  ) => {
    try {
      const { email, token, newPassword } = input;
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
      if (tokenRedis === token && token.length) {
        const hashedPassword = await hash(newPassword, 10);
        await ctx.prisma.user
          .update({
            where: { id: user.id },
            data: {
              password: hashedPassword,
            },
          })
          .then(async () => {
            await ctx.redis.del(`${RESET_PASSWORD_KEY}:${user.id}`);
          });
        return {
          message: 'Password reset',
          success: true,
        };
      }
      return {
        message: 'Access refused',
        success: false,
      };
    } catch (error) {
      return error;
    }
  },
};
