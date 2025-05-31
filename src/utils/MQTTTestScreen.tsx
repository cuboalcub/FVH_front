import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, ScrollView, StyleSheet } from 'react-native';
import { notiService } from './noti/noti';

export default function MQTTTestScreen() {
  const [status, setStatus] = useState('Desconectado');
  const [messages, setMessages] = useState<string[]>([]);
  const [topic, setTopic] = useState('notifications/test');
  const [message, setMessage] = useState(JSON.stringify({
    title: "Prueba MQTT",
    body: "Mensaje de prueba desde la pantalla de desarrollo",
    sound: true,
    data: { test: true }
  }, null, 2));

  useEffect(() => {
    const updateStatus = () => {
      setStatus(notiService.isMQTTConnected() ? 'Conectado ✅' : 'Desconectado ❌');
    };
    
    const interval = setInterval(updateStatus, 2000);
    updateStatus();

    const unsubscribe = notiService.addMQTTMessageListener(({ topic, payload }: { topic: string; payload: string }) => {
      setMessages(prev => [`[${new Date().toLocaleTimeString()}] ${topic}: ${payload}`, ...prev]);
    });

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, []);

  const sendTestMessage = () => {
    try {
      const parsedMsg = JSON.parse(message);
      notiService.sendNotification(topic, parsedMsg);
    } catch (error) {
      if (error instanceof Error) {
        alert('Error en formato JSON: ' + error.message);
      } else {
        alert('Error en formato JSON: ' + String(error));
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.status}>Estado MQTT: {status}</Text>
      
      <TextInput
        style={styles.input}
        value={topic}
        onChangeText={setTopic}
        placeholder="Ej: notifications/urgent"
      />
      
      <TextInput
        style={[styles.input, { height: 120 }]}
        value={message}
        onChangeText={setMessage}
        placeholder="Mensaje JSON"
        multiline
      />
      
      <View style={styles.buttonContainer}>
        <Button title="Enviar Mensaje MQTT" onPress={sendTestMessage} />
      </View>
      
      <View style={styles.buttonContainer}>
        <Button 
          title="Notificación Local" 
          onPress={() => notiService.scheduleLocalNotification({
            title: "Prueba Local",
            body: "Generada desde la app",
            sound: true
          })} 
        />
      </View>
      
      <Text style={styles.sectionTitle}>Mensajes Recibidos:</Text>
      {messages.slice(0, 15).map((msg, i) => (
        <Text key={i} style={styles.message}>{msg}</Text>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  status: { 
    fontSize: 18, 
    marginBottom: 20, 
    fontWeight: 'bold',
    color: '#333'
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#f9f9f9'
  },
  buttonContainer: {
    marginBottom: 15,
    borderRadius: 8,
    overflow: 'hidden'
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#444'
  },
  message: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginBottom: 8,
    borderRadius: 6,
    fontSize: 14
  }
});