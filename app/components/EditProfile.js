import React, { useState, useContext } from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Avatar } from 'react-native-elements';
import {
  MaterialCommunityIcons,
  Fontisto,
  AntDesign,
} from '@expo/vector-icons';
import { Portal, ProgressBar } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import uuid from 'react-native-uuid';
import * as ImagePicker from 'expo-image-picker';
import { getAuth, updateProfile } from 'firebase/auth';

import Screen from './Screen';
import colors from '../config/colors';
import { AppFormField, ErrorMessage } from './forms';
import AppText from './AppText';
import AuthContext from '../auth/context';
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  query,
  getDocs,
  where,
} from 'firebase/firestore';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { Modalize } from 'react-native-modalize';
import { TextInput } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useStore } from '../hooks/useStore';
import { useNavigation } from '@react-navigation/core';
import { firebaseConfig } from '../config/Firebase/firebaseConfig';
import firebase from "firebase/compat/app";

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const EditProfile = ({ avatar, modalRef, locationRef }) => {
  const db = getFirestore(firebase.initializeApp(firebaseConfig));
  const storage = getStorage();
  const navigation = useNavigation();

  const [inputModal, setInputModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const { user, setUser } = useContext(AuthContext);
  const auth = getAuth();
  const userData = useStore((state) => state.userData);
  const fetchUserData = useStore((state) => state.fetchUserData);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {
      label: 'Male',
      value: 'Male',
    },
    {
      label: 'Female',
      value: 'Female',
    },
    {
      label: 'Other',
      value: 'Other',
    },
    {
      label: 'Not specified',
      value: 'Not specified',
    },
  ]);

  const [error, setError] = useState('');
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async ({
    name,
    lastName,
    dateOfBirth,
    // phoneNumber,
    // location,
  }) => {
    setDoc(
      doc(db, 'users', user.uid),
      {
        // handle: handle.toLowerCase(),
        displayName: name,
        lastName: lastName,
        gender: value || 'Not Specified',
        dateOfBirth: dateOfBirth,
        // phoneNumber: phoneNumber,
        //location: location,
      },
      { merge: true }
    );
    updateProfile(auth.currentUser, {
      displayName: name,
    }).then(() => {
      /* setUserData({
        ...user,
        displayName: name,
        lastName: lastName,
        gender: gender,
        dateOfBirth: dateOfBirth,
        // phoneNumber: phoneNumber,
        //location: location,
      }); */
      fetchUserData(user.uid);

      Alert.alert('Saved', 'Your changes are saved', [
        { text: 'Close', onPress: () => {} },
      ]);
    });

    setError('');
  };

  const registerOptions = {
    username: {
      required: 'Username is required',
      minLength: {
        value: 3,
        message: 'Username must contain at least 3 letters',
      },
      maxLength: {
        value: 20,
        message: 'Username can have maximum 20 letters',
      },
      pattern: {
        value: /^[\w-_.]*$/,
        message:
          'You can only use letters, numbers and (.-_) symbols for username',
      },
    },
    name: {
      required: 'Name is required',
      minLength: {
        value: 3,
        message: 'Name must contain at least 3 letters',
      },
      /* pattern: {
        value:
          /^(?!.*[-!$%^&*()_+|~=`{}\[\]:÷\♧◇♡♤■□●○°☆¤《》0123456789";'£€\’•”‘¡¿…“„»«§¥₩₽¢\–—≠≈‰\<>?,.@#\/])/,
        message: 'Only letters allowed',
      }, */
    },

    bio: {
      //required: 'Bio is required',
      minLength: {
        value: 3,
        message: 'Bio must have at least 3 letters',
      },
      /* pattern: {
        value:
          /^(?!.*[-!$%^&*()_+|~=`{}\[\]:÷\♧◇♡♤■□●○°☆¤《》0123456789";'£€\’•”‘¡¿…“„»«§¥₩₽¢\–—≠≈‰\<>?,.@#\/])/,
        message: 'Only letters are allowed',
      }, */
    },
  };

  let openImagePickerAsync = async () => {
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
      uploadPhoto(pickerResult);
    }
  };

  const uploadPhoto = async (avatarPhoto) => {
    const photoID = uuid.v4();
    const uri = avatarPhoto.uri;
    const response = await fetch(uri);
    const blob = await response.blob();
    //console.log('STORAGE > ', storage)

    const uploadTask = uploadBytesResumable(
      ref(storage, `avatarPhotos/${user.uid}/${photoID}`),
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
            // setAvatar(url);

            setDoc(
              doc(db, 'users', user.uid),
              {
                photoURL: url,
                displayName: user.displayName,
                email: user.email,
                userID: user.uid,
              },
              { merge: true }
            );

            updateProfile(auth.currentUser, { photoURL: url })
              .then(
                // updateUserInfo(),

                setProgress(0)
                // setUser({ ...auth.currentUser, photoURL: url })
              )
              .then(() => fetchUserData(user.uid));
            //updateUserInfo();
          })
          .catch((err) => console.log(err));
      }
    );
  };

  /* const checkHandle = (text) => {
    const q = query(
      collection(db, 'users'),
      where('handle', '==', text.toLowerCase())
    );

    getDocs(q).then((snap) => {
      if (!snap.empty && text.toLowerCase() !== handle) {
        setError('Username already exist');
      } else setError('');
    });
  };
 */
  return (
    <Portal style={{ backgroundColor: colors.white, flex: 1 }}>
      <Modalize
        ref={modalRef}
        modalHeight={windowHeight * 0.95}
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
        <View style={styles.container}>
          <View style={styles.avatarBox}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: 20,
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
              <Avatar
                rounded
                placeholderStyle={{
                  backgroundColor: colors.white,
                }}
                size={60}
                source={{
                  uri:
                    avatar ||
                    'https://firebasestorage.googleapis.com/v0/b/oneclimb.appspot.com/o/assets%2FinApp%2FOCavatar.png?alt=media&token=e9c931f9-81c2-4c90-bba1-955012b40c1a',
                }}
                onPress={openImagePickerAsync}
              />
              <View style={styles.editIcon}>
                <TouchableOpacity onPress={() => openImagePickerAsync()}>
                  <AntDesign name='camera' size={22} color={colors.white} />
                </TouchableOpacity>
              </View>
            </View>
            <AppText style={styles.title}>Edit Profile</AppText>
            <TouchableOpacity onPress={handleSubmit(onSubmit)}>
              <AppText style={styles.save}>Save</AppText>
            </TouchableOpacity>
          </View>
          {progress !== 0 ? (
            <ProgressBar
              color={colors.oneClimbOrange}
              progress={progress / 100}
              style={styles.progressBar}
            />
          ) : null}
        </View>
        <ErrorMessage
          visible={true}
          error={
            errors.handle
              ? errors.handle.message
              : errors.name
              ? errors.name.message
              : errors.bio
              ? errors.bio.message
              : error
          }
        />
        <View style={{ marginHorizontal: 25, marginTop: 60 }}>
          <View style={styles.fieldView}>
            <View>
              <AppText style={styles.fieldText}>First name</AppText>
              <Controller
                control={control}
                rules={registerOptions.name}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    //placeholder={user.displayName}
                    style={styles.inputField}
                    textContentType='familyName'
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name='name'
                defaultValue={user.displayName}
              />
            </View>
          </View>
          <View style={styles.fieldView}>
            <View>
              <AppText style={styles.fieldText}>Last name</AppText>
              <Controller
                control={control}
                //rules={registerOptions.name}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.inputField}
                    textContentType='familyName'
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name='lastName'
                defaultValue={userData.lastName || ''}
              />
            </View>
          </View>
          <View style={[styles.fieldView, { zIndex: 999 }]}>
            <DropDownPicker
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
              placeholder='Gender'
              listMode={Platform.OS === 'ios' ? 'SCROLLVIEW' : 'MODAL'}
              onChangeItem={(item) => console.log(item.value)}
              labelStyle={{ fontFamily: 'nunitoBold', fontSize: 16 }}
              style={{
                borderWidth: 0,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
                backgroundColor: 'transparent',
                zIndex: 999,
              }}
              dropDownContainerStyle={{
                zIndex: 999,
                backgroundColor: colors.white,
                borderColor: colors.gray2,
                width: windowWidth * 0.868,
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
                height: 300,
                marginLeft: -1,
              }}
            />
          </View>
          <View style={styles.fieldView}>
            <View>
              <AppText style={styles.fieldText}>Date of Birth</AppText>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.inputField}
                    onChangeText={onChange}
                    value={value}
                    placeholder={'DD/MM/YYYY'}
                  />
                )}
                name='dateOfBirth'
                defaultValue={
                  userData.dateOfBirth ? userData.dateOfBirth : 'DD/MM/YYYY'
                }
              />
            </View>
          </View>
          <View style={styles.fieldView}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <AppText
                style={[
                  styles.fieldText,
                  { fontFamily: 'nunitoBold', fontSize: 16 },
                ]}
              >
                Phone Number
              </AppText>
              {/* <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.inputField}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name='phoneNumber'
                //defaultValue={''}
              /> */}
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('VerifyPhone');
                  modalRef.current?.close();
                }}
              >
                <AntDesign name='edit' size={24} color={colors.darkGray} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.fieldView}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <AppText
                style={[
                  styles.fieldText,
                  { fontFamily: 'nunitoBold', fontSize: 16 },
                ]}
              >
                Location
              </AppText>
              {/* <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.inputField}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name='location'
                //defaultValue={''}
              /> */}
              <TouchableOpacity
                onPress={() => {
                  locationRef.current?.open();
                  modalRef.current?.close();
                }}
              >
                <AntDesign name='edit' size={24} color={colors.darkGray} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.editBox}
        >
          <ScrollView
            bounces={false}
            style={{ flex: 1 }}
            contentContainerStyle={styles.formBox}
          >
            <View style={styles.fContainer}>
              <ErrorMessage
                visible={true}
                error={
                  errors.handle
                    ? errors.handle.message
                    : errors.name
                    ? errors.name.message
                    : errors.bio
                    ? errors.bio.message
                    : error
                }
              />
              <View style={styles.fieldView}>
                <AppText style={styles.fieldText}>Handle</AppText>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <AppFormField
                      name='handle'
                      //placeholder={handle || user.displayName.toLowerCase()}
                      onChangeText={(text) => {
                        checkHandle(text);
                        onChange(text);
                      }}
                      value={value}
                    />
                  )}
                  name='handle'
                  defaultValue={handle || user.displayName}
                />
              </View>
              <View style={styles.fieldView}>
                <AppText style={styles.fieldText}>Name</AppText>
                <Controller
                  control={control}
                  rules={registerOptions.name}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <AppFormField
                      //placeholder={user.displayName}
                      textContentType='familyName'
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                  name='name'
                  defaultValue={user.displayName}
                />
              </View>
              <View style={styles.fieldView}>
                <AppText style={styles.fieldText}>Badges:</AppText>
                <Controller
                  control={control}
                  rules={registerOptions.bio}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <AppFormField
                      name='badges'
                      //placeholder={badges}
                      textContentType='none'
                      numberOfLines={7}
                      maxLength={250}
                      multiline={true}
                      blurOnSubmit={false}
                      editable={true}
                      onChangeText={onChange}
                      value={value}
                      style={styles.shortBioText}
                      //onFocus={() => setInputModal(!inputModal)}
                    />
                  )}
                  name='badges'
                  defaultValue={badges}
                />
              </View>
              <View style={styles.fieldView}>
                <AppText style={styles.fieldText}>Short bio:</AppText>
                <Controller
                  control={control}
                  rules={registerOptions.bio}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <AppFormField
                      name='bio'
                      //placeholder={bio}
                      textContentType='none'
                      numberOfLines={7}
                      maxLength={250}
                      multiline={true}
                      blurOnSubmit={false}
                      editable={true}
                      onChangeText={onChange}
                      value={value}
                      style={styles.shortBioText}
                      //onFocus={() => setInputModal(!inputModal)}
                    />
                  )}
                  name='bio'
                  defaultValue={bio}
                />
              </View>
              <View style={styles.fieldView}>
                <AppText style={styles.dropdownFieldText}>Level:</AppText>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <RNPickerSelect
                      onValueChange={(value) => {
                        setTempClimbLevel(value);
                        onChange(value);
                      }}
                      items={[
                        { label: 'Beginner', value: 'beginner', key: 1 },
                        {
                          label: 'Intermediate',
                          value: 'intermediate',
                          key: 2,
                        },
                        { label: 'Advanced', value: 'advanced', key: 3 },
                        {
                          label: 'National competition',
                          value: 'national_competition',
                          key: 4,
                        },
                        {
                          label: 'International competition',
                          value: 'international_competition',
                          key: 5,
                        },
                      ]}
                      placeholder={
                        climbLevel
                          ? climbLevel
                          : {
                              label: 'Select your level ...',
                              value: null,
                              color: colors.hearted2,
                            }
                      }
                      value={tempClimbLevel}
                      style={{
                        ...pickerSelectStyles,
                        iconContainer: {
                          top: 10,
                          right: 12,
                        },
                        placeholder: {
                          color: colors.black,
                          fontSize: 14,
                        },
                      }}
                    />
                  )}
                  name='climbLevel'
                  defaultValue={tempClimbLevel}
                />
              </View>
            </View>
          </ScrollView>
          <View style={{ height: 35 }} />
        </KeyboardAvoidingView> */}
      </Modalize>
    </Portal>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    width: '90%',
  },

  progressBar: {
    maxWidth: '30%',
    margin: 3,
  },
  avatarBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  editIcon: {
    //marginRight: 5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 32,
    width: 32,
    marginLeft: -45,
  },
  title: {
    fontFamily: 'nunitoBold',
    fontSize: 16,
    lineHeight: 22,
    color: colors.darkGray,
  },
  save: {
    fontFamily: 'nunitoBold',
    fontSize: 16,
    lineHeight: 22,
    color: colors.darkGray,
    textDecorationLine: 'underline',
  },

  fieldView: {
    height: 50,
    width: '100%',
    borderColor: colors.gray2,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 14,
    marginTop: 15,
  },
  dropdownFieldView: {
    alignItems: 'flex-start',
    marginBottom: -25,
  },
  fieldText: {
    marginLeft: 15,
    fontFamily: 'nunito',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    color: colors.darkGray,
  },
  inputField: {
    marginLeft: 15,
    fontFamily: 'nunitoBold',
    fontSize: 16,
    lineHeight: 22,
    color: colors.darkGray,
    width: '90%',
  },
  edit: {
    fontFamily: 'nunitoBold',
    fontSize: 16,
    lineHeight: 22,
    color: colors.darkGray,
    textDecorationLine: 'underline',
  },
  dropdownFieldText: {
    fontFamily: 'nunito',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 26,
    color: colors.black2,
    bottom: -10,
  },
  shortBioText: {
    height: 150,
    borderWidth: 1,
    borderColor: colors.gray2,
    borderRadius: 10,
    right: 35,
    paddingLeft: 15,
  },
  submit: {
    alignSelf: 'center',
    backgroundColor: colors.hearted2,
    width: windowWidth * 0.77,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginTop: 25,
  },
  submitButton: {
    color: colors.black,
    fontFamily: 'nunitoBold',
    fontWeight: '700',
    fontSize: 16,
  },
  back: {
    marginTop: 10,
    marginLeft: 2,
  },
  input: {
    width: 245,
    height: 30,
    borderBottomColor: colors.hearted2,
    borderBottomWidth: 1,
    padding: 20,
    marginLeft: -12,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 50,
    fontSize: 16,
    fontFamily: 'nunitoBold',
    marginTop: 15,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.gray2,
    borderRadius: 10,
    color: colors.darkGray,
    //paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    height: 50,
    fontSize: 16,
    fontFamily: 'nunitoBold',
    paddingHorizontal: 10,
    marginTop: 15,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: colors.gray2,
    borderRadius: 10,
    color: colors.darkGray,
    // paddingRight: 30, // to ensure the text is never behind the icon
  },
});
