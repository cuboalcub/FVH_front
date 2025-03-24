import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App'; // Ensure correct import path

type Props = NativeStackScreenProps<RootStackParamList, 'Greenhouses'>;

export default function GreenhousesScreen({ navigation }: Props) {
  const greenhouses = [
    { id: '1', name: 'Invernadero 1' },
    { id: '2', name: 'Invernadero 2' },
    { id: '3', name: 'Invernadero 3' },
  ];

  return (
    <View style={styles.container}>
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
    </View>
  );
}

const styles = StyleSheet.create({
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

