import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Animated, ScrollView , Modal, TextInput} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import BackgroundWrapper from './background';
import CustomBottomBar from './barraInferior';
import { Picker } from '@react-native-picker/picker';

type Props = NativeStackScreenProps<RootStackParamList, 'RackDetails'>;

type Rack = {
  id: string;
  name: string;
  status: 'optimal' | 'warning' | 'critical';
};

type Tray = {
  id: string;
  crop: string;
  temp: string;
  humidity: string;
  growthStage: number;
  lastWatered: string;
};

export default function RackDetailsScreen({ route, navigation }: Props) {
  const { rackId, greenhouseId, name } = route.params;
  const [racks, setRacks] = useState<Rack[]>([]);
  const [trays, setTrays] = useState<Tray[]>([]);
  const [selectedTray, setSelectedTray] = useState<Tray | null>(null);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const [modalVisible, setModalVisible] = useState(false);
const [selectedPedido, setSelectedPedido] = useState('');
const [trayNumber, setTrayNumber] = useState(trays.length + 1); // auto-increment or placeholder
const [pedidos, setPedidos] = useState<{ id: string; description: string }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedRacks = await getRacksForGreenhouse(greenhouseId);
      setRacks(fetchedRacks);

      const fetchedTrays = await getTraysForRack(greenhouseId, rackId);
      setTrays(fetchedTrays);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();

      const fetchPedidos = async () => {
        const data = await getPedidos();
        setPedidos(data);
      };
      fetchPedidos();
    };

    fetchData();

    async function getPedidos(): Promise<{ id: string; description: string }[]> {
      return [
        { id: '101', description: '10kg maíz' },
        { id: '102', description: '20kg trigo' },
        { id: '103', description: '5kg cebada' },
      ];
    }

    return () => fadeAnim.setValue(0);
  }, [greenhouseId, rackId]);

  const currentIndex = racks.findIndex(rack => rack.id === rackId);
  const prevRack = currentIndex > 0 ? racks[currentIndex - 1] : null;
  const nextRack = currentIndex < racks.length - 1 ? racks[currentIndex + 1] : null;

  const getStatusColor = (status: Rack['status'] | undefined) => {
    switch(status) {
      case 'optimal': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <BackgroundWrapper>
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        {/* Header with navigation and status */}
        <View className="flex-row justify-between items-center px-4 pt-6 pb-4 bg-white/10">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="p-2"
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>

          <View className="items-center">
            <Text className="text-xl font-bold text-white">{name}</Text>
            <View className={`${getStatusColor(racks.find(r => r.id === rackId)?.status || 'optimal')} px-3 py-1 rounded-full mt-1`}>
              <Text className="text-white text-xs font-medium">
                {racks.find(r => r.id === rackId)?.status.toUpperCase() || 'N/A'}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('Config')}
            className="p-2"
          >
            <Ionicons name="settings" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
          {/* Rack navigation controls */}
          <View className="flex-row justify-between items-center my-4">
            <TouchableOpacity
              onPress={() => prevRack && navigation.push('RackDetails', {
                rackId: prevRack.id,
                greenhouseId,
                name: prevRack.name,
              })}
              className={`flex-row items-center ${!prevRack ? 'opacity-30' : ''}`}
              disabled={!prevRack}
            >
              <Ionicons name="chevron-back" size={20} color="white" />
              <Text className="text-white ml-1">{prevRack?.name || 'N/A'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => nextRack && navigation.push('RackDetails', {
                rackId: nextRack.id,
                greenhouseId,
                name: nextRack.name,
              })}
              className={`flex-row items-center ${!nextRack ? 'opacity-30' : ''}`}
              disabled={!nextRack}
            >
              <Text className="text-white mr-1">{nextRack?.name || 'N/A'}</Text>
              <Ionicons name="chevron-forward" size={20} color="white" />
            </TouchableOpacity>
          </View>

          {/* Rack statistics */}
          <View className="bg-white/10 rounded-xl p-4 mb-6 border border-white/20">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-lg font-bold text-white">Estadísticas del Rack</Text>
              <MaterialCommunityIcons name="chart-bar" size={24} color="white" />
            </View>
            
            <View className="flex-row justify-between">
              <View className="items-center">
                <Text className="text-white font-bold text-xl">{trays.length}</Text>
                <Text className="text-white/80 text-xs">Charolas</Text>
              </View>
              
              <View className="items-center">
                <Text className="text-white font-bold text-xl">
                  {trays.reduce((acc, tray) => acc + parseInt(tray.temp), 0) / trays.length || 0}°C
                </Text>
                <Text className="text-white/80 text-xs">Temp. promedio</Text>
              </View>
              
              <View className="items-center">
                <Text className="text-white font-bold text-xl">
                  {trays.reduce((acc, tray) => acc + parseInt(tray.humidity), 0) / trays.length || 0}%
                </Text>
                <Text className="text-white/80 text-xs">Humedad promedio</Text>
              </View>
            </View>
          </View>

          {/* Trays grid */}
          <Text className="text-lg font-bold text-white mb-3">Charolas ({trays.length})</Text>
          <View className="flex-row flex-wrap justify-between mb-24">
            {trays.map((tray) => (
              <TouchableOpacity
                key={tray.id}
                className={`w-[48%] mb-4 ${selectedTray?.id === tray.id ? 'border-2 border-amber-400' : ''}`}
                onPress={() => setSelectedTray(tray)}
                activeOpacity={0.7}
              >
                <View className="bg-white/10 p-3 rounded-xl">
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-white font-bold">{tray.crop}</Text>
                    <View className="flex-row items-center">
                      <MaterialCommunityIcons 
                        name="water" 
                        size={14} 
                        color="#60a5fa" 
                        style={{ marginRight: 4 }} 
                      />
                      <Text className="text-blue-300 text-xs">{tray.lastWatered}</Text>
                    </View>
                  </View>
                  
                  <View className="flex-row justify-between">
                    <View className="flex-row items-center">
                      <MaterialCommunityIcons name="thermometer" size={14} color="#f87171" />
                      <Text className="text-white text-xs ml-1">{tray.temp}</Text>
                    </View>
                    <View className="flex-row items-center">
                      <MaterialCommunityIcons name="water-percent" size={14} color="#60a5fa" />
                      <Text className="text-white text-xs ml-1">{tray.humidity}</Text>
                    </View>
                  </View>
                  
                  <View className="mt-2">
                    <View className="w-full bg-gray-600 rounded-full h-1.5">
                      <View 
                        className="bg-amber-400 h-1.5 rounded-full" 
                        style={{ width: `${(tray.growthStage / 5) * 100}%` }}
                      />
                    </View>
                    <Text className="text-white/80 text-xs mt-1">
                      Etapa {tray.growthStage}/5
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Floating action button */}
        <TouchableOpacity
          className="absolute bottom-28 right-5 bg-amber-500 p-4 rounded-full shadow-xl"
          onPress={() => {
            setTrayNumber(trays.length + 1);
            setModalVisible(true);
          }}
        >
          <MaterialCommunityIcons name="plus" size={24} color="white" />
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white w-11/12 rounded-xl p-6">
              <Text className="text-lg font-bold text-center mb-4">
                Agregar Charola #{trayNumber}
              </Text>

              <Text className="text-base font-medium mb-2">Selecciona Pedido</Text>
              <View className="border border-gray-300 rounded-lg mb-6">
                <Picker
                  selectedValue={selectedPedido}
                  onValueChange={(itemValue) => setSelectedPedido(itemValue)}
                >
                  {pedidos.map(pedido => (
                    <Picker.Item
                      key={pedido.id}
                      label={`Pedido #${pedido.id} - ${pedido.description}`}
                      value={pedido.id}
                    />
                  ))}
                </Picker>
              </View>

              <TouchableOpacity
                className="bg-amber-500 py-3 rounded-lg"
                onPress={() => {
                  if (selectedPedido) {
                    const pedidoDesc = pedidos.find(p => p.id === selectedPedido)?.description || 'Nuevo cultivo';
                
                    const newTray: Tray = {
                      id: `${Date.now()}`,
                      crop: pedidoDesc.split(' ')[1] || 'Cultivo',
                      temp: '22°C',
                      humidity: '75%',
                      growthStage: 1,
                      lastWatered: 'recién',
                    };
                
                    setTrays(prev => [...prev, newTray]);
                    setModalVisible(false);
                    setSelectedPedido('');
                  }
                }}
              >
                <Text className="text-white text-center font-bold">Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <CustomBottomBar />
      </Animated.View>
    </BackgroundWrapper>
  );
}

// Mock data functions with enhanced data
async function getRacksForGreenhouse(greenhouseId: string): Promise<Rack[]> {
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

async function getTraysForRack(greenhouseId: string, rackId: string): Promise<Tray[]> {
  if (rackId === '1') {
    return [
      { id: '1', crop: 'Maíz', temp: '22°C', humidity: '84%', growthStage: 3, lastWatered: 'hace 2h' },
      { id: '2', crop: 'Cebada', temp: '22°C', humidity: '83%', growthStage: 2, lastWatered: 'hace 3h' },
      { id: '3', crop: 'Trigo', temp: '23°C', humidity: '78%', growthStage: 4, lastWatered: 'hace 1h' },
      { id: '4', crop: 'Avena', temp: '24°C', humidity: '80%', growthStage: 1, lastWatered: 'hace 4h' },
    ];
  } else if (rackId === '2') {
    return [
      { id: '5', crop: 'Centeno', temp: '23°C', humidity: '78%', growthStage: 3, lastWatered: 'hace 2h' },
      { id: '6', crop: 'Sorgo', temp: '22°C', humidity: '70%', growthStage: 5, lastWatered: 'hace 5h' },
    ];
  } else if (rackId === '3') {
    return [
      { id: '7', crop: 'Cebada', temp: '25°C', humidity: '75%', growthStage: 2, lastWatered: 'hace 3h' },
      { id: '8', crop: 'Maíz', temp: '22°C', humidity: '70%', growthStage: 4, lastWatered: 'hace 1h' },
    ];
  } else {
    return [];
  }
}