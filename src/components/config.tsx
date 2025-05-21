import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import BackgroundWrapper from './background';
import CustomBottomBar from './barraInferior';
import { useMQTT } from  '../hooks/useMQTT';

const ConfigScreen = () => {
  const { messages } = useMQTT(); // 📡 Hook personalizado
  console.log("mensage"+ messages);
  
  const [chartData, setChartData] = useState({
    labels: [] as string[],
    datasets: [{ data: [] as number[] }],
  });
  const [loading, setLoading] = useState(true);

  // Agrega un nuevo dato y mantiene solo los últimos 10
  const addNewData = (value: number) => {
    setChartData(prev => {
      const newData = [...prev.datasets[0].data];
      const newLabels = [...prev.labels];

      if (newData.length >= 10) {
        newData.shift();
        newLabels.shift();
      }

      newData.push(value);
      newLabels.push(new Date().toLocaleTimeString());

      return {
        labels: newLabels,
        datasets: [{ data: newData }],
      };
    });
  };

  // Escucha los mensajes del broker
  useEffect(() => {
    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      const value = parseFloat(lastMsg);
      if (!isNaN(value)) {
        addNewData(value);
      }
    }
  }, [messages]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const activateSprinklers = () => alert('Aspersores Activados');
  const activateLights = () => alert('Luces Activadas');

  if (loading) {
    return (
      <BackgroundWrapper>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#A0522D" />
          <Text style={styles.loadingText}>Cargando configuración...</Text>
        </View>
      </BackgroundWrapper>
    );
  }

  return (
    <BackgroundWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Panel de Control</Text>
        <Text style={styles.subtitle}>Datos recibidos por MQTT</Text>
        <View style={styles.chartContainer}>
          <LineChart
            data={chartData}
            width={320}
            height={200}
            yAxisLabel=""
            chartConfig={{
              backgroundColor: '#de9c21',
              backgroundGradientFrom: '#de9c21',
              backgroundGradientTo: '#de9c21',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 8,
              },
              propsForDots: {
                r: '4',
                strokeWidth: '2',
                stroke: '#ADD8E6',
              },
            }}
            style={styles.chart}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={activateSprinklers}>
          <Text style={styles.buttonText}>Activar Aspersores</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={activateLights}>
          <Text style={styles.buttonText}>Activar Luces</Text>
        </TouchableOpacity>
      </ScrollView>
      <CustomBottomBar />
    </BackgroundWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#fff',
  },
  subtitle: {
    fontSize: 18,
    color: '#eee',
    marginBottom: 20,
  },
  chartContainer: {
    backgroundColor: '#de9c21',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
  },
  chart: {
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#de9c21',
    padding: 18,
    borderRadius: 12,
    width: 280,
    alignItems: 'center',
    marginVertical: 8,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#A0522D',
  },
});

export default ConfigScreen;
