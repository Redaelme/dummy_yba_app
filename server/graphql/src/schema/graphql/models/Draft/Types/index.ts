import { objectType } from 'nexus';

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

export const Shedule = objectType({
  name: 'Shedule',
  definition(t) {
    t.boolean('success');
  },
});
// --------------OAuth----------------------
// export const OAuthType = objectType({

// })
