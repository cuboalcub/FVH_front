import { Platform } from 'react-native';

export const MQTT_CONFIG = {
  // Broker público para pruebas (cambiar por tu broker en producción)
  BROKER_URL: Platform.select({
    android: 'mqtt://10.0.2.2:1883',  // Android emulator
    ios: 'mqtt://localhost:1883',     // iOS simulator
    default: 'mqtt://broker.hivemq.com:1883' // Broker público
  }),
  
  TOPICS: {
    NOTIFICATIONS: 'notifications/#',
    SENSORS: 'sensors/#'
  },
  
  // Opciones de conexión
  OPTIONS: {
    clean: true,
    connectTimeout: 4000,
    reconnectPeriod: 5000,
    clientId: `app-${Platform.OS}-${Math.random().toString(16).substr(2, 8)}`
  }
};