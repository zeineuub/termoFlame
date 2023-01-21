import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import BgRightSVG from "../assets/images/bg-right.svg";
import BgLeftSVG from "../assets/images/bg-left.svg";
import OnBroadingSVG from "../assets/images/onBroading.svg";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import * as Localization from "expo-localization";

import i18n from "i18n-js";
import { fr, en } from "../assets/i18n/supportedLanguages";

const OnboardingScreen = ({ navigation }) => {
  i18n.fallbacks = true;
  i18n.translations = { en,fr };
  i18n.locale = Localization.locale;
  const [loaded] = useFonts({
    "Poppins-Regular": require("../../assets/fonts/Poppins-Regular.otf"),
    "Poppins-Medium": require("../../assets/fonts/Poppins-Medium.otf"),
    "Poppins-SemiBold": require("../../assets/fonts/Poppins-SemiBold.otf"),
    "Poppins-Bold": require("../../assets/fonts/Poppins-Bold.otf"),
  });

  if (!loaded) {
    return null;
  }
  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: "center",
        backgroundColor: "white",
        justifyContent: "center",
        marginTop: -300,
      }}
    >
      <BgRightSVG style={styles.bgr} />
      <BgLeftSVG style={styles.bgl} />
      <View>
        <OnBroadingSVG style={styles.onbroading} />
      </View>
      <View>
        <Text style={styles.welcome}>{i18n.t('onbroading.welcomeMessage')}</Text>
      </View>
      <LinearGradient
        colors={["#FF4E70", "#F69252"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.button}
      >
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={styles.text}>{i18n.t('buttons.createAccount')}</Text>
        </TouchableOpacity>
      </LinearGradient>
      <TouchableOpacity
        style={[
          styles.button,
          { borderColor: "#FF4E70", borderWidth: 2, borderStyle: "solid" },
        ]}
        onPress={() => navigation.navigate("SignIn")}
      >
        <Text style={[styles.text, { color: "#FF4E70" }]}>
        {i18n.t('buttons.doHaveAccount')}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
// define your styles
const styles = StyleSheet.create({
  bgr: {
    width: "90%",
    right: -150,
    top: 250,
  },
  bgl: {
    width: "50%",
    left: -100,
  },
  button: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    width: "90%",
    height: 47,
    borderRadius: 15,
    marginBottom: 20,
  },
  text: {
    width: 250,
    height: 24,
    fontFamily: "Poppins-Regular",
    fontStyle: "normal",
    fontSize: 16,
    textAlign: "center",
    color: "#FFFFFF",
    flexGrow: 1,
  },
  welcome: {
    marginBottom: 20,
    width: 311,
    height: 96,
    fontFamily: "Poppins-SemiBold",
    fontSize: 32,
    textAlign: "center",
    color: "#002B7F",
  },
});
export default OnboardingScreen;
