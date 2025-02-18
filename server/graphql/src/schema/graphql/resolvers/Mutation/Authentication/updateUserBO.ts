import { hash } from 'bcrypt';
import { Context } from '../../../../../types/contextType';
import { NexusGenArgTypes } from '../../../../generated/nexus';

export default {
  updateUserBO: async (
    _: any,
    { id, newEmail, newPassword }: NexusGenArgTypes['Mutation']['updateUserBO'],
    ctx: Context,
  ) => {
    try {
      const userBO = await ctx.prisma.backOfficeUser.findUnique({
        where: {
          id,
        },
      });

      let newData: { email: string | null; password: string | null } = {
        email: null,
        password: null,
      };

      if (!userBO) {
        throw new Error('user-not-found');
      }

      if (newEmail && !newPassword) {
        newData = { email: newEmail, password: null };
      } else if (!newEmail && newPassword) {
        const hashedPassword = await hash(newPassword, 10);
        newData = { email: null, password: hashedPassword };
      } else if (newEmail && newPassword) {
        const hashedPassword = await hash(newPassword, 10);
        newData = { email: newEmail, password: hashedPassword };
      }
      await ctx.prisma.backOfficeUser.update({
        where: {
          id: userBO.id,
        },
        data: {
          email: newData.email ? newData.email : undefined,
          password: newData.password ? newData.password : undefined,
        },
      });
      return true;
    } catch (error) {
      return error;
    }
  },
};
