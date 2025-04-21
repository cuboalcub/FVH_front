import { useEffect, useState, useCallback } from "react";
import mqtt, { MqttClient } from "mqtt";

// Tipos para TypeScript
type MQTTMessage = {
  topic: string;
  message: string;
  timestamp: Date;
};

type UseMQTTOptions = {
  brokerUrl?: string;
  topics?: string[];
  onMessageReceived?: (message: MQTTMessage) => void;
};  

const DEFAULT_OPTIONS: UseMQTTOptions = {
  brokerUrl: "mqtt://192.168.158.151:1883", // Servidor público Mosquitto
  topics: ["test/topic"],
};

export function useMQTT(options?: UseMQTTOptions) {
  const config = { ...DEFAULT_OPTIONS, ...options };
  const [client, setClient] = useState<MqttClient | null>(null);
  const [messages, setMessages] = useState<MQTTMessage[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<
    "connecting" | "connected" | "error" | "disconnected"
  >("connecting");
  const [error, setError] = useState<string | null>(null);

  // Función para publicar mensajes
  const publish = useCallback(
    (topic: string, message: string) => {
      if (client?.connected) {
        client.publish(topic, message, (err) => {
          if (err) {
            console.error("❌ Error al publicar:", err);
            setError(`Publish error: ${err.message}`);
          }
        });
        return true;
      }
      setError("Client not connected");
      return false;
    },
    [client]
  );

  useEffect(() => {
    // Configuración del cliente MQTT
    console.log(DEFAULT_OPTIONS.brokerUrl);
    
    const mqttClient = mqtt.connect(DEFAULT_OPTIONS.brokerUrl || "mqtt://192.168.158.151:1883   ", {
        protocol: "mqtt",
      reconnectPeriod: 5000, // Intentar reconectar cada 5 segundos
      clientId: `mqttjs_${Math.random().toString(16).substr(2, 8)}`,
    });

    setClient(mqttClient);
    setConnectionStatus("connecting");

    // Event handlers
    mqttClient.on("connect", () => {
      console.log("✅ Conectado a MQTT");
      setConnectionStatus("connected");
      setError(null);
      
      // Suscribirse a los topics
      config.topics?.forEach((topic) => {
        mqttClient.subscribe(topic, (err) => {
          if (err) {
            console.error(`❌ Error al suscribirse a ${topic}:`, err);
            setError(`Subscribe error: ${err.message}`);
          } else {
            console.log(`📡 Suscrito a: ${topic}`);
          }
        });
      });
    });

    mqttClient.on("message", (topic, message) => {
      const msg: MQTTMessage = {
        topic,
        message: message.toString(),
        timestamp: new Date(),
      };
      
      console.log(`📩 [${msg.timestamp.toISOString()}] ${topic}: ${msg.message}`);
      
      setMessages((prev) => [msg, ...prev].slice(0, 100)); // Limitar a 100 mensajes
      
      if (config.onMessageReceived) {
        config.onMessageReceived(msg);
      }
    });

    mqttClient.on("error", (err) => {
      console.error("⚠️ Error MQTT:", err);
      setConnectionStatus("error");
      setError(err.message);
    });

    mqttClient.on("close", () => {
      setConnectionStatus("disconnected");
    });

    mqttClient.on("offline", () => {
      setConnectionStatus("disconnected");
    });

    // Limpieza al desmontar
    return () => {
      if (mqttClient.connected) {
        mqttClient.end(true); // Forzar desconexión
      }
    };
  }, [config.brokerUrl, JSON.stringify(config.topics)]);

  return {
    client,
    messages,
    publish,
    connectionStatus,
    error,
    isConnected: connectionStatus === "connected",
  };
}