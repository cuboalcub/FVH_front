import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, StyleSheet, FlatList } from 'react-native';
import BackgroundWrapper from './background';

const PedidosScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [orders, setOrders] = useState([
    { id: '1', title: 'Pedido #1', items: ['5kg cebada', '10kg trigo', '12kg maíz'] },
    { id: '2', title: 'Pedido #2', items: ['8kg trigo', '15kg maíz'] }
  ]);

  return (
    <BackgroundWrapper>
      <Text style={styles.header}>Pedidos</Text>

      {/* Orders List */}
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.orderCard}>
            <Text style={styles.orderTitle}>{item.title}</Text>
            {item.items.map((item, index) => (
              <Text key={index} style={styles.orderItem}>{item}</Text>
            ))}
          </View>
        )}
      />

      {/* Plus Button to Open Modal */}
      <TouchableOpacity style={styles.plusButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.plusText}>+</Text>
      </TouchableOpacity>

      {/* Order Creation Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Crear pedido</Text>

            <TextInput placeholder="Label" style={styles.input} />
            <TextInput placeholder="Input" style={styles.input} />
            
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
  
  // Plus Button Styles
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
