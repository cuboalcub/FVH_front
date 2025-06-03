import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMQTT } from '../hooks/useMQTT';
import { get_actuator_topics, post_actuator_mode_change } from '../services/actuadorService';
import BackgroundWrapper from './background';
import CustomBottomBar from './barraInferior';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ACTUATOR_TYPES = ['sprinkler', 'light', 'waterPump', 'notification'] as const;
type ActuatorType = typeof ACTUATOR_TYPES[number];

type ActuatorStatus = 'ON' | 'OFF' | 'UNKNOWN';
type ActuatorMode = 'AUTO' | 'MANUAL_OFF' | 'MANUAL_ON';

interface ActuatorData {
  status: ActuatorStatus;
  mode: ActuatorMode;
  lastUpdated?: Date;
}

export default function ActuatorScreen() {
  const route = useRoute<any>();
  const greenhouseId = route.params?.greenhouseId;

  const [currentTypeIndex, setCurrentTypeIndex] = useState(0);
  const [topics, setTopics] = useState<Record<ActuatorType, string>>({} as Record<ActuatorType, string>);
  const [statusTopics, setStatusTopics] = useState<Record<ActuatorType, string>>({} as Record<ActuatorType, string>);
  const [modeTopics, setModeTopics] = useState<Record<ActuatorType, string>>({} as Record<ActuatorType, string>);
  const [actuatorData, setActuatorData] = useState<Record<ActuatorType, ActuatorData>>({} as Record<ActuatorType, ActuatorData>);
  const [loading, setLoading] = useState(true);
  const [connectionRetries, setConnectionRetries] = useState(0);
  
  const currentType = ACTUATOR_TYPES[currentTypeIndex];

  // Configuración MQTT con reconexión automática
  const mqttOptions = {
    uri: "ws://192.168.137.171:8084/mqtt",
    clientId: `greenhouse-${greenhouseId}-${Date.now()}`,
    reconnectPeriod: 5000, // Intenta reconectar cada 5 segundos
  };

  const { messages, publish, isConnected, error: mqttError, connect, disconnect } = useMQTT(mqttOptions);

  // Efecto para manejar la conexión/reconexión MQTT
  useEffect(() => {
    const initializeConnection = async () => {
      try {
        if (!isConnected) {
          console.log('Intentando conectar a MQTT...');
          await connect([]); // Conecta primero sin topics
        }
      } catch (error) {
        console.error('Error al conectar MQTT:', error);
        if (connectionRetries < 3) {
          setTimeout(() => setConnectionRetries(prev => prev + 1), 5000);
        }
      }
    };

    initializeConnection();

    return () => {
      disconnect();
    };
  }, [connectionRetries]);

  // Suscribirse a tópicos cuando la conexión está activa
  useEffect(() => {
    if (isConnected && Object.keys(statusTopics).length > 0) {
      const topicsToSubscribe = [
        ...Object.values(statusTopics),
        ...Object.values(modeTopics)
      ].filter(Boolean);
      
      if (topicsToSubscribe.length > 0) {
        console.log('Suscribiendo a tópicos:', topicsToSubscribe);
        connect(topicsToSubscribe); // El hook debería manejar la suscripción
      }
    }
  }, [isConnected, statusTopics, modeTopics]);

  // Procesar mensajes MQTT
  useEffect(() => {
    const processMessages = () => {
      const newData = { ...actuatorData };

      ACTUATOR_TYPES.forEach(type => {
        const statusTopic = statusTopics[type];
        const modeTopic = modeTopics[type];

        if (statusTopic && messages[statusTopic]?.length) {
          try {
            const lastMessage = messages[statusTopic][messages[statusTopic].length - 1];
            const parsed = tryParseJson(lastMessage);
            if (parsed) {
              newData[type] = {
                ...newData[type],
                status: parsed.state === 'ON' ? 'ON' : 'OFF',
                lastUpdated: new Date()
              };
            }
          } catch (e) {
            console.error(`Error parsing status for ${type}:`, e);
          }
        }

        if (modeTopic && messages[modeTopic]?.length) {
          try {
            const lastMessage = messages[modeTopic][messages[modeTopic].length - 1];
            const parsed = tryParseJson(lastMessage);
            if (parsed) {
              newData[type] = {
                ...newData[type],
                mode: parsed.mode === 'AUTO' ? 'AUTO' : 
                     parsed.mode === 'MANUAL_ON' ? 'MANUAL_ON' : 'MANUAL_OFF',
                lastUpdated: new Date()
              };
            }
          } catch (e) {
            console.error(`Error parsing mode for ${type}:`, e);
          }
        }
      });

      setActuatorData(newData);
    };

    processMessages();
  }, [messages]);

  // Obtener tópicos al montar el componente
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setLoading(true);
        const topicList = await get_actuator_topics(greenhouseId);
        
        const baseMap: Record<ActuatorType, string> = {} as Record<ActuatorType, string>;
        const statusMap: Record<ActuatorType, string> = {} as Record<ActuatorType, string>;
        const modeMap: Record<ActuatorType, string> = {} as Record<ActuatorType, string>;

        topicList.forEach((topic: string) => {
          const match = topic.match(/actuator\/(\w+)(\/status|\/mode)?$/);
          if (match) {
            const type = match[1] as ActuatorType;
            if (ACTUATOR_TYPES.includes(type)) {
              if (topic.endsWith('/status')) {
                statusMap[type] = topic;
              } else if (topic.endsWith('/mode')) {
                modeMap[type] = topic;
              } else {
                baseMap[type] = topic;
              }
            }
          }
        });

        setTopics(baseMap);
        setStatusTopics(statusMap);
        setModeTopics(modeMap);

        // Inicializar datos
        const initialData = {} as Record<ActuatorType, ActuatorData>;
        ACTUATOR_TYPES.forEach(type => {
          initialData[type] = {
            status: 'UNKNOWN',
            mode: 'AUTO',
            lastUpdated: undefined
          };
        });
        setActuatorData(initialData);
        
      } catch (error) {
        Alert.alert('Error', 'No se pudieron obtener los tópicos');
        console.error('Error al obtener tópicos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, [greenhouseId]);

  // Manejar errores de MQTT
  useEffect(() => {
    if (mqttError) {
      console.error('MQTT error:', mqttError);
      if (connectionRetries >= 3) {
        Alert.alert('Error de conexión', 'No se pudo conectar al servidor MQTT. Por favor, verifica tu conexión.');
      }
    }
  }, [mqttError, connectionRetries]);

  const handleTestActuator = useCallback(async () => {
    if (!isConnected) {
      Alert.alert('Error', 'No hay conexión con el servidor');
      return;
    }

    const topic = topics[currentType];
    if (!topic) {
      Alert.alert('Error', 'No se encontró el tópico para este actuador');
      return;
    }

    try {
      await publish(topic, JSON.stringify({ action: 'test' }));
      Alert.alert('Prueba exitosa', `Comando enviado a ${currentType}`);
    } catch (error) {
      Alert.alert('Error', 'No se pudo enviar el comando');
      console.error('Error al probar actuador:', error);
    }
  }, [currentType, publish, topics, isConnected]);

  const handleToggleMode = useCallback(async () => {
    if (!isConnected) {
      Alert.alert('Error', 'No hay conexión con el servidor');
      return;
    }

    const modeTopic = modeTopics[currentType];
    if (!modeTopic) {
      Alert.alert('Error', 'No se encontró el tópico de modo');
      return;
    }

    const currentMode = actuatorData[currentType]?.mode || 'AUTO';
    const newMode = currentMode === 'AUTO' ? 'MANUAL_OFF' : 'AUTO';

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No hay token de autenticación');
      
      await post_actuator_mode_change(modeTopic, newMode, token);
      
      setActuatorData(prev => ({
        ...prev,
        [currentType]: {
          ...prev[currentType],
          mode: newMode
        }
      }));
      
    } catch (error) {
      Alert.alert('Error', 'No se pudo cambiar el modo');
      console.error('Error al cambiar modo:', error);
    }
  }, [currentType, modeTopics, actuatorData, isConnected]);

  const changeActuatorType = useCallback((direction: 'prev' | 'next') => {
    setCurrentTypeIndex(prev => {
      if (direction === 'prev' && prev > 0) return prev - 1;
      if (direction === 'next' && prev < ACTUATOR_TYPES.length - 1) return prev + 1;
      return prev;
    });
  }, []);

  const getActuatorIcon = (type: ActuatorType) => {
    const icons = {
      sprinkler: 'water',
      light: 'lightbulb',
      waterPump: 'water-pump',
      notification: 'bell',
      fan: 'fan'
    };
    return icons[type] || 'cog';
  };

  const tryParseJson = (str: string) => {
    try {
      return JSON.parse(str);
    } catch {
      return null;
    }
  };

  if (loading) {
    return (
      <BackgroundWrapper>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#ef6c00" />
          <Text className="mt-4 text-lg text-gray-700">Cargando actuadores...</Text>
        </View>
      </BackgroundWrapper>
    );
  }

  return (
    <BackgroundWrapper>
      <View className="flex-1 justify-center px-6">
        {/* Selector de actuador */}
        <View className="flex-row justify-between items-center mb-6">
          <TouchableOpacity 
            onPress={() => changeActuatorType('prev')} 
            disabled={currentTypeIndex === 0}
            className="p-2"
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={36}
              color={currentTypeIndex === 0 ? '#ccc' : '#ef6c00'}
            />
          </TouchableOpacity>
          
          <View className="flex-row items-center">
            <MaterialCommunityIcons
              name={getActuatorIcon(currentType)}
              size={28}
              color="#4a5568"
              className="mr-3"
            />
            <Text className="text-xl font-bold text-gray-800 capitalize">
              {currentType.replace(/([A-Z])/g, ' $1').trim()}
            </Text>
          </View>
          
          <TouchableOpacity 
            onPress={() => changeActuatorType('next')} 
            disabled={currentTypeIndex === ACTUATOR_TYPES.length - 1}
            className="p-2"
          >
            <MaterialCommunityIcons
              name="chevron-right"
              size={36}
              color={currentTypeIndex === ACTUATOR_TYPES.length - 1 ? '#ccc' : '#ef6c00'}
            />
          </TouchableOpacity>
        </View>

        {/* Panel de estado */}
        <View className="bg-white/90 rounded-xl p-6 shadow-md mb-6">
          <Text className="text-lg font-semibold mb-4">Estado del Actuador</Text>
          
          <ConnectionStatus isConnected={isConnected} retries={connectionRetries} />
          
          <StatusIndicator 
            label="Estado actual:"
            value={actuatorData[currentType]?.status}
            states={{
              'ON': { text: 'ENCENDIDO', color: '#10b981' },
              'OFF': { text: 'APAGADO', color: '#ef4444' },
              'UNKNOWN': { text: 'DESCONOCIDO', color: '#9ca3af' }
            }}
          />
          
          <StatusIndicator 
            label="Modo de operación:"
            value={actuatorData[currentType]?.mode}
            states={{
              'AUTO': { text: 'AUTOMÁTICO', color: '#10b981' },
              'MANUAL_OFF': { text: 'MANUAL (APAGADO)', color: '#3b82f6' },
              'MANUAL_ON': { text: 'MANUAL (ENCENDIDO)', color: '#3b82f6' },
              'UNKNOWN': { text: 'DESCONOCIDO', color: '#9ca3af' }
            }}
          />
          
          {actuatorData[currentType]?.lastUpdated && (
            <Text className="text-sm text-gray-500 mb-4">
              Última actualización: {actuatorData[currentType]?.lastUpdated?.toLocaleTimeString()}
            </Text>
          )}
        </View>
        
        {/* Botones de control */}
        <View className="flex-row justify-between space-x-4">
          <ActionButton
            label="Probar Actuador"
            onPress={handleTestActuator}
            disabled={!topics[currentType] || !isConnected}
            color="#ef6c00"
          />
          
          <ActionButton
            label={actuatorData[currentType]?.mode === 'AUTO' ? 'Cambiar a Manual' : 'Cambiar a Automático'}
            onPress={handleToggleMode}
            disabled={!modeTopics[currentType] || !isConnected}
            color="#3b82f6"
          />
        </View>
      </View>

      <CustomBottomBar />
    </BackgroundWrapper>
  );
}

