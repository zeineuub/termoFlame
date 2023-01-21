import React from "react";
import { View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MENUSVG from "../assets/images/menu.svg";
import WeatherScreen from "../screens/WeatherScreen";
const Stack = createNativeStackNavigator();
const WeatherStack = ({ navigation }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerTransparent: true,
        headerStyle: {
          elevation: 0, // Android
        },
      }}
    >
      <Stack.Screen
        name="Weather"
        component={WeatherScreen}
        headerShadowVisible={true}
        options={{
          title: "",
          headerLeft: () => (
            <View style={{ margin:8 }}>
              <MENUSVG onPress={() => navigation.openDrawer()} />
            </View>
          ),
          animationEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
};
export default WeatherStack;
