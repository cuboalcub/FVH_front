import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { UserProvider } from "./components/usercontext";
import { notiService } from "./utils/noti/noti";
import { Alert } from "react-native";

// Importa la pantalla de pruebas
import MQTTTestScreen from "./utils/MQTTTestScreen";

// Tus imports de pantallas existentes...
import SignInScreen from '../src/components/signin';
import SignUpScreen from '../src/components/signup';
import HistNotScreen from "./utils/histNot";
// ... otros imports ...

export type RootStackParamList = {
  // ... tus tipos existentes ...
  SignIn: undefined;
  MQTTTest: undefined; // Añade este tipo para la pantalla de pruebas
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  // Inicialización del servicio de notificaciones
  useEffect(() => {
    const initializeServices = async () => {
      try {
        await notiService.init({
          mqttBrokerUrl: 'mqtt://test.mosquitto.org:1883', // Broker público para pruebas
          mqttOptions: {
            clientId: `app-${Date.now()}`
          }
        });
        console.log('Servicio de notificaciones inicializado');
      } catch (error) {
        Alert.alert('Error', 'No se pudo iniciar el servicio de notificaciones');
        console.error('Error inicializando notiService:', error);
      }
    };

    initializeServices();
  }, []);

  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="SignIn"
          screenOptions={{
            headerShown: true,
            headerStyle: { backgroundColor: '#2c3e50' },
            headerTintColor: '#ffffff',
            headerTitleStyle: { fontWeight: 'bold' },
            animation: 'slide_from_right'
          }}
        >
          {/* Tus pantallas existentes */}
          <Stack.Screen 
            name="SignIn" 
            component={SignInScreen} 
            options={{ headerShown: false }} 
          />
          
          {/* ... otras pantallas ... */}

          {/* Pantalla de pruebas - solo visible en desarrollo */}
          {__DEV__ && (
            <Stack.Screen
              name="MQTTTest"
              component={MQTTTestScreen}
              options={{ 
                title: 'Pruebas de Notificaciones',
                headerStyle: { backgroundColor: '#4a148c' } // Morado para distinguir
              }}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}