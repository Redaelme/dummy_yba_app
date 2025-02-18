import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { DefaultTheme, NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import { AppState, SafeAreaView, StyleSheet } from 'react-native';
import { NAVIGATION_REGISTER, NO_REFRESH_TOKEN_IS_SET_ERROR } from '../../commons/constant';
import { useGetUserProfileLazyQuery, useGetUserProfileQuery } from '../../generated/graphql';
import { COLOR } from '../../Lib/theme';
import { AuthContext } from '../../providers/AuthProvider/AuthProvider';
import { MeContext } from '../../providers/me/meProvider';
import { NetworkContext } from '../../providers/NetworkProvider/NetworkProvider';
import { StatusBarContext } from '../../providers/StatusBarValueProvider/StatusBarValueProvider';
import { NavigationRegister } from '../../services/NavigationRegister';
import { Register } from '../../services/Register';
import AppIntro from '../AppIntro/AppIntro';
import { Authentication } from '../Authentication';
import { ForgotPassword } from '../Authentication/ForgotPassword';
import { Login } from '../Authentication/Login';
import Home from '../Home/Home';
import { SignUp } from '../SignUp';
import { SignUpIntroSlider } from '../SignUpIntroSlider';
import SplashScreen from '../Splashscreen/Splashscreen';
import HomeTabs from '../Tabs/HomeTabs';
import WeclomeBoss from '../WelcomeBoss/WellcomeBoss';
import { TabBarVisibleContext } from '../../providers/TabBarVisibleProvider/TabBarVisibleProvider';

const RootStack = createStackNavigator();
const MainStack = createStackNavigator();
const AuthStack = createStackNavigator();

const MainApp: FC = () => {
  const { token, login, fromSignUp, logout } = useContext(AuthContext);
  const [isSplashFinished, setIsSplashFinished] = useState(false);
  const [showIntroApp, setShowIntroApp] = useState(false);
  const navigation = useNavigation();
  const { me, setMe } = useContext(MeContext);
  const [shouldSkipContactsQuery, setShouldSkipContactsQuery] = useState(true);

  console.log("Navigation Cpmopmop")
  const [doGetMe, { loading: loadingMe }] = useGetUserProfileLazyQuery({
    onCompleted: (res) => {
      console.log('getMe', res);
      if (res && res.me) {
        setMe({
          id: res.me.id,
          nom: res.me.lastName || '',
          prenom: res.me.firstName || '',
          mail: res.me.email || '',
          isPayed: res.me.isPayed !== undefined && res.me.isPayed !== null ? res.me.isPayed : true,
          calendarType: res.me.calendarType || '',
          oauthStatus: res.me.oauthStatus || '',
          mailService: res.me.mailService || '',
        });
      }
    },
    onError: (error) => {
      console.log('getMe error', error.message);
      if (error.message === NO_REFRESH_TOKEN_IS_SET_ERROR) {
        logout();
      }
    },
    fetchPolicy: 'network-only',
  });
  const { setIsNetworkAvailable } = useContext(NetworkContext);
  const { data } = useGetUserProfileQuery();

  const [getUserProfileLazy] = useGetUserProfileLazyQuery({
    onError: (error) => {
      if (error.message === NO_REFRESH_TOKEN_IS_SET_ERROR) {
        logout();
      }
    },
  });

  const appState = useRef(AppState.currentState);
  const { setIsTabBarVisible } = useContext(TabBarVisibleContext);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        getUserProfileLazy();
      }
      appState.current = nextAppState;
    });
    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (data && data.me && !data.me.isActive) logout();
  }, [data && data.me && data.me.isActive]);

  useEffect(() => {
    AsyncStorage.getItem('showIntroApp')
      .then((showIntroApp) => {
        if (!showIntroApp) {
          setShowIntroApp(true);
        }
      })
      .catch((error) => {});

    AsyncStorage.getItem('token')
      .then((token) => {
        if (token) login(token);
      })
      .catch((error) => {});
    AsyncStorage.removeItem('meetingMembers');
    AsyncStorage.removeItem('agendastore');
    AsyncStorage.removeItem('organisationstore');
    AsyncStorage.removeItem('locationstore');
    const unSubscribe = NetInfo.addEventListener((state) => {
      setIsNetworkAvailable(!!(state.isConnected && state.isInternetReachable));
    });
    return () => unSubscribe();
  }, []);


  useEffect(() => {
    if (navigation) {
      doGetMe();
      // add navigation to register for push notification
      const navigationRegister = new NavigationRegister(NAVIGATION_REGISTER);
      navigationRegister.setNavigation(navigation);
      Register.add(navigationRegister);
    }
  }, [navigation]);

  const onPressGetStarted = () => {
    AsyncStorage.setItem('showIntroApp', 'false').then();
    setShowIntroApp(false);
  };


  if (!isSplashFinished) {
    if (typeof token === 'string') {
      setIsSplashFinished(true);
    }
    return <SplashScreen setIsSplashFinished={setIsSplashFinished} />;
  }

  if (isSplashFinished && showIntroApp) {
    return <AppIntro onPressGetStarted={onPressGetStarted} />;
  }

  return (
    <MainStack.Navigator headerMode="none" screenOptions={{ gestureEnabled: false }}>
      {token ? (
        fromSignUp ? (
          <>
            <MainStack.Screen name="WelcomeBoss" component={WeclomeBoss} />
            <MainStack.Screen name="Tabs" initialParams={{ fromSignUp }} component={HomeTabs} />
          </>
        ) : (
          <>
            <MainStack.Screen name="WelcomeBoss" component={WeclomeBoss} />
            <MainStack.Screen name="Tabs" component={HomeTabs} />
          </>
        )
      ) : (
        <MainStack.Screen name="Authentication" component={AuthScreen} />
      )}
    </MainStack.Navigator>
  );
};

const HomeStackNavigator = createStackNavigator();
export const HomeStackNavigatorComponent = () => (
    <HomeStackNavigator.Navigator headerMode="none" initialRouteName="Home">
      <HomeStackNavigator.Screen name="Home" component={Home} />
    </HomeStackNavigator.Navigator>
);

const AuthScreen: FC = () => {
  return (
    <AuthStack.Navigator headerMode="none" screenOptions={{ gestureEnabled: false }}>
      <AuthStack.Screen name="Authentication" component={Authentication} />
      <AuthStack.Screen name="Login" component={Login} />
      <AuthStack.Screen name="SignUpIntroSlider" component={SignUpIntroSlider} />
      <AuthStack.Screen name="SignUp" component={SignUp} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPassword} />
    </AuthStack.Navigator>
  );
};

const Navigation: FC = () => {
  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: COLOR.WHITE,
    },
  };

  const { statusBarValues } = useContext(StatusBarContext);

  return (
    <NavigationContainer theme={MyTheme}>
      <SafeAreaView style={{ flex: 0, backgroundColor: statusBarValues.bgColor }} />
      <SafeAreaView style={styles.container}>
        <RootStack.Navigator headerMode="none">
          <RootStack.Screen name="MainApp" component={MainApp} />
        </RootStack.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});

export default Navigation;
