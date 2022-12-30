//import firebase from 'firebase/compat/app';
//import 'firebase/compat/firestore';
import { Alert /* Platform */ } from "react-native";
import axios from "axios";
import {
  getAuth,
  updateProfile,
  sendEmailVerification,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import firebase from "firebase/compat/app";
import { firebaseConfig } from "../config/Firebase/firebaseConfig";
/* import * as Updates from 'expo-updates'; */

// TODO: Refactor all callbacks to async/await

const DEFAULT_PROFILE_PHOTO =
  "https://firebasestorage.googleapis.com/v0/b/oneclimb.appspot.com/o/assets%2FinApp%2FOCavatar.png?alt=media&token=e9c931f9-81c2-4c90-bba1-955012b40c1a";

export async function registration(
  username,
  name,
  email,
  password,
  setError,
  navigation
) {
  try {
    const auth = getAuth();
    const db = getFirestore(firebase.initializeApp(firebaseConfig));

    await createUserWithEmailAndPassword(auth, email, password);
    const currentUser = auth.currentUser;
    // console.log('C', currentUser);
    updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: auth.currentUser.photoURL || DEFAULT_PROFILE_PHOTO,
    })
      .then(() => {
        /* firebase
          .firestore()
          .collection('users')
          .doc(auth.currentUser.uid) */
        console.log("DB", auth.currentUser.uid);
        setDoc(doc(db, "users", auth.currentUser.uid), {
          displayName: name,
          email: email.toLowerCase(),
          userID: auth.currentUser.uid,
          photoURL: auth.currentUser.photoURL || DEFAULT_PROFILE_PHOTO,

          profileType: "default",
          status: "unverified",
        });
      })
      .then(() => {
        sendEmailVerification(auth.currentUser);
        Alert.alert(
          "Verification email sent",
          `Please verify your email and then Sign In with account credentials`,
          [{ text: "Close", onPress: () => {} }]
        );

        updateDoc(doc(db, "users", auth.currentUser.uid), {
          status: "pending",
        });
      })
      .catch(function (error) {
        //console.log('FAILED CURRENT USER NAME UPDATE', error);
      });
    // navigation.goBack();
    navigation.navigate("Verify");
  } catch (err) {
    setError(err.message);
  }
}

export async function signIn(
  email,
  password,
  navigation,
  setErrorText,
  setUser,
  setVerifyVisible
) {
  try {
    const db = getFirestore(firebase.initializeApp(firebaseConfig));
    const auth = getAuth();

    /* await firebase
      .auth()
      .signInWithEmailAndPassword(email, password) */
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        //const currentUser = auth.currentUser;
        setUser(auth.currentUser);
        if (auth.currentUser.emailVerified === false) {
          setErrorText(`Please verify your email`);
          setVerifyVisible(true);
          //currentUser.sendEmailVerification();
        } else {
          updateDoc(doc(db, "users", auth.currentUser.uid), {
            status: "verified",
          });
          navigation.navigate("Home");
        }
      })

      .catch((error) => setErrorText(error.message));
  } catch (err) {
    setErrorText(err.message);
  }
}

export const loggingOut = async () => {
  const auth = getAuth();

  signOut(auth).catch((err) => {
    console.log(err.message);
    Alert.alert("There is something wrong!", err.message);
  });
};

export function passwordReset(auth, email) {
  return sendPasswordResetEmail(auth, email);
}

export const writeUserGoogleData = async () => {
  const auth = getAuth();
  // const currentUser = auth.currentUser;
  const UID = auth.currentUser.uid;
  let handle = (
    auth.currentUser.displayName.split(" ").join("_") +
    (Math.floor(Math.random() * 9999) + 1000)
  )
    .slice(0, 20)
    .toLowerCase();
  const docRef = firebase.firestore().collection("users").doc(UID);
  await getDoc(docRef).then((doc) => {
    if (!doc.exists() || !doc.data().userID) {
      firebase.firestore().collection("users").doc(UID).set({
        displayName: auth.currentUser.displayName,
        handle: handle,
        email: auth.currentUser.email,
        userID: UID,
        photoURL: auth.currentUser.photoURL,
        profileType: "default",
        status: "verified",
      });
    }
  });
};

/* const writeUserData = async (user, handle) => {
  const auth = getAuth();
  //const currentUser = auth.currentUser;
  const UID = auth.currentUser.uid;
  const snapshot = await firebase
    .firestore()
    .collection('users')
    .doc(UID)
    .get();
  if (snapshot.exists === false) {
    if (!handle) handle = user.email?.split('@')[0].slice(0, 20);
    await firebase
      .firestore()
      .collection('users')
      .where('handle', '==', handle)
      .get()
      .then((snap) => {
        if (snap.empty) {
          firebase
            .firestore()
            .collection('users')
            .doc(UID)
            .set({
              displayName: user.name || null,
              handle: handle,
              email: user.email || null,
              userID: UID,
              photoURL: user.photoURL || DEFAULT_PROFILE_PHOTO,
              profileType: 'default',
            });
        } else {
          handle =
            user.email?.split('@')[0].slice(0, 20) +
            (Math.floor(Math.random() * 9999) + 1000);
          writeUserData(user, handle);
        }
      });
  }
}; */

/* export const handleAddToJourney = async (
  selectedJourney,
  selectedLocations,
  userID,
  modalRef,
  navigation
) => {
  let objectsToAdd = [];
  let existingObjects = selectedJourney.objects || [];
  selectedLocations.map((location) => {
    const marker = location.marker
      ? location.marker
      : {
          latitude: location.details.result.geometry.location.lat,
          longitude: location.details.result.geometry.location.lng,
        };
    const postType = location.uploaded_multimedia?.[0]?.postType;
    const singleObj = {
      place_id: location.place_id,
      image: location.url,
      name: location.details.result.name,
      postal_town: location.postal_town,
      coordinates: marker,
      postType: postType ? postType : null,
      marker: location.marker ? marker : null,
    };
    if (existingObjects.length) {
      let alreadyExist = false;
      selectedJourney.objects.map((obj) => {
        if (obj.place_id === location.place_id) {
          alreadyExist = true;
        }
      });
      if (!alreadyExist) {
        objectsToAdd.push(singleObj);
      }
    } else {
      objectsToAdd.push(singleObj);
    }
  });

  const allObjects = [...existingObjects, ...objectsToAdd];

  await firebase
    .firestore()
    .collection('users')
    .doc(userID)
    .collection('journeys')
    .doc(selectedJourney.doc_id)
    .update({ objects: allObjects })
    .then(() => {
      navigation.navigate('JourneysList', {
        journey: { ...selectedJourney, objects: allObjects },
        name: `${selectedJourney.data.label} journey`,
      });
      modalRef.current?.close();
    });
}; */

export const getUserData = async (userID) => {
  const response = await axios.get(
    "https://us-central1-oneclimb.cloudfunctions.net/getUserData",

    {
      params: {
        userID: userID,
      },
    }
  );
  return response.data;
};
