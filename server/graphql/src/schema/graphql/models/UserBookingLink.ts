import { extendType, inputObjectType, nonNull, objectType, stringArg } from 'nexus';
import resolvers from '../resolvers';

export const BookingTimeInput = inputObjectType({
  name: 'BookingTimeInput',
  definition(t) {
    t.nonNull.string('start');
    t.nonNull.string('end');
    t.nonNull.boolean('isAvailable');
  },
});

export const BookingLinkInput = inputObjectType({
  name: 'BookingLinkInput',
  definition(t) {
    t.nonNull.string('userId');
    t.nonNull.string('language');
    t.nonNull.int('duration');
    t.nonNull.string('level');
    t.nonNull.int('expirationDuration');
    t.field('bookingTimes', {
      type: 'BookingTimesInput',
    });
  },
});

export const BookingTimesInput = inputObjectType({
  name: 'BookingTimesInput',
  definition(t) {
    t.field('monday', { type: 'BookingTimeInput' });
    t.field('tuesday', { type: 'BookingTimeInput' });
    t.field('wednesday', { type: 'BookingTimeInput' });
    t.field('thursday', { type: 'BookingTimeInput' });
    t.field('friday', { type: 'BookingTimeInput' });
    t.field('saturday', { type: 'BookingTimeInput' });
    t.field('sunday', { type: 'BookingTimeInput' });
  },
});

export const UserBookingLinkMutation = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.field('createUserBookingLink', {
      type: 'String',
      args: {
        data: 'BookingLinkInput',
      },
      resolve: resolvers.Mutation.createUserBookingLink,
    });
  },
});

export const BookingTime = objectType({
  name: 'BookingTime',
  definition(t) {
    t.nonNull.string('start');
    t.nonNull.string('end');
    t.nonNull.boolean('isAvailable');
  },
});

export const BookingTimes = objectType({
  name: 'BookingTimes',
  definition(t) {
    t.field('monday', { type: 'BookingTime' });
    t.field('tuesday', { type: 'BookingTime' });
    t.field('wednesday', { type: 'BookingTime' });
    t.field('thursday', { type: 'BookingTime' });
    t.field('friday', { type: 'BookingTime' });
    t.field('saturday', { type: 'BookingTime' });
    t.field('sunday', { type: 'BookingTime' });
  },
});

export const UserBookingLink = objectType({
  name: 'UserBookingLinkPreference',
    definition(t) {
        // t.string('userId');
        t.string('language');
        t.int('duration');
        t.string('level');
        t.int('expirationDuration');
        t.string('bookingTimes');
    },
});

//========================Query=========================

export const UserBookingPreferenceQuery = extendType({
  type: 'Query',
  definition: (t) => {
    t.field('getUserBookingPreferences', {
      type: 'UserBookingLinkPreference',
      args: {
        userId: nonNull(stringArg()),
      },
      resolve: resolvers.Query.getUserBookingPreferencesById,
    });
  },
});
