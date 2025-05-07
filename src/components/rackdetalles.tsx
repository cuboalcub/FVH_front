import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Animated, ScrollView , Modal, TextInput} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import BackgroundWrapper from './background';
import CustomBottomBar from './barraInferior';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

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

type Pedido = {
  id: string;
  description: string;
};

type DetallePedido = {
  id: number;
  descripcion: string;
  cantidad: number;
};

export default function RackDetailsScreen({ route, navigation }: Props) {
  const { rackId, greenhouseId, name } = route.params;

  const [racks, setRacks] = useState<Rack[]>([]);
  const [trays, setTrays] = useState<Tray[]>([]);
  const [selectedTray, setSelectedTray] = useState<Tray | null>(null);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState<string | null>(null);
  const [trayNumber, setTrayNumber] = useState(trays.length + 1);

  // Mock data for pedidos
  const [pedidos, setPedidos] = useState<Pedido[]>([
    { id: 'MOCK1', description: 'Mock Pedido 1' },
    { id: 'MOCK2', description: 'Another Mock Pedido' },
    { id: 'MOCK3', description: 'Test Pedido' },
  ]);

  // Mock data for detallePedido (will change based on selectedPedido)
  const [detallePedido, setDetallePedido] = useState<DetallePedido[]>([]);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [quantities, setQuantities] = useState<Record<number, string>>({});

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
    };

    fetchData();

    return () => fadeAnim.setValue(0);
  }, [greenhouseId, rackId]);

  useEffect(() => {
    if (modalVisible && selectedPedido) {
      // Mock fetching detallePedido based on selectedPedido
      if (selectedPedido === 'MOCK1') {
        setDetallePedido([
          { id: 1, descripcion: 'Mock Cultivo A', cantidad: 10 },
          { id: 2, descripcion: 'Mock Cultivo B', cantidad: 5 },
        ]);
      } else if (selectedPedido === 'MOCK2') {
        setDetallePedido([
          { id: 3, descripcion: 'Cultivo X', cantidad: 15 },
          { id: 4, descripcion: 'Cultivo Y', cantidad: 8 },
          { id: 5, descripcion: 'Cultivo Z', cantidad: 20 },
        ]);
      } else {
        setDetallePedido([]);
      }
      setCheckedItems({});
      setQuantities({});
    } else {
      setDetallePedido([]);
      setCheckedItems({});
      setQuantities({});
    }
  }, [modalVisible, selectedPedido]);

  const handleCheckboxChange = (itemId: number) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const handleQuantityChange = (itemId: number, text: string) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: text.replace(/[^0-9]/g, ''),
    }));
  };

  const handleAddTrays = () => {
    const selectedCrops = detallePedido
      .filter(item => checkedItems[item.id])
      .map(item => `${quantities[item.id] || '1'} ${item.descripcion}`);

    if (selectedCrops.length > 0) {
      selectedCrops.forEach(cropDescription => {
        const newTray: Tray = {
          id: `${Date.now()}-${Math.random()}`,
          crop: cropDescription,
          temp: '22°C',
          humidity: '75%',
          growthStage: 1,
          lastWatered: 'recién',
        };
        setTrays(prev => [...prev, newTray]);
      });
      setModalVisible(false);
      setSelectedPedido(null);
    } else {
      alert('Selecciona al menos un cultivo para agregar.');
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedPedido(null);
    setDetallePedido([]);
    setCheckedItems({});
    setQuantities({});
  };

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
        {/* ... Your header and ScrollView content ... */}
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
          onRequestClose={handleCloseModal}
        >
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white w-11/12 rounded-xl p-6">
              {/* Close button */}
              <TouchableOpacity
                onPress={handleCloseModal}
                className="absolute top-3 right-3 z-10"
              >
                <Ionicons name="close-circle" size={24} color="gray" />
              </TouchableOpacity>

              <Text className="text-lg font-bold text-center mb-4">
                Agregar Charola #{trayNumber}
              </Text>

              <Text className="text-base font-medium mb-2">Selecciona Pedido</Text>
              <View className="border border-gray-300 rounded-lg mb-4">
                <Picker
                  selectedValue={selectedPedido}
                  onValueChange={(itemValue) => setSelectedPedido(itemValue)}
                >
                  <Picker.Item label="Selecciona un pedido" value={null} />
                  {pedidos.map(pedido => (
                    <Picker.Item
                      key={pedido.id}
                      label={`Pedido #${pedido.id} - ${pedido.description}`}
                      value={pedido.id}
                    />
                  ))}
                </Picker>
              </View>

              {detallePedido.length > 0 && (
                <View className="mb-4">
                  <Text className="text-base font-medium mb-2">Selecciona los cultivos:</Text>
                  {detallePedido.map(item => (
                    <View key={item.id} className="flex-row items-center mb-2">
                      <TouchableOpacity
                        onPress={() => handleCheckboxChange(item.id)}
                        className={`w-6 h-6 border rounded border-gray-400 justify-center items-center mr-2 ${checkedItems[item.id] ? 'bg-amber-500 border-amber-500' : ''}`}
                      >
                        {checkedItems[item.id] && <Ionicons name="checkmark" size={18} color="white" />}
                      </TouchableOpacity>
                      <Text className="flex-1">{item.descripcion}</Text>
                      <View className="flex-row items-center ml-2">
                        <Text className="mr-2">Cantidad:</Text>
                        <TextInput
                          className="border border-gray-300 rounded-md w-16 text-center"
                          value={quantities[item.id] || '1'}
                          onChangeText={(text) => handleQuantityChange(item.id, text)}
                          keyboardType="numeric"
                        />
                      </View>
                    </View>
                  ))}
                </View>
              )}

              <TouchableOpacity
                className="bg-amber-500 py-3 rounded-lg"
                onPress={handleAddTrays}
                disabled={selectedPedido === null || detallePedido.length === 0}
              >
                <Text className="text-white text-center font-bold">Agregar Charolas</Text>
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