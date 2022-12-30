import React, { useRef, useState } from 'react';
import { TextInput, View, StyleSheet } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

import defaultStyles from '../config/styles';
import colors from '../config/colors';
import { useEffect } from 'react';

function AppTextInput({
  icon,
  color = defaultStyles.colors.white,
  width = '90%',
  onDirty,
  textContentType,
  error,
  message,
  ...otherProps
}) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef();

  const showError = () => {
    return (
      <>
        {error?.password?.message?.length ? (
          <Feather
            name='alert-triangle'
            size={24}
            color={color}
            style={[
              styles.icon,
              { marginRight: 42, color: colors.oneClimbOrange },
            ]}
          />
        ) : null}
      </>
    );
  };

  useEffect(() => {
    showError();
  }, [error]);

  return (
    <View style={[styles.container, { width }]}>
      <View style={styles.iconContainer}>
        {icon ? (
          <MaterialCommunityIcons
            name={icon}
            size={24}
            color={color}
            style={styles.icon}
          />
        ) : null}
      </View>
      <View style={styles.textContainer}>
        <TextInput
          ref={inputRef}
          autoCapitalize='none'
          autoCorrect={false}
          textAlignVertical='center'
          placeholderTextColor={colors.darkGray}
          style={[
            styles.field,
            {
              color:
                textContentType === 'password'
                  ? colors.oneClimbOrange
                  : colors.darkGray,
              width: textContentType === 'password' ? '80%' : width,
            },
          ]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...otherProps}
        />
        {textContentType === 'password' ? <>{showError()}</> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    backgroundColor: colors.lightGray,
    borderColor: colors.white,
    marginVertical: 5,
    borderRadius: 42,
  },
  icon: {
    marginRight: 10,
  },
  iconContainer: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 23,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  field: {
    height: 50,
    right: 35,
    paddingLeft: 35,
    fontFamily: 'nunitoBold',
    fontSize: 14,
    fontWeight: '700',
  },
  focusField: {
    height: 50,
    borderWidth: 1,
    // borderColor: colors.hearted2,
    //borderRadius: 10,
    right: 35,
    paddingLeft: 15,
  },
});

export default AppTextInput;
