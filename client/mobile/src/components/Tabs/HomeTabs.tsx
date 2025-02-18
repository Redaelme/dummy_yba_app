import React, { FC, useContext } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Calendar, Link, ListChecks, MessageCircle, Settings } from 'lucide-react-native';
import Home from '../Home/Home';
import { TabBarVisibleContext } from '../../providers/TabBarVisibleProvider/TabBarVisibleProvider';
import { StatusBarContext } from '../../providers/StatusBarValueProvider/StatusBarValueProvider';
import { COLOR } from '../../Lib/theme';
import { MeContext, purchaseState } from '../../providers/me/meProvider';
import { useRealmNotificationContext } from '../../providers/RealmProvider/RealmNotificationProvider/RealmNotificationProvider';
import { TabsScreenNavigationProps } from '../../routes/route';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

const Tab = createBottomTabNavigator();

const HomeTabs: FC<TabsScreenNavigationProps> = (props: { route: any }) => {
  const { route } = props;
  const isFromSignUp = route?.params?.fromSignUp || null;
  const { isTabBarVisible, setIsInRdvListView } = useContext(TabBarVisibleContext);
  const { setStatusBarValues } = useContext(StatusBarContext);
  const { me } = useContext(MeContext);
  const { setSubModalVisible } = useRealmNotificationContext();
  const { isUserClickSub } = purchaseState();

  const renderIcon = (IconComponent: any, focused: boolean) => (
      <View style={[styles.navButton, focused && styles.navButtonFocused]}>
        <IconComponent size={20} color="#fff" />
      </View>
  );

  return (
      <Tab.Navigator
          sceneContainerStyle={{
            backgroundColor: '#FFFFFF',
            flex: 1,
          }}
          tabBarOptions={{
            showLabel: false,
            style: {
              elevation: 0,
              backgroundColor: '#FFFFFF',
              height: Platform.OS === 'ios' && Platform.isPad ? hp('12%') : hp('8%'),
            },
          }}
          initialRouteName={isFromSignUp ? 'UserProfile' : undefined}
      >
        <Tab.Screen
            name="Home"
            component={Home}
            initialParams={{ isFromSignUp }}
            options={{
              tabBarVisible: isTabBarVisible,
              tabBarIcon: ({ focused }) => renderIcon(MessageCircle, focused),
            }}
            listeners={({ navigation, route }) => ({
              tabPress: (e) => {
                setStatusBarValues({ bgColor: COLOR.WHITE, newBarStyle: 'dark-content' });
              },
              focus: () => {
                if (me && me.isPayed === false && !isUserClickSub) {
                  setSubModalVisible(true);
                }
              },
            })}
        />
        <Tab.Screen
            name="TaskScreen"
            component={Home}
            options={{
              tabBarIcon: ({ focused }) => renderIcon(ListChecks, focused),
            }}
            listeners={({ navigation, route }) => ({
              tabPress: (e) => {
                setIsInRdvListView(false);
                setStatusBarValues({ bgColor: COLOR.WHITE, newBarStyle: 'dark-content' });
              },
              focus: () => {
                if (me && me.isPayed === false && !isUserClickSub) {
                  setSubModalVisible(true);
                }
              },
            })}
        />
        <Tab.Screen
            name="Calendar"
            component={Home}
            options={{
              tabBarIcon: ({ focused }) => renderIcon(Calendar, focused),
            }}
            listeners={({ navigation, route }) => ({
              tabPress: (e) => {
                setIsInRdvListView(false);
                setStatusBarValues({ bgColor: COLOR.WHITE, newBarStyle: 'dark-content' });
              },
              focus: () => {
                if (me && me.isPayed === false && !isUserClickSub) {
                  setSubModalVisible(true);
                }
              },
            })}
        />
        <Tab.Screen
            name="Settings"
            component={Home}
            options={{
              tabBarVisible: isTabBarVisible,
              tabBarIcon: ({ focused }) => renderIcon(Settings, focused),
            }}
            listeners={({ navigation, route }) => ({
              tabPress: (e) => {
                setStatusBarValues({ bgColor: COLOR.WHITE, newBarStyle: 'dark-content' });
              },
              focus: () => {
                if (me && me.isPayed === false && !isUserClickSub) {
                  setSubModalVisible(true);
                }
              },
            })}
        />
        <Tab.Screen
            name="Booking"
            component={Home}
            options={{
              tabBarIcon: ({ focused }) => renderIcon(Link, focused),
            }}
            listeners={({ navigation, route }) => ({
              tabPress: (e) => {
                setStatusBarValues({ bgColor: COLOR.GREEN, newBarStyle: 'light-content' });
              },
              focus: () => {
                if (me && me.isPayed === false && !isUserClickSub) {
                  setSubModalVisible(true);
                }
              },
            })}
        />
      </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  navButton: {
    width: 40,
    height: 40,
    backgroundColor: '#3C744C',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonFocused: {
    backgroundColor: '#2A5A3C',
  },
});

export default HomeTabs;