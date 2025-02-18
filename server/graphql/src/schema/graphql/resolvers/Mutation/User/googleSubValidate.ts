import { AuthenticationError } from 'apollo-server-express';
import moment from 'moment';
import { Context } from '../../../../../types/contextType';
import { checkSubscriber } from '../../../../../utils/cron';
import { NexusGenArgTypes } from '../../../../generated/nexus';
import { UNAUTHENTICATED } from '../../../errors/common';
import user from '../../Types/user';

export default {
  googleSubValidate: async (
    _: any,
    { free }: NexusGenArgTypes['Mutation']['subscriptionValidation'],
    ctx: Context,
  ) => {
    const { currentUser } = ctx;
    if (!currentUser) throw new AuthenticationError(UNAUTHENTICATED);
    // For operational subscription

    // const endOfSub = moment(new Date())
    //   .add(+1, 'M')
    //   .add(5, 'minutes');
    // const mins = moment(endOfSub).format('mm');
    // const hours = moment(endOfSub).format('HH');
    // const days = moment(endOfSub).format('DD');
    // const months = moment(endOfSub).format('MM');

    // For test subscription
    const min = moment(new Date()).add(6, 'minute').format('mm');
    const hour = moment(new Date()).add(6, 'minutes').format('HH');

    await ctx.prisma.user.update({ data: { isPayed: true }, where: { id: currentUser.id } });
    await checkSubscriber(ctx, '*', '*', hour, min);
    const { id, firstName, lastName, email } = currentUser;
    return { id, firstName, lastName, email };
  },
};
