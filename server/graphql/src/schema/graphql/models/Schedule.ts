import { extendType, inputObjectType, nonNull, objectType, stringArg } from 'nexus';
import resolvers from '../resolvers';

// ======================== Types ======================
export const ScheduleType = objectType({
  name: 'Schedule',
  definition: (t) => {
    t.nonNull.string('id');
    t.nonNull.int('duration');
    t.nonNull.string('email');
    t.nonNull.field('debut', { type: 'DateTime' });
    t.nonNull.field('fin', { type: 'DateTime' });
    t.nonNull.string('objet');
    t.string('sujet');
    t.string('niveau');
    t.string('localisation');
    t.string('buildingId');
    t.string('addressId');
    t.string('lang');
    t.list.field('userInvited', { type: 'InvitedUserInfo' });
    t.nonNull.int('GMT');
    t.nonNull.boolean('visioConf');
    t.field('createdAt', {
      type: 'DateTime',
    });
    t.field('updatedAt', {
      type: 'DateTime',
    });
  },
});

export const SchedulesType = objectType({
  name: 'Schedules',
  definition: (t) => {
    t.nonNull.string('id');
    t.nonNull.int('duration');
    t.nonNull.string('email');
    t.nonNull.field('debut', { type: 'DateTime' });
    t.nonNull.field('fin', { type: 'DateTime' });
    t.field('acceptedSlot', { type: 'DateTime' });
    t.nonNull.string('objet');
    t.string('sujet');
    t.string('niveau');
    t.string('localisation');
    t.string('buildingId');
    t.string('addressId');
    t.list.field('userInvited', { type: 'InvitedUserInfo' });
    t.nonNull.boolean('visioConf');
    t.nonNull.string('type');
    t.nonNull.string('status');
    t.nonNull.string('reminder');
    t.nonNull.int('personNumber');
    t.string('eventId');
    t.string('messageId');
    t.string('lang');
    t.string('confirmedMessageId');
    t.string('usertoken');
    t.string('creationDate');
  },
});

export const InvitedUserInfo = objectType({
  name: 'InvitedUserInfo',
  definition: (t) => {
    t.nonNull.string('email');
    t.nonNull.boolean('required');
  },
});

export const Location = objectType({
  name: 'Location',
  definition(t) {
    t.nonNull.boolean('visioConf');
    t.nonNull.string('location');
  },
});

// ======================== Queries ======================
export const ScheduleQueries = extendType({
  type: 'Query',
  definition: (t) => {
    t.field('getSchedule', {
      type: 'Schedule',
      args: {
        id: nonNull(stringArg()),
      },
      resolve: resolvers.Query.getSchedule,
    });
    t.list.field('getAllSchedules', {
      type: 'Schedules',
      args: {
        userId: nonNull(stringArg()),
      },
      resolve: resolvers.Query.getAllSchedules,
    });
    t.nullable.field('getScheduleByUserAndEventId', {
      type: 'Schedules',
      args: { userId: nonNull(stringArg()), eventId: nonNull(stringArg()) },
      resolve: resolvers.Query.getScheduleByUserAndEventId,
    });
  },
});

// ======================== Mutations ======================
export const ScheduleMutations = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.field('updateSchedule', {
      type: 'Schedule',
      args: {
        id: nonNull(stringArg()),
        data: nonNull('UpdateScheduleInputs'),
      },
      resolve: resolvers.Mutation.updateSchedule,
    });
    t.field('removeSchedule', {
      type: 'Schedule',
      args: {
        scheduleId: nonNull(stringArg()),
      },
      resolve: resolvers.Mutation.removeSchedule,
    });
  },
});

// ======================== Inputs ======================
export const UpdateScheduleInputs = inputObjectType({
  name: 'UpdateScheduleInputs',
  definition(t) {
    t.list.field('userInvited', {
      type: 'UserInfoInput',
    });
    t.int('duration');
    t.string('email');
    t.field('debut', { type: 'DateTime' });
    t.field('fin', { type: 'DateTime' });
    t.string('objet');
    t.string('sujet');
    t.string('niveau');
    t.field('localisation', {
      type: 'Localisation',
    });
    t.string('buildingId');
    t.string('addressId');
    t.string('lang');
    t.string('reminder');
    t.int('UTC');
    t.nullable.string('template');
    t.nullable.string('fullName');
    t.nullable.string('lastName');
    t.field('createdAt', {
      type: 'DateTime',
    });
    t.field('updatedAt', {
      type: 'DateTime',
    });
  },
});
