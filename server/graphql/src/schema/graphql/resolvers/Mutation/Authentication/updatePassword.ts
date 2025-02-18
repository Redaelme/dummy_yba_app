import { compare, hash } from 'bcrypt';
import { Context } from '../../../../../types/contextType';
import { NexusGenArgTypes } from '../../../../generated/nexus';

export default {
  updatePassword: async (
    _: any,
    { id, oldPassword, newPassword }: NexusGenArgTypes['Mutation']['updatePassword'],
    ctx: Context,
  ) => {
    try {
      const user = await ctx.prisma.user.findUnique({
        where: {
          id,
        },
      });

      if (!user) {
        throw new Error('user-not-found');
      }

      const isPasswordValid = await compare(oldPassword, (user.password || '').trim());

      if (!isPasswordValid) {
        throw new Error('invalid-password');
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
