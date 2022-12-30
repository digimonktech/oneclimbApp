import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import AppText from '../components/AppText';
import colors from '../config/colors';
import {
  AntDesign,
  Entypo,
  MaterialIcons,
  Feather,
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons,
} from '@expo/vector-icons';

const Legal = () => {
  return (
    <View style={styles.container}>
      <AppText style={styles.accSettings}>Legal</AppText>
      <View
        style={[
          styles.section,
          { borderBottomWidth: 1, borderColor: colors.lightGray },
        ]}
      >
        <View style={styles.subSection}>
          <MaterialCommunityIcons
            name='text-box-multiple-outline'
            size={24}
            color={colors.darkGray}
          />
          <AppText style={styles.text}>Terms of Service</AppText>
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
            name='text-box-multiple-outline'
            size={24}
            color={colors.darkGray}
          />
          <AppText style={styles.text}>Privacy Policy</AppText>
        </View>
        <Entypo name='chevron-thin-right' size={17} color={styles.darkGray} />
      </View>
    </View>
  );
};

export default Legal;

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
    flex: 0.8,
  },
  text: {
    fontFamily: 'nunitoBold',
    fontSize: 16,
    lineHeight: 21,
    color: colors.darkGray,
    marginLeft: 21,
  },
});
