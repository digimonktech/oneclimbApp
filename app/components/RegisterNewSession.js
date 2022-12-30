import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  Button,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';

import AppText from './AppText';
import { AppFormField, ErrorMessage } from '../components/forms';
import colors from '../config/colors';
import Screen from './Screen';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { firebaseConfig } from '../config/Firebase/firebaseConfig';
import firebase from "firebase/compat/app";

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

function RegisterNewSession({ user }) {
  const [error, setError] = useState('');
  const [message, setMessage] = useState(false);
  const [tempSessionType, setTempSessionType] = useState();
  const [tempSessionLength, setTempSessionLength] = useState();
  const [sessionDateTime, setSessionDateTime] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const dateOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };
  const [showDate, setShowDate] = useState(Platform.OS === 'ios');

  const db = getFirestore(firebase.initializeApp(firebaseConfig));
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const climbLevel = null;

  /* const onChange = (event, selectedDate) => {
      const currentDate = selectedDate;
      setShow(false);
      setSessionDateTime(currentDate);
    }; */

  /* const showMode = (currentMode) => {
      setShow(true);
      setMode(currentMode);
    }; */

  /* const showDatepicker = () => {
      showMode('date');
    };
  
    const showTimepicker = () => {
      showMode('time');
    }; */

  const onSubmit = async ({
    sessionName,
    sessionType,
    sessionLength,
    sessionLocation,
    equipment,
    sessionNotes,
    numberOfParticipants,
    price,
  }) => {
    console.log('submit', user);
    if (!error.length) console.log('no error');
    await saveNewSession(
      sessionName,
      sessionType,
      sessionLength,
      sessionLocation,
      equipment,
      sessionNotes,
      numberOfParticipants,
      price,
      setError
    );
  };

  const saveNewSession = async (
    sessionName,
    sessionType,
    sessionLength,
    sessionLocation,
    equipment,
    sessionNotes,
    numberOfParticipants,
    price,
    setError
  ) => {
    await setDoc(doc(db, 'users', user.uid, 'sessions', sessionName), {
      sessionName: sessionName,
      sessionDateTime: sessionDateTime,
      sessionLength: sessionLength,
      sessionType: sessionType,
      numberOfParticipants: numberOfParticipants,
      sessionLocation: sessionLocation,
      equipment: equipment,
      sessionNotes: sessionNotes,
      price: price,
      trainerEmail: user.email,
      trainerName: user.displayName,
      trainerPhotoURL: user.photoURL,
      trainerID: user.uid,
      bookedSessions: 0,
    }).catch((err) => setError(err));

    await setDoc(doc(db, 'activeSessions', sessionName), {
      sessionName: sessionName,
      sessionDateTime: sessionDateTime,
      sessionLength: sessionLength,
      sessionType: sessionType,
      numberOfParticipants: numberOfParticipants,
      sessionLocation: sessionLocation,
      equipment: equipment,
      sessionNotes: sessionNotes,
      price: price,
      trainerEmail: user.email,
      trainerName: user.displayName,
      trainerPhotoURL: user.photoURL,
      trainerID: user.uid,
      bookedSessions: 0,
    }).catch((err) => setError(err));

    setMessage(true);
    console.log('Registered new session!');
  };

  const registerOptions = {
    sessionName: {
      required: 'Session Name is required',
      minLength: {
        value: 3,
        message: 'Session Name must have at least 3 letters',
      },
      maxLength: {
        value: 30,
        message: 'Session Name can have maximum 30 letters',
      },
      pattern: {
        value: /^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$/,
        message:
          'You can only use small letters, (. - _) symbols and numbers for session name',
      },
    },
    sessionType: {
      required: 'Session Type is required',
      minLength: {
        value: 3,
        message: 'Session Type must have at least 3 letters',
      },
      maxLength: {
        value: 20,
        message: 'Session Type can have maximum 20 letters',
      },
      pattern: {
        value:
          /^(?!.*[-!$%^&*()_+|~=`{}\[\]:÷\♧◇♡♤■□●○°☆¤《》0123456789";'£€\’•”‘¡¿…“„»«§¥₩₽¢\–—≠≈‰\<>?,.@#\/])/,
        message: 'Only letters allowed',
      },
    },
    numberOfParticipants: {
      required: 'Number of participants is required',
      pattern: {
        value: /^(0|[1-9]\d*)(\.\d+)?$/,
        message: 'Number of participants only numbers allowed',
      },
    },
  };

  return (
    <Screen style={{ backgroundColor: colors.white, flex: 1 }}>
      <View style={styles.container}>
        {message ? (
          <View style={styles.messageContainer}>
            <AppText style={styles.messageText}>Session saved</AppText>
          </View>
        ) : (
          <>
            <View style={styles.errorBox}>
              <ErrorMessage
                visible={true}
                error={
                  errors.sessionName
                    ? errors.sessionName.message
                    : errors.sessionType
                    ? errors.sessionType.message
                    : errors.numberOfParticipants
                    ? errors.numberOfParticipants.message
                    : error
                }
              />
            </View>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{ flex: 1 }}
            >
              <ScrollView
                contentContainerStyle={styles.formContainer}
                bounces={false}
              >
                <View style={styles.fieldView}>
                  <AppText style={styles.fieldText}>Session Name</AppText>
                  <Controller
                    control={control}
                    rules={registerOptions.sessionName}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <AppFormField
                        name='sessionName'
                        textContentType='none'
                        onChangeText={onChange}
                        value={value}
                      />
                    )}
                    name='sessionName'
                    defaultValue=''
                  />
                </View>
                <View style={styles.timeFieldView}>
                  <AppText style={styles.timeFieldText}>
                    Session Date and Time
                  </AppText>
                  <Controller
                    control={control}
                    //rules={registerOptions.sessionName}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <>
                        <View style={styles.dateButton}>
                          <Button
                            title={sessionDateTime.toLocaleDateString(
                              'en-GB',
                              dateOptions
                            )}
                            onPress={() => {
                              setShow(true);
                            }}
                          />
                        </View>
                        {show && (
                          <View style={styles.dateContainer}>
                            <DateTimePicker
                              minimumDate={new Date()}
                              testID='dateTimePicker'
                              value={sessionDateTime}
                              mode='datetime'
                              minuteInterval='15'
                              display='default'
                              onChange={(event, selectedDate) => {
                                const currentDate =
                                  selectedDate || sessionDateTime;
                                setShowDate(
                                  Platform.OS === 'android'
                                    ? !showStartDate
                                    : Platform.OS === 'ios'
                                );
                                setSessionDateTime(currentDate);
                              }}
                            />
                          </View>
                        )}
                      </>
                    )}
                    name='sessionDateTime'
                    defaultValue=''
                  />
                </View>
                <View style={styles.dropdownFieldView}>
                  <AppText style={styles.dropdownFieldText}>
                    Session length
                  </AppText>
                  <Controller
                    control={control}
                    //rules={registerOptions.sessionType}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <RNPickerSelect
                        onValueChange={(value) => {
                          //setTempClimbLevel(value)
                          onChange(value);
                        }}
                        items={[
                          { label: '45 min', value: '45', key: 1 },
                          { label: '60 min', value: '60', key: 2 },
                          { label: '90 min', value: '90', key: 3 },
                          { label: '120 min', value: '120', key: 4 },
                          {
                            label: 'Free Session',
                            value: 'free_session',
                            key: 5,
                          },
                        ]}
                        placeholder={
                          tempSessionLength
                            ? tempSessionLength
                            : {
                                label: 'Session length ...',
                                value: null,
                                color: colors.hearted2,
                              }
                        }
                        value={tempSessionLength}
                        style={{
                          ...pickerSelectStyles,
                          iconContainer: {
                            top: 10,
                            right: 12,
                          },
                          placeholder: {
                            color: colors.black,
                            fontSize: 14,
                          },
                        }}
                      />
                    )}
                    name='sessionLength'
                    defaultValue=''
                  />
                </View>
                <View style={styles.dropdownFieldView}>
                  <AppText style={styles.dropdownFieldText}>
                    Session Type
                  </AppText>
                  <Controller
                    control={control}
                    //rules={registerOptions.sessionType}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <RNPickerSelect
                        onValueChange={(value) => {
                          //setTempClimbLevel(value)
                          onChange(value);
                        }}
                        items={[
                          {
                            label: 'Bouldering - Begginers',
                            value: 'boulder_beginner',
                            key: 1,
                          },
                          {
                            label: 'Bouldering - Advanced',
                            value: 'boulder_advanced',
                            key: 2,
                          },
                          {
                            label: 'Lead climb - Beginners',
                            value: 'lead_beginner',
                            key: 3,
                          },
                          {
                            label: 'Lead climb - Advanced',
                            value: 'boulder_advanced',
                            key: 4,
                          },
                          {
                            label: 'Free Session',
                            value: 'free_session',
                            key: 5,
                          },
                        ]}
                        placeholder={
                          tempSessionType
                            ? tempSessionType
                            : {
                                label: 'Session type ...',
                                value: null,
                                color: colors.hearted2,
                              }
                        }
                        value={tempSessionType}
                        style={{
                          ...pickerSelectStyles,
                          iconContainer: {
                            top: 10,
                            right: 12,
                          },
                          placeholder: {
                            color: colors.black,
                            fontSize: 14,
                          },
                        }}
                      />
                    )}
                    name='sessionType'
                    defaultValue=''
                  />
                </View>
                <View style={styles.fieldView}>
                  <AppText style={styles.fieldText}>Session location</AppText>
                  <Controller
                    control={control}
                    rules={registerOptions.sessionLocation}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <AppFormField
                        name='sessionLocation'
                        textContentType='fullStreetAddress'
                        onChangeText={onChange}
                        value={value}
                      />
                    )}
                    name='sessionLocation'
                    defaultValue=''
                  />
                </View>
                <View style={styles.fieldView}>
                  <AppText style={styles.fieldText}>
                    Number of participants
                  </AppText>
                  <Controller
                    control={control}
                    rules={registerOptions.numberOfParticipants}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <AppFormField
                        name='numberOfParticipants'
                        textContentType='none'
                        onChangeText={onChange}
                        value={value}
                      />
                    )}
                    name='numberOfParticipants'
                    defaultValue=''
                  />
                </View>
                <View style={styles.fieldView}>
                  <AppText style={styles.fieldText}>Equipment</AppText>
                  <Controller
                    control={control}
                    //rules={registerOptions.numberOfParticipants}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <AppFormField
                        name='equipment'
                        textContentType='none'
                        numberOfLines={5}
                        maxLength={200}
                        multiline={true}
                        blurOnSubmit={false}
                        editable={true}
                        onChangeText={onChange}
                        value={value}
                        style={styles.textAreaField}
                      />
                    )}
                    name='equipment'
                    defaultValue=''
                  />
                </View>
                <View style={styles.fieldView}>
                  <AppText style={styles.fieldText}>Other Notes</AppText>
                  <Controller
                    control={control}
                    //rules={registerOptions.numberOfParticipants}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <AppFormField
                        name='sessionNotes'
                        textContentType='none'
                        numberOfLines={5}
                        maxLength={200}
                        multiline={true}
                        blurOnSubmit={false}
                        editable={true}
                        onChangeText={onChange}
                        value={value}
                        style={styles.textAreaField}
                      />
                    )}
                    name='sessionNotes'
                    defaultValue=''
                  />
                </View>
                <View style={styles.fieldView}>
                  <AppText style={styles.fieldText}>Price</AppText>
                  <Controller
                    control={control}
                    rules={registerOptions.numberOfParticipants}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <AppFormField
                        name='price'
                        textContentType='none'
                        onChangeText={onChange}
                        value={value}
                        onSubmitEditing={
                          !error.length ? handleSubmit(onSubmit) : null
                        }
                      />
                    )}
                    name='price'
                    defaultValue=''
                  />
                </View>
                <TouchableOpacity
                  onPress={!error.length ? handleSubmit(onSubmit) : null}
                  style={styles.submit}
                >
                  <AppText style={styles.submitButton}>Save Session</AppText>
                </TouchableOpacity>
                <View style={{ height: 15 }} />
              </ScrollView>
            </KeyboardAvoidingView>
          </>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'space-between',
  },
  boxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  messageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 100,
    paddingTop: 10,
  },
  messageText: {
    fontSize: 32,
    lineHeight: 40,
  },
  signUpTitle: {
    fontFamily: 'nunitoBold',
    fontSize: 28,
    lineHeight: 38,
    color: colors.black2,
  },
  signText: {
    color: colors.black,
    fontFamily: 'nunito',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 26,
    marginLeft: -6,
  },
  dateContainer: {
    marginRight: 30,
    width: '100%',
  },
  dateButton: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: colors.hearted2,
    borderRadius: 10,
  },
  errorBox: {
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  fieldView: {
    alignItems: 'flex-start',
    marginBottom: -25,
  },
  dropdownFieldView: {
    alignItems: 'flex-start',
    marginBottom: -10,
  },
  timeFieldView: {
    alignItems: 'flex-start',
    marginBottom: 5,
    width: windowWidth * 0.76,
  },
  fieldText: {
    marginLeft: 29,
    fontFamily: 'nunito',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 26,
    color: colors.black2,
    bottom: -20,
  },
  dropdownFieldText: {
    fontFamily: 'nunito',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 26,
    color: colors.black2,
    bottom: -5,
  },
  timeFieldText: {
    fontFamily: 'nunito',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 26,
    color: colors.black2,
    bottom: -5,
    textAlign: 'left',
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

  signUpContainer: {
    alignSelf: 'center',
    marginTop: 20,
  },
  signUpText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 19,
  },
  noAccountText: {
    color: colors.medium,
  },
  headerContainer: {
    alignItems: 'flex-start',
    flex: 0.8,
    paddingRight: 5,
    marginLeft: -35,
  },
  formContainer: {
    width: windowWidth,
    alignItems: 'center',
    marginTop: 25,
    paddingBottom: 40,
  },
  textAreaField: {
    height: 100,
    borderWidth: 1,
    borderColor: colors.gray2,
    borderRadius: 10,
    right: 35,
    paddingLeft: 15,
  },
  goBackButton: {
    flex: 0.1,
    marginTop: -30,
    zIndex: 20,
    elevation: 20,
  },
  bySigning: {
    fontFamily: 'nunito',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 20,
    alignSelf: 'center',
  },
  terms: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'nunito',
    color: colors.black2,
    alignSelf: 'center',
    textDecorationLine: 'underline',
    lineHeight: 20,
  },
  scrollText: {
    padding: 20,
  },
  confirmButton: {
    width: 80,
    height: 30,
    backgroundColor: colors.hearted,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollText: {
    padding: 20,
  },
  goBackButton: {
    alignSelf: 'center',
    zIndex: 20,
    elevation: 20,
    paddingLeft: 10,
  },
  headerOverlay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleOverlay: {
    fontFamily: 'nunitoBold',
    fontWeight: 'bold',
    fontSize: 28,
    lineHeight: 38,
    color: colors.black2,
    paddingRight: 90,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    width: windowWidth * 0.76,
    fontSize: 16,
    marginTop: 10,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.gray2,
    borderRadius: 10,
    color: colors.black,
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    width: windowWidth * 0.76,
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: colors.gray2,
    borderRadius: 10,
    color: colors.black,
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

export default RegisterNewSession;
