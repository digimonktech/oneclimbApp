import React, { useEffect } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Platform,
  Dimensions,
} from "react-native";

import firebase from "firebase/compat/app";

import * as Google from "expo-auth-session/providers/google";
import { IOS_STANDALONE_KEY, ANDROID_STANDALONE_KEY } from "@env";

import AppText from "./AppText";
import colors from "../config/colors";
import { writeUserGoogleData } from "../api/firebase";

const windowWidth = Dimensions.get("window").width;

const GoogleSignIn = () => {
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId:
      Platform.OS === "ios" ? IOS_STANDALONE_KEY : ANDROID_STANDALONE_KEY,
  });

  const handleGoogleSignIn = async () => {
    let credential = firebase.auth.GoogleAuthProvider.credential(
      response.authentication.idToken,
      response.authentication.accessToken
    );
    await firebase
      .auth()
      .signInWithCredential(credential)
      .then(() => {
        writeUserGoogleData();
      })
      .then(() => {
        setUser(firebase.auth().currentUser);
      });
  };

  useEffect(() => {
    if (response?.type === "success") {
      handleGoogleSignIn();
    }
  }, [response]);

  return (
    <TouchableOpacity
      style={styles.gSignIn}
      onPress={() => {
        promptAsync({ showInRecents: true });
      }}
    >
      <View style={styles.gSignInIcon}>
        <Image
          style={{ width: 24, height: 24, alignSelf: "center" }}
          source={require("../assets/google-icon.png")}
        />
      </View>
      <View style={styles.gSignInTextView}>
        <AppText style={styles.gSignInText}>Continue with Google</AppText>
      </View>
    </TouchableOpacity>
  );
};

export default GoogleSignIn;

const styles = StyleSheet.create({
  gSignIn: {
    flexDirection: "row",
    width: windowWidth * 0.9,
    marginTop: -5,
    alignSelf: "center",
    borderRadius: 10,
    borderColor: colors.gray2,
    borderWidth: 1,
  },
  gSignInTextView: {
    backgroundColor: colors.white,
    width: 220,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 7,
    borderBottomRightRadius: 7,
  },
  gSignInText: {
    color: colors.black2,
    fontWeight: "400",
    fontFamily: "nunito",
    fontSize: 16,
    lineHeight: 26,
    marginLeft: -15,
  },
  gSignInIcon: {
    backgroundColor: colors.white,
    justifyContent: "center",
    width: 50,
    height: 50,
    marginLeft: 5,
  },
});
