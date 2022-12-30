import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
  Dimensions,
  Platform,
  ScrollView,
  ImageBackground,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";

import { registration } from "../api/firebase";
import authApi from "../api/auth";
import usersApi from "../api/registerUsers";
import colors from "../config/colors";
import { AppFormField, ErrorMessage } from "../components/forms";
import useApi from "../hooks/useApi";
import ActivityIndicator from "../components/ActivityIndicator";
import AppText from "../components/AppText";
import { Overlay } from "react-native-elements";
import PrivacyPolicy from "../data/PrivacyPolicy";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import firebase from "firebase/compat/app";
import { LinearGradient } from "expo-linear-gradient";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { firebaseConfig } from "../config/Firebase/firebaseConfig";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

function RegisterScreen({ navigation }) {
  const db = getFirestore(firebase.initializeApp(firebaseConfig));
  const registerApi = useApi(usersApi.register);
  const loginApi = useApi(authApi.login);
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async ({ name, email, password, username }) => {
    if (!error.length)
      await registration(username, name, email, password, setError, navigation);
  };
  const handleGoBack = () => {
    navigation.goBack();
  };

  const registerOptions = {
    username: {
      required: "Username is required",
      minLength: {
        value: 3,
        message: "Username must have at least 3 letters",
      },
      maxLength: {
        value: 20,
        message: "Username can have maximum 20 letters",
      },
      pattern: {
        value: /^[\w-_.]*$/,
        message:
          "You can only use small letters, (. - _) symbols and numbers for username",
      },
    },
    name: {
      required: "Name is required",
      minLength: {
        value: 3,
        message: "Name must have at least 3 letters",
      },
      pattern: {
        value:
          /^(?!.*[-!$%^&*()_+|~=`{}\[\]:÷\♧◇♡♤■□●○°☆¤《》0123456789";'£€\’•”‘¡¿…“„»«§¥₩₽¢\–—≠≈‰\<>?,.@#\/])/,
        message: "Only letters allowed",
      },
    },
    email: {
      required: "Email is required",
      pattern: {
        value:
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        message: "E-mail must be in propper format",
      },
    },
    password: {
      required: "Password is required",
      minLength: {
        value: 8,
        message: "Password must have at least 8 characters",
      },
      pattern: {
        value: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        message:
          "Password must be at least 8 characters long and must include uppercase, number and special character",
      },
    },
  };
  const toggleOverlay = () => {
    setVisible(!visible);
  };

  const checkHandle = async (text) => {
    const q = query(collection(db, "users"), where("handle", "==", text));

    await getDocs(q).then((snap) => {
      if (!snap.empty) {
        setError("Username already exist");
      } else setError("");
    });
  };

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backArrow} onPress={handleGoBack}>
          <Ionicons name="chevron-back" size={22} color={colors.white} />
        </TouchableOpacity>
        <View>
          <ImageBackground
            style={styles.image}
            source={require("../assets/oneClimb.png")}
          />
          <LinearGradient
            colors={["#000000d9", "#00000026"]}
            style={{
              backgroundColor: "transparent",
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              borderRadius: 10,
              transform: [{ rotate: "180deg" }],
            }}
            locations={[0, 0.36]}
          />
        </View>
        <Image
          style={
            windowHeight < 700
              ? [styles.imageText, { marginTop: -340 }]
              : styles.imageText
          }
          source={require("../assets/oneClimbText.png")}
        />
        <View style={styles.fContainer}>
          <KeyboardAwareScrollView>
            <AppText style={styles.registerText}>Sign up to OneClimb</AppText>
            <AppText
              style={
                windowHeight < 700
                  ? styles.orangeText
                  : [styles.orangeText, { marginBottom: 35 }]
              }
            >
              Sign up to OneClimb using your email
            </AppText>
            <View style={styles.errorBox}>
              <ErrorMessage
                visible={true}
                error={
                  errors.username
                    ? errors.username.message
                    : errors.name
                    ? errors.name.message
                    : errors.email
                    ? errors.email.message
                    : errors.password
                    ? errors.password.message
                    : error
                }
              />
            </View>
            {/* <Controller
              control={control}
              rules={registerOptions.username}
              render={({ field: { onChange, onBlur, value } }) => (
                <AppFormField
                  name='name'
                  width='100%'
                  icon={'at'}
                  color={colors.darkGray}
                  placeholder={'Handle'}
                  textContentType='username'
                  onChangeText={(text) => {
                    checkHandle(text);
                    onChange(text.toLowerCase());
                  }}
                  value={value}
                />
              )}
              name='username'
              defaultValue=''
            /> */}
            <Controller
              control={control}
              rules={registerOptions.name}
              render={({ field: { onChange, onBlur, value } }) => (
                <AppFormField
                  name="name"
                  icon={"account-circle-outline"}
                  color={colors.darkGray}
                  placeholder={"Name"}
                  textContentType="familyName"
                  onChangeText={onChange}
                  value={value}
                  width="100%"
                />
              )}
              name="name"
              defaultValue=""
            />

            <Controller
              control={control}
              rules={registerOptions.email}
              render={({ field: { onChange, onBlur, value } }) => (
                <AppFormField
                  icon={"email-outline"}
                  color={colors.darkGray}
                  placeholder={"Email"}
                  keyboardType="email-address"
                  name="email"
                  textContentType="emailAddress"
                  onChangeText={(text) => {
                    onChange(text.trim());
                  }}
                  value={value}
                  width="100%"
                />
              )}
              name="email"
              defaultValue=""
            />
            <Controller
              control={control}
              rules={registerOptions.password}
              render={({ field: { onChange, onBlur, value } }) => (
                <AppFormField
                  name="password"
                  icon={"key-variant"}
                  color={colors.darkGray}
                  placeholder={"Password"}
                  secureTextEntry
                  textContentType="password"
                  onChangeText={onChange}
                  value={value}
                  onSubmitEditing={
                    !error.length ? handleSubmit(onSubmit) : null
                  }
                  returnKeyType="done"
                  width="100%"
                />
              )}
              name="password"
              defaultValue=""
            />
            <TouchableOpacity
              onPress={!error.length ? handleSubmit(onSubmit) : null}
              style={styles.submit}
            >
              <AppText style={styles.submitButton}>Sign Up</AppText>
            </TouchableOpacity>
            <View style={{ height: 15 }} />
          </KeyboardAwareScrollView>
        </View>

        <View style={{ marginBottom: 30 }}>
          <AppText style={styles.bySigning}>
            Before you start using OneClimb please read
          </AppText>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => setVisible(!visible)}
          >
            <AppText style={styles.terms}>Terms & Conditions</AppText>
          </TouchableOpacity>
        </View>
      </View>

      <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
        <View style={{ height: windowHeight }}>
          <View
            style={[
              windowHeight < 750 ? { marginTop: 10 } : { marginTop: 54 },
              styles.headerOverlay,
            ]}
          >
            <TouchableOpacity
              style={styles.goBackButton}
              onPress={toggleOverlay}
            >
              <Ionicons name="chevron-back" size={18} color={colors.black} />
            </TouchableOpacity>
            <AppText style={styles.titleOverlay}>Terms of Service</AppText>
          </View>
          <ScrollView style={styles.scrollText}>
            <PrivacyPolicy />
          </ScrollView>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => setVisible(!visible)}
            style={{ alignItems: "center" }}
          >
            <View style={[styles.submit, { bottom: 25 }]}>
              <AppText style={styles.submitButton}>Confirm</AppText>
            </View>
          </TouchableOpacity>
        </View>
      </Overlay>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    right: 0,
    top: 0,
    left: 0,
    flexDirection: "column",
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "space-between",
  },
  backArrow: {
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 20,
    elevation: 20,
  },

  image: {
    width: windowWidth,
    height: windowHeight * 0.51,
  },
  imageText: {
    width: 100,
    height: 83.33,
    marginTop: -384,
  },

  errorBox: {
    marginVertical: 10,
  },

  registerText: {
    fontFamily: "poppinsSemiBold",
    fontSize: 28,
    lineHeight: 42,
    fontWeight: "600",
    alignSelf: "flex-start",
    color: colors.darkBlue,
    marginTop: 20,
  },
  orangeText: {
    fontFamily: "nunito",
    color: colors.oneClimbOrange,
    fontSize: 16,
    lineHeight: 26,
  },
  fContainer: {
    width: windowWidth,
    alignItems: "center",
    backgroundColor: colors.white,
    borderTopRightRadius: 25,
  },
  submit: {
    alignSelf: "center",
    backgroundColor: colors.oneClimbOrange,
    width: windowWidth * 0.9,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 42,
    marginTop: 15,
  },
  submitButton: {
    color: colors.white,
    fontFamily: "poppinsSemiBold",
    fontWeight: "600",
    fontSize: 18,
    lineHeight: 27,
  },

  signUpContainer: {
    alignSelf: "center",
    marginTop: 20,
  },
  signUpText: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 19,
  },
  noAccountText: {
    color: colors.medium,
  },
  headerContainer: {
    alignItems: "flex-start",
    flex: 0.8,
    paddingRight: 5,
    marginLeft: -35,
  },
  formContainer: {
    width: windowWidth,
    alignItems: "center",
    marginTop: 25,
    paddingBottom: 40,
  },

  goBackButton: {
    flex: 0.1,
    marginTop: -30,
    zIndex: 20,
    elevation: 20,
  },
  bySigning: {
    fontFamily: "nunito",
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 20,
    alignSelf: "center",
  },
  terms: {
    fontSize: 12,
    fontWeight: "400",
    fontFamily: "nunito",
    color: colors.black2,
    alignSelf: "center",
    textDecorationLine: "underline",
    lineHeight: 20,
  },
  scrollText: {
    padding: 20,
  },
  confirmButton: {
    width: 80,
    height: 30,
    backgroundColor: colors.hearted,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollText: {
    padding: 20,
  },
  goBackButton: {
    alignSelf: "center",
    zIndex: 20,
    elevation: 20,
    paddingLeft: 10,
  },
  headerOverlay: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleOverlay: {
    fontFamily: "nunitoBold",
    fontWeight: "bold",
    fontSize: 28,
    lineHeight: 38,
    color: colors.black2,
    paddingRight: 90,
  },
});

export default RegisterScreen;
