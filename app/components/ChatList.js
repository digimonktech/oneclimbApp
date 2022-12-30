import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Chat from './Chat';

const ChatList = ({ chatList }) => {
  return (
    <View>
      {chatList?.docs.map((chat) => {
        <Chat key={chat.id} id={chat.id} users={chat.data().users} />;
      })}
    </View>
  );
};

export default ChatList;

const styles = StyleSheet.create({});
