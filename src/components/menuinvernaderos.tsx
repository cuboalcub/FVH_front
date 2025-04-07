import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useUser } from './usercontext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import BackgroundWrapper from './background';

type Props = NativeStackScreenProps<RootStackParamList, 'Greenhouses'>;

export default function GreenhousesScreen({ navigation }: Props) {
  const { userType } = useUser();

  const greenhouses = [
    { id: '1', name: 'Invernadero 1' },
    { id: '2', name: 'Invernadero 2' },
    { id: '3', name: 'Invernadero 3' },
  ];

  return (
    <BackgroundWrapper>
      <Text style={styles.header}>Greenhouses</Text>
      <View style={styles.greenhousesContainer}>
        {greenhouses.map((house) => (
          <TouchableOpacity
            key={house.id}
            style={styles.greenhouseWrapper}
            onPress={() => navigation.navigate('GreenhouseDetails', { greenhouseId: house.id, name: house.name })}
          >
            <Image source={require('../../assets/greenhouse.png')} style={styles.image} />
            <Text style={styles.number}>{house.id}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Admin-only button */}
      {userType === 'admin' && (
        <TouchableOpacity style={styles.adminButton} onPress={() => navigation.navigate('ConfigUsuariosScreen')}>
          <Text style={styles.adminButtonText}>Usuario</Text>
        </TouchableOpacity>

      )}
      {userType === 'admin' && (
        <TouchableOpacity style={styles.adminButton} onPress={() => navigation.navigate('SensorData')}>
          <Text style={styles.adminButtonText}> Configuracion de admin </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.adminButton} onPress={() => navigation.navigate('PedidosScreen')}>
        <Text style={styles.adminButtonText}> Pedidos </Text>
      </TouchableOpacity>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFA500'
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20, color: '#fff'
  },
  greenhousesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%'
  },
  greenhouseWrapper: {
    alignItems: 'center'
  },
  image: {
    width: 80,
    height: 80
  },
  number: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 5
  },
  adminButton: {
    marginTop: 20,
    backgroundColor: 'black',
    padding: 15,
    borderRadius: 10,
    width: 200,
    alignItems: 'center',
  },
  adminButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
});
