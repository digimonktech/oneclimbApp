import { StyleSheet, Text, View } from 'react-native';
import React, { useContext } from 'react';
import { Avatar } from 'react-native-elements';
import AuthContext from '../auth/context';
import colors from '../config/colors';

const Message = ({ id, userData, message }) => {
  const { user } = useContext(AuthContext);
  return (
    <>
      {userData.email === user.email ? (
        <View key={id} style={styles.reciever}>
          <Avatar
            position='absolute'
            bottom={-15}
            right={-5}
            rounded
            containerStyle={{
              position: 'absolute',
              bottom: -15,
              right: -5,
            }}
            size={30}
            source={{ uri: userData.photoURL }}
          />
          <Text style={styles.recieverText}>{message}</Text>
        </View>
      ) : (
        <View key={id} style={styles.sender}>
          <Avatar
            position='absolute'
            bottom={-15}
            right={-5}
            rounded
            containerStyle={{
              position: 'absolute',
              bottom: -15,
              left: -5,
            }}
            size={30}
            source={{ uri: userData.photoURL }}
          />
          <Text style={styles.senderText}>{message}</Text>
          <Text style={styles.senderName}>{userData.displayName}</Text>
        </View>
      )}
    </>
  );
};

export default Message;

const styles = StyleSheet.create({
  sender: {
    padding: 15,
    backgroundColor: '#F1610D',
    alignSelf: 'flex-start',
    borderRadius: 20,
    margin: 15,
    maxWidth: '80%',
    position: 'relative',
  },
  senderName: {
    left: 10,
    paddingRight: 10,
    fontSize: 10,
    color: 'black',
  },
  senderText: {
    color: 'black',
    fontWeight: '500',
    marginLeft: 10,
    marginBottom: 15,
  },
  reciever: {
    padding: 15,
    backgroundColor: colors.hearted2,
    alignSelf: 'flex-end',
    borderRadius: 20,
    marginRight: 15,
    marginBottom: 20,
    maxWidth: '80%',
    position: 'relative',
  },
  recieverText: {
    color: colors.white,
    fontWeight: '500',
    marginLeft: 10,
  },
});
