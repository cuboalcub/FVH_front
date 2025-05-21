import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import BackgroundWrapper from './background';
import CustomBottomBar from './barraInferior';
import { useMQTT } from '../hooks/useMQTT';

export default function SensorDataScreen() {
  const [activeTab, setActiveTab] = useState<'temperature' | 'humidity' | 'light'>('temperature');
  const [isLoading, setIsLoading] = useState(true);
  const [sensorValues, setSensorValues] = useState({
    temperature: [] as number[],
    humidity: [] as number[],
    light: [] as number[],
  });

  const { messages } = useMQTT([
    "greenhouse/greenhouse-1/sensor/temperature",
    "greenhouse/greenhouse-1/sensor/humidity",
    "greenhouse/greenhouse-1/sensor/light"
  ]);

  useEffect(() => {
    const allTopics = Object.keys(messages);
    if (allTopics.length === 0) return;
  
    // Combine the latest message from each topic (if any)
    allTopics.forEach(topic => {
      const topicMessages = messages[topic];
      if (!topicMessages?.length) return;
  
      const lastMessage = topicMessages[topicMessages.length - 1];
  
      try {
        const valueObj = JSON.parse(lastMessage);
        const newValue = parseFloat(valueObj.value);
  
        if (!isNaN(newValue)) {
          setSensorValues((prev) => {
            const updatedValues = { ...prev };
  
            if (topic.includes('temperature')) {
              const newArr = [...prev.temperature, newValue];
              if (newArr.length > 10) newArr.shift();
              updatedValues.temperature = newArr;
            } else if (topic.includes('humidity')) {
              const newArr = [...prev.humidity, newValue];
              if (newArr.length > 10) newArr.shift();
              updatedValues.humidity = newArr;
            } else if (topic.includes('light')) {
              const newArr = [...prev.light, newValue];
              if (newArr.length > 10) newArr.shift();
              updatedValues.light = newArr;
            }
  
            return updatedValues;
          });
        }
      } catch (e) {
        console.error('❌ Error procesando mensaje MQTT:', e);
      }
    });
  }, [messages]);
  

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(239, 108, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#ff8c00',
    },
  };

  const chartData = {
    labels: sensorValues[activeTab].map((_, i) => `${i + 1}`),
    datasets: [{ data: sensorValues[activeTab].length ? sensorValues[activeTab] : [0] }],
    unit: activeTab === 'temperature' ? '°C' : activeTab === 'humidity' ? '%' : 'lux',
    icon: activeTab === 'temperature' ? 'thermometer' :
          activeTab === 'humidity' ? 'water-percent' : 'white-balance-sunny'
  };

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
          {['temperature', 'humidity', 'light'].map((key) => (
            <TouchableOpacity
              key={key}
              className={`py-2 px-4 rounded-md ${activeTab === key ? 'bg-amber-500' : ''}`}
              onPress={() => setActiveTab(key as typeof activeTab)}
            >
              <View className="flex-row items-center">
                <MaterialCommunityIcons 
                  name={
                    key === 'temperature' ? 'thermometer' :
                    key === 'humidity' ? 'water-percent' : 'white-balance-sunny'
                  }
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

        {/* Gráfico */}
        <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          <View className="flex-row items-center mb-3">
            <MaterialCommunityIcons 
              name={chartData.icon} 
              size={24} 
              color="#ef6c00" 
            />
            <Text className="text-lg font-semibold ml-2">
              {activeTab === 'temperature' ? 'Temperatura' :
               activeTab === 'humidity' ? 'Humedad' : 'Nivel de Luminosidad'}
            </Text>
          </View>

          <LineChart
            data={{
              labels: chartData.labels,
              datasets: chartData.datasets
            }}
            width={350}
            height={220}
            yAxisSuffix={chartData.unit}
            yAxisInterval={1}
            chartConfig={chartConfig}
            bezier
            style={{ borderRadius: 16, paddingRight: 30 }}
          />
        </View>

        {/* Estadísticas */}
        <View className="bg-white rounded-xl p-4 mb-6">
          <Text className="text-lg font-semibold mb-2">Estadísticas</Text>
          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-gray-500 text-sm">Mínimo</Text>
              <Text className="text-xl font-bold">
                {sensorValues[activeTab].length ? Math.min(...sensorValues[activeTab]).toFixed(1) : '--'}{chartData.unit}
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-gray-500 text-sm">Promedio</Text>
              <Text className="text-xl font-bold">
                {sensorValues[activeTab].length ? (
                  (sensorValues[activeTab].reduce((a, b) => a + b, 0) / sensorValues[activeTab].length).toFixed(1)
                ) : '--'}{chartData.unit}
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-gray-500 text-sm">Máximo</Text>
              <Text className="text-xl font-bold">
                {sensorValues[activeTab].length ? Math.max(...sensorValues[activeTab]).toFixed(1) : '--'}{chartData.unit}
              </Text>
            </View>
          </View>
        </View>

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
