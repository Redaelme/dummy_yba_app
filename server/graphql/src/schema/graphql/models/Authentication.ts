import { enumType, extendType, inputObjectType, nonNull, objectType, stringArg } from 'nexus';
import resolvers from '../resolvers';

// ======================== Mutations ==================
export const AuthenticationMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('signUp', {
      type: 'AuthUser',
      args: {
        userInput: nonNull(UserCreateInput),
      },
      resolve: resolvers.Mutation.signUp,
    });
    t.field('singupFromBO', {
      type: nonNull('Boolean'),
      args: {
        userInputBO: nonNull(UserFromBOInput),
      },
      resolve: resolvers.Mutation.sinupFromBO,
    });
    t.field('login', {
      type: 'AuthUser',
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
        deviceToken: stringArg(),
      },
      resolve: resolvers.Mutation.login,
    });
    t.field('loginBO', {
      type: 'AuthUserBO',
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      resolve: resolvers.Mutation.loginBO,
    });
    t.field('changePassword', {
      type: 'User',
      args: {
        input: nonNull('ChangePasswordInput'),
      },
      resolve: resolvers.Mutation.changePassword,
    });
    t.field('resetPassword', {
      type: 'SuccessReturn',
      args: {
        input: nonNull('ResetPasswordInput'),
      },
      resolve: resolvers.Mutation.resetPassword,
    });
    t.field('forgotPassword', {
      type: 'SuccessReturn',
      args: {
        email: nonNull(stringArg()),
      },
      resolve: resolvers.Mutation.forgotPassword,
    });
    t.field('checkExpiredToken', {
      type: 'SuccessReturn',
      args: {
        email: nonNull(stringArg()),
        token: nonNull(stringArg()),
      },
      resolve: resolvers.Mutation.checkExpiredToken,
    });
    t.field('updateProfile', {
      type: 'User',
      args: {
        id: nonNull(stringArg()),
        input: nonNull(UserProfileInput),
      },
      resolve: resolvers.Mutation.updateProfile,
    });
    t.field('updatePassword', {
      type: 'User',
      args: {
        id: nonNull(stringArg()),
        oldPassword: nonNull(stringArg()),
        newPassword: nonNull(stringArg()),
      },
      resolve: resolvers.Mutation.updatePassword,
    });
    t.field('updateUserBO', {
      type: 'Boolean',
      args: {
        id: nonNull(stringArg()),
        newEmail: stringArg(),
        newPassword: stringArg(),
      },
      resolve: resolvers.Mutation.updateUserBO,
    });
    t.field('revokeNotificationToken', {
      type: 'Boolean',
      args: {
        token: nonNull('String'),
      },
      resolve: resolvers.Mutation.revokeNotificationToken,
    });
    t.field('addNotificationToken', {
      type: 'String',
      args: {
        userId: nonNull('String'),
        token: nonNull('String'),
      },
      resolve: resolvers.Mutation.addNotificationToken,
    });
  },
});

// ======================== Inputs =====================
export const ChangePasswordInput = inputObjectType({
  name: 'ChangePasswordInput',
  definition(t) {
    t.nonNull.string('email');
    t.nonNull.string('newPassword');
  },
});

export const ResetPasswordInput = inputObjectType({
  name: 'ResetPasswordInput',
  definition(t) {
    t.nonNull.string('token');
    t.nonNull.string('email');
    t.nonNull.string('newPassword');
  },
});

export const UserCreateInput = inputObjectType({
  name: 'UserCreateInput',
  definition(t) {
    t.nonNull.string('email');
    t.nonNull.string('firstName');
    t.nonNull.string('lastName');
    t.nonNull.string('password');
    t.nonNull.field('mailService', {
      type: 'MailService',
    });
    t.nonNull.field('calendarType', {
      type: 'CalendarTypes',
    });
    t.nonNull.field('mailServiceAuth', {
      type: 'MailServiceAuthInputs',
    });
    t.nonNull.string('notificationToken');
    t.string('id');
    t.string('timezone');
    t.string('lang');
    t.boolean('signupCompleted');
  },
});

export const UserFromBO = inputObjectType({
  name: 'UserFromBO',
  definition(t) {
    t.nonNull.string('email');
    t.nonNull.string('firstName');
    t.nonNull.string('lastName');
    t.nonNull.string('password');
    t.nonNull.string('company');
  },
});

export const UserFromBOInput = inputObjectType({
  name: 'UserFromBOInput',
  definition(t) {
    t.nonNull.list.field('input', {
      type: 'UserFromBO',
    });
  },
});

export const UserProfileInput = inputObjectType({
  name: 'UserProfileInput',
  definition(t) {
    t.nullable.string('email');
    t.nullable.string('firstName');
    t.nullable.string('lastName');
    t.nullable.string('displayName');
  },
});

export const MailServiceAuthInputs = inputObjectType({
  name: 'MailServiceAuthInputs',
  definition: (t) => {
    t.nonNull.string('accessToken');
    t.nonNull.string('refreshToken');
    t.nonNull.string('tokenExpiryDateTime');
  },
});

// ========================= Type ===========================
export const MailService = enumType({
  members: ['GOOGLE', 'MICROSOFT'],
  name: 'MailService',
});

export const CalendarTypes = enumType({
  name: 'CalendarTypes',
  members: ['APPLE_CALENDAR', 'GOOGLE'],
});
