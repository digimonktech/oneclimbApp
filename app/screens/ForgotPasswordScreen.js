import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';

import { passwordReset } from '../api/firebase';
import AppText from '../components/AppText';
import { AppFormField } from '../components/forms';
import colors from '../config/colors';
import { getAuth } from 'firebase/auth';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'react-native';
import { Divider } from 'react-native-elements';
import GoogleSignIn from '../components/GoogleSignIn';
import AppleSignIn from '../components/AppleSignIn';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

function ForgotPasswordScreen({ navigation }) {
  const [message, setMessage] = useState();
  const auth = getAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = ({ email }) => resetPassword(auth, email);

  const resetPassword = async (auth, email) => {
    try {
      await passwordReset(auth, email);
      setMessage('Password reset email sent successfully');
      setTimeout(() => {
        navigation.navigate('Login');
      }, 1500);
    } catch (error) {
      setMessage('Wrong email or user doesnt exist.');
      console.log(error);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={{ alignItems: 'center' }}>
        <View>
          <ImageBackground
            style={styles.image}
            source={require('../assets/oneClimb.png')}
          />
          <LinearGradient
            colors={['#000000d9', '#00000026']}
            style={{
              backgroundColor: 'transparent',
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              borderRadius: 10,
              transform: [{ rotate: '180deg' }],
            }}
            locations={[0, 0.36]}
          />
          <TouchableOpacity style={styles.backArrow} onPress={handleGoBack}>
            <Ionicons name='chevron-back' size={22} color={colors.white} />
          </TouchableOpacity>
        </View>
        <Image
          style={styles.imageText}
          source={require('../assets/oneClimbText.png')}
        />
        <View style={styles.fContainer}>
          <AppText style={styles.login}>Reset your password</AppText>
          <View>
            <Controller
              control={control}
              rules={{
                required: 'Email is required',
                pattern: {
                  value:
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  message: 'E-mail must be in propper format',
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <AppFormField
                  keyboardType='email-address'
                  name='email'
                  textContentType='emailAddress'
                  onChangeText={(text) => {
                    onChange(text.trim());
                  }}
                  value={value}
                  icon={'email-outline'}
                  color={colors.darkGray}
                  placeholder={'Email'}
                />
              )}
              name='email'
              defaultValue=''
            />
          </View>
          <AppText
            visible={true}
            style={errors.email ? styles.error : styles.success}
          >
            {errors.email ? errors.email.message : message}
          </AppText>

          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            style={styles.submit}
          >
            <AppText style={styles.submitButton}>Reset</AppText>
          </TouchableOpacity>
        </View>
        <View style={styles.dividerContainer}>
          <Divider style={styles.divider} />
          <AppText style={styles.or}>or</AppText>
          <Divider style={styles.divider} />
        </View>
        {/* <View style={styles.socialContainer}>
          <GoogleSignIn />
          <AppleSignIn />
        </View> */}
        <View 
        // style={{ bottom: 33 }}
        >
          <View style={styles.signUpContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <AppText style={styles.noAccountText}>
                New User?
                <AppText style={styles.signUpText}> Sign up</AppText>
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
  },
  image: {
    width: windowWidth,
    height: windowHeight * 0.51,
  },
  imageText: {
    width: 100,
    height: 83.33,
    marginTop: -314,
  },
  login: {
    fontFamily: 'poppinsSemiBold',
    fontSize: 28,
    lineHeight: 42,
    fontWeight: '600',
    alignSelf: 'flex-start',
    color: colors.darkBlue,
    marginHorizontal: 25,
    marginTop: 20,
  },

  fContainer: {
    width: windowWidth,
    alignItems: 'center',
    marginTop: windowHeight * 0.08,
    backgroundColor: colors.white,
    marginHorizontal: 25,
    borderTopRightRadius: 25,
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
  noAccountText: {
    color: colors.medium,
  },
  headerContainer: {
    alignItems: 'center',
    flex: 0.8,
    paddingRight: 5,
    marginLeft: -35,
  },
  formContainer: {
    width: windowWidth,
    alignItems: 'center',
    marginTop: 60,
  },

  messageContainer: {
    alignItems: 'flex-start',
  },

  error: {
    color: colors.oneClimbOrange,
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'nunitoBold',
    marginLeft: 46,
    lineHeight: 16,
    alignSelf: 'flex-start',
  },
  success: {
    color: colors.light,
  },
  backArrow: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 20,
    elevation: 20,
  },
  boxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    marginLeft: -3,
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
  submit: {
    alignSelf: 'center',
    backgroundColor: colors.oneClimbOrange,
    width: windowWidth * 0.9,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 42,
    marginTop: 15,
  },
  submitButton: {
    color: colors.white,
    fontFamily: 'poppinsSemiBold',
    fontWeight: '600',
    fontSize: 18,
    lineHeight: 27,
  },
  dividerContainer: {
    flexDirection: 'row',
    marginTop: 12,
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
    width: 138,
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
    color: colors.oneClimbOrange,
    fontWeight: '700',
    fontSize: 16,
    fontFamily: 'poppinsSemiBold',
    lineHeight: 24,
  },
  noAccountText: {
    color: colors.darkGray,
    fontSize: 16,
    fontFamily: 'poppinsSemiBold',
    fontWeight: '700',
    lineHeight: 24,
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
    alignItems: 'flex-start',
    color: colors.white,
    justifyContent: 'flex-start',
    zIndex: 100,
    elevation: 100,
    marginLeft: 69,
  },
  forgotPassText: {
    color: colors.oneClimbOrange,
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'nunitoBold',
    marginRight: 45,
    lineHeight: 19,
    marginTop: -2,
  },

  goBackButton: {
    alignSelf: 'center',
    zIndex: 20,
    elevation: 20,
    paddingLeft: 10,
  },
});

export default ForgotPasswordScreen;
