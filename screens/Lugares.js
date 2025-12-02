import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button } from 'react-native-paper'; // ← 🔹 usamos botón Material
import { useTheme } from '../context/ThemeContext';

export default function Lugares({ navigation }) {
  const { theme } = useTheme();
  const [lugares, setLugares] = useState([
    { id: 1, nombre: 'Sala Audiovisual', favorito: false, tipo: 'audiovisual' },
    { id: 2, nombre: 'Salón Cultural, Música, Baile', favorito: false, tipo: 'cultural' },
    { id: 3, nombre: 'Unidad de Posgrado e Investigación', favorito: false, tipo: 'posgrado' },
    { id: 4, nombre: 'Centro de Idiomas', favorito: false, tipo: 'idiomas' },
    { id: 5, nombre: 'Departamento de Ciencias Básicas', favorito: false, tipo: 'basicas' },
    { id: 6, nombre: 'Gimnasio Auditorio', favorito: false, tipo: 'auditorio' },
    { id: 7, nombre: 'Alberca Semiolímpica', favorito: false, tipo: 'alberca' },
    { id: 8, nombre: 'Campo de Futbol, Pista de Atletismo', favorito: false, tipo: 'futbol' },
    { id: 9, nombre: 'Campo de Beisbol', favorito: false, tipo: 'beisbol' },
    { id: 10, nombre: 'Departamento de Sistemas Computacionales', favorito: false, tipo: 'sistemas' },
  ]);

  const toggleFavorito = (id) => {
    setLugares((prev) =>
      prev.map((l) => (l.id === id ? { ...l, favorito: !l.favorito } : l))
    );
  };

  const lugaresMostrados = lugares;

  const handleUbicacionActual = () => {
    // Aquí puedes integrar geolocalización (expo-location o similar)
    console.log('📍 Obtener ubicación actual...');
    navigation.navigate('Home');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.dark ? theme.colors.surface : '#EDE3F7' }]}>
        <Text style={styles.headerIcon}>📱</Text>
        <Text style={[styles.headerTitle, { color: theme.colors.primary }]}>Lugares</Text>
      </View>

      {/* Lista de lugares */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {lugaresMostrados.map((lugar) => (
          <View key={lugar.id} style={styles.lugarContainer}>
            {/* Botón principal */}
            <TouchableOpacity
              style={[
                styles.lugarButton,
                { backgroundColor: theme.colors.surface },
                lugar.favorito && [styles.lugarFavorito, { backgroundColor: theme.dark ? theme.colors.surfaceVariant : '#FFF9E6' }],
              ]}
              onPress={() => navigation.navigate('Home', { tipo: lugar.tipo })}
            >
              <View style={[styles.circle, { backgroundColor: theme.dark ? theme.colors.primary : '#D8C7F9' }]} />
              <Text style={[styles.lugarText, { color: theme.colors.text }]}>{lugar.nombre}</Text>
            </TouchableOpacity>

            {/* Botón de favorito */}
            <TouchableOpacity onPress={() => toggleFavorito(lugar.id)} style={styles.starButton}>
              <MaterialCommunityIcons
                name={lugar.favorito ? 'star' : 'star-outline'}
                size={22}
                color={lugar.favorito ? '#FFD700' : theme.colors.primary}
              />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Footer - Botón Material */}
      <View style={styles.footer}>
        <Button
          mode="contained-tonal"
          icon="map-marker"
          onPress={handleUbicacionActual}
          contentStyle={{ flexDirection: 'row-reverse' }} // icono a la izquierda
          style={[styles.locationButton, { backgroundColor: theme.dark ? theme.colors.surface : '#EDE3F7' }]}
          labelStyle={[styles.locationText, { color: theme.colors.primary }]}
        >
          Ubicación actual
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2ff',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    backgroundColor: '#EDE3F7',
    borderRadius: 20,
    alignItems: 'center',
    paddingVertical: 25,
    marginBottom: 20,
  },
  headerIcon: { fontSize: 24 },
  headerTitle: {
    fontSize: 20,
    color: '#4A3B75',
    fontWeight: '600',
    marginTop: 8,
  },
  scrollContainer: { flex: 1 },
  lugarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  lugarButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  lugarFavorito: {
    backgroundColor: '#FFF9E6',
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#D8C7F9',
    marginRight: 10,
  },
  lugarText: {
    flex: 1,
    color: '#4A3B75',
    fontSize: 16,
    fontWeight: '500',
  },
  starButton: {
    position: 'absolute',
    right: 15,
    padding: 5,
  },
  footer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  locationButton: {
    borderRadius: 25,
    backgroundColor: '#EDE3F7',
  },
  locationText: {
    color: '#4A3B75',
    fontWeight: '600',
  },
});
