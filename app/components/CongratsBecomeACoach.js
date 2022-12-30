import {
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { Portal } from 'react-native-portalize';
import { Modalize } from 'react-native-modalize';
import colors from '../config/colors';
import { Divider } from 'react-native-elements';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const CongratsBecomeACoach = ({
  modalRef,
  overviewRef,
  aboutYouRef,
  reviewRef,
}) => {
  const renderHeader = () => {
    return (
      <View>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              modalRef.current?.close();
            }}
          >
            <Entypo name='chevron-left' size={24} color='#FFFFFF' />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <Portal>
      <Modalize
        ref={modalRef}
        modalHeight={windowHeight}
        handleStyle={{
          height: 5,
          width: 150,
          backgroundColor: '#DEDEDE',
          zIndex: 999,
        }}
        handlePosition={'inside'}
        overlayStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.25)' }}
        modalStyle={{
          backgroundColor: colors.oneClimbOrange,
          shadowOpacity: 0.25,
          shadowOffset: { width: 0, height: -5 },
        }}
        scrollViewProps={{
          bounces: false,
        }}
        closeSnapPointStraightEnabled={false}
        keyboardShouldPersistTaps='always'
        panGestureEnabled={false}
      >
        <View style={styles.container}>
          <Image
            style={styles.logo}
            source={require('../assets/logoOrange.png')}
          />
          <View style={styles.divider} />
          <Text style={styles.congrats}>Congrats!</Text>
          <Text style={styles.text}>
            You are almost onboarded as OneClimb coach. Should all is ok, we’ll
            soon approve your application.
            {'\n'}
            {'\n'}
            Please wait for our conformation, it can take up to 3 working days.
          </Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            reviewRef.current?.close();
            aboutYouRef.current?.close();
            overviewRef.current?.close();
            modalRef.current?.close();
          }}
        >
          <Text style={styles.buttonText}>Close</Text>
        </TouchableOpacity>
      </Modalize>
    </Portal>
  );
};

export default CongratsBecomeACoach;

const styles = StyleSheet.create({
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 25,
    marginTop: 38,
    zIndex: 999,
    elevation: 999,
  },
  container: {
    height: 460,
    marginHorizontal: 25,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginTop: 176,
    alignItems: 'center',
  },
  logo: {
    width: 200,
    resizeMode: 'contain',
    marginTop: -40,
  },
  divider: {
    width: 100,
    height: 2,
    backgroundColor: colors.oneClimbOrange,
    marginTop: -40,
  },
  congrats: {
    fontFamily: 'poppinsSemiBold',
    fontSize: 18,
    lineHeight: 27,
    color: colors.darkBlue,
    marginTop: 23,
  },
  text: {
    fontFamily: 'nunito',
    fontSize: 14,
    lineHeight: 18,
    textAlign: 'center',
    color: colors.darkGray,
    marginHorizontal: 13,
    marginTop: 15,
  },
  button: {
    height: 50,
    width: 150,
    borderRadius: 42,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 25,
    alignSelf: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: colors.darkBlue,
    fontFamily: 'poppinsSemiBold',
    fontSize: 18,
    lineHeight: 27,
  },
});
