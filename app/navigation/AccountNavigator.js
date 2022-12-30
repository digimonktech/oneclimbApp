import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import AccountScreen from '../screens/AccountScreen';
//import UserSearchScreen from '../screens/UserSearchScreen';
//import NotificationScreen from '../screens/NotificationScreen';
import RegisterAsCoachScreen from '../screens/RegisterAsCoachScreen';
//import BusinessEdit from '../screens/BusinessEdit';
//import UserBookings from '../screens/UserBookings';
import AuthContext from '../auth/context';
import LoginScreen from '../screens/LoginScreen';
import ShowProfileScreen from '../screens/ShowProfileScreen';
import VerifyPhoneScreen from '../screens/VerifyPhoneScreen';
import ConfirmationCodeScreen from '../screens/ConfirmationCodeScreen';
import HostASessionScreen from '../screens/HostASessionScreen';
//import BlockedUsersScreen from '../screens/BlockedUsersScreen';
//import PlaceProfileScreen from '../screens/PlaceProfileScreen';

const Stack = createStackNavigator();

const AccountNavigator = () => {
  const { user } = useContext(AuthContext);

  return (
    <Stack.Navigator initialRouteName='AccountScreen'>
      <Stack.Screen
        name='AccountScreen'
        component={AccountScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name='ShowProfile'
        component={ShowProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='HostASession'
        component={HostASessionScreen}
        options={{ headerShown: false }}
      />
      {/*  <Stack.Screen
        name="NotificationScreen"
        component={NotificationScreen}
        options={{ headerShown: false }}
      /> */}
      <Stack.Screen
        name='RegisterAsCoach'
        component={RegisterAsCoachScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='VerifyPhone'
        component={VerifyPhoneScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='ConfirmationCode'
        component={ConfirmationCodeScreen}
        options={{ headerShown: false }}
      />
      {/*<Stack.Screen
        name="BlockedUsers"
        component={BlockedUsersScreen}
        options={{ headerShown: false }}
      /> */}
      <Stack.Screen
        name='Login'
        component={user.emailVerified ? AccountScreen : LoginScreen}
        options={{ headerShown: false }}
      />
      {/* <Stack.Screen
        name="PlaceProfile"
        component={PlaceProfileScreen}
        options={{
          headerShown: false,
        }}
      /> */}
    </Stack.Navigator>
  );
};

export default AccountNavigator;
