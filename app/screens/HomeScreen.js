import React, { useLayoutEffect } from "react";
import { useState } from "react";
import { FlatList, ScrollView, Text, TouchableOpacity } from "react-native";
import { StyleSheet, View } from "react-native";

import AppText from "../components/AppText";
import CoachCard from "../components/CoachCard";
import Screen from "../components/Screen";
import colors from "../config/colors";
import {
  getFirestore,
  collection,
  query,
  onSnapshot,
  doc,
  getDocs,
  where,
} from "firebase/firestore";
import { useEffect } from "react";
import SessionCard from "../components/SessionCard";
import AllCoaches from "./AllCoaches";
import { useRef } from "react";
import AllSessions from "../components/AllSessions";
import { Image } from "react-native";
import { useContext } from "react";
import AuthContext from "../auth/context";
import { firebaseConfig } from "../config/Firebase/firebaseConfig";
import firebase from "firebase/compat/app";

function HomeScreen(props) {
  const db = getFirestore(firebase.initializeApp(firebaseConfig));
  const [coaches, setCoaches] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [updateSessions, setUpdateSessions] = useState([]);
  const [bookedSessions, setBookedSessions] = useState([]);
  const { user } = useContext(AuthContext);

  const allCoachesRef = useRef(null);
  const allSessionsRef = useRef(null);

  const getCoaches = async () => {
    const q = query(
      collection(db, "users"),
      where("coachStatus", "==", "approved")
    );
    let docs = [];

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      docs.push(doc.data());
    });
    setCoaches(docs);
  };

  const loadAllSessions = async () => {
    const q = query(collection(db, "activeSessions"));
    onSnapshot(q, (snapshot) =>
      setSessions(snapshot.docs.map((doc) => doc.data()))
    );

    setUpdateSessions(sessions);
  };

  const loadBookedSessions = () => {
    const q = query(collection(db, "users", user.uid, "userActiveSessions"));
    onSnapshot(q, (snapshot) => {
      setBookedSessions(snapshot.docs.map((doc) => doc.data()));
    });
  };

  useEffect(() => {
    getCoaches();
    loadAllSessions();
  }, []);
  useLayoutEffect(() => {
    loadBookedSessions();
  }, []);

  return (
    <Screen style={{ backgroundColor: "#FFFFFF" }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Our most visited sessions</Text>
        <TouchableOpacity onPress={() => allSessionsRef.current?.open()}>
          <Text style={styles.seeAll}>See all sessions</Text>
        </TouchableOpacity>

        <View style={{ flexDirection: "row" }}>
          {sessions.slice(0, 2).map((item, index) => (
            <SessionCard
              key={index}
              item={item}
              bookedSessions={bookedSessions}
            />
          ))}
        </View>
        <Text style={[styles.title, { marginTop: 33 }]}>
          Best rated coaches
        </Text>
        <TouchableOpacity onPress={() => allCoachesRef.current?.open()}>
          <Text style={styles.seeAll}>See all coaches</Text>
        </TouchableOpacity>

        <View style={{ flexDirection: "row" }}>
          {coaches.slice(0, 2).map((item, index) => (
            <CoachCard key={index} item={item} />
          ))}
        </View>
        <Text style={[styles.title, { marginTop: 33 }]}>Top tips</Text>
        <TouchableOpacity>
          <Image
            style={styles.imageTips}
            source={require("../assets/topTipsPhoto.png")}
          />
          <Text style={styles.tipText}>
            How to train for the upcoming rock climbing season
          </Text>
        </TouchableOpacity>
      </ScrollView>
      <AllCoaches modalRef={allCoachesRef} coaches={coaches} />
      <AllSessions
        modalRef={allSessionsRef}
        sessions={sessions}
        bookedSessions={bookedSessions}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 23,
    marginTop: 40,
  },
  title: {
    fontFamily: "poppinsSemiBold",
    fontSize: 16,
    lineHeight: 24,
    color: colors.darkBlue,
    marginBottom: 10,
  },
  seeAll: {
    fontFamily: "poppinsSemiBold",
    fontSize: 14,
    lineHeight: 21,
    color: colors.darkGray,
    textDecorationLine: "underline",
    marginBottom: 15,
  },
  imageTips: {
    resizeMode: "cover",
    height: 160,
    width: "100%",
    borderRadius: 16,
  },
  tipText: {
    fontFamily: "nunitoBold",
    fontSize: 12,
    lineHeight: 14,
    color: colors.darkGray,
    marginTop: 8,
    marginBottom: 20,
  },
});

export default HomeScreen;
