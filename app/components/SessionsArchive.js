import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  RefreshControl,
} from 'react-native';
import AppText from './AppText';
import { getFirestore, collection, getDocs, query } from 'firebase/firestore';
import { firebaseConfig } from '../config/Firebase/firebaseConfig';
import firebase from "firebase/compat/app";

const windowWidth = Dimensions.get('window').width;

const Item = ({ item }) => (
  <View style={styles.item}>
    <AppText style={styles.title}>{item.sessionName}</AppText>
    <AppText style={styles.title}>{item.sessionType}</AppText>
    <AppText style={styles.title}>{item.numberOfParticipants}</AppText>
  </View>
);

function SessionsArchive({ user }) {
  const db = getFirestore(firebase.initializeApp(firebaseConfig));
  const [sessions, setSessions] = useState();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    loadAllSessions();
  }, [refreshing]);

  const loadAllSessions = async () => {
    const q = query(collection(db, 'users', user.uid, 'sessions'));

    const snapshot = await getDocs(q).catch((err) => setError(err));

    const tempDoc = snapshot.docs.map((doc) => {
      return { ...doc.data() };
    });

    setSessions(tempDoc);
  };

  const renderItem = ({ item }) => (
    <Item
      item={item}
      sessionName={item.sessionName}
      sessionType={item.sessionType}
      numberOfParticipants={item.numberOfParticipants}
    />
  );

  useEffect(() => {
    loadAllSessions();
  }, []);

  return (
    <>
      <FlatList
        style={styles.container}
        data={sessions}
        renderItem={renderItem}
        keyExtractor={(item) => item.sessionName}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    width: windowWidth * 0.76,
  },
  item: {
    flex: 1,
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: 'grey',
  },
  title: {
    fontSize: 22,
  },
});

export default SessionsArchive;
