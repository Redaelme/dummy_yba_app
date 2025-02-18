import { extendType, inputObjectType, nonNull, objectType, stringArg } from 'nexus';
import resolvers from '../resolvers';

export const UserPreferences = objectType({
  name: 'UserPreference',
  definition: (t) => {
    t.nonNull.id('id');
    t.string('workingDays');
    t.date('workingHoursBegin');
    t.date('workingHoursEnd');
    t.string('pauseHours');
    t.boolean('highCanRescheduleLow');
    t.boolean('highCanRescheduleMedium');
    t.boolean('highCanSkipPauseTimes');
    t.boolean('highCanExtendWorkingTimes');
    t.date('hightWorkingHoursBegin');
    t.date('highWorkingHoursEnd');
    t.boolean('mediumCanRescheduleLow');
    t.boolean('mediumCanSkipPauseTimes');
    t.boolean('mediumCanExtendWorkingHours');
    t.date('mediumWorkingHoursBegin');
    t.date('mediumWorkingHoursEnd');
    t.string('userId');
    t.int('waitngResponseTimeForHIM');
    t.int('waitngResponseTimeForMIM');
    t.int('waitngResponseTimeForLIM');
    t.int('averageTravelTime');
    t.field('createdAt', {
      type: 'DateTime',
    });
    t.field('updatedAt', {
      type: 'DateTime',
    });
  },
});

// ===================Inputs============================
export const UserPreferenceInputs = inputObjectType({
  name: 'UserPreferenceInputs',
  definition: (t) => {
    t.nonNull.string('workingDays');
    t.nonNull.date('workingHoursBegin');
    t.nonNull.date('workingHoursEnd');
    t.nonNull.string('pauseHours');
    t.nonNull.boolean('highCanRescheduleLow');
    t.nonNull.boolean('highCanRescheduleMedium');
    t.nonNull.boolean('highCanSkipPauseTimes');
    t.nonNull.boolean('highCanExtendWorkingTimes');
    t.nonNull.date('hightWorkingHoursBegin');
    t.nonNull.date('highWorkingHoursEnd');
    t.nonNull.boolean('mediumCanRescheduleLow');
    t.nonNull.boolean('mediumCanSkipPauseTimes');
    t.nonNull.boolean('mediumCanExtendWorkingHours');
    t.nonNull.date('mediumWorkingHoursBegin');
    t.nonNull.date('mediumWorkingHoursEnd');
    t.nonNull.string('userId');
    t.nonNull.int('waitngResponseTimeForHIM');
    t.nonNull.int('waitngResponseTimeForMIM');
    t.nonNull.int('waitngResponseTimeForLIM');
    t.nonNull.int('averageTravelTime');
    t.field('createdAt', {
      type: 'DateTime',
    });
    t.field('updatedAt', {
      type: 'DateTime',
    });
  },
});

//=====================Mutation========================
export const UserPreferenceMutation = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.field('createUserPreference', {
      type: 'UserPreference',
      args: {
        input: nonNull('UserPreferenceInputs'),
      },
      resolve: resolvers.Mutation.createUserPreference,
    });
    t.field('updateUserPreference', {
      type: 'UserPreference',
      args: {
        id: nonNull(stringArg()),
        input: nonNull('UserPreferenceInputs'),
      },
      resolve: resolvers.Mutation.updateUserPreference,
    });
  },
});

//========================Query=========================

export const UserPreferenceQuery = extendType({
  type: 'Query',
  definition: (t) => {
    t.field('getUserPreferences', {
      type: 'UserPreference',
      args: {
        userId: nonNull(stringArg()),
      },
      resolve: resolvers.Query.getUserPreferencesById,
    });
  },
});
