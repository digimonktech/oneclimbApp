import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useRef, useState } from 'react';
import Screen from '../components/Screen';
import { Fontisto } from '@expo/vector-icons';
import colors from '../config/colors';
import AppText from '../components/AppText';
import PhoneInput from 'react-native-phone-number-input';
import {
  getAuth,
  //multiFactor,
  //PhoneAuthProvider,
  //signInWithCredential,
} from 'firebase/auth';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { firebaseConfig } from '../config/Firebase/firebaseConfig';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { sendSmsVerification } from '../api/verify';

const windowWidth = Dimensions.get('window').width;

const VerifyPhoneScreen = ({ navigation }) => {
  const auth = getAuth();
  auth.languageCode = auth.useDeviceLanguage();
  const [value, setValue] = useState('');
  const [formattedValue, setFormattedValue] = useState('');
  const [valid, setValid] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const phoneInput = useRef(null);
  const recaptchaRef = useRef(null);
  const [verificationId, setVerificationId] = useState();
  //const multiFactorUser = multiFactor(auth.currentUser);

  const getCode = async () => {
    sendSmsVerification(formattedValue).then((sent) => {
      navigation.navigate('ConfirmationCode', {
        formattedValue,
      });
    });

    /*
    multiFactorUser
      .getSession()
      .then((multiFactorSession) => {
        // Specify the phone number and pass the MFA session.
        const phoneInfoOptions = {
          phoneNumber: formattedValue,
          session: multiFactorSession,
        };
        const provider = new PhoneAuthProvider(auth);
        return provider.verifyPhoneNumber(
          phoneInfoOptions,
          recaptchaRef.current
        );
      })
      .then((verificationId) => {
        setVerificationId(verificationId);
        console.log(verificationId);
        navigation.navigate('ConfirmationCode', {
          verificationId,
          formattedValue,
        });
      })
      .catch((error) => console.log(error));
    console.log('ver', verificationId);
*/
    /* const appVerifier = new RecaptchaVerifier(
      'next',
      {
        size: 'invisible',
        callback: (response) => {
          console.log(response);
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          // onSignInSubmit();
        },
      },
      auth
    );

    signInWithPhoneNumber(auth, formattedValue, appVerifier)
      .then((confirmationResult) => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        window.confirmationResult = confirmationResult;
        console.log(confirmationResult);
        // ...
      })
      .catch((error) => {
        console.log(error);
        // Error; SMS not sent
        // ...
      }); */
  };

  return (
    <Screen style={{ backgroundColor: colors.white }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Fontisto
            name='close-a'
            size={14}
            color={colors.darkGray}
            style={{ marginLeft: 24 }}
          />
        </TouchableOpacity>
        <AppText style={styles.title}>Edit phone number</AppText>
      </View>
      <KeyboardAwareScrollView style={{ flex: 1 }}>
        <View style={styles.container}>
          <AppText style={styles.text}>
            For notifications, reminders and help logging in
          </AppText>
          <AppText style={styles.phone}>PHONE NUMBER</AppText>

          <PhoneInput
            ref={phoneInput}
            defaultValue={value}
            defaultCode='SI'
            //layout='first'
            containerStyle={{
              marginVertical: 18,
              marginHorizontal: 10,
              backgroundColor: '#EFEFEF',
              borderRadius: 10,
            }}
            textInputStyle={{
              backgroundColor: '#EFEFEF',
              fontFamily: 'nunitoBold',
            }}
            textContainerStyle={{
              backgroundColor: '#EFEFEF',
              borderRadius: 10,
            }}
            onChangeText={(text) => {
              setValue(text);
            }}
            onChangeFormattedText={(text) => {
              setFormattedValue(text);
              const checkValid = phoneInput.current?.isValidNumber(text);
              setShowMessage(true);
              setValid(checkValid ? checkValid : false);
            }}
            autoFocus
          />
        </View>

        {valid ? (
          <TouchableOpacity
            style={styles.button}
            onPress={() => getCode()} /*  onPress={() =>
              navigation.navigate('ConfirmationCode', { formattedValue }) 
            }*/
          >
            <AppText id={'next'} style={styles.next}>
              Next
            </AppText>
          </TouchableOpacity>
        ) : null}
      </KeyboardAwareScrollView>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaRef}
        firebaseConfig={firebaseConfig}
        attemptInvisibleVerification={true}
      />
    </Screen>
  );
};

export default VerifyPhoneScreen;

const styles = StyleSheet.create({
  header: {
    marginTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'nunitoBold',
    fontSize: 16,
    lineHeight: 22,
    color: colors.darkGray,
    marginLeft: windowWidth * 0.22,
  },
  container: {
    marginTop: 36,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: colors.gray2,
    marginHorizontal: 24,
  },
  text: {
    fontFamily: 'nunito',
    fontSize: 16,
    lineHeight: 18,
    color: colors.darkGray,
    marginVertical: 18,
    marginHorizontal: 16,
  },
  phone: {
    fontFamily: 'nunitoBold',
    fontSize: 16,
    lineHeight: 26,
    marginHorizontal: 16,
  },
  button: {
    width: 150,
    height: 50,
    borderRadius: 42,
    backgroundColor: colors.oneClimbOrange,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: windowWidth * 0.55,
    marginTop: 30,
  },
  next: {
    color: '#FFFFFF',
    fontFamily: 'poppinsSemiBold',
    fontSize: 18,
    lineHeight: 27,
  },
});
