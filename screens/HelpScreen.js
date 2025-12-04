import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { User, Mail, Phone, BookOpen, MapPin, Globe, Palette, HelpCircle, LogOut, Edit, X, Check, Eye, EyeOff, Lock } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ref, push, get } from 'firebase/database';
import { db } from '../config/config';

export default function HelpScreen() {
  const { theme } = useTheme();
  
  // Estados para el formulario de ayuda
  const [asunto, setAsunto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  // Cargar información del usuario al iniciar
  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      
      if (userId) {
        const userRef = ref(db, `users/${userId}`);
        const snapshot = await get(userRef);
        
        if (snapshot.exists()) {
          const userData = snapshot.val();
          setUserName(userData.name || '');
          setUserEmail(userData.email || '');
        }
      }
    } catch (error) {
      console.error("Error cargando info del usuario:", error);
    }
  };

  const handleSendHelp = async () => {
    if (!asunto.trim() || !descripcion.trim()) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    try {
      setLoading(true);

      // Obtener el userId
      const userId = await AsyncStorage.getItem('userId');
      
      if (!userId) {
        Alert.alert("Error", "No se pudo identificar al usuario");
        setLoading(false);
        return;
      }

      // Crear el objeto del mensaje de ayuda
      const helpMessage = {
        userId: userId,
        userName: userName,
        userEmail: userEmail,
        asunto: asunto,
        descripcion: descripcion,
        timestamp: new Date().toISOString(),
        status: 'pending', // pending, in_progress, resolved
        createdAt: new Date().toISOString(),
      };

      // Guardar en Firebase bajo /helpMessages
      const helpMessagesRef = ref(db, 'helpMessages');
      await push(helpMessagesRef, helpMessage);

      console.log("✅ Mensaje de ayuda enviado exitosamente");
      
      Alert.alert(
        "Éxito",
        "Tu mensaje ha sido enviado. Nos pondremos en contacto contigo pronto.",
        [
          {
            text: "OK",
            onPress: () => {
              setAsunto("");
              setDescripcion("");
            }
          }
        ]
      );
    } catch (error) {
      console.error("❌ Error al enviar mensaje:", error);
      Alert.alert(
        "Error",
        "No se pudo enviar tu mensaje. Por favor intenta de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.editContainer, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.editForm}>
        <View style={styles.helpContent}>
          <View style={styles.helpIconContainer}>
            <HelpCircle size={48} color={theme.colors.success} />
          </View>

          <Text style={[styles.helpDescription, { color: theme.colors.textSecondary }]}>
            ¿Necesitas ayuda? Envíanos un mensaje y nuestro equipo de soporte te
            responderá lo antes posible.
          </Text>

          {/* Mostrar info del usuario si está disponible */}
          {userName && (
            <View style={[styles.userInfoCard, { backgroundColor: theme.colors.surfaceVariant }]}>
              <Text style={[styles.userInfoText, { color: theme.colors.text }]}>
                Enviando como: {userName}
              </Text>
              {userEmail && (
                <Text style={[styles.userInfoSubtext, { color: theme.colors.textSecondary }]}>
                  {userEmail}
                </Text>
              )}
            </View>
          )}

          <View style={styles.helpForm}>
            <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>Asunto</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.surfaceVariant, color: theme.colors.text, borderColor: theme.colors.border }]}
              value={asunto}
              onChangeText={setAsunto}
              placeholder="Ej: Problema con mi cuenta"
              placeholderTextColor={theme.colors.textSecondary}
              editable={!loading}
            />

            <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>Descripción</Text>
            <TextInput
              style={[styles.input, styles.textArea, { backgroundColor: theme.colors.surfaceVariant, color: theme.colors.text, borderColor: theme.colors.border }]}
              value={descripcion}
              onChangeText={setDescripcion}
              placeholder="Describe tu problema o pregunta en detalle..."
              placeholderTextColor={theme.colors.textSecondary}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              editable={!loading}
            />

            <TouchableOpacity
              style={[
                styles.sendButton, 
                { backgroundColor: theme.colors.success },
                loading && styles.sendButtonDisabled
              ]}
              onPress={handleSendHelp}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.sendButtonText}>Enviar Mensaje</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={[styles.contactInfo, { backgroundColor: theme.colors.surfaceVariant }]}>
            <Text style={[styles.contactTitle, { color: theme.colors.text }]}>Otras formas de contacto</Text>
            <View style={styles.contactItem}>
              <Mail size={20} color={theme.colors.textSecondary} />
              <Text style={[styles.contactText, { color: theme.colors.textSecondary }]}>soporte@ejemplo.com</Text>
            </View>
            <View style={styles.contactItem}>
              <Phone size={20} color={theme.colors.textSecondary} />
              <Text style={[styles.contactText, { color: theme.colors.textSecondary }]}>+52 449 123 4567</Text>
            </View>
          </View>

          {/* Sección de consejos */}
          <View style={[styles.tipsSection, { backgroundColor: theme.colors.surfaceVariant }]}>
            <Text style={[styles.tipsTitle, { color: theme.colors.text }]}>
              Consejos para una mejor respuesta:
            </Text>
            <Text style={[styles.tipText, { color: theme.colors.textSecondary }]}>
              • Sé específico sobre tu problema
            </Text>
            <Text style={[styles.tipText, { color: theme.colors.textSecondary }]}>
              • Include capturas de pantalla si es posible
            </Text>
            <Text style={[styles.tipText, { color: theme.colors.textSecondary }]}>
              • Menciona cualquier mensaje de error
            </Text>
            <Text style={[styles.tipText, { color: theme.colors.textSecondary }]}>
              • Responderemos en 24-48 horas
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  editContainer: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  editHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingTop: 48,
  },
  editTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  editForm: {
    flex: 1,
  },

  // --- HELP CONTENT ---
  helpContent: {
    padding: 20,
  },
  helpIconContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  helpDescription: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  userInfoCard: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  userInfoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  userInfoSubtext: {
    fontSize: 12,
    color: '#6b7280',
  },
  helpForm: {
    marginBottom: 32,
  },

  // Inputs
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1f2937',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  textArea: {
    minHeight: 120,
    paddingTop: 12,
  },

  // Botón enviar
  sendButton: {
    backgroundColor: '#16a34a',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

  // Contacto
  contactInfo: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  contactTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  contactText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 10,
  },

  // Sección de consejos
  tipsSection: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 20,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 6,
    lineHeight: 20,
  },
});