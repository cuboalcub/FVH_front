import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Animated } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import BackgroundWrapper from './background';
import CustomBottomBar from './barraInferior';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'GreenhouseDetails'>;

export default function GreenhouseDetailsScreen({ route, navigation }: Props) {
  const { greenhouseId, name } = route.params;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const racks = getRacksForGreenhouse(greenhouseId);

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <BackgroundWrapper>
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <ScrollView 
          className="flex-1 px-4 pt-4"
          showsVerticalScrollIndicator={false}
        >
          {/* Header with back button */}
          {/* Status bar */}
          <View className="flex-row items-center bg-white/10 rounded-full px-4 py-2 mb-6">
            <View className="w-3 h-3 bg-green-400 rounded-full mr-2" />
            <Text className="text-white text-sm">Todos los racks operativos</Text>
          </View>

          {/* Racks list */}
          <Text className="text-lg text-white mb-3">Racks instalados</Text>
          <View className="mb-24">
            {racks.map((rack) => (
              <TouchableOpacity
                key={rack.id}
                className="bg-white/10 rounded-xl p-4 mb-3 border border-white/20"
                onPress={() => navigation.navigate('RackDetails', { 
                  rackId: rack.id, 
                  greenhouseId, 
                  name: rack.name 
                })}
                activeOpacity={0.7}
              >
                <View className="flex-row items-center">
                  <Image 
                    source={require('../../assets/rack.png')} 
                    className="w-16 h-16 mr-3" 
                  />
                  <View className="flex-1">
                    <Text className="text-white font-semibold text-lg">{rack.name}</Text>
                    <Text className="text-white/60 text-sm mt-1">12 plantas activas</Text>
                  </View>
                  <MaterialIcons name="chevron-right" size={24} color="white" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        <CustomBottomBar />
      </Animated.View>
    </BackgroundWrapper>
  );
}

function getRacksForGreenhouse(greenhouseId: string) {
  if (greenhouseId === '1') {
    return [
      { id: '1', name: 'Rack A', status: 'optimal' },
      { id: '2', name: 'Rack B', status: 'warning' },
    ];
  } else if (greenhouseId === '2') {
    return [
      { id: '3', name: 'Rack X', status: 'optimal' },
      { id: '2', name: 'Rack Y', status: 'optimal' },
    ];
  } else if (greenhouseId === '3') {
    return [
      { id: '1', name: 'Rack 1', status: 'critical' },
      { id: '3', name: 'Rack 2', status: 'optimal' },
    ];
  } else {
    return [];
  }
}