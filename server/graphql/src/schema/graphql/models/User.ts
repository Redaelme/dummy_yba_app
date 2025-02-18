import { booleanArg, enumType, extendType, intArg, nonNull, objectType, stringArg } from 'nexus';
import resolvers from '../resolvers';

// Types
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
    t.string('company');
    t.string('timezone');
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
    t.string('mailService');
    t.string('lang');
    t.list.field('contacts', {
      type: 'Contact',
    });
    t.boolean('signupCompleted');
    t.boolean('isSingupBO');
    t.boolean('isActive');
    t.boolean('isPayed');
    t.boolean('modeFree');
    t.field('beginModeFree', {
      type: 'DateTime',
    });
    t.string('calendarType');
    t.string('oauthStatus');
  },
});

export const UserBO = objectType({
  name: 'UserBO',
  definition(t) {
    t.nonNull.id('id');
    t.string('email');
    t.string('firstName');
    t.string('lastName');
    t.string('password');
    t.string('avatar');
    t.string('role');
  },
});

export const Contact = objectType({
  name: 'Contact',
  definition: (t) => {
    t.nonNull.string('displayName');
    // t.nonNull.string('givenName');
    // t.string('profession');
    t.nonNull.list.string('emailAddresses');
  },
});

export const EmailAddress = objectType({
  name: 'EmailUserInfo',
  definition: (t) => {
    t.nonNull.string('emailAddress');
    t.nonNull.string('name');
  },
});

export const IncomingEmail = objectType({
  name: 'IncomingEmail',
  definition: (t) => {
    t.nonNull.string('id');
    t.nonNull.date('receivedDateTime');
    t.nonNull.string('object');
    t.string('content');
    t.nonNull.boolean('isRead');
    t.nonNull.string('content');
    t.list.string('cc');
    t.nonNull.list.string('recipients');
    t.nonNull.field('sender', { type: 'EmailUserInfo' });
    t.string('htmlBody');
  },
});
export const CompleteIncomingMessage = objectType({
  name: 'CompleteIncomingMessage',
  definition: (t) => {
    t.nonNull.string('userId');
    t.list.field('incomingEmails', {
      type: 'IncomingEmail',
    });
  },
});

// ================== Queries =======================
export const UsersQueries = extendType({
  type: 'Query',
  definition: (t) => {
    t.list.field('getConnectedUserEmails', {
      type: 'OutlookEmail',
      resolve: resolvers.Query.getConnectedUserEmails,
    });

    t.field('me', {
      type: 'User',
      resolve: resolvers.Query.me,
    });
    t.field('meBO', {
      type: 'UserBO',
      resolve: resolvers.Query.meBo,
    });
    t.field('getAllUser', {
      type: 'OutUsersAll',
      args: {
        offset: intArg(),
        limite: intArg(),
        keySearch: stringArg(),
        keyFilterCompany: stringArg(),
        keyFilterActive: booleanArg(),
      },
      resolve: resolvers.Query.getAllUser,
    });
    t.list.field('getAllCompany', {
      type: 'User',
      resolve: resolvers.Query.getAllCompany,
    });
  },
});

export const OutUsersAll = objectType({
  name: 'OutUsersAll',
  definition: (t) => {
    t.nonNull.list.field('users', {
      type: 'User',
    });
    t.nonNull.int('length');
  },
});

// ====================== Mutation ==================
export const UsersMutations = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.field('saveUserFCMToken', {
      type: 'Boolean',
      args: {
        userId: nonNull('String'),
        token: nonNull('String'),
      },
      resolve: resolvers.Mutation.saveUserFCMToken,
    });
    t.field('updateStatus', {
      type: 'Boolean',
      args: {
        userId: nonNull(stringArg()),
        isActive: nonNull(booleanArg()),
      },
      resolve: resolvers.Mutation.updateStatusUser,
    });
    t.field('deleteUserInBO', {
      type: 'Boolean',
      args: {
        userId: nonNull(stringArg()),
      },
      resolve: resolvers.Mutation.deleteUserInBO,
    });
    t.field('deleteUserAccount', {
      type: 'SuccessReturn',
      args: {
        userId: nonNull(stringArg()),
      },
      resolve: resolvers.Mutation.deleteUserAccount,
    });
    t.field('updateUserMode', {
      type: 'User',
      args: {
        userId: nonNull(stringArg()),
        modeFree: nonNull(booleanArg()),
        beginModeFree: nonNull(stringArg()),
      },
      resolve: resolvers.Mutation.updateUserMode,
    });
    t.field('subscriptionValidation', {
      type: 'UserBO',
      args: {
        free: nonNull('Boolean'),
      },
      resolve: resolvers.Mutation.googleSubValidate,
    });
  },
});

