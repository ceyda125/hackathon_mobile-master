import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function CarbonFootprintScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        {/* Geri Dön Butonu */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#059669" />
          <Text style={styles.backText}>Geri Dön</Text>
        </TouchableOpacity>

        {/* Üst Bilgi Kartı - Gradient */}
        <LinearGradient
          colors={["#059669", "#34d399"]}
          style={styles.headerCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.headerTitle}>Aylık Karbon Ayak İzi</Text>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreValue}>124</Text>
            <Text style={styles.scoreUnit}>kg CO2</Text>
          </View>
          <View style={styles.badgeContainer}>
            <Ionicons name="leaf" size={20} color="#fff" />
            <Text style={styles.badgeText}>
              Ortalamanın %15 Altında! Harika!
            </Text>
          </View>
        </LinearGradient>

        {/* İstatistikler */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="flower" size={28} color="#16a34a" />
            <Text style={styles.statValue}>3.5</Text>
            <Text style={styles.statLabel}>Ağaç Kurtarıldı</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="car-sport" size={28} color="#ef4444" />
            <Text style={styles.statValue}>450</Text>
            <Text style={styles.statLabel}>km Sürüşe Eşit</Text>
          </View>
        </View>

        {/* İpuçları Bölümü */}
        <Text style={styles.sectionTitle}>Karbon İzini Azalt</Text>

        <View style={styles.tipCard}>
          <View style={[styles.tipIcon, { backgroundColor: "#fef3c7" }]}>
            <Ionicons name="sunny" size={24} color="#d97706" />
          </View>
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Güneş Enerjisi Kullanın</Text>
            <Text style={styles.tipDesc}>
              Gündüz saatlerinde tüketimi artırarak yenilenebilir enerji
              kullanımını destekleyin.
            </Text>
          </View>
        </View>

        <View style={styles.tipCard}>
          <View style={[styles.tipIcon, { backgroundColor: "#dbeafe" }]}>
            <Ionicons name="thermometer" size={24} color="#2563eb" />
          </View>
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Isıtmayı Düşürün</Text>
            <Text style={styles.tipDesc}>
              Termostatı sadece 1 derece kısmak, yıllık %10 enerji tasarrufu
              sağlar.
            </Text>
          </View>
        </View>

        <View style={styles.tipCard}>
          <View style={[styles.tipIcon, { backgroundColor: "#fce7f3" }]}>
            <Ionicons name="shirt" size={24} color="#db2777" />
          </View>
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Çamaşırları Soğuk Yıkayın</Text>
            <Text style={styles.tipDesc}>
              30 derecede yıkama yapmak karbon salınımını önemli ölçüde azaltır.
            </Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0fdf4",
  },
  content: {
    padding: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  backText: {
    fontSize: 16,
    color: "#059669",
    marginLeft: 5,
    fontWeight: "600",
  },
  headerCard: {
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#059669",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  headerTitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 16,
  },
  scoreValue: {
    fontSize: 56,
    fontWeight: "800",
    color: "#fff",
    lineHeight: 60,
  },
  scoreUnit: {
    fontSize: 20,
    color: "rgba(255,255,255,0.9)",
    marginBottom: 10,
    marginLeft: 6,
    fontWeight: "600",
  },
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    color: "#fff",
    fontSize: 13,
    marginLeft: 6,
    fontWeight: "600",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: "#fff",
    width: (width - 50) / 2,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#dcfce7",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1e293b",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#64748b",
    textAlign: "center",
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 16,
  },
  tipCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  tipIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 4,
  },
  tipDesc: {
    fontSize: 13,
    color: "#64748b",
    lineHeight: 18,
  },
});
