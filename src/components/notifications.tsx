import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';

interface LogItem {
  id: string;
  time: string;
  message: string;
}

export default function LogsScreen() {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Simulated fetch for now, replace this with real API call
  useEffect(() => {
    // Simulate delay and load logs
    setTimeout(() => {
      setLogs([
        {
          id: '1',
          time: '6:00 pm',
          message: 'Usuario **Maria** ha activado los aspersores manualmente.',
        },
        {
          id: '2',
          time: '5:00 pm',
          message: 'Humedad en rack A cayó por debajo del 50%',
        },
        {
          id: '3',
          time: '4:50 pm',
          message: 'Usuario **Luis** ha activado las luces manualmente.',
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const renderItem = ({ item }: { item: LogItem }) => (
    <View style={styles.logCard}>
      <Text style={styles.time}>{item.time}</Text>
      <Text style={styles.message}>{formatMessage(item.message)}</Text>
    </View>
  );

  const formatMessage = (msg: string) => {
    // Render bold usernames manually
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
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

      {/* Optional bottom nav placeholder */}
      <View style={styles.navBar}>
        <Text style={styles.navItem}>📦 Pedidos</Text>
        <Text style={styles.navItem}>🏠</Text>
        <Text style={styles.navItem}>⚙️ Ajustes</Text>
      </View>
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
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#3E3E3E',
    paddingVertical: 12,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: 10,
  },
  navItem: {
    color: '#fff',
    fontSize: 14,
  },
});
