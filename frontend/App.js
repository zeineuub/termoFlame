import React, { useEffect, useMemo, useReducer, useState } from "react";
import {
  NavigationContainer,
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
} from "@react-navigation/native";

import { createDrawerNavigator } from "@react-navigation/drawer";
import { AuthContext } from "./src/components/AuthContext";
import AuthStack from "./src/navigation/AuthStack";
import SplashScreen from "./src/screens/SplashScreen";
import { DrawerContent } from "./src/screens/DrawerContent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProfileStack from "./src/navigation/ProfileStack";
import WeatherStack from "./src/navigation/WeatherStack";
import { StatusBar } from "react-native";
import {
  Provider as PaperProvider,
  DefaultTheme as PaperDefaultTheme,
  DarkTheme as PaperDarkTheme,
} from "react-native-paper";
const Drawer = createDrawerNavigator();

function App() {
  const [isDarkTheme, setIsDarkTheme] = React.useState(false);

  const initialLoginState = {
    isLoading: true,
    userToken: null,
  };
  const CustomDefaultTheme = {
    ...NavigationDefaultTheme,
    ...PaperDefaultTheme,
    colors: {
      ...NavigationDefaultTheme.colors,
      ...PaperDefaultTheme.colors,
      background: "#ffffff",
      text: "#333333",
    },
  };

  const CustomDarkTheme = {
    ...NavigationDarkTheme,
    ...PaperDarkTheme,
    colors: {
      ...NavigationDarkTheme.colors,
      ...PaperDarkTheme.colors,
      background: "#333333",
      text: "#ffffff",
    },
  };
  const theme = isDarkTheme ? CustomDarkTheme : CustomDefaultTheme;

  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case "RETRIEVE_TOKEN":
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case "LOGIN":
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case "LOGOUT":
        return {
          ...prevState,
          userToken: null,
          isLoading: false,
        };
      case "REGISTER":
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
    }
  };
  const [loginState, dispatch] = useReducer(loginReducer, initialLoginState);
  const authContext = useMemo(
    () => ({
      signIn: async (token) => {
        const userToken = token;
        try {
          await AsyncStorage.setItem("accessToken", userToken);
        } catch (e) {
          console.log(e);
        }
        dispatch({ type: "LOGIN", token: userToken });
      },
      signOut: async () => {
        // setUserToken(null);
        // setIsLoading(false);
        try {
          await AsyncStorage.removeItem("accessToken");
        } catch (e) {
          console.log(e);
        }
        dispatch({ type: "LOGOUT" });
      },
      signUp: async(token) => {
          const userToken = token;
          try {
            await AsyncStorage.setItem("accessToken", userToken);
          } catch (e) {
            console.log(e);
          }
          dispatch({ type: "REGISTER", token: userToken });
      },
      toggleTheme: () => {
        setIsDarkTheme(isDarkTheme => !isDarkTheme);
      },
    }),
    []
  );
  useEffect(() => {
    setTimeout(async () => {
      // setIsLoading(false);
      let userToken;
      userToken = null;
      try {
        userToken = await AsyncStorage.getItem("accessToken");
      } catch (e) {
        console.log(e);
      }
      // console.log('user token: ', userToken);
      dispatch({ type: "RETRIEVE_TOKEN", token: userToken });
    }, 1000);
  }, []);
  if (loginState.isLoading) {
    return <SplashScreen />;
  }
  return (
    <PaperProvider theme={theme}>
    <AuthContext.Provider value={authContext}>
      <StatusBar animated={true} barStyle="light-content" />
      <NavigationContainer theme={theme} >
        {loginState.userToken !== null ? (
          <Drawer.Navigator
            initialRouteName="WeatherStack"
            screenOptions={{
              headerShadowVisible: false,
              headerShown: false,
              drawerActiveBackgroundColor: "white",
              drawerActiveTintColor: "black",
              drawerInactiveTintColor: "white",
              drawerLabelStyle: {
                marginLeft: -25,
                fontFamily: "Poppins-Medium",
                fontSize: 15,
              },
            }}
            drawerContent={(props) => <DrawerContent {...props} />}
          >
            <Drawer.Screen
              name="WeatherStack"
              component={WeatherStack}
              options={{
                title: "",
                animationEnabled: false,
              }}
            />
            <Drawer.Screen
              name="ProfileStack"
              component={ProfileStack}
              options={{
                title: "",
                animationEnabled: false,
              }}
            />
          </Drawer.Navigator>
        ) : (
          <AuthStack />
        )}
      </NavigationContainer>
    </AuthContext.Provider>
    </PaperProvider>
  );
}
export default App;
