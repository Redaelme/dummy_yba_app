import { extendType, inputObjectType, nonNull, objectType, stringArg } from 'nexus';
import resolvers from '../resolvers';

// ================== Mutation =======================

export const AddressMutation = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.field('addAddress', {
      type: 'AddressType',
      args: {
        input: nonNull('AddressInput'),
      },
      resolve: resolvers.Mutation.addAddress,
    });
    t.field('updateAddress', {
      type: 'AddressType',
      args: {
        id: nonNull(stringArg()),
        input: nonNull('AddressInput'),
      },
      resolve: resolvers.Mutation.updateAddress,
    });
    t.field('removeAddress', {
      type: 'AddressType',
      args: {
        id: nonNull(stringArg()),
        input: nonNull('AddressInput'),
      },
      resolve: resolvers.Mutation.removeAddress,
    });
  },
});

// ================== Query =======================

export const QueryAddress = extendType({
  type: 'Query',
  definition: (t) => {
    t.list.field('getUserAddresses', {
      type: 'AddressType',
      args: {
        userId: nonNull(stringArg()),
      },
      resolve: resolvers.Query.getUserAddresses,
    });
    t.field('getAddressById', {
      type: 'AddressType',
      args: {
        id: nonNull(stringArg()),
      },
      resolve: resolvers.Query.getAddressByID,
    });
  },
});

export const AddressInput = inputObjectType({
  name: 'AddressInput',
  definition(t) {
    t.nonNull.string('libelle');
    t.nonNull.string('adresse');
    t.nonNull.boolean('isRemoved');
    t.nonNull.string('userId');
  },
});

export const AddressType = objectType({
  name: 'AddressType',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('libelle');
    t.nonNull.string('adresse');
    t.nullable.boolean('isRemoved');
    t.nonNull.boolean('defaultAddress');
    t.nonNull.boolean('fromRemote');
    t.string('userId');
  },
});
