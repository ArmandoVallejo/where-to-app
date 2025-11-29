import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { User, Mail, Phone, BookOpen, MapPin, Globe, Palette, HelpCircle, LogOut, Edit, X, Check, Eye, EyeOff, Lock } from 'lucide-react-native';

export default function HelpScreen() {
  // Estados para el formulario de ayuda
  const [asunto, setAsunto] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const handleSendHelp = () => {
    if (!asunto.trim() || !descripcion.trim()) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    Alert.alert(
      "Éxito",
      "Tu mensaje ha sido enviado. Nos pondremos en contacto contigo pronto."
    );
    setAsunto("");
    setDescripcion("");
  };

  return (
    <View style={styles.editContainer}>
  

      <ScrollView style={styles.editForm}>
        <View style={styles.helpContent}>
          <View style={styles.helpIconContainer}>
            <HelpCircle size={48} color="#16a34a" />
          </View>

          <Text style={styles.helpDescription}>
            ¿Necesitas ayuda? Envíanos un mensaje y nuestro equipo de soporte te
            responderá lo antes posible.
          </Text>

          <View style={styles.helpForm}>
            <Text style={styles.inputLabel}>Asunto</Text>
            <TextInput
              style={styles.input}
              value={asunto}
              onChangeText={setAsunto}
              placeholder="Ej: Problema con mi cuenta"
              placeholderTextColor="#9ca3af"
            />

            <Text style={styles.inputLabel}>Descripción</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={descripcion}
              onChangeText={setDescripcion}
              placeholder="Describe tu problema o pregunta en detalle..."
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />

            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSendHelp}
            >
              <Text style={styles.sendButtonText}>Enviar Mensaje</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.contactInfo}>
            <Text style={styles.contactTitle}>Otras formas de contacto</Text>
            <View style={styles.contactItem}>
              <Mail size={20} color="#6b7280" />
              <Text style={styles.contactText}>soporte@ejemplo.com</Text>
            </View>
            <View style={styles.contactItem}>
              <Phone size={20} color="#6b7280" />
              <Text style={styles.contactText}>+52 449 123 4567</Text>
            </View>
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
    marginBottom: 32,
    lineHeight: 24,
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
});
