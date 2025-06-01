// histNot.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { generateMockNotifications } from '../utils/mockNotifications';

const HistNotScreen = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar notificaciones
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const stored = await AsyncStorage.getItem('@notifications');
        if (!stored) {
          // Cargar datos mock si no hay nada guardado
          const mockData = generateMockNotifications();
          await AsyncStorage.setItem('@notifications', JSON.stringify(mockData));
          setNotifications(mockData);
        } else {
          setNotifications(JSON.parse(stored));
        }
      } catch (error) {
        Alert.alert('Error', 'No se pudieron cargar las notificaciones');
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  // Función para probar notificaciones nuevas
  const addTestNotification = async () => {
    const newNotif = {
      id: Date.now().toString(),
      title: `Notificación de prueba ${notifications.length + 1}`,
      body: 'Esta es una notificación generada para pruebas',
      date: new Date().toISOString(),
      read: false
    };
    
    const updated = [newNotif, ...notifications];
    setNotifications(updated);
    await AsyncStorage.setItem('@notifications', JSON.stringify(updated));
  };

  // Limpiar todas las notificaciones
  const clearAllNotifications = async () => {
    Alert.alert(
      'Confirmar',
      '¿Estás seguro de borrar todo el historial?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Borrar', 
          onPress: async () => {
            await AsyncStorage.removeItem('@notifications');
            setNotifications([]);
          },
          style: 'destructive'
        }
      ]
    );
  };

  // Restaurar datos de prueba
  const resetTestData = async () => {
    const mockData = generateMockNotifications();
    setNotifications(mockData);
    await AsyncStorage.setItem('@notifications', JSON.stringify(mockData));
  };

  // ... (mantén tus funciones existentes como formatDate y markAsRead)

  return (
    <View style={styles.container}>
      <View style={styles.testControls}>
        <Button title="Agregar prueba" onPress={addTestNotification} />
        <Button title="Limpiar todo" onPress={clearAllNotifications} color="#ff4444" />
        <Button title="Resetear datos" onPress={resetTestData} color="#888" />
      </View>

      {/* ... (tu FlatList existente) ... */}
    </View>
  );
};

const styles = StyleSheet.create({
  // ... (tus estilos existentes) ...
  testControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#f0f0f0'
  }
});

export default HistNotScreen;