
# TermoFlame

## The goal of this mini project is to achieve:
    1. A connected object based on the "ESP" microcontroller integrated circuit, equipped a temperature sensor and an alphanumeric display.
    2. Display the data measured by the connected object on a Web type HMI and/or
    Mobile.

## Table of Contents 
* **Methodology**
* **Software part**
* **Architecture**
* **Simulation code with wokiwi**
* **Mobile application**
* **How Run the Project**



## Methodology
A simulation, via the simulation platform [wokiwi](https://wokwi.com/)
## Software part
The software part consists of developing an MQTT client, which is mainly a
web and/or mobile application, to receive and display the data measured by the object
connected.
The method of communication between the application and the connected object is messaging
MQTT (in TCP). The **broker** (MQTT server) to use is HiveMQ. This public broker
is free and its access details are available on its official page:
[HiveMQ](https://www.hivemq.com/public-mqtt-broker/)

## Architecture
![architecture](https://github.com/zeineuub/termoFlame/images/[master]/architecture.png?raw=true)

## Simulation code with wokiwi
### Connection
- Host -> broker.mqttdashboard.com
- Port -> 8000
- KeepAlive -> 60
- Click on 'Connect
![Broker](https://github.com/zeineuub/termoFlame/images/[master]/broker.jpg?raw=true)
### Subscriptions - Add new Topic fot Temperature and Humidity
- Topic: topic_sensor_temperature and topic_sensor_
- QoS: 0
- Click on 'Subscribe'
Run the simulation on Wokwi and see the ESP32 temperature (°C) and humidity (%)'s publish on 'Messages'
![Topics](https://github.com/zeineuub/termoFlame/images/[master]/topics.jpg?raw=true)

### Simulation's code

```c
#include <LiquidCrystal_I2C.h>
#include "DHTesp.h"
#include <WiFi.h>
#include <PubSubClient.h>

//define the 2 topics to subscribe to
#define TOPIC_PUBLISH_TEMPERATURE "topic_sensor_temperature"
#define TOPIC_PUBLISH_HUMIDITY    "topic_sensor_humidity"

//define the delay between publishes
#define PUBLISH_DELAY 1000  

//define the connection ID
#define ID_MQTT "esp32_mqtt" 

//define the pins used for the DHT and LCD
const int DHT_PIN = 15;
const int LCD_PIN1 = 21;
const int LCD_PIN2 = 22;

//initialize the LCD and DHT sensor
LiquidCrystal_I2C lcd(0x27, 16, 2);
DHTesp dhtSensor;

//define the login credentials for MQTT Browser Client
const char *SSID = "Wokwi-GUEST";
const char *PASSWORD = "";        
const char *BROKER_MQTT = "broker.mqttdashboard.com";
int BROKER_PORT = 1883; 
unsigned long publishUpdate;
WiFiClient espClient;         
PubSubClient MQTT(espClient); 

//variables used for measuring tempature and humidity
String temp_str;
String hum_str;
char temp[50];
char hum[50];

//initializing the connection with the MQTT Browser Client
void initWiFi(void)
{
  delay(10);
  Serial.println("------MQTT Connexion------");
  Serial.println("Please wait");

  reconnectWiFi();
}
//initializing the MQTT
void initMQTT(void)
{
  MQTT.setServer(BROKER_MQTT, BROKER_PORT); 
  MQTT.setCallback(callbackMQTT);           
}

//call back function for MQTT
void callbackMQTT(char *topic, byte *payload, unsigned int length)
{
  String msg;

  for (int i = 0; i < length; i++) {
    char c = (char)payload[i];
    msg += c;
  }
}

//Reconnecting to the MQTT Browser Client
void reconnectMQTT(void)
{
  while (!MQTT.connected()) {
    Serial.println("Connecting to the broker: ");
    Serial.println(BROKER_MQTT);
    if (MQTT.connect(ID_MQTT)) {
      Serial.println("successfully connected to broker MQTT!!!");
      MQTT.subscribe(TOPIC_PUBLISH_TEMPERATURE);
      MQTT.subscribe(TOPIC_PUBLISH_HUMIDITY);
    } else {
      Serial.println("Cannot connect to the broker.");
      Serial.println("Retrying in 2 secs.");
      delay(2000);
    }
  }
}

//check if the MQTT Browser Client and the connection to it are running
void checkWiFIAndMQTT(void)
{
  if (!MQTT.connected())
    reconnectMQTT(); 

  reconnectWiFi(); 
}

//reconnecting to the MQTT Browser Client
void reconnectWiFi(void)
{
  if (WiFi.status() == WL_CONNECTED)
    return;

  WiFi.begin(SSID, PASSWORD); 

  while (WiFi.status() != WL_CONNECTED) {
    delay(100);
    Serial.print(".");
  }

  Serial.println();
  Serial.println("successfully connected!!!");
  Serial.println(SSID);
  Serial.println("IP @ : ");
  Serial.println(WiFi.localIP());
}

void setup() {
  //activating the LCD
  Wire.begin(LCD_PIN1, LCD_PIN2);
  lcd.init();
  lcd.backlight();
  
  //activating the DHT sensor
  Serial.begin(115200);
  dhtSensor.setup(DHT_PIN, DHTesp::DHT22);

  //initializing the MQTT/MQTT connexion
  initWiFi();
  initMQTT();
}

void loop() {
  //keep checking if the MQTT Browser Client is still connected and running
  if ((millis() - publishUpdate) >= PUBLISH_DELAY) {
    publishUpdate = millis();
    checkWiFIAndMQTT();
    //fetch the temperature and humidity values from the sensors
    TempAndHumidity  data = dhtSensor.getTempAndHumidity();
    temp_str=String(data.temperature, 2);
    hum_str=String(data.humidity, 1);
    Serial.println("Temp: " + temp_str + "°C");
    Serial.println("Humidity: " + hum_str + "%");
    Serial.println("---");
    //print the temperature and humidity values on the LCD
    lcd.setCursor(0, 0);
    lcd.print("Temp: " + temp_str + " C");
    lcd.setCursor(0, 1);
    lcd.print("Humidity: " + hum_str + "%");
    //publishthe values to the MQTT Browser Client
    temp_str.toCharArray(temp, temp_str.length() + 1); 
    hum_str.toCharArray(hum, hum_str.length() + 1); 
    MQTT.publish(TOPIC_PUBLISH_TEMPERATURE,temp);
    MQTT.publish(TOPIC_PUBLISH_HUMIDITY,hum);
    MQTT.loop();
    delay(1000);
  }
}

```
## Mobile Application
### React Native Mqtt

This package is a wrapper around the javascript implementation of the [paho mqtt client library](https://eclipse.org/paho/clients/js/) to provide drop in compatibility with react native. If you happen to be running your own mqtt broker, it must support websockets for a connection to be possible.

### Install

To install, use npm:

```
npm install react_native_mqtt --save
```
### Usage

To use the library just pass in the options for the local storage module ([react-native-storage](https://github.com/sunnylqm/react-native-storage)) and the paho object will be attached to global scope.
```javascript
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
```

