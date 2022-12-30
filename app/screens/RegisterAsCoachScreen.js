import React, { useState, useLayoutEffect, useContext, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  ImageBackground,
  Alert,
} from 'react-native';

import Screen from '../components/Screen';

import { useNavigation } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/core';
import { Ionicons } from '@expo/vector-icons';
//import { Video } from 'expo-av';

//import firebase from 'firebase/compat/app';
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import AuthContext from '../auth/context';

import colors from '../config/colors';
import AppText from '../components/AppText';

import LottieIcon from '../components/LottieIcon';
import CoachRegistrationComponent from '../components/CoachRegistrationComponent';
import { firebaseConfig } from '../config/Firebase/firebaseConfig';
import firebase from "firebase/compat/app";
//import CarouselItemModal from '../components/CarouselItemModal';

const RegisterAsCoachScreen = () => {
  const navigation = useNavigation();
  let focused = useIsFocused();
  const [modalVisible, setModalVisible] = useState(false);
  const [businesses, setBusinesses] = useState();
  const [item, setItem] = useState();
  //const [videoLoaded, setVideoLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user } = useContext(AuthContext);
  const db = getFirestore(firebase.initializeApp(firebaseConfig));
  const modalRef = useRef();

  /* const getBusinesses = async () => {
    let places = [];
    let placesData = [];
    const query = await db
      .collection('users')
      .doc(user.uid)
      .collection('businesses')
      .get()
      .then((snap) => {
        snap.forEach((doc) => {
          places.push({ id: doc.data().place_id, status: doc.data().status });
        });
      })
      .then(() =>
        places.map((place) => {
          db.collection('places_live')
            .doc(place.id)
            .get()
            .then((doc) => {
              placesData.push({ ...doc.data(), status: place.status });
            });
        })
      )
      .then(() => {
        setTimeout(() => {
          setBusinesses(placesData);
        }, 1000);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };
 */
  useLayoutEffect(() => {
    // getBusinesses();
    return () => {
      setBusinesses();
      setItem();
      //setVideoLoaded(false);
      // setLoading(true);
    };
  }, [modalVisible, focused]);

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={
          item.status === 'pending'
            ? [styles.card, { opacity: 0.5 }]
            : styles.card
        }
        onPress={() => {
          if (item.status === 'approved') {
            navigation.navigate('BusinessEdit', { item: item });
          } else {
            Alert.alert(
              'Waiting for approved',
              `In order to own this business, we need to confirm that you are authorized to do so`,
              [{ text: 'Close', onPress: () => {} }]
            );
          }
        }}
      >
        {item.status === 'pending' && (
          <View style={styles.pendingTextContainer}>
            <AppText>pending</AppText>
          </View>
        )}
        {/* {item.uploaded_multimedia?.[0]?.postType === 'video' ? (
          <>
            <Video
              posterStyle={!videoLoaded ? styles.videoPoster : null}
              usePoster={!videoLoaded}
              posterResizeMode={'contain'}
              onPlaybackStatusUpdate={(status) => {
                if (status.isLoaded) {
                  setVideoLoaded(true);
                }
              }}
              style={[styles.image, { borderRadius: 10, opacity: 0.85 }]}
              source={{
                uri: item.url,
              }}
              onTouchStart={(e) => e.preventDefault()}
              resizeMode="cover"
              onLoad={() => setVideoLoaded(true)}
            />
            {!videoLoaded && (
              <LottieIcon
                source={require('../assets/animations/heart-beat.json')}
                size={25}
              />
            )}
          </>
        ) : (
          <ImageBackground
            style={styles.image}
            source={{ uri: item.url }}
            imageStyle={{ borderRadius: 10, opacity: 0.85 }}
          />
        )} */}
        <AppText style={styles.nameOfBusiness}>
          {item.name ? item.name : item.details?.result?.name}
        </AppText>
      </TouchableOpacity>
    );
  };

  return (
    <Screen style={{ marginTop: 15 }}>
      {loading ? (
        <LottieIcon
          source={require('../assets/animations/heart-beat.json')}
          size={40}
        />
      ) : null}
      <View style={[styles.container, { opacity: loading ? 0 : 1 }]}>
        <TouchableOpacity
          style={styles.backArrow}
          onPress={() => {
            setBusinesses();
            setItem();
            navigation.goBack();
          }}
        >
          <Ionicons name='chevron-back' size={18} color={colors.black} />
        </TouchableOpacity>
        <AppText style={styles.headline}>Become a coach today!</AppText>
        <View style={styles.body}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <AppText style={styles.businessText}>Create coach profile</AppText>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                setModalVisible(true);
              }}
            >
              <AppText style={styles.addButtonText}>Start</AppText>
            </TouchableOpacity>
          </View>

          {businesses && (
            <View>
              {businesses.length ? (
                <FlatList
                  bounces={false}
                  style={{ marginTop: 30 }}
                  data={businesses}
                  numColumns={2}
                  keyExtractor={(item, index) => item.place_id}
                  renderItem={renderItem}
                />
              ) : (
                <AppText style={styles.notConnectedText}>
                  Are you a register climbing instructor? Register as coach
                  create training sessions and connect with climbers
                </AppText>
              )}
            </View>
          )}
        </View>
        <Modal
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <CoachRegistrationComponent
            setModal={setModalVisible}
            business={true}
            navigation={navigation}
          />
        </Modal>
        {/* <CarouselItemModal placeData={item} modalRef={modalRef} /> */}
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backArrow: {
    paddingLeft: 15,
    paddingBottom: 5,
    paddingRight: 10,
    maxWidth: 100,
    position: 'absolute',
    zIndex: 10,
  },
  headline: {
    textAlign: 'center',
    top: 4,
    marginLeft: 10,
    fontFamily: 'nunito',
    fontSize: 18,
  },
  body: {
    marginTop: 50,
    width: '90%',
    alignSelf: 'center',
  },
  businessText: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'nunito',
  },
  notConnectedText: {
    marginTop: 140,
    textAlign: 'center',
    color: 'gray',
    fontFamily: 'nunito',
  },
  addButton: {
    backgroundColor: colors.hearted2,
    width: 100,
    height: 30,
    borderRadius: 5,
    marginTop: -5,
  },
  addButtonText: {
    textAlign: 'center',
    top: 3,
    fontSize: 16,
    color: colors.black,
    fontFamily: 'nunitoBold',
    fontSize: 18,
  },
  card: {
    width: '48%',
    height: 250,
    borderRadius: 10,
    borderWidth: 0.5,
    margin: 4,
  },
  image: {
    width: '100%',
    height: 250,
  },
  nameOfBusiness: {
    position: 'absolute',
    bottom: 3,
    padding: 5,
    color: colors.white,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    fontSize: 20,
    fontWeight: '600',
  },
  videoPoster: {
    top: 0,
    width: '100%',
    minWidth: '100%',
    height: 'auto',
    position: 'absolute',
    backgroundColor: colors.black,
  },
  pendingTextContainer: {
    position: 'absolute',
    zIndex: 40,
    backgroundColor: colors.secondary,
    borderTopLeftRadius: 10,
    padding: 5,
  },
});

export default RegisterAsCoachScreen;
