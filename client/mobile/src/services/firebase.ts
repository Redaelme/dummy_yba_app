import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import { RealmNotification } from '../providers/RealmProvider/interfaces';
import Realm from 'realm';
import RealmSchema from '../providers/RealmProvider/schema';
import { NOTIFICATION_SCHEMA } from '../models/Notification';
import { MESSAGE_ID } from '../commons/constant';

export const requestUserPermission = async () => {
  const authorizationStatus = await messaging().requestPermission();
  if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
    console.log('User has notification permissions enabled.');
  } else if (authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL) {
    console.log('User has provisional notification permissions.');
  } else {
    console.log('User has notification permissions disabled');
  }
};

export const getToken = async (): Promise<string> => messaging().getToken();

export const pushLocalNotification = (
  remoteMessage: FirebaseMessagingTypes.RemoteMessage,
): void => {
  console.log('enter in push local notification');

  const { data, messageId } = remoteMessage;

  const realmNotification: RealmNotification = {
    data: data ? JSON.stringify(data) : '{}',
    id: messageId || '',
  };

  createRealmNotification(realmNotification)
    .then(async (res) => {
      console.log('notification created Successfully');
      if (data) {
        const parsedData = JSON.parse(data['data']);
        const mail = JSON.parse(data.mail);
        await AsyncStorage.setItem(MESSAGE_ID, JSON.stringify(mail));
      }
    })
    .catch((err) => {
      console.log('Error while creating');
    });

  PushNotification.localNotification({
    channelId: 'fcm_fallback_notification_channel', // (required) channelId, if the channel doesn't exist, notification will not trigger.
    ticker: 'My Notification Ticker', // (optional)
    message:
      remoteMessage.notification && remoteMessage.notification.body
        ? remoteMessage.notification.body
        : '',
    title:
      remoteMessage.notification && remoteMessage.notification.title
        ? remoteMessage.notification.title
        : '',
    vibrate: true,
    vibration: 300,
    priority: 'max',
    importance: 'max',
    messageId,
  });
};

export const NOTIFICATION_PUSH = 'NOTIFICATION_PUSH';
export const saveNotification = async (notification: FirebaseMessagingTypes.RemoteMessage) => {
  const data = notification.data || {};
  await AsyncStorage.setItem(NOTIFICATION_PUSH, JSON.stringify(data));
};

export const initRealm = async () => {
  return Realm.open({ schema: RealmSchema, schemaVersion: 1 })
    .then((realm: Realm) => {
      console.log('Connected successfully to RealmDB');
      return realm;
    })
    .catch((error: any) => {
      console.log('Realm connection error:', error);
      return null;
    });
};

export const createRealmNotification = async (notification: RealmNotification) => {
  const realm = await initRealm();

  if (realm) {
    realm.write(() => {
      realm.create<RealmNotification>(NOTIFICATION_SCHEMA, notification, Realm.UpdateMode.All);
    });
  }
};

export const getRealmNotification = async (id: string) => {
  const realm = await initRealm();

  if (realm) {
    const res = realm
      .objects<RealmNotification>(NOTIFICATION_SCHEMA)
      .filter((item) => item.id === id)
      .map((result) => result);
    return res.length ? res[0] : null;
  }
  return null;
};
// PushNotification.localNotification({
//   channelId: 'com.yesboss', // (required) channelId, if the channel doesn't exist, notification will not trigger.
//   ticker: 'My Notification Ticker', // (optional)
//   message: JSON.stringify(remoteMessage.notification?.body),
//   title: JSON.stringify(remoteMessage.notification?.title),
//   vibrate: true,
//   vibration: 300,
//   priority: 'max',
//   importance: 'max',
// });
