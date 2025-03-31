import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import axios from 'axios';
import BackgroundWrapper from './background';



const ConfigScreen = () => {

  const [chartData, setChartData] = useState({
    labels: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    datasets: [{ data: [0, 0, 0, 0, 0, 0, 0] }]
  });

  // Fetch data from API
  useEffect(() => {
    axios.get('mqtt://192.168.158.151:1883') 
      .then(response => {
        setChartData({
          labels: response.data.labels,
          datasets: [{ data: response.data.values }]
        });
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  // Handlers for buttons
  const activateSprinklers = () => alert('Aspersores Activados');
  const activateLights = () => alert('Luces Activadas');

  return (
    
    <BackgroundWrapper>
   
      <Text style={styles.title}>Configuración</Text>
      <Text style={styles.title}>Ajustes Manuales</Text>
      <LineChart
        data={chartData}
        width={350}
        height={220}
        yAxisLabel=""
        chartConfig={{
          backgroundColor: '#ff8c00',
          backgroundGradientFrom: '#ff8c00',
          backgroundGradientTo: '#ff8c00',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        style={styles.chart}
      />
      <TouchableOpacity style={styles.button} onPress={activateSprinklers}>
        <Text style={styles.buttonText}>Activar Aspersores</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={activateLights}>
        <Text style={styles.buttonText}>Activar Luces</Text>
      </TouchableOpacity>
    </BackgroundWrapper>
  );
};

const styles = StyleSheet.create({
  
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  chart: { marginVertical: 10, borderRadius: 10 },
  button: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 10,
    width: 250,
    alignItems: 'center',
    marginVertical: 5,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default ConfigScreen;
