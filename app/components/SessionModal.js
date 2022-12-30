import {
  Alert,
  Dimensions,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useContext, useLayoutEffect, useState } from 'react';
import { Portal } from 'react-native-portalize';
import { Modalize } from 'react-native-modalize';
import {
  AntDesign,
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import colors from '../config/colors';
import { Avatar } from 'react-native-elements';
import {
  getFirestore,
  collection,
  query,
  getDocs,
  where,
  addDoc,
  setDoc,
  updateDoc,
  doc,
  increment,
  getDoc,
} from 'firebase/firestore';
import { useEffect } from 'react';
import { useRef } from 'react';
import ReportCoach from '../components/ReportCoach';

import AuthContext from '../auth/context';
import { useNavigation } from '@react-navigation/core';
import { useStore } from '../hooks/useStore';
import { GOOGLE_API_KEY } from '@env';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import moment from 'moment';
import { firebaseConfig } from '../config/Firebase/firebaseConfig';
import firebase from "firebase/compat/app";

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const SessionModal = ({
  modalRef,
  item,
  bookedSessions,
  allSessionsRef,
  scheduled,
  payRef,
  selectedTab,
}) => {
  const userData = useStore((state) => state.userData);
  const db = getFirestore(firebase.initializeApp(firebaseConfig));
  const [coachData, setCoachData] = useState({});
  const [showSignUp, setShowSignUp] = useState(true);

  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const reportCoachRef = useRef(null);

  const latitude = item.sessionLocation?.geometry?.location.lat;
  const longitude = item.sessionLocation?.geometry?.location.lng;

  const getCoachData = async () => {
    const q = query(
      collection(db, 'users'),
      where('userID', '==', item.trainerID)
    );
    const snapshot = await getDocs(q);
    snapshot.docs.map((doc) => setCoachData(doc.data()));
  };

  const checkBookedSessions = () => {
    bookedSessions?.map((session) => {
      if (session.sessionName === item.sessionName) {
        setShowSignUp(false);
      }
    });
  };

  useEffect(() => {
    checkBookedSessions();
  }, [bookedSessions, item.bookedSessions]);

  useEffect(() => {
    getCoachData();
  }, []);

  const createChat = async () => {
    const check = await checkChatAlreadyExists(coachData.email);
    if (check === false && coachData.email !== user.email) {
      await addDoc(collection(db, 'chats'), {
        users: [user.email, coachData.email],
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
      (chat) => chat.users.find((rec) => rec === coachData.email)?.length > 0
    );

    return check;
  };

  const cancelSession = async () => {
    if (userData.coachStatus !== 'approved') {
      const cancelationTime = item.freeCancelationBefore.slice(
        0,
        item.freeCancelationBefore.length - 1
      );
      const now = moment().subtract(cancelationTime, 'hours').format();
      const sessionDate = moment(item.sessionDateTime, 'MMMM Do YYYY, h:mm a')
        .add(2, 'hours')
        .toDate();
      if (moment(now).isAfter(sessionDate)) {
        Alert.alert(
          'Not possible',
          `Free cancelation possible up to ${item.freeCancelationBefore} before`,
          [{ text: 'Close', onPress: () => {} }]
        );
      } else {
        await cancelToDB().then(() => {
          Alert.alert('Canceled', `Session canceled `, [
            { text: 'Close', onPress: () => {} },
          ]);
        });
      }
    } else {
      //coach cancelation part if coach is canceling his session or his booking
      //coach booking:
      if (user.uid !== item.trainerID) {
        const cancelationTime = item.freeCancelationBefore.slice(
          0,
          item.freeCancelationBefore.length - 1
        );
        const now = moment().subtract(cancelationTime, 'hours').format();
        const sessionDate = moment(item.sessionDateTime, 'MMMM Do YYYY, h:mm a')
          .add(2, 'hours')
          .toDate();
        if (moment(now).isAfter(sessionDate)) {
          Alert.alert(
            'Not possible',
            `Free cancelation possible up to ${item.freeCancelationBefore} before`,
            [{ text: 'Close', onPress: () => {} }]
          );
        } else {
          await cancelToDB().then(() => {
            Alert.alert('Canceled', `Session canceled `, [
              { text: 'Close', onPress: () => {} },
            ]);
          });
        }
      } else {
        /// coach cancel hosted session
        await cancelToDBCoach().then(() => {
          Alert.alert('Canceled', `Session canceled `, [
            { text: 'Close', onPress: () => {} },
          ]);
        });
      }
    }
  };

  const cancelToDBCoach = async () => {
    const snapshotUpdateBookings = await updateDoc(
      doc(db, 'activeSessions', item.sessionID),
      {
        status: 'canceled',
      }
    )
      .then(() => {
        updateSessionsCollection();
      })
      .then(() => {
        getIDParticipants();
      });
  };

  const updateSessionsCollection = async () => {
    const q = query(
      collection(db, 'users', user.uid, 'sessions'),
      where('activeSessionID', '==', item.sessionID)
    );

    const res = await getDocs(q);
    res.forEach(async (element) => {
      await setDoc(
        doc(db, 'users', user.uid, 'sessions', element.id),
        {
          status: 'canceled',
        },
        { merge: true }
      ).catch((err) => console.log(err));
    });
  };

  const getIDParticipants = async () => {
    let participantsID = [];
    const q = query(
      collection(db, 'activeSessions', item.sessionID, 'participants')
    );
    await getDocs(q)
      .then((docs) => docs.forEach((doc) => participantsID.push(doc.data())))
      .then(() =>
        participantsID.map((part) =>
          getDoc(doc(db, 'users', part.userId)).then((document) =>
            sendSessionMail(document.data())
          )
        )
      );
  };

  const cancelToDB = async () => {
    const snapshotUpdateBookings = await updateDoc(
      doc(db, 'activeSessions', item.sessionID),
      {
        bookedSessions: increment(-1),
      }
    ).catch((err) => console.log(err));

    const q = query(
      collection(db, 'users', user.uid, 'userActiveSessions'),
      where('sessionID', '==', item.sessionID)
    );

    const snapshotUser = await getDocs(q)
      .then((docRef) => {
        docRef.forEach((element) => {
          const ref = doc(
            db,
            'users',
            user.uid,
            'userActiveSessions',
            element.id
          );
          updateDoc(ref, {
            status: 'canceled',
          });
        });
      })
      .catch((err) => console.log(err));
    sendEmail(item);
    sendTrainerEmail(item);
  };

  const sendTrainerEmail = async (item) => {
    await addDoc(collection(db, 'booked_sessions_mail'), {
      to: item.trainerEmail,
      message: {
        subject: `${user.displayName} has canceled ${item.sessionName}`,
        html: `<div><p>Hi ${item.trainerEmail},<br>
         User ${user.displayName} with email ${user.email} just canceled ${item.sessionName} session
         `,
      },
    }).catch((err) => console.log(err));
  };

  const sendSessionMail = async (document) => {
    await addDoc(collection(db, 'booked_sessions_mail'), {
      to: document.email,
      message: {
        subject: `${item.sessionName} canceled`,
        html: `<div><p>Hi ${coachData.displayName},<br>
        Session ${item.sessionName} is canceled
         `,
      },
    }).catch((err) => console.log(err));
  };

  const sendEmail = async (item) => {
    await addDoc(collection(db, 'booked_sessions_mail'), {
      to: user.email,
      message: {
        subject: `${item.sessionName} canceled`,
        html: `<div><p>Hi ${user.displayName},<br>
         You have canceled ${item.sessionName} session
         `,
      },
    }).catch((err) => console.log(err));
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
            <AntDesign name='close' size={26} color={colors.white} />
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
              size={96}
              source={{
                uri: coachData.photoURL,
              }}
            />
          </View>
        </View>
      </>
    );
  };

  const renderFooter = () => {
    return (
      <>
        {scheduled !== true ? (
          <View style={styles.footerConatiner}>
            <View>
              <Text
                style={[styles.titleSmall, { lineHeight: 18, marginTop: -5 }]}
              >
                From € {item.price}
              </Text>
              <Text style={{ marginTop: -10 }}>/ person</Text>
            </View>
            {item.maxNumberOfParticipants > item.bookedSessions ? (
              <TouchableOpacity
                onPress={() => {
                  payRef.current?.open();
                  //modalRef.current?.close();
                }}
                style={styles.button}
                disabled={!showSignUp}
              >
                {showSignUp ? (
                  <Text style={styles.buttonText}>Book now</Text>
                ) : (
                  <Text style={styles.buttonText}>Booked</Text>
                )}
              </TouchableOpacity>
            ) : (
              <Text
                style={[styles.buttonText, { color: colors.oneClimbOrange }]}
              >
                No free spots
              </Text>
            )}
          </View>
        ) : null}
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
          backgroundColor: "transparent",
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
        }}
        HeaderComponent={renderHeader}
        FooterComponent={renderFooter}
        closeSnapPointStraightEnabled={false}
        keyboardShouldPersistTaps="always"
        panGestureEnabled={false}
      >
        <View style={styles.containerScroll}>
          <Text style={styles.title}>{item.sessionName}</Text>
          <View style={styles.nameContainer}>
            <Text style={styles.coachName}>
              {coachData.displayName} {coachData.lastName}
            </Text>
          </View>
          {scheduled === true && selectedTab === 1 ? (
            <View style={styles.section}>
              <Text style={styles.titleSmall}>Status</Text>
              <Text style={styles.locationName}>
                Number of climbers {item.bookedSessions} (
                {item.minNumberOfParticipants} - {item.maxNumberOfParticipants})
              </Text>
            </View>
          ) : null}
          <View style={styles.section}>
            <Text style={styles.titleSmall}>General Info</Text>
            <Text style={styles.locationName}>
              This session takes place at{" "}
              <Text
                style={[
                  styles.locationName,
                  { color: colors.darkGray, textDecorationLine: "underline" },
                ]}
              >
                {item.sessionLocation?.name}
              </Text>
            </Text>
            <Text style={[styles.locationName, { marginVertical: 10 }]}>
              {item.sessionLength} · Hosted in {item.sessionLanguage}
            </Text>
          </View>
          {/* 
          <View style={styles.section}>
            <Text style={styles.titleSmall}>Recommended climbing level</Text>
            <View style={styles.subSection}>
              <MaterialCommunityIcons
                name='medal-outline'
                size={18}
                color={colors.oneClimbOrange}
              />
              <Text style={styles.itemText}>{item.climbingLevel}</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.climbingLevelsText}>
                Climbing levels explained
              </Text>
            </TouchableOpacity>
          </View> */}
          <View style={styles.section}>
            <Text style={styles.titleSmall}>What you’ll climb</Text>
            <Text style={styles.description}>{item.sessionNotes}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.titleSmall}>What do you need to bring</Text>
            {item.equipment?.shoes ? (
              <View style={styles.subSection}>
                {/* <MaterialCommunityIcons
                  name='medal-outline'
                  size={18}
                  color={colors.oneClimbOrange}
                /> */}
                <Image
                  style={styles.equipmentIcon}
                  source={require("../assets/shoes.png")}
                />
                <Text style={styles.itemText}>Climbing shoes</Text>
              </View>
            ) : null}
            {item.equipment?.chalk ? (
              <View style={styles.subSection}>
                {/* <MaterialCommunityIcons
                  name="medal-outline"
                  size={18}
                  color={colors.oneClimbOrange}
                /> */}
                <Image
                  style={styles.equipmentIcon}
                  source={require("../assets/chalk.png")}
                />
                <Text style={styles.itemText}>Chalk bag</Text>
              </View>
            ) : null}
            {item.equipment?.harness ? (
              <View style={styles.subSection}>
                {/* <MaterialCommunityIcons
                  name="medal-outline"
                  size={18}
                  color={colors.oneClimbOrange}
                /> */}
                <Image
                  style={styles.equipmentIcon}
                  source={require("../assets/harness.png")}
                />
                <Text style={styles.itemText}>Climbing harness</Text>
              </View>
            ) : null}
            {item.equipment?.rope ? (
              <View style={styles.subSection}>
                {/* <MaterialCommunityIcons
                  name="medal-outline"
                  size={18}
                  color={colors.oneClimbOrange}
                /> */}
                <Image
                  style={styles.equipmentIcon}
                  source={require("../assets/rope.png")}
                />
                <Text style={styles.itemText}>Climbing rope</Text>
              </View>
            ) : null}
            {item.equipment?.pad ? (
              <View style={styles.subSection}>
                {/* <MaterialCommunityIcons
                  name="medal-outline"
                  size={18}
                  color={colors.oneClimbOrange}
                /> */}
                <Image
                  style={styles.equipmentIcon}
                  source={require("../assets/pad.png")}
                />
                <Text style={styles.itemText}>Crash pad</Text>
              </View>
            ) : null}
            {item.equipment?.other?.length > 3 ? (
              <View style={styles.subSection}>
                <MaterialCommunityIcons
                  name="medal-outline"
                  size={18}
                  color={colors.oneClimbOrange}
                />
                {/* <Image
                  style={styles.equipmentIcon}
                  source={require("../assets/shoes.png")}
                /> */}
                <Text style={styles.itemText}>{item.equipment.other}</Text>
              </View>
            ) : null}
          </View>
          <View style={styles.section}>
            <Text style={styles.titleSmall}>
              Meet your coach {coachData.displayName}
            </Text>
            <View style={styles.subSection}>
              <MaterialCommunityIcons
                name="medal-outline"
                size={18}
                color={colors.oneClimbOrange}
              />
              <Text style={styles.itemText}>Coach on OneClimb since 2021</Text>
            </View>
            <View style={styles.subSection}>
              <MaterialIcons
                name="verified-user"
                size={18}
                color={colors.oneClimbOrange}
              />
              <Text style={styles.itemText}>Identity verified</Text>
            </View>
            <View style={styles.subSection}>
              <MaterialCommunityIcons
                name="medal-outline"
                size={18}
                color={colors.oneClimbOrange}
              />
              <Text style={styles.itemText}>Licensed</Text>
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.titleSmall}>
              Session ticket included in price:
            </Text>
            <Text
              style={[
                styles.itemText,
                { fontFamily: "nunitoBold", fontSize: 16, lineHeight: 18 },
              ]}
            >
              {item.gymTicketIncluded}
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.titleSmall}>Session place</Text>
            <Text style={[styles.itemText, { color: colors.darkGray }]}>
              {item.sessionLocation?.name}
            </Text>
            <Text style={styles.itemText}>{item.sessionLocation?.address}</Text>
            <View style={styles.mapContainer}>
              <MapView
                ref={(ref) => {
                  mapRef.current = ref;
                }}
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                zoomEnabled={true}
                showsMyLocationButton={false}
                region={{
                  latitude: latitude,
                  longitude: longitude,
                  latitudeDelta: 0.05,
                  longitudeDelta: 0.05,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: latitude,
                    longitude: longitude,
                  }}
                />
              </MapView>
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.titleSmall}>Session date</Text>
            <Text style={styles.itemText}>{item.sessionDateTime}</Text>
          </View>
          {scheduled === true ? (
            <View style={styles.section}>
              <Text style={styles.titleSmall}>Payment info</Text>
              <View
                style={[
                  styles.subSection,
                  { justifyContent: "space-between", marginVertical: -5 },
                ]}
              >
                <Text style={[styles.titleSmall, { color: colors.darkGray }]}>
                  Price:
                </Text>
                <Text style={[styles.titleSmall, { color: colors.darkGray }]}>
                  €{item.price}
                </Text>
              </View>
            </View>
          ) : null}
          <View style={styles.section}>
            <Text style={styles.titleSmall}>Cancellation policy</Text>
            <Text style={styles.itemText}>
              Free cancelation up to {item.freeCancelationBefore} before the
              start time.
            </Text>

            {scheduled === true ? (
              <TouchableOpacity
                onPress={() => cancelSession()}
                disabled={item.status === "canceled"}
              >
                {item.status === "canceled" ? (
                  <Text
                    style={[
                      styles.cancelText,
                      { color: colors.oneClimbOrange },
                    ]}
                  >
                    Session canceled
                  </Text>
                ) : (
                  <Text style={styles.cancelText}>Cancel session</Text>
                )}
              </TouchableOpacity>
            ) : null}
          </View>
          {item.trainerID !== user.uid ? (
            <View style={styles.section}>
              <Text style={styles.titleSmall}>Contact coach</Text>
              <View style={[styles.subSection]}>
                <TouchableOpacity
                  style={{
                    marginHorizontal: 15,
                    marginVertical: 10,
                  }}
                  onPress={() => {
                    Linking.openURL(
                      `mailto:${coachData.email}?subject=New booking&body=New booking`
                    );
                  }}
                >
                  <MaterialCommunityIcons
                    name="email-edit-outline"
                    size={24}
                    color={colors.oneClimbOrange}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    marginHorizontal: 30,
                  }}
                  onPress={() => {
                    createChat();
                    navigation.navigate("Chats");
                    allSessionsRef.current?.close();
                    modalRef.current?.close();
                  }}
                >
                  <Feather
                    name="message-square"
                    size={24}
                    color={colors.oneClimbOrange}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ) : null}

          <View style={[styles.section, { marginBottom: 50 }]}>
            <TouchableOpacity
              style={styles.report}
              onPress={() => {
                reportCoachRef.current?.open();
              }}
            >
              <Feather name="flag" size={14} color={colors.darkGray} />
              <Text style={styles.textReport}>Report this profile</Text>
            </TouchableOpacity>
          </View>
        </View>
        <ReportCoach modalRef={reportCoachRef} item={coachData} />
      </Modalize>
    </Portal>
  );
};

