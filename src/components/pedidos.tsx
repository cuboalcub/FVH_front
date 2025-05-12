import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, FlatList, Platform, ActivityIndicator } from 'react-native';
import BackgroundWrapper from './background';
import { Picker } from '@react-native-picker/picker';
import CustomBottomBar from './barraInferior';
import { MaterialIcons } from '@expo/vector-icons';
import { 
  obtenerPedidosConCache,
  crearPedido,
  actualizarEstadoPedido,
  eliminarPedido,
  agregarItemsAPedido,
  formatearFechaPedido,
  EstadoPedido,
  DetallePedido,
  Pedido,
  obtenerPedidos
} from '../utils/pedidoService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PedidosScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [orders, setOrders] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedSeed, setSelectedSeed] = useState('trigo');
  const [customSeed, setCustomSeed] = useState('');
  const [quantity, setQuantity] = useState('');
  const [orderItems, setOrderItems] = useState<Omit<DetallePedido, 'id' | 'pedido_id'>[]>([]);
  const [editingOrderId, setEditingOrderId] = useState<number | null>(null);

  const seedOptions = ['trigo', 'maíz', 'cebada', 'other'];
  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem('token');  // ← AWAIT necesario aquí
        const group = await AsyncStorage.getItem('group');
        const pedidos = await obtenerPedidos(token || undefined, group || undefined);
        setOrders(pedidos);
        console.log('Pedidos obtenidos:', pedidos);
        setError(null);
      } catch (err) {
        setError('Error al cargar los pedidos. Intente nuevamente.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchPedidos();
  }, []);
  const fetchPedidos = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');  // ← AWAIT necesario aquí
      const group = await AsyncStorage.getItem('group');
      const pedidos = await obtenerPedidos(token || undefined , group || undefined);
      setOrders(pedidos);
      console.log('Pedidos obtenidos:', pedidos);
      setError(null);
    } catch (err) {
      setError('Error al cargar los pedidos. Intente nuevamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addItemToOrder = () => {
    const seed = selectedSeed === 'other' ? customSeed.trim() : selectedSeed;
    if (!seed || !quantity) return;

    const newItem = {
      producto: seed,
      cantidad: parseFloat(quantity)
    };

    setOrderItems([...orderItems, newItem]);
    setQuantity('');
    setCustomSeed('');
    setSelectedSeed('trigo');
  };

  const removeItemFromOrder = (index: number) => {
    const updatedItems = [...orderItems];
    updatedItems.splice(index, 1);
    setOrderItems(updatedItems);
  };

  const createOrUpdateOrder = async () => {
    if (orderItems.length === 0) return;

    try {
      setLoading(true);
      
      if (editingOrderId) {
        const token = await AsyncStorage.getItem('token');
        const updatedOrder = await agregarItemsAPedido(editingOrderId, orderItems, token || undefined);
        fetchPedidos();
      } else {
        // Crear nuevo pedido
        const token = await AsyncStorage.getItem('token'); 
        const newOrder = await crearPedido(orderItems, token || undefined);
      }

      setOrderItems([]);
      setEditingOrderId(null);
      setModalVisible(false);
      fetchPedidos();
    } catch (err) {
      setError('Error al guardar el pedido. Intente nuevamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (order: Pedido) => {
    // Convertir los detalles del pedido al formato que usa nuestro modal
    const items = order.detalle_pedido.map(item => ({
      producto: item.producto,
      cantidad: item.cantidad
    }));
    
    setOrderItems(items);
    setEditingOrderId(order.id);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token'); 
      await eliminarPedido(id, token || undefined);
      setOrders(prevOrders => prevOrders.filter(order => order.id !== id));
    } catch (err) {
      setError('Error al eliminar el pedido. Intente nuevamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmOrder = async (id: number) => {
    try {
      setLoading(true);
      const updatedOrder = await actualizarEstadoPedido(id, 'Confirmado');
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === id ? updatedOrder : order
        )
      );
    } catch (err) {
      setError('Error al confirmar el pedido. Intente nuevamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && orders.length === 0) {
    return (
      <BackgroundWrapper>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#F59E0B" />
        </View>
      </BackgroundWrapper>
    );
  }

  if (error) {
    return (
      <BackgroundWrapper>
        <View className="flex-1 justify-center items-center p-4">
          <Text className="text-red-500 text-lg mb-4">{error}</Text>
          <TouchableOpacity 
            className="bg-amber-500 px-6 py-3 rounded-lg"
            onPress={() => {
              setError(null);
              setLoading(true);
              obtenerPedidosConCache().then(setOrders).finally(() => setLoading(false));
            }}
          >
            <Text className="text-white font-medium">Reintentar</Text>
          </TouchableOpacity>
        </View>
      </BackgroundWrapper>
    );
  }

  return (
    <BackgroundWrapper>
      <View className="px-4 pt-4">
        <Text className="text-2xl font-bold text-gray-800 mb-2">Mis Pedidos</Text>
        <Text className="text-gray-600 mb-4">Administra tus pedidos de semillas</Text>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View className="bg-white mx-4 my-2 p-4 rounded-xl shadow-sm border border-gray-100">
            <View className="flex-row justify-between items-start mb-2">
              <View>
                <Text className="text-lg font-semibold text-gray-800">Pedido #{item.id}</Text>
                <Text className="text-xs text-gray-500">{formatearFechaPedido(item.tiempo_final)}</Text>
                <Text className={`text-xs font-medium ${
                  item.estado === 'Pendiente' ? 'text-amber-500' : 
                  item.estado === 'Confirmado' ? 'text-green-500' : 
                  'text-gray-500'
                }`}>
                  {item.estado}
                </Text>
              </View>
              <View className="flex-row gap-3">
                {item.estado === 'Pendiente' && (
                  <TouchableOpacity 
                    onPress={() => item.id !== null && handleConfirmOrder(item.id)}
                    className="p-1"
                  >
                    <MaterialIcons name="check-circle" size={20} color="#10B981" />
                  </TouchableOpacity>
                )}
                <TouchableOpacity 
                  onPress={() => handleEdit(item)}
                  className="p-1"
                >
                  <MaterialIcons name="edit" size={20} color="#3B82F6" />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => item.id !== null && handleDelete(item.id)}
                  className="p-1"
                >
                  <MaterialIcons name="delete" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>
            
            {Array.isArray(item.detalle_pedido) && item.detalle_pedido.length > 0 ? (
  <View className="mt-2 border-t border-gray-100 pt-2">
    {item.detalle_pedido.map((detalle, index) => (
      <View key={index} className="flex-row items-center py-1">
        <View className="w-2 h-2 bg-amber-400 rounded-full mr-2"></View>
        <Text className="text-gray-700">
          {detalle.cantidad}kg {detalle.producto}
        </Text>
      </View>
    ))}
  </View>
) : (
  <Text className="text-gray-400 mt-2">No hay items en este pedido</Text>
)}
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 120 }}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center mt-10">
            <Text className="text-gray-500 text-lg">No hay pedidos registrados</Text>
          </View>
        }
      />

      <TouchableOpacity 
        className="absolute bottom-28 right-5 bg-amber-500 w-14 h-14 rounded-full justify-center items-center shadow-lg"
        onPress={() => {
          setEditingOrderId(null);
          setOrderItems([]);
          setModalVisible(true);
        }}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <MaterialIcons name="add" size={28} color="white" />
        )}
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => !loading && setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="w-[90%] bg-white p-5 rounded-xl max-h-[80%]">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-gray-800">
                {editingOrderId ? 'Editar Pedido' : 'Nuevo Pedido'}
              </Text>
              <TouchableOpacity 
                onPress={() => !loading && setModalVisible(false)}
                disabled={loading}
              >
                <MaterialIcons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-1">Cantidad (kg)</Text>
              <TextInput
                placeholder="Ej: 5, 10.5, 20"
                className={`w-full ${Platform.OS === 'ios' ? 'py-3' : 'py-2'} px-3 border border-gray-200 rounded-lg mb-3`}
                keyboardType="decimal-pad"
                value={quantity}
                onChangeText={(text) => {
                  const formattedText = text.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
                  setQuantity(formattedText);
                }}
                editable={!loading}
              />
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-1">Tipo de semilla</Text>
              <View className={`w-full border border-gray-200 rounded-lg overflow-hidden`}>
                <Picker
                  selectedValue={selectedSeed}
                  onValueChange={(itemValue) => setSelectedSeed(itemValue)}
                  style={{ color: '#374151' }}
                  enabled={!loading}
                >
                  {seedOptions.map((seed) => (
                    <Picker.Item label={seed.charAt(0).toUpperCase() + seed.slice(1)} value={seed} key={seed} />
                  ))}
                </Picker>
              </View>
            </View>

            {selectedSeed === 'other' && (
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-1">Especificar semilla</Text>
                <TextInput
                  placeholder="Ej: Avena, Centeno, etc."
                  className={`w-full ${Platform.OS === 'ios' ? 'py-3' : 'py-2'} px-3 border border-gray-200 rounded-lg`}
                  value={customSeed}
                  onChangeText={setCustomSeed}
                  editable={!loading}
                />
              </View>
            )}

            <TouchableOpacity 
              className="flex-row items-center justify-center bg-amber-500 py-3 rounded-lg mb-4"
              onPress={addItemToOrder}
              disabled={loading || !quantity || (selectedSeed === 'other' && !customSeed)}
              style={{ opacity: loading || !quantity || (selectedSeed === 'other' && !customSeed) ? 0.5 : 1 }}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <MaterialIcons name="add-circle-outline" size={20} color="white" />
                  <Text className="text-white font-medium ml-2">Agregar ítem</Text>
                </>
              )}
            </TouchableOpacity>

            {orderItems.length > 0 && (
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">Ítems del pedido:</Text>
                <View className="border border-gray-100 rounded-lg p-2">
                  {orderItems.map((item, index) => (
                    <View key={index} className="flex-row justify-between items-center py-2 px-1 border-b border-gray-100 last:border-b-0">
                      <Text className="text-gray-700">
                        {item.cantidad}kg {item.producto}
                      </Text>
                      <TouchableOpacity 
                        onPress={() => !loading && removeItemFromOrder(index)}
                        disabled={loading}
                      >
                        <MaterialIcons name="remove-circle" size={20} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            )}

            <TouchableOpacity 
              className={`py-3 rounded-lg ${orderItems.length > 0 ? 'bg-green-600' : 'bg-gray-300'}`}
              onPress={createOrUpdateOrder}
              disabled={loading || orderItems.length === 0}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-medium text-center">
                  {editingOrderId ? 'Guardar Cambios' : 'Crear Pedido'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <CustomBottomBar />
    </BackgroundWrapper>
  );
};

export default PedidosScreen;