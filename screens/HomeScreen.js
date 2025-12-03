import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Pressable,
  StatusBar,
  PermissionsAndroid,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
  Card,
  Chip,
  Avatar,
  Button,
  IconButton,
  Portal,
  Dialog,
  Surface,
  Divider,
  FAB,
  TextInput,
  List,
  Menu, // ← Mover Menu aquí
} from "react-native-paper";
import { DatePickerInput, TimePickerModal } from "react-native-paper-dates";

import { db } from "../config/config";
import { useTheme } from "../context/ThemeContext";
import { ref, onValue } from "firebase/database";

import { BleManager } from "react-native-ble-plx";

const manager = new BleManager();

// Mock data for events with registration states
const MOCK_EVENTS = [
  {
    id: 1,
    title: "Feria de residencias",
    location: "Auditorio",
    date: "11/NOV/25", // Today
    time: "09:00 AM",
    participants: 20,
    description:
      "Estudiantes y egresados conectan con empresas para encontrar residencias profesionales y oportunidades laborales.",
    imageUri:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop",
    category: "Deportes",
    professor: "",
    isAssignature: false,
    isRegistered: true,
    isToday: true,
    sortDate: new Date("2025-11-11T09:00:00"),
  },
  {
    id: 2,
    title: "Campeonato Basket",
    location: "Cancha",
    date: "11/NOV/25", // Today
    time: "10:00 AM",
    participants: 15,
    description:
      "Torneo de baloncesto entre diferentes facultades. Participa y apoya a tu equipo.",
    imageUri:
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop",
    category: "Deportes",
    professor: "",
    isAssignature: false,
    isRegistered: false,
    isToday: true,
    sortDate: new Date("2025-11-11T10:00:00"),
  },
  {
    id: 3,
    title: "Plática servicio",
    location: "Sala A",
    date: "15/NOV/25",
    time: "11:30 AM",
    participants: 30,
    description:
      "Charla sobre servicio social y oportunidades de voluntariado en la comunidad.",
    imageUri:
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=300&fit=crop",
    category: "Cultural",
    professor: "",
    isAssignature: false,
    isRegistered: false,
    isToday: false,
    sortDate: new Date("2025-11-15T11:30:00"),
  },
  {
    id: 4,
    title: "Aplicaciones Moviles",
    location: "Centro de computo",
    date: "Lu - Vi",
    time: "07:00 AM",
    participants: 50,
    description:
      "Elabora aplicaciones móviles para múltiples plataformas empleando tecnologías emergentes para el desarrollo de aplicaciones que resuelvan problemáticas del entorno.",
    imageUri:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop",
    category: "Academico",
    professor: "Profesor: Fernando Robles Casillas",
    isAssignature: true,
    isRegistered: true, // Always registered for assignatures
    isToday: false,
    sortDate: new Date("2025-11-11T07:00:00"),
  },
  {
    id: 5,
    title: "Desarrollo Web",
    location: "Centro de computo",
    date: "Lu - Vi",
    time: "11:30 AM",
    participants: 45,
    description:
      "Aprende a desarrollar aplicaciones web modernas utilizando las últimas tecnologías y frameworks.",
    imageUri:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop",
    category: "Academico",
    professor: "Profesor: María González",
    isAssignature: true,
    isRegistered: true, // Always registered for assignatures
    isToday: false,
    sortDate: new Date("2025-11-11T11:30:00"),
  },
  {
    id: 6,
    title: "Concierto de Jazz",
    location: "Auditorio Principal",
    date: "12/NOV/25",
    time: "07:00 PM",
    participants: 80,
    description:
      "Noche de jazz con músicos locales e internacionales. Una experiencia musical única.",
    imageUri:
      "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400&h=300&fit=crop",
    category: "Cultural",
    professor: "",
    isAssignature: false,
    isRegistered: true,
    isToday: false,
    sortDate: new Date("2025-11-12T19:00:00"),
  },
  {
    id: 7,
    title: "Torneo de Futbol",
    location: "Campo deportivo",
    date: "13/NOV/25",
    time: "03:00 PM",
    participants: 40,
    description:
      "Torneo inter-facultades de futbol. Inscribe a tu equipo y compite por el trofeo.",
    imageUri:
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=300&fit=crop",
    category: "Deportes",
    professor: "",
    isAssignature: false,
    isRegistered: false,
    isToday: false,
    sortDate: new Date("2025-11-13T15:00:00"),
  },
  {
    id: 8,
    title: "Taller de Fotografía",
    location: "Sala de Arte",
    date: "14/NOV/25",
    time: "10:00 AM",
    participants: 25,
    description:
      "Aprende técnicas básicas y avanzadas de fotografía digital con profesionales del área.",
    imageUri:
      "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400&h=300&fit=crop",
    category: "Cultural",
    professor: "",
    isAssignature: false,
    isRegistered: false,
    isToday: false,
    sortDate: new Date("2025-11-14T10:00:00"),
  },
  {
    id: 9,
    title: "Hackathon 2025",
    location: "Laboratorio de Innovación",
    date: "16/NOV/25",
    time: "08:00 AM",
    participants: 60,
    description:
      "Evento de programación de 24 horas. Forma tu equipo y crea soluciones innovadoras.",
    imageUri:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop",
    category: "Academico",
    professor: "",
    isAssignature: false,
    isRegistered: true,
    isToday: false,
    sortDate: new Date("2025-11-16T08:00:00"),
  },
];

