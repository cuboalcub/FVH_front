import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  ScrollView,
  Modal,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import BackgroundWrapper from "./background";
import CustomBottomBar from "./barraInferior";
import { Picker } from "@react-native-picker/picker";
import { obtenerPedidos } from "../services/pedidoService";
import { get_charolas, patch_pedido, patch_bandeja } from "../services/invernaderos";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_ROUTES } from "../services/api";
import { useMQTT } from "../hooks/useMQTT";

type Props = NativeStackScreenProps<RootStackParamList, "RackDetails">;

export default function RackDetailsScreen({ route, navigation }: Props) {
  const { rackId, greenhouseId, name } = route.params;
  
  // MQTT Configuration
  const mqttOptions = {
    uri: "ws://192.168.137.171:8084/mqtt", // Replace with your MQTT broker URI
    clientId: `rack-${rackId}-${Math.random().toString(16).substr(2, 8)}`
  };

  
  const { messages, isConnected, error, connect, disconnect } = useMQTT(mqttOptions);
  console.log("MQTT Messages:", isConnected);
  
  const [sensorData, setSensorData] = useState({
    temperature: "N/A",
    humidity: "N/A",
    lastUpdate: ""
  });

  const [idTray, setIdTray] = useState<string | null>(null);
  const [racks, setRacks] = useState<any[]>([]);
  const [trays, setTrays] = useState<any[]>([]);
  const [selectedTray, setSelectedTray] = useState<any | null>(null);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState("");
  const [detalleSelect, setdDetalleSelect] = useState<any[]>([]);
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [detallePedido, setDetallePedido] = useState<any[]>([]);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [quantities, setQuantities] = useState<Record<number, string>>({});
  const [checkedItemId, setCheckedItemId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // MQTT Topics
  const temperatureTopic = `greenhouse/greenhouse-${greenhouseId}/sensor/temperature`;
  const humidityTopic = `greenhouse/greenhouse-${greenhouseId}/sensor/humidity`;

  // Process MQTT messages
 // Reemplaza el useEffect que procesa los mensajes MQTT con este:
useEffect(() => {
  if (messages[temperatureTopic] || messages[humidityTopic]) {
    const newData = { ...sensorData };

    const parseMQTTValue = (message: string) => {
      try {
        const parsed = JSON.parse(message);
        // Convierte el string a número y formatea a 1 decimal
        return parseFloat(parsed.value).toFixed(1);
      } catch (e) {
        console.error("Error parsing MQTT message:", e);
        return "N/A";
      }
    };

    if (messages[temperatureTopic]?.length > 0) {
      const lastMessage = messages[temperatureTopic][messages[temperatureTopic].length - 1];
      newData.temperature = `${parseMQTTValue(lastMessage)} °C`;
    }

    if (messages[humidityTopic]?.length > 0) {
      const lastMessage = messages[humidityTopic][messages[humidityTopic].length - 1];
      newData.humidity = `${parseMQTTValue(lastMessage)}%`;
    }

    newData.lastUpdate = new Date().toLocaleTimeString();
    setSensorData(newData);
  }
}, [messages[temperatureTopic], messages[humidityTopic]]);
  // Connect to MQTT on mount
  useEffect(() => {
    const topics = [temperatureTopic, humidityTopic];
    connect(topics);
    console.log("Connecting to MQTT with topics:", topics);
    
  }, []);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const group = await AsyncStorage.getItem("group");
        const token = await AsyncStorage.getItem("token");
        const [pedidosData, charolasData] = await Promise.all([
          obtenerPedidos(token || undefined, group || undefined),
          get_charolas(rackId || "", token || undefined)
        ]);

        const detalles: any[] = [];
        if (Array.isArray(pedidosData)) {
          pedidosData.forEach((pedido) => {
            if (Array.isArray(pedido.detalle_pedido)) {
              detalles.push(...pedido.detalle_pedido);
            }
          });
          setDetallePedido(detalles);
        }

        setPedidos(pedidosData);
        setTrays(charolasData.data);
        setLoading(false);

        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(false);
      }
    };

    fetchData();

    return () => fadeAnim.setValue(0);
  }, []);

  // Update details when modal opens
  useEffect(() => {
    if (modalVisible && selectedPedido) {
      const detalle = detallePedido.filter(
        (p) => p.pedido_id == selectedPedido
      );
      setdDetalleSelect(detalle);
      setCheckedItems({});
      setQuantities({});
    }
  }, [modalVisible, selectedPedido]);

  const handleCheckboxChange = (itemId: number) => {
    setCheckedItemId((prev) => {
      // If clicking the same item, deselect it
      if (prev === itemId) {
        setQuantities((prevQuantities) => {
          const newQuantities = { ...prevQuantities };
          delete newQuantities[itemId];
          return newQuantities;
        });
        return null;
      }
      
      // If selecting a new item
      const selectedItem = detalleSelect.find(item => item.id === itemId);
      if (selectedItem) {
        setQuantities((prev) => ({
          ...prev,
          [itemId]: String(selectedItem.cantidad)
        }));
      }
      return itemId;
    });
  };

  const handleQuantityChange = (itemId: number, text: string) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    setQuantities((prev) => ({
      ...prev,
      [itemId]: numericValue
    }));
  };

  const handleAddTrays = async () => {
    if (checkedItemId && quantities[checkedItemId]) {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem("token");
        const cultivoSeleccionado = detalleSelect.find((item) => item.id === checkedItemId);
        
        // Update order details
        await patch_pedido(token || "", {
          [checkedItemId]: quantities[checkedItemId]
        });

        // Update tray
        const bandejaData = {
          id: idTray,
          peso: quantities[checkedItemId],
          pedido_id: Number(selectedPedido),
          semilla: cultivoSeleccionado?.producto || "Desconocido"
        };

        await patch_bandeja(token || "", JSON.stringify(bandejaData));
        
        // Refresh data
        const charolasData = await get_charolas(rackId || "", token || undefined);
        setTrays(charolasData.data);
        setModalVisible(false);
      } catch (err) {
        console.error("Error updating tray:", err);
        alert("Error al actualizar la charola");
      } finally {
        setLoading(false);
      }
    } else {
      alert("Selecciona un cultivo y especifica la cantidad");
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedPedido("");
    setCheckedItemId(null);
    setQuantities({});
  };

  const currentIndex = racks.findIndex((rack) => rack.id === rackId);
  const prevRack = currentIndex > 0 ? racks[currentIndex - 1] : null;
  const nextRack = currentIndex < racks.length - 1 ? racks[currentIndex + 1] : null;

  if (loading) {
    return (
      <BackgroundWrapper>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text className="text-white mt-4">Cargando datos...</Text>
        </View>
      </BackgroundWrapper>
    );
  }

  return (
    <BackgroundWrapper>
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
          {/* Rack navigation controls */}
          <View className="flex-row justify-between items-center my-4">
            <TouchableOpacity
              onPress={() =>
                prevRack &&
                navigation.push("RackDetails", {
                  rackId: prevRack.id,
                  greenhouseId,
                  name: prevRack.name,
                })
              }
              className={`flex-row items-center ${!prevRack ? "opacity-30" : ""}`}
              disabled={!prevRack}
            >
              <Ionicons name="chevron-back" size={20} color="white" />
              <Text className="text-white ml-1">{prevRack?.name || "N/A"}</Text>
            </TouchableOpacity>

            <Text className="text-white font-bold text-lg">{name}</Text>

            <TouchableOpacity
              onPress={() =>
                nextRack &&
                navigation.push("RackDetails", {
                  rackId: nextRack.id,
                  greenhouseId,
                  name: nextRack.name,
                })
              }
              className={`flex-row items-center ${!nextRack ? "opacity-30" : ""}`}
              disabled={!nextRack}
            >
              <Text className="text-white mr-1">{nextRack?.name || "N/A"}</Text>
              <Ionicons name="chevron-forward" size={20} color="white" />
            </TouchableOpacity>
          </View>

          {/* Rack statistics */}
          <View className="bg-white/10 rounded-xl p-4 mb-6 border border-white/20">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-lg font-bold text-white">
                Estadísticas del Rack
              </Text>
              <View className="flex-row items-center">
                <View className={`w-3 h-3 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                <Text className="text-white/80 text-xs">
                  {isConnected ? 'Conectado' : 'Desconectado'}
                </Text>
              </View>
            </View>

            <View className="flex-row justify-between mb-4">
              <View className="items-center">
                <Text className="text-white font-bold text-xl">
                  {trays.length}
                </Text>
                <Text className="text-white/80 text-xs">Charolas</Text>
              </View>
              
              <View className="items-center">
                <Text className="text-white font-bold text-xl">
                  {sensorData.temperature}
                </Text>
                <Text className="text-white/80 text-xs">Temperatura</Text>
              </View>
              
              <View className="items-center">
                <Text className="text-white font-bold text-xl">
                  {sensorData.humidity}
                </Text>
                <Text className="text-white/80 text-xs">Humedad</Text>
              </View>
            </View>

            {sensorData.lastUpdate && (
              <Text className="text-white/50 text-xs text-right">
                Actualizado: {sensorData.lastUpdate}
              </Text>
            )}

            {error && (
              <Text className="text-red-400 text-xs mt-2">
                Error: {error}
              </Text>
            )}
          </View>

          {/* Trays grid */}
          <Text className="text-lg font-bold text-white mb-3">
            Charolas ({trays.length})
          </Text>
          <View className="flex-row flex-wrap justify-between mb-6 px-3">
            {[...trays].sort((a, b) => a.id - b.id).map((tray) => (
              <TouchableOpacity
                key={tray.id}
                className={`w-[48%] mb-4 rounded-xl overflow-hidden bg-slate-100 ${
                  selectedTray?.id === tray.id
                    ? "border-2 border-amber-400 shadow-lg shadow-amber-400/20"
                    : "border border-white/10"
                } bg-white/5 active:bg-white/10`}
                onPress={() => {
                  setModalVisible(true);
                  setIdTray(tray.id);
                }}
                activeOpacity={0.7}
              >
                <View className="p-4">
                  <View className="flex-row justify-between items-center mb-1">
                    <Text className="text-black font-semibold text-base">
                      {tray.semilla || "Sin semilla"}
                    </Text>
                    <View className="flex-row items-center bg-blue-500/10 px-2 py-1 rounded-full">
                      <MaterialCommunityIcons
                        name="weight"
                        size={14}
                        color="#60a5fa"
                        style={{ marginRight: 4 }}
                      />
                      <Text className="text-blue-400 text-xs font-medium">
                        {tray.peso || "0"} g
                      </Text>
                    </View>
                  </View>
                  <Text className="text-white/60 text-xs mt-1">
                    ID: {tray.id}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Add Tray Modal */}
        {/* Add Tray Modal */}
<Modal
  animationType="slide"
  transparent={true}
  visible={modalVisible}
  onRequestClose={handleCloseModal}
>
  <View className="flex-1 justify-center items-center bg-black/50">
    <View className="bg-white w-11/12 rounded-xl p-6 max-h-[80%]">
      <TouchableOpacity
        onPress={handleCloseModal}
        className="absolute top-3 right-3 z-10"
      >
        <Ionicons name="close-circle" size={24} color="gray" />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text className="text-lg font-bold text-center mb-4">
          Agregar Bandeja #{idTray}
        </Text>

        <Text className="text-base font-medium mb-2">Selecciona Pedido</Text>
        <View className="border border-gray-300 rounded-lg mb-4">
          <Picker
            selectedValue={selectedPedido}
            onValueChange={(itemValue) => setSelectedPedido(String(itemValue))}
          >
            <Picker.Item label="Selecciona un pedido" value={null} />
            {pedidos.map((pedido) => (
              <Picker.Item
                key={pedido.id}
                label={`Pedido #${pedido.id} - ${pedido.estado}`}
                value={pedido.id}
              />
            ))}
          </Picker>
        </View>

        {detalleSelect.length > 0 && (
          <View className="mb-4">
            <Text className="text-base font-medium mb-2">
              Selecciona los cultivos:
            </Text>
            {detalleSelect.map((item) => (
              <View key={item.id} className="flex-row items-center mb-2">
                <TouchableOpacity
                  onPress={() => handleCheckboxChange(item.id)}
                  className={`w-5 h-5 border rounded mr-2 ${
                    checkedItemId === item.id
                      ? "bg-blue-500 border-blue-500"
                      : "border-gray-400"
                  }`}
                />
                <Text className="flex-1">{item?.producto}</Text>
                {checkedItemId === item.id && (
                  <TextInput
                    value={quantities[item.id]}
                    onChangeText={(text) => handleQuantityChange(item.id, text)}
                    keyboardType="numeric"
                    placeholder="Cantidad"
                    className="border border-gray-300 rounded px-2 py-1 w-20 text-center"
                  />
                )}
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity
          onPress={handleAddTrays}
          className="bg-blue-500 rounded-lg py-3 items-center mt-2"
        >
          <Text className="text-white font-semibold text-base">Guardar</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  </View>
</Modal>


        <CustomBottomBar />
      </Animated.View>
    </BackgroundWrapper>
  );
}