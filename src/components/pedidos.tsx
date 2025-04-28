import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, StyleSheet, FlatList, Platform } from 'react-native';
import BackgroundWrapper from './background';
import { Picker } from '@react-native-picker/picker';
import CustomBottomBar from './barraInferior';

const PedidosScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [orders, setOrders] = useState([
    { id: '1', title: 'Pedido #1', items: ['5kg cebada', '10kg trigo', '12kg maíz'] },
    { id: '2', title: 'Pedido #2', items: ['8kg trigo', '15kg maíz'] }
  ]);

  const [selectedSeed, setSelectedSeed] = useState('trigo');
  const [customSeed, setCustomSeed] = useState('');
  const [quantity, setQuantity] = useState('');
  const [orderItems, setOrderItems] = useState<string[]>([]);
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);

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

  const removeItemFromOrder = (index: number) => {
    const updatedItems = [...orderItems];
    updatedItems.splice(index, 1);
    setOrderItems(updatedItems);
  };

  const createOrUpdateOrder = () => {
    if (orderItems.length === 0) return;

    if (editingOrderId) {
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === editingOrderId ? { ...order, items: orderItems } : order
        )
      );
    } else {
      const newOrder = {
        id: (orders.length + 1).toString(),
        title: `Pedido #${orders.length + 1}`,
        items: orderItems
      };
      setOrders([...orders, newOrder]);
    }

    // Reset modal state
    setOrderItems([]);
    setEditingOrderId(null);
    setModalVisible(false);
  };

  const handleEdit = (order: { id: string, title: string, items: string[] }) => {
    setOrderItems(order.items);
    setEditingOrderId(order.id);
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    setOrders(orders.filter(order => order.id !== id));
  };

  return (
    <BackgroundWrapper>
      <Text style={styles.header}>Pedidos</Text>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.orderCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.orderTitle}>{item.title}</Text>
              <View style={styles.cardButtons}>
                <TouchableOpacity onPress={() => handleEdit(item)}>
                  <Text style={styles.editButton}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                  <Text style={styles.deleteButton}>X</Text>
                </TouchableOpacity>
              </View>
            </View>
            {item.items.map((itemText, index) => (
              <Text key={index} style={styles.orderItem}>{itemText}</Text>
            ))}
          </View>
        )}
      />

      <TouchableOpacity style={styles.plusButton} onPress={() => {
        setEditingOrderId(null);
        setOrderItems([]);
        setModalVisible(true);
      }}>
        <Text style={styles.plusText}>+</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingOrderId ? 'Editar Pedido' : 'Crear Pedido'}</Text>

            <TextInput
              placeholder="Cantidad (kg)"
              style={styles.input}
              keyboardType="numeric"
              value={quantity}
              onChangeText={setQuantity}
            />

            <View style={styles.input}>
              <Picker
                selectedValue={selectedSeed}
                onValueChange={(itemValue) => setSelectedSeed(itemValue)}
              >
                {seedOptions.map((seed) => (
                  <Picker.Item label={seed} value={seed} key={seed} />
                ))}
              </Picker>
            </View>

            {selectedSeed === 'other' && (
              <TextInput
                placeholder="Otra semilla"
                style={styles.input}
                value={customSeed}
                onChangeText={setCustomSeed}
              />
            )}

            <TouchableOpacity style={styles.addItemButton} onPress={addItemToOrder}>
              <Text style={styles.addItemText}>Agregar ítem</Text>
            </TouchableOpacity>

            {orderItems.map((item, index) => (
              <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                <Text style={styles.orderItem}>{item}</Text>
                <TouchableOpacity onPress={() => removeItemFromOrder(index)}>
                  <Text style={{ color: 'red' }}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity style={styles.createButton} onPress={createOrUpdateOrder}>
              <Text style={styles.createText}>{editingOrderId ? 'Guardar Cambios' : 'Crear Pedido'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeButton} onPress={() => {
              setEditingOrderId(null);
              setOrderItems([]);
              setModalVisible(false);
            }}>
              <Text style={styles.closeText}>X</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <CustomBottomBar />
    </BackgroundWrapper>
  );
};

const styles = StyleSheet.create({
  header: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    textAlign: 'center' 
  },
  orderCard: { 
    backgroundColor: '#ffc64d', 
    padding: 15, 
    marginBottom: 10, 
    borderRadius: 10 
  },
  orderTitle: { 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  orderItem: { 
    fontSize: 14, 
    color: '#333' 
  },
  plusButton: {
    position: 'absolute', 
    bottom: 20, 
    right: 20,
    backgroundColor: 'black', 
    width: 60, height: 60,
    borderRadius: 30, 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  plusText: { fontSize: 30, 
    color: 'white', 
    fontWeight: 'bold' 
  },
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
  modalTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 10
   },
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
  addItemText: { 
    color: 'white', 
    fontWeight: 'bold' 
  },
  createButton: {
    marginTop: 10, 
    padding: 10,
    backgroundColor: 'blue', 
    borderRadius: 5
  },
  createText: { 
    color: 'white', 
    fontWeight: 'bold' 
  },
  closeButton: {
    marginTop: 10, 
    padding: 10,
    backgroundColor: 'red', 
    borderRadius: 5
  },
  closeText: { 
    color: 'white', 
    fontWeight: 'bold' 
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  editButton: {
    fontSize: 16,
    color: '#007AFF',
    marginRight: 10,
  },
  deleteButton: {
    fontSize: 16,
    color: '#FF3B30',
  },
});

export default PedidosScreen;
