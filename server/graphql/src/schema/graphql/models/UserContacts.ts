import { extendType, objectType, stringArg, nonNull } from 'nexus';
import resolvers from '../resolvers';

export const UserContact = objectType({
  name: 'UserContact',
  definition(t) {
    t.nonNull.string('displayName');
    t.nonNull.list.string('emailAddresses');
  },
});

export const UserContactsQuery = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('getUserContacts', {
      type: 'UserContact',
      args: {
        userId: nonNull(stringArg()),
      },
      async resolve(_, { userId }, ctx) {
        console.log('userId ===> ', userId);
        return resolvers.user.contacts({id: userId}, {}, ctx);
      },
    });
  },
});