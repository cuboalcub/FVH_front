import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, useWindowDimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import BackgroundWrapper from './background';
import CustomBottomBar from './barraInferior';
import { useMQTT } from '../hooks/useMQTT';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { get_invernadores } from '../services/invernaderos';

// Tipo para los datos de los sensores
type SensorData = {
  value: number;
  timestamp: number;
};

export default function SensorDataScreen() {
  const [activeTab, setActiveTab] = useState<'temperature' | 'humidity' | 'light'>('temperature');
  const [isLoading, setIsLoading] = useState(true);
  const { width } = useWindowDimensions();
  const chartWidth = width - 40;
  
  // Estado mejorado para almacenar datos históricos
  const [sensorData, setSensorData] = useState<{
    temperature: SensorData[];
    humidity: SensorData[];
    light: SensorData[];
  }>({
    temperature: [],
    humidity: [],
    light: []
  });

  const [greenhouses, setGreenhouses] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');

  const currentGreenhouse = greenhouses[currentIndex];
  const topicBase = currentGreenhouse ? `greenhouse/greenhouse-${currentGreenhouse.id}/sensor` : '';

  // Configuración MQTT mejorada
  const { messages, isConnected, error, connect, disconnect } = useMQTT({
    uri: 'ws://192.168.137.171:8084/mqtt',
    clientId: `mobile-app-${Math.random().toString(16).substr(2, 8)}`
  });

  // Conectar/desconectar MQTT cuando cambia el invernadero
  useEffect(() => {
    if (topicBase) {
      const topics = [
        `${topicBase}/temperature`,
        `${topicBase}/humidity`,
        `${topicBase}/light`
      ];
      connect(topics);
      return () => disconnect();
    }
  }, [topicBase]);

  // Manejar estado de conexión
  useEffect(() => {
    if (error) {
      setConnectionStatus('error');
    } else if (isConnected) {
      setConnectionStatus('connected');
    } else {
      setConnectionStatus('connecting');
    }
  }, [isConnected, error]);

  // Obtener lista de invernaderos
  const fetchGreenhouses = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem("token");
      const res = await get_invernadores(token || undefined);
      if (res.status === 200 && Array.isArray(res.data)) {
        setGreenhouses(res.data);
      }
    } catch (error) {
      console.error('Error al obtener invernaderos:', error);
      Alert.alert('Error', 'No se pudieron cargar los invernaderos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGreenhouses();
  }, [fetchGreenhouses]);

  // Procesar mensajes MQTT
  const processMessage = useCallback((topic: string, message: string) => {
    try {
      const valueObj = JSON.parse(message);
      const value = typeof valueObj.value === 'string' ? 
                   parseFloat(valueObj.value) : 
                   valueObj.value;
      
      if (isNaN(value)) return null;

      const newDataPoint = {
        value,
        timestamp: Date.now()
      };

      return newDataPoint;
    } catch (e) {
      console.error('Error procesando mensaje MQTT:', e);
      return null;
    }
  }, []);

  // Actualizar datos cuando llegan nuevos mensajes
  useEffect(() => {
    const allTopics = Object.keys(messages);
    if (allTopics.length === 0) return;

    setSensorData(prev => {
      const newData = {...prev};
      let hasUpdates = false;

      allTopics.forEach(topic => {
        const topicMessages = messages[topic];
        if (!topicMessages?.length) return;

        const lastMessage = topicMessages[topicMessages.length - 1];
        const dataPoint = processMessage(topic, lastMessage);
        if (!dataPoint) return;

        hasUpdates = true;
        const dataKey = topic.includes('temperature') ? 'temperature' :
                       topic.includes('humidity') ? 'humidity' : 'light';

        // Mantener solo los últimos 20 valores
        const newValues = [...newData[dataKey], dataPoint].slice(-6);
        newData[dataKey] = newValues;
      });

      return hasUpdates ? newData : prev;
    });
  }, [messages, processMessage]);

  // Configuración del gráfico
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

  // Preparar datos para el gráfico
  const prepareChartData = () => {
    const currentData = sensorData[activeTab];
    const values = currentData.map(item => item.value);
    const timestamps = currentData.map(item => 
      new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    );

    return {
      labels: timestamps.length ? timestamps : [''],
      datasets: [{ data: values.length ? values : [0] }],
      unit: activeTab === 'temperature' ? '°C' : activeTab === 'humidity' ? '%' : 'lux',
      icon: activeTab === 'temperature' ? 'thermometer' :
            activeTab === 'humidity' ? 'water-percent' : 'white-balance-sunny'
    };
  };

  const chartData = prepareChartData();

  // Calcular estadísticas
  const calculateStats = () => {
    const values = sensorData[activeTab].map(item => item.value);
    if (!values.length) return { min: 0, avg: 0, max: 0 };

    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;

    return { min, avg, max };
  };

  const stats = calculateStats();

  const handleCalibration = () => {
    Alert.alert(
      'Calibración',
      '¿Desea realizar la calibración de sensores?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Confirmar', 
          onPress: () => {
            // Aquí iría la lógica para iniciar la calibración
            Alert.alert('Calibración', 'Calibración iniciada');
          } 
        },
      ]
    );
  };

  const changeGreenhouse = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex >= 0 && newIndex < greenhouses.length) {
      setIsLoading(true);
      setCurrentIndex(newIndex);
      // Limpiar datos al cambiar de invernadero
      setSensorData({ temperature: [], humidity: [], light: [] });
      
      // Pequeño delay para mejor experiencia de usuario
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  if (!currentGreenhouse || isLoading) {
    return (
      <BackgroundWrapper>
        <View className="flex-1 justify-center items-center">
          <View className="bg-white/90 p-6 rounded-xl items-center">
            <MaterialCommunityIcons 
              name={connectionStatus === 'connected' ? 'check-circle' : 
                   connectionStatus === 'error' ? 'alert-circle' : 'progress-clock'} 
              size={40} 
              color={connectionStatus === 'connected' ? '#4CAF50' : 
                    connectionStatus === 'error' ? '#F44336' : '#FF9800'} 
            />
            <Text className="text-lg font-medium mt-2">
              {connectionStatus === 'connected' ? 'Conectado' :
               connectionStatus === 'error' ? 'Error de conexión' : 'Conectando...'}
            </Text>
            <Text className="text-sm text-gray-600 mt-1">
              {currentGreenhouse?.nombre || 'Cargando datos...'}
            </Text>
          </View>
        </View>
      </BackgroundWrapper>
    );
  }

  return (
    <BackgroundWrapper>
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Encabezado con navegación */}
        <View className="flex-row justify-between items-center my-4 bg-white/90 rounded-lg p-2">
          <TouchableOpacity
            onPress={() => changeGreenhouse('prev')}
            disabled={currentIndex === 0}
            className={`p-2 ${currentIndex === 0 ? 'opacity-30' : ''}`}
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={28}
              color="#ef6c00"
            />
          </TouchableOpacity>
          
          <View className="items-center">
            <Text className="text-xl font-bold text-gray-800">
              {currentGreenhouse.nombre}
            </Text>
            <Text className="text-sm text-gray-500">
              {connectionStatus === 'connected' ? 'En línea' : 'Sin conexión'}
            </Text>
          </View>
          
          <TouchableOpacity
            onPress={() => changeGreenhouse('next')}
            disabled={currentIndex === greenhouses.length - 1}
            className={`p-2 ${currentIndex === greenhouses.length - 1 ? 'opacity-30' : ''}`}
          >
            <MaterialCommunityIcons
              name="chevron-right"
              size={28}
              color="#ef6c00"
            />
          </TouchableOpacity>
        </View>

        {/* Pestañas de sensores */}
        <View className="flex-row justify-between mb-6 bg-white rounded-lg p-1">
          {[
            { key: 'temperature', label: 'Temperatura', icon: 'thermometer' },
            { key: 'humidity', label: 'Humedad', icon: 'water-percent' },
            { key: 'light', label: 'Luz', icon: 'white-balance-sunny' }
          ].map(({ key, label, icon }) => (
            <TouchableOpacity
              key={key}
              className={`flex-1 items-center py-2 rounded-md ${activeTab === key ? 'bg-amber-500' : ''}`}
              onPress={() => setActiveTab(key as typeof activeTab)}
            >
              <View className="flex-row items-center">
                <MaterialCommunityIcons 
                  name={icon}
                  size={20}
                  color={activeTab === key ? 'white' : '#6b7280'} 
                />
                <Text className={`ml-2 ${activeTab === key ? 'text-white font-medium' : 'text-gray-600'}`}>
                  {label}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Gráfico */}
        <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <MaterialCommunityIcons 
                name={chartData.icon} 
                size={24} 
                color="#ef6c00" 
              />
              <Text className="text-lg font-semibold ml-2">
                {activeTab === 'temperature' ? 'Temperatura' :
                 activeTab === 'humidity' ? 'Humedad' : 'Luminosidad'}
              </Text>
            </View>
            <Text className="text-gray-500 text-sm">
              {sensorData[activeTab].length ? 
               `Última actualización: ${new Date(sensorData[activeTab][sensorData[activeTab].length-1].timestamp).toLocaleTimeString()}` : 
               'Sin datos'}
            </Text>
          </View>

          {sensorData[activeTab].length > 0 ? (
            <LineChart
              data={{
                labels: chartData.labels,
                datasets: chartData.datasets
              }}
              width={chartWidth}
              height={220}
              yAxisSuffix={chartData.unit}
              yAxisInterval={1}
              chartConfig={chartConfig}
              bezier
              style={{ borderRadius: 16 }}
            />
          ) : (
            <View className="h-[220px] justify-center items-center bg-gray-100 rounded-lg">
              <Text className="text-gray-500">No hay datos disponibles</Text>
            </View>
          )}
        </View>

        {/* Estadísticas */}
        <View className="bg-white rounded-xl p-4 mb-6">
          <Text className="text-lg font-semibold mb-3">Estadísticas</Text>
          <View className="flex-row justify-between">
            <StatCard 
              label="Mínimo" 
              value={stats.min.toFixed(1)} 
              unit={chartData.unit} 
              icon="arrow-down" 
              color="#EF5350"
            />
            <StatCard 
              label="Promedio" 
              value={stats.avg.toFixed(1)} 
              unit={chartData.unit} 
              icon="equal" 
              color="#42A5F5"
            />
            <StatCard 
              label="Máximo" 
              value={stats.max.toFixed(1)} 
              unit={chartData.unit} 
              icon="arrow-up" 
              color="#66BB6A"
            />
          </View>
        </View>

      </ScrollView>

      <CustomBottomBar />
    </BackgroundWrapper>
  );
}

// Componente auxiliar para mostrar estadísticas
const StatCard = ({ label, value, unit, icon, color }: { 
  label: string; 
  value: string; 
  unit: string; 
  icon: string;
  color: string;
}) => (
  <View className="items-center">
    <Text className="text-gray-500 text-sm">{label}</Text>
    <View className="flex-row items-center mt-1">
      <MaterialCommunityIcons name={icon} size={16} color={color} />
      <Text className="text-xl font-bold ml-1">
        {value === '0.0' ? '--' : value}{unit}
      </Text>
    </View>
  </View>
);