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
} from "react-native-paper";
import { DatePickerInput, TimePickerModal } from "react-native-paper-dates";

import { db } from "../config/config";
import { useTheme } from "../context/ThemeContext";
import { ref, onValue, get, set, update } from "firebase/database";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { BleManager } from "react-native-ble-plx";

const manager = new BleManager();

const CATEGORIES = [
  "Todos",
  "Deportes",
  "Cultural",
  "Tecnologia",
  "Ingenieria",
  "Talleres",
  "Conferencias",
  "Sociales",
];

export default function HomeScreen({ navigation }) {
  //
  const { theme } = useTheme();
  const [buildings, setBuildings] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [buildingSelectorVisible, setBuildingSelectorVisible] = useState(false);
  
  // Events state
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);

  // BLE
  const [scanActive, setScanActive] = useState(true);
  const [nearBeacon, setNearBeacon] = useState(null);
  const [beaconModalVisible, setBeaconModalVisible] = useState(false);
  //

  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [registeredEvents, setRegisteredEvents] = useState([]);

  // New event modal states
  const [newEventModalVisible, setNewEventModalVisible] = useState(false);
  const [eventName, setEventName] = useState("");
  const [category, setCategory] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [date, setDate] = useState(undefined);
  const [time, setTime] = useState({ hours: 12, minutes: 0 });
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [description, setDescription] = useState("");

  // Load user ID and fetch events
  useEffect(() => {
    const loadUserAndEvents = async () => {
      try {
        // Get current user ID
        const storedUserId = await AsyncStorage.getItem("userId");
        setUserId(storedUserId);

        // Get user role
        if (storedUserId) {
          const userRef = ref(db, `users/${storedUserId}`);
          const userSnapshot = await get(userRef);
          if (userSnapshot.exists()) {
            const userData = userSnapshot.val();
            setUserRole(userData.role);
          }
        }

        // Fetch events
        const eventsRef = ref(db, "events");
        const eventsSnapshot = await get(eventsRef);
        
        if (eventsSnapshot.exists()) {
          const eventsData = eventsSnapshot.val();
          
          // Fetch buildings to get eventParticipants from each building
          const buildingsRef = ref(db, "edificios");
          const buildingsSnapshot = await get(buildingsRef);
          const buildingsData = buildingsSnapshot.exists() ? buildingsSnapshot.val() : {};
          
          // Get user control number for checking registration
          let userControl = null;
          if (storedUserId) {
            const userRef = ref(db, `users/${storedUserId}`);
            const userSnapshot = await get(userRef);
            if (userSnapshot.exists()) {
              userControl = userSnapshot.val().control;
            }
          }
          
          // Transform events data
          const eventsList = Object.keys(eventsData).map((eventId) => {
            const event = eventsData[eventId];
            
            // Find the building that contains this event's eventParticipants
            let participantsData = {};
            let buildingId = null;
            
            for (const [bId, building] of Object.entries(buildingsData)) {
              if (building.name === event.Lugar && building.eventParticipants && building.eventParticipants[eventId]) {
                participantsData = building.eventParticipants[eventId];
                buildingId = bId;
                break;
              }
            }
            
            // Check if user is registered for this event
            const isRegistered = userControl && 
                                participantsData[userControl] &&
                                participantsData[userControl].isRegistered;
            
            // Count participants
            const participants = Object.keys(participantsData).length;
            
            // Parse date and time
            const eventDate = new Date(event.Fecha);
            const today = new Date();
            const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const eventDateOnly = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
            const isToday = eventDateOnly.getTime() === todayDateOnly.getTime();
            
            // Format date for display (DD/MMM/YY)
            const months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
            const day = String(eventDate.getDate()).padStart(2, '0');
            const month = months[eventDate.getMonth()];
            const year = String(eventDate.getFullYear()).slice(-2);
            const formattedDate = `${day}/${month}/${year}`;
            
            // Format time (HH:MM AM/PM)
            let hours = eventDate.getHours();
            const minutes = eventDate.getMinutes();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // 0 should be 12
            const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${ampm}`;
            
            return {
              id: eventId,
              title: event.Nombre,
              location: event.Lugar,
              date: formattedDate,
              time: formattedTime,
              participants: participants,
              description: event.Descripcion,
              imageUri: event.imageUri || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop",
              category: event.Categoria,
              professor: "",
              isAssignature: false,
              isRegistered: isRegistered || false,
              isToday: isToday,
              sortDate: eventDate,
              status: event.Status,
              buildingId: buildingId,
            };
          });
          
          // Filter only active events
          const activeEvents = eventsList.filter(event => event.status === "Activo");
          
          // Sort events by date
          activeEvents.sort((a, b) => a.sortDate - b.sortDate);
          
          setEvents(activeEvents);
          
          // Set registered events
          const registered = activeEvents
            .filter(e => e.isRegistered)
            .map(e => e.id);
          setRegisteredEvents(registered);
        }
      } catch (error) {
        console.error("❌ Error loading events:", error);
        Alert.alert("Error", "No se pudieron cargar los eventos");
      } finally {
        setLoadingEvents(false);
      }
    };

    loadUserAndEvents();
  }, []);

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
                setScanActive(false);
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
    let filtered = events;

    // Filter by selected building
    if (selectedBuilding) {
      filtered = filtered.filter((event) => event.location === selectedBuilding.name);
    }

    // Filter by category
    if (selectedCategory !== "Todos") {
      filtered = filtered.filter((event) => event.category === selectedCategory);
    }

    // Sort: Today's events first, then by date/time
    return filtered.sort((a, b) => {
      // Prioritize today's events
      if (a.isToday && !b.isToday) return -1;
      if (!a.isToday && b.isToday) return 1;

      // Then sort by date and time
      return a.sortDate - b.sortDate;
    });
  };

  const filteredEvents = getFilteredAndSortedEvents();

  const toggleRegistration = async (eventId) => {
    try {
      // Get current user data
      if (!userId) {
        Alert.alert("Error", "No se pudo identificar al usuario");
        return;
      }

      const userRef = ref(db, `users/${userId}`);
      const userSnapshot = await get(userRef);
      
      if (!userSnapshot.exists()) {
        Alert.alert("Error", "Usuario no encontrado");
        return;
      }

      const userData = userSnapshot.val();
      const userControl = userData.control;

      // Find the event
      const event = events.find(e => e.id === eventId);
      if (!event) {
        Alert.alert("Error", "Evento no encontrado");
        return;
      }

      // Find the building ID for this event
      if (!event.buildingId) {
        Alert.alert("Error", "No se pudo identificar el edificio del evento");
        return;
      }

      const isCurrentlyRegistered = registeredEvents.includes(eventId);

      if (isCurrentlyRegistered) {
        // Unregister from event
        
        // Remove from building's eventParticipants
        const participantRef = ref(db, `edificios/${event.buildingId}/eventParticipants/${eventId}/${userControl}`);
        await set(participantRef, null);

        // Remove from user's historialEventos
        const historialRef = ref(db, `users/${userId}/historialEventos/${event.location}/${eventId}`);
        await set(historialRef, null);

        // Update local state
        setRegisteredEvents(prev => prev.filter(id => id !== eventId));
        
        // Update events list to reflect unregistration
        setEvents(prevEvents => 
          prevEvents.map(e => 
            e.id === eventId 
              ? { ...e, isRegistered: false, participants: Math.max(0, e.participants - 1) }
              : e
          )
        );

        Alert.alert("Éxito", "Te has desregistrado del evento");
      } else {
        // Register to event
        const now = new Date().toISOString();

        // Add to building's eventParticipants
        const participantRef = ref(db, `edificios/${event.buildingId}/eventParticipants/${eventId}/${userControl}`);
        await set(participantRef, {
          isRegistered: true,
          registeredAt: now,
          isPresent: false
        });

        // Add to user's historialEventos
        const historialRef = ref(db, `users/${userId}/historialEventos/${event.location}/${eventId}`);
        await set(historialRef, {
          nombre: event.title,
          fecha: event.sortDate.toISOString().split('T')[0] // Format: YYYY-MM-DD
        });

        // Update local state
        setRegisteredEvents(prev => [...prev, eventId]);
        
        // Update events list to reflect registration
        setEvents(prevEvents => 
          prevEvents.map(e => 
            e.id === eventId 
              ? { ...e, isRegistered: true, participants: e.participants + 1 }
              : e
          )
        );

        Alert.alert("Éxito", `Te has registrado exitosamente a "${event.title}"`);
      }
    } catch (error) {
      console.error("❌ Error toggling registration:", error);
      Alert.alert("Error", "No se pudo completar la operación. Intenta de nuevo.");
    }
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
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.colors.primary}
        translucent={false}
      />
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

        {/* Modal selector de edificios */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={buildingSelectorVisible}
          onRequestClose={() => setBuildingSelectorVisible(false)}
        >
          <Pressable 
            style={styles.modalOverlay} 
            onPress={() => setBuildingSelectorVisible(false)}
          >
            <Pressable
              style={[
                styles.buildingSelectorModal,
                { backgroundColor: theme.colors.surface },
              ]}
              onPress={(e) => e.stopPropagation()}
            >
              <View style={styles.buildingSelectorHeader}>
                <Text style={[styles.buildingSelectorTitle, { color: theme.colors.text }]}>
                  Seleccionar Edificio
                </Text>
                <IconButton
                  icon="close"
                  size={24}
                  onPress={() => setBuildingSelectorVisible(false)}
                />
              </View>
              
              <Divider />
              
              <ScrollView style={styles.buildingsList}>
                {buildings.map((building) => (
                  <TouchableOpacity
                    key={building.id}
                    style={[
                      styles.buildingItem,
                      selectedBuilding?.id === building.id && styles.buildingItemSelected,
                      { borderBottomColor: theme.colors.border }
                    ]}
                    onPress={() => {
                      setSelectedBuilding(building);
                      setBuildingSelectorVisible(false);
                    }}
                  >
                    <View style={styles.buildingItemContent}>
                      <Ionicons 
                        name="business" 
                        size={24} 
                        color={selectedBuilding?.id === building.id ? "#6B46C1" : "#666"} 
                      />
                      <Text 
                        style={[
                          styles.buildingItemText,
                          { color: selectedBuilding?.id === building.id ? "#6B46C1" : theme.colors.text }
                        ]}
                      >
                        {building.name}
                      </Text>
                    </View>
                    {selectedBuilding?.id === building.id && (
                      <Ionicons name="checkmark-circle" size={24} color="#6B46C1" />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </Pressable>
          </Pressable>
        </Modal>
      </Portal>
      {/*  */}

      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        {/* Título */}
        <View style={styles.headerLeft}>
          <View style={styles.headerTitle}>
            <Text
              style={[styles.headerMainText, { color: theme.colors.onPrimary }]}
            >
              Eventos /
            </Text>
            <Text
              style={[styles.headerSubText, { color: theme.colors.onPrimary }]}
            >
              Salones
            </Text>
          </View>
        </View>

        {/* Botón Admin - Solo visible para usuarios con rol "admin" */}
        {/* {userRole === "admin" && (
          <TouchableOpacity
            onPress={() => setAdmin(!admin)}
            style={{ marginLeft: 15 }}
          >
            <Text
              style={[styles.adminButtonText, { color: theme.colors.onPrimary }]}
            >
              {admin ? "Salir Admin" : "Entrar Admin"}
            </Text>
          </TouchableOpacity>
        )} */}

        {/* Selector de edificio */}
        <TouchableOpacity
          onPress={() => setBuildingSelectorVisible(true)}
          style={styles.locationButton}
        >
          <Text style={[styles.locationText, { color: theme.colors.onPrimary }]}>
            {selectedBuilding ? selectedBuilding.name : "Seleccionar"}
          </Text>
          <Ionicons name="location-sharp" size={20} color={theme.colors.onPrimary} />
        </TouchableOpacity>
      </View>

      {/* Category Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[
          styles.chipsScrollView,
          { backgroundColor: theme.colors.background },
        ]}
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
                backgroundColor:
                  selectedCategory === category
                    ? theme.colors.primary
                    : theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
            textStyle={[
              styles.chipText,
              {
                color:
                  selectedCategory === category
                    ? theme.colors.onPrimary
                    : theme.colors.text,
              },
            ]}
            mode="outlined"
          >
            {category}
          </Chip>
        ))}
      </ScrollView>
        {userRole === "admin" && (
          <FAB
        style={styles.fab}
        icon="plus"
        size="medium"
        onPress={onAddEventHandler}
      />
        )}
      

      {/* Events List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {loadingEvents ? (
          // Skeleton Loading
          <>
            {[1, 2, 3].map((index) => (
              <Card
                key={`skeleton-${index}`}
                style={styles.eventCard}
                mode="elevated"
              >
                <View style={styles.eventHeader}>
                  <Surface style={styles.skeletonAvatar} />
                  <View style={styles.eventHeaderText}>
                    <Surface style={styles.skeletonTitle} />
                    <Surface style={styles.skeletonDate} />
                  </View>
                </View>

                <Surface style={styles.skeletonImage} />

                <Card.Content style={styles.cardContent}>
                  <View style={styles.eventFooter}>
                    <View style={styles.eventInfo}>
                      <Surface style={styles.skeletonTitleBold} />
                      <Surface style={styles.skeletonLocation} />
                    </View>
                  </View>
                  <Surface style={styles.skeletonDescription} />
                  <Surface style={[styles.skeletonDescription, { width: '70%' }]} />
                </Card.Content>
              </Card>
            ))}
          </>
        ) : filteredEvents.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No hay eventos disponibles</Text>
          </View>
        ) : (
          filteredEvents.map((event, index) => (
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
                <Text style={[styles.eventTitle, { color: theme.colors.text }]}>
                  {event.title}
                </Text>
                <Text
                  style={[
                    styles.eventDate,
                    { color: theme.colors.textSecondary },
                  ]}
                >
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
                  <Text
                    style={[
                      styles.eventTitleBold,
                      { color: theme.colors.text },
                    ]}
                  >
                    {event.title}
                  </Text>
                  <Text
                    style={[
                      styles.eventLocation,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    {event.location}
                  </Text>
                </View>
                <View style={styles.participantsContainer}>
                  <Ionicons name="people" size={16} color="#666" />
                  <Text style={styles.participantsText}>
                    {event.participants}
                  </Text>
                </View>
              </View>

              {event.description && (
                <Text
                  style={[
                    styles.eventDescription,
                    { color: theme.colors.textSecondary },
                  ]}
                  numberOfLines={3}
                >
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
        ))
        )}
      </ScrollView>

      {/* FAB */}
      {admin && (
        <FAB
          icon="plus"
          style={styles.fab}
          size="medium"
          onPress={onAddEventHandler}
        />
      )}

      {/* Bottom Navigation */}
      <View
        style={[
          styles.bottomNav,
          {
            backgroundColor: theme.colors.surface,
            borderTopColor: theme.colors.border,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Perfil")}
        >
          <Ionicons
            name="person-outline"
            size={24}
            color={theme.colors.textSecondary}
          />
          <Text style={[styles.navText, { color: theme.colors.textSecondary }]}>
            Perfil
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
          <Ionicons name="home" size={24} color={theme.colors.text} />
          <Text
            style={[
              styles.navText,
              styles.navTextActive,
              { color: theme.colors.text },
            ]}
          >
            Inicio
          </Text>
          <View
            style={[
              styles.activeIndicator,
              { backgroundColor: theme.colors.primary },
            ]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("History")}
        >
          <Ionicons
            name="calendar-outline"
            size={24}
            color={theme.colors.textSecondary}
          />
          <Text style={[styles.navText, { color: theme.colors.textSecondary }]}>
            Eventos
          </Text>
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
              style={[
                styles.modalContent,
                { backgroundColor: theme.colors.surface },
              ]}
              onPress={(e) => e.stopPropagation()}
            >
              {selectedEvent && (
                <>
                  <Surface
                    style={[
                      styles.modalHeader,
                      { backgroundColor: theme.colors.surface },
                    ]}
                    elevation={0}
                  >
                    <Avatar.Text
                      size={48}
                      label={selectedEvent.title.charAt(0).toUpperCase()}
                      style={styles.modalIconContainer}
                      labelStyle={styles.modalIcon}
                    />
                    <View style={styles.modalHeaderText}>
                      <Text
                        style={[
                          styles.modalTitle,
                          { color: theme.colors.text },
                        ]}
                      >
                        {selectedEvent.title}
                      </Text>
                      <Text
                        style={[
                          styles.modalSubtitle,
                          { color: theme.colors.textSecondary },
                        ]}
                      >
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
                      <Text
                        style={[
                          styles.modalProfessor,
                          { color: theme.colors.text },
                        ]}
                      >
                        {selectedEvent.professor}
                      </Text>
                    )}

                    <View style={styles.modalInfoRow}>
                      <Ionicons
                        name="calendar"
                        size={20}
                        color={theme.colors.textSecondary}
                      />
                      <Text
                        style={[
                          styles.modalInfoText,
                          { color: theme.colors.textSecondary },
                        ]}
                      >
                        {selectedEvent.date}
                      </Text>
                    </View>

                    <View style={styles.modalInfoRow}>
                      <Ionicons
                        name="time"
                        size={20}
                        color={theme.colors.textSecondary}
                      />
                      <Text
                        style={[
                          styles.modalInfoText,
                          { color: theme.colors.textSecondary },
                        ]}
                      >
                        {selectedEvent.time}
                      </Text>
                    </View>

                    <View style={styles.modalInfoRow}>
                      <Ionicons
                        name="people"
                        size={20}
                        color={theme.colors.textSecondary}
                      />
                      <Text
                        style={[
                          styles.modalInfoText,
                          { color: theme.colors.textSecondary },
                        ]}
                      >
                        {selectedEvent.participants}
                      </Text>
                    </View>

                    <View style={styles.modalInfoRow}>
                      <Ionicons
                        name="location"
                        size={20}
                        color={theme.colors.textSecondary}
                      />
                      <Text
                        style={[
                          styles.modalInfoText,
                          { color: theme.colors.textSecondary },
                        ]}
                      >
                        {selectedEvent.location}
                      </Text>
                    </View>

                    <Text
                      style={[
                        styles.modalDescription,
                        { color: theme.colors.textSecondary },
                      ]}
                    >
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
          contentContainerStyle={[
            styles.modalContainer,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Nuevo evento
            </Text>
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
    </View>
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
    paddingTop: 12,
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
  // Skeleton loading styles
  skeletonAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
  },
  skeletonTitle: {
    width: 120,
    height: 16,
    borderRadius: 4,
    backgroundColor: "#e0e0e0",
    marginBottom: 8,
  },
  skeletonDate: {
    width: 80,
    height: 14,
    borderRadius: 4,
    backgroundColor: "#e0e0e0",
  },
  skeletonImage: {
    width: "100%",
    height: 200,
    backgroundColor: "#e0e0e0",
    marginVertical: 8,
  },
  skeletonTitleBold: {
    width: 150,
    height: 18,
    borderRadius: 4,
    backgroundColor: "#e0e0e0",
    marginBottom: 8,
  },
  skeletonLocation: {
    width: 100,
    height: 14,
    borderRadius: 4,
    backgroundColor: "#e0e0e0",
  },
  skeletonDescription: {
    width: "100%",
    height: 14,
    borderRadius: 4,
    backgroundColor: "#e0e0e0",
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: "#999",
  },
  // Building Selector Modal styles
  buildingSelectorModal: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: "100%",
    maxHeight: "70%",
    position: "absolute",
    bottom: 0,
  },
  buildingSelectorHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 20,
    paddingRight: 8,
    paddingVertical: 12,
  },
  buildingSelectorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  buildingsList: {
    maxHeight: 400,
  },
  buildingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  buildingItemSelected: {
    backgroundColor: "#F5F3FF",
  },
  buildingItemContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  buildingItemText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
});
