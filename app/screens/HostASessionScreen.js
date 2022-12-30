import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useRef } from 'react';
import Screen from '../components/Screen';
import colors from '../config/colors';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useState } from 'react';
import { MaterialCommunityIcons, SimpleLineIcons } from '@expo/vector-icons';
import { List, RadioButton } from 'react-native-paper';
import ListOfGymsModal from '../components/ListOfGymsModal';
import { CheckBox } from 'react-native-elements';
import { Image } from 'react-native';
import {
  getFirestore,
  collection,
  query,
  getDocs,
  where,
  setDoc,
  doc,
  addDoc,
} from 'firebase/firestore';
import OtherGymsModal from '../components/OtherGymsModal';
import { useContext } from 'react';
import AuthContext from '../auth/context';
import { useNavigation } from '@react-navigation/core';
import * as ImagePicker from 'expo-image-picker';
import uuid from 'react-native-uuid';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { firebaseConfig } from '../config/Firebase/firebaseConfig';
import firebase from "firebase/compat/app";

const windowHeight = Dimensions.get('window').height;

const HostASessionScreen = () => {
  const navigation = useNavigation();
  const db = getFirestore(firebase.initializeApp(firebaseConfig));
  const storage = getStorage();
  const { user } = useContext(AuthContext);
  const [progress, setProgress] = useState(0);
  const [gymsList, setGymsList] = useState([]);
  const [sessionName, setSessionName] = useState('Session name');
  const [note, setNote] = useState('...');
  const [sessionPhoto, setSessionPhoto] = useState({});
  const [bannerPhoto, setBannerPhoto] = useState({});
  const [expanded, setExpanded] = useState(false);
  const [gym, setGym] = useState({});
  const [expandedDuration, setExpandedDuration] = useState(false);
  const [price, setPrice] = useState('0,00');
  const [language, setLanguage] = useState(
    'Enter 1 or more separated with comma'
  );
  const [expandedSessionType, setExpandedSessionType] = useState(false);
  const [description, setDescription] = useState('...');
  const [expandedClimbingLevel, setExpandedClimbingLevel] = useState(false);
  const [expandedClosingTime, setExpandedClosingTime] = useState(false);
  const [expandedCancelation, setExpandedCancelation] = useState(false);
  const [climbingLevel, setClimbingLevel] = useState('');
  const [sessionType, setSessionType] = useState('');
  const [duration, setDuration] = useState('');
  const [closingTime, setClosingTime] = useState('');
  const [cancelation, setCancelation] = useState('');
  const [gymTicket, setGymTicket] = useState('Yes');
  const [minClimbers, setMinClimbers] = useState('0');
  const [maxClimbers, setMaxClimbers] = useState('0');
  const [minAge, setMinAge] = useState('0');
  const [checkedEquipment, setCheckedEquipment] = useState({
    shoes: false,
    chalk: false,
    harness: false,
    rope: false,
    pad: false,
    other: '...',
  });

  const listOfGymsRef = useRef(null);
  const otherGymsRef = useRef(null);

  const handlePress = () => setExpanded(!expanded);
  const handlePressDuration = () => setExpandedDuration(!expandedDuration);
  const handlePressSessionType = () =>
    setExpandedSessionType(!expandedSessionType);
  const handlePressClimbingLevel = () =>
    setExpandedClimbingLevel(!expandedClimbingLevel);
  const handlePressClosingTime = () =>
    setExpandedClosingTime(!expandedClosingTime);
  const handlePressCancelation = () =>
    setExpandedCancelation(!expandedCancelation);

  const createSessionTemplate = async () => {
    const sessionDocRef = doc(db, 'users', user.uid);
    const colRef = collection(sessionDocRef, 'session_templates');

    await addDoc(colRef, {
      sessionName: sessionName,
      personalNote: note,
      sessionLocation: gym,
      sessionLength: duration,
      price: price,
      sessionLanguage: language,
      sessionType: sessionType,
      sessionNotes: description,
      climbingLevel: climbingLevel,
      equipment: checkedEquipment,
      bookingClosingTime: closingTime,
      minNumberOfParticipants: minClimbers,
      maxNumberOfParticipants: maxClimbers,
      minimumAge: minAge,
      freeCancelationBefore: cancelation,
      gymTicketIncluded: gymTicket,
      trainerEmail: user.email,
      trainerID: user.uid,
      trainerName: user.displayName,
    })
      .then((docRef) => {
        if (sessionPhoto.uri) uploadPhotoSession(sessionPhoto, docRef);
        if (bannerPhoto.uri) uploadPhotoBanner(bannerPhoto, docRef);
      })
      .then(() => navigation.goBack());
  };

  const uploadPhotoSession = async (statePhoto, docRef) => {
    const photoID = uuid.v4();
    const uri = statePhoto.uri;
    const response = await fetch(uri);
    const blob = await response.blob();

    const uploadTask = uploadBytesResumable(
      ref(storage, `sessionPhotos/${user.uid}/${photoID}`),
      blob
    );

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        /*  const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        console.log(progress);
        setProgress(progress); */
      },
      (error) => {
        alert(error.message);
      },
      () => {
        // Complete function
        getDownloadURL(uploadTask.snapshot.ref)
          .then((url) => {
            setDoc(
              doc(db, 'users', user.uid, 'session_templates', docRef.id),
              {
                sessionPhotoURL: url,
              },
              { merge: true }
            );
          })
          .catch((err) => console.log(err));
      }
    );
  };
  const uploadPhotoBanner = async (statePhoto, docRef) => {
    const photoID = uuid.v4();
    const uri = statePhoto.uri;
    const response = await fetch(uri);
    const blob = await response.blob();

    const uploadTask = uploadBytesResumable(
      ref(storage, `bannerSessionPhotos/${user.uid}/${photoID}`),
      blob
    );

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        console.log(progress);
        setProgress(progress);
      },
      (error) => {
        alert(error.message);
      },
      () => {
        // Complete function
        getDownloadURL(uploadTask.snapshot.ref)
          .then((url) => {
            setDoc(
              doc(db, 'users', user.uid, 'session_templates', docRef.id),
              {
                bannerPhotoURL: url,
              },
              { merge: true }
            );
          })
          .catch((err) => console.log(err));
      }
    );
  };

  const getGyms = async () => {
    let array = [];
    const q = query(collection(db, 'gyms'));
    await getDocs(q)
      .then((res) => {
        res.forEach((element) => array.push(element.data()));
      })
      .then(() => setGymsList(array));
  };

  const saveGymToDb = async () => {
    if (gym.place_id) {
      await setDoc(doc(db, 'gyms', gym.place_id), gym, { merge: true });
    }
  };

  useEffect(() => {
    getGyms();
  }, []);

  let openImagePickerAsyncSessionPhoto = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      //allowsEditing: true,
      quality: 0.1,
    });
    if (pickerResult.cancelled === false) {
      setSessionPhoto(pickerResult);
    }
  };
  let openImagePickerAsyncBannerPhoto = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      //allowsEditing: true,
      quality: 0.1,
    });
    if (pickerResult.cancelled === false) {
      setBannerPhoto(pickerResult);
    }
  };

  console.log('S', sessionPhoto);
  console.log('B', bannerPhoto);

  return (
    <Screen style={{ backgroundColor: '#FFFFFF' }}>
      <View
        style={
          Platform.OS === 'ios'
            ? styles.header
            : [styles.header, { marginTop: 0 }]
        }
      >
        <Text style={styles.headerTitle}>Create a session</Text>
      </View>
      <KeyboardAwareScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.subtitle}>Name of the session:</Text>
          <TextInput
            name='sessinName'
            textContentType='none'
            style={styles.inputField}
            onChangeText={(text) => setSessionName(text)}
            placeholder={sessionName}
            placeholderTextColor={colors.darkGray}
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.subtitle}>Personal note:</Text>
          <TextInput
            name='sessinName'
            textContentType='none'
            style={styles.inputFieldNote}
            numberOfLines={10}
            multiline={true}
            onChangeText={(text) => setNote(text)}
            placeholder={note}
            placeholderTextColor={colors.darkGray}
          />
          <Text style={[styles.subtitle, { marginLeft: 0 }]}>
            This note will be visible only to you.
          </Text>
        </View>
        <View style={styles.section}>
          <View style={styles.subSection}>
            <Text style={styles.subtitle}>Add up to 3 session photos</Text>
            <TouchableOpacity
              onPress={() => openImagePickerAsyncSessionPhoto()}
              style={styles.addButton}
            >
              <MaterialCommunityIcons
                name='file-image'
                size={18}
                color={'#FFFFFF'}
              />
              <Text style={styles.addText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.section}>
          <View style={styles.subSection}>
            <Text style={styles.subtitle}>Add banner photo</Text>
            <TouchableOpacity
              onPress={() => openImagePickerAsyncBannerPhoto()}
              style={styles.addButton}
            >
              <MaterialCommunityIcons
                name='file-image'
                size={18}
                color={'#FFFFFF'}
              />
              <Text style={styles.addText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.subtitle}>
            Gym where session will take place:
          </Text>
          <List.Section>
            <List.Accordion
              title={
                gym?.name?.length
                  ? gym?.name
                  : !expanded
                  ? 'Select location'
                  : 'Select from'
              }
              expanded={expanded}
              onPress={handlePress}
              style={{
                backgroundColor: '#FFFFFF',
                borderColor: colors.darkGray,
                borderWidth: 1,
                borderRadius: 10,
                zIndex: 999,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  handlePress();
                  listOfGymsRef.current?.open();
                }}
              >
                <List.Item title='List of Gyms' />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  handlePress();
                  otherGymsRef.current?.open();
                }}
              >
                <List.Item title='Other' />
              </TouchableOpacity>
            </List.Accordion>
          </List.Section>
        </View>
        <View style={styles.section}>
          <Text style={styles.subtitle}>Duration:</Text>

          <List.Section>
            <List.Accordion
              title={duration.length ? duration : 'Duration of the session'}
              expanded={expandedDuration}
              onPress={handlePressDuration}
              style={{
                backgroundColor: '#FFFFFF',
                borderColor: colors.darkGray,
                borderWidth: 1,
                borderRadius: 10,
                zIndex: 999,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setDuration('30min');
                  handlePressDuration();
                }}
              >
                <List.Item title='30min' />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setDuration('1h');
                  handlePressDuration();
                }}
              >
                <List.Item title='1h' />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setDuration('1.5h');
                  handlePressDuration();
                }}
              >
                <List.Item title='1.5h' />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setDuration('2h');
                  handlePressDuration();
                }}
              >
                <List.Item title='2h' />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setDuration('24h');
                  handlePressDuration();
                }}
              >
                <List.Item title='24h' />
              </TouchableOpacity>
            </List.Accordion>
          </List.Section>
        </View>
        <View style={styles.section}>
          <View
            style={[
              styles.subSection,
              { justifyContent: 'flex-start', marginTop: -10 },
            ]}
          >
            <SimpleLineIcons name='info' size={24} color={colors.darkGray} />
            <Text style={[styles.subtitle, { marginLeft: 7 }]}>
              Groups at OneClimb
            </Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              <Text style={[styles.infoText, { fontFamily: 'nunitoBold' }]}>
                Note:
              </Text>{' '}
              At OneClimb, we enable climbers to decide if they want to
              participate in a Public / open group or Private / closed group
              environment. Once you create a session, every available slot could
              be either Public or Private. The first climber to book a time slot
              of a session defines a type of a session based on their
              preferences.
            </Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={[styles.subtitle, { marginLeft: 0 }]}>
            Public/open group session:
          </Text>
          <View style={styles.subSection}>
            <Text style={styles.priceText}>Enter price per person</Text>
            <View style={styles.priceContainer}>
              <TextInput
                name='price'
                textContentType='none'
                style={styles.inputFieldPrice}
                onChangeText={(text) => setPrice(text)}
                placeholder={price}
                placeholderTextColor={colors.darkGray}
                keyboardType='numeric'
              />
              <Text style={styles.priceCurrency}>€</Text>
            </View>
          </View>
          <View style={styles.priceNoteContainer}>
            <Text style={styles.priceTextNote}>
              <Text
                style={[styles.priceTextNote, { fontFamily: 'nunitoBold' }]}
              >
                Note:
              </Text>{' '}
              Minimum and maximum amounts earned from hosting a session...
            </Text>
            <TouchableOpacity style={styles.readMoreButton}>
              <Text style={styles.readMoreText}>Read more</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.subtitle}>Language:</Text>
          <TextInput
            name='language'
            textContentType='none'
            style={styles.inputFieldLanguage}
            onChangeText={(text) => setLanguage(text)}
            placeholder={language}
            placeholderTextColor={colors.darkGray}
          />
        </View>
        <View style={styles.section}>
          <List.Section>
            <List.Accordion
              title={sessionType.length ? sessionType : 'Session type'}
              expanded={expandedSessionType}
              onPress={handlePressSessionType}
              style={{
                backgroundColor: '#FFFFFF',
                borderColor: colors.darkGray,
                borderWidth: 1,
                borderRadius: 10,
                zIndex: 999,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setSessionType('Beginners');
                  handlePressSessionType();
                }}
              >
                <List.Item title='Beginners' />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setSessionType('Competition Style');
                  handlePressSessionType();
                }}
              >
                <List.Item title='Competition Style' />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setSessionType('Bouldering');
                  handlePressSessionType();
                }}
              >
                <List.Item title='Bouldering' />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setSessionType('Lead');
                  handlePressSessionType();
                }}
              >
                <List.Item title='Lead' />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setSessionType('Rock');
                  handlePressSessionType();
                }}
              >
                <List.Item title='Rock' />
              </TouchableOpacity>
            </List.Accordion>
          </List.Section>
        </View>
        <View style={styles.section}>
          <Text style={styles.subtitle}>
            Add additional description of the session:
          </Text>
          <TextInput
            name='description'
            textContentType='none'
            style={styles.inputFieldDescription}
            numberOfLines={10}
            multiline={true}
            onChangeText={(text) => setDescription(text)}
            placeholder={description}
            placeholderTextColor={colors.darkGray}
          />
        </View>
        <View style={styles.section}>
          <List.Section>
            <List.Accordion
              title={
                climbingLevel.length
                  ? climbingLevel
                  : 'Recommended climbing level'
              }
              expanded={expandedClimbingLevel}
              onPress={handlePressClimbingLevel}
              style={{
                backgroundColor: '#FFFFFF',
                borderColor: colors.darkGray,
                borderWidth: 1,
                borderRadius: 10,
                color: colors.darkGray,
                zIndex: 999,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setClimbingLevel('Beginner - 5a');
                  handlePressClimbingLevel();
                }}
              >
                <List.Item title='Beginner - 5a' />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setClimbingLevel('Intermediate - 6a');
                  handlePressClimbingLevel();
                }}
              >
                <List.Item title='Intermediate - 6a' />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setClimbingLevel('Advanced - 7a');
                  handlePressClimbingLevel();
                }}
              >
                <List.Item title='Advanced - 7a' />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setClimbingLevel('Expert - 8a');
                  handlePressClimbingLevel();
                }}
              >
                <List.Item title='Expert - 8a' />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setClimbingLevel('Competition level');
                  handlePressClimbingLevel();
                }}
              >
                <List.Item title='Competition level' />
              </TouchableOpacity>
            </List.Accordion>
          </List.Section>
        </View>
        <View style={styles.section}>
          <Text
            style={[
              styles.subtitle,
              { fontFamily: 'poppinsSemiBold', fontSize: 16 },
            ]}
          >
            Which equipment should climbers bring to the session
          </Text>
          <View style={styles.radioBox}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                style={styles.equipmentIcon}
                source={require('../assets/shoes.png')}
              />
              <Text style={[styles.optionText]}>Climbing Shoes</Text>
            </View>
            <CheckBox
              iconRight
              containerStyle={{
                backgroundColor: 'transparent',
                borderWidth: 0,
              }}
              //iconType='material'
              checkedIcon='check-square-o'
              uncheckedIcon='square-o'
              checkedColor={colors.oneClimbOrange}
              uncheckedColor={colors.gray2}
              checked={checkedEquipment.shoes}
              onPress={() =>
                setCheckedEquipment((checkedEquipment) => ({
                  ...checkedEquipment,
                  ...{ shoes: !checkedEquipment.shoes },
                }))
              }
            />
          </View>
          <View style={styles.radioBox}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                style={styles.equipmentIcon}
                source={require('../assets/chalk.png')}
              />
              <Text style={[styles.optionText]}>Chalk bag</Text>
            </View>
            <CheckBox
              iconRight
              containerStyle={{
                backgroundColor: 'transparent',
                borderWidth: 0,
              }}
              //iconType='material'
              checkedIcon='check-square-o'
              uncheckedIcon='square-o'
              checkedColor={colors.oneClimbOrange}
              uncheckedColor={colors.gray2}
              checked={checkedEquipment.chalk}
              onPress={() =>
                setCheckedEquipment((checkedEquipment) => ({
                  ...checkedEquipment,
                  ...{ chalk: !checkedEquipment.chalk },
                }))
              }
            />
          </View>
          <View style={styles.radioBox}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                style={styles.equipmentIcon}
                source={require('../assets/harness.png')}
              />
              <Text style={[styles.optionText]}>Climbing harness</Text>
            </View>
            <CheckBox
              iconRight
              containerStyle={{
                backgroundColor: 'transparent',
                borderWidth: 0,
              }}
              //iconType='material'
              checkedIcon='check-square-o'
              uncheckedIcon='square-o'
              checkedColor={colors.oneClimbOrange}
              uncheckedColor={colors.gray2}
              checked={checkedEquipment.harness}
              onPress={() =>
                setCheckedEquipment((checkedEquipment) => ({
                  ...checkedEquipment,
                  ...{ harness: !checkedEquipment.harness },
                }))
              }
            />
          </View>
          <View style={styles.radioBox}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                style={styles.equipmentIcon}
                source={require('../assets/rope.png')}
              />
              <Text style={[styles.optionText]}>Climbing rope</Text>
            </View>
            <CheckBox
              iconRight
              containerStyle={{
                backgroundColor: 'transparent',
                borderWidth: 0,
              }}
              //iconType='material'
              checkedIcon='check-square-o'
              uncheckedIcon='square-o'
              checkedColor={colors.oneClimbOrange}
              uncheckedColor={colors.gray2}
              checked={checkedEquipment.rope}
              onPress={() =>
                setCheckedEquipment((checkedEquipment) => ({
                  ...checkedEquipment,
                  ...{ rope: !checkedEquipment.rope },
                }))
              }
            />
          </View>
          <View style={styles.radioBox}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                style={styles.equipmentIcon}
                source={require('../assets/pad.png')}
              />
              <Text style={[styles.optionText]}>Crash pad</Text>
            </View>
            <CheckBox
              iconRight
              containerStyle={{
                backgroundColor: 'transparent',
                borderWidth: 0,
              }}
              //iconType='material'
              checkedIcon='check-square-o'
              uncheckedIcon='square-o'
              checkedColor={colors.oneClimbOrange}
              uncheckedColor={colors.gray2}
              checked={checkedEquipment.pad}
              onPress={() =>
                setCheckedEquipment((checkedEquipment) => ({
                  ...checkedEquipment,
                  ...{ pad: !checkedEquipment.pad },
                }))
              }
            />
          </View>
          <Text style={[styles.subtitle, { marginTop: 8 }]}>
            Specify any other equipment needed:
          </Text>
          <TextInput
            name='equipment'
            textContentType='none'
            style={styles.inputFieldLanguage}
            onChangeText={(text) =>
              setCheckedEquipment((checkedEquipment) => ({
                ...checkedEquipment,
                ...{ other: text },
              }))
            }
            placeholder={checkedEquipment.other}
            placeholderTextColor={colors.darkGray}
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.subtitle}>Booking closing time:</Text>

          <List.Section>
            <List.Accordion
              title={
                closingTime.length ? closingTime : 'Closing time before session'
              }
              expanded={expandedClosingTime}
              onPress={handlePressClosingTime}
              style={{
                backgroundColor: '#FFFFFF',
                borderColor: colors.darkGray,
                borderWidth: 1,
                borderRadius: 10,
                zIndex: 999,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setClosingTime('0h');
                  handlePressClosingTime();
                }}
              >
                <List.Item title='0h' />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setClosingTime('1h');
                  handlePressClosingTime();
                }}
              >
                <List.Item title='1h' />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setClosingTime('2h');
                  handlePressClosingTime();
                }}
              >
                <List.Item title='2h' />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setDuration('24h');
                  handlePressDuration();
                }}
              >
                <List.Item title='24h' />
              </TouchableOpacity>
            </List.Accordion>
          </List.Section>
        </View>
        <View style={styles.section}>
          <Text style={styles.subtitle}>Number of climbers:</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 5,
            }}
          >
            <View style={styles.inputContainer}>
              <Text style={{ fontFamily: 'nunito' }}>min</Text>
              <TextInput
                name='minClimbers'
                textContentType='none'
                style={styles.inputFieldPrice}
                onChangeText={(text) => setMinClimbers(text)}
                placeholder={minClimbers}
                placeholderTextColor={colors.darkGray}
                keyboardType='numeric'
              />
            </View>
            <Text>-</Text>
            <View style={styles.inputContainer}>
              <Text style={{ fontFamily: 'nunito' }}>max</Text>
              <TextInput
                name='maxClimbers'
                textContentType='none'
                style={styles.inputFieldPrice}
                onChangeText={(text) => setMaxClimbers(text)}
                placeholder={maxClimbers}
                placeholderTextColor={colors.darkGray}
                keyboardType='numeric'
              />
            </View>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={[styles.subtitle, { marginBottom: 5 }]}>
            Enter minimum age for session participants
          </Text>
          <View style={styles.inputContainer}>
            <Text style={{ fontFamily: 'nunito' }}>enter minimum age</Text>
            <TextInput
              name='maxClimbers'
              textContentType='none'
              style={styles.inputFieldPrice}
              onChangeText={(text) => setMinAge(text)}
              placeholder={minAge}
              placeholderTextColor={colors.darkGray}
              keyboardType='numeric'
            />
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.subtitle}>Free cancelation before:</Text>

          <List.Section>
            <List.Accordion
              title={
                cancelation.length ? cancelation : 'Free cancelation before'
              }
              expanded={expandedCancelation}
              onPress={handlePressCancelation}
              style={{
                backgroundColor: '#FFFFFF',
                borderColor: colors.darkGray,
                borderWidth: 1,
                borderRadius: 10,
                zIndex: 999,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setCancelation('0h');
                  handlePressCancelation();
                }}
              >
                <List.Item title='0h' />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setCancelation('1h');
                  handlePressCancelation();
                }}
              >
                <List.Item title='1h' />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setCancelation('2h');
                  handlePressCancelation();
                }}
              >
                <List.Item title='2h' />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setCancelation('24h');
                  handlePressCancelation();
                }}
              >
                <List.Item title='24h' />
              </TouchableOpacity>
            </List.Accordion>
          </List.Section>
        </View>
        <View style={styles.section}>
          <Text style={styles.subtitle}>
            Is gym ticket included in the price?
          </Text>
          <TouchableOpacity
            style={[
              styles.radioBox,
              { borderWidth: 0, borderBottomColor: '#FFFFFF' },
            ]}
            onPress={() => setGymTicket('Yes')}
          >
            <Text style={[styles.optionText, { fontSize: 14, marginLeft: 15 }]}>
              Yes
            </Text>
            <RadioButton
              value='Yes'
              status={gymTicket === 'Yes' ? 'checked' : 'unchecked'}
              onPress={() => setGymTicket('Yes')}
              color={colors.oneClimbOrange}
              uncheckedColor={colors.darkGray}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.radioBox,
              { borderWidth: 0, borderBottomColor: '#FFFFFF' },
            ]}
            onPress={() => setGymTicket('No')}
          >
            <Text style={[styles.optionText, { fontSize: 14, marginLeft: 15 }]}>
              No
            </Text>
            <RadioButton
              value='No'
              status={gymTicket === 'No' ? 'checked' : 'unchecked'}
              onPress={() => setGymTicket('No')}
              color={colors.oneClimbOrange}
              uncheckedColor={colors.darkGray}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={createSessionTemplate} style={styles.button}>
          <Text style={styles.buttonText}>Create session template</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
      <ListOfGymsModal
        modalRef={listOfGymsRef}
        setGym={setGym}
        gymsList={gymsList}
      />
      <OtherGymsModal
        modalRef={otherGymsRef}
        setGym={setGym}
        saveGymToDb={saveGymToDb}
      />
    </Screen>
  );
};

