import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';

export default function SensorDataScreen() {
  const handleCalibration = () => alert('Calibracion realizada');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sensores</Text>

      {/* Placeholder Graph 1 */}
      <View style={styles.graphPlaceholder}>
        <Text style={styles.graphText}>[ Gráfico Placeholder 1 ]</Text>
      </View>

      {/* Placeholder Graph 2 */}
      <View style={styles.graphPlaceholder}>
        <Text style={styles.graphText}>[ Gráfico Placeholder 2 ]</Text>
      </View>

      {/* Button */}
      <TouchableOpacity style={styles.button} onPress={handleCalibration}>
        <Text style={styles.buttonText}>Realizar prueba de calibración</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFA500',
    padding: 20,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  graphPlaceholder: {
    backgroundColor: '#ffffffaa',
    height: 150,
    borderRadius: 10,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  graphText: {
    color: '#666',
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#3E3E3E',
    paddingVertical: 12,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: 20,
  },
  navItem: {
    color: '#fff',
    fontSize: 14,
  },
});
