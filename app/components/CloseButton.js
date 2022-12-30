import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import colors from '../config/colors';

const CloseButton = ({ setModal, mapModal }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={() => setModal(false)}
      style={{
        position: 'absolute',
        right: 25,
        top: 40,
        zIndex: 999,
        elevation: 999,
      }}
    >
      <Ionicons
        name='chevron-down'
        size={28}
        color={mapModal ? colors.hearted2 : colors.black}
      />
    </TouchableOpacity>
  );
};

export default CloseButton;
