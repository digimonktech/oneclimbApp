import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Portal } from 'react-native-portalize';
import { Modalize } from 'react-native-modalize';
import { AntDesign, Entypo, Feather } from '@expo/vector-icons';
import colors from '../config/colors';
import { FlatList } from 'react-native-gesture-handler';
import SessionCard from './SessionCard';
import { TextInput } from 'react-native';
import {
  getFirestore,
  collection,
  query,
  getDocs,
  where,
} from 'firebase/firestore';
import { firebaseConfig } from '../config/Firebase/firebaseConfig';
import firebase from 'firebase/compat/app';

const windowHeight = Dimensions.get('window').height;

const AllSessions = ({ modalRef, sessions, bookedSessions }) => {
  const db = getFirestore(firebase.initializeApp(firebaseConfig));
  const [searchText, setSearchText] = useState();
  const [searchList, setSearchList] = useState(sessions);
  const searchInputRef = useRef();

  useEffect(() => {
    setSearchList(sessions);
  }, [sessions]);

  const searchSessions = async (value) => {
    let searchArray = [];

    if (value.length && value !== ' ') {
      const q = query(
        collection(db, 'activeSessions'),
        where('sessionName', '>=', value),
        where('sessionName', '<=', value + '\uf8ff')
      );

      await getDocs(q)
        .then((res) => {
          res.forEach((element) => {
            searchArray.push(element.data());
          });
        })
        .then(() => setSearchList(searchArray))
        .catch((err) => console.log(err));
    } else
      setTimeout(() => {
        setSearchList(sessions);
      }, 550);
  };

  const renderHeader = () => {
    return (
      <>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => {
            modalRef.current?.close();
          }}
        >
          <AntDesign name='close' size={24} color={colors.darkGray} />
        </TouchableOpacity>
        <View style={styles.searchBox}>
          <View style={styles.search}>
            <Feather name='search' size={22} color={colors.darkGray} />
            <TextInput
              ref={searchInputRef}
              style={[styles.input]}
              onChangeText={(value) => {
                setSearchText(value);
                searchSessions(value);
              }}
              value={searchText}
              placeholder='Search'
              autoCorrect={false}
              placeholderTextColor={colors.darkGray}
            />
          </View>
          <View style={{ marginLeft: 14 }}>
            <Entypo
              name='chevron-up'
              size={26}
              color={colors.darkGray}
              style={{ marginBottom: -8 }}
            />
            <Entypo
              name='chevron-down'
              size={26}
              color={colors.darkGray}
              style={{ marginTop: -8 }}
            />
          </View>
        </View>
      </>
    );
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity style={{ marginVertical: 25 }} activeOpacity={0.7}>
        <SessionCard
          item={item}
          bookedSessions={bookedSessions}
          allSessionsRef={modalRef}
        />
      </TouchableOpacity>
    );
  };

  return (
    <Portal>
      <Modalize
        ref={modalRef}
        modalHeight={windowHeight * 0.95}
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
        HeaderComponent={renderHeader}
        closeSnapPointStraightEnabled={false}
        keyboardShouldPersistTaps='always'
        panGestureEnabled={false}
      >
        <View style={styles.container}>
          <Text style={styles.title}>All sessions</Text>
          <FlatList
            keyboardShouldPersistTaps='handled'
            data={searchList}
            bounces={false}
            scrollEventThrottle={16}
            keyExtractor={(_, index) => String(index)}
            renderItem={renderItem}
            numColumns={2}
            style={{ marginBottom: 30 }}
            refreshing={false}
          />
        </View>
      </Modalize>
    </Portal>
  );
};

export default AllSessions;

const styles = StyleSheet.create({
  closeButton: {
    marginTop: 38,
    marginLeft: 24,
    width: 30,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -40,
    marginTop: 45,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1.5,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 5,
  },
  search: {
    height: 40,
    width: 265,
    borderRadius: 24,
    backgroundColor: colors.lightGray,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 25,
  },
  searchText: {
    marginLeft: 15,
    color: colors.darkGray,
    fontFamily: 'nunitoBold',
    fontSize: 15,
  },
  input: {
    width: '100%',
    paddingLeft: 10,
  },
  container: {
    marginHorizontal: 23,
    marginTop: 29,
  },
  title: {
    fontFamily: 'poppinsSemiBold',
    fontSize: 16,
    lineHeight: 24,
    color: colors.darkBlue,
    marginBottom: -10,
  },
});
