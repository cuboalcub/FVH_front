// src/utils/noti/noti.ts
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import mqtt, { MqttClient, IClientOptions, IClientSubscribeOptions } from 'mqtt';

type NotificationMessage = {
  title: string;
  body: string;
  data?: Record<string, any>;
  sound?: boolean;
  priority?: 'default' | 'high' | 'max';
};

type MQTTMessage = {
  topic: string;
  payload: string;
  qos: 0 | 1 | 2;
};

class NotiService {
  private static instance: NotiService;
  private mqttClient: MqttClient | null = null;
  private isConnected: boolean = false;
  private notificationListeners: Array<(message: NotificationMessage) => void> = [];
  private mqttMessageListeners: Array<(message: MQTTMessage) => void> = [];
  private retryCount: number = 0;
  private maxRetries: number = 5;

  private constructor() {
    this.setupNotificationHandler();
  }

  public static getInstance(): NotiService {
    if (!NotiService.instance) {
      NotiService.instance = new NotiService();
    }
    return NotiService.instance;
  }

  private setupNotificationHandler() {
    Notifications.setNotificationHandler({
      handleNotification: async (notification) => ({
        shouldShowAlert: true,
        shouldPlaySound: notification.request.content.sound !== undefined,
        shouldSetBadge: false,
      }),
    });
  }

  // Configuración inicial mejorada con reconexión automática
  public async init(config: {
    mqttBrokerUrl: string;
    mqttOptions?: IClientOptions;
    topics?: string[];
  }): Promise<void> {
    try {
      await this.setupNotificationChannel();
      await this.connectToMqtt(config.mqttBrokerUrl, config.mqttOptions);
      
      if (config.topics && config.topics.length > 0) {
        await this.subscribeToTopics(config.topics);
      }

      this.setupNotificationListeners();
      this.setupReconnectionHandler();
    } catch (error) {
      console.error('[NotiService] Error durante inicialización:', error);
      throw error;
    }
  }

  private async setupNotificationChannel() {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Notificaciones',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        sound: 'default',
        lightColor: '#FF231F7C',
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      });
    }
  }

  private async connectToMqtt(brokerUrl: string, options?: IClientOptions) {
    const defaultOptions: IClientOptions = {
      clientId: `expo-app_${Platform.OS}_${Date.now()}`,
      clean: true,
      reconnectPeriod: 5000,
      connectTimeout: 8000,
      ...options,
    };

    return new Promise<void>((resolve, reject) => {
      this.mqttClient = mqtt.connect(brokerUrl, defaultOptions);

      this.mqttClient.on('connect', () => {
        this.isConnected = true;
        this.retryCount = 0;
        console.log('[NotiService] Conexión MQTT establecida');
        resolve();
      });

      this.mqttClient.on('error', (error) => {
        console.error('[NotiService] Error MQTT:', error);
        if (!this.isConnected && this.retryCount < this.maxRetries) {
          this.retryCount++;
          console.log(`[NotiService] Reintentando conexión (${this.retryCount}/${this.maxRetries})`);
          setTimeout(() => this.connectToMqtt(brokerUrl, options), 5000);
        } else {
          reject(error);
        }
      });

      this.mqttClient.on('message', (topic, payload) => {
        const message = payload.toString();
        this.handleIncomingMessage(topic, message);
      });
    });
  }

  private setupReconnectionHandler() {
    this.mqttClient?.on('close', () => {
      this.isConnected = false;
      console.log('[NotiService] Conexión MQTT perdida');
    });

    this.mqttClient?.on('reconnect', () => {
      console.log('[NotiService] Reconectando al broker MQTT...');
    });
  }

  public async subscribeToTopics(topics: string[], options: IClientSubscribeOptions = { qos: 1 }) {
    if (!this.mqttClient) {
      throw new Error('Cliente MQTT no inicializado');
    }

    return new Promise<void>((resolve, reject) => {
      this.mqttClient?.subscribe(topics, options, (err) => {
        if (err) {
          console.error('[NotiService] Error suscribiendo a temas:', err);
          reject(err);
        } else {
          console.log(`[NotiService] Suscrito a temas: ${topics.join(', ')}`);
          resolve();
        }
      });
    });
  }

  private handleIncomingMessage(topic: string, payload: string) {
    try {
      const message = JSON.parse(payload) as NotificationMessage;
      
      // Notificar a los listeners de MQTT
      this.mqttMessageListeners.forEach(listener => 
        listener({ topic, payload, qos: 1 })
      );

      // Mostrar notificación si corresponde
      if (message.title && message.body) {
        this.showLocalNotification(message);
        this.notifyNotificationListeners(message);
      }
    } catch (error) {
      console.error('[NotiService] Error procesando mensaje:', error);
    }
  }

  private async showLocalNotification(message: NotificationMessage) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: message.title,
          body: message.body,
          sound: message.sound ? 'default' : undefined,
          data: message.data || {},
          priority: message.priority === 'high' || message.priority === 'max' 
            ? Notifications.AndroidNotificationPriority.MAX
            : Notifications.AndroidNotificationPriority.DEFAULT,
        },
        trigger: { seconds: 1 },
      });
    } catch (error) {
      console.error('[NotiService] Error mostrando notificación:', error);
    }
  }

  private notifyNotificationListeners(message: NotificationMessage) {
    this.notificationListeners.forEach(listener => listener(message));
  }

  // API Pública Mejorada

  public addNotificationListener(
    listener: (message: NotificationMessage) => void
  ): () => void {
    this.notificationListeners.push(listener);
    return () => {
      this.notificationListeners = this.notificationListeners.filter(
        l => l !== listener
      );
    };
  }

  public addMQTTMessageListener(
    listener: (message: MQTTMessage) => void
  ): () => void {
    this.mqttMessageListeners.push(listener);
    return () => {
      this.mqttMessageListeners = this.mqttMessageListeners.filter(
        l => l !== listener
      );
    };
  }

  public async getPushToken(): Promise<string | null> {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        const { status: newStatus } = await Notifications.requestPermissionsAsync();
        if (newStatus !== 'granted') return null;
      }

      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: 'TU_PROJECT_ID', // Reemplaza con tu ID de proyecto Expo
      });
      return tokenData.data;
    } catch (error) {
      console.error('[NotiService] Error obteniendo push token:', error);
      return null;
    }
  }

  public async sendNotification(
    topic: string,
    message: NotificationMessage,
    qos: 0 | 1 | 2 = 1
  ): Promise<void> {
    if (!this.mqttClient?.connected) {
      throw new Error('[NotiService] Cliente MQTT no conectado');
    }

    return new Promise((resolve, reject) => {
      this.mqttClient?.publish(
        topic,
        JSON.stringify(message),
        { qos, retain: false },
        (error) => {
          if (error) {
            console.error('[NotiService] Error enviando notificación:', error);
            reject(error);
          } else {
            resolve();
          }
        }
      );
    });
  }

  public async scheduleLocalNotification(
    message: NotificationMessage,
    trigger?: Notifications.NotificationTriggerInput
  ): Promise<string> {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: message.title,
        body: message.body,
        sound: message.sound ? 'default' : undefined,
        data: message.data || {},
      },
      trigger: trigger || { type: Notifications.TriggerType.TIME_INTERVAL, seconds: 1 },
    });
    return notificationId;
  }

  public async cancelScheduledNotification(notificationId: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }

  public isMQTTConnected(): boolean {
    return this.isConnected;
  }

  public disconnectMQTT(): void {
    this.mqttClient?.end();
    this.isConnected = false;
  }
}

export const notiService = NotiService.getInstance();