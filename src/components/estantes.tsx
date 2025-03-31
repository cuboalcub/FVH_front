import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import BackgroundWrapper from './background';

type Props = NativeStackScreenProps<RootStackParamList, 'ShelfDetails'>;

export default function ShelfDetailsScreen({ route }: Props) {
  const { shelfId } = route.params;

  return (
    <BackgroundWrapper>
      <Text style={styles.title}> Estante {shelfId}</Text>
      <Text style={styles.details}>Placeholder Detalles de planta.</Text>
      </BackgroundWrapper>
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
