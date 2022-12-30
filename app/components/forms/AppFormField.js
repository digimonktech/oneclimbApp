import React from 'react';

import AppTextInput from '../AppTextInput';
import ErrorMessage from './ErrorMessage';

function AppFormField({ name, width, color, message, error, ...otherProps }) {
  return (
    <>
      <AppTextInput
        label={name}
        color={color}
        width={width}
        error={error}
        message={message}
        {...otherProps}
      />
    </>
  );
}

export default AppFormField;
