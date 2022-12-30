import {
  Dimensions,
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useLayoutEffect, useRef } from "react";
import Screen from "../components/Screen";
import colors from "../config/colors";
import { useState } from "react";
import {
  getFirestore,
  collection,
  query,
  getDocs,
  where,
  setDoc,
  doc,
  addDoc,
  onSnapshot,
} from "firebase/firestore";
import { useContext } from "react";
import AuthContext from "../auth/context";
import { useNavigation } from "@react-navigation/core";
import SessionTemplateCard from "../components/SessionTemplateCard";
import { useStore } from "../hooks/useStore";
import SessionScheduledCard from "../components/SessionScheduledCard";
import { firebaseConfig } from "../config/Firebase/firebaseConfig";
import firebase from "firebase/compat/app";

const windowHeight = Dimensions.get("window").height;

const SessionsScreen = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const userData = useStore((state) => state.userData);
  const navigation = useNavigation();
  const db = getFirestore(firebase.initializeApp(firebaseConfig));
  const { user } = useContext(AuthContext);
  const [templates, setTemplates] = useState([]);
  const [bookedSessions, setBookedSessions] = useState([]);
  const [hostedSessions, setHostedSessions] = useState([]);
  const [coachBookedSessions, setCoachBookedSessions] = useState([]);
  const coachApproved = userData.coachStatus;

  const getTemplates = async () => {
    let array = [];
    const q = query(collection(db, "users", user.uid, "session_templates"));
    onSnapshot(q, (snapshot) =>
      setTemplates(snapshot.docs.map((doc) => doc.data()))
    );
  };

  const loadBookedSessions = () => {
    const q = query(collection(db, "users", user.uid, "userActiveSessions"));
    onSnapshot(q, (snapshot) => {
      setBookedSessions(snapshot.docs.map((doc) => doc.data()));
    });
  };
  const loadHostedSessions = () => {
    const q = query(collection(db, "users", user.uid, "sessions"));
    onSnapshot(q, (snapshot) => {
      setHostedSessions(snapshot.docs.map((doc) => doc.data()));
    });
  };

  const loadCoachBookedSessions = async () => {
    const q = query(
      collection(db, "activeSessions"),
      where("trainerID", "==", user.uid)
    );
    onSnapshot(q, (snapshot) =>
      setCoachBookedSessions(snapshot.docs.map((doc) => doc.data()))
    );
  };

  useEffect(() => {
    getTemplates();
  }, []);

  useLayoutEffect(() => {
    loadBookedSessions();
    loadHostedSessions();
    if (userData.coachStatus === "approved") {
      loadCoachBookedSessions();
    }
  }, []);

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity style={{ marginVertical: 25 }} activeOpacity={0.7}>
        <SessionTemplateCard bookedSessions={bookedSessions} item={item} />
      </TouchableOpacity>
    );
  };
  const renderScheduledItem = ({ item }) => {
    return (
      <TouchableOpacity style={{ marginVertical: 25 }} activeOpacity={0.7}>
        <SessionScheduledCard
          hostedSessions={hostedSessions}
          item={item}
          selectedTab={selectedTab}
        />
      </TouchableOpacity>
    );
  };

  return (
    <Screen style={{ backgroundColor: "#FFFFFF" }}>
      <View
        style={
          Platform.OS === "ios"
            ? styles.header
            : [styles.header, { marginTop: 0 }]
        }
      >
        <Text style={styles.headerTitle}>Sessions</Text>
      </View>
      <View style={styles.buttonsBox}>
        <TouchableOpacity
          activeOpacity={0.98}
          onPress={() => {
            setSelectedTab(0);
          }}
        >
          <Text
            style={
              selectedTab === 0
                ? [styles.buttonText, { fontFamily: "nunitoBold" }]
                : styles.buttonText
            }
          >
            Climber
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.98}
          onPress={() => {
            setSelectedTab(1);
          }}
        >
          <Text
            style={
              selectedTab === 1
                ? [styles.buttonText, { fontFamily: "nunitoBold" }]
                : styles.buttonText
            }
          >
            Coach
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {selectedTab === 1 ? (
          coachApproved === "approved" ? (
            <>
              {hostedSessions.length === 0 ? (
                <View
                  style={{
                    marginHorizontal: 22,
                    marginTop: -30,
                  }}
                >
                  <View style={styles.noSessionBox}>
                    <Text style={[styles.title, { color: colors.darkGray }]}>
                      No sessions hosted ... yet!
                    </Text>
                    <Text style={styles.noSessionText}>
                      Time to share your climbing knowledge!
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={[styles.container, { marginTop: 0 }]}>
                  <Text style={styles.title}>Scheduled next</Text>
                  <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    data={coachBookedSessions}
                    bounces={false}
                    scrollEventThrottle={16}
                    keyExtractor={(_, index) => String(index)}
                    renderItem={renderScheduledItem}
                    style={{ marginBottom: 10 }}
                    refreshing={false}
                  />
                </View>
              )}
              <View style={[styles.container, { marginTop: 5 }]}>
                <Text style={styles.title}>Session templates</Text>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  data={templates}
                  bounces={false}
                  scrollEventThrottle={16}
                  keyExtractor={(_, index) => String(index)}
                  renderItem={renderItem}
                  style={{ marginBottom: 30 }}
                  refreshing={false}
                />
                <TouchableOpacity
                  onPress={() => navigation.navigate("HostASession")}
                >
                  <Text style={styles.addNewText}>
                    Add new Session template
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <TouchableOpacity onPress={() => navigation.navigate("Account")}>
              <Text style={[styles.addNewText, { marginLeft: 22 }]}>
                Become a coach
              </Text>
            </TouchableOpacity>
          )
        ) : (
          <View
            style={
              bookedSessions.length === 0
                ? [styles.container, { marginHorizontal: 22 }]
                : [styles.container, { marginLeft: 22 }]
            }
          >
            <Text style={styles.title}>Booked sessions</Text>
            {bookedSessions.length === 0 ? (
              <View style={styles.noSessionBox}>
                <Text style={[styles.title, { color: colors.darkGray }]}>
                  No sessions booked ... yet!
                </Text>
                <Text style={styles.noSessionText}>
                  Time to dust off your climbing shoes and chalk up for your
                  next climbing session.
                </Text>
              </View>
            ) : (
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                data={bookedSessions}
                bounces={false}
                scrollEventThrottle={16}
                keyExtractor={(_, index) => String(index)}
                renderItem={renderScheduledItem}
                style={{ marginBottom: 30 }}
                refreshing={false}
              />
            )}
            <TouchableOpacity onPress={() => navigation.navigate("Main")}>
              <Text style={styles.addNewText}>Book your climbing session</Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={{ height: 30 }} />
      </ScrollView>
    </Screen>
  );
};

