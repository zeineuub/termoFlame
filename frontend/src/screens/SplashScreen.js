import React from "react";
import { View, Text, StyleSheet, StatusBar } from "react-native";
import REDFLAME from "../assets/images/redFlame.svg";
import { useFonts } from 'expo-font';
import * as Localization from "expo-localization";

import i18n from "i18n-js";
import { fr, en } from "../assets/i18n/supportedLanguages";
const SplashScreen = () => {
  i18n.fallbacks = true;
  i18n.translations = { en,fr };
  i18n.locale = Localization.locale;
  const [loaded] = useFonts({
    "Poppins-Regular": require('../../assets/fonts/Poppins-Regular.otf'),
    "Poppins-Medium": require('../../assets/fonts/Poppins-Medium.otf'),
    "Poppins-SemiBold": require('../../assets/fonts/Poppins-SemiBold.otf'),
    "Poppins-Bold": require('../../assets/fonts/Poppins-Bold.otf')
  });

  if (!loaded) {
    return null;
  }
  return (
    <View style={styles.container}>
      <StatusBar animated={true} barStyle="dark-content" />
      <View style={styles.header}>
        <REDFLAME style={styles.img} />
        <Text style={styles.text}>
          Facile, complète, immédate et pour tous.
        </Text>
      </View>
    </View>
  );
};
export default SplashScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  img: {
    width: 258,
    height: 258,
  },
  text: {
    width: 281,
    height: 58,
    fontFamily: "Roboto",
    fontSize: 16,
    lineHeight: 24,
    color: "#474747",
    textAlign: "center",
  },
});
