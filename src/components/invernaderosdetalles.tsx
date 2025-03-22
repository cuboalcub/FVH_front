import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App'; // Ensure correct path

type Props = NativeStackScreenProps<RootStackParamList, 'GreenhouseDetails'>;

export default function GreenhouseDetailsScreen({ route }: Props) {
  const { greenhouseId, name } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{name}</Text>
      <Text style={styles.details}>Details for Greenhouse ID: {greenhouseId}</Text>
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
