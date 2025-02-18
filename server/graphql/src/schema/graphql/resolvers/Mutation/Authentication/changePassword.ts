import { hash } from 'bcrypt';
import { Context } from '../../../../../types/contextType';
import { NexusGenArgTypes } from '../../../../generated/nexus';

export default {
  changePassword: async (
    _: any,
    { input }: NexusGenArgTypes['Mutation']['changePassword'],
    ctx: Context,
  ) => {
    try {
      const { email, newPassword } = input;
      const user = await ctx.prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (!user) {
        throw new Error('user-not-found');
      }

      const hashedPassword = await hash(newPassword, 10);
      const updatedUser = await ctx.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          password: hashedPassword,
        },
      });
      return updatedUser;
    } catch (error) {
      return error;
    }
  },
};
