import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useContext, useState } from 'react';
import { Portal } from 'react-native-portalize';
import { Modalize } from 'react-native-modalize';
import {
  AntDesign,
  Entypo,
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  SimpleLineIcons,
} from '@expo/vector-icons';
import colors from '../config/colors';
import { Avatar } from 'react-native-elements';
import {
  getFirestore,
  collection,
  query,
  onSnapshot,
  getDocs,
  where,
  addDoc,
} from 'firebase/firestore';
import SessionCard from './SessionCard';
import { useLayoutEffect } from 'react';
import AllSessions from './AllSessions';
import { useRef } from 'react';
import AuthContext from '../auth/context';
import { useNavigation } from '@react-navigation/core';
import firebase from "firebase/compat/app";
import { firebaseConfig } from '../config/Firebase/firebaseConfig';

const windowHeight = Dimensions.get('window').height;

const CoachProfile = ({ modalRef, item, reportCoachRef }) => {
  const db = getFirestore(firebase.initializeApp(firebaseConfig));
  const [sessions, setSessions] = useState([]);
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const allSessionsRef = useRef(null);

  const loadSessions = async () => {
    const q = query(
      collection(db, 'activeSessions'),
      where('trainerID', '==', item.userID)
    );
    onSnapshot(q, (snapshot) =>
      setSessions(snapshot.docs.map((doc) => doc.data()))
    );
  };

  useLayoutEffect(() => {
    loadSessions();
  }, []);

  const createChat = async () => {
    const check = await checkChatAlreadyExists(item.email);
    if (check === false && item.email !== user.email) {
      await addDoc(collection(db, 'chats'), {
        users: [user.email, item.email],
      });
    }
  };

  const checkChatAlreadyExists = async () => {
    const q = query(
      collection(db, 'chats'),
      where('users', 'array-contains', user.email)
    );
    const snapshot = await getDocs(q);

    const data = [];
    snapshot.docs.forEach((doc) => data.push(doc.data()));

    const check = !!data.find(
      (chat) => chat.users.find((rec) => rec === item.email)?.length > 0
    );

    return check;
  };

  const renderHeader = () => {
    return (
      <>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              modalRef.current?.close();
            }}
          >
            <Entypo name='chevron-left' size={26} color={colors.white} />
          </TouchableOpacity>
        </View>

        <View style={[styles.container, { marginBottom: 10 }]}>
          <View style={styles.avatarBox}>
            <Avatar
              rounded
              avatarStyle={{ borderWidth: 4, borderColor: colors.white }}
              icon={{ name: 'user', type: 'font-awesome' }}
              placeholderStyle={{
                backgroundColor: colors.hearted2,
                opacity: 0.5,
              }}
              size={100}
              source={{
                uri: item.photoURL,
              }}
            />
            <View style={{ marginLeft: 8 }}>
              <Text style={styles.hi}>Hi, I'm {item.displayName}</Text>
              <View>
                <Text style={styles.experienceText}>
                  Super experienced coach
                </Text>
                <Text style={styles.since}>OneClimber since 2022</Text>
              </View>
            </View>
          </View>
        </View>
      </>
    );
  };

  return (
    <Portal>
      <Modalize
        ref={modalRef}
        modalHeight={windowHeight}
        handleStyle={{
          height: 5,
          width: 150,
          backgroundColor: '#DEDEDE',
          zIndex: 999,
        }}
        handlePosition={'inside'}
        overlayStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.25)' }}
        modalStyle={{
          shadowOpacity: 0.25,
          shadowOffset: { width: 0, height: -5 },
        }}
        scrollViewProps={{
          bounces: false,
        }}
        closeSnapPointStraightEnabled={false}
        keyboardShouldPersistTaps='always'
        panGestureEnabled={false}
        HeaderComponent={renderHeader}
      >
        <View style={styles.container}>
          <View style={{ marginLeft: 9 }}>
            <View style={[styles.subSection, { marginTop: 20 }]}>
              <AntDesign name='star' size={18} color={colors.oneClimbOrange} />
              <Text style={[styles.rating, { color: colors.darkGray }]}>
                4.5{' '}
                <Text style={[styles.rating, { color: colors.oneClimbOrange }]}>
                  (96 reviews)
                </Text>
              </Text>
            </View>
            <View style={styles.subSection}>
              <MaterialCommunityIcons
                name='check-underline'
                size={18}
                color={colors.oneClimbOrange}
              />
              <Text style={styles.rating}>100+ completed sessions</Text>
            </View>

            <View style={styles.subSection}>
              <MaterialIcons
                name='verified-user'
                size={18}
                color={colors.oneClimbOrange}
              />
              <Text style={styles.rating}>Identity verified</Text>
            </View>
            <View style={styles.subSection}>
              <MaterialCommunityIcons
                name='license'
                size={18}
                color={colors.oneClimbOrange}
              />
              <Text style={styles.rating}>Licensed</Text>
            </View>
            {/* <Text style={styles.title}>Badges</Text>
            <View style={styles.subSection}>
              <MaterialCommunityIcons
                name='medal-outline'
                size={18}
                color={colors.oneClimbOrange}
              />
              <Text style={styles.rating}>Ex-competitor</Text>
            </View>
            <View style={styles.subSection}>
              <MaterialCommunityIcons
                name='medal-outline'
                size={18}
                color={colors.oneClimbOrange}
              />
              <Text style={styles.rating}>Ex-World Cup competitor</Text>
            </View>
            <View style={styles.subSection}>
              <MaterialCommunityIcons
                name='medal-outline'
                size={18}
                color={colors.oneClimbOrange}
              />
              <Text style={styles.rating}>8c+ outdoor route</Text>
            </View>
            <View style={styles.subSection}>
              <MaterialCommunityIcons
                name='medal-outline'
                size={18}
                color={colors.oneClimbOrange}
              />
              <Text style={styles.rating}>8A+ outdoor boulder</Text>
            </View>
            <View style={styles.subSection}>
              <MaterialCommunityIcons
                name='medal-outline'
                size={18}
                color={colors.oneClimbOrange}
              />
              <Text style={styles.rating}>Exceptional technical skills</Text>
            </View>
            <Text style={styles.title}>Levels</Text>
            <View style={styles.subSection}>
              <MaterialCommunityIcons
                name='medal-outline'
                size={18}
                color={colors.oneClimbOrange}
              />
              <Text style={styles.rating}>Beginner</Text>
            </View>
            <View style={styles.subSection}>
              <MaterialCommunityIcons
                name='medal-outline'
                size={18}
                color={colors.oneClimbOrange}
              />
              <Text style={styles.rating}>Intermediate</Text>
            </View>
            <View style={styles.subSection}>
              <MaterialCommunityIcons
                name='medal-outline'
                size={18}
                color={colors.oneClimbOrange}
              />
              <Text style={styles.rating}>8c+ outdoor route</Text>
            </View>
            <View style={styles.subSection}>
              <MaterialCommunityIcons
                name='medal-outline'
                size={18}
                color={colors.oneClimbOrange}
              />
              <Text style={styles.rating}>Advanced</Text>
            </View>
            <View style={styles.subSection}>
              <MaterialCommunityIcons
                name='medal-outline'
                size={18}
                color={colors.oneClimbOrange}
              />
              <Text style={styles.rating}>National competition</Text>
            </View>
            <View style={styles.subSection}>
              <MaterialCommunityIcons
                name='medal-outline'
                size={18}
                color={colors.oneClimbOrange}
              />
              <Text style={styles.rating}>International competition</Text>
            </View> */}
            <Text style={styles.title}>About {item.displayName}</Text>
            <View style={styles.subSection}>
              <SimpleLineIcons
                name='location-pin'
                size={18}
                color={colors.oneClimbOrange}
              />
              <Text style={styles.rating}>
                Lives in {item.location?.vicinity}
              </Text>
            </View>
            <View style={styles.subSection}>
              <Ionicons
                name='md-globe-outline'
                size={18}
                color={colors.oneClimbOrange}
              />
              <Text style={styles.rating}>Speaks {item.languages}</Text>
            </View>
            <Text style={[styles.title, { fontSize: 16, marginTop: 36 }]}>
              {item.displayName}'s sessions
            </Text>
            <View style={{ flexDirection: 'row' }}>
              {sessions.slice(0, 2).map((session, index) => (
                <SessionCard key={index} item={session} />
              ))}
            </View>
            <TouchableOpacity onPress={() => allSessionsRef.current?.open()}>
              <Text style={[styles.seeAll]}>See all upcoming sessions</Text>
            </TouchableOpacity>
            <View
              style={{
                borderColor: colors.lightGray,
                borderTopWidth: 1,
              }}
            >
              <TouchableOpacity
                style={styles.report}
                onPress={() => {
                  reportCoachRef.current?.open();
                  modalRef.current?.close();
                }}
              >
                <Feather name='flag' size={14} color={colors.darkGray} />
                <Text style={styles.textReport}>Report this profile</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                createChat();
                navigation.navigate('Chats');
                modalRef.current?.close();
              }}
            >
              <Text style={styles.buttonText}>Contact Coach</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modalize>
      <AllSessions modalRef={allSessionsRef} sessions={sessions} />
    </Portal>
  );
};

