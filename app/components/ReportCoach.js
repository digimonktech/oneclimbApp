import { Dimensions, StyleSheet, Text, TextInput, View } from 'react-native';
import React from 'react';
import { Portal } from 'react-native-portalize';
import { Modalize } from 'react-native-modalize';
import { TouchableOpacity } from 'react-native';
import colors from '../config/colors';
import { AntDesign } from '@expo/vector-icons';
import { useState } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { useContext } from 'react';
import AuthContext from '../auth/context';
import { firebaseConfig } from '../config/Firebase/firebaseConfig';
import firebase from "firebase/compat/app";

const windowHeight = Dimensions.get('window').height;

const ReportCoach = ({ modalRef, item }) => {
  const { user } = useContext(AuthContext);
  const db = getFirestore(firebase.initializeApp(firebaseConfig));
  const [subject, setSubject] = useState('');
  const [report, setReport] = useState('');

  const sendReport = async () => {
    addDoc(collection(db, 'report_coach_mail'), {
      to: 'uros@oneclimb.com',
      message: {
        subject: { subject },
        html: `
            <div>
              <h3>
                <span>
                  User with user_id: <b>${user.uid}</b>
                </span>
                <br />
                wants to report a coach with ID ${item.userID}.
                <br />
                <br />
                <h4>${report}</h4>
              </h3>
            </div>
          `,
      },
    })
      .then(() => modalRef.current?.close())
      .catch((err) => console.log(err));
  };

  return (
    <Portal>
      <Modalize
        ref={modalRef}
        modalHeight={windowHeight}
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
        closeSnapPointStraightEnabled={false}
        keyboardShouldPersistTaps='always'
        panGestureEnabled={false}
      >
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => {
            modalRef.current?.close();
          }}
        >
          <AntDesign name='close' size={24} color={colors.darkGray} />
        </TouchableOpacity>
        <View style={styles.container}>
          <Text style={styles.title}>What’s wrong?</Text>
          <TextInput
            name='subject'
            textContentType='none'
            numberOfLines={1}
            style={styles.inputFieldSubject}
            onChangeText={(text) => setSubject(text)}
            placeholder='Subject'
            placeholderTextColor={colors.darkGray}
          />
          <TextInput
            name='report'
            textContentType='none'
            numberOfLines={10}
            multiline={true}
            style={styles.inputFieldReport}
            onChangeText={(text) => setReport(text)}
            placeholder='Report text'
            placeholderTextColor={colors.darkGray}
          />
          <View style={styles.buttonsBox}>
            <TouchableOpacity
              onPress={() => {
                modalRef.current?.close();
              }}
            >
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => sendReport()}
            >
              <Text style={styles.buttonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modalize>
    </Portal>
  );
};

export default ReportCoach;

const styles = StyleSheet.create({
  closeButton: {
    marginTop: 50,
    marginLeft: 20,
    width: 30,
  },
  container: {
    marginHorizontal: 25,
    borderTopWidth: 1,
    borderColor: colors.lightGray,
    marginTop: 30,
  },
  title: {
    fontFamily: 'poppinsSemiBold',
    fontSize: 22,
    lineHeight: 33,
    color: colors.darkGray,
    marginTop: 20,
    marginBottom: 10,
  },
  inputFieldSubject: {
    borderRadius: 10,
    borderColor: colors.darkGray,
    borderWidth: 1,
    width: '100%',
    height: 50,
    marginTop: 10,
    paddingLeft: 13,
    marginBottom: 50,
  },
  inputFieldReport: {
    borderRadius: 10,
    borderColor: colors.darkGray,
    borderWidth: 1,
    width: '100%',
    height: 160,
    paddingLeft: 13,
    paddingTop: 10,
  },
  buttonsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cancel: {
    fontFamily: 'poppinsSemiBold',
    fontSize: 18,
    lineHeight: 27,
    color: colors.darkGray,
    textDecorationLine: 'underline',
    marginLeft: 30,
  },
  button: {
    height: 50,
    width: 150,
    borderRadius: 42,
    backgroundColor: colors.oneClimbOrange,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    marginTop: 50,
  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: 'poppinsSemiBold',
    fontSize: 18,
    lineHeight: 27,
  },
});
