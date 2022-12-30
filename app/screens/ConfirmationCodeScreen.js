import {
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import Screen from '../components/Screen';
import AppText from '../components/AppText';
import colors from '../config/colors';
import { AntDesign, Fontisto, Ionicons } from '@expo/vector-icons';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
  MaskSymbol,
  isLastFilledCell,
} from 'react-native-confirmation-code-field';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { getAuth } from 'firebase/auth';
import CodeOk from '../components/CodeOk';
import { useRef } from 'react';
import { checkVerification, sendSmsVerification } from '../api/verify';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { useStore } from '../hooks/useStore';
import { firebaseConfig } from '../config/Firebase/firebaseConfig';
import firebase from "firebase/compat/app";

const windowWidth = Dimensions.get('window').width;

const ConfirmationCodeScreen = ({ navigation, route }) => {
  const auth = getAuth();
  const db = getFirestore(firebase.initializeApp(firebaseConfig));
  const fetchUserData = useStore((state) => state.fetchUserData);

  const phoneNumber = route.params.formattedValue;
  const verificationId = route.params.verificationId;
  const CELL_COUNT = 6;
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const [error, setError] = useState('');
  const codeOkRef = useRef(null);

  const renderCell = ({ index, symbol, isFocused }) => {
    let textChild = null;

    if (symbol) {
      textChild = (
        <MaskSymbol
          maskSymbol='•'
          isLastFilledCell={isLastFilledCell({ index, value })}
        >
          {symbol}
        </MaskSymbol>
      );
    } else if (isFocused) {
      textChild = <Cursor />;
    }

    return (
      <Text
        key={index}
        style={[styles.cell, isFocused && styles.focusCell]}
        onLayout={getCellOnLayoutHandler(index)}
      >
        {textChild}
      </Text>
    );
  };

  const verify = async () => {
    await checkVerification(phoneNumber, value).then((success) => {
      if (!success) setError('error');
      success && updateUserData(phoneNumber);
      success && codeOkRef.current?.open();
    });
    /*const credential = PhoneAuthProvider.credential(verificationId, value);
    const multiFactorAssertion =
      PhoneMultiFactorGenerator.assertion(credential);
    return multiFactorUser
      .enroll(multiFactorAssertion, 'My personal phone number')
      .then(() => codeOkRef.current?.open())
      .catch((error) => setError(error));*/
    /* const res = await signInWithCredential(auth, credential).catch((error) =>
      console.log(error)
    );
    console.log(res); */
  };

  const updateUserData = async (phoneNumber) => {
    const userDataRef = doc(db, 'users', auth.currentUser.uid);
    setDoc(userDataRef, { phoneNumber: phoneNumber }, { merge: true }).then(
      () => fetchUserData(auth.currentUser.uid)
    );
  };

  const getNewCode = async () => {
    await sendSmsVerification(phoneNumber)
      .then((sent) => {
        Alert.alert('Code sent', 'Please enter new code', [
          { text: 'Ok', onPress: () => {} },
        ]);
      })
      .then(() => setValue(''));
  };

  return (
    <Screen style={{ backgroundColor: colors.white }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Fontisto
            name='close-a'
            size={14}
            color={colors.darkGray}
            style={{ marginLeft: 24 }}
          />
        </TouchableOpacity>
      </View>
      <KeyboardAwareScrollView style={{ flex: 1 }}>
        <View>
          <View style={styles.container}>
            <AppText style={styles.text}>Confirmation code is sent to</AppText>
            <AppText style={styles.phone}>PHONE NUMBER</AppText>
            <View style={styles.phoneField}>
              <AppText style={styles.phoneNumber}>{phoneNumber}</AppText>
            </View>
          </View>
          <View
            style={[
              styles.container,
              { borderBottomWidth: 0, borderTopWidth: 0, marginTop: 0 },
            ]}
          >
            <AppText style={styles.text}>
              Please enter confirmation code to verify your number
            </AppText>
            <CodeField
              ref={ref}
              {...props}
              // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
              caretHidden={false}
              value={value}
              onChangeText={setValue}
              cellCount={CELL_COUNT}
              rootStyle={styles.codeFieldRoot}
              keyboardType='number-pad'
              textContentType='oneTimeCode'
              renderCell={renderCell}
            />
          </View>
        </View>
        {error ? (
          <View
            style={{
              justifyContent: 'center',
              flex: 1,
              alignItems: 'center',
              marginTop: 30,
            }}
          >
            <Ionicons
              name='ios-warning'
              size={64}
              color={colors.oneClimbOrange}
            />
            <AppText style={styles.invalidCode}>Invalid code</AppText>
            <View style={styles.retryBox}>
              <TouchableOpacity onPress={() => getNewCode()}>
                <AppText style={styles.reSend}>Re-send code</AppText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => verify()}>
                <AppText id={'verify'} style={styles.verify}>
                  Retry
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View
            style={{ justifyContent: 'center', flex: 1, alignItems: 'center' }}
          >
            <TouchableOpacity
              style={[
                styles.button,
                {
                  marginTop: 26,
                },
              ]}
              onPress={() => verify()}
            >
              <AppText id={'verify'} style={styles.verify}>
                Verify
              </AppText>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAwareScrollView>
      <CodeOk modalRef={codeOkRef} />
    </Screen>
  );
};

export default ConfirmationCodeScreen;

const styles = StyleSheet.create({
  header: {
    marginTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'nunitoBold',
    fontSize: 16,
    lineHeight: 22,
    color: colors.darkGray,
    marginLeft: windowWidth * 0.22,
  },
  container: {
    marginTop: 36,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: colors.gray2,
    marginHorizontal: 24,
  },
  text: {
    fontFamily: 'nunito',
    fontSize: 16,
    lineHeight: 18,
    color: colors.darkGray,
    marginVertical: 18,
    marginHorizontal: 16,
  },
  phone: {
    fontFamily: 'nunitoBold',
    fontSize: 16,
    lineHeight: 26,
    marginHorizontal: 16,
  },
  phoneField: {
    width: 300,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.gray2,
    marginLeft: 16,
    marginVertical: 18,
    justifyContent: 'center',
    paddingLeft: 9,
  },
  phoneNumber: {
    fontFamily: 'nunito',
    fontSize: 14,
    color: colors.darkGray,
  },
  button: {
    width: 150,
    height: 50,
    borderRadius: 42,
    backgroundColor: colors.oneClimbOrange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verify: {
    color: '#FFFFFF',
    fontFamily: 'poppinsSemiBold',
    fontSize: 18,
    lineHeight: 27,
  },

  codeFieldRoot: { marginTop: 10, borderRadius: 10 },
  cell: {
    width: 50,
    height: 50,
    lineHeight: 38,
    fontSize: 24,
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: colors.lightGray,
    borderColor: colors.gray2,
    textAlign: 'center',
  },
  focusCell: {
    borderColor: colors.hearted2,
    borderRadius: 10,
  },
  invalidCode: {
    fontFamily: 'nunitoBold',
    fontSize: 22,
    color: colors.darkGray,
    lineHeight: 30,
  },
  retryBox: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 80,
  },
  reSend: {
    fontFamily: 'poppinsSemiBold',
    fontSize: 18,
    lineHeight: 27,
    textDecorationLine: 'underline',
    color: colors.darkGray,
  },
});
