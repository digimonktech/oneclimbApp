import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useRef } from 'react';
import { Portal } from 'react-native-portalize';
import { Modalize } from 'react-native-modalize';
import { Fontisto } from '@expo/vector-icons';
import AppText from './AppText';
import colors from '../config/colors';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_API_KEY } from '@env';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { useContext } from 'react';
import AuthContext from '../auth/context';
import { useStore } from '../hooks/useStore';
import { firebaseConfig } from '../config/Firebase/firebaseConfig';
import firebase from "firebase/compat/app";

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const WhereAreYou = ({ modalRef }) => {
  const [locationData, setLocationData] = useState({});
  const db = getFirestore(firebase.initializeApp(firebaseConfig));
  const { user } = useContext(AuthContext);
  const handleSearch = (data, details = null) => {
    setLocationData(details);
  };
  const fetchUserData = useStore((state) => state.fetchUserData);

  const googleSearchRef = useRef(null);

  const saveLocation = async () => {
    if (locationData)
      await setDoc(
        doc(db, 'users', user.uid),
        {
          location: {
            geometry: locationData.geometry.location,
            vicinity: locationData.vicinity,
            place_id: locationData.place_id,
          },
        },
        { merge: true }
      )
        .then(() => fetchUserData(user.uid))
        .then(() => modalRef.current?.close());
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
        closeSnapPointStraightEnabled={false}
        keyboardShouldPersistTaps='always'
        panGestureEnabled={false}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginHorizontal: 20,
            marginTop: 20,
          }}
        >
          <TouchableOpacity onPress={() => modalRef.current?.close()}>
            <Fontisto
              name='close-a'
              size={14}
              color={colors.darkGray}
              style={{ marginRight: 9 }}
            />
          </TouchableOpacity>

          <AppText style={styles.title}>Enter your location</AppText>
          <TouchableOpacity onPress={saveLocation}>
            <AppText style={styles.save}>Save</AppText>
          </TouchableOpacity>
        </View>

        <View style={styles.container}>
          <AppText style={styles.where}>Where are you?</AppText>
          <View style={styles.containerSearch}>
            <GooglePlacesAutocomplete
              ref={googleSearchRef}
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
                  //backgroundColor: 'transparent',
                },
                textInput: {
                  // backgroundColor: 'transparent',
                },
                listView: {
                  borderBottomEndRadius: 10,
                  zIndex: 999,
                  elevation: 999,
                },
              }}
            />
          </View>
        </View>
      </Modalize>
    </Portal>
  );
};

export default WhereAreYou;

const styles = StyleSheet.create({
  title: {
    fontFamily: 'nunitoBold',
    fontSize: 16,
    lineHeight: 22,
    color: colors.darkGray,
    marginLeft: 15,
  },
  save: {
    fontFamily: 'nunitoBold',
    fontSize: 16,
    lineHeight: 22,
    color: colors.darkGray,
    textDecorationLine: 'underline',
  },
  container: {
    marginTop: 33,
    marginHorizontal: 30,
  },
  where: {
    fontFamily: 'nunito',
    fontSize: 16,
    lineHeight: 26,
    color: '#302B2D',
    marginBottom: 5,
  },
  containerSearch: {
    borderWidth: 1,
    borderColor: colors.gray2,
    borderRadius: 10,
    zIndex: 999,
    elevation: 999,
  },
});
