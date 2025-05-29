import { View, Text, ScrollView } from "react-native";
import { useMQTT } from "../hooks/useMQTT";

export default function MQTTScreen() {
    const { messages } = useMQTT();

    return (
        <View style={{ padding: 20, flex: 1 }}>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>📡 Mensajes recibidos:</Text>
            <ScrollView style={{ marginTop: 10, borderWidth: 1, padding: 10, height: 300 }}>
                {messages.length > 0 ? (
                    messages.map((msg, index) => (
                        <Text key={index} style={{ marginBottom: 5 }}>
                            {index + 1}. {msg}
                        </Text>
                    ))
                ) : (
                    <Text>🔄 Esperando mensajes...</Text>
                )}
            </ScrollView>
        </View>
    );
}