const CATEGORIES = [
  "Todos",
  "Deportes",
  "Cultural",
  "Academico",
  "Talleres",
  "Conferencias",
  "Sociales",
];

export default function HomeScreen({ navigation }) {
  //
  const { theme } = useTheme();
  const [buildings, setBuildings] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);

  // BLE
  const [scanActive, setScanActive] = useState(true);
  const [nearBeacon, setNearBeacon] = useState(null);
  const [beaconModalVisible, setBeaconModalVisible] = useState(false);
  //

  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [registeredEvents, setRegisteredEvents] = useState(
    MOCK_EVENTS.filter((e) => e.isRegistered).map((e) => e.id)
  );

  // New event modal states
  const [newEventModalVisible, setNewEventModalVisible] = useState(false);
  const [eventName, setEventName] = useState("");
  const [category, setCategory] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [date, setDate] = useState(undefined);
  const [time, setTime] = useState({ hours: 12, minutes: 0 });
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [description, setDescription] = useState("");

  //
  //
  const requestBluetoothPermissions = async () => {
    if (Platform.OS === "android") {
      if (Platform.Version >= 31) {
        // Android 12+
        try {
          const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ]);

          const allGranted = Object.values(granted).every(
            (permission) => permission === PermissionsAndroid.RESULTS.GRANTED
          );

          if (!allGranted) {
            Alert.alert(
              "Permisos necesarios",
              "La app necesita permisos de Bluetooth y ubicación para detectar beacons"
            );
            return false;
          }
          return true;
        } catch (err) {
          console.error("Error solicitando permisos:", err);
          return false;
        }
      } else {
        // Android 11 o menor
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
          console.error("Error solicitando permisos:", err);
          return false;
        }
      }
    }
    // iOS se maneja automáticamente con Info.plist
    return true;
  };
  //

  //
  useEffect(() => {
    const buildingsRef = ref(db, "edificios");

    const unsubscribe = onValue(buildingsRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const list = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));

        setBuildings(list);

        // Seleccionar el primero por defecto
        if (!selectedBuilding) {
          setSelectedBuilding(list[0]);
        }
      }
    });

    return () => unsubscribe();
  }, []);
  //

  //
  //

  useEffect(() => {
    let stateSubscription = null;
    let isScanning = false;

    if (!scanActive) return;

    const initializeBLE = async () => {
      const hasPermissions = await requestBluetoothPermissions();
      if (!hasPermissions) {
        console.log("❌ Permisos denegados");
        return;
      }

      if (buildings.length === 0) {
        console.log("⏳ Esperando edificios de Firebase...");
        return;
      }

      // Si el modal ya está visible, no escanear
      if (beaconModalVisible) {
        console.log("⏸️ Modal visible, escaneo pausado");
        return;
      }

      console.log("🔍 Esperando a que el Bluetooth esté encendido...");
      console.log(
        "📋 Edificios a detectar:",
        buildings.map((b) => ({
          name: b.name,
          mac: b.mac,
        }))
      );

      stateSubscription = manager.onStateChange((state) => {
        if (state === "PoweredOn" && !isScanning) {
          console.log("🔵 Bluetooth encendido, iniciando escaneo...");
          isScanning = true;

          manager.startDeviceScan(null, null, (error, device) => {
            if (error) {
              console.log("⚠ Error escaneando:", error);
              return;
            }

            if (!device || !device.id) return;

            // Normalizar la MAC del dispositivo detectado
            const deviceMac = device.id.toUpperCase().replace(/:/g, "");

            // Buscar si este dispositivo está en nuestra lista de edificios
            const found = buildings.find((b) => {
              if (!b.mac) return false; // Si no tiene MAC, ignorar
              const buildingMac = b.mac.toUpperCase().replace(/:/g, "");
              return buildingMac === deviceMac;
            });

            if (found) {
              console.log("🏢 ¡EDIFICIO DETECTADO!");
              console.log("   • Nombre:", found.name);
              console.log("   • MAC:", device.id);
              console.log("   • RSSI:", device.rssi);
              console.log("-----------------------------------");

              // Si está cerca (señal fuerte)
              if (device.rssi > -70) {
                console.log("🎯 Edificio CERCA, mostrando modal...");
                setNearBeacon(found);
                setBeaconModalVisible(true);
                manager.stopDeviceScan();
                isScanning = false;
                setScanActive(false)
              }
            }
          });

          stateSubscription.remove();
        }
      }, true);
    };

    initializeBLE();

    return () => {
      console.log("🛑 Limpieza de escaneo");
      manager.stopDeviceScan();
      if (stateSubscription) stateSubscription.remove();
      isScanning = false;
    };
  }, [buildings, beaconModalVisible]);
  //

  const onAddEventHandler = () => {
    setNewEventModalVisible(true);
  };

  const onDismissNewEventModal = () => {
    setNewEventModalVisible(false);
  };

  const onSaveEvent = () => {
    console.log({
      eventName,
      category,
      date,
      time: `${time.hours}:${String(time.minutes).padStart(2, "0")}`,
      description,
    });
    setNewEventModalVisible(false);
  };

  const onConfirmTime = ({ hours, minutes }) => {
    setTime({ hours, minutes });
    setTimePickerVisible(false);
  };

  // Filter and sort events
  const getFilteredAndSortedEvents = () => {
    let events = MOCK_EVENTS;

    // Filter by category
    if (selectedCategory !== "Todos") {
      events = events.filter((event) => event.category === selectedCategory);
    }

    // Sort: Today's events first, then by date/time
    return events.sort((a, b) => {
      // Prioritize today's events
      if (a.isToday && !b.isToday) return -1;
      if (!a.isToday && b.isToday) return 1;

      // Then sort by date and time
      return a.sortDate - b.sortDate;
    });
  };

  const filteredEvents = getFilteredAndSortedEvents();

  const toggleRegistration = (eventId) => {
    setRegisteredEvents((prev) => {
      if (prev.includes(eventId)) {
        return prev.filter((id) => id !== eventId);
      } else {
        return [...prev, eventId];
      }
    });
  };

  const isEventRegistered = (eventId) => {
    return registeredEvents.includes(eventId);
  };

  const [admin, setAdmin] = useState(false);

  const openEventModal = (event) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedEvent(null);
  };

  // const handleLocationPress = () => {
  //   // Navigate to location/map screen
  //   console.log("Navigate to location screen");
  //   navigation.navigate("Lugares");
  // };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/*  */}
      <Portal>
        <Dialog
          visible={beaconModalVisible}
          onDismiss={() => setBeaconModalVisible(false)}
        >
          <Dialog.Title>Edificio detectado</Dialog.Title>
          <Dialog.Content>
            <Text>
              Estás cerca de:{" "}
              <Text style={{ fontWeight: "bold" }}>{nearBeacon?.name}</Text>
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setBeaconModalVisible(false)}>
              Cancelar
            </Button>
            <Button
              onPress={() => {
                setSelectedBuilding(nearBeacon);
                setBeaconModalVisible(false);
              }}
            >
              Cambiar
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      {/*  */}

      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        {/* Título */}
        <View style={styles.headerLeft}>
          <View style={styles.headerTitle}>
            <Text style={[styles.headerMainText, { color: theme.colors.onPrimary }]}>Eventos /</Text>
            <Text style={[styles.headerSubText, { color: theme.colors.onPrimary }]}>Salones</Text>
          </View>
        </View>

        {/* Botón Admin */}
        <TouchableOpacity
          onPress={() => setAdmin(!admin)}
          style={{ marginLeft: 15 }}
        >
          <Text style={[styles.adminButtonText, { color: theme.colors.onPrimary }]}>
            {admin ? "Salir Admin" : "Entrar Admin"}
          </Text>
        </TouchableOpacity>

        {/* Selector de edificio */}
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <TouchableOpacity
              onPress={() => setMenuVisible(true)}
              style={styles.locationButton}
            >
              <Text style={styles.locationText}>
                {selectedBuilding ? selectedBuilding.name : "Seleccionar"}
              </Text>
              <Ionicons name="location-sharp" size={20} color="#000" />
            </TouchableOpacity>
          }
        >
          {buildings.map((b) => (
            <Menu.Item
              key={b.id}
              onPress={() => {
                setSelectedBuilding(b);
                setMenuVisible(false);
              }}
              title={b.name}
            />
          ))}
        </Menu>
      </View>

      {/* Category Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.chipsScrollView, { backgroundColor: theme.colors.background }]}
        contentContainerStyle={styles.chipsContainer}
      >
        {CATEGORIES.map((category) => (
          <Chip
            key={category}
            selected={selectedCategory === category}
            onPress={() => setSelectedCategory(category)}
            style={[
              styles.chip,
              { 
                backgroundColor: selectedCategory === category ? theme.colors.primary : theme.colors.surface,
                borderColor: theme.colors.border
              }
            ]}
            textStyle={[
              styles.chipText,
              { color: selectedCategory === category ? theme.colors.onPrimary : theme.colors.text }
            ]}
            mode="outlined"
          >
            {category}
          </Chip>
        ))}
      </ScrollView>

      <FAB
        style={styles.fab}
        icon="plus"
        size="medium"
        onPress={onAddEventHandler}
      />

      {/* Events List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredEvents.map((event, index) => (
          <Card
            key={event.id}
            style={styles.eventCard}
            onPress={() => openEventModal(event)}
            mode="elevated"
          >
            <View style={styles.eventHeader}>
              <Avatar.Text
                size={40}
                label={event.title.charAt(0).toUpperCase()}
                style={styles.eventIconContainer}
                labelStyle={styles.eventIcon}
              />
              <View style={styles.eventHeaderText}>
                <Text style={[styles.eventTitle, { color: theme.colors.text }]}>{event.title}</Text>
                <Text style={[styles.eventDate, { color: theme.colors.textSecondary }]}>
                  {event.isToday ? "Hoy" : event.date}
                </Text>
              </View>
              {isEventRegistered(event.id) && (
                <View style={styles.checkmarkContainer}>
                  <Ionicons name="checkmark" size={24} color="#A855F7" />
                </View>
              )}
            </View>

            {event.imageUri && (
              <Card.Cover
                source={{ uri: event.imageUri }}
                style={styles.eventImage}
              />
            )}

            <Card.Content style={styles.cardContent}>
              <View style={styles.eventFooter}>
                <View style={styles.eventInfo}>
                  <Text style={[styles.eventTitleBold, { color: theme.colors.text }]}>{event.title}</Text>
                  <Text style={[styles.eventLocation, { color: theme.colors.textSecondary }]}>{event.location}</Text>
                </View>
                <View style={styles.participantsContainer}>
                  <Ionicons name="people" size={16} color="#666" />
                  <Text style={styles.participantsText}>
                    {event.participants}
                  </Text>
                </View>
              </View>

              {event.description && (
                <Text style={[styles.eventDescription, { color: theme.colors.textSecondary }]} numberOfLines={3}>
                  {event.description}
                </Text>
              )}
            </Card.Content>

            <Card.Actions style={styles.cardActions}>
              {/* Render buttons based on event type and registration status */}
              {!event.isAssignature &&
                event.isToday &&
                isEventRegistered(event.id) && (
                  <Button
                    mode="contained"
                    onPress={() => openEventModal(event)}
                    style={styles.attendanceButton}
                    icon="eye"
                    buttonColor="#6B46C1"
                  >
                    Ver detalles
                  </Button>
                )}

              {!event.isAssignature &&
                event.isToday &&
                !isEventRegistered(event.id) && (
                  <Button
                    mode="contained"
                    onPress={() => {
                      navigation.navigate("QRScanner", {
                        eventTitle: event.title,
                      });
                    }}
                    style={styles.scanButton}
                    icon="qrcode"
                    buttonColor="#6B46C1"
                  >
                    Escanear QR
                  </Button>
                )}

              {!event.isAssignature &&
                !event.isToday &&
                !isEventRegistered(event.id) && (
                  <Button
                    mode="outlined"
                    onPress={() => {
                      toggleRegistration(event.id);
                    }}
                    style={styles.registrationButton}
                    icon="account-plus"
                    textColor="#6B46C1"
                  >
                    Registrarse
                  </Button>
                )}

              {!event.isAssignature &&
                !event.isToday &&
                isEventRegistered(event.id) && (
                  <Button
                    mode="outlined"
                    onPress={() => {
                      toggleRegistration(event.id);
                    }}
                    style={styles.registeredButton}
                    icon="check-circle"
                    textColor="#10B981"
                  >
                    Registrado
                  </Button>
                )}

              {event.isAssignature && (
                <Button
                  mode="outlined"
                  onPress={() => openEventModal(event)}
                  style={styles.assignatureButton}
                  icon="book-open-variant"
                  textColor="#6B46C1"
                >
                  Ver asignatura
                </Button>
              )}
            </Card.Actions>
          </Card>
        ))}
      </ScrollView>

      {/* FAB */}
      <FAB
        icon="plus"
        style={styles.fab}
        size="medium"
        visible={admin}
        onPress={onAddEventHandler}
      />

      {/* Bottom Navigation */}
      <View style={[styles.bottomNav, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border }]}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Perfil")}
        >
          <Ionicons name="person-outline" size={24} color={theme.colors.textSecondary} />
          <Text style={[styles.navText, { color: theme.colors.textSecondary }]}>Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
          <Ionicons name="home" size={24} color={theme.colors.text} />
          <Text style={[styles.navText, styles.navTextActive, { color: theme.colors.text }]}>Inicio</Text>
          <View style={[styles.activeIndicator, { backgroundColor: theme.colors.primary }]} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("History")}
        >
          <Ionicons name="calendar-outline" size={24} color={theme.colors.textSecondary} />
          <Text style={[styles.navText, { color: theme.colors.textSecondary }]}>Eventos</Text>
        </TouchableOpacity>
      </View>

      {/* Event Detail Modal */}
      <Portal>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <Pressable style={styles.modalOverlay} onPress={closeModal}>
            <Pressable
              style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}
              onPress={(e) => e.stopPropagation()}
            >
              {selectedEvent && (
                <>
                  <Surface style={[styles.modalHeader, { backgroundColor: theme.colors.surface }]} elevation={0}>
                    <Avatar.Text
                      size={48}
                      label={selectedEvent.title.charAt(0).toUpperCase()}
                      style={styles.modalIconContainer}
                      labelStyle={styles.modalIcon}
                    />
                    <View style={styles.modalHeaderText}>
                      <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                        {selectedEvent.title}
                      </Text>
                      <Text style={[styles.modalSubtitle, { color: theme.colors.textSecondary }]}>
                        {selectedEvent.date} {selectedEvent.time}
                      </Text>
                    </View>
                    {/* Only show QR button for today's events where user is not registered */}
                    {!selectedEvent.isAssignature &&
                      selectedEvent.isToday &&
                      !isEventRegistered(selectedEvent.id) && (
                        <IconButton
                          icon="qrcode"
                          size={24}
                          iconColor="#fff"
                          containerColor="#6B46C1"
                          onPress={() => {
                            closeModal();
                            navigation.navigate("QRScanner", {
                              eventTitle: selectedEvent.title,
                            });
                          }}
                        />
                      )}
                    {/* Show close button for other cases */}
                    {(selectedEvent.isAssignature ||
                      !selectedEvent.isToday ||
                      isEventRegistered(selectedEvent.id)) && (
                      <IconButton icon="close" size={24} onPress={closeModal} />
                    )}
                  </Surface>

                  {selectedEvent.imageUri && (
                    <Image
                      source={{ uri: selectedEvent.imageUri }}
                      style={styles.modalImage}
                    />
                  )}

                  <ScrollView style={styles.modalDetails}>
                    {selectedEvent.professor && (
                      <Text style={[styles.modalProfessor, { color: theme.colors.text }]}>
                        {selectedEvent.professor}
                      </Text>
                    )}

                    <View style={styles.modalInfoRow}>
                      <Ionicons name="calendar" size={20} color={theme.colors.textSecondary} />
                      <Text style={[styles.modalInfoText, { color: theme.colors.textSecondary }]}>
                        {selectedEvent.date}
                      </Text>
                    </View>

                    <View style={styles.modalInfoRow}>
                      <Ionicons name="time" size={20} color={theme.colors.textSecondary} />
                      <Text style={[styles.modalInfoText, { color: theme.colors.textSecondary }]}>
                        {selectedEvent.time}
                      </Text>
                    </View>

                    <View style={styles.modalInfoRow}>
                      <Ionicons name="people" size={20} color={theme.colors.textSecondary} />
                      <Text style={[styles.modalInfoText, { color: theme.colors.textSecondary }]}>
                        {selectedEvent.participants}
                      </Text>
                    </View>

                    <View style={styles.modalInfoRow}>
                      <Ionicons name="location" size={20} color={theme.colors.textSecondary} />
                      <Text style={[styles.modalInfoText, { color: theme.colors.textSecondary }]}>
                        {selectedEvent.location}
                      </Text>
                    </View>

                    <Text style={[styles.modalDescription, { color: theme.colors.textSecondary }]}>
                      {selectedEvent.description}
                    </Text>
                  </ScrollView>

                  <Divider />

                  {/* Admin controls - visible only if admin is true */}
                  {admin && (
                    <>
                      <View style={styles.adminButtonsContainer}>
                        <Button
                          mode="contained"
                          icon="pencil"
                          onPress={() => {
                            console.log("Edit event", selectedEvent.id);
                            closeModal();
                          }}
                          style={styles.adminButton}
                          buttonColor="#6B46C1"
                        >
                          Editar
                        </Button>
                        <Button
                          mode="contained"
                          icon="delete"
                          onPress={() => {
                            console.log("Delete event", selectedEvent.id);
                            closeModal();
                          }}
                          style={styles.adminButton}
                          buttonColor="#EF4444"
                        >
                          Eliminar
                        </Button>
                        <Button
                          mode="contained"
                          icon="account-group"
                          onPress={() => {
                            closeModal();
                            navigation.navigate("Participants", {
                              eventId: selectedEvent.id,
                              eventName: selectedEvent.title,
                            });
                          }}
                          style={styles.adminButton}
                          buttonColor="#10B981"
                        >
                          Participantes
                        </Button>
                      </View>
                      <Divider />
                    </>
                  )}

                  <View style={styles.modalFooter}>
                    <Button
                      mode="outlined"
                      onPress={closeModal}
                      style={styles.modalCancelButton}
                    >
                      Cancelar
                    </Button>

                    {/* Show different actions based on event type and registration */}
                    {!admin &&
                      !selectedEvent.isAssignature &&
                      selectedEvent.isToday &&
                      !isEventRegistered(selectedEvent.id) && (
                        <Button
                          mode="contained"
                          onPress={() => {
                            closeModal();
                            navigation.navigate("QRScanner", {
                              eventTitle: selectedEvent.title,
                            });
                          }}
                          style={styles.modalActionButton}
                          buttonColor="#6B46C1"
                        >
                          Escanear QR
                        </Button>
                      )}

                    {!admin &&
                      !selectedEvent.isAssignature &&
                      !selectedEvent.isToday &&
                      !isEventRegistered(selectedEvent.id) && (
                        <Button
                          mode="contained"
                          onPress={() => {
                            toggleRegistration(selectedEvent.id);
                            closeModal();
                          }}
                          style={styles.modalActionButton}
                          buttonColor="#6B46C1"
                        >
                          Registrarse
                        </Button>
                      )}

                    {!admin &&
                      !selectedEvent.isAssignature &&
                      !selectedEvent.isToday &&
                      isEventRegistered(selectedEvent.id) && (
                        <Button
                          mode="contained"
                          onPress={() => {
                            toggleRegistration(selectedEvent.id);
                            closeModal();
                          }}
                          style={styles.modalUnregisterButton}
                          buttonColor="#FEF2F2"
                          textColor="#EF4444"
                        >
                          Cancelar registro
                        </Button>
                      )}
                  </View>
                </>
              )}
            </Pressable>
          </Pressable>
        </Modal>

        {/* Modal principal para crear evento */}
        <Modal
          visible={newEventModalVisible}
          onDismiss={onDismissNewEventModal}
          contentContainerStyle={[styles.modalContainer, { backgroundColor: theme.colors.surface }]}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={[styles.title, { color: theme.colors.text }]}>Nuevo evento</Text>
            <Divider style={styles.divider} />

            {/* Nombre */}
            <TextInput
              label="Nombre del evento"
              value={eventName}
              onChangeText={setEventName}
              mode="outlined"
              style={styles.roundedInput}
              theme={{ roundness: 20 }}
            />

            {/* Categoría */}
            <View style={styles.block}>
              <List.Section>
                <List.Accordion
                  title={
                    category
                      ? `Categoría: ${category}`
                      : "Seleccionar categoría"
                  }
                  expanded={expanded}
                  onPress={() => setExpanded(!expanded)}
                  left={(props) => <List.Icon {...props} icon="folder" />}
                  style={styles.accordion}
                >
                  {["Académico", "Deportivo", "Servicio social", "Otro"].map(
                    (item) => (
                      <List.Item
                        key={item}
                        title={item}
                        onPress={() => {
                          setCategory(item);
                          setExpanded(false);
                        }}
                      />
                    )
                  )}
                </List.Accordion>
              </List.Section>
            </View>

            {/* Fecha */}
            <View style={styles.block}>
              <DatePickerInput
                locale="es"
                label="Fecha del evento"
                value={date}
                onChange={(d) => setDate(d)}
                inputMode="start"
                mode="outlined"
                style={styles.roundedInput}
                theme={{ roundness: 20 }}
              />
            </View>

            {/* Hora */}
            <View style={styles.block}>
              <Button
                mode="outlined"
                icon="clock"
                onPress={() => setTimePickerVisible(true)}
                style={styles.roundedButton}
                labelStyle={{ textTransform: "none" }}
              >
                {time
                  ? `Hora seleccionada: ${String(time.hours).padStart(
                      2,
                      "0"
                    )}:${String(time.minutes).padStart(2, "0")}`
                  : "Seleccionar hora"}
              </Button>
            </View>

            {/* Descripción */}
            <TextInput
              label="Descripción"
              value={description}
              onChangeText={setDescription}
              mode="outlined"
              multiline
              numberOfLines={8}
              style={[styles.roundedInput, styles.textArea]}
              theme={{ roundness: 20 }}
            />

            {/* Botones */}
            <View style={styles.buttonRow}>
              <Button
                mode="outlined"
                onPress={onDismissNewEventModal}
                style={styles.roundedButton}
              >
                Cancelar
              </Button>
              <Button
                mode="contained"
                onPress={onSaveEvent}
                style={[styles.roundedButton, { backgroundColor: "#6200ee" }]}
              >
                Guardar
              </Button>
            </View>
          </ScrollView>
        </Modal>

        {/* Modal de hora */}
        <TimePickerModal
          visible={timePickerVisible}
          onDismiss={() => setTimePickerVisible(false)}
          onConfirm={onConfirmTime}
          hours={time.hours}
          minutes={time.minutes}
          locale="es"
        />
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  fab: {
    position: "absolute",
    margin: 40,
    right: 0,
    bottom: 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerTitle: {
    flexDirection: "column",
  },
  headerMainText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  headerSubText: {
    fontSize: 14,
    color: "#666",
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationText: {
    fontSize: 14,
    color: "#000",
    fontWeight: "500",
  },
  chipsScrollView: {
    backgroundColor: "#fff",
    maxHeight: 56,
  },
  chipsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    alignItems: "center",
  },
  chip: {
    height: 36,
    backgroundColor: "#F0F0F0",
    borderColor: "#E0E0E0",
  },
  chipSelected: {
    backgroundColor: "#E9D5FF",
    borderColor: "#6B46C1",
  },
  chipText: {
    fontSize: 13,
    color: "#666",
  },
  chipTextSelected: {
    color: "#6B46C1",
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 16,
    gap: 16,
  },
  eventCard: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  eventHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    paddingBottom: 8,
  },
  eventIconContainer: {
    backgroundColor: "#E9D5FF",
    marginRight: 12,
  },
  eventIcon: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6B46C1",
  },
  eventHeaderText: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  eventDate: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  checkmarkContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
  },
  eventImage: {
    height: 180,
  },
  cardContent: {
    paddingTop: 12,
  },
  eventFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitleBold: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    marginBottom: 2,
  },
  eventLocation: {
    fontSize: 14,
    color: "#666",
  },
  participantsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  participantsText: {
    fontSize: 14,
    color: "#666",
  },
  eventDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginTop: 4,
  },
  cardActions: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    justifyContent: "flex-end",
  },
  attendanceButton: {
    borderRadius: 8,
    flex: 1,
  },
  registrationButton: {
    borderRadius: 8,
    borderColor: "#6B46C1",
    flex: 1,
  },
  scanButton: {
    borderRadius: 8,
    flex: 1,
  },
  registeredButton: {
    borderRadius: 8,
    borderColor: "#10B981",
    backgroundColor: "#ECFDF5",
    flex: 1,
  },
  assignatureButton: {
    borderRadius: 8,
    borderColor: "#6B46C1",
    backgroundColor: "#F5F3FF",
    flex: 1,
  },
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    justifyContent: "space-around",
  },
  navItem: {
    alignItems: "center",
    paddingVertical: 8,
    position: "relative",
  },
  navItemActive: {
    // Active state
  },
  navText: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  navTextActive: {
    color: "#000",
    fontWeight: "600",
  },
  activeIndicator: {
    position: "absolute",
    bottom: 0,
    width: 40,
    height: 3,
    backgroundColor: "#000",
    borderRadius: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "90%",
    maxHeight: "85%",
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  modalIconContainer: {
    backgroundColor: "#E9D5FF",
    marginRight: 12,
  },
  modalIcon: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#6B46C1",
  },
  modalHeaderText: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  scanButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#6B46C1",
    justifyContent: "center",
    alignItems: "center",
  },
  modalImage: {
    width: "100%",
    height: 200,
  },
  modalDetails: {
    padding: 16,
    maxHeight: 300,
  },
  modalProfessor: {
    fontSize: 14,
    color: "#000",
    marginBottom: 12,
    fontWeight: "500",
  },
  modalInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  modalInfoText: {
    fontSize: 14,
    color: "#666",
  },
  modalDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginTop: 8,
  },
  modalFooter: {
    flexDirection: "row",
    padding: 16,
    paddingTop: 8,
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    borderRadius: 8,
  },
  modalActionButton: {
    flex: 1,
    borderRadius: 8,
  },
  modalUnregisterButton: {
    flex: 1,
    borderRadius: 8,
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    margin: 20,
    borderRadius: 12,
    maxHeight: "85%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  divider: {
    marginBottom: 20,
  },
  roundedInput: {
    marginBottom: 15,
  },
  block: {
    marginBottom: 15,
  },
  accordion: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  textArea: {
    minHeight: 120,
  },
  roundedButton: {
    borderRadius: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 20,
  },
  adminButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    gap: 8,
  },
  adminButton: {
    flex: 1,
    borderRadius: 8,
  },
  adminButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
