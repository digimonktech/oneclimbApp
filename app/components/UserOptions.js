import React, { useState, useContext } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import {
  getFirestore,
  collection,
  query,
  where,
  getDoc,
  setDoc,
  getDocs,
} from 'firebase/firestore';
import colors from '../config/colors';
import AuthContext from '../auth/context';
import { OptionsModal, OptionItem } from './OptionsModal';
import { firebaseConfig } from '../config/Firebase/firebaseConfig';
import firebase from "firebase/compat/app";

const UserOptions = ({ visible, setVisible, userInfo }) => {
  const db = getFirestore(firebase.initializeApp(firebaseConfig));
  const { user } = useContext(AuthContext);

  const [reportModal, setReportModal] = useState(false);
  const navigation = useNavigation();

  const handleBlock = () => {
    Alert.alert(
      `Block ${userInfo.handle}`,
      `Are you sure you want to block this account? `,
      [
        {
          text: 'Block',
          onPress: addToBlockList,
        },
        {
          text: 'Close',
          onPress: () => {},
        },
      ]
    );
  };

  const addToBlockList = async () => {
    //const currentUser = db.collection('users').doc(user.uid);

    //const blockedUser = db.collection('users').doc(userInfo.userID);

    /* await db
      .collection('users')
      .doc(user.uid)
      .collection('block_list')
      .doc(userInfo.userID); */

    const currentUserRef = doc(
      collection(db, 'users', user.uid, 'block_list', userInfo.userID)
    );

    await setDoc(currentUserRef, {
      timestamp: new Date(),
      userID: userInfo.userID,
      whoBlocked: user.uid,
    }).catch((err) => console.log(err));

    /* await currentUser
      .collection('followers')
      .where('followerUserID', '==', userInfo.userID) */

    const followersQuery = query(
      collection(db, 'users', user.uid, 'followers'),
      where('followerUserID', '==', userInfo.userID)
    );

    await getDocs(followersQuery).then((snap) => {
      snap.forEach((doc) => {
        doc.ref.delete();
      });
    });

    /*   await currentUser
      .collection('following')
      .where('followedUserID', '==', userInfo.userID) */

    const followingQuery = query(
      collection(db, 'users', user.uid, 'following'),
      where('followedUserID', '==', userInfo.userID)
    );

    await getDocs(followingQuery).then((snap) => {
      snap.forEach((doc) => {
        doc.ref.delete();
      });
    });

    /* await blockedUser
      .collection('followers')
      .where('followerUserID', '==', user.uid) */

    const blockedUserFollowers = query(
      collection(db, 'users', userInfo.userID, 'followers'),
      where('followerUserID', '==', user.uid)
    );

    await getDocs(blockedUserFollowers).then((snap) => {
      snap.forEach((doc) => {
        doc.ref.delete();
      });
    });

    /*   await blockedUser
      .collection('following')
      .where('followedUserID', '==', user.uid) */

    const blockedUserFollowing = query(
      collection(db, 'users', userInfo.userID, 'following'),
      where('followedUserID', '==', user.uid)
    );

    await getDocs(blockedUserFollowing).then((snap) => {
      snap.forEach((doc) => {
        doc.ref.delete();
      });
    });

    /*  await blockedUser.collection('block_list').doc(user.uid); */

    const blockListRef = doc(collection(db, 'block_list'));

    await setDoc(blockListRef, {
      timestamp: new Date(),
      userID: user.uid,
      whoBlocked: user.uid,
    })
      .then(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Account' }],
        });
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <OptionsModal
        visible={visible}
        setVisible={setVisible}
        type='user'
        userInfo={userInfo}
        setReportModal={setReportModal}
        reportModal={reportModal}
      >
        <OptionItem onPress={handleBlock}>Block User</OptionItem>
        <OptionItem
          onPress={() => {
            setReportModal(true);
          }}
        >
          Report User
        </OptionItem>
      </OptionsModal>
    </>
  );
};

const styles = StyleSheet.create({
  userOptions: {
    backgroundColor: 'white',
    borderWidth: 0.5,
    borderColor: colors.medium,
    zIndex: 1000,
    elevation: 1000,
    top: 50,
    right: 25,
    position: 'absolute',
  },
});

export default UserOptions;
