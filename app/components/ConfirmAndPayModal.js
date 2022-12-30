import {
  Alert,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { Entypo } from '@expo/vector-icons';
import colors from '../config/colors';
import { Portal } from 'react-native-portalize';
import { Modalize } from 'react-native-modalize';
import { CardField, useConfirmPayment } from '@stripe/stripe-react-native';
import { useContext } from 'react';
import AuthContext from '../auth/context';
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
} from 'firebase/firestore';
import { firebaseConfig } from '../config/Firebase/firebaseConfig';
import firebase from "firebase/compat/app";

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const ConfirmAndPayModal = ({ modalRef, item, registerSession }) => {
  const db = getFirestore(firebase.initializeApp(firebaseConfig));
  const { user } = useContext(AuthContext);
  const [card, setCard] = useState({});
  const [booked, setBooked] = useState(false);
  const { confirmPayment, loading } = useConfirmPayment();
  let price = Math.round(Number(item.price) * 100);

  const stripePayment = async () => {
    await addDoc(collection(db, 'users', user.uid, 'checkout_sessions'), {
      client: 'mobile',
      mode: 'payment',
      amount: price,
      currency: 'eur',
      receipt_email: user.email,
    }).then((docRef) => {
      onSnapshot(docRef, async (snap) => {
        const data = await snap.data();
        const { paymentIntent, error } = await confirmPayment(
          data.paymentIntentClientSecret,
          {
            type: 'Card',
            billingDetails: user.email,
          }
        );

        if (paymentIntent) {
          console.log('success', paymentIntent);

          if (paymentIntent.status === 'Succeeded') {
            await registerSession(item).then(() => setBooked(true));
          }

          Alert.alert('Success', `Payment successful`);
        } else {
          console.log('error', error);
        }
      });
    });
  };

  const renderHeader = () => {
    return (
      <>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => {
            modalRef.current?.close();
          }}
        >
          <Entypo name='chevron-left' size={26} color={colors.darkGray} />
        </TouchableOpacity>
      </>
    );
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
        HeaderComponent={renderHeader}
        closeSnapPointStraightEnabled={false}
        keyboardShouldPersistTaps='always'
        panGestureEnabled={false}
      >
        <View style={styles.containerScroll}>
          <Text style={styles.title}>Confirm and pay</Text>
          <View style={styles.section}>
            <View style={styles.sesionCardBox}>
              <Image
                style={styles.image}
                source={require('../assets/sessionPhoto.png')}
              />
              <View style={{ marginLeft: 13, width: 154 }}>
                <Text style={styles.sessionText}>
                  {item.sessionLocation.name.slice(0, 12)}.. ·{' '}
                  {item.sessionLength}{' '}
                </Text>
                <Text
                  style={[styles.sessionText, { fontSize: 12, lineHeight: 14 }]}
                >
                  {item.sessionName}
                  {'\n'}
                </Text>
                <Text
                  style={[
                    styles.sessionText,
                    { fontSize: 12, lineHeight: 14, fontFamily: 'nunito' },
                  ]}
                >
                  Session in {item.sessionLanguage}
                </Text>
              </View>
            </View>
            <Text
              style={[
                styles.title,
                { fontSize: 16, marginTop: 15, marginBottom: 30 },
              ]}
            >
              Your session
            </Text>
            <Text style={styles.subtitle}>Date</Text>
            <Text style={styles.info}>{item.sessionDateTime}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.subtitle}>Guests</Text>
            <Text style={styles.info}>1 adult</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.subtitle}>Price details</Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Text style={styles.info}>€{item.price} x 1 adult</Text>
              <Text style={styles.info}>€{item.price}</Text>
            </View>
          </View>
          <View style={styles.section}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Text style={styles.subtitle}>Total (EUR)</Text>
              <Text style={styles.subtitle}>€{item.price}</Text>
            </View>
          </View>
          <View style={styles.section}>
            <Text
              style={[
                styles.title,
                { fontSize: 16, marginTop: 15, marginBottom: 30 },
              ]}
            >
              Things to know
            </Text>
            <Text style={styles.subtitle}>Participants requirements</Text>
            <Text style={styles.info}>
              Up to {item.maxNumberOfParticipants} participants aged
              {item.minimumAge} and above can attend this session.
            </Text>
          </View>
          <View style={styles.section}>
            <Text
              style={[
                styles.title,
                { fontSize: 16, marginTop: 15, marginBottom: 30 },
              ]}
            >
              Pay with card
            </Text>
            <View style={styles.cardContainer}>
              <CardField
                postalCodeEnabled={false}
                style={styles.cardField}
                onCardChange={(cardDetails) => {
                  //console.log(cardDetails);
                  setCard(cardDetails);
                }}
                cardStyle={{
                  borderColor: colors.gray2,
                  borderWidth: 1,
                  borderRadius: 10,
                }}
              />
            </View>
          </View>
          <View style={styles.section}>
            <TouchableOpacity style={{ marginVertical: 15 }}>
              <Text
                style={[styles.subtitle, { textDecorationLine: 'underline' }]}
              >
                Enter cupon
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.section}>
            <Text
              style={[
                styles.title,
                { fontSize: 16, marginTop: 15, marginBottom: 10 },
              ]}
            >
              Cancellation policy
            </Text>
            <Text style={[styles.info, { fontSize: 13 }]}>
              Non-refundable. {'\n'}Free cancelation until{' '}
              {item.freeCancelationBefore} in advance.
              {'\n'}
              {'\n'}
              By selecting the button below, you agree to the{' '}
              <Text
                style={[
                  styles.info,
                  { fontSize: 13, textDecorationLine: 'underline' },
                ]}
              >
                Cancelation Policy, Participants Refund Policy
              </Text>
              , and{' '}
              <Text
                style={[
                  styles.info,
                  { fontSize: 13, textDecorationLine: 'underline' },
                ]}
              >
                OneClimb social distancing and other COVID-19-related
                guidelines.
              </Text>
              {'\n'}
              {'\n'}
              Payment terms between you and OneClimb Ltd. London.
            </Text>
            <Text
              style={[
                styles.title,
                { fontSize: 16, marginTop: 35, marginBottom: 10 },
              ]}
            >
              Never comunicate or transfer money outside OneClimb.
              {'\n'}
              We take care for your safety.
            </Text>
          </View>
          {!booked ? (
            <TouchableOpacity
              style={styles.button}
              onPress={() => stripePayment()}
              disabled={!card?.complete || loading}
            >
              {loading ? (
                <Text style={styles.buttonText}>Please wait</Text>
              ) : card.complete ? (
                <Text style={styles.buttonText}>Confirm and pay</Text>
              ) : (
                <Text style={styles.buttonText}>Card info incomplete</Text>
              )}
            </TouchableOpacity>
          ) : (
            <View style={styles.button}>
              <Text style={styles.buttonText}>Session successfuly booked</Text>
            </View>
          )}
        </View>
      </Modalize>
    </Portal>
  );
};

