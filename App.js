import { StatusBar } from "expo-status-bar";
import React, { useLayoutEffect, useState } from "react";
import { LogBox } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import firebase from "firebase/compat/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import AppLoading from "expo-app-loading";

import AuthContext from "./app/auth/context";
import { firebaseConfig } from "./app/config/Firebase/firebaseConfig";
import useFonts from "./app/hooks/useFonts";
import AppNavigator from "./app/navigation/AppNavigator";
import colors from "./app/config/colors";
import { getUserData } from "./app/api/firebase";
import { useStore } from "./app/hooks/useStore";
import { StripeProvider } from "@stripe/stripe-react-native";

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [userLoaded, setUserLoaded] = useState(false);
  const [user, setUser] = useState();
  const auth = getAuth(firebase.initializeApp(firebaseConfig));
  const setUserData = useStore((state) => state.setUserData);
  const userData = useStore((state) => state.userData);

  LogBox.ignoreLogs(["Setting a timer for a long period of time"]);

  async function getUserInfo() {
    await useFonts();
    onAuthStateChanged(auth, (user) => {
      setUser(user);
      setUserLoaded(true);
      if (user) {
        getUserData(user.uid).then((userData) => {
          useStore.setState((state) => ({
            ...state,
            userData,
          }));
        });
      }
    });
  }

  useLayoutEffect(() => {
    getUserInfo();
  }, []);

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  if (!isReady || !userLoaded)
    return (
      <AppLoading
        startAsync={getUserInfo}
        onFinish={() => setIsReady(true)}
        onError={console.warn}
      />
    );

  return (
    <StripeProvider
      publishableKey="pk_test_VxCB1X2cjWdO8sZ0vmLlpUJj006VE87HIb"
      urlScheme="com.oneclimb.oneclimbapp"
    >
      <AuthContext.Provider value={{ user, setUser }}>
        <PaperProvider>
          <StatusBar
            backgroundColor={colors.secondary}
            barStyle="light-content"
          />
          <AppNavigator />
        </PaperProvider>
      </AuthContext.Provider>
    </StripeProvider>
  );
}
