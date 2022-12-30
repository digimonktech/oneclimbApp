import React, { useState, useContext } from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Avatar, Overlay } from 'react-native-elements';
import Screen from './Screen';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import colors from '../config/colors';
import { ProgressBar } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { AppFormField, ErrorMessage } from './forms';
import firebase from 'firebase/compat/app';
import AppText from './AppText';
import uuid from 'react-native-uuid';
import * as ImagePicker from 'expo-image-picker';
import AuthContext from '../auth/context';
import { getAuth, updateProfile } from 'firebase/auth';
import 'firebase/compat/storage';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const EditProfile = ({
  bio,
  handle,
  setUserData,
  avatar,
  setEditProfileModal,
  setAvatar,
  updateUserInfo,
}) => {
  const db = firebase.firestore();
  const storage = firebase.storage();
  const [inputModal, setInputModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const { user, setUser } = useContext(AuthContext);
  const auth = getAuth();

  const [error, setError] = useState('');
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async ({ handle, name, bio }) => {
    await db
      .collection('users')
      .doc(user.uid)
      .set(
        {
          handle: handle.toLowerCase(),
          displayName: name,
          bio: bio || '',
        },
        { merge: true }
      );
    updateProfile(auth.currentUser, {
      displayName: name,
    })
      .then(() => {
        setUserData({
          ...user,
          handle: handle,
          displayName: name,
          bio: bio || '',
        });

        /*  Alert.alert("Saved", "Your changes are saved", [
          { text: "Close", onPress: () => {} },
        ]);*/
      })
      .then(() => {
        setEditProfileModal(false);
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

    const uploadTask = storage
      .ref(`avatarPhotos/${user.uid}/${photoID}`)
      .put(blob);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        alert(error.message);
      },
      () => {
        // Complete function
        storage
          .ref(`avatarPhotos/${user.uid}/`)
          .child(photoID)
          .getDownloadURL()
          .then((url) => {
            setAvatar(url);
            db.collection('users').doc(user.uid).set(
              {
                photoURL: url,
                displayName: user.displayName,
                email: user.email,
                userID: user.uid,
              },
              { merge: true }
            );

            updateProfile(auth.currentUser, { photoURL: url }).then(
              updateUserInfo(),
              setProgress(0),
              setUser({ ...auth.currentUser, photoURL: url })
            );
            //updateUserInfo();
          })
          .catch((err) => console.log(err));
      }
    );
  };

  const checkHandle = (text) => {
    const snapshot = db
      .collection('users')
      .where('handle', '==', text.toLowerCase())
      .get()
      .then((snap) => {
        if (!snap.empty && text.toLowerCase() !== handle) {
          setError('Username already exist');
        } else setError('');
      });
  };

  return (
    <Screen style={{ backgroundColor: colors.white, flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.pinkCard}>
          {progress !== 0 ? (
            <ProgressBar
              color={colors.white}
              progress={progress / 100}
              style={styles.progressBar}
            />
          ) : null}
        </View>
        <View style={styles.avatarBox}>
          <Avatar
            rounded
            avatarStyle={{ borderWidth: 3, borderColor: colors.white }}
            placeholderStyle={{
              backgroundColor: colors.white,
            }}
            size={120}
            source={{
              uri:
                avatar ||
                'https://i2.wp.com/boingboing.net/wp-content/uploads/2015/12/screenshot4.jpg?fit=591%2C555&ssl=1',
            }}
            onPress={openImagePickerAsync}
          />
          <View style={styles.editIcon}>
            <MaterialCommunityIcons
              name="account-edit-outline"
              size={22}
              color={colors.hearted2}
              style={{ marginLeft: 2 }}
            />
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.editBox}
      >
        <Text style={styles.handle}>{user.displayName}</Text>
        <View style={styles.editProfileTextbox}>
          <Text style={styles.editProfileText}>Edit profile</Text>
        </View>
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
                    name="handle"
                    placeholder={handle || user.displayName.toLowerCase()}
                    onChangeText={(text) => {
                      checkHandle(text);
                      onChange(text);
                    }}
                    value={value}
                  />
                )}
                name="handle"
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
                    placeholder={user.displayName}
                    textContentType="familyName"
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="name"
                defaultValue={user.displayName}
              />
            </View>
            <View style={styles.fieldView}>
              <AppText style={styles.fieldText}>Inspire</AppText>
              <Controller
                control={control}
                rules={registerOptions.bio}
                render={({ field: { onChange, onBlur, value } }) => (
                  <AppFormField
                    name="bio"
                    placeholder={
                      bio ||
                      'Change is the essence of life; be willing to surrender what you are for what you could become.'
                    }
                    textContentType="none"
                    numberOfLines={3}
                    maxLength={150}
                    multiline={true}
                    blurOnSubmit={true}
                    onChangeText={onChange}
                    value={value}
                    //onFocus={() => setInputModal(!inputModal)}
                  />
                )}
                name="bio"
                defaultValue={
                  bio ||
                  'Change is the essence of life; be willing to surrender what you are for what you could become.'
                }
              />
            </View>
          </View>
        </ScrollView>
        <View style={{ height: 35 }} />
      </KeyboardAvoidingView>
      <TouchableOpacity onPress={handleSubmit(onSubmit)} style={styles.submit}>
        <AppText style={styles.submitButton}>Save</AppText>
      </TouchableOpacity>

      {/* <Overlay visible={inputModal} style={styles.overlay}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setInputModal(!inputModal)}
        >
          <Ionicons
            style={styles.back}
            name='chevron-back'
            size={22}
            color={colors.hearted2}
          />
        </TouchableOpacity>

        <Controller
          control={control}
          rules={registerOptions.bio}
          render={({ field: { onChange, onBlur, value } }) => (
            <AppFormField
              name='bio'
              placeholder={
                bio ||
                'Change is the essence of life; be willing to surrender what you are for what you could become.'
              }
              textContentType='none'
              numberOfLines={3}
              multiline={true}
              blurOnSubmit={true}
              onChangeText={onChange}
              value={value}
              style={styles.input}
            />
          )}
          name='bio'
          defaultValue={
            bio ||
            'Change is the essence of life; be willing to surrender what you are for what you could become.'
          }
        />
      </Overlay> */}
    </Screen>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    //position: 'absolute',
    //top: 30,
    //left: '40%',
    //right: 0,
    //bottom: 0,
    width: '100%',
    alignItems: 'center',
  },
  pinkCard: {
    backgroundColor: colors.hearted2,
    height: windowHeight / 5.4,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginTop: -windowHeight / 16,
  },
  progressBar: {
    maxWidth: '30%',
    margin: 3,
  },
  avatarBox: {
    marginTop: -64,
  },
  editIcon: {
    marginTop: -37,
    //marginRight: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    opacity: 1,
    height: 32,
    width: 32,
    borderColor: colors.hearted2,
    borderWidth: 1.1,
    borderRadius: 16,
  },
  handle: {
    fontFamily: 'nunitoBold',
    fontSize: 19,
    fontWeight: '700',
    alignSelf: 'center',
    marginTop: '-7%',
    marginBottom: 10,
    marginTop: 10,
    color: colors.hearted2,
  },
  editBox: {
    //top: 160,
    height: windowHeight * 0.64,
    justifyContent: 'space-between',
  },
  editProfileTextbox: {
    alignItems: 'flex-start',
    borderBottomColor: colors.hearted2,
    borderBottomWidth: 0.8,
    marginLeft: 20,
    marginRight: 20,
  },
  editProfileText: {
    color: colors.black2,
    fontFamily: 'nunitoBold',
    fontWeight: '700',
    fontSize: 16,
    padding: 5,
    marginLeft: 10,
  },
  formBox: {
    alignItems: 'flex-start',
    paddingBottom: 50,
    flexGrow: 1,
    marginTop: 10,
  },
  /*  submit: {
    marginTop: 30,
    left: 10,
    alignSelf: 'center',
    alignItems: 'center',
    width: 150,
    borderColor: 'gray',
    borderWidth: 0.8,
    borderRadius: 16,
  }, */
  fContainer: {
    width: windowWidth,
    alignItems: 'center',
    marginTop: -10,
  },
  fieldView: {
    alignItems: 'flex-start',
    marginBottom: -25,
  },

  fieldText: {
    marginLeft: 29,
    fontFamily: 'nunito',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 26,
    color: colors.black2,
    bottom: -20,
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
    color: colors.white,
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
