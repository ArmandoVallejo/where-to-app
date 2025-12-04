import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from 'react-i18next';
import {
  Card,
  Avatar,
  IconButton,
} from "react-native-paper";
import { useTheme } from "../context/ThemeContext";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ref, onValue } from 'firebase/database';
import { db } from '../config/config';

// Group events by location
const groupEventsByLocation = (events) => {
  const grouped = {};
  events.forEach((event) => {
    if (!grouped[event.location]) {
      grouped[event.location] = [];
    }
    grouped[event.location].push(event);
  });
  return grouped;
};

export default function HistoryScreen({ navigation }) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [attendedEvents, setAttendedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  // Cargar eventos del usuario desde Firebase
  useEffect(() => {
    loadUserEvents();
  }, []);

  const loadUserEvents = async () => {
    try {
      setLoading(true);
      
      // Obtener el userId de AsyncStorage
      const storedUserId = await AsyncStorage.getItem('userId');
      
      if (!storedUserId) {
        console.log("❌ No se encontró el ID de usuario");
        setLoading(false);
        return;
      }

      setUserId(storedUserId);
      console.log("📱 UserId recuperado:", storedUserId);

      // Cargar historial de eventos desde users/{userId}/historialEventos
      const historialRef = ref(db, `users/${storedUserId}/historialEventos`);
      
      onValue(historialRef, (snapshot) => {
        if (snapshot.exists()) {
          const historialData = snapshot.val();
          const userEvents = [];
          
          // Recorrer ubicaciones (Centro de computo, Salones A-C, etc.)
          for (const ubicacion in historialData) {
            const eventosEnUbicacion = historialData[ubicacion];
            
            // Recorrer eventos en cada ubicación
            for (const eventId in eventosEnUbicacion) {
              const eventData = eventosEnUbicacion[eventId];
              
              userEvents.push({
                id: eventId,
                title: eventData.nombre || eventData.title || 'Evento sin nombre',
                location: ubicacion, // La ubicación viene de la clave padre
                date: eventData.fecha || eventData.date || '',
                time: eventData.hora || eventData.time || '',
                participants: eventData.participantes || eventData.participants || 0,
                description: eventData.descripcion || eventData.description || '',
                imageUri: eventData.imagen || eventData.imageUri || null,
                category: eventData.categoria || eventData.category || 'General',
                attendedAt: eventData.fecha || new Date().toISOString(),
              });
            }
          }
          
          // Ordenar eventos por fecha (más reciente primero)
          userEvents.sort((a, b) => new Date(b.date) - new Date(a.date));
          
          console.log(`✅ ${userEvents.length} eventos cargados del historial`);
          setAttendedEvents(userEvents);
        } else {
          console.log("ℹ️ No hay eventos en el historial");
          setAttendedEvents([]);
        }
        
        setLoading(false);
      }, (error) => {
        console.error("❌ Error cargando eventos:", error);
        setLoading(false);
      });

    } catch (error) {
      console.error("❌ Error al cargar eventos:", error);
      setLoading(false);
    }
  };

  const groupedEvents = groupEventsByLocation(attendedEvents);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = String(date.getFullYear()).slice(-2);
      return `${day}/${month}/${year}`;
    } catch (error) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>
            Cargando historial...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.dark ? "light-content" : "dark-content"} backgroundColor={theme.colors.surface} />

      {/* Events List Grouped by Location */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {attendedEvents.length > 0 ? (
          Object.keys(groupedEvents).map((location) => (
            <View key={location} style={styles.locationGroup}>
              {/* Location Header */}
              <View style={styles.locationHeader}>
                <Text style={[styles.locationTitle, { color: theme.colors.text }]}>{location}</Text>
                <Ionicons name="location-sharp" size={20} color={theme.colors.text} />
              </View>

              {/* Events in this location */}
              {groupedEvents[location].map((event) => (
                <Card
                  key={event.id}
                  style={styles.eventCard}
                  mode="elevated"
                >
                  <View style={styles.eventContent}>
                    <Avatar.Text
                      size={48}
                      label={event.title.charAt(0).toUpperCase()}
                      style={styles.eventAvatar}
                      labelStyle={styles.avatarLabel}
                    />
                    <View style={styles.eventInfo}>
                      <Text style={[styles.eventTitle, { color: theme.colors.text }]}>{event.title}</Text>
                      <Text style={[styles.eventDate, { color: theme.colors.textSecondary }]}>
                        {formatDate(event.date)} {event.time}
                      </Text>
                    </View>
                    <Ionicons name="checkmark-circle" size={32} color="#10B981" />
                  </View>
                </Card>
              ))}
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={64} color={theme.colors.textSecondary} />
            <Text style={[styles.emptyStateText, { color: theme.colors.text }]}>
              {t('history.no_events')}
            </Text>
            <Text style={[styles.emptyStateSubtext, { color: theme.colors.textSecondary }]}>
              {t('history.attended_events')}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <IconButton
        icon="refresh"
        mode="contained"
        size={28}
        iconColor="#fff"
        containerColor={theme.colors.primary}
        style={styles.fab}
        onPress={() => {
          loadUserEvents();
        }}
      />

      {/* Bottom Navigation */}
      <View style={[styles.bottomNav, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border }]}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Perfil')}
        >
          <Ionicons name="person-outline" size={24} color={theme.colors.textSecondary} />
          <Text style={[styles.navText, { color: theme.colors.textSecondary }]}>{t('sidebar.profile')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Home')}
        >
          <Ionicons name="home" size={24} color={theme.colors.textSecondary} />
          <Text style={[styles.navText, { color: theme.colors.textSecondary }]}>{t('sidebar.home')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
          <Ionicons name="calendar-outline" size={24} color={theme.colors.text} />
          <Text style={[styles.navText, styles.navTextActive, { color: theme.colors.text }]}>{t('history.title')}</Text>
          <View style={[styles.activeIndicator, { backgroundColor: theme.colors.primary }]} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
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
  headerTitleContainer: {
    flexDirection: "column",
  },
  headerMainText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  headerPlaceholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 16,
    paddingBottom: 80,
  },
  locationGroup: {
    marginBottom: 24,
  },
  locationHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
  eventCard: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: "hidden",
  },
  eventContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  eventAvatar: {
    backgroundColor: "#E9D5FF",
  },
  avatarLabel: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#6B46C1",
  },
  eventInfo: {
    flex: 1,
    marginLeft: 12,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 13,
    color: "#666",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginTop: 16,
    textAlign: "center",
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    bottom: 80,
    right: 16,
    elevation: 4,
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
  navSpacer: {
    width: 16,
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
  modalImage: {
    width: "100%",
    height: 200,
  },
  modalDetails: {
    padding: 16,
    maxHeight: 300,
  },
  attendedChip: {
    backgroundColor: "#ECFDF5",
    alignSelf: "flex-start",
    marginBottom: 16,
  },
  attendedChipText: {
    color: "#10B981",
    fontWeight: "600",
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
  modalDivider: {
    marginVertical: 16,
  },
  modalDescriptionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  modalFooter: {
    padding: 16,
    paddingTop: 8,
  },
  modalButton: {
    borderRadius: 8,
  },
});