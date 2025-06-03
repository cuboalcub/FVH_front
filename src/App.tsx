import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { UserProvider } from "./components/usercontext";

// Screen imports
import MyComponent from './components/mycomponent';
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
import "../global.css";
import ActuatorScreen from "./components/actuador";
import { useMQTT } from "./hooks/useMQTT";
import { registerForPushNotificationsAsync } from "./services/noti";

// Type definitions for navigation parameters
export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  Greenhouses: undefined;
  GreenhouseDetails: { 
    greenhouseId: string; 
    name: string;
    status?: 'optimal' | 'warning' | 'critical'; // Added optional status
  };
  RackDetails: { 
    rackId: string; 
    greenhouseId: string; 
    name: string;
    status?: 'optimal' | 'warning' | 'critical'; // Added optional status
  };
  ShelfDetails: { 
    shelfId: string; 
    rackId: string; 
    greenhouseId: string;
    name?: string; // Added optional name
  };
  ConfigScreen: undefined;
  ActuatorScreen: {
    greenhouseId: number;
  };
  Config: undefined;
  MQTT: undefined;
  PedidosScreen: undefined;
  ConfigUsuariosScreen: undefined;
  SensorData: undefined;
  Notifications: undefined;
  TrayDetails: { trayId: string }; 
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Screen options configuration
const screenOptions = {
  headerShown: true,
  
  // Header appearance
  headerStyle: {
    backgroundColor: '#2c3e50', // Dark blue background
  },
  headerTintColor: '#ffffff', // White color for back button and title
  headerTitleStyle: {
    fontWeight: 'bold', // Bold title text
  },
  headerBackTitleVisible: false, // Hide iOS back button text
  
  // Transition animation
  animation: 'slide_from_right' as const, // Smooth screen transition
};


export default function App() {
  const { connect, disconnect } = useMQTT({
    uri: 'wss://192.168.137.171:8084/mqtt', // Public MQTT broker
    clientId: `expo_${Math.random().toString(16).substr(2, 8)}`, // Unique client ID
  });
  useEffect(() => {
    registerForPushNotificationsAsync();
  
    const topics = [
      "greenhouse/greenhouse-1/actuator/notification",
    ];
  
    connect(topics); // del hook useMQTT
  
    return () => disconnect();
  }, []);
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="SignIn"
          screenOptions={screenOptions}
        >
          {/* Auth Screens */}
          <Stack.Screen 
            name="SignIn" 
            component={SignInScreen} 
            options={{ 
              title: 'Iniciar Sesión',
              headerShown: false // Full-screen for auth
            }} 
          />
          <Stack.Screen 
            name="SignUp" 
            component={SignUpScreen} 
            options={{ 
              title: 'Crear Cuenta',
              headerShown: false // Full-screen for auth
            }} 
          />

<Stack.Screen 
  name="Greenhouses"
  component={GreenhousesScreen}
  options={{
    animationDuration: 10, // Disable animation
    title: 'Mis Invernaderos',
    headerShown: false,
    headerLeft: () => null, // Quita el botón de atrás
    gestureEnabled: false, // Desactiva gesto de deslizamiento (iOS)
  }}
/>

          
          {/* Greenhouse Flow */}
          <Stack.Screen 
            name="GreenhouseDetails" 
            component={GreenhouseDetailsScreen} 
            options={({ route }) => ({ 
              title: route.params.name || 'Invernadero'
            })} 
          />
          <Stack.Screen 
            name="RackDetails" 
            component={RackDetailsScreen} 
            options={({ route }) => ({ 
              title: route.params.name || 'Rack'
            })} 
          />
          <Stack.Screen 
            name="ShelfDetails" 
            component={ShelfDetailsScreen} 
            options={({ route }) => ({ 
              title: route.params.name || 'Estante'
            })} 
          />

          {/* Configuration Screens */}
          <Stack.Group screenOptions={{ presentation: 'modal' }}>
            <Stack.Screen 
              name="ConfigScreen" 
              component={ConfigScreen} 
              options={{ title: 'Configuración' }} 
            />
            
            <Stack.Screen 
              name="ConfigUsuariosScreen" 
              component={ConfigUsuariosScreen} 
              options={{ title: 'Administrar Usuarios' }}
            />
            <Stack.Screen
              name="ActuatorScreen"
              component={ActuatorScreen}
              options={{ title: 'Control de Actuadores' }}
            />

            <Stack.Screen
              name="SensorData"
              component={SensorDataScreen}
              options={{ title: 'Configuración de Sensores' }}
            />
            <Stack.Screen 
              name="Notifications" 
              component={LogsScreen} 
              options={{ title: 'Registro de Actividades' }} 
            />
            <Stack.Screen 
              name="PedidosScreen" 
              component={PedidosScreen} 
              options={{ title: 'Gestión de Pedidos' }} 
            />
          </Stack.Group>

          {/* Optional MQTT Screen */}
          {/* <Stack.Screen 
            name="MQTT" 
            component={MQTTScreen} 
            options={{ title: 'Conexión MQTT' }} 
          /> */}
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}