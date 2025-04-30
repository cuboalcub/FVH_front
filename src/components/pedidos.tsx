import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, StyleSheet, FlatList, Alert } from 'react-native';
import BackgroundWrapper from './background';
import { API_ROUTES } from '../utils/api';

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

  return (
    <BackgroundWrapper>
      <Text style={styles.header}>Pedidos</Text>

      {/* Lista de Pedidos */}
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.orderCard}>
            <Text style={styles.orderTitle}>{item.title}</Text>
            {item.items.map((subItem, index) => (
              <Text key={index} style={styles.orderItem}>{subItem}</Text>
            ))}
          </View>
        )}
      />

      {/* Botón "+" para abrir modal */}
      <TouchableOpacity style={styles.plusButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.plusText}>+</Text>
      </TouchableOpacity>

      {/* Modal para crear pedido */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Crear pedido</Text>

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

            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeText}>X</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </BackgroundWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#FFA500' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  orderCard: { backgroundColor: '#ffc64d', padding: 15, marginBottom: 10, borderRadius: 10 },
  orderTitle: { fontSize: 18, fontWeight: 'bold' },
  orderItem: { fontSize: 14, color: '#333' },

  plusButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'black',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusText: { fontSize: 30, color: 'white', fontWeight: 'bold' },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#ffb647',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  input: { width: '100%', borderBottomWidth: 1, marginBottom: 10, padding: 5 },
  closeButton: { marginTop: 10, padding: 10, backgroundColor: 'red', borderRadius: 5 },
  closeText: { color: 'white', fontWeight: 'bold' },
});

export default PedidosScreen;
