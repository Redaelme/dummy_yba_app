import {Context} from '../../../../../types/contextType';
import {NexusGenArgTypes} from '../../../../generated/nexus';
import {unsubscribeUserFromPubsub} from "../../../../../utils/pubSubUtils";

export default {
  updateStatusUser: async (
    _: any,
    { userId, isActive }: NexusGenArgTypes['Mutation']['updateStatus'],
    ctx: Context,
  ) => {
    try {
      await ctx.prisma.user.update({
        where: { id: userId },
        data: {
          isActive: isActive ? isActive : false,
        },
      });
      return true;
    } catch (error) {
      throw error;
    }
  },
  deleteUserInBO: async (
    _: any,
    { userId }: NexusGenArgTypes['Mutation']['deleteUserInBO'],
    ctx: Context,
  ) => {

    try {
      console.log("[[[deleteUserAccount from Back Office]]] userId: ", userId);
      if (!userId) {
        throw new Error('User ID is required');
      }

      const user = await ctx.prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        throw new Error('User not found');
      }
      await unsubscribeUserFromPubsub(user, ctx);
      console.log("deleting user account from backoffice...");
      await ctx.prisma.user.delete({ where: { id: userId } });
      return true;
    } catch (error) {
      throw error;
    }
  },
};
