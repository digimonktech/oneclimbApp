import React, { useState, useEffect } from 'react';
import { Dimensions, Platform } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import { digestStringAsync, CryptoDigestAlgorithm } from 'expo-crypto';
import firebase from 'firebase/compat/app';

import { useNavigation } from '@react-navigation/core';

const windowWidth = Dimensions.get('window').width;

const AppleSignIn = () => {
  const [isAppleLoginAvailable, setIsAppleLoginAvailable] = useState(false);

  const navigation = useNavigation();

  const writeAppleUserData = async (email, displayName) => {
    let handle = (
      displayName.split(' ').join('_') +
      (Math.floor(Math.random() * 9999) + 1000)
    )
      .slice(0, 20)
      .toLowerCase();

    const currentUser = await firebase.auth().currentUser;

    if (!email || email == undefined) {
      displayName = currentUser.email.split('@')[0];
      handle = displayName + (Math.floor(Math.random() * 9999) + 1000);
      email = currentUser.email;
    }

    const UID = currentUser.uid;

    await firebase
      .firestore()
      .collection('users')
      .doc(UID)
      .get()
      .then((doc) => {
        if (!doc.exists || !doc.data().userID) {
          currentUser.updateProfile({
            displayName: displayName,
          });
          firebase
            .firestore()
            .collection('users')
            .doc(UID)
            .set({
              displayName: displayName,
              handle: handle,
              email: email,
              userID: UID,
              photoURL:
                currentUser.providerData[0]?.photoURL ||
                'https://firebasestorage.googleapis.com/v0/b/heartedapp-c9bd9.appspot.com/o/logo%2F8fbc951b-8dfb-465e-9b2b-fab37c83c25c?alt=media&token=b2fa1b3b-d51a-4562-80ae-7b9d8d35dda6',
              profileType: 'default',
              status: 'verified',
            });
        }
      });
  };

  const signInWithApple = async () => {
    const state = Math.random().toString(36).substring(2, 15);
    const rawNonce = Math.random().toString(36).substring(2, 10);
    const requestedScopes = [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ];

    try {
      const nonce = await digestStringAsync(
        CryptoDigestAlgorithm.SHA256,
        rawNonce
      );

      const appleCredential = await AppleAuthentication.signInAsync({
        requestedScopes,
        state,
        nonce,
      });

      const { identityToken, email, fullName } = appleCredential;

      if (!identityToken) {
        throw new Error('No identity token provided.');
      }

      const provider = new firebase.auth.OAuthProvider('apple.com');

      provider.addScope('email');
      provider.addScope('fullName');

      //console.log('PROVIDER >', provider)

      const credential = provider.credential({
        idToken: identityToken,
        rawNonce,
      });

      const displayName = fullName
        ? `${fullName.givenName} ${fullName.familyName}`
        : undefined;

      await firebase.auth().signInWithCredential(credential);

      writeAppleUserData(email, displayName);
      navigation.navigate('Home');
    } catch (error) {}
  };

  useEffect(() => {
    AppleAuthentication.isAvailableAsync().then(setIsAppleLoginAvailable);
  }, []);

  return (
    <>
      {isAppleLoginAvailable && Platform.OS === 'ios' ? (
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
          buttonStyle={
            AppleAuthentication.AppleAuthenticationButtonStyle.WHITE_OUTLINE
          }
          cornerRadius={10}
          style={{
            width: windowWidth * 0.9,
            height: 50,
            alignSelf: 'center',
            marginTop: 15,
          }}
          onPress={signInWithApple}
        />
      ) : null}
    </>
  );
};

export default AppleSignIn;
