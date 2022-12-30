import React, { useState, useEffect, useContext } from 'react';
import UserSettings from './UserSettings';

const DrawerContent = ({
  navigation,
}) => {

  return <UserSettings navigation={navigation} />;
};

export default DrawerContent;
