import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useRef } from 'react';
import { Image } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import colors from '../config/colors';
import CoachProfile from './CoachProfile';
import ReportCoach from './ReportCoach';
import AllSessions from './AllSessions';

const CoachCard = ({ item }) => {
  const coachProfileRef = useRef(null);
  const reportCoachRef = useRef(null);

  return (
    <>
      <TouchableOpacity onPress={() => coachProfileRef.current?.open()}>
        <View style={styles.container}>
          <Image style={styles.image} source={{ uri: item.photoURL }} />
        </View>
        <Text style={styles.name}>
          {item.displayName} {item.lastName}
        </Text>
        <View style={styles.rating}>
          <AntDesign name='star' size={14} color={colors.oneClimbOrange} />
          <Text style={styles.ratingNumbers}> 4.89 (66)</Text>
        </View>
        <Text style={styles.sessionName}>Bolder Scena & 2 more</Text>
      </TouchableOpacity>
      <CoachProfile
        modalRef={coachProfileRef}
        item={item}
        reportCoachRef={reportCoachRef}
      />

      <ReportCoach modalRef={reportCoachRef} item={item} />
    </>
  );
};

export default CoachCard;

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
  name: {
    fontFamily: 'nunitoBold',
    fontSize: 12,
    lineHeight: 14,
    marginTop: 5,
    color: colors.darkGray,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  ratingNumbers: {
    color: '#787878',
    fontFamily: 'nunitoBold',
    fontSize: 11,
    lineHeight: 14,
  },
  sessionName: {
    marginTop: 4,
    color: colors.darkGray,
    fontFamily: 'nunitoBold',
    fontSize: 11,
    lineHeight: 14,
  },
});
