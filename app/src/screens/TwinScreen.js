import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Platform,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  StatusBar
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

const { width, height } = Dimensions.get("window");

// --- 1. AYARLAR ---
// Server.py'ı çalıştırdığınız bilgisayarın Yerel IP adresini buraya yazın.
// Not: Telefonunuz ve Bilgisayarınız aynı Wi-Fi ağında olmalı.
const API_URL = "http://172.20.10.4:5000";

// Koordinat Haritası
const LOCATION_MAPPING = {
  "Kadıköy": { lat: 40.9818, lng: 29.0576 },
  "Beşiktaş": { lat: 41.0422, lng: 29.0067 },
  "Çankaya": { lat: 39.9208, lng: 32.8541 },
  "Bornova": { lat: 38.4622, lng: 27.2163 },
  "Nilüfer": { lat: 40.2206, lng: 28.9642 },
};

export default function DigitalTwinScreen() {
  const mapRef = useRef(null);
  const [houses, setHouses] = useState([]);
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [houseDetails, setHouseDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // --- 2. VERİ ÇEKME DÖNGÜSÜ ---
  // Canlı takip hissi vermek için her 5 saniyede bir verileri yenileyebiliriz
  useEffect(() => {
    fetchHouses();
    const interval = setInterval(fetchHouses, 10000); // 10 saniyede bir ana haritayı güncelle
    return () => clearInterval(interval);
  }, []);

  // Eğer bir ev seçiliyse, onun detaylarını da periyodik güncelle
  useEffect(() => {
    let interval;
    if (selectedHouse) {
      fetchHouseDetails(selectedHouse.id, false); // İlk yükleme (loading göstermeden)
      interval = setInterval(() => {
        fetchHouseDetails(selectedHouse.id, false);
      }, 3000); // Detayları 3 saniyede bir güncelle (Canlı Watt değişimi için)
    }
    return () => clearInterval(interval);
  }, [selectedHouse]);


  const fetchHouses = async () => {
    try {
      if(!selectedHouse) setLoading(true); // Sadece ilk açılışta loading göster
      const response = await axios.get(`${API_URL}/api/digital-twin`);
      setHouses(response.data);
    } catch (error) {
      console.log("Veri çekme hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHouseDetails = async (id, showLoading = true) => {
    if (showLoading) setDetailsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/details/${id}`);
      setHouseDetails(response.data);
    } catch (error) {
      console.log("Detay hatası:", error);
    } finally {
      if (showLoading) setDetailsLoading(false);
    }
  };

  const handleMarkerPress = (house) => {
    setSelectedHouse(house);
    setHouseDetails(null);
    fetchHouseDetails(house.id, true);
  };

  const closePanel = () => {
    setSelectedHouse(null);
    setHouseDetails(null);
  };

  // --- 3. RENK VE DURUM FONKSİYONLARI ---
  const getScoreColor = (score) => {
    if (score >= 80) return "#28a745"; // Yeşil
    if (score >= 50) return "#ffc107"; // Sarı
    return "#dc3545"; // Kırmızı
  };

  const renderThermostat = (data) => {
    if (!data) return null;
    const isHeating = data.durum.includes("Isıtıyor");
    const isCooling = data.durum.includes("Soğutuyor");

    return (
      <View style={styles.thermostatCard}>
        <View style={styles.thermostatHeader}>
            <Text style={styles.cardTitle}>🌡️ Akıllı Termostat</Text>
            <View style={styles.liveBadge}><Text style={styles.liveText}>CANLI</Text></View>
        </View>

        <View style={styles.thermostatRow}>
          <View style={styles.tempBox}>
            <Text style={styles.tempLabel}>Dışarı</Text>
            <Text style={styles.tempValue}>{data.dis_hava}°</Text>
            <Text style={styles.tempDesc}>Manisa</Text>
          </View>

          <View style={styles.actionBox}>
            <Ionicons
                name={isHeating ? "flame" : isCooling ? "snow" : "leaf"}
                size={36}
                color={isHeating ? "#fd7e14" : isCooling ? "#0d6efd" : "#198754"}
            />
            <Text style={{fontWeight:'bold', marginTop: 5, color: '#555'}}>
                {data.durum}
            </Text>
          </View>

          <View style={styles.tempBox}>
            <Text style={styles.tempLabel}>Hedef</Text>
            <Text style={styles.tempValue}>{data.hedef}°</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* --- HARİTA --- */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 39.5,
          longitude: 28.0,
          latitudeDelta: 5.0,
          longitudeDelta: 5.0,
        }}
      >
        {houses.map((house, index) => {
          const coords = LOCATION_MAPPING[house.adres];
          if (!coords) return null;
          // Hafif rastgelelik (markerlar üst üste binmesin)
          const jitterLat = coords.lat + (Math.random() * 0.005);
          const jitterLng = coords.lng + (Math.random() * 0.005);

          return (
            <Marker
              key={index}
              coordinate={{ latitude: jitterLat, longitude: jitterLng }}
              onPress={() => handleMarkerPress(house)}
            >
                {/* Marker Tasarımı */}
                <View style={styles.markerContainer}>
                    <View style={[styles.markerBadge, { backgroundColor: getScoreColor(house.score) }]}>
                        <Text style={styles.markerText}>{house.score}</Text>
                    </View>
                    <View style={[styles.markerArrow, { borderTopColor: getScoreColor(house.score) }]} />
                </View>
            </Marker>
          );
        })}
      </MapView>

      {/* --- ÜST BİLGİ KARTI --- */}
      <SafeAreaView style={styles.topCardContainer}>
        <View style={styles.topCard}>
          <View>
            <Text style={styles.topCardTitle}>Türkan Doğa Evleri</Text>
            <Text style={styles.topCardSubtitle}>
                {loading ? "📡 Sunucuya bağlanılıyor..." : `🟢 ${houses.length} hane canlı izleniyor`}
            </Text>
          </View>
          <TouchableOpacity onPress={fetchHouses} style={styles.refreshBtn}>
             <Ionicons name="refresh" size={20} color="#007bff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* --- ALT PANEL (DETAYLAR) --- */}
      {selectedHouse && (
        <View style={styles.bottomPanel}>
          <View style={styles.panelHeader}>
            <View>
                <Text style={styles.panelTitle}>{selectedHouse.isim} {selectedHouse.soyisim}</Text>
                <Text style={styles.panelSubtitle}>
                    {selectedHouse.adres} • Anlık Güç:
                    <Text style={{fontWeight: 'bold', color: '#007bff'}}> {selectedHouse.anlik_tuketim_watt} W</Text>
                </Text>
            </View>
            <TouchableOpacity onPress={closePanel} style={styles.closeBtn}>
                <Ionicons name="close" size={26} color="#444" />
            </TouchableOpacity>
          </View>

          {detailsLoading && !houseDetails ? (
            <ActivityIndicator size="large" color="#007bff" style={{marginTop: 50}} />
          ) : (
            <ScrollView style={styles.detailsScroll} showsVerticalScrollIndicator={false}>

                {/* 1. Termostat */}
                {houseDetails && renderThermostat(houseDetails[0])}

                {/* 2. Cihaz Listesi */}
                <Text style={styles.sectionHeader}>⚡ Anlık Cihaz Durumları</Text>

                {houseDetails && houseDetails.slice(1).map((device, idx) => {
                    const isRunning = device.calisiyor_mu;
                    return (
                        <View key={idx} style={styles.deviceRow}>
                            {/* Sol Taraf: İkon ve İsim */}
                            <View style={{flexDirection:'row', alignItems:'center'}}>
                                <View style={[styles.statusDot, { backgroundColor: isRunning ? '#28a745' : '#e9ecef' }]} />
                                <View style={{marginLeft: 10}}>
                                    <Text style={styles.deviceName}>{device.tur}</Text>
                                    <Text style={styles.deviceBrand}>{device.marka}</Text>
                                </View>
                            </View>

                            {/* Sağ Taraf: Tüketim Değeri */}
                            <View style={{alignItems: 'flex-end'}}>
                                {isRunning ? (
                                    <>
                                        <Text style={styles.wattText}>{device.anlik_tuketim} W</Text>
                                        <Text style={styles.runningText}>ÇALIŞIYOR</Text>
                                    </>
                                ) : (
                                    <Text style={styles.stoppedText}>BEKLEMEDE</Text>
                                )}
                            </View>
                        </View>
                    );
                })}
                <View style={{height: 60}} />
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f2f5" },
  map: { width: width, height: height },

  // Marker Styles
  markerContainer: { alignItems: 'center' },
  markerBadge: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: '#fff',
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 5,
  },
  markerText: { color: 'white', fontWeight: 'bold', fontSize: 13 },
  markerArrow: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 0,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopWidth: 8,
    marginTop: -1
  },

  // Top Card
  topCardContainer: { position: 'absolute', top: 10, width: '100%', alignItems: 'center' },
  topCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 15,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  topCardTitle: { fontSize: 18, fontWeight: '800', color: '#1a1a1a' },
  topCardSubtitle: { fontSize: 13, color: '#666', marginTop: 3 },
  refreshBtn: { padding: 8, backgroundColor: '#eef2ff', borderRadius: 50 },

  // Bottom Panel
  bottomPanel: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '60%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 25,
    padding: 24,
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 15
  },
  panelTitle: { fontSize: 22, fontWeight: '800', color: '#212529' },
  panelSubtitle: { fontSize: 14, color: '#6c757d', marginTop: 4 },
  closeBtn: { padding: 8, backgroundColor: '#f8f9fa', borderRadius: 50 },
  detailsScroll: { flex: 1 },

  // Termostat
  thermostatCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2
  },
  thermostatHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  cardTitle: { fontWeight: '700', fontSize: 16, color: '#343a40' },
  liveBadge: { backgroundColor: '#ffecec', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  liveText: { color: '#dc3545', fontSize: 10, fontWeight: '800' },
  thermostatRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tempBox: { alignItems: 'center' },
  tempLabel: { fontSize: 12, color: '#adb5bd', fontWeight: '600' },
  tempValue: { fontSize: 24, fontWeight: '800', color: '#212529' },
  tempDesc: { fontSize: 10, color: '#495057' },
  actionBox: { alignItems: 'center', flex: 1 },

  // Cihaz Listesi
  sectionHeader: { fontSize: 16, fontWeight: '700', marginBottom: 15, color: '#343a40' },
  deviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa'
  },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  deviceName: { fontSize: 15, fontWeight: '600', color: '#212529' },
  deviceBrand: { fontSize: 12, color: '#adb5bd' },
  wattText: { fontSize: 16, fontWeight: '700', color: '#0d6efd' },
  runningText: { fontSize: 10, fontWeight: 'bold', color: '#28a745', marginTop: 2, textAlign: 'right' },
  stoppedText: { fontSize: 11, fontWeight: '600', color: '#adb5bd' }
});