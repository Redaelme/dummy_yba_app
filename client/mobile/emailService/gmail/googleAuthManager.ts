// import {
//   google, // L'objet de niveau supérieur utilisé pour accéder aux services
//   drive_v3, // Pour chaque client de service, il existe un espace de noms exporté
// } from 'googleapis';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { Platform } from 'react-native';
import { AuthConfiguration } from 'react-native-app-auth';
import IAP from 'react-native-iap';
import { AuthConfig } from './authConfig';

const googleAuthConfig: AuthConfiguration = {
  // issuer: 'https://accounts.google.com',
  clientId: AuthConfig.appId,
  redirectUrl: 'urn:ietf:wg:oauth:2.0:oob:auto',
  scopes: AuthConfig.appScopes,
  additionalParameters: { prompt: 'select_account' },
  serviceConfiguration: {
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
  },
};

export class GoogleAuthManager {
  static async signInAsync() {
    try {
      GoogleAuthManager.configureGoogleSignIn();
      const result = await GoogleSignin.signIn();
      const token = await GoogleSignin.getTokens();

      console.log('signin result from  GoogleAuthManager==>', result);
      console.log("token from GoogleAuthManager==>", token);
      console.log('signin result ==>', token.accessToken);
      console.log('server code : ', result.serverAuthCode);

      return {
        idToken: 'firebaseIdToken',
        google_accesToken: token.accessToken,
        user: result.user,
        serverCode: result.serverAuthCode,
      };
    } catch (error: any) {

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        console.log('USER cancelled login flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
        console.log('operation (e.g. sign in) is in progress already');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        console.log('play services not available or outdated');
      } else {
        // some other error happened
        console.log('some other error happened', error.code);
      }
      console.log('Error while login :', error.message, error);
    }
  }

  static async signOutAsync() {
    try {
      GoogleAuthManager.configureGoogleSignIn();
      const currentUser = await GoogleSignin.getCurrentUser();
      if (currentUser) {
        // await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
      }
    } catch (error) {
      console.error('google sign out error: ', error);
    }
  }

  static configureGoogleSignIn() {
    console.log('AUTH CLIENT ==>', AuthConfig.firebaseGoogleClient);

    GoogleSignin.configure({
      webClientId: AuthConfig.firebaseGoogleClient,
      scopes: AuthConfig.appScopes,
      forceCodeForRefreshToken: true,
      offlineAccess: true,
    });
  }
  static subscribeMouthly(setProduct: any) {
    const items = Platform.select({
      ios: [],
      android: ['ybiap_1499_1m'],
    });
    console.log('INIT SUB CONNEXION');

    IAP.initConnection()
      .catch((err) => console.log('error in sub connexion==>', err))
      .then((rr) => {
        console.log('err:', rr);
        console.log(items);

        IAP.getSubscriptions(items || [])
          .catch((err) => console.log('error finding items:', err))
          .then((res) => {
            console.log('RNIAP res:', res);
            setProduct(res);
            res &&
              res.map((p) => {
                console.log();
                IAP.requestSubscription(p['productId']);
              });
          });
      });
  }
}
