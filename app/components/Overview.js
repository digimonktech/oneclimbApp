import {
  Dimensions,
  ImageBackground,
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
import { LinearGradient } from 'expo-linear-gradient';
import { Entypo } from '@expo/vector-icons';
import { RadioButton } from 'react-native-paper';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Overview = ({ modalRef, aboutYouRef, checked, setChecked }) => {
  const renderHeader = () => {
    return (
      <View>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => {
            modalRef.current?.close();
          }}
        >
          <Fontisto name='close-a' size={14} color='#FFFFFF' />
        </TouchableOpacity>
        <ImageBackground
          style={styles.imageBackground}
          imageStyle={styles.image}
          source={require('../assets/overviewImage.png')}
        />

        <LinearGradient
          colors={['#000000d9', '#00000026']}
          style={{
            backgroundColor: 'transparent',
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            borderRadius: 10,
            transform: [{ rotate: '180deg' }],
          }}
          locations={[0, 0.36]}
        />
      </View>
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
          <View style={styles.section}>
            <Text style={styles.overviewText}>Overview</Text>
            <Text style={styles.orangeText}>What we’re looking for</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.titleSection}>
            OneClimb coaches are passionate climbers that want to share their
            knowledge and experience to fellow climbers. They should meet
            following standards:
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            <Entypo name='dot-single' size={24} color='black' />
            <Text style={styles.description}>
              Expertise:{' '}
              <Text style={[styles.description, { fontFamily: 'nunito' }]}>
                Having exceptional climbing and teaching skills, ability or
                background.
              </Text>
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            <Entypo name='dot-single' size={24} color='black' />
            <Text style={styles.description}>
              Empathy:{' '}
              <Text style={[styles.description, { fontFamily: 'nunito' }]}>
                Making meaningful social connections happen.
              </Text>
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            <Entypo name='dot-single' size={24} color='black' />
            <Text style={styles.description}>
              License:{' '}
              <Text style={[styles.description, { fontFamily: 'nunito' }]}>
                Having a valid sport climbing coaching licese, issued by
                applicable association in the country where sessions will be
                held.
              </Text>
            </Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.titleSection}>
            We’re looking for passionate coaches who can share unique experience
            and perspective, together with insider knowhow. Such as:
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            <Entypo name='dot-single' size={24} color='black' />
            <Text style={styles.description}>Being a former pro-athlete.</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            <Entypo name='dot-single' size={24} color='black' />
            <Text style={styles.description}>
              Having exceptional achievements.
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            <Entypo name='dot-single' size={24} color='black' />
            <Text style={styles.description}>
              Being a well-informed enthusiast.
            </Text>
          </View>
          <Text style={styles.participantsText}>
            Participants value unique perspective and training methods that
            can’t find anywhere else.
          </Text>
        </View>
        <View style={[styles.section, { borderBottomWidth: 0 }]}>
          <Text style={styles.titleSection}>
            Have you hosted climbing sessions before? (select one)
          </Text>
          <TouchableOpacity
            style={styles.radioBox}
            onPress={() => setChecked('professionally')}
          >
            <Text style={styles.optionText}>
              Yes,
              {'\n'}
              I’ve tought climbing lessons professionally
            </Text>
            <RadioButton
              value='professionally'
              status={checked === 'professionally' ? 'checked' : 'unchecked'}
              onPress={() => setChecked('professionally')}
              color={colors.oneClimbOrange}
              uncheckedColor={colors.darkGray}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.radioBox}
            onPress={() => setChecked('informally')}
          >
            <Text style={styles.optionText}>
              Yes,
              {'\n'}
              I’ve thought informally for family and friends
            </Text>
            <RadioButton
              value='informally'
              status={checked === 'informally' ? 'checked' : 'unchecked'}
              onPress={() => setChecked('informally')}
              color={colors.oneClimbOrange}
              uncheckedColor={colors.darkGray}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.radioBox, { borderBottomWidth: 0 }]}
            onPress={() => setChecked('no')}
          >
            <Text style={styles.optionText}> No</Text>
            <RadioButton
              value='no'
              status={checked === 'no' ? 'checked' : 'unchecked'}
              onPress={() => setChecked('no')}
              color={colors.oneClimbOrange}
              uncheckedColor={colors.darkGray}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            aboutYouRef.current?.open();
            modalRef.current?.close();
          }}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </Modalize>
    </Portal>
  );
};

export default Overview;

const styles = StyleSheet.create({
  imageBackground: {
    width: windowWidth,
    height: windowHeight * 0.2,
    marginTop: -53,
    borderRadius: 10,
  },
  image: {
    width: windowWidth,
    height: windowHeight * 0.2,
    borderRadius: 10,
  },
  closeButton: {
    marginTop: 38,
    marginLeft: 24,
    zIndex: 999,
  },
  container: {
    width: windowWidth,
  },
  section: {
    marginHorizontal: 25,

    borderBottomWidth: 1,
    borderColor: colors.gray2,
    paddingVertical: 20,
  },
  overviewText: {
    fontFamily: 'poppinsSemiBold',
    fontSize: 28,
    lineHeight: 42,
    color: colors.darkBlue,
  },
  orangeText: {
    fontFamily: 'nunitoBold',
    fontSize: 16,
    lineHeight: 26,
    color: colors.oneClimbOrange,
  },
  titleSection: {
    fontFamily: 'nunitoBold',
    fontSize: 16,
    lineHeight: 22,
    color: colors.darkGray,
    marginBottom: 10,
  },
  description: {
    fontFamily: 'nunitoBold',
    fontSize: 14,
    lineHeight: 20,
    color: colors.darkGray,
    marginTop: 3,
  },
  participantsText: {
    fontFamily: 'nunito',
    fontSize: 14,
    lineHeight: 22,
    color: colors.darkGray,
    marginTop: 15,
  },
  radioBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: colors.gray2,
    paddingVertical: 5,
  },
  optionText: {
    fontFamily: 'nunitoBold',
    fontSize: 14,
    lineHeight: 20,
    color: colors.darkGray,
  },
  button: {
    height: 50,
    width: 150,
    borderRadius: 42,
    backgroundColor: colors.oneClimbOrange,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 25,
    marginBottom: 40,
    marginTop: 50,
    alignSelf: 'flex-end',
  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: 'poppinsSemiBold',
    fontSize: 18,
    lineHeight: 27,
  },
});
