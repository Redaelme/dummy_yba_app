/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import axios, {AxiosRequestConfig} from 'axios';
import React, {useContext, useEffect, useState} from 'react';
import {Alert, StyleSheet, Text, useColorScheme, View} from 'react-native';
import 'react-native-gesture-handler';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import appConfig from './src/config/config';
import {AuthProvider} from './src/providers/AuthProvider/AuthProvider';
import {RealmMeContext} from './src/providers/RealmProvider/RealmMeProvider/RealmMeProvider';
import TokenProvider from './src/providers/TokenProvider/TokenProvider';
import i18n from "i18next";


const Section: React.FC<{
    title: string;
}> = ({children, title}) => {
    const isDarkMode = useColorScheme() === 'dark';

    return (
        <View style={styles.sectionContainer}>
            <Text
                style={[
                    styles.sectionTitle,
                    {
                        color: isDarkMode ? Colors.white : Colors.black,
                    },
                ]}
            >
                {title}
            </Text>
            <Text
                style={[
                    styles.sectionDescription,
                    {
                        color: isDarkMode ? Colors.light : Colors.dark,
                    },
                ]}
            >
                {children}
            </Text>
        </View>
    );
};

const App = () => {
    const {setMailToClassify} = useContext(RealmMeContext);
    const [connection, setConnection] = useState<boolean | null>(true);
    const isDarkMode = useColorScheme() === 'dark';



    axios.interceptors.request.use(async (config: AxiosRequestConfig) => {
        const token = await AsyncStorage.getItem('token');
        config.headers.Authorization = token ? `Bearer ${token}` : undefined;
        config.headers.Accept = 'application/json';
        config.headers['Content-Type'] = 'application/json';
        config.baseURL = appConfig.servers.mlEndpoint;

        return config;
    });

    const setNotificationCategories = () => {
        PushNotificationIOS.setNotificationCategories([
            {
                id: 'userAction',
                actions: [
                    {id: 'open', title: 'Open', options: {foreground: true}},
                    {
                        id: 'ignore',
                        title: 'Desruptive',
                        options: {foreground: true, destructive: true},
                    },
                    {
                        id: 'text',
                        title: 'Text Input',
                        options: {foreground: true},
                        textInput: {buttonTitle: 'Send'},
                    },
                ],
            },
        ]);
    };
    const validate = (receipt: any) => {
        console.log('receipt is:', receipt);
    };

    useEffect(() => {
        NetInfo.fetch().then(
            (state: {
                isInternetReachable: boolean | ((prevState: boolean | null) => boolean | null) | null;
            }) => {
                setConnection(state.isInternetReachable);
            },
        );

        const unsubscribe = NetInfo.addEventListener(
            (state: {
                isInternetReachable: boolean | ((prevState: boolean | null) => boolean | null) | null;
            }) => {
                setConnection(state.isInternetReachable);
            },
        );

        return () => {
            unsubscribe();
        };
    }, []);

    useEffect(() => {
        (async () => {
                const storedLanguage = await AsyncStorage.getItem('language');
                if (storedLanguage) {
                    i18n.changeLanguage(storedLanguage);
                }
            }
        )();

    }, []);

    if (connection === false) {
        Alert.alert(
            'No internet connection',
            'The app need internet connection to run correctly.',
            [
                {
                    text: 'Try again',
                    onPress: () => {
                        NetInfo.fetch().then((state: { isInternetReachable: any }) => {
                            setConnection(state.isInternetReachable ?? false);
                        });
                    },
                },
            ],
            {cancelable: false},
        );
    }

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

    return (
        <AuthProvider>
            <TokenProvider/>
        </AuthProvider>
    );
};

const styles = StyleSheet.create({
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
        backgroundColor: '#3C7548',
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
    },
    highlight: {
        fontWeight: '700',
    },
    splashScreenImage: {
        width: '100%',
        height: '100%',
        backgroundColor: '#3C7548',
    },
});

export default App;