// Componentes auxiliares para mejor legibilidad
const ConnectionStatus = ({ isConnected, retries }: { isConnected: boolean; retries: number }) => (
  <View className="flex-row items-center mb-4">
    <View 
      className="w-3 h-3 rounded-full mr-2" 
      style={{ backgroundColor: isConnected ? '#10b981' : '#ef4444' }}
    />
    <Text className="text-sm text-gray-600">
      {isConnected ? 'Conectado al sistema' : `Intentando conectar... (${retries}/3)`}
    </Text>
  </View>
);

const StatusIndicator = ({ 
  label, 
  value, 
  states 
}: {
  label: string;
  value?: string;
  states: Record<string, { text: string; color: string }>;
}) => {
  const status = value || 'UNKNOWN';
  const { text, color } = states[status] || { text: 'DESCONOCIDO', color: '#9ca3af' };

  return (
    <View className="mb-4">
      <Text className="text-gray-700 mb-2">{label}</Text>
      <View className="flex-row items-center">
        <View className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: color }} />
        <Text className="text-gray-700">{text}</Text>
      </View>
    </View>
  );
};

const ActionButton = ({ 
  label, 
  onPress, 
  disabled, 
  color 
}: {
  label: string;
  onPress: () => void;
  disabled: boolean;
  color: string;
}) => (
  <TouchableOpacity
    className="flex-1 px-4 py-3 rounded-lg"
    onPress={onPress}
    disabled={disabled}
    style={{ 
      backgroundColor: color,
      opacity: disabled ? 0.5 : 1 
    }}
  >
    <Text className="text-white text-center font-semibold">{label}</Text>
  </TouchableOpacity>
);