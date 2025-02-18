import Config from 'react-native-config';

export const AuthConfig = {
  appId: Config.OUTLOOK_APP_ID,
  appScopes: [
    'openid',
    'email',
    'offline_access',
    'profile',
    'User.Read',
    'MailboxSettings.Read',
    'Calendars.Read',
    'Calendars.ReadWrite',
    'Mail.Read',
    // 'Mail.ReadBasic',
    'User.Read.All',
    'Calendars.ReadWrite.Shared',
    'Mail.Send',
    'Group.ReadWrite.All',
    'User.ReadWrite',
    'User.ReadWrite.All',
    'Contacts.Read',
    'Contacts.ReadWrite',
    // 'Directory.Read.All',
    // 'Directory.ReadWrite.All',
    'Place.Read.All',
    'People.Read',
    'People.Read.All',
  ],
};
