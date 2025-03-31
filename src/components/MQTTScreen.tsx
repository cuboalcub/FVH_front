import React from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { useMQTT } from "../hooks/useMQTT";

interface MQTTScreenProps {
  topic?: string; // Opcional: para permitir diferentes topics
}

const MQTTScreen: React.FC<MQTTScreenProps> = ({ topic = "topico/test" }) => {
  const { messages, isConnected, error } = useMQTT(topic);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📡 Mensajes MQTT - {topic}</Text>
      
      {!isConnected && !error && (
        <View style={styles.statusContainer}>
          <ActivityIndicator size="small" color="#0000ff" />
          <Text style={styles.statusText}>Conectando al broker...</Text>
        </View>
      )}

      {error && (
        <View style={[styles.statusContainer, styles.errorContainer]}>
          <Text style={styles.errorText}>❌ Error: {error}</Text>
        </View>
      )}

      <ScrollView 
        style={styles.messageContainer}
        contentContainerStyle={styles.scrollContent}
      >
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <Text key={`msg-${index}`} style={styles.message}>
              <Text style={styles.messageIndex}>{index + 1}.</Text> {msg}
            </Text>
          ))
        ) : (
          <Text style={styles.placeholderText}>🔄 Esperando mensajes...</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#f5f5f5' 
  },
  title: { 
    fontSize: 20, 
    fontWeight: "bold", 
    marginBottom: 15,
    color: '#333'
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5
  },
  statusText: {
    marginLeft: 10,
    color: '#555'
  },
  errorContainer: {
    backgroundColor: '#ffebee'
  },
  errorText: {
    color: '#d32f2f'
  },
  messageContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#fff'
  },
  scrollContent: {
    padding: 15
  },
  message: {
    marginBottom: 10,
    fontSize: 14,
    lineHeight: 20,
    color: '#444'
  },
  messageIndex: {
    fontWeight: 'bold',
    color: '#666'
  },
  placeholderText: {
    color: '#888',
    fontStyle: 'italic'
  }
});

export default MQTTScreen;