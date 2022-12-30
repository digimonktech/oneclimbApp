import * as Font from 'expo-font';

export default useFonts = async () =>
  await Font.loadAsync({
    poppins: require('../assets/fonts/Poppins-Regular.ttf'),
    nunito: require('../assets/fonts/Nunito-Regular.ttf'),
    nunitoRegular: require('../assets/fonts/Nunito-Regular.ttf'),
    nunitoBold: require('../assets/fonts/Nunito-Bold.ttf'),
    nunitoItalic: require('../assets/fonts/Nunito-Italic.ttf'),
    poppinsSemiBold: require('../assets/fonts/Poppins-SemiBold.ttf'),
  });
