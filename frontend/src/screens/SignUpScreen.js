import React, { useContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AnimatedLoader from "react-native-animated-loader";
import { AuthContext } from "../components/AuthContext";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts } from "expo-font";
import * as Localization from "expo-localization";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView, 
  ScrollView
} from "react-native";
import EllipseSVG from "../assets/images/Ellipse.svg";
const API_URL = "http://192.168.1.23:3000/api/v1";
import i18n from "i18n-js";
import { fr, en } from "../assets/i18n/supportedLanguages";
const SignUpScreen = ({navigation}) => {
  i18n.fallbacks = true;
  i18n.translations = { en,fr };
  i18n.locale = Localization.locale;
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastNme] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState("");
  const { signUp } = useContext(AuthContext);

  const onLoggedIn = async (token) => {
    fetch(`${API_URL}/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        try {
          const jsonRes = await res.json();
          if (res.status === 200) {
            await AsyncStorage.setItem("currentId", jsonRes.id);
            await AsyncStorage.setItem(
              "name",
              jsonRes.firstName + " " + jsonRes.lastName
            );
            await AsyncStorage.setItem("email", jsonRes.email);
            await AsyncStorage.setItem("user-language", jsonRes.language)
          }
        } catch (err) {
          console.log(err);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const haveAccount = () => {
    navigation.navigate("SignIn");
  };
  const onSubmitHandler = async()=>{
    setIsLoading(true);
    let phone = "+216"+phoneNumber;
    const payload = {
      email,
      password,
      phoneNumber:phone,
      language:  i18n.locale,
      firstName,
      lastName
    };

    await fetch(`${API_URL}/auth/register`,{
      method:"POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
    .then(async (res)=>{
      try{
        const jsonRes = await res.json();
        console.log(jsonRes)

        if(res.status !==200) {
          const { message } = jsonRes.errors[0];
          setIsError(true);
          setMessage(message);
          setIsLoading(false);
        } else {
          try {
            console.log("here")
            await onLoggedIn(jsonRes.accessToken);
            signUp(jsonRes.accessToken);
            setIsError(false);
            setIsLoading(false);
            navigation.navigate("Weather");
          } catch (error) {
            console.log(error);
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    })
  }

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
    <KeyboardAvoidingView style={{flex:1, backgroundColor:"white"}} behavior="heigth">
    <ScrollView>
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: "center",
        backgroundColor: "white",
        marginTop: -500,
      }}
    >
      <EllipseSVG style={styles.bg} />
      <View>
        <Text style={styles.textSignIn}>{i18n.t('form.signUp')}</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder={i18n.t('form.firstName')}
        keyboardType="default"
        onChangeText={setFirstName}
      />
        <TextInput
        style={styles.input}
        placeholder={i18n.t('form.lastName')}
        keyboardType="default"
        onChangeText={setLastNme}
      />
      
      <TextInput
        style={styles.input}
        placeholder={i18n.t('form.phoneNumber')}
        keyboardType="number-pad"
        onChangeText={setPhoneNumber}
      />
      <TextInput
        style={styles.input}
        placeholder={i18n.t('form.email')}
        keyboardType="email-address"
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder={i18n.t('form.password')}
        secureTextEntry={true}
        onChangeText={setPassword}
      />
      <Text style={[styles.message, { color: "red" }]}>
        {isError ? message : null}
      </Text>
      <View>
        <TouchableOpacity onPress={haveAccount}>
          <Text style={styles.psdTxt}>{i18n.t('buttons.doHaveAccount') +" ? " +i18n.t('form.signIn')}</Text>
        </TouchableOpacity>
      </View>
      <LinearGradient
        colors={["#FF4E70", "#F69252"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.button}
      >
      <TouchableOpacity onPress={onSubmitHandler}>
        <Text style={styles.text}>{i18n.t('buttons.next')}</Text>
      </TouchableOpacity>
      </LinearGradient>

      <TouchableOpacity
        style={[
          styles.button,
          { borderColor: "#FF4E70", borderWidth: 2, borderStyle: "solid" },
        ]}
        onPress={() => navigation.navigate("Onboarding")}
      >
        <Text style={[styles.text, { color: "#FF4E70" }]}>
        {i18n.t('buttons.goBack')}
        </Text>
      </TouchableOpacity>
      <View style={styles.container}>
        <AnimatedLoader
          visible={isLoading}
          overlayColor="rgba(255,255,255,255)"
          animationStyle={styles.lottie}
          speed={1}
          source={require("../assets/lottie/loader-colors.json")} // Add here
        />
      </View>
    </SafeAreaView>
    </ScrollView>
    </KeyboardAvoidingView>
  );
};
// define your styles
const styles = StyleSheet.create({
  btnTxt: {
    color: "white",
    fontFamily: "Poppins-SemiBold",
    fontSize: 15,
    height: "100%",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  lottie: {
    width: 300,
    height: 300,
  },
  bg: {
    top: 500,
  },
  textSignIn: {
    width: 250,
    height: 48,
    left: -50,
    fontFamily: "Poppins-SemiBold",
    fontStyle: "normal",
    fontSize: 32,
    color: "#002B7F",
  },
  text: {
    width: 250,
    height: 24,
    fontFamily: "Poppins-Regular",
    fontSize: 16,
    textAlign: "center",
    color: "#FFFFFF",
  },
  imgModal: {
    height: 150,
    width: 150,
    marginVertical: 10,
  },
  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 20,
    height: "50%",
    elevation: 20,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderColor: "#B1B1B1",
    borderRadius: 15,
    borderStyle: "solid",
    flexDirection: "row",
    width: "90%",
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
  message: {
    fontSize: 14,
    marginBottom: 10,
    fontFamily: "Poppins-Regular",
  },
  psdTxt: {
    color: "#4E607D",
    textAlign: "right",
    fontFamily: "Poppins-SemiBold",
    fontSize: 12,
    marginRight: -120,
    marginBottom: 20,
    marginTop: -10,
  },
  btnModal: {
    width: "50%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    width: "90%",
    height: 47,
    borderRadius: 15,
  },
});
export default SignUpScreen;
