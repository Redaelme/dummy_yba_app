import { extendType, inputObjectType, list, nonNull, objectType, stringArg } from 'nexus';
import resolvers from '../resolvers';

export const IncomingMeetingRequestType = objectType({
  name: 'IncomingMeetingRequestType',
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
    t.string('messageId');
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

export const IncomingMeetingRequestInput = inputObjectType({
  name: 'IncomingMeetingRequestInput',
  definition: (t) => {
    t.nonNull.string('mailId');
    t.string('typeMail');
    t.string('location');
    t.string('sender');
    t.string('recipients');
    t.string('object');
    t.string('senderFullName');
    t.string('contents');
    t.string('messageId');
    t.string('lang');
    t.string('dateEntity');
    t.string('appointmentStatus');
    t.nullable.string('appointmentUserAction');
    t.nullable.string('eventId');
    t.string('htmlBody');
    t.nonNull.int('GMT');
    t.nonNull.string('receivedDatetime');
    t.nullable.string('sheduleId');
    t.nullable.string('schedulePriority');
  },
});
export const UpdateIncomingMeetingRequestReceveidDateTimeInputs = inputObjectType({
  name: 'UpdateIncomingMeetingRequestReceveidDateTimeInputs',
  definition(t) {
    t.nonNull.string('receivedDateTime');
    t.nonNull.string('mailId');
  },
});

export const IncomingMeetingRequestQuery = extendType({
  type: 'Query',
  definition: (t) => {
    t.list.field('getIncomingMeetingRequests', {
      type: 'IncomingMeetingRequestType',
      args: {
        userId: nonNull(stringArg()),
      },
      resolve: resolvers.Query.getIncomingMeetingRequestsByUserId,
    });
  },
});

export const IncomingMeetingRequest = extendType({
  type: 'Mutation',
  definition(t) {
    // t.field('refusalMail', {
    //   type: 'SuccessReturn',
    //   args: {
    //     data: nonNull('RefusalMailInput'),
    //   },
    //   resolve: resolvers.Mutation.refusalMail,
    // });
    // t.field('acceptMail', {
    //   type: 'SuccessReturn',
    //   args: {
    //     input: nonNull('AcceptMailInput'),
    //   },
    //   resolve: resolvers.Mutation.acceptMail,
    // });
    t.list.field('addIncomingMeetingRequest', {
      type: 'IncomingMeetingRequestType',
      args: {
        inputs: list('IncomingMeetingRequestInput'),
      },
      resolve: resolvers.Mutation.addIncomingMeetingRequest,
    });
    t.field('deleteIncomingMeetingRequest', {
      type: 'IncomingMeetingRequestType',
      args: {
        incomingRequestId: nonNull(stringArg()),
      },
      resolve: resolvers.Mutation.deleteIncomingMeetingRequest,
    });
    t.field('updateIncomingMeetingRequest', {
      type: 'SuccessReturn',
      args: {
        inputs: nonNull('UpdateIncomingMeetingRequestInput'),
      },
      resolve: resolvers.Mutation.updateIncomingMeetingRequest,
    });
    t.field('updateIncomingMeetingRequestReceveidDateTimeMutation', {
      type: 'Boolean',
      args: { data: nonNull('UpdateIncomingMeetingRequestReceveidDateTimeInputs') },
      resolve: resolvers.Mutation.UpdateIncomingMeetingRequestReceveidDateResolvers,
    });
  },
});

// export const RefusalMailInput = inputObjectType({
//   name: 'RefusalMailInput',
//   definition(t) {
//     t.nonNull.string('id');
//     t.nonNull.string('appointmentUserAction');
//   },
// });
//
// export const AcceptMailInput = inputObjectType({
//   name: 'AcceptMailInput',
//   definition(t) {
//     t.nonNull.string('id');
//     t.nonNull.string('appointmentUserAction');
//   },
// });
//
export const UpdateIncomingMeetingRequestInput = inputObjectType({
  name: 'UpdateIncomingMeetingRequestInput',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('appointmentUserAction');
  },
});
//
// export const AcceptMailWithoutSlotProposalInput = inputObjectType({
//   name: 'AcceptMailWithoutSlotProposalInput',
//   definition(t) {
//     t.nonNull.string('from');
//     t.nonNull.string('to');
//     t.nonNull.string('subject');
//     t.nonNull.string('calendar');
//     t.nonNull.string('location');
//     t.nonNull.list.string('slotProposal');
//   },
// });
//
// export const AcceptMailWithVisioInput = inputObjectType({
//   name: 'AcceptMailWithVisioInput',
//   definition(t) {
//     t.nonNull.string('from');
//     t.nonNull.string('to');
//     t.nonNull.string('subject');
//     t.nonNull.string('date');
//   },
// });
