import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import AppText from '../components/AppText';
import colors from '../config/colors';
import { AntDesign, Entypo, MaterialIcons, Feather } from '@expo/vector-icons';

const AccountSettings = () => {
  return (
    <View style={styles.container}>
      <AppText style={styles.accSettings}>AccountSettings</AppText>
      <View
        style={[
          styles.section,
          { borderBottomWidth: 1, borderColor: colors.lightGray },
        ]}
      >
        <View style={styles.subSection}>
          <AntDesign name='creditcard' size={24} color={colors.darkGray} />
          <AppText style={styles.text}>Payments and payouts</AppText>
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
          <MaterialIcons
            name='notifications-none'
            size={26}
            color={colors.darkGray}
          />
          <AppText style={styles.text}>Notifications</AppText>
        </View>
        <Entypo name='chevron-thin-right' size={17} color={styles.darkGray} />
      </View>
      <View style={styles.section}>
        <View style={styles.subSection}>
          <Feather name='lock' size={24} color={colors.darkGray} />
          <AppText style={styles.text}>Privacy and sharing</AppText>
        </View>
        <Entypo name='chevron-thin-right' size={17} color={styles.darkGray} />
      </View>
    </View>
  );
};

export default AccountSettings;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 25,
    marginTop: 17,
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
