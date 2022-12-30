import React, { useRef } from "react";
import { StyleSheet, TouchableOpacity, View, Dimensions } from "react-native";
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";
import { Entypo } from "@expo/vector-icons";

import colors from "../config/colors";
//import PlacePostConnect from "./PlacePostConnect";

const windowHeight = Dimensions.get("window").height;

const UploadButton = ({ ...otherProps }) => {
  const modalRef = useRef();

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.6}
        style={styles.themeCircle}
        onPress={() => modalRef?.current?.open()}
      >
        <View style={styles.plusIcon}>
          <Entypo name="plus" size={35} color="white" />
        </View>
      </TouchableOpacity>
      <Portal>
        <Modalize
          ref={modalRef}
          modalHeight={windowHeight * 0.7}
          onBackButtonPress={() => modalRef?.current?.close()}
          handleStyle={{ display: "none" }}
          overlayStyle={{ backgroundColor: "rgba(0, 0, 0, 0.25)" }}
          modalStyle={{
            shadowOpacity: 0.25,
            shadowOffset: { width: 0, height: -5 },
          }}
          scrollViewProps={{
            bounces: false,
            keyboardShouldPersistTaps: "always",
          }}
        >
          {/* <PlacePostConnect {...otherProps} modalRef={modalRef} /> */}
        </Modalize>
      </Portal>
    </>
  );
};

export default UploadButton;

const styles = StyleSheet.create({
  themeCircle: {
    position: "absolute",
    width: 60,
    height: 60,
    right: 20,
    bottom: 20,
    justifyContent: "center",
    borderRadius: 60 / 2,
    backgroundColor: "rgba(249, 85, 148, 0.45)",
    shadowColor: colors.hearted2,
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowRadius: 60 / 2,
    padding: 10,
    margin: 8,
    zIndex: 2000,
  },
  plusIcon: {
    left: 3,
  },
});
