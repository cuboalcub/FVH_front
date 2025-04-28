import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { Ionicons } from '@expo/vector-icons';
import BackgroundWrapper from './background';
import CustomBottomBar from './barraInferior';

type Props = NativeStackScreenProps<RootStackParamList, 'RackDetails'>;

type Rack = {
  id: string;
  name: string;
};

type Tray = {
  id: string;
  crop: string;
  temp: string;
  humidity: string;
};

export default function RackDetailsScreen({ route, navigation }: Props) {
  const { rackId, greenhouseId, name } = route.params;

  const [racks, setRacks] = useState<Rack[]>([]);
  const [trays, setTrays] = useState<Tray[]>([]);

  useEffect(() => {
    async function fetchData() {
      const fetchedRacks = await getRacksForGreenhouse(greenhouseId);
      setRacks(fetchedRacks);

      const fetchedTrays = await getTraysForRack(greenhouseId, rackId);
      setTrays(fetchedTrays);
    }

    fetchData();
  }, [greenhouseId, rackId]);

  const currentIndex = racks.findIndex((rack) => rack.id === rackId);
  const prevRack = currentIndex > 0 ? racks[currentIndex - 1] : null;
  const nextRack = currentIndex < racks.length - 1 ? racks[currentIndex + 1] : null;

  return (
    <BackgroundWrapper>
      {/* Header*/}
      <View style={styles.header}>
        {/* Rack Previo*/}
        <TouchableOpacity
          onPress={() => {
            if (prevRack) {
              navigation.replace('RackDetails', {
                rackId: prevRack.id,
                greenhouseId,
                name: prevRack.name,
              });
            }
          }}
          disabled={!prevRack}
        >
          <Ionicons
            name="chevron-back-circle"
            size={32}
            color={prevRack ? 'black' : 'gray'}
          />
        </TouchableOpacity>

        <Text style={styles.title}>{name}</Text>

        {/* Siguiente Rack */}
        <TouchableOpacity
          onPress={() => {
            if (nextRack) {
              navigation.replace('RackDetails', {
                rackId: nextRack.id,
                greenhouseId,
                name: nextRack.name,
              });
            }
          }}
          disabled={!nextRack}
        >
          <Ionicons
            name="chevron-forward-circle"
            size={32}
            color={nextRack ? 'black' : 'gray'}
          />
        </TouchableOpacity>
      </View>

      {/* Detalles Rack */}
      <View style={styles.detailsContainer}>
        <Text style={styles.detailsTitle}>Datos de Rack</Text>
        <Text>- Información 1</Text>
        <Text>- Información 2</Text>
        <Text>- Información 3</Text>
      </View>

      {/* Charolas */}
      <View style={styles.trayContainer}>
        <FlatList
          data={trays}
          keyExtractor={(item) => item.id}
          numColumns={3}
          renderItem={({ item }) => (
            <View style={styles.trayCard}>
              <Text style={styles.trayText}>{item.crop}</Text>
              <Text style={styles.traySubText}>T {item.temp}</Text>
              <Text style={styles.traySubText}>H {item.humidity}</Text>
            </View>
          )}
        />
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('Config')}>
          <Ionicons name="home" size={32} color="white" />
        </TouchableOpacity>
        <Text style={styles.footerText}>Ajustes</Text>
      </View>

      <CustomBottomBar />
    </BackgroundWrapper>
  );
}

/** Mock datos de API para Racks  */
async function getRacksForGreenhouse(greenhouseId: string): Promise<Rack[]> {
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
      { id: '1', name: 'Rack X' },
      { id: '3', name: 'Rack Y' },
    ];
  }
   else {
    return [];
  }
}

async function getTraysForRack(greenhouseId: string, rackId: string): Promise<Tray[]> {
  if (rackId === '1') {
    return [
      { id: '1', crop: 'Maíz', temp: '22°C', humidity: '84%' },
      { id: '2', crop: 'Cebada', temp: '22°C', humidity: '83%' },
    ];
  } else if (rackId === '2') {
    return [
      { id: '3', crop: 'Centeno', temp: '23°C', humidity: '78%' },
      { id: '4', crop: 'Avena', temp: '24°C', humidity: '80%' },
    ];
  } else if (rackId === '3') {
    return [
      { id: '5', crop: 'Trigo', temp: '25°C', humidity: '75%' },
      { id: '6', crop: 'Sorgo', temp: '22°C', humidity: '70%' },
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  detailsContainer: {
    backgroundColor: '#F4A460',
    padding: 15,
    borderRadius: 10,
    marginVertical: 15,
    width: '90%',
    borderStyle: 'solid',
    borderWidth: 5,
    borderColor: '#ff8c00',
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  trayContainer: {
    backgroundColor: '#3E2723',
    padding: 10,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
  },
  trayCard: {
    backgroundColor: '#F4A460',
    padding: 10,
    margin: 5,
    width: 100,
    borderRadius: 8,
    alignItems: 'center',
  },
  trayText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  traySubText: {
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    backgroundColor: '#5D4037',
    width: '100%',
    padding: 15,
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
  },
  homeButton: {
    padding: 10,
    backgroundColor: '#000',
    borderRadius: 50,
  },
  footerText: {
    marginLeft: 15,
    fontSize: 18,
    color: '#fff',
  },
});
