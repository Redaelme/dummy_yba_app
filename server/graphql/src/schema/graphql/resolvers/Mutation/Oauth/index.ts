import generateAccessTokenResolvers from './generateAccessTokenResolvers';
import Oauth from './Oauth';
import updateOauth from './updateOauth';

export default {
  ...Oauth,
  ...updateOauth,
  ...generateAccessTokenResolvers,
};
