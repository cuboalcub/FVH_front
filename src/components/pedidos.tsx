<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, StyleSheet, FlatList, Alert } from 'react-native';
import BackgroundWrapper from './background';
import { API_ROUTES } from '../utils/api';
=======
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, StyleSheet, FlatList, Platform } from 'react-native';
import BackgroundWrapper from './background';
import { Picker } from '@react-native-picker/picker';
import CustomBottomBar from './barraInferior';
>>>>>>> 866a756a774a123571c84af111aba5fd762ae64e

const PedidosScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [orders, setOrders] = useState<{ id: number; title: string; items: string[] }[]>([]);
  const [title, setTitle] = useState('');
  const [items, setItems] = useState('');

  // Cargar pedidos al iniciar
  useEffect(() => {
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    try {
      const response = await fetch(API_ROUTES.PEDIDOS.LIST);
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error al obtener pedidos:', error);
    }
  };

  const crearPedido = async () => {
    const nuevoPedido = {
      title,
      items: items.split(',').map((i) => i.trim())
    };

    console.log('nuevoPedido:', nuevoPedido);

    try {
      const response = await fetch(API_ROUTES.PEDIDOS.CREATE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoPedido)
      });

      if (response.ok) {
        const creado = await response.json();
        setOrders([...orders, creado]);
        setModalVisible(false);
        setTitle('');
        setItems('');
      } else {
        Alert.alert('Error', 'No se pudo crear el pedido.');
      }
    } catch (error) {
      console.error('Error al crear pedido:', error);
    }
  };

  const [selectedSeed, setSelectedSeed] = useState('trigo');
  const [customSeed, setCustomSeed] = useState('');
  const [quantity, setQuantity] = useState('');
  const [orderItems, setOrderItems] = useState<string[]>([]);

  const seedOptions = ['trigo', 'maíz', 'cebada', 'other'];

  const addItemToOrder = () => {
    const seed = selectedSeed === 'other' ? customSeed.trim() : selectedSeed;
    if (!seed || !quantity) return;

    const newItem = `${quantity}kg ${seed}`;
    setOrderItems([...orderItems, newItem]);
    setQuantity('');
    setCustomSeed('');
    setSelectedSeed('trigo');
  };

  const createOrder = () => {
    if (orderItems.length === 0) return;

    const newOrder = {
      id: (orders.length + 1).toString(),
      title: `Pedido #${orders.length + 1}`,
      items: orderItems
    };
    setOrders([...orders, newOrder]);
    setOrderItems([]);
    setModalVisible(false);
  };

  return (
    <BackgroundWrapper>
      <Text style={styles.header}>Pedidos</Text>

<<<<<<< HEAD
      {/* Lista de Pedidos */}
=======
>>>>>>> 866a756a774a123571c84af111aba5fd762ae64e
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.orderCard}>
            <Text style={styles.orderTitle}>{item.title}</Text>
<<<<<<< HEAD
            {item.items.map((subItem, index) => (
              <Text key={index} style={styles.orderItem}>{subItem}</Text>
=======
            {item.items.map((itemText, index) => (
              <Text key={index} style={styles.orderItem}>{itemText}</Text>
>>>>>>> 866a756a774a123571c84af111aba5fd762ae64e
            ))}
          </View>
        )}
      />

<<<<<<< HEAD
      {/* Botón "+" para abrir modal */}
=======
>>>>>>> 866a756a774a123571c84af111aba5fd762ae64e
      <TouchableOpacity style={styles.plusButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.plusText}>+</Text>
      </TouchableOpacity>

<<<<<<< HEAD
      {/* Modal para crear pedido */}
=======
>>>>>>> 866a756a774a123571c84af111aba5fd762ae64e
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Crear pedido</Text>

<<<<<<< HEAD
            <TextInput
              placeholder="Título del pedido"
              style={styles.input}
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              placeholder="Items separados por coma"
              style={styles.input}
              value={items}
              onChangeText={setItems}
            />

            <TouchableOpacity style={[styles.closeButton, { backgroundColor: 'green' }]} onPress={crearPedido}>
              <Text style={styles.closeText}>Guardar</Text>
            </TouchableOpacity>

=======
            {/* Quantity Input */}
            <TextInput
              placeholder="Cantidad (kg)"
              style={styles.input}
              keyboardType="numeric"
              value={quantity}
              onChangeText={setQuantity}
            />

            {/* Seed Type Picker */}
            <View style={styles.input}>
              <Picker
                selectedValue={selectedSeed}
                onValueChange={(itemValue: React.SetStateAction<string>) => setSelectedSeed(itemValue)}
              >
                {seedOptions.map((seed) => (
                  <Picker.Item label={seed} value={seed} key={seed} />
                ))}
              </Picker>
            </View>

            {/* Custom Seed Input */}
            {selectedSeed === 'other' && (
              <TextInput
                placeholder="Otra semilla"
                style={styles.input}
                value={customSeed}
                onChangeText={setCustomSeed}
              />
            )}

            {/* Add Item Button */}
            <TouchableOpacity style={styles.addItemButton} onPress={addItemToOrder}>
              <Text style={styles.addItemText}>Agregar ítem</Text>
            </TouchableOpacity>

            {/* Show Current Items */}
            {orderItems.map((item, index) => (
              <Text key={index} style={styles.orderItem}>{item}</Text>
            ))}

            {/* Confirm Button */}
            <TouchableOpacity style={styles.createButton} onPress={createOrder}>
              <Text style={styles.createText}>Crear Pedido</Text>
            </TouchableOpacity>

            {/* Close Button */}
>>>>>>> 866a756a774a123571c84af111aba5fd762ae64e
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeText}>X</Text>
            </TouchableOpacity>

            
          </View>
        </View>
      </Modal>
<<<<<<< HEAD
=======
      <CustomBottomBar />
>>>>>>> 866a756a774a123571c84af111aba5fd762ae64e
    </BackgroundWrapper>
  );
};

const styles = StyleSheet.create({
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  orderCard: { backgroundColor: '#ffc64d', padding: 15, marginBottom: 10, borderRadius: 10 },
  orderTitle: { fontSize: 18, fontWeight: 'bold' },
  orderItem: { fontSize: 14, color: '#333' },

  plusButton: {
    position: 'absolute', bottom: 20, right: 20,
    backgroundColor: 'black', width: 60, height: 60,
    borderRadius: 30, justifyContent: 'center', alignItems: 'center',
  },
  plusText: { fontSize: 30, color: 'white', fontWeight: 'bold' },

  modalContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%', backgroundColor: '#ffb647',
    padding: 20, borderRadius: 10, alignItems: 'center',
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  input: {
    width: '100%',
    borderBottomWidth: 1,
    borderColor: '#333',
    marginBottom: 10,
    padding: Platform.OS === 'ios' ? 10 : 5,
  },
  addItemButton: {
    backgroundColor: 'green',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 5,
    marginTop: 5
  },
  addItemText: { color: 'white', fontWeight: 'bold' },
  createButton: {
    marginTop: 10, padding: 10,
    backgroundColor: 'blue', borderRadius: 5
  },
  createText: { color: 'white', fontWeight: 'bold' },
  closeButton: {
    marginTop: 10, padding: 10,
    backgroundColor: 'red', borderRadius: 5
  },
  closeText: { color: 'white', fontWeight: 'bold' },
});

export default PedidosScreen;
