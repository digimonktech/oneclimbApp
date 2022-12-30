import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useRef, useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import colors from '../config/colors';
import { Portal } from 'react-native-portalize';
import { Modalize } from 'react-native-modalize';
import moment from 'moment';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  getFirestore,
  setDoc,
  doc,
  addDoc,
  collection,
  updateDoc,
  Timestamp,
} from 'firebase/firestore';
import { useContext } from 'react';
import AuthContext from '../auth/context';
import { useNavigation } from '@react-navigation/core';
import { firebaseConfig } from '../config/Firebase/firebaseConfig';
import firebase from "firebase/compat/app";

const windowHeight = Dimensions.get('window').height;

const ChooseSessionTimeModal = ({
  modalRef,
  publishSessionRef,
  item,
  allDates,
}) => {
  /*  let sortedDates = allDates.sort((a, b) => a - b); */
  const [sessionTime, setSessionTime] = useState('');
  const db = getFirestore(firebase.initializeApp(firebaseConfig));
  const { user } = useContext(AuthContext);
  const [error, setError] = useState('');
  const navigation = useNavigation();
  const [newSessionName, setNewSessionName] = useState(item.sessionName);

  const publishSession = async () => {
    let newTime = moment(allDates)
      .add(sessionTime, 'hours')
      .subtract(2, 'hours');
    //(moment(newTime).format('MMMM Do YYYY, h:mm a'));
    let sessionDateTime = moment(newTime).format('MMMM Do YYYY, h:mm a');
    let timestamp = Timestamp.fromDate(new Date(moment(newTime).format()));
    let sessionID;

    await addDoc(collection(db, 'users', user.uid, 'sessions'), {
      sessionName: newSessionName,
      personalNote: item.personalNote,
      sessionLocation: item.sessionLocation,
      sessionLength: item.sessionLength,
      price: item.price,
      sessionLanguage: item.sessionLanguage,
      sessionType: item.sessionType,
      sessionNotes: item.sessionNotes,
      climbingLevel: item.climbingLevel,
      equipment: item.equipment,
      bookingClosingTime: item.bookingClosingTime,
      minNumberOfParticipants: item.minNumberOfParticipants,
      maxNumberOfParticipants: item.maxNumberOfParticipants,
      minimumAge: item.minimumAge,
      freeCancelationBefore: item.freeCancelationBefore,
      gymTicketIncluded: item.gymTicketIncluded,
      trainerEmail: user.email,
      trainerID: user.uid,
      trainerName: user.displayName,
      sessionDateTime: sessionDateTime,
      bookedSessions: 0,
      timestampSessionDate: timestamp,
    })
      .then((docRef) => {
        sessionID = docRef.id;
      })
      .catch((err) => setError(err));

    await addDoc(collection(db, 'activeSessions'), {
      sessionName: newSessionName,
      personalNote: item.personalNote,
      sessionLocation: item.sessionLocation,
      sessionLength: item.sessionLength,
      price: item.price,
      sessionLanguage: item.sessionLanguage,
      sessionType: item.sessionType,
      sessionNotes: item.sessionNotes,
      climbingLevel: item.climbingLevel,
      equipment: item.equipment,
      bookingClosingTime: item.bookingClosingTime,
      minNumberOfParticipants: item.minNumberOfParticipants,
      maxNumberOfParticipants: item.maxNumberOfParticipants,
      minimumAge: item.minimumAge,
      freeCancelationBefore: item.freeCancelationBefore,
      gymTicketIncluded: item.gymTicketIncluded,
      trainerEmail: user.email,
      trainerID: user.uid,
      trainerName: user.displayName,
      sessionDateTime: sessionDateTime,
      bookedSessions: 0,
      timestampSessionDate: timestamp,
    })
      .then((docRef) => {
        updateDoc(doc(db, 'activeSessions', docRef.id), {
          sessionID: docRef.id,
        });
        updateDoc(doc(db, 'users', user.uid, 'sessions', sessionID), {
          activeSessionID: docRef.id,
        });
      })
      .then(() => {
        modalRef.current?.close();
        navigation.navigate('Home');
      })
      .catch((err) => setError(err));
  };

  const renderHeader = () => {
    return (
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => {
          modalRef.current?.close();
        }}
      >
        <AntDesign name='close' size={24} color={colors.darkGray} />
      </TouchableOpacity>
    );
  };

  return (
    <Portal>
      <Modalize
        ref={modalRef}
        modalHeight={windowHeight * 0.95}
        handleStyle={{
          height: 5,
          width: 150,
          backgroundColor: '#DEDEDE',
          zIndex: 999,
        }}
        handlePosition={'inside'}
        overlayStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.25)' }}
        modalStyle={{
          shadowOpacity: 0.25,
          shadowOffset: { width: 0, height: -5 },
        }}
        scrollViewProps={{
          bounces: false,
        }}
        HeaderComponent={renderHeader}
        closeSnapPointStraightEnabled={false}
        keyboardShouldPersistTaps='always'
        panGestureEnabled={false}
      >
        <KeyboardAwareScrollView style={styles.container}>
          <Text style={styles.title}>Choose time to publish new session</Text>
          <Text style={styles.subtitle}>
            Enter time in format ig. 10:00
            {'\n'}
            {'\n'}
          </Text>
          <View style={styles.dateBox}>
            <Text style={styles.dateText}>
              {moment(allDates).format('ddd, Do MMM')}
            </Text>
            <TextInput
              name='sessionTime'
              textContentType='none'
              style={styles.inputField}
              onChangeText={(text) => setSessionTime(text)}
              placeholderTextColor={colors.darkGray}
            />
          </View>
          <Text style={styles.title}>Edit session name</Text>

          <View style={styles.dateBox}>
            <TextInput
              name='sessionName'
              textContentType='none'
              autoComplete='off'
              autoCorrect={false}
              style={[styles.inputField, { width: '100%' }]}
              onChangeText={(text) => setNewSessionName(text)}
              placeholderTextColor={colors.darkGray}
              placeholder={newSessionName}
            />
          </View>

          {/*  {sortedDates.map((dates, id) => (
            <View style={styles.dateBox}>
              <Text style={styles.dateText} key={id}>
                {moment(dates).format('ddd, Do MMM')}
              </Text>
              <Text style={styles.subtitleSmall}>Beginning</Text>

              
            </View>
          ))} */}
          <View style={styles.buttonsBox}>
            <TouchableOpacity
              onPress={() => {
                publishSessionRef.current?.close();
                modalRef.current?.close();
              }}
            >
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => publishSession()}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Publish</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </Modalize>
    </Portal>
  );
};

