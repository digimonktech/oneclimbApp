import React, { useContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Linking,
  View,
  Text,
} from 'react-native';
import { Card, Paragraph } from 'react-native-paper';
import { Avatar } from 'react-native-elements';
import AppText from '../components/AppText';
import colors from '../config/colors';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
} from 'firebase/firestore';
import AuthContext from '../auth/context';
import { firebaseConfig } from '../config/Firebase/firebaseConfig';
import firebase from "firebase/compat/app";

const SessionCardItem = ({
  item,
  dateOptions,
  userBookedSessions,
  handlePress,
}) => {
  const navigation = useNavigation();
  const [showSignUp, setShowSignUp] = useState(true);
  const db = getFirestore(firebase.initializeApp(firebaseConfig));
  const { user } = useContext(AuthContext);

  const checkBookedSessions = () => {
    userBookedSessions?.map((session) => {
      if (session.sessionName === item.sessionName) {
        setShowSignUp(false);
      }
    });
  };

  const createChat = async () => {
    const check = await checkChatAlreadyExists(item.trainerEmail);
    if (check === false && item.trainerEmail !== user.email) {
      await addDoc(collection(db, 'chats'), {
        users: [user.email, item.trainerEmail],
      });
    }
  };

  const checkChatAlreadyExists = async () => {
    const q = query(
      collection(db, 'chats'),
      where('users', 'array-contains', user.email)
    );
    const snapshot = await getDocs(q);

    const data = [];
    snapshot.docs.forEach((doc) => data.push(doc.data()));

    const check = !!data.find(
      (chat) => chat.users.find((rec) => rec === item.trainerEmail)?.length > 0
    );

    return check;
  };

  useEffect(() => {
    checkBookedSessions();
  }, [userBookedSessions, item.bookedSessions]);

  return (
    <Card style={styles.item}>
      {item.trainerPhotoURL ? (
        <View
          style={{ flexDirection: 'row', padding: 7, alignItems: 'center' }}
        >
          <Avatar
            rounded
            icon={{ name: 'user', type: 'font-awesome' }}
            avatarStyle={{ borderWidth: 1, borderColor: colors.black }}
            placeholderStyle={{
              backgroundColor: colors.hearted2,
              opacity: 0.5,
            }}
            size={40}
            source={{
              uri: item.trainerPhotoURL,
            }}
          />
          <Text style={{ color: colors.black, fontSize: 16, marginLeft: 5 }}>
            {item.trainerName}
          </Text>
        </View>
      ) : null}
      <Card.Title
        title={item.sessionName}
        titleStyle={styles.strongTextTitle}
        subtitle={`${item.sessionType} on ${new Date(
          item.sessionDateTime.seconds * 1000
        ).toLocaleDateString('en-GB', dateOptions)}`}
        subtitleStyle={styles.strongTextSubtitle}
      />
      <Card.Cover source={require('../assets/boulder_advanced.jpg')} />
      <Card.Content style={styles.mainContentContainer}>
        <Paragraph>
          <AppText style={styles.strongText}>Nr of participants:</AppText>{' '}
          {item.numberOfParticipants}{' '}
          {`(${item.numberOfParticipants - item.bookedSessions} left)`}
        </Paragraph>
        <Paragraph>
          <AppText style={styles.strongText}>Location:</AppText>{' '}
          {item.sessionLocation}
        </Paragraph>
        <Paragraph>
          <AppText style={styles.strongText}>Duration:</AppText>{' '}
          {item.sessionLength} min
        </Paragraph>
        <Paragraph>
          <AppText style={styles.strongText}>Price:</AppText> {item.price}
        </Paragraph>
        <Paragraph>
          <AppText style={styles.strongText}>Equipment:</AppText>{' '}
          {item.equipment}
        </Paragraph>
        <Paragraph>
          <AppText style={styles.strongText}>Notes:</AppText>{' '}
          {item.sessionNotes}
        </Paragraph>
      </Card.Content>
      <Card.Actions>
        {showSignUp && item.numberOfParticipants > item.bookedSessions ? (
          <TouchableOpacity
            style={styles.signUpButton}
            onPress={() => {
              handlePress(item);
            }}
          >
            <AppText style={styles.signUpButtonText}>SIGN UP</AppText>
          </TouchableOpacity>
        ) : null}
        {!showSignUp ? (
          <View
            style={[
              styles.signUpButton,
              {
                backgroundColor: colors.white,
              },
            ]}
          >
            <AppText
              style={[styles.signUpButtonText, { color: colors.hearted2 }]}
            >
              SIGNED
            </AppText>
          </View>
        ) : null}
        <AppText
          style={[
            styles.signUpButtonText,
            { color: colors.hearted2, marginLeft: 40 },
          ]}
        >
          TRAINER:
        </AppText>
        <TouchableOpacity
          style={{ marginHorizontal: 15 }}
          onPress={() => {
            Linking.openURL(
              `mailto:${item.trainerEmail}?subject=New booking&body=New booking`
            );
          }}
        >
          <MaterialCommunityIcons
            name='email-edit-outline'
            size={24}
            color={colors.hearted2}
          />
        </TouchableOpacity>
        <TouchableOpacity
          //style={styles.contactButton}
          onPress={() => {
            createChat();
            navigation.navigate('Chats');
          }}
        >
          <Feather name='message-square' size={24} color={colors.hearted2} />
        </TouchableOpacity>
      </Card.Actions>
    </Card>
  );
};

export default SessionCardItem;

const styles = StyleSheet.create({
  mainContentContainer: {
    marginTop: 5,
  },
  item: {
    marginHorizontal: 5,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.hearted2,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
  },
  type: {
    fontSize: 18,
  },
  participants: {
    fontSize: 18,
    color: colors.oneClimbOrange,
  },
  title: {
    fontSize: 22,
  },
  strongText: {
    fontFamily: 'nunitoBold',
    fontSize: 15,
    lineHeight: 18,
  },
  strongTextTitle: {
    fontFamily: 'nunitoBold',
    fontSize: 22,
    lineHeight: 24,
  },
  strongTextSubtitle: {
    fontFamily: 'nunito',
    fontSize: 15,
    lineHeight: 18,
  },
  signUpButton: {
    backgroundColor: colors.hearted2,
    width: 100,
    height: 35,
    borderRadius: 5,
    paddingTop: 3,
    marginLeft: 8,
  },
  contactButton: {
    marginLeft: 75,
    backgroundColor: colors.hearted2,
    width: 170,
    height: 35,
    borderRadius: 5,
    paddingTop: 3,
  },
  signUpButtonText: {
    textAlign: 'center',
    fontSize: 14,
    color: colors.white,
    fontFamily: 'nunitoBold',
    fontSize: 16,
  },
});
