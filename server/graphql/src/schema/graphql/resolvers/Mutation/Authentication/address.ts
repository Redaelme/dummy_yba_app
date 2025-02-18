import { Context } from '../../../../../types/contextType';
import { NexusGenArgTypes } from '../../../../generated/nexus';

export default {
  addAddress: async (
    _: any,
    { input }: NexusGenArgTypes['Mutation']['addAddress'],
    ctx: Context,
  ) => {
    const created = await ctx.prisma.address.create({
      data: {
        libelle: input.libelle,
        adresse: input.adresse,
        userId: input.userId,
        defaultAddress: false,
        fromRemote: false,
      },
    });
    const { adresse, userId, id, isRemoved, libelle, defaultAddress, fromRemote } = created;
    return {
      adresse,
      userId: userId!,
      id,
      isRemoved,
      libelle,
      defaultAddress,
      fromRemote,
    };
  },
  updateAddress: async (
    _: any,
    { id, input }: NexusGenArgTypes['Mutation']['updateAddress'],
    ctx: Context,
  ) => {
    const updated = await ctx.prisma.address.update({
      where: { id },
      data: {
        adresse: input.libelle,
        libelle: input.adresse,
      },
    });
    const { adresse, userId, isRemoved, libelle, defaultAddress, fromRemote } = updated;
    return {
      adresse,
      userId: userId!,
      id,
      isRemoved,
      libelle,
      defaultAddress,
      fromRemote,
    };
  },
  removeAddress: async (
    _: any,
    { id, input }: NexusGenArgTypes['Mutation']['removeAddress'],
    ctx: Context,
  ) => {
    const removed = await ctx.prisma.address.update({
      where: { id },
      data: {
        libelle: input.adresse,
        adresse: input.libelle,
        userId: input.userId,
        isRemoved: input.isRemoved,
      },
    });
    const { adresse, userId, isRemoved, libelle, defaultAddress, fromRemote } = removed;
    return {
      adresse,
      userId: userId!,
      id,
      isRemoved,
      libelle,
      defaultAddress,
      fromRemote,
    };
  },
};
