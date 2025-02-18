import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthManager } from '../../../../emailService/microsoft/auth/authManager';
import { GraphManager } from '../../../../emailService/microsoft/graph/graphManager';

export const signInOutlook = async (setLoading: (loading: boolean) => void) => {
  await AuthManager.signInAsync();
  setLoading(true);
  const token = await AuthManager.getAccessTokenAsync();
  const user = await GraphManager.getUserAsync();
  console.log('User: ', user);
  const userPrincipalName = user.userPrincipalName ? user.userPrincipalName.toLowerCase() : '';
  await AsyncStorage.setItem('userEmail', userPrincipalName);
  setLoading(false);
  console.log('User Email: ', userPrincipalName);
  return {
    email: userPrincipalName,
    firstName: user.surname,
    lastName: user.givenName,
  }
};
export const signInGoogle = async (
  googleSignIn: () => Promise<{
    idToken: string;
    google_accesToken: string;
    user: {
      id: string;
      name: string | null;
      email: string;
      photo: string | null;
      familyName: string | null;
      givenName: string | null;
    };
    serverCode: string | null;
  } | null> | null,
) => {
  const res = await googleSignIn();
  if (res && res.user && res.serverCode) {
    await AsyncStorage.setItem('userEmail', res.user.email);
    return {
      email: res.user.email,
      token: res.google_accesToken,
      serverCode: res.serverCode,
    };
  }
};

export const signOutOutlook = async () => {
  await AuthManager.signOutAsync();
};

export const storeInfosUserInAsync = async (
  nom: string,
  prenom: string,
  pass: string,
  serviceMail: string,
) => {
  const data = [nom, prenom, pass, serviceMail];
  await AsyncStorage.setItem('userInfos', JSON.stringify(data));
};
