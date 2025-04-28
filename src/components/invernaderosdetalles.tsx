import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import BackgroundWrapper from './background';
import CustomBottomBar from './barraInferior';

type Props = NativeStackScreenProps<RootStackParamList, 'GreenhouseDetails'>;

export default function GreenhouseDetailsScreen({ route, navigation }: Props) {
  const { greenhouseId, name } = route.params;

  const racks = getRacksForGreenhouse(greenhouseId);

  return (
    <BackgroundWrapper>
      <Text style={styles.title}>{name}</Text>
      <Text style={styles.subtitle}>Racks en {name}</Text>
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
      <CustomBottomBar />
    </BackgroundWrapper>
  );
}

function getRacksForGreenhouse(greenhouseId: string) {
  if (greenhouseId === '1') {
    return [
      { id: '1', name: 'Rack A' },
      { id: '2', name: 'Rack B' },
    ];
  } else if (greenhouseId === '2') {
    return [
      { id: '3', name: 'Rack X' },
      { id: '2', name: 'Rack Y' },
    ];
  } else if (greenhouseId === '3') {
    return [
      { id: '1', name: 'Rack 1' },
      { id: '3', name: 'Rack 2' },
    ];
  } else {
    return [];
  }
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
