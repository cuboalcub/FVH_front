import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import axios from 'axios';
import BackgroundWrapper from './background';
import CustomBottomBar from './barraInferior';

const ConfigScreen = () => {
  const [chartData, setChartData] = useState({
    labels: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    datasets: [{ data: [0, 0, 0, 0, 0, 0, 0] }],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mockApiData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    values: [20, 45, 28, 80, 99, 43, 65],
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setChartData({
        labels: mockApiData.labels,
        datasets: [{ data: mockApiData.values }],
      });
      setLoading(false);
    }, 1500); 
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

  if (error) {
    return (
      <BackgroundWrapper>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => {
            setError(null);
            setLoading(true);
            setTimeout(() => {
              setChartData({
                labels: mockApiData.labels,
                datasets: [{ data: mockApiData.values }],
              });
              setLoading(false);
            }, 700); //
          }}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </BackgroundWrapper>
    );
  }

  return (
    <BackgroundWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Panel de Control</Text>
        <Text style={styles.subtitle}>Ajustes Manuales del Sistema</Text>
        <View style={styles.chartContainer}>
          <LineChart
            data={chartData}
            width={320} 
            height={200} 
            yAxisLabel=""
            chartConfig={{
              backgroundColor: 'de9c21',
              backgroundGradientFrom: '#de9c21', 
              backgroundGradientTo: '#de9c21',
              decimalPlaces: 0,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#FF6347', 
    marginBottom: 15,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#FFA07A', 
    padding: 15,
    borderRadius: 10,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ConfigScreen;
