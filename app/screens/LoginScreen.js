import React, { useState, useContext, useEffect } from "react";
import {
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
  ImageBackground,
  Dimensions,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { Divider } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";

import { AppFormField, ErrorMessage } from "../components/forms";
import AppText from "../components/AppText";
import colors from "../config/colors";
import AuthContext from "../auth/context";
import { signIn } from "../api/firebase";
import AppleSignIn from "../components/AppleSignIn";
import { LinearGradient } from "expo-linear-gradient";

import GoogleSignIn from "../components/GoogleSignIn";
import { getAuth, sendEmailVerification } from "firebase/auth";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

function LoginScreen({ navigation }) {
  const auth = getAuth();
  const [message, setMessage] = useState();
  const [errorText, setErrorText] = useState("");
  const [sendVerifyMailVisible, setSendVerifyMailVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const { setUser } = useContext(AuthContext);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = ({ email, password }) =>
    signIn(
      email,
      password,
      navigation,
      setErrorText,
      setUser,
      setSendVerifyMailVisible
    );
  const logInOptions = {
    email: {
      required: "Email is required",
    },
    password: {
      required: "Password is required",
    },
  };

  useEffect(() => {
    return () => {
      setMessage();
      setErrorText("");
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={{ alignItems: "center" }}>
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
          style={styles.imageText}
          source={require("../assets/oneClimbText.png")}
        />
        <View style={styles.fContainer}>
          {sendVerifyMailVisible && (
            <TouchableOpacity
              style={{ marginLeft: 20, marginTop: 5 }}
              onPress={() => {
                sendEmailVerification(auth.currentUser);
                Alert.alert(
                  `Verification e-mail sent`,
                  `Once you verify your e-mail, you will be able to use the app`,
                  [{ text: "Close", onPress: () => {} }]
                );
              }}
            >
              <AppText style={{ fontSize: 15, color: "dodgerblue" }}>
                Resend verification e-mail
              </AppText>
            </TouchableOpacity>
          )}

          <AppText style={styles.login}>Login</AppText>
          <View>
            <Controller
              control={control}
              rules={logInOptions.email}
              render={({ field: { onChange, onBlur, value } }) => (
                <AppFormField
                  autoCorrect={false}
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
                />
              )}
              name="email"
              defaultValue=""
            />
            <Controller
              control={control}
              rules={logInOptions.password}
              render={({ field: { onChange, onBlur, value } }) => (
                <AppFormField
                  name="password"
                  secureTextEntry
                  icon={"key-variant"}
                  color={colors.darkGray}
                  placeholder={"Password"}
                  textContentType="password"
                  onChangeText={onChange}
                  value={value}
                  onSubmitEditing={handleSubmit(onSubmit)}
                  returnKeyType="done"
                  error={errors}
                  message={message}
                />
              )}
              name="password"
              defaultValue=""
            />
          </View>

          <View style={styles.forgotPass}>
            <ErrorMessage
              visible={true}
              error={
                errors.email
                  ? errors.email.message
                  : errors.password
                  ? errors.password.message
                  : errorText
              }
            />
          </View>
          <View style={styles.forgotPass}>
            <TouchableOpacity
              style={{ alignItems: "flex-start" }}
              onPress={() => navigation.navigate("ForgotPassword")}
            >
              <AppText style={styles.forgotPassText}>
                Forgot your password?
              </AppText>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            // onPress={() => {
            //   navigation.navigate("Home");
            // }}
            style={styles.submit}
          >
            <AppText style={styles.submitButton}>Login</AppText>
          </TouchableOpacity>
        </View>
        <View
          style={
            windowHeight < 700
              ? [styles.dividerContainer, { marginBottom: 10, marginTop: 5 }]
              : styles.dividerContainer
          }
        >
          <Divider style={styles.divider} />
          <AppText style={styles.or}>or</AppText>
          <Divider style={styles.divider} />
        </View>
        {/* <View style={styles.socialContainer}>
          <GoogleSignIn />
          <AppleSignIn />
        </View> */}
        <View
        // style={{ bottom: 33 }}
        >
          <View style={styles.signUpContainer}>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <AppText style={styles.noAccountText}>
                New User?
                <AppText style={styles.signUpText}> Sign up</AppText>
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
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
  image: {
    width: windowWidth,
    height: windowHeight * 0.51,
  },
  imageText: {
    width: 100,
    height: 83.33,
    marginTop: -314,
  },
  login: {
    fontFamily: "poppinsSemiBold",
    fontSize: 28,
    lineHeight: 42,
    fontWeight: "600",
    alignSelf: "flex-start",
    color: colors.darkBlue,
    marginHorizontal: 25,
    marginTop: 20,
  },

  fContainer: {
    width: windowWidth,
    alignItems: "center",
    marginTop: windowHeight * 0.08,
    backgroundColor: colors.white,
    marginHorizontal: 25,
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
  dividerContainer: {
    flexDirection: "row",
    marginTop: 12,
    alignItems: "center",
    marginBottom: 20,
  },

  or: {
    fontSize: 16,
    fontWeight: "400",
    fontFamily: "nunito",
    color: colors.black2,
    marginLeft: 20,
    marginRight: 20,
  },
  divider: {
    width: 138,
    height: 1,
    color: colors.gray2,
  },
  copyContainer: {
    flex: 2,
  },
  copy: {
    height: 40,
    alignSelf: "flex-start",
    top: 80,
    left: 20,
  },
  logo: {
    width: 110,
    height: 100,
    alignSelf: "flex-end",
    top: 70,
    right: 20,
  },
  signUpContainer: {
    alignSelf: "center",
    marginTop: "2%",
  },
  signUpText: {
    color: colors.oneClimbOrange,
    fontWeight: "700",
    fontSize: 16,
    fontFamily: "poppinsSemiBold",
    lineHeight: 24,
  },
  noAccountText: {
    color: colors.darkGray,
    fontSize: 16,
    fontFamily: "poppinsSemiBold",
    fontWeight: "700",
    lineHeight: 24,
  },
  bySigning: {
    fontFamily: "nunito",
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 20,
    alignSelf: "center",
  },
  formContainer: {
    top: "8%",
  },
  socialContainer: {
    flex: 1,
  },
  forgotPass: {
    width: windowWidth,
    flexDirection: "column",
    alignItems: "flex-start",
    color: colors.white,
    justifyContent: "flex-start",
    zIndex: 100,
    elevation: 100,
    marginLeft: 69,
  },
  forgotPassText: {
    color: colors.oneClimbOrange,
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "nunitoBold",
    marginRight: 45,
    lineHeight: 19,
    marginTop: -2,
  },
  terms: {
    fontSize: 12,
    fontWeight: "400",
    fontFamily: "nunito",
    color: "dodgerblue",
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
  errors: {
    color: colors.warning2,
    fontFamily: "nunito",
    fontSize: 12,
    lineHeight: 22,
    fontWeight: "400",
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

export default LoginScreen;
