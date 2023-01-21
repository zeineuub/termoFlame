import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Image, Text, Switch } from "react-native";
import {
  Title,
  Caption,
  Drawer,
  useTheme,
  TouchableRipple,
} from "react-native-paper";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { AuthContext } from "../components/AuthContext";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { useDrawerStatus } from "@react-navigation/drawer";
import * as Localization from "expo-localization";
import i18n from "i18n-js";
import { fr, en } from "../assets/i18n/supportedLanguages";
export function DrawerContent(props) {
  const [user, setUser] = useState({});
  const isOpen = useDrawerStatus();

  const { signOut, toggleTheme } = useContext(AuthContext);
  useEffect(() => {
    
    if (isOpen == "open") {
      i18n.fallbacks = true;
      i18n.translations = { en, fr };
      setTimeout(async () => {
        try {
          const name = await AsyncStorage.getItem("name");
          const email = await AsyncStorage.getItem("email");
          const language = await AsyncStorage.getItem("user-language");
          i18n.locale = language
          const loggedUser = {
            email,
            name,
          };
          setUser(loggedUser);
        } catch (e) {
          console.log(e);
        }
      }, 100);
    }
  }, [isOpen]);
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
    <View style={{ flex: 1, marginTop: -10 }}>
      <DrawerContentScrollView scrollEnabled={false} {...props}>
        <LinearGradient
          colors={["#FF4E70", "#F69252"]}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
          style={{ height: 800 }}
        >
          <View style={styles.drawerContent}>
            <View style={styles.userInfoSection}>
              <View
                style={{
                  flexDirection: "column",
                  marginTop: 15,
                  alignItems: "center",
                }}
              >
                  <Image
                    source={require("../assets/images/avatar.png")}
                    style={styles.avatar}
                  />
                <View style={{ marginLeft: 15, flexDirection: "column" }}>
                  <Title style={styles.title}>{user.name}</Title>
                  <Caption style={styles.caption}>{user.email}</Caption>
                </View>
                <View
                  style={{
                    borderBottomColor: "white",
                    borderBottomWidth: 2,
                  }}
                />
              </View>
            </View>

            <Drawer.Section style={styles.drawerSection}>
              <DrawerItem
                icon={({ color, size, focused }) => (
                  <Icon
                    color={color}
                    size={size}
                    name={focused ? "home" : "home-outline"}
                  />
                )}
                activeBackgroundColor="white"
                activeTintColor="black"
                inactiveTintColor="black"
                label={i18n.t("drawer.home")}
                onPress={() => {
                  props.navigation.navigate("WeatherStack");
                }}
              />
              <DrawerItem
                icon={({ color, size, focused }) => (
                  <Icon
                    name={focused ? "account" : "account-outline"}
                    color={color}
                    size={size}
                  />
                )}
                label={i18n.t("drawer.profile")}
                activeBackgroundColor="white"
                activeTintColor="black"
                inactiveTintColor="black"
                onPress={() => {
                  props.navigation.navigate("ProfileStack");
                }}
              />
              <DrawerItem
                icon={({ color, size }) => (
                  <Icon name="exit-to-app" color={color} size={size} />
                )}
                label={i18n.t("drawer.logout")}
                activeBackgroundColor="white"
                activeTintColor="black"
                inactiveTintColor="black"
                onPress={() => {
                  signOut();
                }}
              />
            </Drawer.Section>
          </View>
        </LinearGradient>
      </DrawerContentScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    top: 15,
  },
  userInfoSection: {
    paddingLeft: 0,
  },
  title: {
    fontSize: 14,
    marginTop: 3,
    fontFamily: "Poppins-Bold",
    textAlign: "center",
  },
  preference: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  caption: {
    fontSize: 12,
    lineHeight: 14,
    fontFamily: "Poppins-SemiBold",
    textAlign: "center",
  },
  drawerSection: {
    marginTop: 15,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 63,
    borderWidth: 3,
    alignSelf: "center",
  },
});
