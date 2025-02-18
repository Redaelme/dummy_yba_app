/**
 * @format
 */

import { AppRegistry,LogBox } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
// import * as Sentry from '@sentry/react-native';
import {PushNotificationConfigure} from '../mobile/src/services/ConfigureNotification'
// Sentry.init({
//   dsn: 'https://a01de66d20f34fd6a9204df31d998721@sentry.hairun-technology.com/12',
// });
 PushNotificationConfigure()
 LogBox.ignoreLogs(['new NativeEventEmitter']);
AppRegistry.registerComponent(appName, () => App);
