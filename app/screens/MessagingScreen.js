import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import Screen from '../components/Screen';
import { Entypo } from '@expo/vector-icons';
import colors from '../config/colors';
import {
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { useState } from 'react';
import { useEffect } from 'react';
import { useContext } from 'react';
import AuthContext from '../auth/context';
import Message from '../components/Message';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../hooks/useStore';
import { useRef } from 'react';
import { firebaseConfig } from '../config/Firebase/firebaseConfig';
import firebase from "firebase/compat/app";

const windowHeight = Dimensions.get('window').height;

const MessagingScreen = ({ navigation, route }) => {
  const db = getFirestore(firebase.initializeApp(firebaseConfig));
  const { user } = useContext(AuthContext);
  const userData = useStore((state) => state.userData);
  const recipientData = route.params.recipientData;
  const recipientName = route.params.recipientData.handle;
  const chatId = route.params.id;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const chatQuery = query(
    collection(db, 'chats', chatId, 'messages'),
    orderBy('timestamp', 'asc')
  );

  const scrollViewRef = useRef();

  const getMessages = () => {
    onSnapshot(chatQuery, (snapshot) => {
      setMessages(
        snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
      );
    });
  };
  useEffect(() => {
    getMessages();
  }, []);

  const sendMessage = async () => {
    Keyboard.dismiss();
    await addDoc(collection(db, 'chats', chatId, 'messages'), {
      timestamp: serverTimestamp(),
      message: input,
      user: userData,
    });
    setInput('');
  };

  const showMessages = () => {
    if (messages) {
      return messages.map((message) => (
        <Message
          key={message.id}
          id={message.id}
          userData={message.data.user}
          message={message.data.message}
        />
      ));
    }
  };

  return (
    <Screen style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <View
        style={{ flexDirection: 'row', alignItems: 'center', marginTop: 30 }}
      >
        <TouchableOpacity
          style={{ padding: 20 }}
          onPress={() => navigation.goBack()}
        >
          <Entypo name='chevron-left' size={24} color={colors.hearted2} />
        </TouchableOpacity>
        <Text style={{ marginLeft: 15, fontSize: 18, fontWeight: '600' }}>
          {recipientName}
        </Text>
      </View>
      <View style={styles.chatContainer}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={90}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <>
              <ScrollView
                ref={scrollViewRef}
                onContentSizeChange={() =>
                  scrollViewRef.current.scrollToEnd({ animated: true })
                }
                contentContainerStyle={{ paddingTop: 15 }}
              >
                <>{showMessages()}</>
              </ScrollView>
              <View style={styles.footer}>
                <TextInput
                  placeholder='Send Message'
                  style={styles.textInput}
                  value={input}
                  onSubmitEditing={sendMessage}
                  onChangeText={(text) => setInput(text)}
                />
                <TouchableOpacity onPress={sendMessage} activeOpacity={0.5}>
                  <Ionicons name='send' size={24} color={colors.hearted2} />
                </TouchableOpacity>
              </View>
            </>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </View>
    </Screen>
  );
};

export default MessagingScreen;

const styles = StyleSheet.create({
  chatContainer: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: 15,
  },
  textInput: {
    bottom: 0,
    height: 40,
    flex: 1,
    marginRight: 15,
    backgroundColor: '#ECECEC',
    padding: 10,
    color: 'grey',
    borderRadius: 30,
  },
});
