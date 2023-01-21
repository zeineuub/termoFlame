import { useState, useEffect } from "react";
import * as Location from 'expo-location';
export default function useGeoLocation() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  useEffect(async() => {
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let position = await Location.getCurrentPositionAsync({});
      setLocation([Object.values(position.coords)[3], Object.values(position.coords)[5]]);

    })();
  }, []);
  return location;
}
