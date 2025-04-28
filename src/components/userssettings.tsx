import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import BackgroundWrapper from './background';

export default function ConfigUsuariosScreen() {
  const [users, setUsers] = useState([
    { id: '1', name: 'Juan', role: 'Admin' },
    { id: '2', name: 'Maria', role: 'Usuario' },
    { id: '3', name: 'Luis', role: 'Usuario' },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState('Usuario');
  const [isEditing, setIsEditing] = useState(false);
const [editingUserId, setEditingUserId] = useState<string | null>(null);


const addUser = () => {
  if (!newUserName) return;

  if (isEditing && editingUserId) {
    const updatedUsers = users.map(user =>
      user.id === editingUserId
        ? { ...user, name: newUserName, role: newUserRole }
        : user
    );
    setUsers(updatedUsers);
  } else {
    const newUser = {
      id: Date.now().toString(),
      name: newUserName,
      role: newUserRole,
    };
    setUsers([...users, newUser]);
  }

  // Reset state
  setNewUserName('');
  setNewUserRole('Usuario');
  setEditingUserId(null);
  setIsEditing(false);
  setModalVisible(false);
};

  const handleEdit = (user: { id: string; name: string; role: string }) => {
  setNewUserName(user.name);
  setNewUserRole(user.role);
  setEditingUserId(user.id);
  setIsEditing(true);
  setModalVisible(true);
};

const handleDelete = (id: string) => {
  const updatedUsers = users.filter(user => user.id !== id);
  setUsers(updatedUsers);
};

  return (
    <BackgroundWrapper>
      <Text style={styles.title}>Config. Usuarios</Text>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.userText}>{item.name}</Text>
            <Text style={styles.roleText}>{item.role}</Text>
        
            <View style={styles.cardButtons}>
              <TouchableOpacity onPress={() => handleEdit(item)}>
                <Text style={styles.editButton}> Editar </Text>
              </TouchableOpacity>
        
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Text style={styles.deleteButton}> X</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addText}>+</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Crear Usuario</Text>

            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={newUserName}
              onChangeText={setNewUserName}
            />

            <Picker
              selectedValue={newUserRole}
              onValueChange={(itemValue: React.SetStateAction<string>) => setNewUserRole(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Usuario" value="Usuario" />
              <Picker.Item label="Admin" value="Admin" />
            </Picker>

            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.cancel}>❌</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={addUser}>
                <Text style={styles.save}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFA500',
      padding: 20,
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#000',
    },
    card: {
      backgroundColor: '#FFDEAD',
      padding: 30,
      borderRadius: 10,
      marginBottom: 10,
      borderColor: '#FF8C00',
      borderWidth: 1,
    },
    userText: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    roleText: {
      fontSize: 16,
      color: '#444',
    },
    addButton: {
      backgroundColor: '#000',
      borderRadius: 30,
      width: 60,
      height: 60,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      marginTop: 20,
    },
    addText: {
      fontSize: 30,
      color: '#fff',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: '#000000aa',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      width: '85%',
      backgroundColor: '#FBA304',
      borderRadius: 20,
      padding: 20,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    input: {
      backgroundColor: '#eee',
      borderRadius: 8,
      padding: 10,
      marginBottom: 15,
    },
    picker: {
      marginBottom: 20,
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    cancel: {
      fontSize: 24,
      color: '#f00',
    },
    save: {
      fontSize: 18,
      color: '#008000',
    },
    cardButtons: {
      flexDirection: 'row',
      marginTop: 10,
      justifyContent: 'space-between',
    },
    editButton: {
      color: '#007BFF',
      fontWeight: 'bold',
    },
    deleteButton: {
      color: '#FF0000',
      fontWeight: 'bold',
    },
    
  });
  