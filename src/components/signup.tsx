import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { Button } from '@react-navigation/elements';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import BackgroundWrapper from './background';
import { signup } from '../utils/authservice';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignUpScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    const resultado = await signup(email, password)
    if (resultado.status ===200) {
      Alert.alert('inicio de sesion exitoso', `Bienvenido, ${email}`);
      navigation.navigate('SignIn')

    }

    // Aquí va la lógica de registro
    Alert.alert('Registro exitoso', `Bienvenido, ${email}`);
  };

  return (
    <BackgroundWrapper>
      <Text style={styles.title}>Crear Cuenta</Text>
<Text style={styles.label}>Nombre</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
        autoCapitalize="none"
      />
<Text style={styles.label}>Correo Electrónico</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo Electrónico"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
<Text style={styles.label}>Contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
<Text style={styles.label}>Confirmar Contraseña</Text> 
      <TextInput
        style={styles.input}
        placeholder="Confirmar Contraseña"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
<TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Crear cuenta</Text>
      </TouchableOpacity>
          <Button onPress={() => navigation.navigate('SignIn') } style={{ marginTop: 20 }} >
          ¿Ya tienes cuenta? Inicia sesión aquí </Button>
    </BackgroundWrapper>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFA500',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 16,
    marginBottom: 5,
    color: '#000',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  registerText: {
    marginTop: 15,
    color: '#000',
  },
  link: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 5,
  },
});
