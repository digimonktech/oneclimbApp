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
import { Fontisto } from '@expo/vector-icons';
import colors from '../config/colors';

const windowHeight = Dimensions.get('window').height;

const GymProfile = ({ modalRef, item, setGym, allGymsRef }) => {
  const renderHeader = () => {
    return (
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => {
          modalRef.current?.close();
        }}
      >
        <Fontisto name='close-a' size={14} color={colors.darkGray} />
      </TouchableOpacity>
    );
  };

  return (
    <Portal>
      <Modalize
        ref={modalRef}
        modalHeight={windowHeight * 0.95}
        handleStyle={{ height: 5, width: 150 }}
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
        <View style={styles.container}>
          <Text style={styles.title}>Confirm location of gym</Text>
          <View style={styles.itemContainer}>
            <Text style={styles.gymName}>{item.name}</Text>
            <Text style={styles.gymInfo}>{item.address}</Text>
            <Text style={styles.gymInfo}>{item.email}</Text>
            <Text style={styles.gymInfo}>{item.phone}</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              setGym(item);
              allGymsRef.current?.close();
              modalRef.current?.close();
            }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </Modalize>
    </Portal>
  );
};

export default GymProfile;

const styles = StyleSheet.create({
  closeButton: {
    marginTop: 38,
    marginLeft: 24,
    elevation: 999,
  },
  container: {
    marginHorizontal: 23,
    marginTop: 29,
  },
  title: {
    fontFamily: 'poppinsSemiBold',
    fontSize: 16,
    lineHeight: 24,
    color: colors.darkBlue,
  },
  itemContainer: {
    width: '100%',
    height: windowHeight * 0.5,
    backgroundColor: '#6BB22B',
    borderRadius: 20,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  button: {
    height: 50,
    width: '100%',
    borderRadius: 42,
    backgroundColor: colors.oneClimbOrange,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    marginTop: 80,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: 'poppinsSemiBold',
    fontSize: 18,
    lineHeight: 27,
  },
  gymName: {
    fontFamily: 'nunitoBold',
    fontSize: 24,
    lineHeight: 28,
    color: '#FFFFFF',
    marginBottom: 30,
  },
  gymInfo: {
    fontFamily: 'nunito',
    fontSize: 16,
    lineHeight: 22,
    color: '#FFFFFF',
  },
});