export default ChooseSessionTimeModal;

const styles = StyleSheet.create({
  closeButton: {
    marginTop: 38,
    marginLeft: 24,
    width: 30,
    elevation: 999,
  },
  container: {
    marginHorizontal: 25,
    borderTopColor: colors.lightGray,
    borderTopWidth: 1,
    marginTop: 26,
  },
  title: {
    fontFamily: 'poppinsSemiBold',
    fontSize: 22,
    lineHeight: 33,
    color: colors.darkGray,
    marginTop: 20,
  },
  subtitle: {
    marginTop: 8,
    fontFamily: 'nunito',
    fontSize: 14,
    lineHeight: 16,
    color: colors.darkGray,
  },
  buttonsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 110,
  },
  button: {
    height: 50,
    width: 150,
    borderRadius: 42,
    backgroundColor: colors.oneClimbOrange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: 'poppinsSemiBold',
    fontSize: 18,
    lineHeight: 27,
  },
  cancel: {
    fontFamily: 'poppinsSemiBold',
    fontSize: 16,
    lineHeight: 24,
    color: colors.darkGray,
    textDecorationLine: 'underline',
  },
  dateBox: {
    marginTop: 20,
    borderBottomColor: colors.lightGray,
    borderBottomWidth: 1,
  },
  dateText: {
    fontFamily: 'poppinsSemiBold',
    fontSize: 16,
    lineHeight: 24,
    color: colors.darkGray,
  },
  subtitleSmall: {
    marginLeft: 15,
    fontFamily: 'nunito',
    fontSize: 14,
    lineHeight: 16,
    color: colors.darkGray,
    marginTop: 10,
  },
  inputField: {
    borderRadius: 10,
    borderColor: colors.darkGray,
    borderWidth: 1,
    width: 150,
    height: 50,
    paddingLeft: 10,
    marginTop: 2,
    marginBottom: 20,
  },
});
