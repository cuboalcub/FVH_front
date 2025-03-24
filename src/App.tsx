import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Text, View } from 'react-native';

// Import Screens
import SignUpScreen from '../src/components/signup';
import SignInScreen from '../src/components/signin';



// Stack and Tab Navigators
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigation (for main screens)
function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Invernadero" component={() => <View><Text>Invernadero</Text></View>} />
      <Tab.Screen name="Perfil" component={() => <View><Text>Perfil</Text></View>} />
    </Tab.Navigator>
  );
}

// Stack Navigation (for authentication)
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen name="SignIn" component={SignInScreen} options={{ title: 'Iniciar Sesión' }} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: 'Registrarse' }} />
        
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}