export default SessionsScreen;

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.oneClimbOrange,
    width: "100%",
    height: windowHeight * 0.15,
    marginTop: -windowHeight * 0.08,
    justifyContent: "flex-end",
    borderBottomLeftRadius: 30,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontFamily: "poppinsSemiBold",
    fontSize: 22,
    lineHeight: 33,
    marginBottom: 10,
    marginLeft: 40,
  },
  container: {
    marginLeft: 22,
    marginTop: 30,
  },
  buttonsBox: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 30,
    marginHorizontal: 22,
  },
  buttonText: {
    fontFamily: "nunito",
    fontSize: 16,
    lineHeight: 22,
    color: colors.darkGray,
    textDecorationLine: "underline",
    marginRight: 50,
  },

  title: {
    fontFamily: "poppinsSemiBold",
    fontSize: 16,
    lineHeight: 24,
    color: colors.darkBlue,
    marginBottom: -10,
  },
  addNewText: {
    fontFamily: "poppinsSemiBold",
    fontSize: 16,
    lineHeight: 24,
    textDecorationLine: "underline",
    color: colors.darkGray,
  },
  noSessionBox: {
    height: 100,
    width: "100%",
    backgroundColor: colors.oneClimbBeige,
    borderRadius: 10,
    marginVertical: 30,
    padding: 11,
  },
  noSessionText: {
    fontFamily: "nunito",
    fontSize: 14,
    lineHeight: 19,
    color: colors.darkGray,
    marginTop: 20,
  },
});
