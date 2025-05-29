// hooks/useMQTT.ts
import { useEffect, useState } from "react";
import mqtt from "mqtt";

const MQTT_BROKER = "ws://192.168.137.171:8084/mqtt";
const clientId = "emqx_react_native_" + Math.random().toString(16).substring(2, 8);
const username = "emqx_test";
const password = "emqx_test";

export function useMQTT(topics: string[]) {
  const [client, setClient] = useState<mqtt.MqttClient | null>(null);
  const [messages, setMessages] = useState<Record<string, string[]>>({}); // <--- ahora por tópico

  useEffect(() => {
    const mqttClient = mqtt.connect(MQTT_BROKER, {
      clientId,
      username,
      password,
    });

    mqttClient.on("connect", () => {
      console.log("✅ Conectado a MQTT");
      topics.forEach((topic) => {
        mqttClient.subscribe(topic, (err) => {
          if (!err) {
            console.log(`📡 Suscrito a: ${topic}`);
          } else {
            console.error("❌ Error al suscribirse:", err);
          }
        });
      });
    });

    mqttClient.on("message", (topic, message) => {
      const msg = message.toString();
      console.log(`📩 Mensaje recibido en ${topic}: ${msg}`);
      setMessages((prev) => ({
        ...prev,
        [topic]: [...(prev[topic] || []), msg],
      }));
    });

    mqttClient.on("error", (err) => {
      console.error("⚠️ Error MQTT:", err);
    });

    setClient(mqttClient);
    return () => {
        mqttClient.end();
      };      
  }, [topics.join(",")]);

  return { messages };
}
