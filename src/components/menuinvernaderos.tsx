import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Animated, Alert } from 'react-native';
import { useUser } from './usercontext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import BackgroundWrapper from './background';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { get_invernadores } from '../services/invernaderos';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamList, 'Greenhouses'>;

export default function GreenhousesScreen({ navigation }: Props) {
  const { userType, token } = useUser();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const [greenhouses, setGreenhouses] = React.useState<any[]>([]);

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('userType');
      await AsyncStorage.removeItem('group');
      // Redirigir al login y limpiar el stack de navegación
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'SignIn' }],
        })
      );
    } catch (error: any) {
      console.error('Error al cerrar sesión:', error);
      Alert.alert('Error', 'No se pudo cerrar sesión: ' + (error?.message || 'Error desconocido'));
    }
  };


  React.useEffect(() => {
    const fetchGreenhouses = async () => {
      try {
        const token =  await AsyncStorage.getItem("token")
        const res = await get_invernadores(token || undefined);
        if (res.status === 200 && Array.isArray(res.data)) {
          setGreenhouses(res.data);
        }
      } catch (error) {
        console.error('Error al obtener invernaderos:', error);
      }
    };
    fetchGreenhouses();
  }, []);

  return (
  <BackgroundWrapper>
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      <ScrollView className="flex-1 px-4 pt-20" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-2xl font-bold text-white">Mis Invernaderos</Text>
          <View className="flex-row space-x-4">
            <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
              <Ionicons name="notifications" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout}>
              <MaterialIcons name="logout" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Greenhouse Cards */}
        <View className="mb-6">
          <Text className="text-lg text-white mb-3">Tus instalaciones</Text>
          <View className="space-y-3">
            {greenhouses.map((house) => (
              <TouchableOpacity
                key={house.id}
                className="bg-white/10 rounded-xl p-4 border border-white/20"
                onPress={() => navigation.navigate('GreenhouseDetails', {
                  greenhouseId: house.id,
                  name: house.ubicacion
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
                    <Text className="text-white/80 mt-1">{house.num_bandejas} bandejas</Text>
                  </View>
                  <MaterialIcons name="chevron-right" size={24} color="white" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View className="mb-6">
          <Text className="text-lg text-white mb-3">Acciones rápidas</Text>
          <View className="flex-row flex-wrap justify-between">
            <TouchableOpacity
              className="w-[48%] bg-amber-500 rounded-xl p-4 mb-3 items-center"
              onPress={() => navigation.navigate('PedidosScreen')}
            >
              <MaterialIcons name="shopping-cart" size={28} color="white" />
              <Text className="text-white font-medium mt-2">Pedidos</Text>
            </TouchableOpacity>

            {userType === 'admin' && (
              <>
                <TouchableOpacity
                  className="w-[48%] bg-blue-600 rounded-xl p-4 items-center"
                  onPress={() => navigation.navigate('ConfigUsuariosScreen')}
                >
                  <MaterialIcons name="people" size={28} color="white" />
                  <Text className="text-white font-medium mt-2">Usuarios</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="w-[48%] bg-purple-600 rounded-xl p-4 items-center"
                  onPress={() => navigation.navigate('SensorData')}
                >
                  <MaterialIcons name="settings" size={28} color="white" />
                  <Text className="text-white font-medium mt-2">Configuración Sensores</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="w-[48%] bg-purple-600 rounded-xl p-4 items-center"
                  onPress={() => navigation.navigate('ConfigScreen')}
                >
                  <MaterialIcons name="settings" size={28} color="white" />
                  <Text className="text-white font-medium mt-2">Configuración</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        {/* Recent Activity */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg text-white">Actividad reciente</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
              <Text className="text-amber-400">Ver todo</Text>
            </TouchableOpacity>
          </View>
          <View className="bg-white/10 rounded-xl p-4">
            <View className="flex-row items-center mb-3">
              <View className="bg-green-400/20 p-2 rounded-full mr-3">
                <MaterialIcons name="check" size={16} color="green" />
              </View>
              <View className="flex-1">
                <Text className="text-white">Riego completado</Text>
                <Text className="text-white/50 text-xs">Invernadero 1 - hace 2h</Text>
              </View>
            </View>
            <View className="flex-row items-center">
              <View className="bg-yellow-400/20 p-2 rounded-full mr-3">
                <MaterialIcons name="warning" size={16} color="yellow" />
              </View>
              <View className="flex-1">
                <Text className="text-white">Temperatura elevada</Text>
                <Text className="text-white/50 text-xs">Invernadero 2 - hace 5h</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </Animated.View>
  </BackgroundWrapper>
);
}