export default HostASessionScreen;

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.oneClimbOrange,
    width: '100%',
    height: windowHeight * 0.15,
    marginTop: -windowHeight * 0.08,
    justifyContent: 'flex-end',
    borderBottomLeftRadius: 30,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontFamily: 'poppinsSemiBold',
    fontSize: 22,
    lineHeight: 33,
    marginBottom: 10,
    marginLeft: 40,
  },
  container: {
    marginHorizontal: 25,
    marginTop: 10,
  },
  section: {
    borderBottomWidth: 1,
    borderColor: colors.gray2,
    paddingVertical: 20,
  },
  subtitle: {
    marginLeft: 15,
    fontFamily: 'nunito',
    fontSize: 14,
    lineHeight: 19,
    color: colors.darkGray,
  },
  inputField: {
    borderRadius: 10,
    borderColor: colors.darkGray,
    borderWidth: 1,
    width: '100%',
    height: 50,
    marginTop: 10,
    paddingLeft: 10,
  },
  inputFieldNote: {
    borderRadius: 10,
    width: '100%',
    height: 50,
    marginTop: 10,
    paddingLeft: 15,
    paddingTop: 10,
    backgroundColor: colors.lightGray,
    height: 95,
  },
  subSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  addButton: {
    backgroundColor: colors.oneClimbOrange,
    width: 90,
    height: 30,
    borderRadius: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addText: {
    color: '#FFFFFF',
    fontFamily: 'poppinsSemiBold',
    fontSize: 14,
    lineHeight: 21,
    marginLeft: 4,
  },
  infoContainer: {
    height: 150,
    borderColor: colors.darkGray,
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
  },
  infoText: {
    fontFamily: 'nunito',
    fontSize: 13,
    lineHeight: 16,
    color: colors.darkGray,
    marginTop: 5,
  },
  priceText: {
    fontFamily: 'nunitoBold',
    fontSize: 16,
    lineHeight: 22,
    color: colors.darkGray,
    textDecorationLine: 'underline',
  },
  priceContainer: {
    width: 125,
    height: 50,
    borderRadius: 10,
    borderColor: colors.darkGray,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputFieldPrice: {
    fontFamily: 'nunitoBold',
    fontSize: 16,
  },
  priceCurrency: {
    fontFamily: 'nunitoBold',
    fontSize: 16,
    marginLeft: 4,
  },
  priceNoteContainer: {
    height: 66,
    backgroundColor: colors.lightGray,
    borderRadius: 10,
    padding: 12,
  },
  priceTextNote: {
    fontFamily: 'nunito',
    fontSize: 13,
    lineHeight: 18,
    color: colors.darkGray,
  },
  readMoreButton: {
    position: 'absolute',
    right: 12,
    bottom: 12,
  },
  readMoreText: {
    fontFamily: 'nunitoBold',
    fontSize: 15,
    lineHeight: 18,
    color: colors.darkGray,
    textDecorationLine: 'underline',
  },
  inputFieldLanguage: {
    borderRadius: 10,
    borderColor: colors.darkGray,
    borderWidth: 1,
    width: '100%',
    height: 50,
    marginTop: 10,
    paddingLeft: 10,
    fontFamily: 'nunitoBold',
    fontSize: 16,
    color: colors.darkGray,
  },
  inputFieldDescription: {
    borderRadius: 10,
    borderColor: colors.darkGray,
    borderWidth: 1,
    width: '100%',
    height: 150,
    marginTop: 10,
    padding: 15,
    fontFamily: 'nunito',
    color: colors.darkGray,
  },
  radioBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: colors.gray2,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: colors.darkGray,
    marginTop: 16,
  },
  optionText: {
    fontFamily: 'nunitoBold',
    fontSize: 16,
    lineHeight: 22,
    color: colors.darkGray,
  },
  equipmentIcon: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
    marginHorizontal: 14,
  },
  button: {
    height: 50,
    width: 260,
    borderRadius: 42,
    backgroundColor: colors.oneClimbOrange,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    marginTop: 80,
    alignSelf: 'flex-end',
  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: 'poppinsSemiBold',
    fontSize: 18,
    lineHeight: 27,
  },
  inputContainer: {
    width: 150,
    height: 50,
    borderColor: colors.darkGray,
    borderWidth: 1,
    borderRadius: 10,
    padding: 5,
    paddingLeft: 15,
  },
});
