import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useContext, useState } from 'react';
import { Avatar } from 'react-native-elements';
import colors from '../config/colors';
import getRecipientEmail from '../utility/getRecipientEmail';
import AuthContext from '../auth/context';
import { useEffect } from 'react';
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { useNavigation } from '@react-navigation/core';
import { firebaseConfig } from '../config/Firebase/firebaseConfig';
import firebase from 'firebase/compat/app';

const Chat = ({ id, users }) => {
  const navigation = useNavigation();
  const db = getFirestore(firebase.initializeApp(firebaseConfig));
  const { user } = useContext(AuthContext);
  const [recipientData, setRecipientData] = useState({});

  const getRecipientData = async () => {
    const q = query(
      collection(db, 'users'),
      where('email', '==', getRecipientEmail(users, user))
    );
    const snapshot = await getDocs(q);
    snapshot.docs.map((doc) => setRecipientData(doc.data()));
  };
  useEffect(() => {
    getRecipientData();
  }, []);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate('Messaging', { recipientData, id })}
    >
      <Avatar
        rounded
        icon={{ name: 'user', type: 'font-awesome' }}
        avatarStyle={{ borderWidth: 1, borderColor: colors.black }}
        placeholderStyle={{ backgroundColor: colors.hearted2, opacity: 0.5 }}
        size={40}
        source={{
          uri: recipientData.photoURL,
        }}
      />
      <Text style={{ marginLeft: 10 ,color:'#000'}}>
        {recipientData.handle} {recipientData.badges}
      </Text>
    </TouchableOpacity>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
});
