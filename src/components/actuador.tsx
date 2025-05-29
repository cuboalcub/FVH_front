import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMQTT } from '../hooks/useMQTT';
import { get_actuator_topics } from '../utils/actuadorService';
import BackgroundWrapper from './background';
import CustomBottomBar from './barraInferior';

const actuatorTypes = ['sprinkler', 'light', 'waterPump', 'notification'];

export default function ActuatorScreen() {
  const route = useRoute<any>();
  const greenhouseId = route.params?.greenhouseId;

  const [currentTypeIndex, setCurrentTypeIndex] = useState(0);
  const [topics, setTopics] = useState<{ [key: string]: string }>({});
  const [statusTopics, setStatusTopics] = useState<{ [key: string]: string }>({});
  const [modeTopics, setModeTopics] = useState<{ [key: string]: string }>({});
  const currentType = actuatorTypes[currentTypeIndex];

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const topicList = await get_actuator_topics(greenhouseId);
        const baseMap: Record<string, string> = {};
        const statusMap: Record<string, string> = {};
        const modeMap: Record<string, string> = {};

        topicList.forEach((topic: string) => {
          const match = topic.match(/actuator\/(\w+)(\/status|\/mode)?$/);
          if (match) {
            const type = match[1];
            if (topic.endsWith('/status')) {
              statusMap[type] = topic;
            } else if (topic.endsWith('/mode')) {
              modeMap[type] = topic;
            } else {
              baseMap[type] = topic;
            }
          }
        });

        setTopics(baseMap);
        setStatusTopics(statusMap);
        setModeTopics(modeMap);
      } catch (error) {
        console.error('Error al obtener tópicos:', error);
      }
    };

    fetchTopics();
  }, [greenhouseId]);

  // Subscribe to both status and mode topics
  const { messages } = useMQTT([
    ...Object.values(statusTopics),
    ...Object.values(modeTopics),
  ]);

  const currentStatus = statusTopics[currentType]
    ? messages[statusTopics[currentType]] || 'Sin datos'
    : 'No topic';

  const currentMode = modeTopics[currentType]
    ? messages[modeTopics[currentType]] || 'Sin datos'
    : 'No topic';

  const handleTest = () => {
    const topic = topics[currentType];
    const payload = JSON.stringify({ action: 'test' });
    console.log('Publicar en:', topic, payload);
    Alert.alert('Mensaje enviado', `Prueba enviada a ${currentType}`);
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
          <Text className="text-lg font-semibold mb-2">Datos Actuador</Text>
          <Text className="text-gray-700 mb-4">Estado</Text>

          {/* Estado block */}
          <View className="flex-row items-center mb-4">
            {(() => {
              let statusColor = 'gray';
              let displayStatus = 'Sin datos';

              try {
                const matches = (Array.isArray(currentStatus) ? currentStatus.join('') : currentStatus).match(/\{[^}]+\}/g);
                if (matches && matches.length > 0) {
                  const lastState = JSON.parse(matches[matches.length - 1]);
                  const stateValue = (lastState.state || '').toLowerCase();

                  if (stateValue === 'on') {
                    statusColor = 'green';
                    displayStatus = 'Encendido';
                  } else if (stateValue === 'off') {
                    statusColor = 'red';
                    displayStatus = 'Apagado';
                  } else {
                    displayStatus = stateValue;
                  }
                }
              } catch (e) {
                console.error('Error parsing status JSON:', e);
              }

              return (
                <>
                  <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: statusColor, marginRight: 8 }} />
                  <Text className="text-gray-700">{displayStatus}</Text>
                </>
              );
            })()}
          </View>

          {/* Modo block */}
          <Text className="text-gray-700 mb-4">Modo</Text>
          <View className="flex-row items-center mb-4">
            {(() => {
              let modeColor = 'gray';
              let displayMode = 'Automático';

              try {
                const matches = (Array.isArray(currentMode) ? currentMode.join('') : currentMode).match(/\{[^}]+\}/g);
                if (matches && matches.length > 0) {
                  const lastMode = JSON.parse(matches[matches.length - 1]);
                  const modeValue = (lastMode.state || '').toLowerCase();

                  if (modeValue === 'AUTO') {
                    modeColor = 'green';
                    displayMode = 'Automático';
                  } else if (modeValue === 'MANUAL') {
                    modeColor = 'red';
                    displayMode = 'Manual';
                  } else {
                    displayMode = modeValue;
                  }
                }
              } catch (e) {
                console.error('Error parsing mode JSON:', e);
              }

              return (
                <>
                  <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: modeColor, marginRight: 8 }} />
                  <Text className="text-gray-700">{displayMode}</Text>
                </>
              );
            })()}
          </View>

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
