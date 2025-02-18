import Config from 'react-native-config';

export const AuthConfig = {
  appId: Config.GOOGLE_APP_ID,
  firebaseGoogleClient: Config.FIREBASE_GOOGLE_CLIENT_ID,
  appScopes: [
    'openid',
    'profile',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/gmail.modify',
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/contacts.readonly',
    'https://apps-apis.google.com/a/feeds/calendar/resource/',
    'https://www.googleapis.com/auth/admin.directory.resource.calendar',
    'https://www.googleapis.com/auth/admin.directory.resource.calendar.readonly',
    'https://www.googleapis.com/auth/contacts.other.readonly',
    'https://www.googleapis.com/auth/pubsub',
    'https://www.googleapis.com/auth/gmail.compose',
  ],
};
