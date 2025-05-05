import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import BackgroundWrapper from './background';
import CustomBottomBar from './barraInferior';

export default function SensorDataScreen() {
  const [activeTab, setActiveTab] = useState('temperature');
  const [isLoading, setIsLoading] = useState(true);

  // Datos simulados de sensores
  const sensorData = {
    temperature: {
      labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
      datasets: [{ data: [22, 24, 26, 28, 25, 23] }],
      unit: '°C',
      icon: 'thermometer',
    },
    humidity: {
      labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
      datasets: [{ data: [60, 65, 70, 75, 72, 68] }],
      unit: '%',
      icon: 'water-percent',
    },
    light: {
      labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
      datasets: [{ data: [200, 500, 800, 1200, 900, 400] }],
      unit: 'lux',
      icon: 'white-balance-sunny',
    },
  };

  useEffect(() => {
    // Simular carga de datos
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleCalibration = () => {
    Alert.alert(
      'Calibración',
      '¿Desea realizar la calibración de sensores?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Confirmar', onPress: () => Alert.alert('Calibración', 'Calibración iniciada') },
      ]
    );
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(239, 108, 0, ${opacity})`, // Color naranja
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    useShadowColorFromDataset: false,
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#ff8c00',
    },
  };

  if (isLoading) {
    return (
      <BackgroundWrapper>
        <View className="flex-1 justify-center items-center">
          <View className="bg-white/90 p-6 rounded-xl items-center">
            <MaterialCommunityIcons name="progress-clock" size={40} color="#ef6c00" />
            <Text className="text-lg font-medium mt-2">Cargando datos de sensores...</Text>
          </View>
        </View>
      </BackgroundWrapper>
    );
  }

  return (
    <BackgroundWrapper>
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <Text className="text-2xl font-bold text-gray-800 mb-4">Monitoreo de Sensores</Text>
        
        {/* Selector de pestañas */}
        <View className="flex-row justify-around mb-6 bg-white rounded-lg p-1">
          {Object.keys(sensorData).map((key) => (
            <TouchableOpacity
              key={key}
              className={`py-2 px-4 rounded-md ${activeTab === key ? 'bg-amber-500' : ''}`}
              onPress={() => setActiveTab(key)}
            >
              <View className="flex-row items-center">
                <MaterialCommunityIcons 
                  name={sensorData[key].icon} 
                  size={20} 
                  color={activeTab === key ? 'white' : '#6b7280'} 
                />
                <Text className={`ml-2 ${activeTab === key ? 'text-white font-medium' : 'text-gray-600'}`}>
                  {key === 'temperature' ? 'Temperatura' : 
                   key === 'humidity' ? 'Humedad' : 'Luminosidad'}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Gráfico seleccionado */}
        <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          <View className="flex-row items-center mb-3">
            <MaterialCommunityIcons 
              name={sensorData[activeTab].icon} 
              size={24} 
              color="#ef6c00" 
            />
            <Text className="text-lg font-semibold ml-2">
              {activeTab === 'temperature' ? 'Temperatura' : 
               activeTab === 'humidity' ? 'Humedad' : 'Nivel de Luminosidad'}
            </Text>
          </View>
          
          <LineChart
            data={sensorData[activeTab]}
            width={350}
            height={220}
            yAxisSuffix={sensorData[activeTab].unit}
            yAxisInterval={1}
            chartConfig={chartConfig}
            bezier
            style={{
              borderRadius: 16,
              paddingRight: 30, // Espacio para el último punto
            }}
          />
        </View>

        {/* Información adicional */}
        <View className="bg-white rounded-xl p-4 mb-6">
          <Text className="text-lg font-semibold mb-2">Estadísticas</Text>
          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-gray-500 text-sm">Mínimo</Text>
              <Text className="text-xl font-bold">
                {Math.min(...sensorData[activeTab].datasets[0].data)}{sensorData[activeTab].unit}
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-gray-500 text-sm">Promedio</Text>
              <Text className="text-xl font-bold">
                {(sensorData[activeTab].datasets[0].data.reduce((a, b) => a + b, 0) / 
                 sensorData[activeTab].datasets[0].data.length).toFixed(1)}{sensorData[activeTab].unit}
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-gray-500 text-sm">Máximo</Text>
              <Text className="text-xl font-bold">
                {Math.max(...sensorData[activeTab].datasets[0].data)}{sensorData[activeTab].unit}
              </Text>
            </View>
          </View>
        </View>

        {/* Botón de calibración */}
        <TouchableOpacity 
          className="flex-row items-center justify-center bg-amber-500 py-3 rounded-lg mb-6"
          onPress={handleCalibration}
        >
          <MaterialCommunityIcons name="wrench" size={20} color="white" />
          <Text className="text-white font-medium ml-2">Realizar Calibración</Text>
        </TouchableOpacity>
      </ScrollView>

      <CustomBottomBar />
    </BackgroundWrapper>
  );
}