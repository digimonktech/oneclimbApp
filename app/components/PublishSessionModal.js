import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import colors from '../config/colors';
import { Portal } from 'react-native-portalize';
import { Modalize } from 'react-native-modalize';
import Calendar from 'react-native-calendar-range-picker';
import moment from 'moment';

const windowHeight = Dimensions.get('window').height;

const PublishSessionModal = ({
  modalRef,
  item,
  sessionTimeRef,
  date,
  setDate,
  allDates,
  setAllDates,
}) => {
  const renderHeader = () => {
    return (
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => {
          modalRef.current?.close();
        }}
      >
        <AntDesign name='close' size={24} color={colors.darkGray} />
      </TouchableOpacity>
    );
  };

  let enumerateDaysBetweenDates = (startDate, endDate) => {
    let dates = [];

    startDate.add(1, 'days');

    while (startDate.format('M/D/YYYY') !== endDate.format('M/D/YYYY')) {
      //console.log(startDate.toDate());
      dates.push(startDate.toDate());

      startDate = startDate.add(1, 'days');
    }
    return dates;
  };

  const renderFooter = () => {
    return (
      <View style={{ marginHorizontal: 25 }}>
        <View style={{ marginVertical: 3, height: windowHeight * 0.4 }}>
          <Calendar
            disabledBeforeToday
            singleSelectMode
            /*  onChange={({ startDate, endDate }) => {
                setDate({ startDate: startDate, endDate: endDate });
                setAllDates([
                  moment(new Date(startDate)),
                  moment(new Date(endDate)),
                ]);
              }} */
            // startDate={date?.startDate}
            // endDate={date?.endDate}
            onChange={(date) => setAllDates(moment(new Date(date)))}
            style={{
              selectedDayBackgroundColor: colors.oneClimbOrange,
              selectedBetweenDayTextColor: colors.white,
              selectedBetweenDayBackgroundTextColor: colors.oneClimbOrange,
            }}
          />
        </View>
        <View style={styles.buttonsBox}>
          <TouchableOpacity
            onPress={() => {
              modalRef.current?.close();
            }}
          >
            <Text style={styles.cancel}>Cancel</Text>
          </TouchableOpacity>
          {allDates ? (
            <TouchableOpacity
              onPress={() => {
                /* if (date.startDate)
                    setAllDates([
                      ...allDates,
                      ...enumerateDaysBetweenDates(
                        moment(new Date(date.startDate)),
                        moment(new Date(date.endDate))
                      ),
                    ]); */

                sessionTimeRef.current?.open();
                modalRef.current?.close();
              }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          ) : null}
        </View>
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
        FooterComponent={renderFooter}
        closeSnapPointStraightEnabled={false}
        keyboardShouldPersistTaps='always'
        panGestureEnabled={false}
      >
        <View style={styles.container}>
          <Text style={styles.title}>
            Choose dates to publish new session slots
          </Text>
          <Text style={styles.subtitle}>
            Select (multiple) dates on which you would like to publish your
            session slots.
            {'\n'}
            {'\n'}
            You will define timeslots in the next step.
          </Text>
        </View>
      </Modalize>
    </Portal>
  );
};

export default PublishSessionModal;

const styles = StyleSheet.create({
  closeButton: {
    marginTop: 38,
    marginLeft: 24,
    width: 30,
    elevation: 999,
  },
  container: {
    marginHorizontal: 25,
    borderTopColor: colors.lightGray,
    borderTopWidth: 1,
    marginTop: 26,
  },
  title: {
    fontFamily: 'poppinsSemiBold',
    fontSize: 22,
    lineHeight: 33,
    color: colors.darkGray,
    marginTop: 20,
  },
  subtitle: {
    marginTop: 8,
    fontFamily: 'nunito',
    fontSize: 14,
    lineHeight: 14,
    color: colors.darkGray,
  },
  buttonsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 50,
    marginBottom: 30,
  },
  button: {
    height: 50,
    width: 150,
    borderRadius: 42,
    backgroundColor: colors.oneClimbOrange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: 'poppinsSemiBold',
    fontSize: 18,
    lineHeight: 27,
  },
  cancel: {
    fontFamily: 'poppinsSemiBold',
    fontSize: 16,
    lineHeight: 24,
    color: colors.darkGray,
    textDecorationLine: 'underline',
  },
});
