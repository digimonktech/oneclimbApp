import React from 'react';
import { StyleSheet } from 'react-native';
import colors from '../../config/colors';
import AppText from '../AppText';

function ErrorMessage({ error, visible }) {
  if (!visible || !error) return null;

  return <AppText style={styles.error}>{error}</AppText>;
}

const styles = StyleSheet.create({
  error: {
    color: colors.oneClimbOrange,
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'nunitoBold',
    marginRight: 45,
    lineHeight: 16,
    paddingVertical: 4,
  },
});

export default ErrorMessage;
