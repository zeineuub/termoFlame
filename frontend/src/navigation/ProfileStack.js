import React from "react";
import { View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MENUSVG from "../assets/images/menu.svg";
import ProfileScreen from "../screens/ProfileScreen";
const Stack = createNativeStackNavigator();
const ProfileStack = ({ navigation }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: true,
        headerTransparent: true,
        headerStyle: {
          elevation: 0, // Android
        },
      }}
    >
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
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
export default ProfileStack;
