#include <ESP8266WiFi.h>
#include <PubSubClient.h>

// WiFi
const char *ssid = "Pixel's Lair 2"; // Enter your WiFi name
const char *password = "CasaDaEstrada";  // Enter WiFi password

// MQTT Broker
const char *mqtt_broker = "192.168.1.201";
const char *topic1 = "values";
const char *topic2 = "commands";
const int mqtt_port = 1883;

// ESP8266 LED
int LED = 2;

WiFiClient espClient;
PubSubClient client(espClient);

void setup() {
 // Set software serial baud to 115200;
 Serial.begin(115200);
 pinMode(LED, OUTPUT);
 digitalWrite(LED, HIGH);
 
 // connecting to a WiFi network
 WiFi.begin(ssid, password);
 while (WiFi.status() != WL_CONNECTED) {
  delay(500);
  Serial.println("Connecting to WiFi..");
 }
 
 Serial.println("Connected to the WiFi network");
 
 //connecting to a mqtt broker
 client.setServer(mqtt_broker, mqtt_port);
 client.setCallback(callback);
 
 while (!client.connected()) {
 String client_id = "esp8266-client-";
 client_id += String(WiFi.macAddress());
 
 Serial.printf("The client %s connects to mosquitto mqtt broker\n", client_id.c_str());
 
 if (client.connect(client_id.c_str())) {
  Serial.println("Public emqx mqtt broker connected");
 } else {
  Serial.print("failed with state ");
  Serial.print(client.state());
  delay(2000);
 }
}
 
 // publish and subscribe
 client.publish(topic1, "Hello From ESP8266!");
 client.subscribe(topic1);
 client.subscribe(topic2);
}

void callback(char *topic, byte *payload, unsigned int length) {
 Serial.print("Message arrived in topic: ");
 Serial.println(topic);
 Serial.print("Message: ");
 
 for (int i = 0; i < length; i++) {
  String message = String((char) payload[i]);
  Serial.print(message);

  if(message == 1){
    digitalWrite(LED, LOW); // Turn LED ON 
  }

  if(message == 0){
    digitalWrite(LED, HIGH); // Turn LED OFF
  }
 }
 
 Serial.println();
 Serial.println(" - - - - - - - - - - - -");
}

void loop() {
 client.loop();
}
