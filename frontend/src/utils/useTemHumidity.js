import { useState, useEffect } from "react";
import Paho from 'paho-mqtt';
var client;

export default function useTempHumidity() {
    const [temp, setTemp] = useState(0);
    const topicTempName = "topic_sensor_temperature";
    const [humidity, setHumidity]= useState(0);
    const topicHumiditypName = "topic_sensor_humidity";


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
  // called when message arrives in the broker
  const onMessageArrived = (message)=>{  
    if (message.destinationName == topicTempName ){
      setTemp(parseFloat(message.payloadString));
      console.log("temperature = ",temp);
  
    }
    if (message.destinationName == topicHumiditypName ){
      setHumidity(parseFloat(message.payloadString));
      console.log("humidity = ",humidity);
    }
  
    }
  const MQTTconnect =() =>{
    const mqttHost = 'broker.mqttdashboard.com';

    client = new Paho.Client(mqttHost, Number(8000), "clientId-K21BhVDJCD");
    // set callback handlers
    client.onConnectionLost = onConnectionLost;
    client.connect({ onSuccess: onConnect});
    client.onMessageArrived = onMessageArrived;
  
    // connect the client
  }

  useEffect(() => {
    MQTTconnect();
    return () => {
      setTemp(0);
      setHumidity(0) // This worked for me
    };
  }, []);

  return {temp, humidity};
}
