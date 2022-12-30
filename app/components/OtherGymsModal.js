import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useRef, useState } from 'react';
import { Portal } from 'react-native-portalize';
import { Modalize } from 'react-native-modalize';
import { Fontisto } from '@expo/vector-icons';
import colors from '../config/colors';
import { GOOGLE_API_KEY } from '@env';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const windowHeight = Dimensions.get('window').height;

const OtherGymsModal = ({ modalRef, setGym, saveGymToDb }) => {
  const handleSearch = (data, details = null) => {
    setGym({
      address: details.formatted_address,
      phone: details.formatted_phone_number || '',
      geometry: details.geometry || '',
      name: details.name,
      opening_hours: details.opening_hours || '',
      photos: details.photos || '',
      place_id: details.place_id,
      rating: details.rating || '',
    });
  };

  const renderHeader = () => {
    return (
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => {
          modalRef.current?.close();
          saveGymToDb();
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
          disableScrollViewPanResponder: true,
        }}
        HeaderComponent={renderHeader}
        closeSnapPointStraightEnabled={false}
        keyboardShouldPersistTaps='always'
        panGestureEnabled={false}
      >
        <View style={styles.container}>
          <Text style={styles.title}>
            Write the address of your session location
          </Text>
          <GooglePlacesAutocomplete
            placeholder='Search Location'
            textInputProps={{
              placeholderTextColor: 'rgba(48, 43, 45, 1)',
              lineHeight: 20,
            }}
            minLength={2}
            autoFocus={true}
            returnKeyType={'search'}
            fetchDetails={true}
            onPress={handleSearch}
            query={{
              key: GOOGLE_API_KEY,
              language: 'en',
            }}
            nearbyPlacesAPI='GooglePlacesSearch'
            debounce={300}
            keyboardShouldPersistTaps='always'
            styles={{
              textInputContainer: {
                marginVertical: 20,
                borderColor: colors.darkGray,
                borderRadius: 10,
                borderWidth: 1,
              },
              textInput: {
                // backgroundColor: 'transparent',
              },
            }}
          />
        </View>
        <TouchableOpacity
          onPress={() => {
            saveGymToDb();
            modalRef.current?.close();
          }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Ok</Text>
        </TouchableOpacity>
      </Modalize>
    </Portal>
  );
};

export default OtherGymsModal;

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
    marginLeft: 15,
    fontFamily: 'nunito',
    fontSize: 14,
    lineHeight: 19,
    color: colors.darkGray,
  },
  button: {
    height: 50,
    width: 150,
    borderRadius: 42,
    backgroundColor: colors.oneClimbOrange,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    marginRight: 23,
    marginTop: 50,
  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: 'poppinsSemiBold',
    fontSize: 18,
    lineHeight: 27,
  },
});
