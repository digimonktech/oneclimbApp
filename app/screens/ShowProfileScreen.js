import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Screen from '../components/Screen';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { MaterialCommunityIcons, SimpleLineIcons } from '@expo/vector-icons';
import colors from '../config/colors';
import { useNavigation } from '@react-navigation/core';
import { Avatar } from 'react-native-elements';
import AppText from '../components/AppText';
import { useRef } from 'react';
import EditProfile from '../components/EditProfile';
import { useContext } from 'react';
import AuthContext from '../auth/context';
import { useStore } from '../hooks/useStore';
import WhereAreYou from '../components/WhereAreYou';

const ShowProfileScreen = ({ route }) => {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const userData = useStore((state) => state.userData);
  const avatar = userData.photoURL;

  const editProfileRef = useRef();
  const locationRef = useRef();

  return (
    <Screen style={{ backgroundColor: colors.white,marginTop:10 }}>
      <TouchableOpacity
        style={{ marginLeft: 22, marginTop: 20 }}
        onPress={() => navigation.goBack()}
      >
        <MaterialCommunityIcons
          name='chevron-left'
          size={24}
          color={colors.darkGray}
        />
      </TouchableOpacity>
      <View style={styles.avatarContainer}>
        <Avatar
          rounded
          icon={{ name: 'user', type: 'font-awesome' }}
          placeholderStyle={{ backgroundColor: colors.hearted2, opacity: 0.5 }}
          size={60}
          source={{
            uri: avatar,
          }}
        />
        <AppText style={styles.hiText}>Hi, I'm {user.displayName}</AppText>
        <View style={styles.editContainer}>
          <AppText style={styles.locationText}>
            {userData.location?.vicinity
              ? userData.location.vicinity
              : '(place)'}
            , joined 2022
          </AppText>
          <TouchableOpacity onPress={() => editProfileRef.current?.open()}>
            <AppText style={styles.editText}>Edit</AppText>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.verified}>
        {/* <View style={styles.section}>
          <MaterialCommunityIcons
            name='shield-check-outline'
            size={24}
            color={colors.darkGray}
          />
          <AppText style={styles.textIdentity}>Identity verified</AppText>
        </View> */}
        {/* {userData.phoneNumber ? ( */}
          <View style={styles.section}>
            <MaterialCommunityIcons
              name='cellphone'
              size={24}
              color={colors.darkGray}
            />
            <AppText style={styles.textIdentity}>Phone number verified</AppText>
          </View>
        {/* ) : null} */}
      </View>
      <ScrollView>
        <View style={styles.about}>
          <AppText style={styles.aboutMe}>About me</AppText>
          <View style={styles.section}>
            <MaterialCommunityIcons
              name='account-circle-outline'
              size={24}
              color={colors.darkGray}
            />
            <View style={{ marginLeft: 22 }}>
              <AppText style={styles.boldText}>First Name</AppText>
              <AppText style={styles.smallText}>{user.displayName}</AppText>
            </View>
          </View>
        </View>
        <View style={styles.about}>
          <View style={styles.section}>
            <MaterialCommunityIcons
              name='account-circle-outline'
              size={24}
              color={colors.darkGray}
            />
            <View style={{ marginLeft: 22 }}>
              <AppText style={styles.boldText}>Last Name</AppText>
              <AppText style={styles.smallText}>
                {userData.lastName ? userData.lastName : ''}
              </AppText>
            </View>
          </View>
        </View>
        <View style={styles.about}>
          <View style={styles.section}>
            <MaterialCommunityIcons
              name='gender-male-female'
              size={26}
              color={colors.darkGray}
            />
            <View style={{ marginLeft: 22 }}>
              <AppText style={styles.boldText}>Gender</AppText>
              <AppText style={styles.smallText}>
                {userData.gender ? userData.gender : ''}
              </AppText>
            </View>
          </View>
        </View>
        <View style={styles.about}>
          <View style={styles.section}>
            <MaterialCommunityIcons
              name='cake'
              size={24}
              color={colors.darkGray}
            />
            <View style={{ marginLeft: 22 }}>
              <AppText style={styles.boldText}>Date of Birth</AppText>
              <AppText style={styles.smallText}>
                {userData.dateOfBirth ? userData.dateOfBirth : '**/**/****'}
              </AppText>
            </View>
          </View>
        </View>
        <View style={styles.about}>
          <View style={styles.section}>
            <MaterialCommunityIcons
              name='email-outline'
              size={24}
              color={colors.darkGray}
            />
            <View style={{ marginLeft: 22 }}>
              <AppText style={styles.boldText}>Email</AppText>
              <AppText style={styles.smallText}>{user.email}</AppText>
            </View>
          </View>
        </View>
        <View style={styles.about}>
          <View style={styles.section}>
            <SimpleLineIcons name='phone' size={24} color={colors.darkGray} />
            <View style={{ marginLeft: 22 }}>
              <AppText style={styles.boldText}>Phone</AppText>
              <AppText style={styles.smallText}>
                {userData.phoneNumber ? userData.phoneNumber : ''}
              </AppText>
            </View>
          </View>
        </View>
      </ScrollView>
      <EditProfile
        modalRef={editProfileRef}
        locationRef={locationRef}
        avatar={avatar}
      />
      <WhereAreYou modalRef={locationRef} />
    </Screen>
  );
};

export default ShowProfileScreen;

const styles = StyleSheet.create({
  avatarContainer: {
    marginLeft: 41,
    marginTop: -10,
  },
  hiText: {
    fontFamily: 'poppinsSemiBold',
    fontSize: 22,
    lineHeight: 33,
    color: colors.darkGray,
  },
  locationText: {
    fontFamily: 'nunitoBold',
    fontSize: 16,
    lineHeight: 22,
    color: '#787878',
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 25,
  },
  editText: {
    fontFamily: 'nunitoBold',
    fontSize: 16,
    lineHeight: 22,
    color: colors.darkGray,
    textDecorationLine: 'underline',
  },
  verified: {
    marginLeft: 27,
    marginTop: 20,
    marginBottom: 5,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textIdentity: {
    fontFamily: 'poppinsSemiBold',
    fontSize: 18,
    lineHeight: 27,
    color: colors.darkGray,
    marginLeft: 9,
  },
  about: {
    marginHorizontal: 25,
    paddingVertical: 10,
    borderColor: colors.gray2,
    borderTopWidth: 1,
  },
  aboutMe: {
    fontFamily: 'poppinsSemiBold',
    fontSize: 22,
    lineHeight: 33,
    color: colors.darkGray,
  },
  boldText: {
    fontFamily: 'nunitoBold',
    fontSize: 16,
    lineHeight: 22,
  },
  smallText: {
    fontFamily: 'nunito',
    fontSize: 14,
    lineHeight: 20,
    color: colors.darkGray,
  },
});
