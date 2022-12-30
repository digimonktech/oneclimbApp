import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SessionsScreen from '../screens/SessionsScreen';
import HostASessionScreen from '../screens/HostASessionScreen';

const Stack = createStackNavigator();

const SessionsNavigator = () => {
  return (
    <Stack.Navigator initialRouteName='SessionsScreen'>
      <Stack.Screen
        name='SessionsScreen'
        component={SessionsScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name='HostASession'
        component={HostASessionScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default SessionsNavigator;
