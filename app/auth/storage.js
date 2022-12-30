import * as SecureStore from 'expo-secure-store';
import jwtDecode from 'jwt-decode';
//import firebase from 'firebase/compat/app';
import { getAuth } from 'firebase/auth';

const key = 'authToken';

const storeToken = async (authToken) => {
  try {
    await SecureStore.setItemAsync(key, authToken);
  } catch (error) {
    console.log('Error storing the auth token', error);
  }
};

const getToken = async () => {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.log('Error getting the auth token', error);
  }
};

const getUser = async () => {
  const auth = getAuth();
  /* let currentUser = firebase.auth().currentUser; */

  if (auth.currentUser) {
    fetchUserData(auth.currentUser.uid).then((res) => {});
  } else {
    console.log('NO USER!');
  }
};

const getUserORIG = async () => {
  const token = await getToken();
  return token ? jwtDecode(token) : null;
};

const removeToken = async () => {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.log('Error removing the auth token', error);
  }
};

export default { getUser, getToken, removeToken, storeToken };
