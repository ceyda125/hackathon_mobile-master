import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Hoş geldin Enerji Dostu!</Text>

      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push("/chat")}
      >
        <Ionicons name="chatbubbles" size={28} color="#2563EB" />
        <Text style={styles.cardText}>AIDEM Chatbot</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => alert("Diğer sayfaları burada açacaksın")}
      >
        <Ionicons name="flash-outline" size={28} color="#2563EB" />
        <Text style={styles.cardText}>Enerji Analizim</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => alert("Ayarlar ekranını ekleyebilirsin")}
      >
        <Ionicons name="settings-outline" size={28} color="#2563EB" />
        <Text style={styles.cardText}>Ayarlar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC", padding: 20 },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#334155",
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 20,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  cardText: { marginLeft: 15, fontSize: 18, color: "#1E293B" },
});
