import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, router } from "expo-router";
import { Image, TouchableOpacity, View } from "react-native";

export default function RootLayout() {
  // Profil Butonu (Tıklanınca Profile sayfasına gider)
  const ProfileButton = () => (
    <TouchableOpacity
      onPress={() => router.push("/profile")}
      style={{ marginRight: 15 }}
    >
      <View
        style={{
          width: 38,
          height: 38,
          borderRadius: 19,
          borderWidth: 2,
          borderColor: "#93C5FD", // Mavi çerçevce (Siyah yerine mavi daha uyumlu olur)
          overflow: "hidden",
          backgroundColor: "#3B82F6",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&q=80",
          }}
          style={{ width: "100%", height: "100%" }}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack
        screenOptions={{
          headerBackground: () => (
            <LinearGradient
              colors={["#f97316", "#b82323ff", "#ac1962ff"]}
              style={{ flex: 1 }}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          ),

          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
          headerShadowVisible: false,
        }}
      >
        {/* 1. LOGIN EKRANI (index) - Header GİZLİ */}
        <Stack.Screen
          name="index"
          options={{
            headerShown: false, // Giriş ekranında üst bar görünmez
          }}
        />

        {/* 2. ANA SAYFA (Home) - Profil Butonu BURADA OLMALI */}
        <Stack.Screen
          name="Home"
          options={{
            title: "Ana Sayfa",
            headerRight: () => <ProfileButton />, // Butonu buraya ekledik
            headerBackVisible: false, // Geri butonunu gizle
          }}
        />

        {/* 3. DİĞER SAYFALAR */}
        <Stack.Screen name="profile" options={{ title: "Profil Bilgileri" }} />
        <Stack.Screen name="chat" options={{ title: "AIDEM Asistan" }} />

        {/* YENİ EKLENEN: Harita Ekranı */}
        <Stack.Screen
          name="map"
          options={{ title: "Akıllı Rota Planlayıcı" }}
        />
      </Stack>
    </ThemeProvider>
  );
}
