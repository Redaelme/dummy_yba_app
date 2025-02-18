import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import { NAVIGATION_REGISTER, NotificationTypes } from '../commons/constant';
import { NavigationRegister } from './NavigationRegister';
import { Register } from './Register';
import { getRealmNotification } from './firebase';
// import { useContext, useEffect } from 'react';

import { RealmMeContext } from '../providers/RealmProvider/RealmMeProvider/RealmMeProvider';
import { IMessage } from '../providers/RealmProvider/interfaces';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from "react-native";

export const PushNotificationConfigure = () => {
  //const { setMailToClassify } = useContext(RealmMeContext);

  //useEffect(() => {}, []);
  try {
    PushNotification.configure({
      onNotification: async function (notification) {
        console.log('NOTIFICATION ARRIVED :', notification);
        // Alert.alert("NOTIFICATION ARRIVED");
        if (notification.userInteraction) {
          const id = (notification as any).messageId;
          const navigationContact: NavigationRegister = Register.get(NAVIGATION_REGISTER);
          const data = await getRealmNotification(id);
          if (data && data.data) {
            const parsedData = JSON.parse(data?.data);
            switch (parsedData.type) {
              case NotificationTypes.SCHEDULE:
                navigationContact.goToContact(parsedData);
                break;
              case NotificationTypes.INCOMING_EMAIL:
                navigationContact.goToMeetingRequestReceived();
                await AsyncStorage.removeItem('DateString');
                break;
            }
          }
        }
        // process the notification

        // (required) Called when a remote is received or opened, or local notification is opened
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },

      // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
      onAction: function (notification) {
        //console.log("NOTIFICATION:", notification);
        // process the action
      },

      // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
      onRegistrationError: function (err) {
        console.error(err.message, err);
      },

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      // Should the initial notification be popped autom  atically
      // default: true
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       * - if you are not using remote notification or do not have Firebase installed, use this:
       *     requestPermissions: Platform.OS === 'ios'
       */
      requestPermissions: true,
    });
  } catch (error) {
    console.log('ERROORR=', error);
  }
  PushNotification.createChannel(
    {
      channelId: 'fcm_fallback_notification_channel', // (required)
      channelName: 'yesboss_channel', // (required)
      channelDescription: 'A channel to categorise your notifications', // (optional) default: undefined.
      playSound: true, // (optional) default: true
      vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
    },
    (created) => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
  );
  // return null;
};
