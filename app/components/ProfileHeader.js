import React, { useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Avatar } from 'react-native-elements';

import colors from '../config/colors';
import CloseButton from './CloseButton';
import EditProfile from './EditProfile';
import AppText from './AppText';

const windowHeight = Dimensions.get('window').height;

const ProfileHeader = ({
  avatar,
  user,
  userID,
  userData,
  setUserData,
  setAvatar,
  updateUserInfo,
  setProfileLoaded,
}) => {
  const navigation = useNavigation();
  const [editProfileModal, setEditProfileModal] = useState(false);
  const load = () => {
    setTimeout(() => {
      setProfileLoaded(true);
    }, 300);
  };

  return (
    <>
      {/* <View style={{ zIndex: 1000, elevation: 1000 }}>
        <View style={styles.iconBox}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              navigation.openDrawer();
            }}
          >
            <Feather name='menu' size={21} color={colors.black} />
          </TouchableOpacity>
        </View>
      </View> */}
      <View style={styles.avatarContainer}>
        <Avatar
          rounded
          imageProps={{ onLoadEnd: load }}
          icon={{ name: 'user', type: 'font-awesome' }}
          activeOpacity={userID !== user.uid ? 1 : 0.3}
          placeholderStyle={{ backgroundColor: colors.hearted2, opacity: 0.5 }}
          size={60}
          source={{
            uri: avatar,
          }}
        />
        <AppText style={styles.userName}>{user.displayName}</AppText>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('ShowProfile', {
              avatar,
            })
          }
        >
          <AppText style={styles.showProfile}>Show profile</AppText>
        </TouchableOpacity>
      </View>
      <Modal
        visible={editProfileModal}
        animationType='slide'
        onRequestClose={() => setEditProfileModal(false)}
        style={{ backgroundColor: colors.white, height: windowHeight }}
      >
        <CloseButton setModal={setEditProfileModal} />
        <EditProfile
          user={user}
          setEditProfileModal={setEditProfileModal}
          bio={userData?.bio}
          badges={userData?.badges}
          climbLevel={userData?.climbLevel}
          avatar={avatar}
          handle={userData?.handle}
          setUserData={setUserData}
          setAvatar={setAvatar}
          updateUserInfo={updateUserInfo}
        />
      </Modal>
    </>
  );
};

export default ProfileHeader;

const styles = StyleSheet.create({
  iconBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 250,
  },
  avatarContainer: {
    marginTop: 20,
    marginLeft: 40,
    backgroundColor: 'transparent',
  },
  userName: {
    color: colors.darkGray,
    fontFamily: 'poppinsSemiBold',
    fontSize: 22,
    lineHeight: 33,
  },
  showProfile: {
    fontFamily: 'nunitoBold',
    fontSize: 14,
    lineHeight: 19.1,
    color: colors.darkGray,
    textDecorationLine: 'underline',
    marginBottom: 15,
  },
});
