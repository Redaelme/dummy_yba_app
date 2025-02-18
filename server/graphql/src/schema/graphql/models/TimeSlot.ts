import { extendType, inputObjectType, nonNull, objectType } from 'nexus';
import resolvers from '../resolvers';

// ======================Types =====================
export const TimeSlot = objectType({
  name: 'TimeSlot',
  definition(t) {
    t.date('start');
    t.date('end');
  },
});
export const TimeSlotList = objectType({
  name: 'TimeSlotList',
  definition(t) {
    t.list.field('TimeList', {
      type: 'TimeSlot',
    });
  },
});
// ========================Input ====================
export const TimeSlotInput = inputObjectType({
  name: 'TimeSlotInput',
  definition(t) {
    t.nonNull.string('mail');
    t.nonNull.string('date');
  },
});
// ======================== Mutation =================
export const TimeSlotRequestMutation = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.list.field('TimeSLotRequest', {
      type: 'TimeSlot',
      args: { data: nonNull('TimeSlotInput') },
      resolve: resolvers.Mutation.timeSlotRequest,
    });
  },
});
