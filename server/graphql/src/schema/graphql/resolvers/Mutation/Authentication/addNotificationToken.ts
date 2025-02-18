import { Context } from '../../../../../types/contextType';
import { EntityTypes } from '../../../../../utils/constants';
import { sendNotificationPush } from '../../../../../utils/firebase';
import { NexusGenArgTypes } from '../../../../generated/nexus';
import { NotFoundError } from '../../../errors';
import { USER_NOT_FOUND } from '../../../errors/common';
import { USER_NOT_FOUND_ERROR_MESSAGE } from '../../../errors/messages';

export default {
  addNotificationToken: async (
    _: any,
    args: NexusGenArgTypes['Mutation']['addNotificationToken'],
    ctx: Context,
  ) => {
    const { userId, token } = args;
    const userToUpdate = await ctx.prisma.user.findUnique({ where: { id: userId } });
    if (!userToUpdate) {
      throw new NotFoundError(
        USER_NOT_FOUND_ERROR_MESSAGE,
        'id',
        ctx.userId,
        EntityTypes.USER,
        USER_NOT_FOUND,
      );
    }
    const notificationToken = await ctx.prisma.notification.findFirst({
      where: { token: { contains: token } },
    });

    await ctx.prisma.user.update({
      where: { id: userToUpdate.id },
      data: {
        Notification: {
          upsert: {
            where: { id: (notificationToken && notificationToken.id) || 'none' },
            create: {
              token,
            },
            update: {
              token,
            },
          },
        },
      },
    });
    console.log('NOTIFICATION TOKEN ADDED SUCCESSFULLY');

    // await sendNotificationPush(
    //   'Rendez-vous infructueux',
    //   `Boss, je n'ai pas pu planifier votre réunion. Veuillez appuyer ici pour l'annuler ou la modifier.`,
    //   userToUpdate.email as string,
    //   { scheduleId: 'redisRemovedEventKey', type: 'NotificationTypes.SCHEDULE' },
    // );
    return token;
  },
};
