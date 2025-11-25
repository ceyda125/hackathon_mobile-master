import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  Alert,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const userName = "Ahmet";

  // Yönlendirme Fonksiyonu
  const handleNavigation = (route, isReady = true) => {
    if (isReady) {
      router.push(route);
    } else {
      Alert.alert("Bilgi", "Bu özellik çok yakında hizmetinizde!");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient
        colors={["#f8fafc", "#e2e8f0", "#cbd5e1"]}
        style={styles.gradient}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Merhaba, {userName}</Text>
              <Text style={styles.subtitle}>
                Enerji asistanınıza hoş geldiniz
              </Text>
            </View>
          </View>

          {/* Energy Summary Card */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Ionicons name="flash" size={24} color="#f0a212ff" />
              <Text style={styles.summaryTitle}>Günlük Enerji Özeti</Text>
            </View>
            <View style={styles.summaryStats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>245</Text>
                <Text style={styles.statLabel}>kWh Tüketim</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statValue, styles.statValueGreen]}>
                  -18%
                </Text>
                <Text style={styles.statLabel}>Tasarruf</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>₺124</Text>
                <Text style={styles.statLabel}>Maliyet</Text>
              </View>
            </View>
          </View>

          {/* Main Features */}
          <View style={styles.featuresContainer}>
            <Text style={styles.sectionTitle}>Hizmetlerimiz</Text>

            {/* AIDEM Chatbot Card */}
            <TouchableOpacity
              style={styles.featureCard}
              activeOpacity={0.8}
              onPress={() => handleNavigation("/chat")} // Chat Sayfasına Yönlendirme
            >
              <LinearGradient
                colors={["#f97316", "#ec8f4dff"]}
                style={styles.featureGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.featureIconContainer}>
                  <Ionicons name="chatbubbles" size={32} color="#fff" />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>AIDEM Chatbot</Text>
                  <Text style={styles.featureDescription}>
                    Yapay zeka destekli enerji asistanınız. Sorularınızı sorun,
                    öneriler alın ve enerji tüketiminizi optimize edin.
                  </Text>
                </View>
                <View style={styles.featureArrow}>
                  <Ionicons name="chevron-forward" size={24} color="#fff" />
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {/* AICITY Card */}
            <TouchableOpacity
              style={styles.featureCard}
              activeOpacity={0.8}
              onPress={() => handleNavigation(null, false)} // Henüz Hazır Değil
            >
              <LinearGradient
                colors={["#b82323ff", "#b43e3eff"]}
                style={styles.featureGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.featureIconContainer}>
                  <Ionicons name="business" size={32} color="#fff" />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>AICITY</Text>
                  <Text style={styles.featureDescription}>
                    Akıllı şehir çözümleri ile şehrinizin enerji yönetimini
                    keşfedin. Yerel verilere ulaşın ve katkıda bulunun.
                  </Text>
                </View>
                <View style={styles.featureArrow}>
                  <Ionicons name="chevron-forward" size={24} color="#fff" />
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {/* AIDEM MAP Card */}
            <TouchableOpacity
              style={styles.featureCard}
              activeOpacity={0.8}
              onPress={() => handleNavigation("/map")} // Harita Sayfasına Yönlendirme
            >
              <LinearGradient
                colors={["#ac1962ff", "#aa4075ff"]}
                style={styles.featureGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.featureIconContainer}>
                  <Ionicons name="map" size={32} color="#fff" />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>AIDEM MAP</Text>
                  <Text style={styles.featureDescription}>
                    Çevrenizdeki şarj istasyonları, enerji noktaları ve yeşil
                    alanları harita üzerinde görüntüleyin.
                  </Text>
                </View>
                <View style={styles.featureArrow}>
                  <Ionicons name="chevron-forward" size={24} color="#fff" />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActionsContainer}>
            <Text style={styles.sectionTitle}>Hızlı İşlemler</Text>
            <View style={styles.quickActionsGrid}>
              <TouchableOpacity
                style={styles.quickActionItem}
                onPress={() => Alert.alert("Bilgi", "İstatistikler yakında!")}
              >
                <View
                  style={[
                    styles.quickActionIcon,
                    { backgroundColor: "#dbeafe" },
                  ]}
                >
                  <Ionicons name="stats-chart" size={24} color="#2563eb" />
                </View>
                <Text style={styles.quickActionText}>İstatistikler</Text>
              </TouchableOpacity>

              {/* BİLDİRİMLER BUTONU - GÜNCELLENDİ: Yakında Gelecek */}
              <TouchableOpacity
                style={styles.quickActionItem}
                onPress={() => handleNavigation("/notifications")}
              >
                <View
                  style={[
                    styles.quickActionIcon,
                    { backgroundColor: "#fef3c7" },
                  ]}
                >
                  <Ionicons name="notifications" size={24} color="#f59e0b" />
                </View>
                <Text style={styles.quickActionText}>Bildirimler</Text>
              </TouchableOpacity>

              {/* KARBON İZİ BUTONU - GÜNCELLENDİ: Yakında Gelecek */}
              <TouchableOpacity
                style={styles.quickActionItem}
                onPress={() => handleNavigation("/carbon")}
              >
                <View
                  style={[
                    styles.quickActionIcon,
                    { backgroundColor: "#dcfce7" },
                  ]}
                >
                  <Ionicons name="leaf" size={24} color="#16a34a" />
                </View>
                <Text style={styles.quickActionText}>Karbon İzi</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickActionItem}
                onPress={() => Alert.alert("Bilgi", "Ayarlar yakında!")}
              >
                <View
                  style={[
                    styles.quickActionIcon,
                    { backgroundColor: "#f3e8ff" },
                  ]}
                >
                  <Ionicons name="settings" size={24} color="#9333ea" />
                </View>
                <Text style={styles.quickActionText}>Ayarlar</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Tips Card */}
          <View style={styles.tipsCard}>
            <View style={styles.tipsHeader}>
              <Ionicons name="bulb" size={20} color="#f59e0b" />
              <Text style={styles.tipsTitle}>Günün İpucu</Text>
            </View>
            <Text style={styles.tipsText}>
              Elektrikli araçlarınızı gece saatlerinde şarj ederek %30'a varan
              enerji tasarrufu sağlayabilirsiniz.
            </Text>
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 10,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
  },
  profileButton: {
    padding: 4,
  },
  summaryCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  summaryStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000000ff",
    marginBottom: 4,
  },
  statValueGreen: {
    color: "#16a34a",
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#e5e7eb",
  },
  featuresContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 16,
  },
  featureCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  featureGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    minHeight: 120,
  },
  featureIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
    marginRight: 12,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 6,
  },
  featureDescription: {
    fontSize: 13,
    color: "#fff",
    opacity: 0.9,
    lineHeight: 18,
  },
  featureArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  quickActionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
  },
  quickActionItem: {
    width: (width - 64) / 4,
    alignItems: "center",
    gap: 8,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  quickActionText: {
    fontSize: 11,
    color: "#475569",
    textAlign: "center",
    fontWeight: "600",
  },
  tipsCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#f59e0b",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  tipsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  tipsText: {
    fontSize: 13,
    color: "#4b5563",
    lineHeight: 18,
  },
  bottomSpacer: {
    height: 20,
  },
});
