import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Modal,
  Pressable,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
  Card,
  Avatar,
  Button,
  IconButton,
  Portal,
  Surface,
  Divider,
  List,
  Chip,
} from "react-native-paper";

// Mock data for attended events history
const ATTENDED_EVENTS = [
  {
    id: 1,
    title: "Campeonato Basket",
    location: "Cancha",
    date: "10/NOV/25",
    time: "10:00 AM",
    participants: 15,
    description: "Torneo de baloncesto entre diferentes facultades. Participa y apoya a tu equipo.",
    imageUri: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop",
    category: "Deportes",
    attendedAt: new Date("2025-11-10T10:00:00"),
  },
  {
    id: 2,
    title: "Taller de Fotografía",
    location: "Sala de Arte",
    date: "08/NOV/25",
    time: "10:00 AM",
    participants: 25,
    description: "Aprende técnicas básicas y avanzadas de fotografía digital con profesionales del área.",
    imageUri: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400&h=300&fit=crop",
    category: "Cultural",
    attendedAt: new Date("2025-11-08T10:00:00"),
  },
  {
    id: 3,
    title: "Concierto de Jazz",
    location: "Auditorio Principal",
    date: "05/NOV/25",
    time: "07:00 PM",
    participants: 80,
    description: "Noche de jazz con músicos locales e internacionales. Una experiencia musical única.",
    imageUri: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400&h=300&fit=crop",
    category: "Cultural",
    attendedAt: new Date("2025-11-05T19:00:00"),
  },
  {
    id: 4,
    title: "Feria de residencias",
    location: "Auditorio",
    date: "01/NOV/25",
    time: "09:00 AM",
    participants: 20,
    description: "Estudiantes y egresados conectan con empresas para encontrar residencias profesionales y oportunidades laborales.",
    imageUri: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop",
    category: "Deportes",
    attendedAt: new Date("2025-11-01T09:00:00"),
  },
  {
    id: 5,
    title: "Hackathon 2025",
    location: "Laboratorio de Innovación",
    date: "28/OCT/25",
    time: "08:00 AM",
    participants: 60,
    description: "Evento de programación de 24 horas. Forma tu equipo y crea soluciones innovadoras.",
    imageUri: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop",
    category: "Academico",
    attendedAt: new Date("2025-10-28T08:00:00"),
  },
];

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
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const groupedEvents = groupEventsByLocation(ATTENDED_EVENTS);

  const openEventModal = (event) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedEvent(null);
  };

  return (
    <SafeAreaView style={styles.container} >
      <StatusBar barStyle="dark-content" backgroundColor= "#fff" />

      {/* Header */}
      {/* <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu" size={24} color="#000" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerMainText}>Historial de eventos</Text>
          </View>
        </View>
        <View style={styles.headerPlaceholder} />
      </View> */}

      {/* Events List Grouped by Location */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {Object.keys(groupedEvents).map((location) => (
          <View key={location} style={styles.locationGroup}>
            {/* Location Header */}
            <View style={styles.locationHeader}>
              <Text style={styles.locationTitle}>{location}</Text>
              <Ionicons name="location-sharp" size={20} color="#000" />
            </View>

            {/* Events in this location */}
            {groupedEvents[location].map((event) => (
              <Card
                key={event.id}
                style={styles.eventCard}
                onPress={() => openEventModal(event)}
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
                    <Text style={styles.eventTitle}>{event.title}</Text>
                    <Text style={styles.eventDate}>
                      {event.date} {event.time}
                    </Text>
                  </View>
                  <Button
                    mode="text"
                    onPress={() => openEventModal(event)}
                    icon="dots-horizontal"
                    textColor="#6B46C1"
                    compact
                  >
                    Más info
                  </Button>
                </View>
              </Card>
            ))}
          </View>
        ))}

        {ATTENDED_EVENTS.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={64} color="#ccc" />
            <Text style={styles.emptyStateText}>
              No has asistido a ningún evento aún
            </Text>
            <Text style={styles.emptyStateSubtext}>
              Los eventos a los que asistas aparecerán aquí
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <IconButton
        icon="history"
        mode="contained"
        size={28}
        iconColor="#fff"
        containerColor="#6B46C1"
        style={styles.fab}
        onPress={() => {
          // Could navigate to a calendar view or filter options
          console.log("Show filter/calendar options");
        }}
      />

      {/* Bottom Navigation */}
      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('Perfil')}
        >
          <Ionicons name="person-outline" size={24} color="#666" />
          <Text style={styles.navText}>Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('Home')}
        >
          <Ionicons name="home" size={24} color="#666" />
          <Text style={styles.navText}>Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
          <Ionicons name="calendar-outline" size={24} color="#000" />
          <Text style={[styles.navText, styles.navTextActive]}>Eventos</Text>
          <View style={styles.activeIndicator} />
        </TouchableOpacity>
      </View>      {/* Event Detail Modal */}
      <Portal>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <Pressable style={styles.modalOverlay} onPress={closeModal}>
            <Pressable
              style={styles.modalContent}
              onPress={(e) => e.stopPropagation()}
            >
              {selectedEvent && (
                <>
                  <Surface style={styles.modalHeader} elevation={0}>
                    <Avatar.Text
                      size={48}
                      label={selectedEvent.title.charAt(0).toUpperCase()}
                      style={styles.modalIconContainer}
                      labelStyle={styles.modalIcon}
                    />
                    <View style={styles.modalHeaderText}>
                      <Text style={styles.modalTitle}>
                        {selectedEvent.title}
                      </Text>
                      <Text style={styles.modalSubtitle}>
                        {selectedEvent.date} {selectedEvent.time}
                      </Text>
                    </View>
                    <IconButton icon="close" size={24} onPress={closeModal} />
                  </Surface>

                  {selectedEvent.imageUri && (
                    <Image
                      source={{ uri: selectedEvent.imageUri }}
                      style={styles.modalImage}
                    />
                  )}

                  <ScrollView style={styles.modalDetails}>
                    <Chip
                      icon="check-circle"
                      textStyle={styles.attendedChipText}
                      style={styles.attendedChip}
                    >
                      Asistido
                    </Chip>

                    <View style={styles.modalInfoRow}>
                      <Ionicons name="calendar" size={20} color="#666" />
                      <Text style={styles.modalInfoText}>
                        {selectedEvent.date}
                      </Text>
                    </View>

                    <View style={styles.modalInfoRow}>
                      <Ionicons name="time" size={20} color="#666" />
                      <Text style={styles.modalInfoText}>
                        {selectedEvent.time}
                      </Text>
                    </View>

                    <View style={styles.modalInfoRow}>
                      <Ionicons name="people" size={20} color="#666" />
                      <Text style={styles.modalInfoText}>
                        {selectedEvent.participants} participantes
                      </Text>
                    </View>

                    <View style={styles.modalInfoRow}>
                      <Ionicons name="location" size={20} color="#666" />
                      <Text style={styles.modalInfoText}>
                        {selectedEvent.location}
                      </Text>
                    </View>

                    <Divider style={styles.modalDivider} />

                    <Text style={styles.modalDescriptionTitle}>
                      Descripción
                    </Text>
                    <Text style={styles.modalDescription}>
                      {selectedEvent.description}
                    </Text>
                  </ScrollView>

                  <Divider />

                  <View style={styles.modalFooter}>
                    <Button
                      mode="outlined"
                      onPress={closeModal}
                      style={styles.modalButton}
                    >
                      Cerrar
                    </Button>
                  </View>
                </>
              )}
            </Pressable>
          </Pressable>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
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
