import { useEffect, useState, useCallback } from 'react';
import mqtt from 'mqtt/dist/mqtt';
import * as Notifications from 'expo-notifications';

interface MQTTOptions {
  uri: string;
  clientId?: string;
  username?: string;
  password?: string;
}

interface MQTTHookReturn {
  messages: { [topic: string]: string[] };
  publish: (topic: string, message: string) => void;
  isConnected: boolean;
  error: string | null;
  connect: (topics: string[]) => void;
  disconnect: () => void;
}

export function useMQTT(options: MQTTOptions): MQTTHookReturn {
  const [client, setClient] = useState<any>(null);
  const [messages, setMessages] = useState<{ [topic: string]: string[] }>({});
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback((topics: string[]) => {
    try {
      const clientOptions = {
        clientId: options.clientId || `expo_${Math.random().toString(16).substr(2, 8)}`,
        username: options.username,
        password: options.password,
        protocol: 'ws',
        reconnectPeriod: 1000, // Reintenta cada segundo
        connectTimeout: 10000, // 10 segundos de espera
      };

      const mqttClient = mqtt.connect(options.uri, clientOptions);

      mqttClient.on('connect', () => {
        setIsConnected(true);
        setError(null);
        topics.forEach(topic => {
          mqttClient.subscribe(topic, { qos: 0 }, (err: any) => {
            if (err) setError(`Subscribe error: ${err.message}`);
          });
        });
      });

      mqttClient.on('message', (topic: string, message: Buffer) => {
        const payload = message.toString();

        // Guarda el mensaje en el estado
        setMessages(prev => ({
          ...prev,
          [topic]: [...(prev[topic] || []), payload],
        }));

        // 🔔 Envía notificación local
        Notifications.scheduleNotificationAsync({
          content: {
            title: `📡 Mensaje MQTT (${topic.split('/').pop()})`,
            body: payload,
            sound: true,
          },
          trigger: null, // Inmediato
        });
      });

      mqttClient.on('error', (err: any) => {
        setError(`MQTT error: ${err.message}`);
        setIsConnected(false);
      });

      mqttClient.on('close', () => {
        setIsConnected(false);
      });

      setClient(mqttClient);
    } catch (err) {
      setError(`Connection failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, [options.uri, options.clientId, options.username, options.password]);

  const disconnect = useCallback(() => {
    if (client) {
      client.end();
      setIsConnected(false);
    }
  }, [client]);

  const publish = useCallback((topic: string, message: string) => {
    if (client && isConnected) {
      client.publish(topic, message, { qos: 0 }, (err: any) => {
        if (err) setError(`Publish error: ${err.message}`);
      });
    } else {
      setError('Cannot publish - not connected');
    }
  }, [client, isConnected]);

  return { messages, publish, isConnected, error, connect, disconnect };
}