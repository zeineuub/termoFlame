import React, { useState, useEffect } from "react";

import imageDictionary from "../utils/imageDictionary.js";
import { Container, BigText, BigIcon, Description } from "./Styles";
import * as Localization from "expo-localization";
import { useIsFocused } from '@react-navigation/native';
import i18n from "i18n-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { fr, en } from "../assets/i18n/supportedLanguages";
const Loading = (props) => {
  i18n.fallbacks = true;
  i18n.translations = { en,fr };
  i18n.locale = Localization.locale;
  const isFocused = useIsFocused();

  useEffect(() => {
    const init = async()=>{
      i18n.fallbacks = true;
      i18n.translations = { en,fr };
      try {
        const language = await AsyncStorage.getItem("user-language");
        i18n.locale = language;
      } catch (e) {
        console.log(e);
      }
    }
     init();
  }, [isFocused]);
  return (
    <Container>
      <BigText>{i18n.t('weather.welcome')}</BigText>
      <BigIcon source={imageDictionary["01d"]} />
      <Description>{i18n.t('weather.loading')}</Description>
    </Container>
  );
};
export default Loading;
