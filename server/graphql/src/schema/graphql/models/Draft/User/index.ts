import { enumType, extendType, objectType } from 'nexus';
import resolvers from '../../../resolvers';

export const UserRole = enumType({
  name: 'UserRole',
  members: ['ADMIN', 'USER'],
});

export const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.id('id');
    t.string('email');
    t.string('firstName');
    t.string('avatar');
    t.string('lastName');
    t.string('displayName');
    t.string('password');
    t.field('createdAt', {
      type: 'DateTime',
    });
    t.field('updatedAt', {
      type: 'DateTime',
    });
    t.field('role', {
      type: 'UserRole',
    });
    t.boolean('isAdmin', {
      resolve: (parent, _, __) => {
        return Boolean(parent.role === 'ADMIN');
      },
    });
    t.boolean('isRemoved');
    t.boolean('isBanned');
  },
});

// ================== Queries =======================
export const UsersQueries = extendType({
  type: 'Query',
  definition: (t) => {
    t.field('getUserToken', {
      type: 'String',
      resolve: resolvers.Query.getUserToken,
    });

    t.list.field('getConnectedUserEmails', {
      type: 'OutlookEmail',
      resolve: resolvers.Query.getConnectedUserEmails,
    });
  },
});
