import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import AppText from '../components/AppText';
import colors from '../config/colors';
import {
  AntDesign,
  Entypo,
  MaterialIcons,
  Feather,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';

const Coaching = ({ becomeACoachRef }) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <AppText style={styles.accSettings}>Coaching</AppText>
      <View
        style={[
          styles.section,
          { borderBottomWidth: 1, borderColor: colors.lightGray },
        ]}
      >
        <View style={styles.subSection}>
          <MaterialCommunityIcons
            name='vector-polygon'
            size={24}
            color={colors.darkGray}
          />
          <AppText style={styles.text}>Coach profile presentation</AppText>
        </View>
        <Entypo name='chevron-thin-right' size={17} color={styles.darkGray} />
      </View>
      <View
        style={[
          styles.section,
          { borderBottomWidth: 1, borderColor: colors.lightGray },
        ]}
      >
        <View style={styles.subSection}>
          <MaterialCommunityIcons
            name='account-group-outline'
            size={24}
            color={colors.darkGray}
          />

          <AppText style={styles.text}>Host a session</AppText>
        </View>
        <TouchableOpacity on>
          <Entypo name='chevron-thin-right' size={17} color={styles.darkGray} />
        </TouchableOpacity>
      </View>
      <View style={styles.section}>
        <View style={styles.subSection}>
          <Feather name='calendar' size={24} color={colors.darkGray} />
          <AppText style={styles.text}>See all your sessions</AppText>
        </View>
        <Entypo name='chevron-thin-right' size={17} color={styles.darkGray} />
      </View>
      <View style={styles.section}>
        <View style={styles.subSection}>
          <MaterialCommunityIcons
            name='clipboard-text-multiple-outline'
            size={24}
            color={colors.darkGray}
          />
          <AppText style={styles.text}>Learn about coaching</AppText>
        </View>
        <Entypo name='chevron-thin-right' size={17} color={styles.darkGray} />
      </View>
      <View style={styles.section}>
        <View style={styles.subSection}>
          <MaterialCommunityIcons
            name='card-account-details-star-outline'
            size={24}
            color={colors.darkGray}
          />
          <AppText style={styles.text}>Become a coach</AppText>
        </View>
        <TouchableOpacity onPress={() => becomeACoachRef.current?.open()}>
          <Entypo name='chevron-thin-right' size={17} color={styles.darkGray} />
        </TouchableOpacity>
      </View>
      <View style={styles.section}>
        <View style={styles.subSection}>
          <MaterialCommunityIcons
            name='weight-lifter'
            size={24}
            color={colors.darkGray}
          />
          <AppText style={styles.text}>I'm a gym owner</AppText>
        </View>
        <Entypo name='chevron-thin-right' size={17} color={styles.darkGray} />
      </View>
    </View>
  );
};

export default Coaching;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 25,
    marginTop: 35,
  },
  accSettings: {
    fontFamily: 'poppinsSemiBold',
    fontSize: 22,
    lineHeight: 33,
    color: colors.darkGray,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  subSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'nunitoBold',
    fontSize: 16,
    lineHeight: 21,
    color: colors.darkGray,
    marginLeft: 21,
  },
});
