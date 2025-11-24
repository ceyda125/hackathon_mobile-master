import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
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

// --- AYARLAR ---
// Emülatör kullanıyorsan (Android): 'http://10.0.2.2:5000/ask'
// iOS Simülatör kullanıyorsan: 'http://localhost:5000/ask'
// Gerçek telefon kullanıyorsan: Bilgisayarının IP adresi (örn: 'http://192.168.1.35:5000/ask')
const API_URL = "http://10.83.243.221:5000/ask";

// Renkleri buraya koydum, istersen ayrı dosyadan çekebilirsin
const COLORS = {
  primary: "#2563EB",
  background: "#F3F4F6",
  white: "#FFFFFF",
  gray: "#9CA3AF",
  userBubble: "#2563EB",
  botBubble: "#E5E7EB",
  textUser: "#FFFFFF",
  textBot: "#1F2937",
};

const ChatScreen = () => {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "Merhaba! Ben EIDEM Enerji Asistanı. Size nasıl yardımcı olabilirim?",
      sender: "bot",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // Otomatik scroll için referans
  const flatListRef = useRef(null);

  // --- MESAJ GÖNDERME VE API BAĞLANTISI ---
  const handleSend = async () => {
    if (inputText.trim().length === 0) return;

    const userMessageText = inputText;
    const timestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    // 1. Kullanıcı mesajını ekrana bas
    const userMessage = {
      id: Date.now().toString(),
      text: userMessageText,
      sender: "user",
      time: timestamp,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      // 2. Python Backend'e İstek At (Fetch API)
      console.log("İstek gönderiliyor:", API_URL);

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Flask tarafında: data['question'] olarak bekliyoruz
        body: JSON.stringify({ question: userMessageText }),
      });

      const data = await response.json();

      // Backend'den hata dönerse
      if (data.error) {
        throw new Error(data.error);
      }

      // 3. Botun Cevabını Ekrana Bas
      const botResponse = {
        id: (Date.now() + 1).toString(),
        text: data.answer, // Flask tarafında: {"answer": "..."} dönüyor
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
        text: "Üzgünüm, şu an sunucuya bağlanamıyorum. Lütfen internet bağlantınızı veya sunucuyu kontrol edin.",
        sender: "bot",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, errorMessage]);

      // Hata detayı için alert (geliştirme aşamasında faydalı)
      // Alert.alert("Hata", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Yeni mesaj gelince en alta kaydır
  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  // --- GÖRÜNÜM ---
  const renderMessageItem = ({ item }) => {
    const isUser = item.sender === "user";
    return (
      <View
        style={[styles.messageRow, isUser ? styles.rowRight : styles.rowLeft]}
      >
        <View
          style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleBot]}
        >
          <Text style={isUser ? styles.textUser : styles.textBot}>
            {item.text}
          </Text>
          <Text
            style={[
              styles.timeText,
              isUser ? styles.timeTextUser : styles.timeTextBot,
            ]}
          >
            {item.time}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>EIDEM Asistan</Text>
        <View
          style={[
            styles.onlineIndicator,
            isLoading
              ? { backgroundColor: "#F59E0B" }
              : { backgroundColor: "#10B981" },
          ]}
        />
      </View>

      {/* Mesaj Listesi */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        keyboardDismissMode="on-drag"
      />

      {/* Input Alanı */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
        style={styles.inputWrapper}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Sorunuzu buraya yazın..."
            placeholderTextColor={COLORS.gray}
            multiline
            editable={!isLoading} // Yüklenirken yazmayı engelle (isteğe bağlı)
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (inputText.length === 0 || isLoading) &&
                styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={isLoading || inputText.length === 0}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <Text style={styles.sendButtonText}>Gönder</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// --- STİLLER ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    height: 60,
    backgroundColor: COLORS.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    elevation: 2,
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#1F2937" },
  onlineIndicator: { width: 10, height: 10, borderRadius: 5, marginLeft: 8 },
  listContent: { padding: 16, paddingBottom: 20 },
  messageRow: { marginVertical: 4, flexDirection: "row", width: "100%" },
  rowRight: { justifyContent: "flex-end" },
  rowLeft: { justifyContent: "flex-start" },
  bubble: { maxWidth: "80%", padding: 12, borderRadius: 16 },
  bubbleUser: {
    backgroundColor: COLORS.userBubble,
    borderBottomRightRadius: 2,
  },
  bubbleBot: { backgroundColor: COLORS.botBubble, borderBottomLeftRadius: 2 },
  textUser: { color: COLORS.textUser, fontSize: 16 },
  textBot: { color: COLORS.textBot, fontSize: 16 },
  timeText: { fontSize: 10, marginTop: 4, alignSelf: "flex-end" },
  timeTextUser: { color: "rgba(255,255,255,0.7)" },
  timeTextBot: { color: "rgba(0,0,0,0.5)" },
  inputWrapper: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  inputContainer: { flexDirection: "row", padding: 12, alignItems: "flex-end" },
  textInput: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: "#000",
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  sendButtonDisabled: { backgroundColor: COLORS.gray },
  sendButtonText: { color: COLORS.white, fontWeight: "bold", fontSize: 12 },
});

export default ChatScreen;
