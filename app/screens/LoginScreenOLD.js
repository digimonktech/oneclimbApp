/* eslint-disable react/no-unescaped-entities */
import React, { useState, useContext, useEffect } from 'react';
import {
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
  Dimensions,
} from 'react-native';
/* import firebase from 'firebase/compat/app';
import { useForm, Controller } from 'react-hook-form';
import { Overlay, Divider } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';

import AppText from '../components/AppText';
import { AppFormField, ErrorMessage } from '../components/forms';
import colors from '../config/colors';
import { signIn } from '../api/firebase';
import AuthContext from '../auth/context';
import PrivacyPolicy from '../data/PrivacyPolicy';
import AppleSignIn from '../components/AppleSignIn';
import GoogleSignIn from '../components/GoogleSignIn';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width; */

function LoginScreen({ navigation }) {
  /* const [message, setMessage] = useState();
  const [errorText, setErrorText] = useState('');
  const [sendVerifyMailVisible, setSendVerifyMailVisible] = useState(false);
  const { setUser } = useContext(AuthContext);
  const [visible, setVisible] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = ({ email, password }) =>
    signIn(
      email,
      password,
      navigation,
      setErrorText,
      setUser,
      setSendVerifyMailVisible
    );

  const logInOptions = {
    email: {
      required: 'Email is required',
    },
    password: {
      required: 'Password is required',
    },
  };

  useEffect(() => {
    return () => {
      setMessage();
      setErrorText('');
    };
  }, []);

  const toggleOverlay = () => {
    setVisible(!visible);
  };
 */
  return (
    <View style={styles.container}>
      {/* <View style={{ alignItems: 'center' }}>
        <View
          style={
            windowHeight < 750
              ? { alignItems: 'center', marginTop: -15 }
              : { alignItems: 'center' }
          }
        >
          <AppText style={styles.welcomeText}>Welcome to Hearted!</AppText>
          <AppText style={styles.smallText}>
            Please log in to your account
          </AppText>
        </View>
        <View style={styles.fContainer}>
          <AppText style={styles.errors} visible={message}>
            {message}
          </AppText>
          <ErrorMessage
            visible={true}
            error={
              errors.email
                ? errors.email.message
                : errors.password
                ? errors.password.message
                : errorText
            }
          />
          {sendVerifyMailVisible && (
            <TouchableOpacity
              style={{ marginLeft: 20, marginTop: 5 }}
              onPress={() => {
                firebase.auth().currentUser.sendEmailVerification();
                Alert.alert(
                  `Verification e-mail sent`,
                  `Once you verify your e-mail, you will be able to use the app`,
                  [{ text: 'Close', onPress: () => {} }]
                );
              }}
            >
              <AppText style={{ fontSize: 15, color: 'dodgerblue' }}>
                Resend verification e-mail
              </AppText>
            </TouchableOpacity>
          )}
          <View style={styles.fieldView}>
            <AppText style={styles.fieldText}>Email</AppText>
            <Controller
              control={control}
              rules={logInOptions.email}
              render={({ field: { onChange, onBlur, value } }) => (
                <AppFormField
                  autoCorrect={false}
                  keyboardType='email-address'
                  name='email'
                  textContentType='emailAddress'
                  onChangeText={(text) => {
                    onChange(text.trim());
                  }}
                  value={value}
                />
              )}
              name='email'
              defaultValue=''
            />
          </View>
          <View style={styles.fieldView}>
            <AppText style={styles.fieldText}>Password</AppText>
            <Controller
              control={control}
              rules={logInOptions.password}
              render={({ field: { onChange, onBlur, value } }) => (
                <AppFormField
                  name='password'
                  secureTextEntry
                  textContentType='password'
                  onChangeText={onChange}
                  value={value}
                  onSubmitEditing={handleSubmit(onSubmit)}
                  returnKeyType='done'
                />
              )}
              name='password'
              defaultValue=''
            />
          </View>
          <View style={styles.forgotPass}>
            <TouchableOpacity
              style={{ alignItems: 'flex-end' }}
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <AppText style={styles.forgotPassText}>Forgot password?</AppText>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            style={styles.submit}
          >
            <AppText style={styles.submitButton}>Login</AppText>
          </TouchableOpacity>
        </View>
        <View style={styles.dividerContainer}>
          <Divider style={styles.divider} />
          <AppText style={styles.or}>or</AppText>
          <Divider style={styles.divider} />
        </View>
        <View style={styles.socialContainer}>
          <GoogleSignIn />
          <AppleSignIn />
          <View style={styles.signUpContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <AppText style={styles.noAccountText}>
                Don't have an account yet?
                <AppText style={styles.signUpText}> Sign up*</AppText>
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ bottom: 4 }}>
          <AppText style={styles.bySigning}>
            By signing up you are accepting our
          </AppText>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => setVisible(!visible)}
          >
            <AppText style={styles.terms}>
              *Terms & Conditions and Privacy Policy
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
      <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
        <View style={{ height: windowHeight }}>
          <View
            style={[
              windowHeight < 750 ? { marginTop: 10 } : { marginTop: 54 },
              styles.headerOverlay,
            ]}
          >
            <TouchableOpacity
              style={styles.goBackButton}
              onPress={toggleOverlay}
            >
              <Ionicons name='chevron-back' size={18} color={colors.hearted2} />
            </TouchableOpacity>
            <AppText style={styles.titleOverlay}>Terms of Service</AppText>
          </View>
          <ScrollView style={styles.scrollText}>
            <PrivacyPolicy />
          </ScrollView>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => setVisible(!visible)}
            style={{ alignItems: 'center' }}
          >
            <View style={[styles.submit, { bottom: 25 }]}>
              <AppText style={styles.submitButton}>Confirm</AppText>
            </View>
          </TouchableOpacity>
        </View>
      </Overlay> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    top: 0,
    left: 0,
    flexDirection: 'column',
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 25,
  },

  welcomeText: {
    fontFamily: 'nunitoBold',
    fontSize: 28,
    color: colors.black2,
    lineHeight: 38,
    fontWeight: '700',
    marginTop: '9%',
  },

  smallText: {
    fontSize: 16,
    color: colors.hearted2,
    fontFamily: 'nunito',
    lineHeight: 26,
    fontWeight: '400',
  },
  fContainer: {
    width: windowWidth,
    alignItems: 'center',
    marginTop: -10,
  },
  fieldView: {
    alignItems: 'flex-start',
    marginBottom: -25,
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
  fbSignIn: {
    flexDirection: 'row',
    width: 270,
    alignSelf: 'center',
    top: 20,
  },
  fbSignInTextView: {
    backgroundColor: '#4267b2',
    width: 220,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fbSignInText: {
    color: colors.white,
    fontWeight: '800',
  },
  fbSignInIcon: {
    backgroundColor: '#4267b2',
    justifyContent: 'center',
    paddingLeft: 7,
    width: 50,
    height: 50,
  },
  submit: {
    alignSelf: 'center',
    backgroundColor: colors.hearted2,
    width: windowWidth * 0.77,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginTop: 15,
  },
  submitButton: {
    color: colors.white,
    fontFamily: 'nunitoBold',
    fontWeight: '700',
    fontSize: 16,
  },
  dividerContainer: {
    flexDirection: 'row',
    marginTop: 15,
    alignItems: 'center',
    marginBottom: 20,
  },

  or: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'nunito',
    color: colors.black2,
    marginLeft: 20,
    marginRight: 20,
  },
  divider: {
    width: 122,
    height: 1,
    color: colors.gray2,
  },
  copyContainer: {
    flex: 2,
  },
  copy: {
    height: 40,
    alignSelf: 'flex-start',
    top: 80,
    left: 20,
  },
  logo: {
    width: 110,
    height: 100,
    alignSelf: 'flex-end',
    top: 70,
    right: 20,
  },
  signUpContainer: {
    alignSelf: 'center',
    marginTop: '2%',
  },
  signUpText: {
    color: 'dodgerblue',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'nunito',
    textDecorationLine: 'underline',
  },
  noAccountText: {
    color: colors.black2,
    fontSize: 16,
    fontFamily: 'nunito',
    fontWeight: '400',
    lineHeight: 26,
  },
  bySigning: {
    fontFamily: 'nunito',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 20,
    alignSelf: 'center',
  },
  formContainer: {
    top: '8%',
  },
  socialContainer: {
    flex: 1,
  },
  forgotPass: {
    width: windowWidth,
    flexDirection: 'column',
    alignItems: 'flex-end',
    color: colors.medium,
    justifyContent: 'flex-end',
    marginRight: 5,
    zIndex: 100,
    elevation: 100,
  },
  forgotPassText: {
    color: colors.black2,
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'nunito',
    marginTop: -2,
    marginRight: 45,
  },
  terms: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'nunito',
    color: 'dodgerblue',
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
  errors: {
    color: colors.warning2,
    fontFamily: 'nunito',
    fontSize: 12,
    lineHeight: 22,
    fontWeight: '400',
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

export default LoginScreen;
