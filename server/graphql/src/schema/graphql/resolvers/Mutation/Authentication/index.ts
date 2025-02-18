import addNotificationToken from './addNotificationToken';
import addAddress from './address';
import changePassword from './changePassword';
import checkExpiredToken from './checkExpiredToken';
import forgotPassword from './forgotPassword';
import login from './login';
import logout from './logout';
import resetPassword from './resetPassword';
import revokeNotificationToken from './revokeNotificationToken';
import signUp from './signUp';
import updatePassword from './updatePassword';
import updateProfile from './updateProfile';
import getUserMailResolvers from './getUserMailResolvers';
import updateUserBO from './updateUserBO';

export default {
  ...changePassword,
  ...checkExpiredToken,
  ...forgotPassword,
  ...login,
  ...resetPassword,
  ...signUp,
  ...updatePassword,
  ...updateProfile,
  ...revokeNotificationToken,
  ...addNotificationToken,
  ...addAddress,
  ...getUserMailResolvers,
  ...logout,
  ...updateUserBO,
};
