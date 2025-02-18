import { extendType, inputObjectType, intArg, list, nonNull, objectType, stringArg } from 'nexus';
import resolvers from '../resolvers';

// ===================Type=============================
export const CalendarEvent = objectType({
  name: 'CalendarEvent',
  definition(t) {
    t.string('kind');
    t.string('etag');
    t.string('id');
    t.string('status');
    t.string('htmlLink');
    t.string('created');
    t.string('updated');
    t.string('summary');
    t.string('description');
    t.string('colorId');
    t.string('creator');
    t.string('organizer');
    t.date('start');
    t.date('end');
    t.string('eventType');
    t.list.field('attendees', {
      type: 'Attendees',
    });
    t.string('location');
    t.string('onlineMeeting');
    t.int('reminderMinutesBeforeStart');
    t.string('subject');
    t.string('level');
    t.string('lang');
  },
});
export const Attendees = objectType({
  name: 'Attendees',
  definition(t) {
    t.string('email');
    t.string('responseStatus');
    t.string('name');
  },
});
export const RoomsData = objectType({
  name: 'RoomsData',
  definition(t) {
    t.string('resourcesId');
    t.string('resourceName');
    t.string('resourceType');
    t.string('generatedResourceName');
    t.string('resourceEmail');
    t.int('capacity');
    t.string('buildingId');
    t.string('resourceCategory');
  },
});
// ===================Mutation=========================
export const CalendarMutations = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.field('outlookAppointmentScheduler', {
      type: 'Boolean',
      args: {
        appointmentsInputs: nonNull('AppointmentsShedulerInput'),
      },
      resolve: resolvers.Mutation.outlookAppointmentScheduler,
    });
    t.field('removeEventByEventId', {
      type: 'SuccessReturn',
      args: {
        eventId: nonNull(stringArg()),
        userId: nonNull(stringArg()),
        GMT: nonNull(intArg()),
      },
      resolve: resolvers.Mutation.removeEventByEventId,
    });
  },
});
// ===================Queries ==========================
export const CalendarQueries = extendType({
  type: 'Query',
  definition(t) {
    t.field('getEventList', {
      type: list('CalendarEvent'),
      args: {
        calendarInputs: nonNull('CalendarInputs'),
      },
      resolve: resolvers.Mutation.GetEvent,
    });
    t.field('getRooms', {
      type: list('RoomsData'),
      args: {
        getRoomsInputs: 'getRoomsInputs',
      },
      resolve: resolvers.Query.getRoomsResolvers,
    });
    t.field('getEventById', {
      type: 'CalendarEvent',
      args: {
        id: nonNull(stringArg()),
      },
      resolve: resolvers.Query.getEventById,
    });
  },
});
// ===================intputs=============================
export const CalendarInputs = inputObjectType({
  name: 'CalendarInputs',
  definition(t) {
    t.nonNull.date('debut');
    t.nonNull.date('fin');
  },
});
export const getRoomsInputs = inputObjectType({
  name: 'getRoomsInputs',
  definition(t) {
    t.int('maxResults');
  },
});
