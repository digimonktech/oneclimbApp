import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import AppText from '../components/AppText';
import colors from '../config/colors';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { loggingOut } from '../api/firebase';
import { useNavigation } from '@react-navigation/core';

const LogOut = ({ setUser }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          setUser();
          navigation.navigate('Home');
          loggingOut();
        }}
      >
        <AppText style={styles.text}>Log out</AppText>
      </TouchableOpacity>
      <AppText style={styles.version}>VERSION 1.01</AppText>
    </View>
  );
};

export default LogOut;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 25,
    marginTop: 115,
  },

  text: {
    fontFamily: 'poppinsSemiBold',
    fontSize: 16,
    lineHeight: 24,
    color: colors.darkGray,
    textDecorationLine: 'underline',
  },
  version: {
    paddingVertical: 35,
    fontFamily: 'poppins',
    fontSize: 14,
    lineHeight: 21,
  },
});
