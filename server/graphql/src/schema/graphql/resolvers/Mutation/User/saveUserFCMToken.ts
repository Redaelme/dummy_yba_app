import { Context } from '../../../../../types/contextType';
import { NexusGenArgTypes } from '../../../../generated/nexus';

export default {
  saveUserFCMToken: async (
      _: any,
      args: NexusGenArgTypes['Mutation']['saveUserFCMToken'],
      ctx: Context,
  ) => {
    const { token, userId } = args;

    console.log('##### saveUserFCMToken args: #####', args);
    try {
      // Check if the user exists
      const userExists = await ctx.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!userExists) {
        throw new Error(`User with id ${userId} does not exist`);
      }

      // Fetch the notification record by userId
      const existingNotification = await ctx.prisma.notification.findFirst({
        where: { userId },
      });
      console.log('##### Existing notification: #####', existingNotification);


      if (existingNotification) {
        // Update the token
        const result = await ctx.prisma.notification.update({
          where: { id: existingNotification.id },
          data: { token },
        });
        console.log('##### Update result: #####', result);
        return !!result;
      } else {
        // Create a new notification record
        const result = await ctx.prisma.notification.create({
          data: { userId, token },
        });
        console.log('##### Create result: #####', result);
        return !!result;
      }
      // Upsert token
      // const result = await ctx.prisma.notification.upsert({
      //   where: { id: existingNotification ? existingNotification.id : undefined },
      //   update: { token },
      //   create: { userId, token },
      // });

      // console.log('##### Upsert result: #####', result);
      // return !!result;
    } catch (error) {
      console.error('Failed to save user FCM token:', error);
      return false;
      // throw new Error('Failed to save user FCM token');
    }
  },
};