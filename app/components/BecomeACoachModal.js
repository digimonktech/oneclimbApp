import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { Portal } from 'react-native-portalize';
import { Modalize } from 'react-native-modalize';
import { Fontisto } from '@expo/vector-icons';
import colors from '../config/colors';
import { useState } from 'react';

const windowHeight = Dimensions.get('window').height;

const BecomeACoachModal = ({ modalRef, overviewRef }) => {
  const [showFAQ, setShowFAQ] = useState(false);

  const renderHeader = () => {
    return (
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => {
          !showFAQ ? modalRef.current?.close() : setShowFAQ(!showFAQ);
        }}
      >
        <Fontisto name='close-a' size={14} color={colors.darkGray} />
      </TouchableOpacity>
    );
  };

  return (
    <Portal>
      <Modalize
        ref={modalRef}
        modalHeight={windowHeight * 0.95}
        handleStyle={{ height: 5, width: 150 }}
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
        {!showFAQ ? (
          <>
            <View style={styles.descriptionBox}>
              <Text style={styles.description}>
                We offer climbing coaches a seamless experience to organize and
                execute climbing sessions. Below’s a quick overview of the
                onboarding process, from start to finsih.
              </Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.title}>1. Learn our quality bar</Text>
              <Text style={styles.description}>
                Make sure your climbing and coaching track record meets our
                quality standards for expertise and licences.
              </Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.title}>2. Create a coach profile</Text>
              <Text style={styles.description}>
                Your coach profile is how climbers find you. Stand out instantly
                by highlighting your climbing expertise and adding some nice
                photos.
              </Text>
            </View>
            <View style={[styles.section, { borderBottomWidth: 0 }]}>
              <Text style={styles.title}>3. Learn our quality bar</Text>
              <Text style={styles.description}>
                Make sure your climbing and coaching track record meets our
                quality standards for expertise and licences.
              </Text>
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setShowFAQ(!showFAQ)}
            >
              <Text style={styles.buttonText}>Become a coach</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.titleFAQ}>FAQ</Text>
            <View style={styles.section}>
              <Text style={styles.titleQuestion}>
                Do I need to have a valid coaching license to host session via
                OneClimb?
              </Text>
              <Text style={styles.description}>
                Yes. For the time being, coaches hosting session via OneClimb
                need to have a valid coaching license in the country where you
                host sessions. You will be asked to provide a proof of your
                license when creating your coach profile
              </Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.titleQuestion}>
                What’s the time commitment?
              </Text>
              <Text style={styles.description}>
                You can host climbing session as often as you like - you are in
                charge of your schedule so feel free to adjust the frequency and
                duration of sessions.
              </Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.titleQuestion}>
                Do I need a place to host a session?
              </Text>
              <Text style={styles.description}>
                No. There are many public climbing gyms available, which welcome
                external organized groups. The entry fees for coach may apply.
              </Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.titleQuestion}>
                Do I need a business entity?
              </Text>
              <Text style={styles.description}>
                This depends on a local legislation. When onboarding, we’ll
                emphasize the engagement methods we support (e.g. student work,
                sole proprietorship, a sports club).
              </Text>
            </View>
            <View style={[styles.section, { borderBottomWidth: 0 }]}>
              <Text style={styles.titleRegister}>
                Register as a coach on OneClimb
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.button, { marginBottom: 100 }]}
              onPress={() => {
                overviewRef.current?.open();
                modalRef.current?.close();
              }}
            >
              <Text style={styles.buttonText}>Become a coach</Text>
            </TouchableOpacity>
          </>
        )}
      </Modalize>
    </Portal>
  );
};

export default BecomeACoachModal;

const styles = StyleSheet.create({
  closeButton: {
    marginTop: 38,
    marginLeft: 24,
  },
  descriptionBox: {
    marginHorizontal: 25,
    marginTop: 33,
    borderBottomWidth: 1,
    borderColor: colors.gray2,
    paddingBottom: 20,
  },
  description: {
    fontFamily: 'nunito',
    fontSize: 16,
    lineHeight: 22,
    color: colors.darkGray,
  },
  section: {
    marginHorizontal: 25,
    borderBottomWidth: 1,
    borderColor: colors.gray2,
    paddingVertical: 20,
  },
  title: {
    fontFamily: 'poppinsSemiBold',
    fontSize: 22,
    lineHeight: 33,
    color: colors.darkGray,
  },
  button: {
    height: 50,
    width: 220,
    borderRadius: 42,
    backgroundColor: colors.oneClimbOrange,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 25,
    marginBottom: 40,
  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: 'poppinsSemiBold',
    fontSize: 18,
    lineHeight: 27,
  },
  titleFAQ: {
    marginLeft: 25,
    marginTop: 33,
    fontFamily: 'poppinsSemiBold',
    fontSize: 22,
    lineHeight: 33,
    color: colors.darkGray,
  },
  titleQuestion: {
    fontFamily: 'nunitoBold',
    fontSize: 16,
    lineHeight: 22,
    color: colors.black2,
    marginBottom: 10,
  },
  titleRegister: {
    fontFamily: 'poppinsSemiBold',
    fontSize: 16,
    lineHeight: 24,
    color: colors.darkGray,
  },
});
