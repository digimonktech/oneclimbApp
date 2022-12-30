import React, { useState, useContext, useLayoutEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  Modal,
  SafeAreaView,
} from 'react-native';

import AuthContext from '../auth/context';
import AppText from '../components/AppText';
import colors from '../config/colors';
import CloseButton from './CloseButton';
import Screen from '../components/Screen';
import SessionCardItem from '../components/SessionCardItem';
import {
  getFirestore,
  collection,
  query,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  addDoc,
  increment,
} from 'firebase/firestore';
import { useStore } from '../hooks/useStore';
import { firebaseConfig } from '../config/Firebase/firebaseConfig';
import firebase from 'firebase/compat/app';

const windowWidth = Dimensions.get('window').width;

function ActiveSessionsComponent() {
  const db = getFirestore(firebase.initializeApp(firebaseConfig));

  const userData = useStore((state) => state.userData);

  const [sessions, setSessions] = useState([]);
  const [updateSessions, setUpdateSessions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [userBookedSessions, setUserBookedSessions] = useState([]);
  const dateOptions = {
    weekday: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };
  const { user } = useContext(AuthContext);

  const loadBookedSessions = () => {
    const q = query(collection(db, 'users', user.uid, 'userActiveSessions'));
    onSnapshot(q, (snapshot) => {
      setUserBookedSessions(snapshot.docs.map((doc) => doc.data()));
    });
  };

  const loadAllSessions = async () => {
    const q = query(collection(db, 'activeSessions'));
    onSnapshot(q, (snapshot) =>
      setSessions(snapshot.docs.map((doc) => doc.data()))
    );

    setUpdateSessions(sessions);
  };

  const registerSession = async (item) => {
    await setDoc(
      doc(db, 'activeSessions', item.sessionID, 'participants', user.uid),
      {
        userId: user.uid,
        status: 'confirmed',
      }
    ).catch((err) => setError(err));

    const snapshotUpdateBookings = await updateDoc(
      doc(db, 'activeSessions', item.sessionName),
      {
        bookedSessions: increment(1),
      }
    ).catch((err) => setError(err));

    const snapshotUser = await setDoc(
      doc(db, 'users', user.uid, 'userActiveSessions', item.sessionName),
      {
        sessionName: item.sessionName,
        sessionType: item.sessionType,
        status: 'confirmed',
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

  const handlePress = (sessionName) => {
    registerSession(sessionName);
    loadBookedSessions();
    setModalVisible(true);
  };

  /* const getAvailability = async (sessionID) => {
        const snapshot = await db
        .collection('activeSessions')
        .doc(sessionID)
        .collection('participants')
        .get()
       .catch((err) => setError(err));

       const tempDoc = snapshot.docs.map((doc) => {
            return { ...doc.data() }
        })

       const size =  (tempDoc.length)
       return size 
     } */

  const renderItem = ({ item }) => (
    <SessionCardItem
      item={item}
      dateOptions={dateOptions}
      userBookedSessions={userBookedSessions}
      handlePress={handlePress}
    />
  );

  useLayoutEffect(() => {
    loadAllSessions();
    loadBookedSessions();
  }, []);

  return (
    <>
      <Screen>
        <View style={styles.headerContainer}>
          <AppText style={styles.headerText}>Available sessions</AppText>
        </View>
        <SafeAreaView style={styles.container}>
          <FlatList
            data={sessions}
            extraData={updateSessions}
            renderItem={renderItem}
            keyExtractor={(item) => item.sessionName}
            horizontal={true}
          />
        </SafeAreaView>
        <Modal
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <Screen>
            <CloseButton setModal={setModalVisible} />
            <View style={styles.headerContainer}>
              <AppText style={styles.headerText}>Session booked</AppText>
            </View>
          </Screen>
        </Modal>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0.9,
    flexDirection: 'row',
    alignSelf: 'center',
  },
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
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  headerText: {
    fontSize: 22,
    lineHeight: 30,
  },
});

export default ActiveSessionsComponent;
