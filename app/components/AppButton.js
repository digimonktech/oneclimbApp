import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';

import colors from '../config/colors';

function AppButton({
  title,
  onPress,
  bgColor = 'hearted2',
  textColor = 'white',
  disabled = false,
  style,
  backgroundColor,
  fontSize,
}) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        style,
        backgroundColor
          ? { backgroundColor: backgroundColor }
          : { backgroundColor: colors[bgColor] },
      ]}
      disabled={disabled}
      onPress={onPress}
    >
      <Text
        style={[
          styles.text,
          ,
          {
            color: colors[textColor],
            fontSize: fontSize || 18,
          },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '60%',
    padding: 10,
    borderRadius: 10,
    backgroundColor: colors.primary,
    marginVertical: 5,
  },
  text: {
    color: colors.white,
    fontSize: 18,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
});

export default AppButton;
