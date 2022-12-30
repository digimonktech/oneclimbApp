import { StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import Screen from "../components/Screen";
import ChatList from "../components/ChatList";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import AuthContext from "../auth/context";
import Chat from "../components/Chat";
import colors from "../config/colors";
import { firebaseConfig } from "../config/Firebase/firebaseConfig";
import firebase from "firebase/compat/app";

const ChatScreen = () => {
  const db = getFirestore(firebase.initializeApp(firebaseConfig));
  const { user } = useContext(AuthContext);
  const [chatList, setChatlist] = useState([]);

  const getChats = async () => {
    const q = query(
      collection(db, "chats"),
      where("users", "array-contains", user.email)
    );

    onSnapshot(q, (snapshot) =>
      setChatlist(
        snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
      )
    );
  };

  useEffect(() => {
    getChats();
  }, []);

  return (
    <Screen style={{ backgroundColor: "#FFFFFF" }}>
      <Text style={styles.title}>Chat</Text>
      {chatList?.map((chat) => (
        <Chat key={chat.id} id={chat.id} users={chat.data.users} />
      ))}
    </Screen>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  title: {
    fontFamily: "poppinsSemiBold",
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "700",
    marginTop: 30,
    alignSelf: "center",
    color: colors.darkBlue,
  },
});
