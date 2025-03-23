import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'RackDetails'>;

export default function RackDetailsScreen({ route, navigation }: Props) {
  const { rackId, greenhouseId, name } = route.params;

  const shelves = [
    { id: '1', name: 'Shelf 1' },
    { id: '2', name: 'Shelf 2' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{name}</Text>
      <Text style={styles.subtitle}>Shelves in {name}</Text>

      {shelves.map((shelf) => (
        <TouchableOpacity
          key={shelf.id}
          style={styles.shelfButton}
          onPress={() =>
            navigation.navigate('ShelfDetails', { shelfId: shelf.id, rackId, greenhouseId })
          }
        >
          <Text style={styles.shelfText}>{shelf.name}</Text>
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
  shelfButton: {
    backgroundColor: '#008CBA',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  shelfText: {
    color: '#fff',
    fontSize: 18,
  },
});
