import Slider from "@react-native-community/slider";
import axios from "axios";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// --- PLATFORM KONTROLLÜ IMPORT ---
let MapView, Marker, Polyline, Callout;

if (Platform.OS !== "web") {
  try {
    const Maps = require("react-native-maps");
    MapView = Maps.default;
    Marker = Maps.Marker;
    Polyline = Maps.Polyline;
    Callout = Maps.Callout;
  } catch (e) {
    console.error("Harita modülü yüklenemedi:", e);
  }
}

// ==========================================
// 1. SABİT VERİLER VE AYARLAR
// ==========================================

// Backend'den gelen veya test için kullanılan API Key
const ORS_API_KEY =
  "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImUxY2U0NGI1ZTQ3NDQ4NmM4MmEzMTNkYTg1NzJlOTU1IiwiaCI6Im11cm11cjY0In0=";

const { width, height } = Dimensions.get("window");

// Algoritma Ayarları
const MAX_STATIONS_TO_TEST = 4;
const PANIC_STATIONS_TO_TEST = 8;
const ORTALAMA_PIYASA_FIYATI = 8.5;
const FIYAT_AGIRLIGI = 5;
const SARJ_BITIS_ESIGI = 20;
const HEDEF_SARJ_SEVIYESI = 80;
const KRITIK_SARJ_SEVIYESI = 20;
const GUC_HIZLI_KW = 120;
const GUC_YAVAS_KW = 22;

const ARACLAR = {
  togg: { ad: "Togg T10X V2", menzil: 523, kapasite: 88.5 },
  tesla: { ad: "Tesla Model Y LR", menzil: 533, kapasite: 75.0 },
  zoe: { ad: "Renault Zoe", menzil: 395, kapasite: 52.0 },
  corsa: { ad: "Opel Corsa-e", menzil: 359, kapasite: 50.0 },
};

