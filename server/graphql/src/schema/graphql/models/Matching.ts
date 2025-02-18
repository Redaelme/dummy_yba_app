import { extendType, inputObjectType, nonNull, objectType } from 'nexus';
import resolvers from '../resolvers';

// =============== INPUTS =========================
export const MatchingInputs = inputObjectType({
  name: 'MatchingInputs',
  definition(t) {
    t.list.nonNull.string('userInvited');
    t.nonNull.int('typeMail');
    t.nonNull.field('date', {
      type: 'DateInputs',
    });
    t.field('newDate', {
      type: 'DateInputs',
    });
    t.string('location');
    t.int('duration');
  },
});
export const MatchingListInputs = inputObjectType({
  name: 'MatchingListInputs',
  definition(t) {
    t.list.nonNull.string('userInvited');
    t.nonNull.int('typeMail');
    t.nonNull.list.field('dateList', {
      type: nonNull('DateInputs'),
    });
    t.list.field('newDate', {
      type: 'DateInputs',
    });
    t.string('location');
    t.int('duration');
    t.int('UTC');
    t.nonNull.string('mailId');
  },
});
export const DateInputs = inputObjectType({
  name: 'DateInputs',
  definition(t) {
    t.nonNull.date('debut');
    t.nonNull.date('fin');
  },
});
// =============MUTATION=====================
export const MatchingMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('matching', {
      type: 'Matching',
      args: {
        data: nonNull('MatchingInputs'),
      },
      resolve: resolvers.Mutation.MatchingResolvers,
    });
    t.field('matchingList', {
      type: 'MatchingList',
      args: {
        data: nonNull('MatchingListInputs'),
      },
      resolve: resolvers.Mutation.MatchingListResolvers,
    });
  },
});
// ============TYPES=========================
export const Matching = objectType({
  name: 'Matching',
  definition(t) {
    t.nonNull.boolean('busy');
    t.string('eventId');
  },
});

export const MatchingList = objectType({
  name: 'MatchingList',
  definition(t) {
    t.nonNull.boolean('busy');
    t.field('Date', {
      type: 'MatchingDate',
    });
    t.string('eventId');
  },
});

export const MatchingDate = objectType({
  name: 'MatchingDate',
  definition(t) {
    t.nonNull.string('start'), t.nonNull.string('end');
  },
});
