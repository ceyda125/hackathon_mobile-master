import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// API URL (Bilgisayarınızın IP adresini kontrol edin)
const API_URL = "http://10.83.243.221:5000/ask";

export default function ChatScreen() {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "Merhaba! Ben AIDEM Enerji Asistanı. Size nasıl yardımcı olabilirim? ⚡",
      sender: "bot",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const flatListRef = useRef(null);

  // Mesajlar değiştiğinde en alta kaydır
  useEffect(() => {
    if (flatListRef.current) {
      setTimeout(() => {
        flatListRef.current.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (inputText.trim().length === 0) return;

    const userMessageText = inputText;
    const timestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    // 1. Kullanıcı mesajını ekle
    const userMessage = {
      id: Date.now().toString(),
      text: userMessageText,
      sender: "user",
      time: timestamp,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);
    Keyboard.dismiss(); // İsteğe bağlı: Gönderince klavyeyi kapatma

    try {
      console.log("İstek gönderiliyor:", API_URL);

      // 2. API İsteği
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: userMessageText }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // 3. Bot cevabını ekle
      const botResponse = {
        id: (Date.now() + 1).toString(),
        text: data.answer,
        sender: "bot",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("API Hatası:", error);

      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: "Üzgünüm, şu an sunucuya bağlanamıyorum. Lütfen internet bağlantınızı kontrol edin. 🔌",
        sender: "bot",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Her bir mesaj balonu tasarımı
  const renderItem = ({ item }) => {
    const isUser = item.sender === "user";
    return (
      <View
        style={[
          styles.messageRow,
          isUser ? styles.messageRowUser : styles.messageRowBot,
        ]}
      >
        {/* Bot Avatarı (Sadece Bot mesajlarında) */}
        {!isUser && (
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>AI</Text>
          </View>
        )}

        {/* Mesaj Balonu */}
        <View
          style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleBot]}
        >
          <Text
            style={[
              styles.messageText,
              isUser ? styles.textUser : styles.textBot,
            ]}
          >
            {item.text}
          </Text>
          <Text
            style={[styles.timeText, isUser ? styles.timeUser : styles.timeBot]}
          >
            {item.time}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* --- HEADER --- */}
      <LinearGradient
        colors={["#2563EB", "#1d4ed8"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerAvatar}>
            <Text style={styles.headerAvatarText}>AI</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>AIDEM Asistan</Text>
            <View style={styles.statusContainer}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: isLoading ? "#F59E0B" : "#10B981" },
                ]}
              />
              <Text style={styles.statusText}>
                {isLoading ? "Yazıyor..." : "Çevrimiçi"}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* --- MESAJ LİSTESİ --- */}
      <View style={styles.chatContainer}>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          // Yükleniyor animasyonu (Listenin sonunda)
          ListFooterComponent={
            isLoading && (
              <View style={styles.loadingContainer}>
                <View style={styles.avatarContainer}>
                  <Text style={styles.avatarText}>AI</Text>
                </View>
                <View style={styles.bubbleBot}>
                  <ActivityIndicator size="small" color="#2563EB" />
                </View>
              </View>
            )
          }
        />
      </View>

      {/* --- INPUT ALANI --- */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Sorunuzu buraya yazın..."
            placeholderTextColor="#94a3b8"
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!inputText.trim() || isLoading) && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={!inputText.trim() || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="send" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F5F9",
  },
  // Header Stilleri
  header: {
    paddingTop: Platform.OS === "android" ? 40 : 10, // Android status bar payı
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
    zIndex: 10,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  headerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerAvatarText: {
    color: "#2563EB",
    fontWeight: "bold",
    fontSize: 18,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 12,
  },

  // Chat Alanı Stilleri
  chatContainer: {
    flex: 1,
    backgroundColor: "#F1F5F9",
  },
  listContent: {
    padding: 20,
    paddingBottom: 10,
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 16,
  },
  messageRowUser: {
    justifyContent: "flex-end",
  },
  messageRowBot: {
    justifyContent: "flex-start",
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  avatarText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  bubble: {
    maxWidth: "75%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  bubbleUser: {
    backgroundColor: "#2563EB",
    borderBottomRightRadius: 4,
  },
  bubbleBot: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  textUser: {
    color: "#fff",
  },
  textBot: {
    color: "#1F2937",
  },
  timeText: {
    fontSize: 10,
    marginTop: 4,
    textAlign: "right",
  },
  timeUser: {
    color: "rgba(255,255,255,0.7)",
  },
  timeBot: {
    color: "rgba(0,0,0,0.4)",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  // Input Alanı Stilleri
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  input: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    color: "#000",
    maxHeight: 100, // Çok satırlı olursa uzamasın
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  sendButtonDisabled: {
    backgroundColor: "#94a3b8",
    shadowOpacity: 0,
    elevation: 0,
  },
});
