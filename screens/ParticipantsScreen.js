import React from "react";
import { View, StyleSheet, FlatList, StatusBar } from "react-native";
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

const participants = [
  { id: "1", name: "Juan Pérez", controlNumber: "21100123", semester: "6°" },
  { id: "2", name: "María López", controlNumber: "21100456", semester: "4°" },
  { id: "3", name: "Carlos Hernández", controlNumber: "21100789", semester: "8°" },
  { id: "4", name: "Ana García", controlNumber: "21100234", semester: "5°" },
  { id: "5", name: "Luis Martínez", controlNumber: "21100567", semester: "7°" },
];

export default function ParticipantsScreen({ navigation, route }) {
  const { eventName = "Evento" } = route?.params || {};

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
              Semestre {item.semester}
            </Text>
          </View>
        </View>
        <Ionicons name="checkmark-circle" size={24} color="#10B981" />
      </Card.Content>
    </Card>
  );

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
            Participantes
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
      />
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
