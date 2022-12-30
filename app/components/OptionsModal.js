import React from 'react';
import { View, TouchableOpacity, StyleSheet, Modal, Text } from 'react-native';
import GestureRecognizer from 'react-native-swipe-gestures';

/* import ReportModal from './ReportModal';*/
import CloseButton from './CloseButton'; 

const OptionsModal = ({
  children,
  setVisible,
  visible,
  type,
  setReportModal,
  reportModal,
  userInfo,
}) => {
  return (
    <GestureRecognizer>
      <Modal
        visible={visible}
        onRequestClose={() => setVisible(false)}
        animationType="fade"
        transparent={true}
      >
        <View
          style={styles.backgroundContainer}
          onTouchStart={() => setVisible(false)}
        />
        <View style={styles.container}>
          <View style={styles.optionsContainer}>{children}</View>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.closeButton}
            onPress={() => setVisible(false)}
          >
            <Text
              style={[styles.optionText, { fontFamily: 'poppinsSemiBold' }]}
            >
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
        {/* <Modal
          animationType="slide"
          visible={reportModal}
          onRequestClose={() => setReportModal(false)}
        >
          <CloseButton setModal={setReportModal} />
          <ReportModal
            type={type}
            setModal={setReportModal}
            setOptionsVisible={setVisible}
            userInfo={userInfo}
          />
        </Modal> */}
      </Modal>
    </GestureRecognizer>
  );
};

const OptionItem = ({ children, disabled, onPress }) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      style={[styles.option, { borderTopWidth: 0 }]}
      onPress={onPress}
    >
      <Text style={[styles.optionText, disabled ? { color: '#BAC1CC' } : null]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

export { OptionsModal, OptionItem };

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  container: {
    position: 'absolute',
    bottom: 30,
    width: '90%',
    alignSelf: 'center',
  },
  optionsContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
  },
  option: {
    padding: '6%',
    borderTopWidth: 1,
    width: '100%',
    borderColor: '#F0F1F5',
  },
  optionText: {
    textAlign: 'center',
    fontFamily: 'poppins',
    fontSize: 14,
  },
  closeButton: {
    marginTop: 12,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  loadingContainer: {
    position: 'absolute',
    alignSelf: 'center',
    top: '40%',
  },
});
