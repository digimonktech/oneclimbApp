import React, { useContext } from 'react';
import {
  View,
  StyleSheet,
  Linking,
  Image,
  TouchableOpacity,
  Text,
  Share,
} from 'react-native';
import {
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome,
  AntDesign,
} from '@expo/vector-icons';
import * as Analytics from 'expo-firebase-analytics';

import { loggingOut } from '../api/firebase';
import AuthContext from '../auth/context';
import colors from '../config/colors';
import Screen from './Screen';

const UserSettings = ({ navigation }) => {
  const { user, setUser } = useContext(AuthContext);

  const handleInvite = async () => {
    try {
      const result = await Share.share(
        {
          title: 'Join Hearted',
          message:
            'Hey, check out the travel app I found: \n https://hearted-website.vercel.app/ ',
        },
        {
          subject: 'Join Hearted',
        }
      );
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Screen>
      {user ? (
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>
            <View style={{ padding: 10, width: '85%' }}>
              <Text numberOfLines={1} style={styles.userName}>
                {user ? user.displayName : null}
              </Text>
              <Text numberOfLines={1} style={styles.email}>
                {user ? user.email : 'e-mail'}
              </Text>
            </View>
            <Image
              style={[styles.avatarImage]}
              source={{ uri: user.photoURL }}
              placeholderStyle={{
                backgroundColor: colors.medium,
                opacity: 0.5,
              }}
            />
          </View>
          <View style={styles.line} />
          <View style={{ marginTop: 20 }}>
            <View style={styles.drawerItem}>
              <TouchableOpacity onPress={handleInvite}>
                <Text style={styles.labelStyle}>Invite Friends</Text>
              </TouchableOpacity>
              <View style={{ paddingLeft: 10 }}>
                <AntDesign name="sharealt" size={24} color={colors.hearted2} />
              </View>
            </View>
            <View style={styles.drawerItem}>
              <TouchableOpacity
                onPress={() => {
                  /* Analytics.logEvent('side_menu_press', {
                    button: 'BusinessProfile',
                    uid: user.uid,
                  }); */
                  navigation.navigate('RegisterAsCoach');
                }}
              >
                <Text style={styles.labelStyle}>Register as coach</Text>
              </TouchableOpacity>
              <View style={{ paddingLeft: 15 }}>
                <MaterialCommunityIcons
                  name="briefcase-variant-outline"
                  size={26}
                  color={colors.hearted2}
                />
              </View>
            </View>
            <View style={styles.drawerItem}>
              <TouchableOpacity
                onPress={() => {
                  Analytics.logEvent('side_menu_press', {
                    button: 'UserBookings',
                    uid: user.uid,
                  });
                  navigation.navigate('UserBookings');
                }}
              >
                <Text style={styles.labelStyle}>Your Bookings</Text>
              </TouchableOpacity>
              <View style={{ paddingLeft: 15 }}>
                <MaterialCommunityIcons
                  name="calendar-edit"
                  size={24}
                  color={colors.hearted2}
                />
              </View>
            </View>

            <View style={styles.drawerItem}>
              <TouchableOpacity
                onPress={() => {
                  Analytics.logEvent('side_menu_press', {
                    button: 'SupportEmail',
                    uid: user.uid,
                  });
                  Linking.openURL(
                    'mailto:uros@oneclimb.app?subject=Send Feedback&body=Feedback'
                  );
                }}
              >
                <Text style={styles.labelStyle}>Give Us Feedback</Text>
              </TouchableOpacity>
              <View style={{ paddingLeft: 10, marginRight: -3 }}>
                <MaterialIcons
                  name="star-outline"
                  size={29}
                  color={colors.hearted2}
                />
              </View>
            </View>

            <View style={styles.drawerItem}>
              <TouchableOpacity
                onPress={() => {
                  Analytics.logEvent('side_menu_press', {
                    button: 'PrivacyPolicy',
                    uid: user.uid,
                  });
                  navigation.navigate('FAQ');
                }}
              >
                <Text style={styles.labelStyle}>Privacy Policy</Text>
              </TouchableOpacity>
              <View style={{ paddingLeft: 15 }}>
                <MaterialIcons
                  name="info-outline"
                  size={24}
                  color={colors.hearted2}
                />
              </View>
            </View>
            <View style={styles.drawerItem}>
              <TouchableOpacity
                onPress={() => {
                  Analytics.logEvent('side_menu_press', {
                    button: 'Home',
                    uid: user.uid,
                  });
                  setUser();
                  navigation.navigate('Home');
                  loggingOut();
                }}
              >
                <Text style={styles.labelStyle}>Sign Out</Text>
              </TouchableOpacity>
              <View style={{ paddingLeft: 15 }}>
                <FontAwesome
                  name="sign-out"
                  size={24}
                  color={colors.hearted2}
                />
              </View>
            </View>
          </View>
        </View>
      ) : null}
    </Screen>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    backgroundColor: colors.white,
  },
  userInfoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    padding: 20,
  },

  drawerItemBottom: {
    marginBottom: 500,
  },
  avatarImage: {
    width: 55,
    height: 55,
    borderRadius: 100,
  },
  userName: {
    textAlign: 'right',
    fontFamily: 'nunitoBold',
    fontSize: 22,
  },
  email: {
    textAlign: 'right',
    fontSize: 13,
    fontFamily: 'nunito',
  },
  line: {
    height: 1,
    width: '90%',
    backgroundColor: '#DADADA',
    alignSelf: 'center',
  },
  labelStyle: {
    fontFamily: 'nunitoBold',
    color: '#302B2D',
    textAlign: 'right',
    fontSize: 16,
  },
  drawerItem: {
    flexDirection: 'row',
    padding: 15,
    marginRight: 10,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
});

export default UserSettings;
