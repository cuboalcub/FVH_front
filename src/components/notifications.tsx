import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import CustomBottomBar from './barraInferior';

interface LogItem {
  id: string;
  mensaje: string;
  fecha: string;
}

export default function LogsScreen() {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/log_notificaciones/list/1') // ← Reemplaza por tu endpoint real
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        
        setLogs(data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error al obtener notificaciones:', err);
        setLoading(false);
      });
  }, []);

  const renderItem = ({ item }: { item: LogItem }) => (
    <View style={styles.logCard}>
      <Text style={styles.time}>{new Date(item.fecha).toLocaleTimeString()}</Text>
      <Text style={styles.message}>{formatMessage(item.mensaje)}</Text>
    </View>
  );

  const formatMessage = (msg: string) => {
    const parts = msg.split(/\*\*(.*?)\*\*/g);
    return (
      <Text>
        {parts.map((part, index) =>
          index % 2 === 1 ? (
            <Text key={index} style={{ fontWeight: 'bold' }}>
              {part}
            </Text>
          ) : (
            <Text key={index}>{part}</Text>
          )
        )}
      </Text>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Logs</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <FlatList
          data={logs}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

      <CustomBottomBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFA500',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  logCard: {
    backgroundColor: '#FFD580',
    borderRadius: 10,
    padding: 12,
    borderWidth: 2,
    borderColor: '#FF8C00',
    marginBottom: 12,
  },
  time: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: '#333',
  },
});