// İSTASYON VERİTABANI
const INITIAL_STATIONS = [
  {
    id: "ist-izmir-01",
    ad: "Aydem İzmir Bornova (IKEA)",
    koordinat: { lat: 38.4568, lng: 27.2118 },
    fiyat_kw: 8.3,
    tip: "hizli",
    rezervasyonlar: [
      { baslangic: "09:00", bitis: "10:00" },
      { baslangic: "14:00", bitis: "15:30" },
      { baslangic: "18:00", bitis: "19:00" },
    ],
  },
  {
    id: "ist-izmir-02",
    ad: "Aydem İzmir Konak (Pier)",
    koordinat: { lat: 38.4189, lng: 27.1287 },
    fiyat_kw: 6.8,
    tip: "yavas",
    rezervasyonlar: [{ baslangic: "12:00", bitis: "16:00" }],
  },
  {
    id: "ist-izmir-03",
    ad: "Aydem İzmir Balçova (Agora)",
    koordinat: { lat: 38.3921, lng: 27.0449 },
    fiyat_kw: 8.2,
    tip: "hizli",
    rezervasyonlar: [],
  },
  {
    id: "ist-izmir-04",
    ad: "Aydem İzmir Gaziemir (Optimum)",
    koordinat: { lat: 38.3225, lng: 27.1285 },
    fiyat_kw: 6.5,
    tip: "yavas",
    rezervasyonlar: [{ baslangic: "08:00", bitis: "10:00" }],
  },
  {
    id: "ist-izmir-05",
    ad: "Aydem İzmir Menemen (Kuzey)",
    koordinat: { lat: 38.5932, lng: 27.0755 },
    fiyat_kw: 7.5,
    tip: "yavas",
    rezervasyonlar: [],
  },
  {
    id: "ist-manisa-01",
    ad: "Aydem Manisa Merkez (Magnesia)",
    koordinat: { lat: 38.6135, lng: 27.4095 },
    fiyat_kw: 8.4,
    tip: "hizli",
    rezervasyonlar: [
      { baslangic: "10:30", bitis: "11:30" },
      { baslangic: "15:00", bitis: "16:00" },
      { baslangic: "09:33", bitis: "09:57" },
      { baslangic: "08:27", bitis: "08:51" },
    ],
  },
  {
    id: "ist-manisa-02",
    ad: "Aydem Manisa Akhisar (Köfteci)",
    koordinat: { lat: 38.9206, lng: 27.8396 },
    fiyat_kw: 7,
    tip: "yavas",
    rezervasyonlar: [],
  },
  {
    id: "ist-manisa-03",
    ad: "Aydem Manisa Kula (Geopark)",
    koordinat: { lat: 38.5442, lng: 28.6498 },
    fiyat_kw: 8,
    tip: "hizli",
    rezervasyonlar: [{ baslangic: "13:00", bitis: "14:00" }],
  },
  {
    id: "ist-manisa-04",
    ad: "Aydem Manisa Salihli (Yol Üstü)",
    koordinat: { lat: 38.4821, lng: 28.1317 },
    fiyat_kw: 6.5,
    tip: "yavas",
    rezervasyonlar: [],
  },
  {
    id: "ist-aydin-01",
    ad: "Aydem Aydın Forum",
    koordinat: { lat: 37.8439, lng: 27.8511 },
    fiyat_kw: 8.3,
    tip: "hizli",
    rezervasyonlar: [],
  },
  {
    id: "ist-aydin-02",
    ad: "Aydem Aydın Söke (Novada)",
    koordinat: { lat: 37.7371, lng: 27.4229 },
    fiyat_kw: 6.7,
    tip: "yavas",
    rezervasyonlar: [],
  },
  {
    id: "ist-aydin-03",
    ad: "Aydem Kuşadası Marina",
    koordinat: { lat: 37.8661, lng: 27.2607 },
    fiyat_kw: 9.1,
    tip: "hizli",
    rezervasyonlar: [{ baslangic: "12:00", bitis: "18:00" }],
  },
  {
    id: "ist-mugla-01",
    ad: "Aydem Muğla Menteşe",
    koordinat: { lat: 37.2153, lng: 28.3636 },
    fiyat_kw: 8.5,
    tip: "hizli",
    rezervasyonlar: [],
  },
  {
    id: "ist-mugla-02",
    ad: "Aydem Bodrum (Midtown)",
    koordinat: { lat: 37.0532, lng: 27.3879 },
    fiyat_kw: 7,
    tip: "yavas",
    rezervasyonlar: [],
  },
  {
    id: "ist-balikesir-01",
    ad: "Aydem Susurluk (Tostçu)",
    koordinat: { lat: 39.9056, lng: 28.1558 },
    fiyat_kw: 8.8,
    tip: "hizli",
    rezervasyonlar: [],
  },
  {
    id: "ist-bursa-01",
    ad: "Aydem Bursa (Korupark)",
    koordinat: { lat: 40.2323, lng: 28.9673 },
    fiyat_kw: 8.6,
    tip: "hizli",
    rezervasyonlar: [],
  },
  {
    id: "ist-denizli-01",
    ad: "Aydem Denizli Forum",
    koordinat: { lat: 37.7553, lng: 29.1042 },
    fiyat_kw: 8.1,
    tip: "hizli",
    rezervasyonlar: [],
  },
  {
    id: "ist-usak-01",
    ad: "Aydem Uşak (Festiva)",
    koordinat: { lat: 38.6687, lng: 29.4219 },
    fiyat_kw: 6.9,
    tip: "yavas",
    rezervasyonlar: [],
  },
  {
    id: "ist-istanbul-01",
    ad: "Aydem Gebze Center",
    koordinat: { lat: 40.7982, lng: 29.4368 },
    fiyat_kw: 9,
    tip: "hizli",
    rezervasyonlar: [],
  },
  {
    id: "ist-istanbul-02",
    ad: "Aydem İstanbul (Mall of Ist)",
    koordinat: { lat: 41.0631, lng: 28.8062 },
    fiyat_kw: 9.5,
    tip: "hizli",
    rezervasyonlar: [],
  },
];

// ==========================================
// 2. YARDIMCI FONKSİYONLAR
// ==========================================