export default ConfirmAndPayModal;

const styles = StyleSheet.create({
  closeButton: {
    marginTop: 45,
    marginLeft: 24,
    width: 30,
    elevation: 999,
  },
  containerScroll: {
    marginHorizontal: 25,
    backgroundColor: '#FFFFFF',
    marginTop: 50,
  },
  title: {
    fontFamily: 'poppinsSemiBold',
    fontSize: 20,
    lineHeight: 30,
    color: colors.darkBlue,
    marginBottom: 34,
  },
  section: {
    borderTopColor: colors.lightGray,
    borderTopWidth: 1,
    marginTop: 15,
  },
  sesionCardBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 23,
  },
  image: {
    height: 160,
    width: 160,
    borderRadius: 16,
    resizeMode: 'cover',
  },
  sessionText: {
    fontFamily: 'nunitoBold',
    fontSize: 14,
    lineHeight: 15,
    color: colors.darkGray,
  },
  subtitle: {
    fontFamily: 'poppinsSemiBold',
    fontSize: 14,
    lineHeight: 21,
    color: colors.darkGray,
  },
  info: {
    fontFamily: 'nunito',
    fontSize: 14,
    lineHeight: 19,
    color: colors.darkGray,
    marginVertical: 5,
  },
  button: {
    height: 50,
    width: '100%',
    borderRadius: 42,
    backgroundColor: colors.oneClimbOrange,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 61,
  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: 'poppinsSemiBold',
    fontSize: 18,
    lineHeight: 27,
  },
  cardContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  cardField: {
    width: windowWidth * 0.9,
    height: 40,
    borderRadius: 10,
  },
});