export default SessionModal;

const styles = StyleSheet.create({
  closeButton: {
    marginTop: 40,
    marginLeft: 24,
    width: 30,
    elevation: 999,
  },
  headerContainer: {
    backgroundColor: colors.oneClimbOrange,
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
    flexDirection: "row",
    alignItems: "center",
    marginTop: -50,
  },
  containerScroll: {
    marginHorizontal: 25,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontFamily: "poppinsSemiBold",
    fontSize: 20,
    lineHeight: 30,
    color: colors.darkBlue,
    marginBottom: 34,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  coachName: {
    fontFamily: "nunitoBold",
    fontSize: 16,
    lineHeight: 22,
    color: colors.darkGray,
    textDecorationLine: "underline",
    marginBottom: 18,
  },
  locationName: {
    fontFamily: "nunitoBold",
    fontSize: 14,
    lineHeight: 22,
    color: "#787878",
  },
  section: {
    borderTopColor: colors.lightGray,
    borderTopWidth: 1,
    marginTop: 15,
  },
  titleSmall: {
    fontFamily: "poppinsSemiBold",
    fontSize: 16,
    lineHeight: 24,
    color: colors.darkBlue,
    marginTop: 20,
    marginBottom: 10,
  },
  subSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemText: {
    fontFamily: "nunito",
    fontSize: 13,
    lineHeight: 14,
    color: "#787878",
    marginVertical: 15,
    marginLeft: 14,
  },
  climbingLevelsText: {
    fontFamily: "poppinsSemiBold",
    fontSize: 14,
    lineHeight: 21,
    color: colors.darkGray,
    textDecorationLine: "underline",
  },
  description: {
    fontFamily: "nunito",
    fontSize: 13,
    lineHeight: 14,
    color: "#787878",
    marginVertical: 15,
  },
  report: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
  },
  textReport: {
    fontFamily: "poppinsSemiBold",
    fontSize: 16,
    lineHeight: 24,
    color: colors.darkGray,
    textDecorationLine: "underline",
    marginLeft: 7,
  },
  footerConatiner: {
    height: 110,
    width: "100%",
    backgroundColor: colors.oneClimbBeige,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 25,
  },
  button: {
    height: 50,
    width: 180,
    borderRadius: 42,
    backgroundColor: colors.oneClimbOrange,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontFamily: "poppinsSemiBold",
    fontSize: 18,
    lineHeight: 27,
  },
  mapContainer: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  map: {
    width: "100%",
    height: 325,
  },
  cancelText: {
    fontFamily: "nunitoBold",
    fontSize: 14,
    lineHeight: 22,
    color: colors.darkGray,
    textDecorationLine: "underline",
    marginVertical: 10,
  },
  equipmentIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
});
