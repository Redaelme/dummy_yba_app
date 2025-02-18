import { extendType, inputObjectType, list, nonNull, objectType } from 'nexus';
import resolvers from '../resolvers';

// ======================== Types ===================
export const SuccessReturn = objectType({
  name: 'SuccessReturn',
  definition(t) {
    t.nonNull.boolean('success');
    t.nonNull.string('message');
  },
});

export const AuthUser = objectType({
  name: 'AuthUser',
  definition(t) {
    t.nonNull.field('user', {
      type: 'User',
    });
    t.nonNull.string('token');
    t.boolean('completedSignUp');
  },
});

export const AuthUserBO = objectType({
  name: 'AuthUserBO',
  definition(t) {
    t.nonNull.field('userBO', {
      type: 'UserBO',
    });
    t.nonNull.string('token');
  },
});

// --------- Appointement Sheduler -------------
export const SheduleType = objectType({
  name: 'SheduleType',
  definition(t) {
    t.date('start');
    t.date('end');
    t.int('duration');
  },
});
export const SenderType = objectType({
  name: 'SenderType',
  definition(t) {
    t.string('emailAddress');
    t.string('name');
  },
});
export const GetUserMail = objectType({
  name: 'GetUserMail',
  definition(t) {
    t.list.string('cc');
    t.string('content');
    t.string('htmlBody');
    t.string('id');
    t.boolean('isRead');
    t.string('object');
    t.string('receivedDateTime');
    t.list.string('recipients');
    t.string('subject');
    t.field('sender', {
      type: 'SenderType',
    });
  },
});

// ================================ Mutation =========================
export const AppointmentsShedulerMutation = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.field('AppointmentsScheduler', {
      type: list('TimeSlot'),
      args: {
        appointmentsInput: nonNull(AppointmentsShedulerInput),
      },
      resolve: resolvers.Mutation.appointmentScheduler,
    });
  },
});
export const GetGmailMailMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('getUserMail', {
      type: list('GetUserMail'),
      args: {
        data: 'GetMailInputs',
      },
      resolve: resolvers.Mutation.getUserMailResolvers,
    });
  },
});
export const CalendarMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('removeEvent', {
      type: 'Boolean',
      args: { data: nonNull('removeEventInputs') },
      resolve: resolvers.Mutation.removeEvent,
    });
  },
});
// ================================= Inputs ==========================

export const Localisation = inputObjectType({
  name: 'Localisation',
  definition(t) {
    t.nonNull.boolean('visioConf');
    t.nonNull.string('location');
  },
});

export const UserInfoInput = inputObjectType({
  name: 'UserInfoInput',
  definition(t) {
    t.nonNull.string('email');
    t.nonNull.boolean('required');
  },
});
export const GetMailInputs = inputObjectType({
  name: 'GetMailInputs',
  definition(t) {
    t.nonNull.int('maxResult');
    //t.date('minDate');
  },
});

export const AppointmentsShedulerInput = inputObjectType({
  name: 'AppointmentsShedulerInput',
  definition(t) {
    t.list.field('userInvited', {
      type: 'UserInfoInput',
    });
    t.nonNull.int('duration');
    t.nonNull.string('email');
    t.nonNull.field('debut', { type: 'DateTime' });
    t.nonNull.field('fin', { type: 'DateTime' });
    t.nonNull.string('objet');
    t.string('sujet');
    t.nonNull.string('niveau');
    t.nonNull.field('localisation', {
      type: 'Localisation',
    });
    t.nonNull.string('buildingId');
    t.string('addressId');
    t.nonNull.string('reminder');
    t.nonNull.int('UTC');
    t.nullable.string('template');
    t.nullable.string('fullName');
    t.nullable.string('lastName');
    t.string('scheduleId');
    t.string('lang');
    t.string('eventId');
    t.int('capacity');
    t.boolean('meetingRescheduled');
  },
});
export const removeEventInputs = inputObjectType({
  name: 'removeEventInputs',
  definition(t) {
    t.nonNull.string('eventId');
    t.nonNull.string('email');
  },
});
