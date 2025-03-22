import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import Screens
import SignInScreen from '../src/components/signin';
import SignUpScreen from '../src/components/signup';
import GreenhousesScreen from '../src/components/menuinvernaderos';
import GreenhouseDetailsScreen from '../src/components/invernaderosdetalles'; // Ensure this file exists

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  Greenhouses: undefined;
  GreenhouseDetails: { greenhouseId: string; name: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: true }}>
        <Stack.Screen name="SignIn" component={SignInScreen} options={{ title: 'Iniciar Sesión' }} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: 'Registrarse' }} />
        <Stack.Screen name="Greenhouses" component={GreenhousesScreen} options={{ title: 'Invernaderos' }} />
        <Stack.Screen name="GreenhouseDetails" component={GreenhouseDetailsScreen} options={{ title: 'Detalles del Invernadero' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


