import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMQTT } from '../hooks/useMQTT';
import { get_actuator_topics  } from '../utils/actuadorService';
import BackgroundWrapper from './background';
import CustomBottomBar from './barraInferior';

const actuatorTypes = ['sprinkler', 'light', 'waterPump', 'notification'];

export default function ActuatorScreen() {
  const route = useRoute<any>();
  const greenhouseId = route.params?.greenhouseId;

  const [currentTypeIndex, setCurrentTypeIndex] = useState(0);
  const [topics, setTopics] = useState<{ [key: string]: string }>({});
  const [statusTopics, setStatusTopics] = useState<{ [key: string]: string }>({});
  const currentType = actuatorTypes[currentTypeIndex];

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const topicList = await get_actuator_topics(greenhouseId);
        const baseMap: Record<string, string> = {};
        const statusMap: Record<string, string> = {};

        topicList.forEach((topic: string) => {
          const match = topic.match(/actuator\/(\w+)(\/status)?$/);
          if (match) {
            const type = match[1];
            if (topic.endsWith('/status')) {
              statusMap[type] = topic;
            } else {
              baseMap[type] = topic;
            }
          }
        });

        setTopics(baseMap);
        setStatusTopics(statusMap);
      } catch (error) {
        console.error('Error al obtener tópicos:', error);
      }
    };

    fetchTopics();
  }, [greenhouseId]);

  const { messages } = useMQTT(Object.values(statusTopics));
  const currentStatus = statusTopics[currentType] ? messages[statusTopics[currentType]] || 'Sin datos' : 'No topic';

  const handleTest = () => {
    const topic = topics[currentType];
    const payload = JSON.stringify({ action: 'test' });
    console.log('Publicar en:', topic, payload);
    Alert.alert('Mensaje enviado', `Prueba enviada a ${currentType}`);
    // Aquí podrías usar mqttClient.publish(topic, payload) si lo implementas
  };

  const changeType = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentTypeIndex > 0) {
      setCurrentTypeIndex(currentTypeIndex - 1);
    } else if (direction === 'next' && currentTypeIndex < actuatorTypes.length - 1) {
      setCurrentTypeIndex(currentTypeIndex + 1);
    }
  };

  return (
    <BackgroundWrapper>
      <View className="flex-1 justify-center px-6">
        <View className="flex-row justify-between items-center mb-6">
          <TouchableOpacity onPress={() => changeType('prev')} disabled={currentTypeIndex === 0}>
            <MaterialCommunityIcons
              name="chevron-left"
              size={36}
              color={currentTypeIndex === 0 ? '#ccc' : '#ef6c00'}
            />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-800 capitalize">{currentType}</Text>
          <TouchableOpacity onPress={() => changeType('next')} disabled={currentTypeIndex === actuatorTypes.length - 1}>
            <MaterialCommunityIcons
              name="chevron-right"
              size={36}
              color={currentTypeIndex === actuatorTypes.length - 1 ? '#ccc' : '#ef6c00'}
            />
          </TouchableOpacity>
        </View>

        <View className="bg-white/90 rounded-xl p-6 shadow-md">
          <Text className="text-lg font-semibold mb-2">Estado MQTT</Text>
          <Text className="text-gray-700 mb-4">{currentStatus}</Text>

          <TouchableOpacity
            className="bg-orange-600 px-4 py-3 rounded-lg mt-2"
            onPress={handleTest}
            disabled={!topics[currentType]}
          >
            <Text className="text-white text-center font-semibold">
              Probar {currentType}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <CustomBottomBar />
    </BackgroundWrapper>
  );
}
