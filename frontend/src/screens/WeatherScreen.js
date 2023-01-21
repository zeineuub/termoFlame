import React , { useState, useEffect }from "react";
import useWeather from "./../utils/useWeather";
import Loading from "./../components/Loading";
import Weather from "./../components/Weather";
import { Container } from "./../components/Styles";
import useTemHumidity from "../utils/useTemHumidity";

const WeatherScreen = ({ navigation }) => {
  const weather = useWeather();
  const tempHumidity = useTemHumidity();
  return (

    <Container>

      {!weather ? <Loading /> : <Weather forecast={weather}  tempHumidity={tempHumidity} />}

    </Container>
  );
};


export default WeatherScreen;