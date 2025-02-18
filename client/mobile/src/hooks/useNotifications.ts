import {useCallback, useContext, useEffect, useState} from 'react';
import messaging, {FirebaseMessagingTypes} from '@react-native-firebase/messaging';
import {Alert, Linking, Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSaveUserFcmTokenMutation} from "../generated/graphql";
import {MeContext} from "../providers/me/meProvider";
import {RealmNotification} from "../providers/RealmProvider/interfaces";
import {MESSAGE_ID} from "../commons/constant";
import PushNotification from "react-native-push-notification";
import {createRealmNotification} from "../services/firebase";

// Keys for storing data in AsyncStorage
const DEVICE_TOKEN_KEY = '@device_token';
const TOKEN_TIMESTAMP_KEY = '@token_timestamp';

// Interface to represent the result of requesting notification permissions
interface NotificationPermissionResult {
    status: 'granted' | 'denied' | 'blocked' | 'provisional';
    token?: string;
}

// Custom hook to manage notifications
export const useNotifications = () => {
    // State to track whether notifications have been initialized
    const [isInitialized, setIsInitialized] = useState(false);
    const { me } = useContext(MeContext);

    // Mutation hook to update the device token on the backend
    const [saveUserFCMToken] = useSaveUserFcmTokenMutation(
        {
            onCompleted: (data) => {
                console.log('Device token updated successfully:', data);
                // Alert.alert('from api success New Device token updated successfully:', JSON.stringify(data));
            },
            onError: (error) => {
                console.error('Failed to update device token:', error);
                // Alert.alert('Failed to update device token:', error.message);
            },
        },
    );

    /**
     * Handles updating the device token both locally and on the backend.
     * @param newToken - The new FCM device token.
     */
    const handleTokenUpdate = useCallback(
        async (newToken: string, userId?: string) => {
            console.log('Updating device token:', newToken);
            // Alert.alert('FCM Token from updatetoken:', newToken);

            try {
                if (Platform.OS === 'ios') {
                    console.log('Registering APNs token from updatetkn...');
                    await messaging().registerDeviceForRemoteMessages();
                }
                // Retrieve the old token and the last update timestamp from AsyncStorage
                const oldToken = await AsyncStorage.getItem(DEVICE_TOKEN_KEY);
                const lastUpdateTimestamp = await AsyncStorage.getItem(TOKEN_TIMESTAMP_KEY);

                // Check if the token has changed or if enough time has passed since the last update
                if (oldToken === newToken && lastUpdateTimestamp) {
                    const lastUpdate = parseInt(lastUpdateTimestamp, 10);
                    if (Date.now() - lastUpdate < 300000) {
                        // If less than 5 minutes have passed, skip the update to prevent spamming the server
                        console.log('Skipping token update. for :', me?.id, 'Token:', newToken);
                        return;
                    }
                }
                // Send the new token to the backend
                if (userId || me?.id) {
                    console.log('Updating device token on the backend...');
                    // Alert.alert('Updating device token on the backend...', newToken);
                    await saveUserFCMToken({ variables: { token: newToken, userId: userId || me?.id } })
                        .then(async () => {
                        console.log('THEN: Device token updated successfully :', newToken);
                            // Store the new token and current timestamp in AsyncStorage
                            await AsyncStorage.setItem(DEVICE_TOKEN_KEY, newToken);
                            await AsyncStorage.setItem(TOKEN_TIMESTAMP_KEY, Date.now().toString());
                            console.log('Device token updated in async storage:');
                    }).catch((error) => {
                        console.error('THEN: Failed to update device token:', error);
                    });

                }
            } catch (error) {
                console.error('Error handling token update:', error);
                // Retry updating the token after a delay if an error occurs
                setTimeout(() => handleTokenUpdate(newToken), 5000);
            }
        },
        [saveUserFCMToken],
    );

    /**
     * Handles incoming messages when the app is in the foreground.
     * Displays an alert to the user.
     * @param remoteMessage - The message received from FCM.
     */
    const handleForegroundMessage = useCallback((remoteMessage: any) => {
        const { data } = remoteMessage;
        if (data) {
            if (!data.handled) {
                data.handled = true; // Mark the notification as handled
                pushLocalNotification(remoteMessage);
            }
        }
    }, []);

    /**
     * Handles messages received when the app is in the background or quit state.
     * Stores the message in AsyncStorage for later processing.
     * @param remoteMessage - The message received from FCM.
     */
    const handleBackgroundMessage = useCallback(async (remoteMessage: any) => {
        // await AsyncStorage.setItem(
        //     `notification_${Date.now()}`,
        //     JSON.stringify(remoteMessage),
        // );
        const { data } = remoteMessage;
        if (data) {
        if (!data.handled) {
            data.handled = true; // Mark the notification as handled
            pushLocalNotification(remoteMessage);
        }
        }

    }, []);

    /**
     * Handles user interaction with a notification.
     * Implement navigation or other action handling logic here.
     * @param remoteMessage - The message received from FCM.
     */
    const handleNotificationAction = useCallback((remoteMessage: any) => {
        console.log('Handling notification action:', remoteMessage);
        // Example: Navigate to a specific screen based on notification data
    }, []);

    /**
     * Requests notification permissions from the user.
     * @returns An object containing the permission status and token if granted.
     */
    const requestPermissions = useCallback(async (): Promise<NotificationPermissionResult> => {

        try {
            console.log('Requesting notification permissions...');
            // Alert.alert("Requesting notification permissions...");
            // Request notification permissions using Firebase messaging
            const authorizationStatus = await messaging().requestPermission();

            if (
                (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED)
                || (authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL)
            ) {
                console.log('Notification permissions granted.');
                if (Platform.OS === 'ios') {
                    console.log('Registering APNs token from get token...');
                    await messaging().registerDeviceForRemoteMessages();
                }
                // If permissions are granted, get the FCM token
                const token = await messaging().getToken();
                // console.log('FCM Token:', token);
                // Alert.alert('FCM Token from permission grant:', token);
                await handleTokenUpdate(token);
                return { status: 'granted', token };

            }
            else {
                return { status: 'denied' };
            }
        } catch (error) {
            console.error('Error requesting permissions:', error);
            throw error;
        }
    }, [handleTokenUpdate]);

    /**
     * Initializes the notification system.
     * Sets up necessary configurations and permissions.
     */
    const initialize = useCallback(async () => {
        if (isInitialized) return;

        try {
            if (Platform.OS === 'ios') {
                // Enable auto-initialization of Firebase Messaging
                await messaging().setAutoInitEnabled(true);

                // Request specific notification permissions
                const authStatus = await messaging().requestPermission({
                    alert: true,
                    badge: true,
                    sound: true,
                });

                if (authStatus === messaging.AuthorizationStatus.AUTHORIZED) {
                    console.log('User has notification permissions enabled.');
                } else if (authStatus === messaging.AuthorizationStatus.PROVISIONAL) {
                    console.log('User has provisional notification permissions.');
                } else {
                    console.log('User has notification permissions disabled');
                }
            }

            setIsInitialized(true);
        } catch (error) {
            console.error('Failed to initialize notifications:', error);
            throw error;
        }
    }, [isInitialized]);


    const pushLocalNotification = (
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

    /**
     * Retrieves the FCM device token.
     * @returns The FCM device token.
     */
    const getToken = async () => {
        if (Platform.OS === 'ios') {
            console.log('Registering APNs token from get token...');
            await messaging().registerDeviceForRemoteMessages();
        }
        const token = await messaging().getToken();
        // Alert.alert('FCM Token:', token);
        return token;
    };


    /**
     * Registers the APNs token with Firebase.
     * Only applicable for iOS devices.
     */
    const registerAPNsToken = async () => {
        if (Platform.OS === 'ios') {
            console.log('Registering APNs token...');
            await messaging().registerDeviceForRemoteMessages();
        }
    };

    useEffect(() => {
        if (Platform.OS === 'ios') {
            registerAPNsToken();
        }
    }, [me]);

    /**
     * Opens the app's notification settings.
     * Useful when permissions are denied and the user needs to enable them manually.
     */
    const openNotificationSettings = useCallback(async () => {
        // if (Platform.OS === 'ios') {
        //     await Linking.openSettings();
        // }
    }, []);

    // Effect to set up listeners and initialize notifications on component mount
    useEffect(() => {
        // Initialize the notification system

        console.log('##############Initializing notifications...##############', me?.id);
        // wait for the user to be loaded then saveUserFCMToken

        initialize();

        // Subscribe to foreground messages
        const unsubscribeOnMessage = messaging().onMessage(handleForegroundMessage);

        // Set background message handler
        messaging().setBackgroundMessageHandler(handleBackgroundMessage);

        // Check if the app was opened by a notification
        // messaging()
        //     .getInitialNotification()
        //     .then((remoteMessage) => {
        //         if (remoteMessage) {
        //             console.log('App opened by notification:', remoteMessage);
        //             handleNotificationAction(remoteMessage);
        //         }
        //     });

        // (async () => {
        //         if (Platform.OS === 'ios') {
        //             await messaging().registerDeviceForRemoteMessages();
        //         }
        //         const token =  await messaging().getToken();
        //         Alert.alert('FCM Token from main use effect', token);
        //
        //         console.log(`FCM Token tempoo: for user ${me?.id}`, token);
        //         if (me?.id) {
        //             handleTokenUpdate(token, me?.id);
        //         }
        // }
        // )();
        // Listen for token refreshes
        const unsubscribeTokenRefresh = messaging().onTokenRefresh((token) => {
            handleTokenUpdate(token, me?.id);
        });

        // Clean up subscriptions on unmount
        return () => {
            unsubscribeOnMessage();
            unsubscribeTokenRefresh();
        };
    }, [
        handleForegroundMessage,
        handleBackgroundMessage,
        handleNotificationAction,
        handleTokenUpdate,
        initialize,
        me,
    ]);

    // Expose functions and state to components that use this hook
    return {
        requestPermissions,
        getToken,
        handleTokenUpdate,
        openNotificationSettings,
        isInitialized,
    };
};
