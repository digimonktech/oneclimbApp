import { Image, StyleSheet, Text, View } from 'react-native';
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
} from '@expo/vector-icons';

const Support = () => {
  return (
    <View style={styles.container}>
      <AppText style={styles.accSettings}>Support</AppText>
      <View
        style={[
          styles.section,
          { borderBottomWidth: 1, borderColor: colors.lightGray },
        ]}
      >
        <View style={styles.subSection}>
          <Image
            source={require('../assets/logoBlack.png')}
            style={{ height: 24, resizeMode: 'contain', marginHorizontal: -15 }}
          />
          <AppText style={styles.text}>How OneClimb works</AppText>
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
          <AntDesign name='Safety' size={26} color={colors.darkGray} />
          <View>
            <AppText style={styles.text}>Safety Centre</AppText>
            <AppText style={[styles.textSecond, { lineHeight: 16 }]}>
              Get the information you need to be safe during your session
            </AppText>
          </View>
        </View>
        <Entypo name='chevron-thin-right' size={17} color={styles.darkGray} />
      </View>
      <View
        style={[
          styles.section,
          { borderBottomWidth: 1, borderColor: colors.lightGray },
        ]}
      >
        <View style={[styles.subSection, { flex: 0.9 }]}>
          <MaterialIcons
            name='support-agent'
            size={26}
            color={colors.darkGray}
          />
          <View>
            <AppText style={styles.text}>Contact OneClimb support</AppText>
            <AppText style={[styles.textSecond, { lineHeight: 16 }]}>
              Let your team know about any concerns or questions related to
              hosting or attending a climbing sessions
            </AppText>
          </View>
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
          <FontAwesome5
            name='question-circle'
            size={24}
            color={colors.darkGray}
          />
          <AppText style={styles.text}>Get Help</AppText>
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
          <Feather name='edit-2' size={24} color={colors.darkGray} />
          <AppText style={styles.text}>Give us feedback</AppText>
        </View>
        <Entypo name='chevron-thin-right' size={17} color={styles.darkGray} />
      </View>
    </View>
  );
};

export default Support;

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
  textSecond: {
    marginLeft: 21,
    fontFamily: 'nunito',
    fontSize: 14,
    color: colors.darkGray,
  },
});
