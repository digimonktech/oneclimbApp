/* eslint-disable react/no-unescaped-entities */
import React, { useContext } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  Image,
} from 'react-native';

import colors from '../config/colors';
import AppText from '../components/AppText';
import { LinearGradient } from 'expo-linear-gradient';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

function VerifyScreen({ navigation }) {
  return (
    <View style={styles.container}>
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
      </View>
      <Image
        style={styles.imageText}
        source={require('../assets/oneClimbText.png')}
      />
      <View style={styles.body}>
        <AppText style={styles.login}>Verify your email</AppText>
        <AppText style={styles.text}>
          Please verify your email and login with account credentials
        </AppText>
        <TouchableOpacity
          style={styles.submit}
          activeOpacity={0.5}
          onPress={() => {
            navigation.navigate('Login');
          }}
        >
          <AppText style={styles.submitButton}>Login</AppText>
        </TouchableOpacity>
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

  body: {
    width: windowWidth,
    alignItems: 'center',
    backgroundColor: colors.white,
    marginHorizontal: 25,
    borderTopRightRadius: 25,
    marginTop: windowWidth * 0.2,
  },
  login: {
    fontFamily: 'poppinsSemiBold',
    fontSize: 28,
    lineHeight: 42,
    fontWeight: '600',
    alignSelf: 'flex-start',
    color: colors.darkBlue,
    marginHorizontal: 15,
    marginTop: 20,
  },
  text: {
    color: colors.oneClimbOrange,
    fontFamily: 'nunito',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 28,
    marginVertical: 20,
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
});

export default VerifyScreen;
