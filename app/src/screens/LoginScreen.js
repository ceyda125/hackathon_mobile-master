import { router, Stack } from "expo-router";
import LottieView from "lottie-react-native";
import { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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
    // Basit bir doğrulama (Geliştirme aşaması için)
    if (email.trim() === "admin@gmail.com" && password === "admin123") {
      router.replace("/Home");
    } else {
      if (Platform.OS === "web") {
        window.alert("Hatalı e-posta veya şifre!");
      } else {
        Alert.alert("Hata", "Hatalı e-posta veya şifre!");
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          {/* Header'ı gizle */}
          <Stack.Screen options={{ headerShown: false }} />

          <View style={styles.contentContainer}>
            {/* Animasyon */}
            <LottieView
              // Dosya yolunu projenize göre kontrol edin (örn: ../../../assets/...)
              source={require("../assets/animations/Live_chatbot.json")}
              autoPlay
              loop
              style={styles.animation}
            />

            <Text style={styles.title}>AIDEM</Text>
            {/* İstenilen Alt Başlık */}
            <Text style={styles.subtitle}>
              Enerji asistanınız her zaman yanınızda
            </Text>

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

            {/* --- FOOTER ALANI --- */}
            <View style={styles.footerContainer}>
              <View style={styles.logosContainer}>
                {/* Yüklediğiniz logolar assets klasöründe olmalı */}
                <Image
                  source={require("../assets/images/aydem.png")}
                  style={styles.logo}
                  resizeMode="contain"
                />
                <Image
                  source={require("../assets/images/Manisa-celal-bayar-universitesi-logo.png")}
                  style={styles.logo} // Üniversite logosu genelde daha geniş olur
                  resizeMode="contain"
                />
                <Image
                  source={require("../assets/images/GedizInvoice.png")}
                  style={styles.logo}
                  resizeMode="contain"
                />
                <Image
                  source={require("../assets/images/1710998483471.jpg")}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.footerText}>
                Aydem ve Gediz Perakende Yenilikçi Fikirler Kampı CMD Ekibi
                Tarafından Oluşturulmuştur.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#F1F5F9",
    alignItems: "center",
  },
  contentContainer: {
    width: "100%",
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
    fontSize: 16, // Biraz küçülttük ki sığsın
    textAlign: "center",
    marginBottom: 40,
    color: "#10B981",
    fontWeight: "500",
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
  // Footer Stilleri
  footerContainer: {
    marginTop: 50,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    paddingTop: 20,
  },
  footerText: {
    fontSize: 11,
    textAlign: "center",
    color: "#64748B",
    marginBottom: 15,
    lineHeight: 16,
    fontWeight: "600",
  },
  logosContainer: {
    flexDirection: "row",
    justifyContent: "space-around", // Logoları eşit aralıkla dağıt
    alignItems: "center",
    width: "100%",
    gap: 10, // Logolar arası boşluk
  },
  logo: {
    width: 80,
    height: 40,
  },
  logoWide: {
    width: 100, // Üniversite logosu için biraz daha genişlik
    height: 45,
  },
});
