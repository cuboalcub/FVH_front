// pagina solo para botones de activar y desactivar botones 

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackgroundWrapper from './background';
import CustomBottomBar from './barraInferior';
import { get_invernadores } from '../utils/invernaderos';
import { RootStackParamList } from '../App';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'Greenhouses'>;

export default function ConfigScreen({ navigation }: Props) {
  const [greenhouses, setGreenhouses] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const currentGreenhouse = greenhouses[currentIndex];

  useEffect(() => {
    const fetchGreenhouses = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const res = await get_invernadores(token || undefined);
        if (res.status === 200 && Array.isArray(res.data)) {
          setGreenhouses(res.data);
        }
      } catch (error) {
        console.error('❌ Error al obtener invernaderos:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGreenhouses();
  }, []);

  if (isLoading || !currentGreenhouse) {
    return (
      <BackgroundWrapper>
        <View className="flex-1 justify-center items-center">
          <View className="bg-white/90 p-6 rounded-xl items-center">
            <MaterialCommunityIcons name="progress-clock" size={40} color="#ef6c00" />
            <Text className="text-lg font-medium mt-2">Cargando configuración...</Text>
          </View>
        </View>
      </BackgroundWrapper>
    );
  }

  return (

    <BackgroundWrapper>
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>



    {/* Greenhouse Cards */}
    <View className="mb-6">
            <Text className="text-lg text-white mb-3">Invernaderos</Text>
            <View className="space-y-3">
              {greenhouses.map((house) => (
                <TouchableOpacity
                  key={house.id}
                  className="bg-white/10 rounded-xl p-4 border border-white/20"
                  onPress={() => navigation.navigate('ActuatorScreen', {
                    greenhouseId: house.id
                  })}
                >
                  <View className="flex-row items-center">
                    <Image
                      source={require('../../assets/greenhouse.png')}
                      className="w-16 h-16 mr-3"
                    />
                    <View className="flex-1">
                      <View className="flex-row justify-between items-center">
                        <Text className="text-white font-bold text-lg">{house.ubicacion}</Text>
                      </View>
                    </View>
                    <MaterialIcons name="chevron-right" size={24} color="white" />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
      </ScrollView>
      <CustomBottomBar />
    </BackgroundWrapper>
  );
}
