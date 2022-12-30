import React, { useRef, useEffect } from "react";
import LottieView from "lottie-react-native";
import { StyleSheet } from "react-native";

const LottieIcon = ({ source, size, style }) => {
  const animationRef = useRef();

  useEffect(() => {
    animationRef?.current?.play();
  }, []);

  return (
    <LottieView
      ref={animationRef}
      style={[
        styles.lottie,
        style,
        {
          width: size,
          height: size,
        },
      ]}
      source={source}
    />
  );
};

const styles = StyleSheet.create({
  lottie: {
    backgroundColor: "rgba(0,0,0,0.0)",
    position: "absolute",
    zIndex: 20,
    alignSelf: "center",
    top: "35%",
  },
});

export default LottieIcon;
