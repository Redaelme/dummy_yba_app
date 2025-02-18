import { extendType, inputObjectType, list, nonNull, objectType, stringArg } from 'nexus';
import resolvers from '../resolvers';

export const IncomingRequestType = objectType({
  name: 'IncomingRequestType',
  definition: (t) => {
    t.field('updatedAt', {
      type: 'DateTime',
    });
    t.string('id');
    t.string('typeMail');
    t.string('location');
    t.string('sender');
    t.string('recipients');
    t.string('object');
    t.string('senderFullName');
    t.string('contents');
    t.string('dateEntity');
    t.string('userId');
    t.string('lang');
    t.string('appointmentStatus');
    t.string('appointmentUserAction');
    t.string('eventId');
    t.string('htmlBody');
    t.nonNull.int('GMT');
    t.date('createdAt');
    t.nullable.string('sheduleId');
    t.nullable.string('schedulePriority');
  },
});

export const IncomingRequestInput = inputObjectType({
  name: 'IncomingRequestInput',
  definition: (t) => {
    t.nonNull.string('mailId');
    t.string('typeMail');
    t.string('location');
    t.string('sender');
    t.string('recipients');
    t.string('object');
    t.string('senderFullName');
    t.string('contents');
    t.string('dateEntity');
    t.string('appointmentStatus');
    t.string('lang');
    t.nullable.string('appointmentUserAction');
    t.nullable.string('eventId');
    t.string('htmlBody');
    t.nonNull.int('GMT');
    t.nonNull.string('receivedDatetime');
    t.nullable.string('sheduleId');
    t.nullable.string('schedulePriority');
  },
});
export const UpdateIncomingRequestReceveidDateTimeInputs = inputObjectType({
  name: 'UpdateIncomingRequestReceveidDateTimeInputs',
  definition(t) {
    t.nonNull.string('receivedDateTime');
    t.nonNull.string('mailId');
  },
});

export const IncomingRequestQuery = extendType({
  type: 'Query',
  definition: (t) => {
    t.list.field('getIncomingRequests', {
      type: 'IncomingRequestType',
      args: {
        userId: nonNull(stringArg()),
      },
      resolve: resolvers.Query.getIncomingRequestsByUserId,
    });
  },
});

export const IncomingRequest = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('refusalMail', {
      type: 'SuccessReturn',
      args: {
        data: nonNull('RefusalMailInput'),
      },
      resolve: resolvers.Mutation.refusalMail,
    });
    t.field('acceptMail', {
      type: 'SuccessReturn',
      args: {
        input: nonNull('AcceptMailInput'),
      },
      resolve: resolvers.Mutation.acceptMail,
    });
    t.list.field('addIncomingRequest', {
      type: 'IncomingRequestType',
      args: {
        inputs: list('IncomingRequestInput'),
      },
      resolve: resolvers.Mutation.addIncomingRequest,
    });
    t.field('deleteIncomingRequest', {
      type: 'IncomingRequestType',
      args: {
        incomingRequestId: nonNull(stringArg()),
      },
      resolve: resolvers.Mutation.deleteIncomingRequest,
    });
    t.field('updateIncomingRequest', {
      type: 'SuccessReturn',
      args: {
        inputs: nonNull('UpdateIncomingRequestInput'),
      },
      resolve: resolvers.Mutation.updateIncomingRequest,
    });
    t.field('updateIncomingRequestReceveidDateTimeMutation', {
      type: 'Boolean',
      args: { data: nonNull('UpdateIncomingRequestReceveidDateTimeInputs') },
      resolve: resolvers.Mutation.UpdateIncomingRequestReceveidDateResolvers,
    });
  },
});

export const RefusalMailInput = inputObjectType({
  name: 'RefusalMailInput',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('appointmentUserAction');
    t.nonNull.string('emailPayload');
  },
});

export const AcceptMailInput = inputObjectType({
  name: 'AcceptMailInput',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('appointmentUserAction');
    t.nonNull.string('emailPayload');
  },
});

export const UpdateIncomingRequestInput = inputObjectType({
  name: 'UpdateIncomingRequestInput',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('appointmentUserAction');
  },
});

export const AcceptMailWithoutSlotProposalInput = inputObjectType({
  name: 'AcceptMailWithoutSlotProposalInput',
  definition(t) {
    t.nonNull.string('from');
    t.nonNull.string('to');
    t.nonNull.string('subject');
    t.nonNull.string('calendar');
    t.nonNull.string('location');
    t.nonNull.list.string('slotProposal');
  },
});

export const AcceptMailWithVisioInput = inputObjectType({
  name: 'AcceptMailWithVisioInput',
  definition(t) {
    t.nonNull.string('from');
    t.nonNull.string('to');
    t.nonNull.string('subject');
    t.nonNull.string('date');
  },
});
