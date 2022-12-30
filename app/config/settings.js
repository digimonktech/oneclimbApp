import Constants from "expo-constants";

const settings = {
  dev: {
    apiUrl: "http://192.168.0.2:3000/api",
    assetsBaseUrl: "http://192.168.0.2:3000/assets/",
    FB_APP_ID: "304410727940390",
  },
  staging: {
    apiUrl: "https://hearted-api.herokuapp.com/api",
  },
  prod: {
    apiUrl: "https://hearted-api.herokuapp.com/api",
  },
};

const getCurrentSettings = () => {
  if (__DEV__) return settings.dev;
  if (Constants.manifest.releaseChannel === "staging") return settings.staging;
  return settings.prod;
};

export default getCurrentSettings();
