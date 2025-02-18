import { extendType, objectType } from 'nexus';
import resolvers from '../resolvers';

export const OutlookEmail = objectType({
  name: 'OutlookEmail',
  definition: (t) => {
    t.nonNull.boolean('isRead');
    t.nonNull.string('bodyPreview');
    t.nonNull.string('id');
    t.field('sender', {
      type: 'OutlookEmailAdress',
      // resolve:()
    });
    t.list.field('toRecipients', {
      type: 'OutlookEmailAdress',
    });
    t.nonNull.string('subject');
  },
});

export const OutlookEmailAddress = objectType({
  name: 'OutlookEmailAdress',
  definition: (t) => {
    t.string('name');
    t.string('address');
  },
});

// ================== Queries =======================
export const OutLookEmailQueries = extendType({
  type: 'Query',
  definition: (t) => {
    t.list.field('getConnectedUserEmails', {
      type: 'OutlookEmail',
      resolve: resolvers.Query.getConnectedUserEmails,
    });
  },
});
