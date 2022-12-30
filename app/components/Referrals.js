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
} from '@expo/vector-icons';

const Referrals = () => {
  return (
    <View style={styles.container}>
      <AppText style={styles.accSettings}>Referrals & Credits</AppText>
      {/* <View
        style={[
          styles.section,
          { borderBottomWidth: 1, borderColor: colors.lightGray },
        ]}
      >
        <View style={styles.subSection}>
          <Ionicons
            name='megaphone-outline'
            size={24}
            color={colors.darkGray}
          />
          <AppText style={styles.text}>Refer a Coach</AppText>
        </View>
        <Entypo name='chevron-thin-right' size={17} color={styles.darkGray} />
      </View> */}
      <View
        style={[
          styles.section,
          { borderBottomWidth: 1, borderColor: colors.lightGray },
        ]}
      >
        <View style={styles.subSection}>
          <Ionicons
            name='md-wallet-outline'
            size={26}
            color={colors.darkGray}
          />
          <View>
            <AppText style={styles.text}>Your credits</AppText>
            <AppText style={styles.textSecond}>
              Earn €20 for every new coach you refer
            </AppText>
          </View>
        </View>
        <Entypo name='chevron-thin-right' size={17} color={styles.darkGray} />
      </View>
    </View>
  );
};

export default Referrals;

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
  textSecond: {
    marginLeft: 21,
    fontFamily: 'nunito',
    fontSize: 14,
    color: colors.darkGray,
  },
});
