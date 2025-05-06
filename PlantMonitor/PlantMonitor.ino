/*
Company: RNK
Author: Eden Reader
Date: 05/05/25
*/
#include <DHT.h>
#define DHTTYPE DHT11
#define tempPin 2
#define relayPin 3

DHT dht(tempPin, DHTTYPE);

void setup()
{
    pinMode(tempPin, INPUT_PULLUP); //pullup resistor for DHT module
    pinMode(relayPin, OUTPUT); 
    digitalWrite(relayPin, HIGH); //initializing relay
    Serial.begin(9600);
    Serial.println(F("Starting sensor..."));
    dht.begin();
}

bool checkMoist(float moist){
  if(moist > 1000){
    Serial.println(F("Start Watering Plant!"));
    digitalWrite(relayPin, LOW); //turn on pump for 3 sec
    delay(3000);
    digitalWrite(relayPin, HIGH); //turn off pump
    Serial.println(F("Finished Watering Plant!"));
    return true;
  }
  return false;
}

void loop()
{
    delay(60000); //execute every one minute

    float moist = analogRead(0);
    float light = analogRead(1);
    float humi  = dht.readHumidity();
    float tempF = dht.readTemperature(true);
    bool watered = checkMoist(moist);
    if (isnan(humi) || isnan(tempF)) {
      Serial.println(F("{\"error\": \"Failed to read from DHT sensor\"}"));
    } else {
      Serial.print(F("{\"humidity\": "));
      Serial.print(humi);
      Serial.print(F(", \"temperature\": "));
      Serial.print(tempF);
      Serial.print(F(", \"moisture\": "));
      Serial.print(moist);
      Serial.print(F(", \"light\": "));
      Serial.print(light);
      Serial.print(F(", \"watered\": "));
      Serial.print(watered);
      Serial.println("}");
    }
}
