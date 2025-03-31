import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Import Screens
import SignInScreen from "../src/components/signin";
import SignUpScreen from "../src/components/signup";
import GreenhousesScreen from "../src/components/menuinvernaderos";
import GreenhouseDetailsScreen from "../src/components/invernaderosdetalles";
import RackDetailsScreen from "./components/rackdetalles";
import ShelfDetailsScreen from "./components/estantes";
import ConfigScreen from "./components/config";
import MQTTScreen from "./components/MQTTScreen"; // Sin extensión

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  Greenhouses: undefined;
  GreenhouseDetails: { greenhouseId: string; name: string };
  RackDetails: { rackId: string; greenhouseId: string; name: string };
  ShelfDetails: { shelfId: string; rackId: string; greenhouseId: string };
  Config: undefined;
  MQTT: undefined; // ➕ Agregar MQTT en la lista de rutas
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: true }}> 
      <Stack.Screen name="MQTTTest" component={MQTTScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