function decodePolyline(str, precision) {
  if (!str) return [];
  var index = 0,
    lat = 0,
    lng = 0,
    coordinates = [],
    shift = 0,
    result = 0,
    byte = null,
    latitude_change,
    longitude_change,
    factor = Math.pow(10, precision || 5);
  while (index < str.length) {
    byte = null;
    shift = 0;
    result = 0;
    do {
      byte = str.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    latitude_change = result & 1 ? ~(result >> 1) : result >> 1;
    shift = result = 0;
    do {
      byte = str.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    longitude_change = result & 1 ? ~(result >> 1) : result >> 1;
    lat += latitude_change;
    lng += longitude_change;
    coordinates.push({ latitude: lat / factor, longitude: lng / factor });
  }
  return coordinates;
}

const getKabaMesafe = (p1, p2) => {
  const dx = p1.lng - p2.lng;
  const dy = p1.lat - p2.lat;
  return Math.sqrt(dx * dx + dy * dy);
};

const timeToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
};

const formatTime = (minutes) => {
  const h = Math.floor(minutes / 60) % 24;
  const m = Math.floor(minutes % 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

const addMinutesToTime = (timeStr, minutesToAdd) => {
  return formatTime(timeToMinutes(timeStr) + minutesToAdd);
};

const checkRezervasyonDurumu = (
  istasyon,
  yolaCikisSaati,
  surusSuresiDk,
  sarjSuresiDk
) => {
  if (!istasyon.rezervasyonlar || istasyon.rezervasyonlar.length === 0)
    return 0;
  const startMinutes = timeToMinutes(yolaCikisSaati);
  const arrivalMinutes = startMinutes + surusSuresiDk;
  const departureMinutes =
    arrivalMinutes + (sarjSuresiDk ? parseFloat(sarjSuresiDk) : 0);
  let waitTime = 0;
  for (let rez of istasyon.rezervasyonlar) {
    const rezStart = timeToMinutes(rez.baslangic);
    const rezEnd = timeToMinutes(rez.bitis);
    if (arrivalMinutes < rezEnd && departureMinutes > rezStart) {
      waitTime = rezEnd - arrivalMinutes;
      break;
    }
  }
  return waitTime;
};

const fetchORSRoute = async (koordinatlar) => {
  const orsUrl = "https://api.openrouteservice.org/v2/directions/driving-car";
  const radiuses = koordinatlar.map(() => 5000);

  try {
    const response = await axios.post(
      orsUrl,
      {
        coordinates: koordinatlar,
        radiuses: radiuses,
      },
      {
        headers: {
          Authorization: ORS_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    if (
      !response.data ||
      !response.data.routes ||
      response.data.routes.length === 0
    ) {
      throw new Error("Rota bulunamadı.");
    }
    const rota = response.data.routes[0];
    return {
      rotaCizgisi: rota.geometry,
      ozet: {
        mesafe_km: (rota.summary.distance / 1000).toFixed(1),
        sure_dk: (rota.summary.duration / 60).toFixed(0),
      },
    };
  } catch (error) {
    console.log(
      "ORS API Hatası:",
      error.response ? error.response.data : error.message
    );
    return null;
  }
};

// ==========================================
// 3. ROTA HESAPLAMA ALGORİTMASI
// ==========================================
const localCalculateRoute = async (rotaIstegi, mevcutIstasyonlar) => {
  const { baslangic, bitis, aracId, baslangicSarj, yolaCikisSaati } =
    rotaIstegi;

  const baslangicSarjSayi = parseFloat(baslangicSarj);
  const secilenArac = ARACLAR[aracId] || ARACLAR["togg"];
  const maxMenzil = secilenArac.menzil;
  const bataryaKapasitesi = secilenArac.kapasite;

  const baslangicArr = [baslangic.lng, baslangic.lat];
  const bitisArr = [bitis.lng, bitis.lat];

  // 1. Direkt Rota İsteği
  const direktRotaPromise = fetchORSRoute([baslangicArr, bitisArr]);
  const direktKabaMesafe = getKabaMesafe(baslangic, bitis);

  // İstasyonları Puanla ve Filtrele
  const adayIstasyonlar = mevcutIstasyonlar.map((istasyon) => {
    const distAtoSt = getKabaMesafe(baslangic, istasyon.koordinat);
    const distSttoB = getKabaMesafe(istasyon.koordinat, bitis);
    const toplamYol = distAtoSt + distSttoB;
    const sapmaFaktoru = toplamYol / direktKabaMesafe;
    let tipCarpani = 1.0;
    if (istasyon.tip !== "hizli") {
      if (baslangicSarjSayi > 80) tipCarpani = 3.0;
      else if (baslangicSarjSayi > 50) tipCarpani = 2.0;
      else tipCarpani = 1.0;
    }
    const adayPuani =
      istasyon.fiyat_kw * tipCarpani * (sapmaFaktoru * sapmaFaktoru);
    return { ...istasyon, adayPuani, sapmaFaktoru, distAtoSt };
  });

  let filtrelenmisAdaylar;
  let aktifLimit;
  let guvenlikPayi;

  if (baslangicSarjSayi <= KRITIK_SARJ_SEVIYESI) {
    aktifLimit = PANIC_STATIONS_TO_TEST;
    guvenlikPayi = 0;
    filtrelenmisAdaylar = adayIstasyonlar
      .sort((a, b) => a.distAtoSt - b.distAtoSt)
      .slice(0, aktifLimit);
  } else {
    aktifLimit = MAX_STATIONS_TO_TEST;
    guvenlikPayi = 5;
    filtrelenmisAdaylar = adayIstasyonlar
      .filter((ist) => ist.sapmaFaktoru < 2.5)
      .sort((a, b) => a.adayPuani - b.adayPuani)
      .slice(0, aktifLimit);
  }

  const senaryolar = [];
  senaryolar.push({
    ad: "Direkt Rota",
    istasyon: null,
    promise: direktRotaPromise,
  });

  filtrelenmisAdaylar.forEach((istasyon) => {
    const istasyonArr = [istasyon.koordinat.lng, istasyon.koordinat.lat];
    senaryolar.push({
      ad: `Rota (${istasyon.ad})`,
      istasyon: istasyon,
      promise: fetchORSRoute([baslangicArr, istasyonArr, bitisArr]),
    });
  });

  const sonuclar = await Promise.allSettled(senaryolar.map((s) => s.promise));

  // Direkt Rota Verisi
  let direktRotaVerisi = null;
  if (sonuclar[0].status === "fulfilled" && sonuclar[0].value) {
    const rota = sonuclar[0].value;
    const mesafe = parseFloat(rota.ozet.mesafe_km);
    const harcananSarj = (mesafe / maxMenzil) * 100;
    const kalanSarj = baslangicSarjSayi - harcananSarj;
    const menzilYetersiz = kalanSarj < 0;
    let skor =
      parseFloat(rota.ozet.sure_dk) +
      ORTALAMA_PIYASA_FIYATI * FIYAT_AGIRLIGI +
      45;
    let mesaj = "En Kısa Rota (Direkt)";

    if (menzilYetersiz) {
      skor = 99999;
      mesaj = "⚠️ Menzil Yetmiyor (Direkt)";
    } else if (kalanSarj > SARJ_BITIS_ESIGI) {
      skor = -1000;
      mesaj = "Şarj Yeterli: Direkt Rota Öneriliyor";
    }

    direktRotaVerisi = {
      ...rota,
      mesaj,
      durak: null,
      kalanSarj: kalanSarj.toFixed(1),
      menzilYetersiz,
      sarjSuresi: 0,
      beklemeSuresi: 0,
      toplamSure: parseFloat(rota.ozet.sure_dk),
      sarjMaliyeti: 0,
      skor,
    };
  } else {
    throw new Error("Direkt rota hesaplanamadı.");
  }

  let enIyiRota = direktRotaVerisi;
  let enIyiSkor = direktRotaVerisi.skor;

  // Akıllı Rota Verisi
  sonuclar.forEach((sonuc, index) => {
    if (index === 0) return; // İlk senaryo direkt rotaydı, geç
    if (sonuc.status === "fulfilled" && sonuc.value) {
      const rota = sonuc.value;
      const istasyon = senaryolar[index].istasyon;
      const distToStation = getKabaMesafe(baslangic, istasyon.koordinat) * 111;
      const rangeToStationNeeded = (distToStation / maxMenzil) * 100;
      const stationArrivalCharge = baslangicSarjSayi - rangeToStationNeeded;

      if (stationArrivalCharge < guvenlikPayi) return;

      let neededChargePercent = HEDEF_SARJ_SEVIYESI - stationArrivalCharge;
      if (neededChargePercent < 0) neededChargePercent = 0;
      const neededkWh = (neededChargePercent / 100) * bataryaKapasitesi;
      const stationPowerKW =
        istasyon.tip === "hizli" ? GUC_HIZLI_KW : GUC_YAVAS_KW;
      let sarjSuresiDakika = (neededkWh / stationPowerKW) * 60 + 5;
      if (neededChargePercent === 0) sarjSuresiDakika = 0;
      const sarjMaliyeti = neededkWh * istasyon.fiyat_kw;
      const chargedLevel = Math.max(stationArrivalCharge, HEDEF_SARJ_SEVIYESI);
      const toplamMesafe = parseFloat(rota.ozet.mesafe_km);
      const consumptionToEnd =
        ((toplamMesafe - distToStation) / maxMenzil) * 100;
      const finalCharge = chargedLevel - consumptionToEnd;
      const surusSuresi = parseFloat(rota.ozet.sure_dk);
      const distRatio = distToStation / toplamMesafe;
      const driveTimeToStation = surusSuresi * distRatio;
      const beklemeSuresi = checkRezervasyonDurumu(
        istasyon,
        yolaCikisSaati,
        driveTimeToStation,
        sarjSuresiDakika
      );
      const toplamSure = surusSuresi + sarjSuresiDakika + beklemeSuresi;
      let skor = toplamSure + istasyon.fiyat_kw * FIYAT_AGIRLIGI;

      if (skor < enIyiSkor && finalCharge > 0) {
        enIyiSkor = skor;
        enIyiRota = {
          mesaj: `Akıllı Rota: ${istasyon.ad}`,
          rotaCizgisi: rota.rotaCizgisi,
          ozet: rota.ozet,
          durak: istasyon,
          kalanSarj: finalCharge.toFixed(1),
          sarjSuresi: sarjSuresiDakika.toFixed(0),
          beklemeSuresi: beklemeSuresi.toFixed(0),
          toplamSure: toplamSure.toFixed(0),
          sarjMaliyeti: sarjMaliyeti.toFixed(2),
          istasyonaVarisDk: driveTimeToStation.toFixed(0),
          skor: skor,
          menzilYetersiz: false,
        };
      }
    }
  });

  // Eğer direkt rota yetersizse ve akıllı rota bulunamadıysa
  if (enIyiRota === direktRotaVerisi && direktRotaVerisi.menzilYetersiz) {
    enIyiRota = {
      ...direktRotaVerisi,
      mesaj: "❌ Şarj Yetersiz: Hiçbir İstasyona Ulaşılamıyor!",
      rotaImkansiz: true,
    };
  }

  // Şarj yeterliyse direkt rotayı öner (ama yine de ayrı obje olsun)
  if (
    !direktRotaVerisi.menzilYetersiz &&
    parseFloat(direktRotaVerisi.kalanSarj) > SARJ_BITIS_ESIGI
  ) {
    enIyiRota = { ...direktRotaVerisi, menzilYetersiz: false };
  }

  return { akilliRota: enIyiRota, direktRota: direktRotaVerisi };
};

// ==========================================
// 4. UI COMPONENT
// ==========================================
export default function MapScreen() {
  const mapRef = useRef(null);
  const [stations, setStations] = useState(INITIAL_STATIONS);
  const [startMarker, setStartMarker] = useState(null);
  const [endMarker, setEndMarker] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [akilliRotaCoords, setAkilliRotaCoords] = useState([]);
  const [direktRotaCoords, setDirektRotaCoords] = useState([]);
  const [selectedCar, setSelectedCar] = useState("togg");
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [departureTime, setDepartureTime] = useState("09:00");
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const cars = [
    { label: "Togg T10X (523 km)", value: "togg" },
    { label: "Tesla Model Y (533 km)", value: "tesla" },
    { label: "Renault Zoe (395 km)", value: "zoe" },
    { label: "Opel Corsa-e (359 km)", value: "corsa" },
  ];

  const handleMapPress = (e) => {
    if (Platform.OS === "web") return;
    const { latitude, longitude } = e.nativeEvent.coordinate;
    if (!startMarker) setStartMarker({ latitude, longitude });
    else if (!endMarker) setEndMarker({ latitude, longitude });
    else Alert.alert("Bilgi", "Temizle butonuna basarak yeni rota oluşturun.");
  };

  const handleCalculateRoute = async () => {
    if (!startMarker || !endMarker) {
      Alert.alert("Uyarı", "Lütfen haritadan başlangıç ve bitiş seçin.");
      return;
    }
    setLoading(true);
    setAkilliRotaCoords([]);
    setDirektRotaCoords([]);
    setRouteInfo(null);
    setIsPanelOpen(false);

    const rotaIstegi = {
      baslangic: { lat: startMarker.latitude, lng: startMarker.longitude },
      bitis: { lat: endMarker.latitude, lng: endMarker.longitude },
      aracId: selectedCar,
      baslangicSarj: parseInt(batteryLevel),
      yolaCikisSaati: departureTime,
    };

    try {
      const sonuc = await localCalculateRoute(rotaIstegi, stations);
      const { akilliRota, direktRota } = sonuc;

      if (akilliRota && akilliRota.rotaCizgisi)
        setAkilliRotaCoords(decodePolyline(akilliRota.rotaCizgisi));
      if (direktRota && direktRota.rotaCizgisi)
        setDirektRotaCoords(decodePolyline(direktRota.rotaCizgisi));

      setRouteInfo({ akilli: akilliRota, direkt: direktRota });
      setIsPanelOpen(true);

      if (
        Platform.OS !== "web" &&
        mapRef.current &&
        akilliRota &&
        akilliRota.rotaCizgisi
      ) {
        setTimeout(() => {
          mapRef.current.fitToCoordinates(
            decodePolyline(akilliRota.rotaCizgisi),
            {
              edgePadding: { top: 50, right: 50, bottom: 300, left: 50 },
              animated: true,
            }
          );
        }, 500);
      }
    } catch (error) {
      Alert.alert("Hata", `Rota hesaplanamadı: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStartMarker(null);
    setEndMarker(null);
    setAkilliRotaCoords([]);
    setDirektRotaCoords([]);
    setRouteInfo(null);
  };

  const handleReservation = () => {
    if (!routeInfo?.akilli?.durak) return;
    const akilli = routeInfo.akilli;
    const istasyonId = akilli.durak.id;
    const driveDuration = akilli.istasyonaVarisDk
      ? parseInt(akilli.istasyonaVarisDk)
      : parseInt(akilli.toplamSure) / 2;
    const varisSaati = addMinutesToTime(departureTime, driveDuration);
    const bitisSaati = addMinutesToTime(
      varisSaati,
      parseInt(akilli.sarjSuresi)
    );

    Alert.alert(
      "Rezervasyon",
      `${varisSaati}-${bitisSaati} arası rezerve edilsin mi?`,
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Evet",
          onPress: () => {
            const yeniStations = stations.map((st) => {
              if (st.id === istasyonId) {
                const yeniRez = { baslangic: varisSaati, bitis: bitisSaati };
                return {
                  ...st,
                  rezervasyonlar: [...(st.rezervasyonlar || []), yeniRez],
                };
              }
              return st;
            });
            setStations(yeniStations);
            Alert.alert("Başarılı", "Rezervasyon alındı.");
            handleReset();
          },
        },
      ]
    );
  };

  if (Platform.OS === "web")
    return (
      <View style={styles.webContainer}>
        <Text>Mobilde Çalıştırın</Text>
      </View>
    );

  const renderResults = () => {
    if (!routeInfo) return null;
    const { akilli, direkt } = routeInfo;
    const akilliYetersiz = akilli?.menzilYetersiz || akilli?.rotaImkansiz;

    return (
      <View style={styles.resultContainer}>
        <Text
          style={{ fontWeight: "bold", textAlign: "center", marginBottom: 5 }}
        >
          ✅ Analiz Tamamlandı
        </Text>

        {/* AKILLI ROTA KUTUSU */}
        <View
          style={[
            styles.infoBox,
            {
              borderColor: akilliYetersiz ? "red" : "blue",
              backgroundColor: akilliYetersiz ? "#fff5f5" : "#e7f1ff",
            },
          ]}
        >
          <Text
            style={{
              color: akilliYetersiz ? "red" : "blue",
              fontWeight: "bold",
            }}
          >
            🔵 Akıllı Rota: {akilli?.ozet?.sure_dk} dk
          </Text>
          <Text style={{ fontSize: 12 }}>
            Menzil: {akilli?.ozet?.mesafe_km} km
          </Text>
          {akilli?.durak ? (
            <TouchableOpacity
              style={styles.reserveButton}
              onPress={handleReservation}
            >
              <Text style={styles.reserveButtonText}>
                📅 Rezerve Et ({akilli.durak.ad})
              </Text>
            </TouchableOpacity>
          ) : (
            <Text
              style={{
                fontSize: 12,
                color: "green",
                fontStyle: "italic",
                marginTop: 5,
              }}
            >
              Direkt gidiş uygundur.
            </Text>
          )}
        </View>

        {/* DİREKT ROTA KUTUSU (Her zaman gösterilir) */}
        {direkt && (
          <View
            style={[
              styles.infoBox,
              {
                borderColor: "#808080",
                backgroundColor: "#f0f0f0",
                marginTop: 10,
              },
            ]}
          >
            <Text style={{ color: "#555", fontWeight: "bold" }}>
              ⚫ Direkt Rota (En Kısa): {direkt?.ozet?.sure_dk} dk
            </Text>
            <Text style={{ fontSize: 12, color: "#555" }}>
              Menzil: {direkt?.ozet?.mesafe_km} km
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: direkt?.menzilYetersiz ? "#dc3545" : "#198754",
                fontWeight: "bold",
                marginTop: 2,
              }}
            >
              {direkt?.menzilYetersiz
                ? "⚠️ Şarj yetersiz kalabilir!"
                : "✅ Şarj yeterli."}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {MapView && (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: 38.4237,
            longitude: 27.1426,
            latitudeDelta: 0.5,
            longitudeDelta: 0.5,
          }}
          onPress={handleMapPress}
        >
          {stations.map((istasyon, i) => (
            <Marker
              key={i}
              coordinate={{
                latitude: istasyon.koordinat.lat,
                longitude: istasyon.koordinat.lng,
              }}
              pinColor="red"
            >
              {/* TOOLTIP: iOS'te standart baloncuk yerine özel View kullanır */}
              <Callout tooltip={true}>
                <View style={styles.calloutBubble}>
                  <Text style={styles.calloutTitle}>{istasyon.ad}</Text>
                  <Text style={styles.calloutText}>
                    {istasyon.tip === "hizli"
                      ? "⚡ DC Hızlı Şarj"
                      : "🐢 AC Yavaş Şarj"}
                  </Text>
                  <Text
                    style={[
                      styles.calloutText,
                      { color: "green", fontWeight: "bold" },
                    ]}
                  >
                    Fiyat: {istasyon.fiyat_kw} TL/kW
                  </Text>

                  {istasyon.rezervasyonlar &&
                  istasyon.rezervasyonlar.length > 0 ? (
                    <View style={styles.busyHoursBox}>
                      <Text
                        style={{
                          fontSize: 10,
                          fontWeight: "bold",
                          color: "#dc3545",
                        }}
                      >
                        📅 Dolu Saatler:
                      </Text>
                      {istasyon.rezervasyonlar.map((r, idx) => (
                        <Text key={idx} style={{ fontSize: 10, color: "#555" }}>
                          • {r.baslangic} - {r.bitis}
                        </Text>
                      ))}
                    </View>
                  ) : (
                    <Text
                      style={{
                        fontSize: 10,
                        color: "#198754",
                        fontStyle: "italic",
                      }}
                    >
                      ✅ Müsait
                    </Text>
                  )}
                </View>
                {/* Ok İşareti (Triangle) */}
                <View style={styles.calloutArrowBorder} />
                <View style={styles.calloutArrow} />
              </Callout>
            </Marker>
          ))}
          {startMarker && (
            <Marker
              coordinate={startMarker}
              pinColor="blue"
              title="Başlangıç"
            />
          )}
          {endMarker && (
            <Marker coordinate={endMarker} pinColor="blue" title="Bitiş" />
          )}

          {/* ROTA ÇİZGİLERİ */}
          {/* 1. DİREKT ROTA: Gri, Kalın (8px), Altta (zIndex 1) */}
          {direktRotaCoords.length > 0 && (
            <Polyline
              coordinates={direktRotaCoords}
              strokeColor="#808080" // Gri
              strokeWidth={8}
              lineDashPattern={[10, 10]} // Kesikli
              zIndex={1}
            />
          )}

          {/* 2. AKILLI ROTA: Mavi, İnce (4px), Üstte (zIndex 2) */}
          {akilliRotaCoords.length > 0 && (
            <Polyline
              coordinates={akilliRotaCoords}
              strokeColor="#007bff" // Mavi
              strokeWidth={4}
              zIndex={2}
            />
          )}
        </MapView>
      )}

      <View style={[styles.panel, { height: isPanelOpen ? "65%" : 60 }]}>
        <TouchableOpacity
          style={styles.handleContainer}
          onPress={() => setIsPanelOpen(!isPanelOpen)}
        >
          <View style={styles.handleBar} />
          <Text style={styles.panelTitle}>
            ⚡ Aydem Akıllı Rota {isPanelOpen ? "▼" : "▲"}
          </Text>
        </TouchableOpacity>

        {isPanelOpen && (
          <ScrollView contentContainerStyle={styles.panelContent}>
            <View style={styles.formContainer}>
              <Text style={styles.label}>🚗 Araç Seçimi:</Text>
              <TouchableOpacity
                style={styles.inputBox}
                onPress={() => setModalVisible(true)}
              >
                <Text>
                  {cars.find((c) => c.value === selectedCar)?.label ||
                    "Araç Seç"}
                </Text>
              </TouchableOpacity>

              <Text style={styles.label}>🔋 Şarj: %{batteryLevel}</Text>
              <Slider
                style={{ width: "100%", height: 40 }}
                minimumValue={10}
                maximumValue={100}
                step={1}
                value={batteryLevel}
                onValueChange={setBatteryLevel}
              />

              <Text style={styles.label}>🕒 Saat:</Text>
              <TextInput
                style={styles.inputBox}
                value={departureTime}
                onChangeText={setDepartureTime}
              />

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.btn, styles.btnPrimary]}
                  onPress={handleCalculateRoute}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.btnText}>Hesapla</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btn, styles.btnSecondary]}
                  onPress={handleReset}
                >
                  <Text style={styles.btnText}>Temizle</Text>
                </TouchableOpacity>
              </View>
              {!startMarker && (
                <Text style={styles.helperText}>
                  Haritadan Başlangıç seçin.
                </Text>
              )}
              {startMarker && !endMarker && (
                <Text style={styles.helperText}>Haritadan Bitiş seçin.</Text>
              )}
            </View>
            {renderResults()}
            <View style={{ height: 50 }} />
          </ScrollView>
        )}
      </View>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Araç Seç</Text>
            {cars.map((c) => (
              <TouchableOpacity
                key={c.value}
                style={styles.modalItem}
                onPress={() => {
                  setSelectedCar(c.value);
                  setModalVisible(false);
                }}
              >
                <Text>{c.label}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={[styles.btn, styles.btnSecondary, { marginTop: 10 }]}
            >
              <Text style={styles.btnText}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  map: { width: width, height: height },
  panel: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
    zIndex: 1000,
  },
  handleContainer: {
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  handleBar: {
    width: 40,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 3,
    marginBottom: 5,
  },
  panelTitle: { fontWeight: "bold" },
  panelContent: { padding: 20 },
  formContainer: { marginBottom: 10 },
  label: { fontWeight: "bold", marginTop: 10, marginBottom: 5 },
  inputBox: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#f9f9f9",
  },
  buttonRow: { flexDirection: "row", gap: 10, marginTop: 15 },
  btn: { flex: 1, padding: 12, borderRadius: 8, alignItems: "center" },
  btnPrimary: { backgroundColor: "#007bff" },
  btnSecondary: { backgroundColor: "#6c757d" },
  btnText: { color: "white", fontWeight: "bold" },
  helperText: {
    marginTop: 10,
    padding: 8,
    backgroundColor: "#fff3cd",
    borderRadius: 5,
    textAlign: "center",
  },
  resultContainer: {
    marginTop: 15,
    borderTopWidth: 1,
    borderColor: "#eee",
    paddingTop: 10,
  },
  infoBox: { borderLeftWidth: 4, padding: 10, borderRadius: 5, marginTop: 5 },
  reserveButton: {
    marginTop: 5,
    backgroundColor: "#28a745",
    padding: 8,
    borderRadius: 5,
  },
  reserveButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  modalItem: { padding: 15, borderBottomWidth: 1, borderColor: "#eee" },
  webContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  webTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#dc3545",
  },
  webText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
    color: "#333",
  },

  // --- CALLOUT (BALONCUK) STİLLERİ ---
  calloutBubble: {
    flexDirection: "column",
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 6,
    borderColor: "#ccc",
    borderWidth: 0.5,
    padding: 10,
    width: 220, // Genişlik Sabitlendi
    height: "auto",
  },
  calloutTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 2,
  },
  calloutText: {
    fontSize: 12,
    color: "#555",
    marginBottom: 2,
  },
  busyHoursBox: {
    marginTop: 5,
    borderTopWidth: 1,
    borderColor: "#eee",
    paddingTop: 3,
    backgroundColor: "#fff5f5",
    borderRadius: 4,
    padding: 3,
  },
  // Baloncuk Oku
  calloutArrow: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderTopColor: "#fff",
    borderWidth: 16,
    alignSelf: "center",
    marginTop: -32,
  },
  calloutArrowBorder: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderTopColor: "#ccc",
    borderWidth: 16,
    alignSelf: "center",
    marginTop: -0.5,
  },
});
