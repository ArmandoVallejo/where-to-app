import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, StatusBar, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  List,
  Avatar,
  Text,
  Divider,
  Card,
  Surface,
  IconButton
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from 'react-i18next';
import { ref, get } from "firebase/database";
import { db } from "../config/config";

export default function ParticipantsScreen({ navigation, route }) {
  const { t } = useTranslation();
  const { eventName = t('participants.event'), eventId, buildingId } = route?.params || {};
  
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadParticipants = async () => {
      try {
        console.log("🔍 Loading participants for:", { eventId, buildingId });
        
        if (!eventId || !buildingId) {
          console.log("❌ Missing eventId or buildingId:", { eventId, buildingId });
          setLoading(false);
          return;
        }

        // Cargar participantes del evento desde Firebase
        const participantsPath = `edificios/${buildingId}/eventParticipants/${eventId}`;
        console.log("📍 Firebase path:", participantsPath);
        
        const participantsRef = ref(db, participantsPath);
        const snapshot = await get(participantsRef);

        console.log("📦 Snapshot exists:", snapshot.exists());

        if (snapshot.exists()) {
          const participantsData = snapshot.val();
          console.log("📋 Participants data:", JSON.stringify(participantsData, null, 2));
          console.log("📊 Number of controls:", Object.keys(participantsData).length);

          // Obtener información de cada usuario
          const participantsList = await Promise.all(
            Object.keys(participantsData).map(async (control) => {
              const participantInfo = participantsData[control];
              console.log(`👤 Processing control: ${control}`, participantInfo);
              
              // Solo incluir si está registrado
              if (participantInfo.isRegistered) {
                // Obtener información del usuario
                const userRef = ref(db, `users/${control}`);
                const userSnapshot = await get(userRef);
                
                console.log(`🔍 User ${control} exists:`, userSnapshot.exists());
                
                if (userSnapshot.exists()) {
                  const userData = userSnapshot.val();
                  console.log(`✅ User data for ${control}:`, userData);
                  return {
                    id: control,
                    name: userData.nombre || userData.name || "Usuario",
                    controlNumber: control,
                    semester: userData.semestre || userData.semester || "N/A",
                    registeredAt: participantInfo.registeredAt,
                    isPresent: participantInfo.isPresent || false,
                  };
                } else {
                  console.log(`⚠️ User ${control} not found in users/, using control as name`);
                  // Si no existe el usuario, mostrar el control como nombre
                  return {
                    id: control,
                    name: control,
                    controlNumber: control,
                    semester: "N/A",
                    registeredAt: participantInfo.registeredAt,
                    isPresent: participantInfo.isPresent || false,
                  };
                }
              } else {
                console.log(`⏭️ Skipping ${control} - not registered`);
              }
              return null;
            })
          );

          console.log("📝 Participants list before filter:", participantsList);

          // Filtrar nulos y ordenar por fecha de registro
          const validParticipants = participantsList
            .filter(p => p !== null)
            .sort((a, b) => new Date(a.registeredAt) - new Date(b.registeredAt));

          console.log("✅ Valid participants:", validParticipants.length, validParticipants);
          setParticipants(validParticipants);
        } else {
          console.log("📋 No participants found at path:", participantsPath);
          setParticipants([]);
        }
      } catch (error) {
        console.error("❌ Error loading participants:", error);
        setParticipants([]);
      } finally {
        setLoading(false);
      }
    };

    loadParticipants();
  }, [eventId, buildingId]);

  const renderItem = ({ item }) => (
    <Card style={styles.card} mode="elevated">
      <Card.Content style={styles.cardContent}>
        <Avatar.Text
          label={item.name[0].toUpperCase()}
          size={56}
          style={styles.avatar}
          labelStyle={styles.avatarLabel}
        />
        <View style={styles.participantInfo}>
          <Text variant="titleMedium" style={styles.name}>
            {item.name}
          </Text>
          <View style={styles.infoRow}>
            <Ionicons name="card-outline" size={16} color="#666" />
            <Text variant="bodyMedium" style={styles.infoText}>
              {item.controlNumber}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="school-outline" size={16} color="#666" />
            <Text variant="bodyMedium" style={styles.infoText}>
              {t('participants.semester')} {item.semester}
            </Text>
          </View>
        </View>
        <Ionicons 
          name={item.isPresent ? "checkmark-circle" : "time-outline"} 
          size={24} 
          color={item.isPresent ? "#10B981" : "#F59E0B"} 
        />
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <Surface style={styles.header} elevation={1}>
          <IconButton
            icon="arrow-left"
            size={24}
            onPress={() => navigation.goBack()}
            iconColor="#000"
          />
          <View style={styles.headerContent}>
            <Text variant="titleLarge" style={styles.headerTitle}>
              {t('participants.title')}
            </Text>
            <Text variant="bodyMedium" style={styles.headerSubtitle}>
              {eventName}
            </Text>
          </View>
        </Surface>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6B46C1" />
          <Text style={styles.loadingText}>Cargando participantes...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <Surface style={styles.header} elevation={1}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
          iconColor="#000"
        />
        <View style={styles.headerContent}>
          <Text variant="titleLarge" style={styles.headerTitle}>
            {t('participants.title')}
          </Text>
          <Text variant="bodyMedium" style={styles.headerSubtitle}>
            {eventName}
          </Text>
        </View>
        <View style={styles.headerRight}>
          <Text variant="titleMedium" style={styles.participantCount}>
            {participants.length}
          </Text>
        </View>
      </Surface>

      <FlatList
        data={participants}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={64} color="#BDBDBD" />
            <Text variant="titleMedium" style={styles.emptyTitle}>
              No hay participantes
            </Text>
            <Text variant="bodyMedium" style={styles.emptyText}>
              Aún no hay usuarios registrados en este evento
            </Text>
          </View>
        )}
      />
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
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    paddingHorizontal: 32,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerContent: {
    flex: 1,
    marginLeft: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  headerRight: {
    backgroundColor: "#E9D5FF",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  participantCount: {
    color: "#6B46C1",
    fontWeight: "700",
  },
  listContainer: {
    padding: 16,
    gap: 12,
  },
  card: {
    borderRadius: 12,
    backgroundColor: "#fff",
    marginBottom: 12,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  avatar: {
    backgroundColor: "#E9D5FF",
    marginRight: 16,
  },
  avatarLabel: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#6B46C1",
  },
  participantInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
  },
});
