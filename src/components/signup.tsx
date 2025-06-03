import React, { useState } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import BackgroundWrapper from './background';
import { signup } from '../services/authservice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';

export default function SignUpScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [username, setusername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [confirmSecureTextEntry, setConfirmSecureTextEntry] = useState(true);

  const handleSignUp = async () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      const resultado = await signup(username, email, password);
      if (resultado.status === 201) {
        Alert.alert('Registro exitoso', `Bienvenido ${username}`);
        console.log('resultado', resultado);
        navigation.navigate("SignIn");
      } else {
        Alert.alert('Error', resultado.message || 'Error en el registro');
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al registrarse');
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BackgroundWrapper>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center px-6"
      >
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-800 text-center mb-2">Crear Cuenta</Text>
          <Text className="text-lg text-gray-600 text-center">Completa tus datos para registrarte</Text>
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">username Completo</Text>
          <View className="flex-row items-center bg-white rounded-lg px-4 py-3 border border-gray-200">
            <MaterialIcons name="person" size={20} color="#6b7280" className="mr-2" />
            <TextInput
              className="flex-1 text-gray-800"
              placeholder="Tu username completo"
              placeholderTextColor="#9ca3af"
              value={username}
              onChangeText={setusername}
              autoCapitalize="words"
            />
          </View>
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">Correo Electrónico</Text>
          <View className="flex-row items-center bg-white rounded-lg px-4 py-3 border border-gray-200">
            <MaterialIcons name="email" size={20} color="#6b7280" className="mr-2" />
            <TextInput
              className="flex-1 text-gray-800"
              placeholder="tu@email.com"
              placeholderTextColor="#9ca3af"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoCorrect={false}
            />
          </View>
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">Contraseña</Text>
          <View className="flex-row items-center bg-white rounded-lg px-4 py-3 border border-gray-200">
            <MaterialIcons name="lock" size={20} color="#6b7280" className="mr-2" />
            <TextInput
              className="flex-1 text-gray-800"
              placeholder="••••••••"
              placeholderTextColor="#9ca3af"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={secureTextEntry}
            />
            <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)}>
              <MaterialIcons 
                name={secureTextEntry ? 'visibility-off' : 'visibility'} 
                size={20} 
                color="#6b7280" 
              />
            </TouchableOpacity>
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-2">Confirmar Contraseña</Text>
          <View className="flex-row items-center bg-white rounded-lg px-4 py-3 border border-gray-200">
            <MaterialIcons name="lock" size={20} color="#6b7280" className="mr-2" />
            <TextInput
              className="flex-1 text-gray-800"
              placeholder="••••••••"
              placeholderTextColor="#9ca3af"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={confirmSecureTextEntry}
            />
            <TouchableOpacity onPress={() => setConfirmSecureTextEntry(!confirmSecureTextEntry)}>
              <MaterialIcons 
                name={confirmSecureTextEntry ? 'visibility-off' : 'visibility'} 
                size={20} 
                color="#6b7280" 
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          className={`bg-amber-500 rounded-lg py-4 items-center ${loading ? 'opacity-70' : ''}`}
          onPress={handleSignUp}
          disabled={loading}
        >
          {loading ? (
            <View className="flex-row items-center">
              <Text className="text-white font-medium mr-2">Registrando...</Text>
            </View>
          ) : (
            <Text className="text-white font-medium">Crear Cuenta</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          className="mt-4"
          onPress={() => navigation.navigate('SignIn')}
        >
          <Text className="text-gray-600 text-center">
            ¿Ya tienes una cuenta? 
          </Text>
          <Text className="text-amber-500 font-medium">Inicia sesión</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </BackgroundWrapper>
  );
}