import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ChatScreen from '../screens/ChatScreen';
import MessagingScreen from '../screens/MessagingScreen';

const Stack = createStackNavigator();

const ChatNavigator = () => {
  return (
    <Stack.Navigator initialRouteName='ChatScreen'>
      <Stack.Screen
        name='Chat'
        component={ChatScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name='Messaging'
        component={MessagingScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default ChatNavigator;
