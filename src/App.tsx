import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import Screens
import SignInScreen from '../src/components/signin';
import SignUpScreen from '../src/components/signup';
import GreenhousesScreen from '../src/components/menuinvernaderos';
import GreenhouseDetailsScreen from '../src/components/invernaderosdetalles'; 
import RackDetailsScreen from './components/rackdetalles';
import ShelfDetailsScreen from './components/estantes';


export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  Greenhouses: undefined;
  GreenhouseDetails: { greenhouseId: string; name: string };
  RackDetails: { rackId: string; greenhouseId: string; name: string };
  ShelfDetails: { shelfId: string; rackId: string; greenhouseId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: true }}>
        <Stack.Screen name="SignIn" component={SignInScreen} options={{ title: 'Iniciar Sesión' }} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: 'Registrarse' }} />
        <Stack.Screen name="Greenhouses" component={GreenhousesScreen} options={{ title: 'Invernaderos' }} />
  <Stack.Screen name="GreenhouseDetails" component={GreenhouseDetailsScreen} options={{ title: 'Detalles Invernadero' }} />
  <Stack.Screen name="RackDetails" component={RackDetailsScreen} options={{ title: 'Detalles Rack' }} />
  <Stack.Screen name="ShelfDetails" component={ShelfDetailsScreen} options={{ title: 'Detalles Shelf' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