export default CoachProfile;

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: colors.hearted2,
    height: windowHeight * 0.18,
    borderBottomLeftRadius: 30,
  },
  closeButton: {
    marginTop: 40,
    marginLeft: 20,
    width: 30,
  },
  container: {
    marginHorizontal: 16,
  },
  avatarBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -50,
  },
  hi: {
    fontFamily: 'poppinsSemiBold',
    fontSize: 28,
    lineHeight: 42,
    color: colors.oneClimbBeige,
    paddingBottom: 10,
  },
  experienceText: {
    fontFamily: 'nunitoBold',
    fontSize: 16,
    lineHeight: 22,
    color: colors.darkGray,
    marginTop: 10,
  },
  since: {
    fontFamily: 'nunitoBold',
    fontSize: 13,
    lineHeight: 18,
    color: '#787878',
  },
  subSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  rating: {
    marginLeft: 9,
    fontFamily: 'nunitoBold',
    fontSize: 13,
    lineHeight: 17,
    color: '#7C7C7C',
  },
  title: {
    fontFamily: 'poppinsSemiBold',
    fontSize: 14,
    lineHeight: 24,
    color: colors.darkBlue,
    marginTop: 20,
    marginBottom: 10,
  },
  seeAll: {
    fontFamily: 'poppinsSemiBold',
    fontSize: 22,
    lineHeight: 33,
    color: colors.darkBlue,
    marginTop: 20,
    marginBottom: 35,
    textDecorationLine: 'underline',
  },
  report: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
  },
  textReport: {
    fontFamily: 'poppinsSemiBold',
    fontSize: 16,
    lineHeight: 24,
    color: colors.darkGray,
    textDecorationLine: 'underline',
    marginLeft: 7,
  },
  button: {
    height: 50,
    width: 180,
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
});
