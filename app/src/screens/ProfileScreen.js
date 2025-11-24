import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router"; // Yönlendirme için gerekli kütüphane
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileScreen() {
  // Mock kullanıcı verileri
  const userData = {
    name: "Türkan Doğa Durak",
    phone: "+90 532 123 45 67",
    email: "ahmet.yilmaz@example.com",
    memberSince: "15 Mart 2024",
    location: "İstanbul, Türkiye",
    profileImage:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    energySavings: 23.5,
  };

  const vehicleData = {
    model: "Tesla Model 3",
    year: "2023",
    energyUsage: "342 kWh / ay",
    efficiency: "Yüksek",
  };

  const homeData = {
    type: "Daire",
    size: "120 m²",
    energyUsage: "485 kWh / ay",
    solarPanel: "Var (5 kW)",
  };

  const blockchainData = {
    wallet: "0x742d...4e9f",
    tokens: "1,250 ECO",
    transactions: "47",
    lastActivity: "2 saat önce",
  };

  const handleLogout = () => {
    // Çıkış yapıldığında giriş ekranına (index) yönlendir
    // replace kullanıyoruz ki geri tuşuna basınca tekrar profile dönmesin
    router.replace("/");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Profil Kartı */}
        <View style={styles.profileCard}>
          {/* Profil Fotosu */}
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: userData.profileImage }}
              style={styles.profileImage}
            />
          </View>
          <Text style={styles.userName}>{userData.name}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Aktif Üye</Text>
          </View>

          {/* Kullanıcı Bilgileri */}
          <View style={styles.userInfoContainer}>
            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={20} color="#2563eb" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Telefon</Text>
                <Text style={styles.infoValue}>{userData.phone}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="mail-outline" size={20} color="#2563eb" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>E-posta</Text>
                <Text style={styles.infoValue}>{userData.email}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={20} color="#2563eb" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Üyelik Tarihi</Text>
                <Text style={styles.infoValue}>{userData.memberSince}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={20} color="#2563eb" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Konum</Text>
                <Text style={styles.infoValue}>{userData.location}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Enerji Özeti */}
        <View style={styles.energyCard}>
          <View style={styles.energyHeader}>
            <Ionicons name="flash" size={24} color="#16a34a" />
            <Text style={styles.energyTitle}>Enerji Özeti</Text>
          </View>
          <View style={styles.energyContent}>
            <Ionicons name="trending-down" size={32} color="#16a34a" />
            <View style={styles.energyStats}>
              <Text style={styles.energyPercentage}>
                %{userData.energySavings}
              </Text>
              <Text style={styles.energyLabel}>Enerji Tasarrufu</Text>
            </View>
          </View>
          <Text style={styles.energySubtext}>
            Son 30 günde ortalamanın altında tüketim
          </Text>
        </View>

        {/* Modüller */}
        <View style={styles.modulesContainer}>
          {/* Araç Bilgileri */}
          <View style={styles.moduleCard}>
            <View style={styles.moduleHeader}>
              <Ionicons name="car-outline" size={20} color="#2563eb" />
              <Text style={styles.moduleTitle}>Araç Bilgileri</Text>
            </View>
            <View style={styles.moduleContent}>
              <View style={styles.moduleItem}>
                <Text style={styles.moduleLabel}>Model</Text>
                <Text style={styles.moduleValue}>{vehicleData.model}</Text>
              </View>
              <View style={styles.moduleItem}>
                <Text style={styles.moduleLabel}>Yıl</Text>
                <Text style={styles.moduleValue}>{vehicleData.year}</Text>
              </View>
              <View style={styles.moduleItem}>
                <Text style={styles.moduleLabel}>Tüketim</Text>
                <Text style={styles.moduleValue}>
                  {vehicleData.energyUsage}
                </Text>
              </View>
              <View style={styles.moduleItem}>
                <Text style={styles.moduleLabel}>Verimlilik</Text>
                <View style={styles.moduleBadge}>
                  <Text style={styles.moduleBadgeText}>
                    {vehicleData.efficiency}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Ev Bilgileri */}
          <View style={styles.moduleCard}>
            <View style={styles.moduleHeader}>
              <Ionicons name="home-outline" size={20} color="#ea580c" />
              <Text style={styles.moduleTitle}>Ev Bilgileri</Text>
            </View>
            <View style={styles.moduleContent}>
              <View style={styles.moduleItem}>
                <Text style={styles.moduleLabel}>Tip</Text>
                <Text style={styles.moduleValue}>{homeData.type}</Text>
              </View>
              <View style={styles.moduleItem}>
                <Text style={styles.moduleLabel}>Büyüklük</Text>
                <Text style={styles.moduleValue}>{homeData.size}</Text>
              </View>
              <View style={styles.moduleItem}>
                <Text style={styles.moduleLabel}>Tüketim</Text>
                <Text style={styles.moduleValue}>{homeData.energyUsage}</Text>
              </View>
              <View style={styles.moduleItem}>
                <Text style={styles.moduleLabel}>Güneş Paneli</Text>
                <View style={[styles.moduleBadge, styles.moduleBadgeYellow]}>
                  <Text style={styles.moduleBadgeTextYellow}>
                    {homeData.solarPanel}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Blockchain Bilgileri */}
          <View style={styles.moduleCard}>
            <View style={styles.moduleHeader}>
              <Ionicons name="link-outline" size={20} color="#9333ea" />
              <Text style={styles.moduleTitle}>Blockchain Bilgileri</Text>
            </View>
            <View style={styles.moduleContent}>
              <View style={styles.moduleItem}>
                <Text style={styles.moduleLabel}>Cüzdan</Text>
                <Text style={[styles.moduleValue, styles.monoText]}>
                  {blockchainData.wallet}
                </Text>
              </View>
              <View style={styles.moduleItem}>
                <Text style={styles.moduleLabel}>Token</Text>
                <Text style={styles.moduleValue}>{blockchainData.tokens}</Text>
              </View>
              <View style={styles.moduleItem}>
                <Text style={styles.moduleLabel}>İşlemler</Text>
                <Text style={styles.moduleValue}>
                  {blockchainData.transactions}
                </Text>
              </View>
              <View style={styles.moduleItem}>
                <Text style={styles.moduleLabel}>Son Aktivite</Text>
                <Text style={styles.moduleValue}>
                  {blockchainData.lastActivity}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Çıkış Yap Butonu */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutButtonText}>Çıkış Yap</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f9ff",
  },
  scrollView: {
    flex: 1,
  },
  profileCard: {
    backgroundColor: "#fff",
    margin: 16,
    marginTop: 24,
    padding: 24,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  profileImageContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#e5e7eb",
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
    color: "#111827",
  },
  badge: {
    alignSelf: "center",
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 24,
  },
  badgeText: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "600",
  },
  userInfoContainer: {
    gap: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    padding: 12,
    borderRadius: 8,
    gap: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
  },
  energyCard: {
    backgroundColor: "#f0fdf4",
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#bbf7d0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  energyHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  energyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  energyContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginBottom: 12,
  },
  energyStats: {
    alignItems: "center",
  },
  energyPercentage: {
    fontSize: 36,
    fontWeight: "700",
    color: "#16a34a",
  },
  energyLabel: {
    fontSize: 14,
    color: "#4b5563",
  },
  energySubtext: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 8,
  },
  modulesContainer: {
    paddingHorizontal: 16,
    gap: 16,
  },
  moduleCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  moduleHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  moduleContent: {
    gap: 12,
  },
  moduleItem: {
    gap: 4,
  },
  moduleLabel: {
    fontSize: 12,
    color: "#6b7280",
  },
  moduleValue: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
  },
  monoText: {
    fontFamily: "monospace",
    fontSize: 12,
  },
  moduleBadge: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#16a34a",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  moduleBadgeText: {
    fontSize: 12,
    color: "#16a34a",
    fontWeight: "600",
  },
  moduleBadgeYellow: {
    borderColor: "#ca8a04",
  },
  moduleBadgeTextYellow: {
    fontSize: 12,
    color: "#ca8a04",
    fontWeight: "600",
  },
  logoutButton: {
    backgroundColor: "#dc2626",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: 16,
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  bottomSpacer: {
    height: 32,
  },
});
