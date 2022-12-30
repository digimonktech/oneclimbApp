import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../config/colors';
import PublishSessionModal from './PublishSessionModal';
import { useRef } from 'react';
import ChooseSessionTimeModal from './ChooseSessionTimeModal';
import moment from 'moment';
import { useStore } from '../hooks/useStore';
import SessionModal from './SessionModal';

const SessionTemplateCard = ({ bookedSessions, item }) => {
  const userData = useStore((state) => state.userData);
  const publishSessionRef = useRef(null);
  const sessionTimeRef = useRef(null);
  const sessionModalRef = useRef(null);
  const [date, setDate] = useState({});
  const [allDates, setAllDates] = useState([]);

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          userData.coachStatus === 'approved'
            ? publishSessionRef.current?.open()
            : sessionModalRef.current?.open();
        }}
      >
        <View style={styles.container}>
          <Image
            style={styles.image}
            source={require('../assets/sessionPhoto.png')}
          />
        </View>
        <Text style={styles.name}>{item.sessionName}</Text>

        <Text style={styles.sessionName}>
          {item.sessionLocation?.name.slice(0, 23)}...
        </Text>
        <Text style={styles.sessionPrice}>From €{item.price} / person</Text>
      </TouchableOpacity>
      <PublishSessionModal
        modalRef={publishSessionRef}
        item={item}
        sessionTimeRef={sessionTimeRef}
        date={date}
        setDate={setDate}
        allDates={allDates}
        setAllDates={setAllDates}
      />
      <ChooseSessionTimeModal
        modalRef={sessionTimeRef}
        publishSessionRef={publishSessionRef}
        item={item}
        allDates={allDates}
      />
      <SessionModal
        modalRef={sessionModalRef}
        bookedSessions={bookedSessions}
        item={item}
      />
    </>
  );
};

export default SessionTemplateCard;

const styles = StyleSheet.create({
  container: {
    height: 160,
    width: 160,
    borderRadius: 16,
    marginRight: 10,
  },
  image: {
    height: 160,
    width: 160,
    borderRadius: 16,
    resizeMode: 'cover',
  },
  heart: {
    marginTop: -152,
    marginLeft: 7,
  },
  name: {
    fontFamily: 'nunitoBold',
    fontSize: 12,
    lineHeight: 14,
    marginTop: 5,
    color: colors.darkGray,
  },

  sessionName: {
    marginTop: 4,
    color: colors.darkGray,
    fontFamily: 'nunito',
    fontSize: 11,
    lineHeight: 14,
  },
  sessionPrice: {
    color: colors.darkGray,
    fontFamily: 'nunitoBold',
    fontSize: 12,
    lineHeight: 16,
  },
});
