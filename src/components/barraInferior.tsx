import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

const CustomBottomBar = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  
  // Evita navegar a la pantalla actual
  const handleNavigation = (screenName: keyof RootStackParamList) => {
    if (route.name !== screenName) {
      navigation.navigate(screenName);
    }
  };

  // Determina si el botón está activo
  const isActive = (screenName: string) => route.name === screenName;

  return (
    <View className="absolute bottom-0 w-full pb-2 bg-white pt-2 border-t border-gray-200 ">
      <View className="flex-row justify-around items-center px-4">
        {/* Botón de Pedidos */}
        <TouchableOpacity 
          onPress={() => handleNavigation('PedidosScreen')}
          className={`items-center p-2 ${isActive('PedidosScreen') ? 'opacity-100' : 'opacity-70'}`}
          activeOpacity={0.6}
        >
          <MaterialIcons 
            name="shopping-cart" 
            size={24} 
            color={isActive('PedidosScreen') ? '#92400e' : '#6b7280'} 
          />
          <Text className={`text-xs mt-1 ${isActive('PedidosScreen') ? 'text-amber-800 font-semibold' : 'text-gray-500'}`}>
            Pedidos
          </Text>
        </TouchableOpacity>

        {/* Botón Central (Home) */}
        <TouchableOpacity 
          onPress={() => handleNavigation('Greenhouses')}
          className="items-center -mt-8"
          activeOpacity={0.6}
        >
          <View className={`p-4 rounded-full ${isActive('Greenhouses') ? 'bg-amber-600' : 'bg-amber-500'} shadow-lg`}>
            <Ionicons 
              name={isActive('Greenhouses') ? 'home' : 'home-outline'} 
              size={28} 
              color="white" 
            />
          </View>
        </TouchableOpacity>

        {/* Botón de Ajustes */}
        <TouchableOpacity 
          onPress={() => handleNavigation('Config')}
          className={`items-center p-2 ${isActive('Config') ? 'opacity-100' : 'opacity-70'}`}
          activeOpacity={0.6}
        >
          <MaterialIcons 
            name="settings" 
            size={24} 
            color={isActive('Config') ? '#92400e' : '#6b7280'} 
          />
          <Text className={`text-xs mt-1 ${isActive('Config') ? 'text-amber-800 font-semibold' : 'text-gray-500'}`}>
            Ajustes
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomBottomBar;