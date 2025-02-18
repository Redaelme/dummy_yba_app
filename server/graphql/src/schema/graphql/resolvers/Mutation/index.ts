import Authentication from './Authentication';
import Oauth from './Oauth';
import removeEvent from './RemoveEvent/removeEvent';
import User from './User';

export default {
  ...Authentication,
  ...Oauth,
  ...removeEvent,
  ...User
};
