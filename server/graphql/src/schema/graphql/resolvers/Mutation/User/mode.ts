import moment from 'moment';
import { Context } from '../../../../../types/contextType';
import { checkSubscriber } from '../../../../../utils/cron';
import { NexusGenArgTypes } from '../../../../generated/nexus';

export default {
  updateUserMode: async (
    _: any,
    { userId, modeFree, beginModeFree }: NexusGenArgTypes['Mutation']['updateUserMode'],
    // {},
    ctx: Context,
  ) => {
    try {
      const { currentUser } = ctx;
      const userToUpdate = await ctx.prisma.user.update({
        where: { id: userId },
        data: {
          modeFree,
          beginModeFree,
        },
      });

      // For testing mode free
      const dateToEndModeFreeTest = moment(beginModeFree).add(+10, 'minutes');

      // For real mode free, replace dateToEndModeFreeTest with dateToEndModeFree
      // const dateToEndModeFree = moment(beginModeFree).add(+15, 'days');

      const month = moment(dateToEndModeFreeTest).format('MM');
      const days = moment(dateToEndModeFreeTest).format('DD');
      const hours = moment(dateToEndModeFreeTest).format('HH');
      const min = moment(dateToEndModeFreeTest).format('mm');

      await checkSubscriber(ctx, month, days, hours, min);

      return userToUpdate;
    } catch (error) {
      throw error;
    }
  },
};
