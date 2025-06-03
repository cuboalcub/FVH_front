// @types/react-native-paho-mqtt.d.ts
declare module 'react-native-paho-mqtt' {
  export class Client {
    constructor(options: { uri: string; clientId: string });
    
    connect(options: {
      onSuccess?: () => void;
      onFailure?: (error: any) => void;
      userName?: string;
      password?: string;
      useSSL?: boolean;
    }): void;
    
    disconnect(): void;
    isConnected(): boolean;
    subscribe(topic: string): void;
    unsubscribe(topic: string): void;
    send(message: Message): void;
    
    on(event: 'connectionLost', callback: (responseObject: { errorCode: number; errorMessage: string }) => void): void;
    on(event: 'messageReceived', callback: (message: Message) => void): void;
  }

  export class Message {
    constructor(payload: string);
    payloadString: string;
    destinationName: string;
  }
}