import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'ShelfDetails'>;

export default function ShelfDetailsScreen({ route }: Props) {
  const { shelfId } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shelf {shelfId}</Text>
      <Text style={styles.details}>Plant details for this shelf will be displayed here.</Text>
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
  details: {
    fontSize: 18,
    color: '#fff',
  },
});
