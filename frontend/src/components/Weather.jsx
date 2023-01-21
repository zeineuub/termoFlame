import { isSameDay, format } from "date-fns";
import imageDictionary from "./../utils/imageDictionary.js";
import Card from "./Card";
import {
    Container,
    CurrentDay,
    City,
    BigText,
    BigIcon,
    Temp,
    Description,
    Week,
} from "./Styles";
import {
    Text,
    View,
    StyleSheet,
  } from "react-native";
import React, { useState, useEffect } from "react";
import { useFonts } from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";

import { LinearGradient } from "expo-linear-gradient";
import CircularProgress from 'react-native-circular-progress-indicator';
import { useIsFocused } from "@react-navigation/native";
import i18n from "i18n-js";
import { fr, en } from "../assets/i18n/supportedLanguages";
const Weather = ({ forecast: { name, list, timezone } ,tempHumidity:{temp, humidity}}) => {
  console.log(temp)
    i18n.fallbacks = true;
    i18n.translations = { en,fr };
    i18n.locale = Localization.locale;
    const isFocused = useIsFocused();
  
    const currentWeather = list.filter((day) => {
        const now = new Date().getTime() + Math.abs(timezone * 1000);
        const currentDate = new Date(day.dt * 1000);
        return isSameDay(now, currentDate);
    });
    const daysByHour = list.map((day) => {
        const dt = new Date(day.dt * 1000);
        return {
            date: dt,
            hour: dt.getHours(),
            name: format(dt, "EEEE"),
            temp: Math.round(day.main.temp),
            icon:
                imageDictionary[day.weather[0].icon] || imageDictionary["02d"],
        };
    });
    useEffect(() => {
        const init = async () => {
          i18n.fallbacks = true;
          i18n.translations = { en, fr };
          try {
            const language = await AsyncStorage.getItem("user-language");
            i18n.locale = language;
          } catch (e) {
            console.log(e);
          }
        };
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
        currentWeather.length > 0 && (
            <LinearGradient
                colors={["#F69252", "#FF4E70"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.container}
            >
                <CurrentDay>
                    <City>{name}</City>
                    <BigText>Today</BigText>
                    <BigIcon
                        source={
                            imageDictionary[
                                currentWeather[0].weather[0].icon
                            ] || imageDictionary["02d"]
                        }
                    />
                    <Temp>{Math.round(currentWeather[0].main.temp)}°C</Temp>
                    <Description>
                        {currentWeather[0].weather[0].description}
                    </Description>
                </CurrentDay>
                <Week horizontal={true} showsHorizontalScrollIndicator={false}>
                    {daysByHour.map((day, index) => (
                        <Card
                            key={index}
                            icon={day.icon}
                            name={day.name.substring(0, 3)}
                            temp={day.temp}
                            hour={day.hour}
                        />
                    ))}
                </Week>
                <View style={styles.box}>
                    <View style={styles.item}>
                        <CircularProgress
                            duration={10000}
                            value={temp}
                            radius={60}
                            title={'Temp'}
                            activeStrokeColor={'white'}
                            valueSuffix={'°C'}
                            activeStrokeSecondaryColor={'#F69252'}
                        />
                    </View>
                    <View style={styles.item}>
                        <CircularProgress
                            duration={20000}
                            value={humidity}
                            radius={60}
                            title={'Humidity'}
                            activeStrokeColor={'white'}
                            valueSuffix={'%'}
                            activeStrokeSecondaryColor={'#F69252'}
                        />
                    </View>
                    </View>
                </LinearGradient>
        )
    );
};
const styles = StyleSheet.create({
    container: {
      flex: 1,
      width:"100%"
    },
    box: {
        flex: 1,
        flexDirection: 'row',
        alignItems:"center",
        justifyContent: "center"

    },
      item: {
        alignItems:"center",
        marginTop: -120,
        width: '50%' // is 50% of container width
      },
  })
export default Weather;