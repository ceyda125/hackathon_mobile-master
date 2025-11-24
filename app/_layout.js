import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";

// HATA NEDENİ: Aşağıdaki unstable_settings kısmını SİLDİK.
// Çünkü artık (tabs) diye bir klasörümüz yok.

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      {/* screenOptions={{ headerShown: false }} diyerek tüm sayfalarda üstteki barı gizledik */}
      <Stack screenOptions={{ headerShown: false }}>
        {/* Giriş Ekranı (Login) */}
        <Stack.Screen name="index" />

        {/* Ana Ekran (Home) */}
        <Stack.Screen name="homescreen" />

        {/* Eğer modal kullanmayacaksan burayı da silebilirsin, şimdilik hata vermesin diye bıraktım */}
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />

        {/* ARTIK BURADA <Stack.Screen name="(tabs)" ... /> YOK */}
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
