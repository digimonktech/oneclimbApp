import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
//import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useForm } from 'react-hook-form';

import AuthContext from '../auth/context';
//import CameraComponent from './CameraComponent';
import Screen from './Screen';
import AppText from './AppText';
import CloseButton from './CloseButton';
import colors from '../config/colors';
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { firebaseConfig } from '../config/Firebase/firebaseConfig';
import firebase from "firebase/compat/app";

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const CoachRegistrationComponent = ({
  setModal,
  update,
  setUpdate,
  business,
  setSelectedTab,
  navigation,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);
  const db = getFirestore(firebase.initializeApp(firebaseConfig));

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async () => {
    if (!error.length) saveBusinessForUser();
    console.log('Registered as coach');
  };

  const sendEmail = async () => {
    addDoc(collection(db, 'register_coach_mail'), {
      to: 'uros@heartedapp.com',
      message: {
        subject: 'Application for coach',
        html: `
          <div>
            <h3>
              <span>
                User with user_id: <b>${user.uid}</b>
              </span>
              <br />
              wants to register as coach.
              <br />
              <br />
              <h4>Please approve the status.</h4>
            </h3>
          </div>
        `,
      },
    }).catch((err) => console.log(err));
  };

  const saveBusinessForUser = async () => {
    updateDoc(doc(db, 'users', user.uid), {
      coachStatus: 'pending',
    }).catch((err) => console.log(err));
  };

  const handleArrowPress = () => {
    if (business) {
      saveBusinessForUser();
    } else setModalVisible(true);
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  /* useEffect(() => {
    return () => {
      setItem();
    };
  }, []); */

  return (
    <Screen style={{ backgroundColor: colors.white }}>
      <TouchableOpacity style={styles.backArrow} onPress={handleGoBack}>
        <Ionicons name='chevron-back' size={18} color={colors.black} />
      </TouchableOpacity>
      <CloseButton setModal={setModal} />
      <View style={styles.container}>
        <View style={styles.placeSearchContainer}>
          <TouchableOpacity
            onPress={!error.length ? handleSubmit(onSubmit) : null}
            style={styles.submit}
          >
            <AppText style={styles.submitButton}>Submit application</AppText>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeSearchContainer: {
    marginBottom: 20,
  },
  searchInputContainer: {
    backgroundColor: colors.white,
    marginTop: 10,
    opacity: 0.9,
    flexDirection: 'row',
    borderRadius: 15,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 30,
    paddingRight: 5,
  },
  searchInputIcon: {
    position: 'absolute',
    left: 5,
    top: 8,
  },
  arrowButton: {
    alignSelf: 'flex-end',
    marginTop: 30,
    marginRight: 30,
  },
  submit: {
    alignSelf: 'center',
    backgroundColor: colors.hearted2,
    width: windowWidth * 0.76,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginTop: 15,
  },
  submitButton: {
    color: colors.black,
    fontFamily: 'nunitoBold',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default CoachRegistrationComponent;
