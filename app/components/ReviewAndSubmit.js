import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { Portal } from 'react-native-portalize';
import { Modalize } from 'react-native-modalize';
import colors from '../config/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Entypo } from '@expo/vector-icons';
import { RadioButton } from 'react-native-paper';
import { CheckBox } from 'react-native-elements';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ReviewAndSubmit = ({ modalRef, congratsRef, registerCoach }) => {
  const [checkedMultiple, setCheckedMultiple] = useState({
    read: false,
    standards: false,
    covid: false,
  });

  const submit = async () => {
    await registerCoach().then(() => congratsRef.current?.open());
  };

  const renderHeader = () => {
    return (
      <View>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              modalRef.current?.close();
            }}
          >
            <Entypo name='chevron-left' size={24} color='#FFFFFF' />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => modalRef.current?.close()}>
            <Text style={styles.review}>Review</Text>
          </TouchableOpacity>
        </View>
        <ImageBackground
          style={styles.imageBackground}
          imageStyle={styles.image}
          source={require('../assets/reviewImage.png')}
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
        <View style={[styles.section, { borderBottomWidth: 0 }]}>
          <Text style={styles.overviewText}>Review & Submit</Text>
          <Text style={styles.orangeText}>Safety guidelines</Text>
        </View>
        <View style={styles.section}>
          <View style={styles.radioBox}>
            <Text style={styles.optionText}>
              By selecting this tick box, I attest that I have read, understand,
              and agree to maintain compliance with each of the applicable
              requirements presented in OneClimb application, and that I may be
              required to provide evidence of such compliance.
            </Text>
            <CheckBox
              iconRight
              containerStyle={{
                backgroundColor: 'transparent',
                borderWidth: 0,
              }}
              //iconType='material'
              checkedIcon='check-square-o'
              uncheckedIcon='square-o'
              checkedColor={colors.oneClimbOrange}
              uncheckedColor={colors.gray2}
              checked={checkedMultiple.read}
              onPress={() =>
                setCheckedMultiple((checkedMultiple) => ({
                  ...checkedMultiple,
                  ...{ read: !checkedMultiple.read },
                }))
              }
            />
          </View>
        </View>
        <View style={styles.section}>
          <View style={styles.radioBox}>
            <Text style={styles.optionText}>
              By selecting this tick box, I agree to the OneClimb Standards,
              requirements, and terms of service (if clicked opens text overlay,
              just pls create screen with mockup text) Furthermore, I confirm
              that my coaching license provided, complies with all applicable
              laws, rules and regulations and that my descriptions and photos
              are my own and accurately reflect my expertise.
            </Text>
            <CheckBox
              iconRight
              containerStyle={{
                backgroundColor: 'transparent',
                borderWidth: 0,
              }}
              //iconType='material'
              checkedIcon='check-square-o'
              uncheckedIcon='square-o'
              checkedColor={colors.oneClimbOrange}
              uncheckedColor={colors.gray2}
              checked={checkedMultiple.standards}
              onPress={() =>
                setCheckedMultiple((checkedMultiple) => ({
                  ...checkedMultiple,
                  ...{ standards: !checkedMultiple.standards },
                }))
              }
            />
          </View>
        </View>
        <View style={styles.section}>
          <View style={styles.radioBox}>
            <Text style={styles.optionText}>
              By selecting this tick box, I understand that I am are responsible
              for following applicable local COVID-19 laws and guidelines, and
              that this applies also to all participants at and during my hosted
              sessions.
            </Text>
            <CheckBox
              iconRight
              containerStyle={{
                backgroundColor: 'transparent',
                borderWidth: 0,
              }}
              //iconType='material'
              checkedIcon='check-square-o'
              uncheckedIcon='square-o'
              checkedColor={colors.oneClimbOrange}
              uncheckedColor={colors.gray2}
              checked={checkedMultiple.covid}
              onPress={() =>
                setCheckedMultiple((checkedMultiple) => ({
                  ...checkedMultiple,
                  ...{ covid: !checkedMultiple.covid },
                }))
              }
            />
          </View>
        </View>
        {checkedMultiple.covid === true &&
        checkedMultiple.read === true &&
        checkedMultiple.standards === true ? (
          <TouchableOpacity style={styles.button} onPress={submit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        ) : null}
      </Modalize>
    </Portal>
  );
};

export default ReviewAndSubmit;

const styles = StyleSheet.create({
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 25,
    marginTop: 38,
    zIndex: 999,
    elevation: 999,
  },
  review: {
    fontFamily: 'nunitoBold',
    fontSize: 16,
    lineHeight: 22,
    color: '#FFFFFF',
    textDecorationLine: 'underline',
  },
  imageBackground: {
    width: windowWidth,
    height: windowHeight * 0.35,
    marginTop: -65,
    borderRadius: 10,
  },
  image: {
    width: windowWidth,
    height: windowHeight * 0.35,
    borderRadius: 10,
  },
  closeButton: {
    elevation: 999,
    zIndex: 999,
  },

  section: {
    marginHorizontal: 25,

    borderBottomWidth: 1,
    borderColor: colors.gray2,
    paddingVertical: 15,
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

  radioBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: colors.gray2,
  },
  optionText: {
    flex: 0.97,
    fontFamily: 'nunito',
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
    marginTop: 150,
    alignSelf: 'flex-end',
  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: 'poppinsSemiBold',
    fontSize: 18,
    lineHeight: 27,
  },
});
