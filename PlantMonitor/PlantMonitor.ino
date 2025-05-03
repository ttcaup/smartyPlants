#include <DHT.h>
#define DHTTYPE DHT11
#define tempPin 2
#define relayPin 3

DHT dht(tempPin, DHTTYPE);

void setup()
{
    pinMode(tempPin, INPUT_PULLUP);
    pinMode(relayPin, OUTPUT);
    Serial.begin(9600);
    Serial.println(F("Starting sensor..."));
    dht.begin();
}

void checkMoist(float moist){
  if(moist > 600){
    Serial.println(F("Start Watering Plant!"));
    digitalWrite(relayPin, HIGH);
    delay(15000);
    digitalWrite(relayPin, LOW);
    Serial.println(F("Finished Watering Plant!"));
  }
}

void loop()
{
    delay(2000);

    float moist = analogRead(0);
    float light = analogRead(1);
    float humi  = dht.readHumidity();
    float tempF = dht.readTemperature(true);

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
      Serial.println("}");
    }

    checkMoist(moist);
}
