import { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from "@react-navigation/native";
import init from 'react_native_mqtt';
init({
  size: 10000,
  storageBackend: AsyncStorage,
  defaultExpires: 1000 * 3600 * 24,
  enableCache: true,
  reconnect: true,
  sync : {}
});

export default function useTempHumidity() {
    const [temp, setTemp] = useState("");
    const topicTempName = "topic_sensor_temperature";
    const [humidity, setHumidity]= useState("");
    const topicHumiditypName = "topic_sensor_humidity";
    const isFocused = useIsFocused();
    const mqttHost = 'broker.mqttdashboard.com';


  // called when the client connects
  const onConnect =() => {
    // Once a connection has been made, make a subscription and send a message.
    console.log("onConnect");
    client.subscribe(topicHumiditypName);
    client.subscribe(topicTempName);

  }
  // called when the client loses its connection
  const onConnectionLost = (responseObject) =>{
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:" + responseObject.errorMessage);
    }
  }
  // call when a message arrive in the broker
  const onMessageArrived = (message)=>{  
    // get the temperature value
    if (message.destinationName == topicTempName ){
      setTemp(parseFloat(message.payloadString));
      console.log(temp);
  
    }
    // get the humidity value
    if (message.destinationName == topicHumiditypName ){
      setHumidity(parseFloat(message.payloadString));
      console.log(humidity);
    }
  
  }
  // MQTT connection
  const MQTTconnect =() =>{

    const client = new Paho.MQTT.Client(mqttHost, 8000, "clientId");
    // set callback handlers
    client.onMessageArrived = onMessageArrived;
    client.connect({ onSuccess:onConnect, useSSL: false });
    client.onConnectionLost = onConnectionLost;

  }

  useEffect(() => {
    MQTTconnect();
  }, [isFocused]);

  

  return {temp, humidity};
}
