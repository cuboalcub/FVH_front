import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Button } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App'; // Ensure correct import path
import BackgroundWrapper from './background';

type Props = NativeStackScreenProps<RootStackParamList, 'Greenhouses'>;

export default function GreenhousesScreen({ navigation }: Props) {
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
      <TouchableOpacity
            style={styles.button} onPress={() => navigation.navigate('PedidosScreen') }>
            <Text style={styles.buttonText}> Pedidos </Text>
          </TouchableOpacity>
   </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '80%',
    height: 50,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 10,
    position: 'absolute', // Position it absolutely
    bottom: 30, // Place it at the bottom
    alignSelf: 'center',
  },

  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFA500',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  greenhousesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
  },
  greenhouseWrapper: {
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
  },
  number: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 5,
  },
});

