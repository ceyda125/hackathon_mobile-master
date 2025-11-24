import { Ionicons } from "@expo/vector-icons"; // Mobilde standart ikon kütüphanesi
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function NotificationsScreen() {
  const notifications = [
    {
      id: 1,
      type: "alert",
      title: "Yüksek Tüketim Uyarısı",
      message:
        "Klimanız son 2 saatte normalden %40 daha fazla enerji tüketti. Kontrol etmek ister misiniz?",
      time: "15 dk önce",
      read: false,
    },
    {
      id: 2,
      type: "success",
      title: "Fatura Ödendi",
      message: "Eylül ayı elektrik faturanız başarıyla ödendi. Teşekkürler!",
      time: "2 saat önce",
      read: true,
    },
    {
      id: 3,
      type: "info",
      title: "Planlı Bakım Çalışması",
      message:
        "Yarın 10:00 - 12:00 saatleri arasında bölgenizde bakım çalışması yapılacaktır.",
      time: "1 gün önce",
      read: true,
    },
    {
      id: 4,
      type: "info",
      title: "Yeni İpucu",
      message:
        "Buzdolabınızın derecesini 1 derece artırarak %5 tasarruf sağlayabilirsiniz.",
      time: "2 gün önce",
      read: true,
    },
  ];

  const getIcon = (type) => {
    switch (type) {
      // İkonlar Ionicons kütüphanesinden seçildi
      case "alert":
        return { name: "warning", color: "#ef4444", bg: "#fee2e2" };
      case "success":
        return { name: "checkmark-circle", color: "#22c55e", bg: "#dcfce7" };
      case "info":
        return { name: "information-circle", color: "#3b82f6", bg: "#dbeafe" };
      default:
        return { name: "notifications", color: "#64748b", bg: "#f1f5f9" };
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Bildirimler</Text>
          <TouchableOpacity>
            <Text style={styles.markAllRead}>Tümünü Okundu İşaretle</Text>
          </TouchableOpacity>
        </View>

        {notifications.map((item) => {
          const iconData = getIcon(item.type);
          return (
            <View
              key={item.id}
              style={[styles.notificationCard, !item.read && styles.unreadCard]}
            >
              <View
                style={[styles.iconContainer, { backgroundColor: iconData.bg }]}
              >
                <Ionicons
                  name={iconData.name}
                  size={24}
                  color={iconData.color}
                />
              </View>
              <View style={styles.textContainer}>
                <View style={styles.titleRow}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.time}>{item.time}</Text>
                </View>
                <Text style={styles.message}>{item.message}</Text>
              </View>
              {!item.read && <View style={styles.dot} />}
            </View>
          );
        })}

        {notifications.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="notifications-off-outline"
              size={64}
              color="#cbd5e1"
            />
            <Text style={styles.emptyText}>Hiç yeni bildiriminiz yok.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
  },
  markAllRead: {
    color: "#3b82f6",
    fontSize: 14,
    fontWeight: "600",
  },
  notificationCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  unreadCard: {
    backgroundColor: "#f0f9ff",
    borderColor: "#bae6fd",
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#334155",
    flex: 1,
  },
  time: {
    fontSize: 12,
    color: "#94a3b8",
    marginLeft: 8,
  },
  message: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#3b82f6",
    position: "absolute",
    top: 16,
    right: 16,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 100,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: "#94a3b8",
  },
});
