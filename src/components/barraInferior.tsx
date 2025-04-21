import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';


const CustomBottomBar = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
      <TouchableOpacity onPress={() => navigation.navigate('PedidosScreen')}>
          <Text style={styles.tabText}>Pedidos</Text>
        </TouchableOpacity>


        <TouchableOpacity onPress={() => navigation.navigate('Greenhouses')} style={styles.iconWrapper}>
          <View style={styles.homeButton}>
            <Ionicons name="home-outline" size={28} color="black" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Config')}>
          <Text style={styles.tabText}>Ajustes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { position: 'absolute', bottom: 20, width: '100%', alignItems: 'center' },
  navBar: {
    backgroundColor: '#5C4B3B',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: 250,
    paddingVertical: 10,
    borderRadius: 50,
  },
  tabText: { color: 'white', fontWeight: 'bold' },
  iconWrapper: {
    backgroundColor: 'white',
    borderRadius: 999,
    padding: 10,
    marginHorizontal: 10,
    elevation: 5,
  },
  homeButton: { alignItems: 'center', justifyContent: 'center' },
});

export default CustomBottomBar;
