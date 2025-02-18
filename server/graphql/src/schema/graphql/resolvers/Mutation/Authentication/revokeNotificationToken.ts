import {Context} from '../../../../../types/contextType';
import {NexusGenArgTypes} from '../../../../generated/nexus';
import {unsubscribeUserFromPubsub} from "../../../../../utils/pubSubUtils";

export default {
  revokeNotificationToken: async (
    _: any,
    args: NexusGenArgTypes['Mutation']['revokeNotificationToken'],
    ctx: Context,
  ) => {
    const { token } = args;
    const { currentUser } = ctx;
    console.log('##### revokeNotificationToken currentUser: #####', currentUser?.id);
    console.log('##### revokeNotificationToken args: #####', args);

    if (!currentUser) {
      throw new Error('Not connected');
    }

    const user = await ctx.prisma.user.findUnique({ where: { id: currentUser.id } });
    if (!user) {
      throw new Error('User not found');
    }
    await unsubscribeUserFromPubsub(user, ctx);
    try {
      await ctx.prisma.notification.deleteMany({ where: { userId: user.id } });
      console.log('NOTIFICATION TOKEN REMOVED SUCCESSFULLY');
    } catch (error) {
      console.error('Failed to remove notification token:', error);
      return false;
    }

    return true;
  },
};
