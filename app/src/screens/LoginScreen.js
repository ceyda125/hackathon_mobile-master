import { router, Stack } from "expo-router";
import LottieView from "lottie-react-native";
import { useState } from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Admin kullanıcı adı ve şifre kontrolü
    if (email.trim() === "admin@gmail.com" && password === "admin123") {
      // Başarılı ise anasayfaya yönlendir
      // NOT: Eğer '/home' adında bir dosyanız yoksa ve Tabs yapısına gitmek istiyorsanız
      // burayı router.replace("/(tabs)") veya router.replace("/explore") yapmalısınız.
      router.replace("/Home");
    } else {
      // Hatalı giriş uyarısı
      if (Platform.OS === "web") {
        window.alert("Hatalı e-posta veya şifre!");
      } else {
        Alert.alert("Hata", "Hatalı e-posta veya şifre!");
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Siyah Header'ı kaldırmak için gerekli ayar */}
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.contentContainer}>
        <LottieView
          source={require("../assets/animations/Live_chatbot.json")}
          autoPlay
          loop
          style={styles.animation}
        />

        <Text style={styles.title}>AIDEM</Text>
        <Text style={styles.subtitle}>Enerji Asistanı</Text>

        <TextInput
          style={styles.input}
          placeholder="E-posta"
          placeholderTextColor="#94a3b8"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Şifre"
          placeholderTextColor="#94a3b8"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Giriş Yap</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#F1F5F9",
    // Web'de tüm ekranı kaplaması ama içeriği ortalaması için:
    alignItems: "center",
  },
  contentContainer: {
    width: "100%",
    // Web'de mobil görünümü korumak için maksimum genişlik veriyoruz:
    maxWidth: 400,
    padding: 20,
    justifyContent: "center",
  },
  animation: {
    width: 200,
    height: 200,
    alignSelf: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
    color: "#2563EB",
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 40,
    color: "#10B981",
  },
  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#2563EB",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    // Butona biraz gölge ekleyelim
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
