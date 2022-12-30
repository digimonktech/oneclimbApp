import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

import firebaseConfig from './firebaseConfig';

// Initialize Firebase App

if (!firebase.apps.length) {
 firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();

export const passwordReset = (email) => auth.sendPasswordResetEmail(email);
// export const initializeApp = firebase.initializeApp(firebaseConfig);
