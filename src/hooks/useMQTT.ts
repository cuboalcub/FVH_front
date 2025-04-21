import { useEffect, useState } from "react";
import mqtt from "mqtt";

// 🔗 Reemplaza con la URL de tu broker MQTT (debe ser WebSocket)
const MQTT_BROKER = "ws://192.168.168.151:8083/mqtt"; // Ejemplo con Mosquitto
const TOPIC = "test/topic"; // Reemplaza con el topic que usarás
const clientId =
  "emqx_react_native_" + Math.random().toString(16).substring(2, 8);
const username = "emqx_test";
const password = "emqx_test";
export function useMQTT() {
    const [client, setClient] = useState<mqtt.MqttClient | null>(null);
    const [messages, setMessages] = useState<string[]>([]);

    useEffect(() => {
        // Conectar al broker
        const mqttClient = mqtt.connect(MQTT_BROKER, {
            clientId,
            username,
            password
          });

        mqttClient.on("connect", () => {
            console.log("✅ Conectado a MQTT");
            mqttClient.subscribe(TOPIC, (err) => {
                if (!err) {
                    console.log(`📡 Suscrito a: ${TOPIC}`);
                } else {
                    console.error("❌ Error al suscribirse:", err);
                }
            });
        });

        // Escuchar mensajes entrantes
        mqttClient.on("message", (topic, message) => {
            const msg = message.toString();
            console.log(`📩 Mensaje recibido en ${topic}: ${msg}`);
            setMessages((prev) => [...prev, msg]); // Agregar mensaje al estado
        });

        // Manejar errores
        mqttClient.on("error", (err) => {
            console.error("⚠️ Error MQTT:", err);
        });

        setClient(mqttClient);

        // Desconectar al desmontar el componente
        return () => {
            mqttClient.end();
        };
    }, []);

    return { messages };
}
