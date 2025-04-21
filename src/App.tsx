import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { UserProvider } from "./components/usercontext";

// Import Screens

import SignInScreen from '../src/components/signin';
import SignUpScreen from '../src/components/signup';
import GreenhousesScreen from '../src/components/menuinvernaderos';
import GreenhouseDetailsScreen from '../src/components/invernaderosdetalles';
import RackDetailsScreen from './components/rackdetalles';
import ShelfDetailsScreen from './components/estantes';
import ConfigScreen from './components/config';
import PedidosScreen from './components/pedidos';
import ConfigUsuariosScreen from "./components/userssettings";
import SensorDataScreen from "./components/sensorsettings";
import LogsScreen from "./components/notifications";
import MQTTScreen from "./components/MQTTScreen";

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  Greenhouses: undefined;
  GreenhouseDetails: { greenhouseId: string; name: string };
  RackDetails: { rackId: string; greenhouseId: string; name: string };
  ShelfDetails: { shelfId: string; rackId: string; greenhouseId: string };
  Config: undefined;
  MQTT: undefined;
  PedidosScreen: undefined;
  ConfigUsuariosScreen: undefined;
  SensorData: undefined;
  Notifications: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <UserProvider>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: true }}>
        <Stack.Screen name="SignIn" component={SignInScreen} options={{ title: 'Iniciar Sesión' }} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: 'Registrarse' }} />
        <Stack.Screen name="Greenhouses" component={GreenhousesScreen} options={{ title: 'Invernaderos' }} />
        <Stack.Screen name="GreenhouseDetails" component={GreenhouseDetailsScreen} options={{ title: 'Detalles Invernadero' }} />
        <Stack.Screen name="RackDetails" component={RackDetailsScreen} options={{ title: 'Detalles Rack' }} />
        <Stack.Screen name="ShelfDetails" component={ShelfDetailsScreen} options={{ title: 'Detalles Shelf' }} />
        <Stack.Screen name="Config" component={ConfigScreen} />
        <Stack.Screen name= "PedidosScreen" component={PedidosScreen} options={{ title: 'PedidosScreen' }}/>
        <Stack.Screen name="ConfigUsuariosScreen" component={ConfigUsuariosScreen} />
        <Stack.Screen name= "SensorData" component={SensorDataScreen}/>
        <Stack.Screen name= "Notifications" component={LogsScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
    </UserProvider>
  );
}
