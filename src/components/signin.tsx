import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useUser } from "./usercontext";
import BackgroundWrapper from "./background";
import { login, checkTokenUser } from "../services/authservice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";

export default function SignInScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const { setUserType } = useUser();

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        console.log("token", token);
        if (token) {
          const response = await checkTokenUser(token);
          if (response.status === 200) {
            console.log("Token is valid, navigating to Greenhouses");
            const Type = await AsyncStorage.getItem("userType");
            setUserType(Type || ""); // Provide a fallback value
            navigation.navigate("Greenhouses");
          } else {
            await AsyncStorage.removeItem("token");
            await AsyncStorage.removeItem("userType");
          }
        }
      } catch (error) {
        console.error("Error reading from AsyncStorage:", error);
      }
    };

    checkToken();
  }, []);
  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor ingresa tu correo y contraseña");
      return;
    }

    setLoading(true);
    try {
      const resultado = await login(email, password);
      if (resultado.status === 200) {
        console.log("Login successful:", resultado);
        const Type = resultado.userType == true ? "admin" : "user";
        setUserType(Type);
        await AsyncStorage.setItem("group", String(resultado.group));
        await AsyncStorage.setItem("userType", Type);
        await AsyncStorage.setItem("token", resultado.token);
        navigation.navigate("Greenhouses");

      } else {
        Alert.alert("Error", resultado.message || "Credenciales incorrectas");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <BackgroundWrapper>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-center px-6"
      >
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-800 text-center mb-2">
            Bienvenido
          </Text>
          <Text className="text-lg text-gray-600 text-center">
            Inicia sesión en tu cuenta
          </Text>
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Correo Electrónico
          </Text>
          <View className="flex-row items-center bg-white rounded-lg px-4 py-3 border border-gray-200">
            <MaterialIcons
              name="email"
              size={20}
              color="#6b7280"
              className="mr-2"
            />
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

        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Contraseña
          </Text>
          <View className="flex-row items-center bg-white rounded-lg px-4 py-3 border border-gray-200">
            <MaterialIcons
              name="lock"
              size={20}
              color="#6b7280"
              className="mr-2"
            />
            <TextInput
              className="flex-1 text-gray-800"
              placeholder="••••••••"
              placeholderTextColor="#9ca3af"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={secureTextEntry}
            />
            <TouchableOpacity
              onPress={() => setSecureTextEntry(!secureTextEntry)}
            >
              <MaterialIcons
                name={secureTextEntry ? "visibility-off" : "visibility"}
                size={20}
                color="#6b7280"
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          className={`bg-amber-500 rounded-lg py-4 items-center ${
            loading ? "opacity-70" : ""
          }`}
          onPress={handleSignIn}
          disabled={loading}
        >
          {loading ? (
            <View className="flex-row items-center">
              <Text className="text-white font-medium mr-2">Cargando...</Text>
            </View>
          ) : (
            <Text className="text-white font-medium">Iniciar Sesión</Text>
          )}
        </TouchableOpacity>

          <View className="flex-row justify-center flex-wrap">
            <Text className="text-gray-600">¿No tienes una cuenta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
              <Text className="text-amber-500 font-medium">Regístrate</Text>
            </TouchableOpacity>
          </View>
        

      </KeyboardAvoidingView>
    </BackgroundWrapper>
  );
}
