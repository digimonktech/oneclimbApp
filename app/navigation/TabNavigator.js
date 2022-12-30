import React from 'react';
import { Feather } from '@expo/vector-icons';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import AccountNavigator from './AccountNavigator';
import colors from '../config/colors';
import AppText from '../components/AppText';
import AccountScreen from '../screens/AccountScreen';
import HomeScreen from '../screens/HomeScreen';
import Screen from '../components/Screen';
import ChatNavigator from './ChatNavigator';
import { Host } from 'react-native-portalize';
import SessionsScreenOld from '../screens/SessionsScreenOld';
import SessionsNavigator from './SessionsNavigator';

const Screen2 = () => {
  return (
    <Screen>
      <AppText>Screen 2</AppText>
    </Screen>
  );
};

const TabNavigator = () => {
  const Tab = createMaterialBottomTabNavigator();

  return (
    <Host>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color }) => {
            let iconName;
            if (route.name === 'Main') {
              iconName = 'search';
            } else if (route.name === 'Hearted') {
              iconName = 'heart';
            } else if (route.name === 'Sessions') {
              iconName = 'target';
            } else if (route.name === 'Chats') {
              iconName = 'message-circle';
            } else if (route.name === 'Account') {
              iconName = 'user';
            }

            // You can return any component that you like here!
            return <Feather name={iconName} size={22} color={color} />;
          },
        })}
        shifting={true}
        inactiveColor={colors.oneClimbBeige}
        activeColor={colors.white}
        barStyle={{
          backgroundColor: colors.hearted2,
          height: 65, // do not change this
        }}
        initialRouteName={'Main'}
        labeled={false}
      >
        <Tab.Screen
          tabBarColor={colors.bottomNav}
          name='Main'
          children={() => <HomeScreen />}
        />
         {/* <Tab.Screen name='Hearted' children={() => <SessionsScreenOld />} /> */}
        <Tab.Screen name='Sessions' children={() => <SessionsNavigator />} />
        <Tab.Screen name='Chats' children={() => <ChatNavigator />} />
        <Tab.Screen
          name='Account'
          children={() => <AccountNavigator />}
          /* listeners={({}) => ({
            tabPress: (e) => {
                Analytics.logEvent('screen_view', { screen_name: 'ACCOUNT' })
              },
          })} */
        />
      </Tab.Navigator>
    </Host>
  );
};

export default TabNavigator;
