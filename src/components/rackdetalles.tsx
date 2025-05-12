import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Animated, ScrollView, Modal, TextInput } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import BackgroundWrapper from './background';
import CustomBottomBar from './barraInferior';
import { Picker } from '@react-native-picker/picker';
import { obtenerPedidos } from '../utils/pedidoService';
import { get_charolas } from '../utils/invernaderos';
import AsyncStorage from '@react-native-async-storage/async-storage';
type Props = NativeStackScreenProps<RootStackParamList, 'RackDetails'>;

export default function RackDetailsScreen({ route, navigation }: Props) {
  const { rackId, greenhouseId, name } = route.params;
  const [idTray, setIdTray] = useState<string | null>(null);
  const [racks, setRacks] = useState<any[]>([]);
  const [trays, setTrays] = useState<any[]>([]);
  const [selectedTray, setSelectedTray] = useState<any | null>(null);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState("");
  const [trayNumber, setTrayNumber] = useState(trays.length + 1);

  // Mock data for pedidos
  const [pedidos, setPedidos] = useState<any[]>([]);

  // Mock data for detallePedido (will change based on selectedPedido)
  const [detallePedido, setDetallePedido] = useState<any[]>([]);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [quantities, setQuantities] = useState<Record<number, string>>({});

  useEffect(() => {
    const fetchData = async () => {
      const group = await AsyncStorage.getItem("group");
      const token = await AsyncStorage.getItem("token");
      const pedidos = await obtenerPedidos(token || undefined, group || undefined);
      const Charolas = await get_charolas(rackId || "", token || undefined);
      const detalles: any[] = [];
      if (Array.isArray(pedidos)) {
        pedidos.forEach(pedido => {
          if (Array.isArray(pedido.detalle_pedido)) {
            detalles.push(...pedido.detalle_pedido);
          }
        });

        setDetallePedido(detalles);
        console.log('Detalles recogidos:', detalles);
      } else {
        console.warn('pedidos no es un array:', pedidos);
      }
      setPedidos(pedidos);
      setTrays(Charolas.data);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    };

    fetchData();

    return () => fadeAnim.setValue(0);
  }, []);
  useEffect(() => {
    if (modalVisible && selectedPedido !== null) {
      const pedido = pedidos.find(p => p.id === selectedPedido);
      if (pedido && Array.isArray(pedido.detalle_pedido)) {
        const detalle = pedido.detalle_pedido.map((item: any) => ({
          id: item.id,
          descripcion: item.producto, // Asegúrate de que esta propiedad exista
          cantidad: item.cantidad,
        }));
        setDetallePedido(detalle);
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
        const newTray: any = {
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


  return (
    <BackgroundWrapper>
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        {/* ... Your header and ScrollView content ... */}

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

            </View>
          </View>

          {/* Trays grid */}
          <Text className="text-lg font-bold text-white mb-3">Charolas ({trays.length})</Text>
          <View className="flex-row flex-wrap justify-between mb-24">
            {trays.map((tray) => (
              <TouchableOpacity
                key={tray.id}
                className={`w-[48%] mb-4 ${selectedTray?.id === tray.id ? 'border-2 border-amber-400' : ''}`}
                onPress={() => {
                  setModalVisible(true);
                  // Ensure setIdTray is defined or remove this line if unnecessary
                  if (typeof setIdTray === 'function') {
                    setIdTray(tray.id);
                  }
                }}
                activeOpacity={0.7}

              >
                <View className="bg-white/10 p-3 rounded-xl">
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-white font-bold">{tray.semilla}</Text>
                    <View className="flex-row items-center">
                      <MaterialCommunityIcons
                        name="weight"
                        size={14}
                        color="#60a5fa"
                        style={{ marginRight: 4 }}
                      />
                      <Text className="text-gray-400 text-xs">{tray.peso}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
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
                Agregar Bandeja #{idTray}
              </Text>

              <Text className="text-base font-medium mb-2">Selecciona Pedido</Text>
              <View className="border border-gray-300 rounded-lg mb-4">
                <Picker
                  selectedValue={selectedPedido}
                  onValueChange={(itemValue) => setSelectedPedido( String(itemValue) )}
                >
                  <Picker.Item label="Selecciona un pedido" value={null} />
                  {pedidos.map(pedido => (
                    <Picker.Item
                      key={pedido.id}
                      label={`Pedido #${pedido.id} - ${pedido.estado}`}
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
                          editable={checkedItems[item.id]} // Disable if the checkbox is not checked
                          style={!checkedItems[item.id] ? { backgroundColor: '#f0f0f0', color: '#777' } : {}} // Optional: visual feedback for disabled state
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
