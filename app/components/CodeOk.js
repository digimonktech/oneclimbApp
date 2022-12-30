import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { Portal } from 'react-native-portalize';
import { Modalize } from 'react-native-modalize';
import AppText from './AppText';
import colors from '../config/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const CodeOk = ({ modalRef }) => {
  const navigation = useNavigation();
  return (
    <Portal>
      <Modalize
        ref={modalRef}
        modalHeight={windowHeight * 0.46}
        scrollViewProps={{ scrollEnabled: false }}
        handleStyle={{ height: 5, width: 150 }}
        handlePosition={'inside'}
        overlayStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.25)' }}
        modalStyle={{
          shadowOpacity: 0.25,
          shadowOffset: { width: 0, height: -5 },
        }}
        closeSnapPointStraightEnabled={false}
      >
        <View style={{ alignItems: 'center', marginTop: 15 }}>
          <AppText style={styles.code}>Code is ok</AppText>
          <MaterialIcons
            name='verified-user'
            size={110}
            color={colors.hearted2}
          />
          <AppText style={styles.verified}>Phone number verified!</AppText>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              navigation.navigate('ShowProfile');
              modalRef.current?.close();
            }}
          >
            <AppText style={styles.done}>Done</AppText>
          </TouchableOpacity>
        </View>
      </Modalize>
    </Portal>
  );
};

export default CodeOk;

const styles = StyleSheet.create({
  code: {
    fontFamily: 'poppinsSemiBold',
    fontSize: 28,
    lineHeight: 48,
    color: '#1A265B',
  },
  verified: {
    fontFamily: 'nunito',
    fontSize: 22,
    lineHeight: 28,
    textDecorationLine: 'underline',
    color: colors.darkGray,
    marginTop: 15,
  },
  button: {
    width: 150,
    height: 50,
    borderRadius: 42,
    backgroundColor: colors.oneClimbOrange,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  done: {
    color: '#FFFFFF',
    fontFamily: 'poppinsSemiBold',
    fontSize: 18,
    lineHeight: 27,
  },
});
