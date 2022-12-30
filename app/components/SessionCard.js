import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useContext } from 'react';
import { Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../config/colors';
import { useRef } from 'react';
import SessionModal from './SessionModal';
import ConfirmAndPayModal from './ConfirmAndPayModal';
import {
  getFirestore,
  collection,
  query,
  getDocs,
  where,
  addDoc,
  setDoc,
  updateDoc,
  doc,
  increment,
} from 'firebase/firestore';
import { useStore } from '../hooks/useStore';
import AuthContext from '../auth/context';
import { firebaseConfig } from '../config/Firebase/firebaseConfig';
import firebase from "firebase/compat/app";

const SessionCard = ({ item, bookedSessions, allSessionsRef }) => {
  const userData = useStore((state) => state.userData);
  const { user } = useContext(AuthContext);
  const db = getFirestore(firebase.initializeApp(firebaseConfig));
  const sessionRef = useRef(null);
  const payRef = useRef(null);

  const registerSession = async (item) => {
    await setDoc(
      doc(db, 'activeSessions', item.sessionID, 'participants', user.uid),
      {
        userId: user.uid,
        status: 'confirmed',
      }
    ).catch((err) => setError(err));

    const snapshotUpdateBookings = await updateDoc(
      doc(db, 'activeSessions', item.sessionID),
      {
        bookedSessions: increment(1),
      }
    ).catch((err) => setError(err));

    const snapshotUser = await addDoc(
      collection(db, 'users', user.uid, 'userActiveSessions'),
      {
        sessionID: item.sessionID,
        sessionName: item.sessionName,
        sessionType: item.sessionType,
        status: 'confirmed',
        personalNote: item.personalNote,
        sessionLocation: item.sessionLocation,
        sessionLength: item.sessionLength,
        price: item.price,
        sessionLanguage: item.sessionLanguage,
        sessionNotes: item.sessionNotes,
        climbingLevel: item.climbingLevel,
        equipment: item.equipment,
        bookingClosingTime: item.bookingClosingTime,
        minNumberOfParticipants: item.minNumberOfParticipants,
        maxNumberOfParticipants: item.maxNumberOfParticipants,
        minimumAge: item.minimumAge,
        freeCancelationBefore: item.freeCancelationBefore,
        gymTicketIncluded: item.gymTicketIncluded,
        trainerEmail: item.trainerEmail,
        trainerID: item.trainerID,
        trainerName: item.trainerName,
        sessionDateTime: item.sessionDateTime,
      }
    ).catch((err) => setError(err));

    sendEmail(item);
    sendTrainerEmail(item);
  };

  const sendTrainerEmail = async (item) => {
    await addDoc(collection(db, 'booked_sessions_mail'), {
      to: item.trainerEmail,
      message: {
        subject: `${user.displayName} booked ${item.sessionName}`,
        html: `<div><p>Hi ${item.trainerEmail},<br>
         User ${user.displayName} with email ${user.email} just booked ${item.sessionName} session
         `,
      },
    }).catch((err) => console.log(err));
  };

  const sendEmail = async (item) => {
    await addDoc(collection(db, 'booked_sessions_mail'), {
      to: user.email,
      message: {
        subject: `${item.sessionName} booked`,
        html: `<div><p>Hi ${user.displayName},<br>
         You have signed up for ${item.sessionName} session
         `,
      },
    }).catch((err) => console.log(err));
  };

  return (
    <>
      <TouchableOpacity onPress={() => sessionRef.current?.open()}>
        <View style={styles.container}>
          <Image
            style={styles.image}
            source={require('../assets/sessionPhoto.png')}
          />
          <MaterialCommunityIcons
            name='heart-outline'
            size={24}
            color={colors.white}
            style={styles.heart}
          />
        </View>
        <Text style={styles.name}>{item.sessionName}</Text>
        <Text style={[styles.name, { marginTop: 8 }]}>
          Hosted by{' '}
          <Text style={[styles.name, { textDecorationLine: 'underline' }]}>
            {item.trainerName}
          </Text>
        </Text>

        <Text style={styles.sessionName}>
          {item.sessionLocation?.name.slice(0, 23)}...
        </Text>
        <Text
          style={[
            styles.sessionName,
            { fontFamily: 'nunitoBold', color: colors.oneClimbOrange },
          ]}
        >
          {`${item.maxNumberOfParticipants - item.bookedSessions} spots left`}
        </Text>
        <Text style={styles.sessionPrice}>From €{item.price} / person</Text>
      </TouchableOpacity>
      <SessionModal
        modalRef={sessionRef}
        item={item}
        bookedSessions={bookedSessions}
        allSessionsRef={allSessionsRef}
        payRef={payRef}
        registerSession={registerSession}
      />
      <ConfirmAndPayModal
        modalRef={payRef}
        item={item}
        registerSession={registerSession}
      />
    </>
  );
};

export default SessionCard;

const styles = StyleSheet.create({
  container: {
    height: 160,
    width: 160,
    borderRadius: 16,
    marginRight: 10,
  },
  image: {
    height: 160,
    width: 160,
    borderRadius: 16,
    resizeMode: 'cover',
  },
  heart: {
    marginTop: -152,
    marginLeft: 7,
  },
  name: {
    fontFamily: 'nunitoBold',
    fontSize: 12,
    lineHeight: 14,
    marginTop: 5,
    color: colors.darkGray,
  },

  sessionName: {
    marginTop: 4,
    color: colors.darkGray,
    fontFamily: 'nunito',
    fontSize: 11,
    lineHeight: 14,
  },
  sessionPrice: {
    color: colors.darkGray,
    fontFamily: 'nunitoBold',
    fontSize: 12,
    lineHeight: 16,
  },
});
