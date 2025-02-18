import { objectType } from 'nexus';

export const OAUthToken = objectType({
  name: 'OAuthToken',
  definition(t) {
    t.nonNull.id('id');
    t.string('email');
    t.string('token');
  },
});
