import React, { useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { useMQTT } from '../hooks/useMQTT';

const MQTTComponent = () => {
  const { 
    messages, 
    publish,  
    isConnected, 
    error, 
    connect, 
    disconnect 
  } = useMQTT({
    uri: 'ws://192.168.137.171:8084/mqtt', // Usar ws:// en lugar de wss:// para pruebas
    clientId: 'expo_client'
  });

  useEffect(() => {
    connect(['greenhouse/greenhouse-1/sensor/temperature']);
    return () => disconnect();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text>Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}</Text>
      {error && <Text style={{ color: 'red' }}>Error: {error}</Text>}
      
      <Button
        title={isConnected ? "Disconnect" : "Connect"}
        onPress={isConnected ? disconnect : () => connect(['test/topic'])}
      />
      
      <Button
        title="Send Test Message"
        onPress={() => publish('test/topic', 'Hello from Expo')}
        disabled={!isConnected}
      />
      
      <View style={{ marginTop: 20 }}>
        <Text>Received Messages:</Text>
        {Object.entries(messages).map(([topic, msgs]) => (
          <View key={topic}>
            <Text style={{ fontWeight: 'bold' }}>{topic}:</Text>
            {msgs.map((msg, i) => <Text key={i}>{msg}</Text>)}
          </View>
        ))}
      </View>
    </View>
  );
};

export default MQTTComponent;