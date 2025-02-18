import { extendType, inputObjectType, nonNull, objectType } from 'nexus';
import resolvers from '../resolvers';

// --------------OAuth----------------------
export const Oauth = objectType({
  name: 'Oauth',
  definition(t) {
    t.nonNull.id('id');
    t.string('email');
    t.string('access_token');
  },
});
export const generateAccessTokenType = objectType({
  name: 'generateAccessTokenType',
  definition(t) {
    t.nonNull.string('token');
    t.nonNull.string('refresh_token');
    t.nonNull.string('token_type');
    t.nonNull.date('expiry_date');
  },
});
// ======= input ========
export const OauthInput = inputObjectType({
  name: 'OauthInput',
  definition(t) {
    t.nonNull.string('email');
    t.nonNull.string('access_token');
  },
});
export const generateAccessTokenInput = inputObjectType({
  name: 'generateAccessTokenInput',
  definition(t) {
    t.nonNull.string('serverAuthCode');
  },
});
export const OauthUpdateInput = inputObjectType({
  name: 'OauthUpdateInput',
  definition(t) {
    t.nonNull.string('email');
    t.string('token');
    t.string('refreshToken');
    t.string('tokenExpiryDateTime');
  },
});
export const notificationUpdateInput = inputObjectType({
  name: 'notificationUpdateInput',
  definition(t) {
    t.nonNull.string('email');
    t.nonNull.string('token');
  },
});
// ======= mutation ======
export const OauthMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createOauth', {
      type: 'Oauth',
      args: { data: nonNull('OauthInput') },
      resolve: resolvers.Mutation.Oauth,
    });
    t.field('updateAuth', {
      type: 'String',
      args: { data: nonNull('OauthUpdateInput') },
      resolve: resolvers.Mutation.updateOauth,
    });
    t.field('generateAccessToken', {
      type: 'generateAccessTokenType',
      args: { code: nonNull('String') },
      resolve: resolvers.Mutation.generateAccessTokenResolvers,
    });
  },
});
