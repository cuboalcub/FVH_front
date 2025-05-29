import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Animated, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import BackgroundWrapper from './background';
import CustomBottomBar from './barraInferior';
import { MaterialIcons } from '@expo/vector-icons';
import { get_racks } from '../utils/invernaderos'; // Asegúrate que la ruta sea correcta
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = NativeStackScreenProps<RootStackParamList, 'GreenhouseDetails'>;

export default function GreenhouseDetailsScreen({ route, navigation }: Props) {
  const { greenhouseId, name } = route.params;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [racks, setRacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    const fetchRacks = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem("token") // O usa contexto / secure storage si ya lo tienes
        const response = await get_racks( greenhouseId, token || undefined);
        setRacks(response?.data || []);
      } catch (err: any) {
        setError(err.message || 'Error al obtener los racks');
      } finally {
        setLoading(false);
      }
    };

    fetchRacks();
  }, [greenhouseId]);

  return (
    <BackgroundWrapper>
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <ScrollView 
          className="flex-1 px-4 pt-4"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-row items-center bg-white/10 rounded-full px-4 py-2 mb-6">
            <View className="w-3 h-3 bg-green-400 rounded-full mr-2" />
            <Text className="text-white text-sm">Todos los racks operativos</Text>
          </View>

          <Text className="text-lg text-white mb-3">Racks instalados</Text>

          {loading ? (
            <ActivityIndicator size="large" color="#ffffff" />
          ) : error ? (
            <Text className="text-red-400 mb-4">{error}</Text>
          ) : (
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
          )}
        </ScrollView>
        <CustomBottomBar />
      </Animated.View>
    </BackgroundWrapper>
  );
}
