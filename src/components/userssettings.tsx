import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import BackgroundWrapper from './background';
import { MaterialIcons } from '@expo/vector-icons';
import { create_group, get_users, update_user, delete_user } from '../utils/groupUser';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ConfigUsuariosScreen() {
  const [users, setUsers] = useState<{ id: string; name: string; email: string; role: string }[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('Usuario');
  const [isEditing, setIsEditing] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const token = await AsyncStorage.getItem('token');
        const data = await get_users(token || '');
        setUsers(data);
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'No se pudo cargar la lista de usuarios');
      }
    }
    fetchUsers();
  }, []);

  const addUser = async () => {
    if (!newUserName || !newUserEmail) {
      Alert.alert('Error', 'Por favor complete todos los campos');
      return;
    }

    const token = await AsyncStorage.getItem('token');
    const userPayload = {
      username: newUserName,
      email: newUserEmail,
      role: newUserRole
    };

    try {
      if (isEditing && editingUserId) {
        await update_user(token || '', editingUserId, userPayload);
      } else {
        await create_group(token || '', userPayload);
      }

      const updated = await get_users(token || '');
      setUsers(updated);
      resetForm();
      setModalVisible(false);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Ocurrió un problema al guardar el usuario');
    }
  };

  const handleEdit = (user: { id: string; name: string; email: string; role: string }) => {
    setNewUserName(user.name);
    setNewUserEmail(user.email);
    setNewUserRole(user.role);
    setEditingUserId(user.id);
    setIsEditing(true);
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Confirmar',
      '¿Estás seguro de que quieres eliminar este usuario?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('token');
            await delete_user(token || '', id);
            const updated = await get_users(token || '');
            setUsers(updated);
          } catch (err) {
            console.error(err);
            Alert.alert('Error', 'No se pudo eliminar el usuario');
          }
        }},
      ]
    );
  };

  const resetForm = () => {
    setNewUserName('');
    setNewUserEmail('');
    setNewUserRole('Usuario');
    setEditingUserId(null);
    setIsEditing(false);
  };

  return (
    <BackgroundWrapper>
      <View className="flex-1 px-4">
        <Text className="text-2xl font-bold text-gray-800 mb-4">Gestión de Usuarios</Text>

        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="bg-white rounded-lg p-4 mb-3 shadow-sm">
              <View className="flex-row justify-between items-start">
                <View>
                  <Text className="text-lg font-semibold">{item.name}</Text>
                  <Text className="text-gray-600 text-sm">{item.email}</Text>
                  <View className={`mt-1 px-2 py-1 rounded-full self-start ${
                    item.role === 'Admin' ? 'bg-blue-100' : 'bg-green-100'
                  }`}>
                    <Text className={`text-xs font-medium ${
                      item.role === 'Admin' ? 'text-blue-800' : 'text-green-800'
                    }`}>
                      {item.role}
                    </Text>
                  </View>
                </View>
                <View className="flex-row space-x-2">
                  <TouchableOpacity 
                    onPress={() => handleEdit(item)}
                    className="p-2"
                  >
                    <MaterialIcons name="edit" size={20} color="#3B82F6" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => handleDelete(item.id)}
                    className="p-2"
                  >
                    <MaterialIcons name="delete" size={20} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View className="items-center justify-center py-10">
              <MaterialIcons name="people-outline" size={40} color="#9CA3AF" />
              <Text className="text-gray-500 mt-2">No hay usuarios registrados</Text>
            </View>
          }
        />

        <TouchableOpacity 
          className="absolute bottom-6 right-6 bg-amber-500 w-14 h-14 rounded-full items-center justify-center shadow-lg"
          onPress={() => {
            resetForm();
            setModalVisible(true);
          }}
        >
          <MaterialIcons name="add" size={28} color="white" />
        </TouchableOpacity>
        <Modal
  visible={modalVisible}
  animationType="slide"
  transparent
  onRequestClose={() => {
    setModalVisible(false);
    resetForm();
  }}
>
  <View className="flex-1 justify-center items-center bg-black/50">
    <View className="w-11/12 bg-white rounded-xl p-6">
      <Text className="text-xl font-bold mb-4">
        {isEditing ? 'Editar Rol de Usuario' : 'Nuevo Usuario'}
      </Text>

      <Text className="text-sm font-medium text-gray-700 mb-1">Nombre</Text>
      <View className={`w-full border border-gray-300 rounded-lg p-3 mb-4 bg-gray-100`}>
        <Text className="text-gray-700">{newUserName}</Text>
      </View>

      <Text className="text-sm font-medium text-gray-700 mb-1">Email</Text>
      <View className={`w-full border border-gray-300 rounded-lg p-3 mb-4 bg-gray-100`}>
        <Text className="text-gray-700">{newUserEmail}</Text>
      </View>

      <Text className="text-sm font-medium text-gray-700 mb-1">Rol</Text>
      <View className="border border-gray-300 rounded-lg mb-6">
        <Picker
          selectedValue={newUserRole}
          onValueChange={(itemValue) => setNewUserRole(itemValue)}
        >
          <Picker.Item label="Usuario" value="Usuario" />
          <Picker.Item label="Administrador" value="Admin" />
        </Picker>
      </View>

      <View className="flex-row justify-end space-x-3">
        <TouchableOpacity 
          className="px-4 py-2 border border-gray-300 rounded-lg"
          onPress={() => {
            setModalVisible(false);
            resetForm();
          }}
        >
          <Text className="text-gray-700">Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className="px-4 py-2 bg-amber-500 rounded-lg"
          onPress={addUser}
        >
          <Text className="text-white font-medium">
            {isEditing ? 'Actualizar Rol' : 'Agregar Usuario'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>
      </View>
    </BackgroundWrapper>
  );
}