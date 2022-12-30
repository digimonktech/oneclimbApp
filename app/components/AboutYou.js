import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useContext, useRef, useState } from 'react';
import { Portal } from 'react-native-portalize';
import { Modalize } from 'react-native-modalize';
import { Entypo, Feather } from '@expo/vector-icons';
import colors from '../config/colors';
import { ProgressBar, RadioButton } from 'react-native-paper';
import { Avatar, CheckBox } from 'react-native-elements';
import { useStore } from '../hooks/useStore';
import { Controller, useForm } from 'react-hook-form';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_API_KEY } from '@env';
import uuid from 'react-native-uuid';
import * as ImagePicker from 'expo-image-picker';
import { getAuth, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import AuthContext from '../auth/context';
import { firebaseConfig } from '../config/Firebase/firebaseConfig';
import firebase from 'firebase/compat/app';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const AboutYou = ({
  modalRef,
  teachingExperience,
  overviewRef,
  reviewRef,
  hosting,
  setHosting,
  setUniqueInfo,
  language,
  setLanguage,
  locationData,
  setLocationData,
  checkedExperience,
  setCheckedExperience,
}) => {
  const [checked, setChecked] = useState('');
  const userData = useStore((state) => state.userData);
  const [textLength, setTextLength] = useState(0);

  const db = getFirestore(firebase.initializeApp(firebaseConfig));
  const storage = getStorage();

  const googleSearchRef = useRef(null);

  const [progress, setProgress] = useState(0);
  const [documentProgress, setDocumentProgress] = useState(0);
  const [documentUploaded, setDocumentUploaded] = useState(false);
  const { user, setUser } = useContext(AuthContext);
  const auth = getAuth();
  const fetchUserData = useStore((state) => state.fetchUserData);

  const handleSearch = (data, details = null) => {
    setLocationData(details);
  };
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = ({ description }) => {
    console.log(description?.length);
  };

  const registerOptions = {
    description: {
      required: 'Description is required',
      minLength: {
        value: 3,
        message: 'Description must have at least 3 letters',
      },
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

  const uploadDocument = async (documentPhoto) => {
    const photoID = uuid.v4();
    const uri = documentPhoto.uri;
    const response = await fetch(uri);
    const blob = await response.blob();
    //console.log('STORAGE > ', storage)

    const uploadTask = uploadBytesResumable(
      ref(storage, `documentPhotos/${user.uid}/${photoID}`),
      blob
    );

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        console.log(progress);
        setDocumentProgress(progress);
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
                licenceDocumentURL: url,
              },
              { merge: true }
            );
          })
          .then(() => setDocumentProgress(0))
          .then(() => setDocumentUploaded(true))
          .catch((err) => console.log(err));
      }
    );
  };

  const uploadLicence = async () => {
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
      uploadDocument(pickerResult);
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

  const renderHeader = () => {
    return (
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => {
          modalRef.current?.close();
        }}
      >
        <Entypo name='chevron-left' size={26} color={colors.darkGray} />
      </TouchableOpacity>
    );
  };

  return (
    <Portal>
      <Modalize
        ref={modalRef}
        modalHeight={windowHeight * 0.95}
        handleStyle={{
          height: 5,
          width: 150,
          backgroundColor: "#DEDEDE",
          zIndex: 999,
        }}
        handlePosition={"inside"}
        overlayStyle={{ backgroundColor: "rgba(0, 0, 0, 0.25)" }}
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
        keyboardShouldPersistTaps="always"
        panGestureEnabled={false}
      >
        <View style={styles.section}>
          <Text style={styles.title}>About you</Text>
          <Text style={styles.subtitle}>Tell us more about you</Text>
        </View>
        <View style={[styles.section, { borderBottomWidth: 0 }]}>
          <Text style={styles.titleSection}>
            How will you host climbing sessions on Onclimb?
          </Text>
          <TouchableOpacity
            style={styles.radioBox}
            onPress={() => setHosting("business")}
          >
            <Text style={styles.optionText}>
              As a business{" "}
              <Text style={[styles.optionText, { fontFamily: "nunito" }]}>
                (either sole-proprietor - s.p. or limited liablity - d.o.o.)
              </Text>
            </Text>
            <RadioButton
              value="business"
              status={hosting === "business" ? "checked" : "unchecked"}
              onPress={() => setHosting("business")}
              color={colors.oneClimbOrange}
              uncheckedColor={colors.darkGray}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.radioBox}
            onPress={() => setHosting("student")}
          >
            <Text style={styles.optionText}>As a student</Text>
            <RadioButton
              value="student"
              status={hosting === "student" ? "checked" : "unchecked"}
              onPress={() => setHosting("student")}
              color={colors.oneClimbOrange}
              uncheckedColor={colors.darkGray}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.radioBox}
            onPress={() => setHosting("private")}
          >
            <Text style={styles.optionText}>As a private individual</Text>
            <RadioButton
              value="private"
              status={hosting === "private" ? "checked" : "unchecked"}
              onPress={() => setHosting("private")}
              color={colors.oneClimbOrange}
              uncheckedColor={colors.darkGray}
            />
          </TouchableOpacity>
        </View>
        <View style={[styles.section, { paddingTop: 0 }]}>
          <Text style={styles.sectionText}>Your personal profile</Text>
          <Text style={[styles.sectionText, { fontFamily: "nunito" }]}>
            Use your legal name and provide a photo that clearly shows your face
            (not a logo).
          </Text>
          <View style={styles.profileBox}>
            <Avatar
              rounded
              //imageProps={{ onLoadEnd: load }}
              icon={{ name: "user", type: "font-awesome" }}
              //activeOpacity={userID !== user.uid ? 1 : 0.3}
              placeholderStyle={{
                backgroundColor: colors.hearted2,
                opacity: 0.5,
              }}
              size={60}
              source={{
                uri: userData.photoURL,
              }}
            />
            <View style={{ marginLeft: 18 }}>
              <Text style={styles.nameText}>{userData.displayName}</Text>
              {userData.location?.vicinity ? (
                <Text style={styles.locationText}>
                  {userData.location?.vicinity}
                </Text>
              ) : (
                <Text style={styles.locationText}>Ig, Slovenia</Text>
              )}
              <View style={styles.edit}>
                <TouchableOpacity>
                  <Text style={styles.editText}>Edit name</Text>
                </TouchableOpacity>
                <Entypo
                  name="dot-single"
                  size={24}
                  color={colors.darkGray}
                  style={{ marginHorizontal: 5 }}
                />
                <TouchableOpacity onPress={openImagePickerAsync}>
                  <Text style={styles.editText}>Edit photo</Text>
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
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionText}>
            What makes you uniquly qualified as a coach?
          </Text>
          <Controller
            control={control}
            rules={registerOptions.description}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                name="description"
                textContentType="none"
                numberOfLines={10}
                maxLength={800}
                autoCorrect={false}
                multiline={true}
                style={styles.inputField}
                onChangeText={onChange}
                onChange={() => {
                  setTextLength(value.length + 1);
                  setUniqueInfo(value);
                }}
                value={value}
              />
            )}
            name="description"
            defaultValue={""}
          />
          <Text style={styles.count}>({textLength}/800)</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionText}>
            Which city do you want to primarely host your sessions in?
          </Text>
          <Text style={[styles.sectionText, { fontFamily: "nunito" }]}>
            (Note: You can always change this later in Profile or set a
            different location for a specific session that you will create.)
          </Text>
          <GooglePlacesAutocomplete
            ref={googleSearchRef}
            placeholder="Search Location"
            textInputProps={{
              placeholderTextColor: "rgba(48, 43, 45, 1)",
              lineHeight: 20,
            }}
            minLength={2}
            autoFocus={true}
            returnKeyType={"search"}
            fetchDetails={true}
            onPress={handleSearch}
            query={{
              key: GOOGLE_API_KEY,
              language: "en",
            }}
            nearbyPlacesAPI="GooglePlacesSearch"
            debounce={300}
            keyboardShouldPersistTaps="always"
            styles={{
              textInputContainer: {
                marginVertical: 20,
                borderColor: colors.darkGray,
                borderRadius: 10,
                borderWidth: 1,
                elevation: 999,
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
          {/* <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <Feather name='map-pin' size={16} color={colors.darkGray} />
            <Text style={styles.currentLocation}>Use my current location</Text>
          </TouchableOpacity> */}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionText}>
            Which language(s) will you offer your experience in?
          </Text>
          <Text style={[styles.sectionText, { fontFamily: "nunito" }]}>
            (Note: You should be able to read, write, and speak in this
            language. If more than one, separate with comma.)
          </Text>
          <TouchableOpacity
            style={{
              marginTop: 15,
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <Text
              style={{
                fontFamily: "nunitoBold",
                color: colors.darkGray,
                fontSize: 16,
              }}
            >
              English
            </Text>
            <Entypo name="chevron-right" size={26} color={colors.darkGray} />
          </TouchableOpacity>

          {/* <TextInput
            name='language'
            textContentType='none'
            autoComplete='off'
            autoCorrect={false}
            style={styles.inputFieldLanguage}
            onChangeText={(text) => setLanguage(text)}
            placeholder={language}
          /> */}
        </View>
        <View style={{...styles.section,paddingVertical:15}}>
          <Text style={{...styles.sectionText,textDecorationLine:'underline'}}>Add additional languages</Text>
        </View>
        {/* <View style={styles.section}>
          <Text style={styles.sectionText}>
            Please provide us a relevant proof of your valid coaching license.
          </Text>
          {documentProgress !== 0 ? (
            <ProgressBar
              color={colors.oneClimbOrange}
              progress={documentProgress / 100}
              style={[styles.progressBar, { marginTop: 10 }]}
            />
          ) : null}
          <View>
            <TouchableOpacity
              onPress={uploadLicence}
              style={[
                styles.button,
                { height: 35, width: 120, marginBottom: 10 },
              ]}
            >
              <Text style={[styles.buttonText, { fontSize: 14 }]}>Upload</Text>
            </TouchableOpacity>
            {documentUploaded ? (
              <Feather
                name='file-text'
                size={36}
                color={colors.oneClimbOrange}
                style={{ marginLeft: 50, marginTop: 10 }}
              />
            ) : null}
          </View>
        </View>
        <View style={[styles.section, { borderBottomWidth: 0 }]}>
          <Text style={styles.sectionText}>
            Stand out from the crowd and select all points below that applies to
            you.
          </Text>
          <Text
            style={[
              styles.sectionText,
              { fontFamily: 'nunito', marginBottom: 10 },
            ]}
          >
            (Select best 3 out of 6)
          </Text>
          <View style={styles.radioBox}>
            <Text style={[styles.optionText, { fontFamily: 'nunito' }]}>
              Over 5 years of coaching experience
            </Text>
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
              checked={checkedExperience.fivePlus}
              onPress={() =>
                setCheckedExperience((checkedExperience) => ({
                  ...checkedExperience,
                  ...{ fivePlus: !checkedExperience.fivePlus },
                }))
              }
            />
          </View>
          <View style={styles.radioBox}>
            <Text style={[styles.optionText, { fontFamily: 'nunito' }]}>
              Ex. pro athlete{' '}
            </Text>

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
              checked={checkedExperience.exPro}
              onPress={() =>
                setCheckedExperience((checkedExperience) => ({
                  ...checkedExperience,
                  ...{ exPro: !checkedExperience.exPro },
                }))
              }
            />
          </View>

          <View style={styles.radioBox}>
            <Text style={[styles.optionText, { fontFamily: 'nunito' }]}>
              Experienced rock climber{' '}
            </Text>
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
              checked={checkedExperience.rockClimber}
              onPress={() =>
                setCheckedExperience((checkedExperience) => ({
                  ...checkedExperience,
                  ...{ rockClimber: !checkedExperience.rockClimber },
                }))
              }
            />
          </View>
          <View style={styles.radioBox}>
            <Text style={[styles.optionText, { fontFamily: 'nunito' }]}>
              Like to work with begginers{' '}
            </Text>
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
              checked={checkedExperience.begginers}
              onPress={() =>
                setCheckedExperience((checkedExperience) => ({
                  ...checkedExperience,
                  ...{ begginers: !checkedExperience.begginers },
                }))
              }
            />
          </View>

          <View style={styles.radioBox}>
            <Text style={[styles.optionText, { fontFamily: 'nunito' }]}>
              Like to work with advanced climbers{' '}
            </Text>
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
              checked={checkedExperience.advanced}
              onPress={() =>
                setCheckedExperience((checkedExperience) => ({
                  ...checkedExperience,
                  ...{ advanced: !checkedExperience.advanced },
                }))
              }
            />
          </View>
          <View style={[styles.radioBox, { borderBottomWidth: 0 }]}>
            <Text style={[styles.optionText, { fontFamily: 'nunito' }]}>
              I'm recreational climber myself too so
              {'\n'}I know what they need
            </Text>
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
              checked={checkedExperience.recreational}
              onPress={() =>
                setCheckedExperience((checkedExperience) => ({
                  ...checkedExperience,
                  ...{ recreational: !checkedExperience.recreational },
                }))
              }
            />
          </View>
        </View> */}
        <View style={styles.buttonsBox}>
          <TouchableOpacity
            onPress={() => {
              overviewRef.current?.close();
              modalRef.current?.close();
            }}
          >
            <Text style={styles.cancel}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => reviewRef.current?.open()}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </Modalize>
    </Portal>
  );
};

export default AboutYou;

const styles = StyleSheet.create({
  closeButton: {
    marginTop: 38,
    marginLeft: 24,
  },
  section: {
    marginHorizontal: 25,

    borderBottomWidth: 1,
    borderColor: colors.gray2,
    paddingVertical: 20,
  },
  title: {
    fontFamily: 'poppinsSemiBold',
    fontSize: 22,
    lineHeight: 33,
    color: colors.darkGray,
  },
  subtitle: {
    fontFamily: 'nunitoBold',
    fontSize: 14,
    lineHeight: 19,
    color: colors.darkGray,
  },
  titleSection: {
    fontFamily: 'nunitoBold',
    fontSize: 16,
    lineHeight: 22,
    color: colors.darkGray,
    marginBottom: 10,
  },
  radioBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: colors.gray2,
    paddingVertical: 10,
  },
  optionText: {
    fontFamily: 'nunitoBold',
    fontSize: 14,
    lineHeight: 20,
    color: colors.darkGray,
  },
  sectionText: {
    fontFamily: 'nunitoBold',
    fontSize: 16,
    lineHeight: 22,
    color: colors.darkGray,
  },
  profileBox: {
    flexDirection: 'row',
    marginTop: 20,
  },
  nameText: {
    fontFamily: 'nunitoBold',
    fontSize: 16,
    lineHeight: 22,
    color: colors.darkGray,
  },
  locationText: {
    fontFamily: 'nunito',
    fontSize: 16,
    lineHeight: 22,
    color: colors.darkGray,
  },
  edit: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editText: {
    fontFamily: 'nunito',
    fontSize: 14,
    lineHeight: 19,
    color: colors.darkGray,
    textDecorationLine: 'underline',
  },
  inputField: {
    borderRadius: 10,
    borderColor: colors.darkGray,
    borderWidth: 1,
    width: '100%',
    height: 325,
    marginTop: 20,
    padding: 10,
  },
  inputFieldLanguage: {
    borderRadius: 10,
    borderColor: colors.darkGray,
    borderWidth: 1,
    width: '100%',
    height: 40,
    marginTop: 20,
    paddingLeft: 10,
  },
  count: {
    fontFamily: 'nunito',
    fontSize: 14,
    lineHeight: 22,
    color: colors.darkGray,
    marginTop: 5,
  },
  currentLocation: {
    fontFamily: 'nunitoBold',
    fontSize: 16,
    lineHeight: 22,
    color: colors.darkGray,
    textDecorationLine: 'underline',
    marginLeft: 4,
  },
  buttonsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 25,
  },
  cancel: {
    fontFamily: 'poppinsSemiBold',
    fontSize: 16,
    lineHeight: 24,
    color: colors.darkGray,
    textDecorationLine: 'underline',
  },
  button: {
    height: 50,
    width: 150,
    borderRadius: 42,
    backgroundColor: colors.oneClimbOrange,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    marginTop: 50,
  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: 'poppinsSemiBold',
    fontSize: 18,
    lineHeight: 27,
  },
  progressBar: {
    maxWidth: '30%',
    margin: 3,
  },
});
