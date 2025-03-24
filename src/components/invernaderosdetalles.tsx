import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'GreenhouseDetails'>;

export default function GreenhouseDetailsScreen({ route, navigation }: Props) {
  const { greenhouseId, name } = route.params;

  const racks = [
    { id: '1', name: 'Rack A' },
    { id: '2', name: 'Rack B' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{name}</Text>
      <Text style={styles.subtitle}>Racks in {name}</Text>
      {racks.map((rack) => (
        <TouchableOpacity
          key={rack.id}
          style={styles.rackButton}
          onPress={() => navigation.navigate('RackDetails', { rackId: rack.id, greenhouseId, name: rack.name })}
        >
          <Image source={require('../../assets/rack.png')} style={styles.image} />
          <Text style={styles.rackText}>{rack.name}</Text>
        </TouchableOpacity>
      ))}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
  },
  rackButton: {
   alignItems: 'center',
  },
  rackText: {
    color: '#fff',
    fontSize: 18,
  },
  image: {
    width: 80,
    height: 80,
  },
});
