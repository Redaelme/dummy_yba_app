import { Context } from '../../../../../types/contextType';
import { NexusGenArgTypes } from '../../../../generated/nexus';

export default {
  me: async (_: any, {}, ctx: Context) => {
    return ctx.currentUser as any;
  },
  meBo: async (_: any, {}, ctx: Context) => {
    return ctx.currentUserBO as any;
  },
  getAllUser: async (
    _: any,
    {
      offset,
      limite,
      keySearch,
      keyFilterCompany,
      keyFilterActive,
    }: NexusGenArgTypes['Query']['getAllUser'],
    ctx: Context,
  ) => {
    try {
      const users = await ctx.prisma.user.findMany({
        skip: offset ? offset : undefined,
        take: limite ? limite : undefined,
        where: {
          OR: [
            {
              email: {
                contains: keySearch ? keySearch : '',
                mode: 'insensitive',
              },
            },
            {
              firstName: {
                contains: keySearch ? keySearch : '',
                mode: 'insensitive',
              },
            },
            {
              lastName: {
                contains: keySearch ? keySearch : '',
                mode: 'insensitive',
              },
            },
          ],
          company:
            keyFilterCompany == 'Pas de société'
              ? null
              : {
                  contains:
                    keyFilterCompany && keyFilterCompany.length > 0 ? keyFilterCompany : undefined,
                },
          isActive: keyFilterActive
            ? keyFilterActive
            : keyFilterActive === false
            ? false
            : undefined,
        },
      });

      const length = await ctx.prisma.user.count();

      return { users, length };
    } catch (error) {
      throw error;
    }
  },
  getAllCompany: async (_: any, {}, ctx: Context) => {
    try {
      return await ctx.prisma.user.findMany({
        where: {},
        distinct: ['company'],
      });
    } catch (err) {
      throw err;
    }
  },
};
