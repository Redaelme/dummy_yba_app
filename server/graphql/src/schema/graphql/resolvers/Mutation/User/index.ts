import saveUserFCMToken from './saveUserFCMToken';
import updateFromBO from './updateFromBO';
import updateUserMode from './mode';
import googleSubValidate from './googleSubValidate';
import deleteUserAccount from "./deleteUserAccount";

export default {
    ...saveUserFCMToken,
    ...updateFromBO,
    ...updateUserMode,
    ...googleSubValidate,
    ...deleteUserAccount
};
