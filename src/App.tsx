import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Import Screens
<<<<<<< HEAD
import SignInScreen from "../src/components/signin";
import SignUpScreen from "../src/components/signup";
import GreenhousesScreen from "../src/components/menuinvernaderos";
import GreenhouseDetailsScreen from "../src/components/invernaderosdetalles";
import RackDetailsScreen from "./components/rackdetalles";
import ShelfDetailsScreen from "./components/estantes";
import ConfigScreen from "./components/config";
import MQTTScreen from "./components/MQTTScreen"; // Sin extensión
=======
import SignInScreen from '../src/components/signin';
import SignUpScreen from '../src/components/signup';
import GreenhousesScreen from '../src/components/menuinvernaderos';
import GreenhouseDetailsScreen from '../src/components/invernaderosdetalles';
import RackDetailsScreen from './components/rackdetalles';
import ShelfDetailsScreen from './components/estantes';
import ConfigScreen from './components/config';
import PedidosScreen from './components/pedidos';

>>>>>>> 65e54950c9c46442bfdaba3f4cd7f2a519e91f25

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  Greenhouses: undefined;
  GreenhouseDetails: { greenhouseId: string; name: string };
  RackDetails: { rackId: string; greenhouseId: string; name: string };
  ShelfDetails: { shelfId: string; rackId: string; greenhouseId: string };
  Config: undefined;
<<<<<<< HEAD
  MQTT: undefined; // ➕ Agregar MQTT en la lista de rutas
=======
  PedidosScreen: undefined;
>>>>>>> 65e54950c9c46442bfdaba3f4cd7f2a519e91f25
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
<<<<<<< HEAD
      <Stack.Navigator screenOptions={{ headerShown: true }}> 
      <Stack.Screen name="MQTTTest" component={MQTTScreen} />
=======
      <Stack.Navigator screenOptions={{ headerShown: true }}>
        <Stack.Screen name="SignIn" component={SignInScreen} options={{ title: 'Iniciar Sesión' }} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: 'Registrarse' }} />
        <Stack.Screen name="Greenhouses" component={GreenhousesScreen} options={{ title: 'Invernaderos' }} />
        <Stack.Screen name="GreenhouseDetails" component={GreenhouseDetailsScreen} options={{ title: 'Detalles Invernadero' }} />
        <Stack.Screen name="RackDetails" component={RackDetailsScreen} options={{ title: 'Detalles Rack' }} />
        <Stack.Screen name="ShelfDetails" component={ShelfDetailsScreen} options={{ title: 'Detalles Shelf' }} />
        <Stack.Screen name="Config" component={ConfigScreen} />
        <Stack.Screen name= "PedidosScreen" component={PedidosScreen} options={{ title: 'PedidosScreen' }}/>
>>>>>>> 65e54950c9c46442bfdaba3f4cd7f2a519e91f25
      </Stack.Navigator>
    </NavigationContainer>
  );
}
