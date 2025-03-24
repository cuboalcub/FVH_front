import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'RackDetails'>;

export default function RackDetailsScreen({ route, navigation }: Props) {
  const { rackId, greenhouseId, name } = route.params;

  // Sample tray data
  const trays = [
    { id: '1', crop: 'Maíz', temp: '22°C', humidity: '84%' },
    { id: '2', crop: 'Maíz', temp: '22°C', humidity: '84%' },
    { id: '3', crop: 'Maíz', temp: '22°C', humidity: '84%' },
    { id: '4', crop: 'Cebada', temp: '22°C', humidity: '83%' },
    { id: '5', crop: 'Cebada', temp: '22°C', humidity: '64%' },
    { id: '6', crop: 'Centeno', temp: '22°C', humidity: '84%' },
    { id: '7', crop: 'Centeno', temp: '22°C', humidity: '84%' },
    { id: '8', crop: 'Centeno', temp: '22°C', humidity: '84%' },
    { id: '9', crop: 'Centeno', temp: '22°C', humidity: '84%' },
    { id: '10', crop: 'Centeno', temp: '22°C', humidity: '84%' },
  ];

  return (
    <View style={styles.container}>
      {/* Header with navigation arrows */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="chevron-back-circle" size={32} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>{name}</Text>
        <TouchableOpacity>
          <Ionicons name="chevron-forward-circle" size={32} color="black" />
        </TouchableOpacity>
      </View>

      {/* Rack details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.detailsTitle}>Datos de Rack</Text>
        <Text>- Información 1</Text>
        <Text>- Información 2</Text>
        <Text>- Información 3</Text>
      </View>

      {/* Trays Grid */}
      <View style={styles.trayContainer}>
        <FlatList
          data={trays}
          keyExtractor={(item) => item.id}
          numColumns={3} // 3 items per row
          renderItem={({ item }) => (
            <View style={styles.trayCard}>
              <Text style={styles.trayText}>{item.crop}</Text>
              <Text style={styles.traySubText}>T {item.temp}</Text>
              <Text style={styles.traySubText}>H {item.humidity}</Text>
            </View>
          )}
        />
      </View>

      {/* Footer with Home & Settings */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('Config')}>
          <Ionicons name="home" size={32} color="white" />
        </TouchableOpacity>
        <Text style={styles.footerText}>Ajustes</Text>
        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFA500',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  detailsContainer: {
    backgroundColor: '#20B2AA',
    padding: 15,
    borderRadius: 10,
    marginVertical: 15,
    width: '90%',
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  trayContainer: {
    backgroundColor: '#3E2723',
    padding: 10,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
  },
  trayCard: {
    backgroundColor: '#F4A460',
    padding: 10,
    margin: 5,
    width: 100,
    borderRadius: 8,
    alignItems: 'center',
  },
  trayText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  traySubText: {
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    backgroundColor: '#5D4037',
    width: '100%',
    padding: 15,
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
  },
  homeButton: {
    padding: 10,
    backgroundColor: '#000',
    borderRadius: 50,
  },
  footerText: {
    marginLeft: 15,
    fontSize: 18,
    color: '#fff',
  },
});
