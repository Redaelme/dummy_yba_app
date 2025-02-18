import { Context } from '../../../../../types/contextType';
import { NexusGenArgTypes } from '../../../../generated/nexus';

export default {
  updateProfile: async (
    _: any,
    { id, input }: NexusGenArgTypes['Mutation']['updateProfile'],
    ctx: Context,
  ) => {
    console.log({ id, input });

    return await ctx.prisma.user.update({
      where: { id },
      data: {
        ...input,
      },
    });
  },
};
