import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  SafeAreaView,
  TextInput,
  ToastAndroid,
  RefreshControl,
} from "react-native";
import { useFonts } from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AnimatedLoader from "react-native-animated-loader";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
const API_URL = "https://192.168.1.23:3000/api/v1";
import * as Localization from "expo-localization";
import { useIsFocused } from '@react-navigation/native';
import i18n from "i18n-js";
import { fr, en } from "../assets/i18n/supportedLanguages";
const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};
const ProfileScreen = ({ navigation }) => {
  i18n.fallbacks = true;
  i18n.translations = { en,fr };
  i18n.locale = Localization.locale;
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState("false");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  // This hook returns `true` if the screen is focused, `false` otherwise
  const isFocused = useIsFocused();
  const [image, setImage] = useState(
    "https://imagevars.gulfnews.com/2021/03/03/Stock-Smartphone_177f82cc942_large.jpg"
  );
  const showToast = (message) => {
    ToastAndroid.showWithGravity(message, ToastAndroid.LONG, ToastAndroid.TOP);
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    onLoggedIn(token);
    wait(1000).then(() => setRefreshing(false));
  }, []);
  const onLoggedIn = async (token) => {
    await fetch(`${API_URL}/auth/me`, {
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
            const user = {
              firstName: jsonRes.firstName,
              lastName: jsonRes.lastName,
              email: jsonRes.email,
              phoneNumber: jsonRes.phoneNumber,
              id: jsonRes.id,
            };
            setUser(user);
          }
        } catch (err) {
          console.log(err);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const onSubmitHandler = async () => {
    const payload = {
      email: email ? email : user.email,
      firstName: firstName ? firstName : user.firstName,
      lastName: lastName ? lastName : user.lastName,
      phoneNumber: phoneNumber ? phoneNumber : user.phoneNumber,
    };
    await fetch(`${API_URL}/user/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        try {
          const jsonRes = await res.json();
          if (res.status !== 200) {
            const { message } = jsonRes.errors[0];
            showToast(message);
          } else {
            setUser(jsonRes.user);
            try {
              await AsyncStorage.setItem("user", user);
            } catch (err) {
              console.log(err);
            }
            showToast(i18n.t('toast.updateAccount'));
          }
        } catch (err) {
          console.log(err);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    const init = async()=>{
      i18n.fallbacks = true;
      i18n.translations = { en,fr };
      try {
        const language = await AsyncStorage.getItem("user-language");
        i18n.locale = language;
        const token = await AsyncStorage.getItem("accessToken");
        console.log(accessToken)
        await onLoggedIn(token);
        setToken(token);
      } catch (e) {
        console.log(e);
      }
    }
     init();
  }, [isFocused]);

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
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "white" }}
      behavior="heigth"
    >
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <SafeAreaView
          style={{
            flex: 1,
            alignItems: "center",
          }}
        >
          <View style={styles.header}>
            <Image
              style={styles.backgroundImage}
              source={require("../assets/images/up-user-details-background.84295f2e.jpg")}
            />
            <TouchableOpacity onPress={()=>{}}>
              <Image  source={require("../assets/images/avatar.png")} style={styles.avatar} />
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Icon
                  name="camera"
                  size={20}
                  color="#fff"
                  style={{
                    opacity: 0.7,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#DCDCDC",
                    borderRadius: 20,
                    padding: 6,
                    height: 30,
                    width: 30,
                    marginBottom: 0,
                    marginTop: -40,
                    position: "relative",
                    right: -40,
                  }}
                />
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.body}>
            <View style={styles.bodyContent}>
              <TextInput
                style={styles.input}
                placeholder={i18n.t('form.firstName')}
                defaultValue={user.firstName}
                keyboardType="default"
                onChangeText={setFirstName}
              />
              <TextInput
                style={styles.input}
                placeholder={i18n.t('form.lastName')}
                defaultValue={user.lastName}
                keyboardType="default"
                onChangeText={setLastName}
              />
              <TextInput
                style={styles.input}
                placeholder={i18n.t('form.email')}
                defaultValue={user.email}
                keyboardType="email-address"
                onChangeText={setEmail}
              />
              <TextInput
                style={styles.input}
                placeholder="+216"
                defaultValue={user.phoneNumber}
                keyboardType="phone-pad"
                onChangeText={setPhoneNumber}
              />
              <LinearGradient
                colors={["#F16694", "#F16072", "#F69252"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.button}
              >
                <TouchableOpacity onPress={onSubmitHandler}>
                  <Text style={styles.text}>{i18n.t('buttons.save')}</Text>
                </TouchableOpacity>
              </LinearGradient>
              <TouchableOpacity style={styles.button}>
                <Text style={[styles.text, { color: "#F69252" }]}>{i18n.t('buttons.cancel')}</Text>
              </TouchableOpacity>
            </View>
          </View>
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
export default ProfileScreen;
const styles = StyleSheet.create({
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
  header: {
    width: "100%",
    height: 220,
  },
  backgroundImage: {
    resizeMode: "stretch",
    height: 200,
    width: "100%",
  },
  text: {
    width: 250,
    height: 24,
    fontFamily: "Poppins-Regular",
    fontSize: 16,
    textAlign: "center",
    color: "#FFFFFF",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderColor: "#e9ecef",
    borderRadius: 20,
    borderStyle: "solid",
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "100%",
  },
  button: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    width: "100%",
    height: 47,
    borderRadius: 15,
    marginBottom: 20,
    top: 10,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 3,
    borderColor: "white",
    marginBottom: 10,
    alignSelf: "center",
    marginTop: -60,
  },
  body: {
    marginTop: 40,
  },
  bodyContent: {
    alignItems: "center",
    top: 20,
  },
  panelHeader: {
    alignItems: "center",
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00000040",
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: "gray",
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: "rgb(241, 96, 114)",
    alignItems: "center",
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "white",
  },
  panel: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 5,
    shadowOpacity: 0.4,
  },
  pannelHeader: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#333333",
    shadowOffset: { width: -1, height: -3 },
    shadowRadius: 2,
    shadowOpacity: 0.4,
    elevation: 5,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});
