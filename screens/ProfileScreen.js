import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { User, Mail, Phone, BookOpen, MapPin, Globe, Palette, HelpCircle, LogOut, Edit, X, Check, Eye, EyeOff, Lock } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ref, get, update } from 'firebase/database';
import { db } from '../config/config';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { theme, isDarkMode, setTheme: setAppTheme } = useTheme();
  const { t, i18n } = useTranslation();

  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [themeModalVisible, setThemeModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  // Estados para cambio de contraseña
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Estados para el perfil del usuario
  const [userId, setUserId] = useState(null);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [noControl, setNoControl] = useState('');
  const [carrera, setCarrera] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language === 'es' ? 'Español' : 'English');
  const selectedTheme = isDarkMode ? 'Oscuro' : 'Claro';

  // const languages = ['Español', 'English', 'Français', 'Deutsch', 'Português'];
  const languages = ['Español', 'English'];
  const themes = ['Claro', 'Oscuro'];

  // Cargar datos del usuario desde Firebase
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Obtener el userId de AsyncStorage
      const storedUserId = await AsyncStorage.getItem('userId');
      
      if (!storedUserId) {
        Alert.alert(t('profile.error'), 'No se encontró el ID de usuario');
        setLoading(false);
        return;
      }

      setUserId(storedUserId);
      console.log("📱 UserId recuperado:", storedUserId);

      // Obtener datos del usuario desde Firebase
      const userRef = ref(db, `users/${storedUserId}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const userData = snapshot.val();
        console.log("✅ Datos del usuario cargados:", userData);

        // Actualizar los estados con los datos del usuario
        setNombre(userData.name || '');
        setEmail(userData.email || '');
        setTelefono(userData.phone || '');
        setNoControl(userData.control || '');
        setCarrera(userData.career || '');
        setUbicacion(userData.location || '');
      } else {
        console.log("❌ No se encontraron datos del usuario");
        Alert.alert(t('profile.error'), 'No se encontraron datos del usuario');
      }
    } catch (error) {
      console.error("❌ Error al cargar datos:", error);
      Alert.alert(t('profile.error'), 'Error al cargar los datos del perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      if (!userId) {
        Alert.alert(t('profile.error'), 'No se puede actualizar el perfil');
        return;
      }

      setLoading(true);

      // Actualizar datos en Firebase
      const userRef = ref(db, `users/${userId}`);
      
      await update(userRef, {
        name: nombre,
        email: email,
        phone: telefono,
        control: noControl,
        career: carrera,
        location: ubicacion,
      });

      console.log("✅ Perfil actualizado exitosamente");
      Alert.alert(t('profile.success'), t('profile.profile_updated'));
      setEditModalVisible(false);
    } catch (error) {
      console.error("❌ Error al actualizar perfil:", error);
      Alert.alert(t('profile.error'), 'Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert(t('profile.error'), t('profile.fill_fields'));
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert(t('profile.error'), t('profile.password_min_length'));
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(t('profile.error'), t('profile.passwords_mismatch'));
      return;
    }

    try {
      setLoading(true);

      // Verificar contraseña actual
      const userRef = ref(db, `users/${userId}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const userData = snapshot.val();
        
        if (userData.password !== currentPassword) {
          Alert.alert(t('profile.error'), 'La contraseña actual es incorrecta');
          setLoading(false);
          return;
        }

        // Actualizar contraseña
        await update(userRef, {
          password: newPassword,
        });

        Alert.alert(t('profile.success'), t('profile.password_changed'));
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setPasswordModalVisible(false);
      }
    } catch (error) {
      console.error("❌ Error al cambiar contraseña:", error);
      Alert.alert(t('profile.error'), 'Error al cambiar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      t('profile.logout_title'),
      t('profile.logout_message'),
      [
        { text: t('profile.cancel'), style: 'cancel' },
        { 
          text: t('profile.logout'), 
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('userId');
              console.log('✅ Sesión cerrada');
              // Navegar a la pantalla de login
              // navigation.navigate('Login');
            } catch (error) {
              console.error('❌ Error al cerrar sesión:', error);
            }
          }
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>
          Cargando perfil...
        </Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        {/* Header con botón de editar */}
        <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => setEditModalVisible(true)}
          >
            <Edit size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <View style={[styles.avatarWhiteBorder, { backgroundColor: theme.colors.surface }]}>
            <View style={[styles.avatar, { backgroundColor: theme.dark ? '#1e3a8a' : '#dbeafe' }]}>
              <User size={64} color={theme.colors.primary} />
            </View>
          </View>
        </View>

        {/* Información principal */}
        <View style={styles.mainInfo}>
          <Text style={[styles.name, { color: theme.colors.text }]}>{nombre || 'Usuario'}</Text>
          <View style={styles.infoRow}>
            <Mail size={16} color={theme.colors.textSecondary} />
            <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>{email || 'Sin email'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Phone size={16} color={theme.colors.textSecondary} />
            <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>{telefono || 'Sin teléfono'}</Text>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

        {/* Información académica */}
        <View style={styles.section}>
          <View style={styles.dataRow}>
            <BookOpen size={20} color={theme.colors.primary} />
            <View style={styles.dataContent}>
              <Text style={[styles.label, { color: theme.colors.textSecondary }]}>{t('profile.control_number').toUpperCase()}</Text>
              <Text style={[styles.value, { color: theme.colors.text }]}>{noControl || 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.dataRow}>
            <BookOpen size={20} color={theme.colors.primary} />
            <View style={styles.dataContent}>
              <Text style={[styles.label, { color: theme.colors.textSecondary }]}>{t('profile.career').toUpperCase()}</Text>
              <Text style={[styles.value, { color: theme.colors.text }]}>{carrera || 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.dataRow}>
            <MapPin size={20} color={theme.colors.primary} />
            <View style={styles.dataContent}>
              <Text style={[styles.label, { color: theme.colors.textSecondary }]}>{t('profile.location').toUpperCase()}</Text>
              <Text style={[styles.value, { color: theme.colors.text }]}>{ubicacion || 'N/A'}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

        {/* Opciones de configuración */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setLanguageModalVisible(true)}
          >
            <View style={[styles.iconContainer, { backgroundColor: theme.dark ? '#1e3a8a' : '#dbeafe' }]}>
              <Globe size={24} color={theme.colors.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={[styles.menuText, { color: theme.colors.text }]}>{t('profile.language')}</Text>
              <Text style={[styles.menuSubtext, { color: theme.colors.textSecondary }]}>{selectedLanguage}</Text>
            </View>
            <Text style={[styles.arrow, { color: theme.colors.textSecondary }]}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setThemeModalVisible(true)}
          >
            <View style={[styles.iconContainer, { backgroundColor: theme.dark ? '#4C1D95' : '#f3e8ff' }]}>
              <Palette size={24} color={theme.colors.secondary} />
            </View>
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={[styles.menuText, { color: theme.colors.text }]}>{t('profile.theme')}</Text>
              <Text style={[styles.menuSubtext, { color: theme.colors.textSecondary }]}>{selectedTheme}</Text>
            </View>
            <Text style={[styles.arrow, { color: theme.colors.textSecondary }]}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

        {/* Opciones finales */}
        <View style={[styles.section, { marginBottom: 32 }]}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('Help')}
          >
            <View style={[styles.iconContainer, { backgroundColor: theme.dark ? '#14532d' : '#dcfce7' }]}>
              <HelpCircle size={24} color={theme.colors.success} />
            </View>
            <Text style={[styles.menuText, { color: theme.colors.text }]}>{t('profile.help')} {" "}</Text>
            <Text style={[styles.arrow, { color: theme.colors.textSecondary }]}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleLogout}
          >
            <View style={[styles.iconContainer, { backgroundColor: theme.dark ? '#7f1d1d' : '#fee2e2' }]}>
              <LogOut size={24} color={theme.colors.error} />
            </View>
            <Text style={[styles.menuText, { color: theme.colors.error }]}>{t('profile.logout')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal de Idiomas */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={languageModalVisible}
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
            <View style={[styles.modalHeader, { borderBottomColor: theme.colors.border }]}>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>{t('profile.select_language')}</Text>
              <TouchableOpacity onPress={() => setLanguageModalVisible(false)}>
                <X size={24} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {languages.map((lang) => (
              <TouchableOpacity
                key={lang}
                style={styles.modalOption}
                onPress={() => {
                  if (lang === 'Español') {
                    i18n.changeLanguage('es');
                  } else if (lang === 'English') {
                    i18n.changeLanguage('en');
                  }
                  setSelectedLanguage(lang);
                  setLanguageModalVisible(false);
                }}
              >
                <Text style={[styles.modalOptionText, { color: theme.colors.text }]}>{lang}</Text>
                {selectedLanguage === lang && (
                  <Check size={20} color={theme.colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Modal de Tema */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={themeModalVisible}
        onRequestClose={() => setThemeModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
            <View style={[styles.modalHeader, { borderBottomColor: theme.colors.border }]}>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>{t('profile.select_theme')}</Text>
              <TouchableOpacity onPress={() => setThemeModalVisible(false)}>
                <X size={24} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>         
            {themes.map((themeOption) => (
              <TouchableOpacity
                key={themeOption}
                style={styles.modalOption}
                onPress={() => {
                  setAppTheme(themeOption);
                  setThemeModalVisible(false);
                }}
              >
                <Text style={[styles.modalOptionText, { color: theme.colors.text }]}>{themeOption}</Text>
                {selectedTheme === themeOption && (
                  <Check size={20} color={theme.colors.secondary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Modal de Editar Perfil */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={[styles.editContainer, { backgroundColor: theme.colors.background }]}>
          <View style={[styles.editHeader, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
            <TouchableOpacity onPress={() => setEditModalVisible(false)}>
              <X size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <Text style={[styles.editTitle, { color: theme.colors.text }]}>{t('profile.edit_profile')}</Text>
            <TouchableOpacity onPress={handleSaveProfile}>
              <Text style={[styles.saveButton, { color: theme.colors.primary }]}>{t('profile.save')}</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.editForm}>
            {/* Avatar editable */}
            <View style={[styles.editAvatarContainer, { backgroundColor: theme.colors.surface }]}>
              <View style={[styles.editAvatar, { backgroundColor: theme.dark ? '#1e3a8a' : '#dbeafe' }]}>
                <User size={64} color={theme.colors.primary} />
              </View>
              <TouchableOpacity style={styles.changePhotoButton}>
                <Text style={[styles.changePhotoText, { color: theme.colors.primary }]}>{t('profile.change_photo')}</Text>
              </TouchableOpacity>
            </View>

            {/* Información Personal */}
            <View style={[styles.formSection, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{t('profile.personal_info')}</Text>
              
              <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>{t('profile.full_name')}</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.colors.surfaceVariant, color: theme.colors.text, borderColor: theme.colors.border }]}
                value={nombre}
                onChangeText={setNombre}
                placeholder="Nombre completo"
                placeholderTextColor={theme.colors.textSecondary}
              />
              
              <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>{t('profile.email_label')}</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.colors.surfaceVariant, color: theme.colors.text, borderColor: theme.colors.border }]}
                value={email}
                onChangeText={setEmail}
                placeholder={t('profile.email_placeholder')}
                placeholderTextColor={theme.colors.textSecondary}
                keyboardType="email-address"
              />

              <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>{t('profile.phone_label')}</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.colors.surfaceVariant, color: theme.colors.text, borderColor: theme.colors.border }]}
                value={telefono}
                onChangeText={setTelefono}
                placeholder={t('profile.phone_placeholder')}
                placeholderTextColor={theme.colors.textSecondary}
                keyboardType="phone-pad"
              />
            </View>

            {/* Información Académica */}
            <View style={[styles.formSection, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{t('profile.academic_info')}</Text>
              
              <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>{t('profile.control_number_label')}</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.colors.surfaceVariant, color: theme.colors.text, borderColor: theme.colors.border }]}
                value={noControl}
                onChangeText={setNoControl}
                placeholder={t('profile.control_placeholder')}
                placeholderTextColor={theme.colors.textSecondary}
              />

              <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>{t('profile.career_label')}</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.colors.surfaceVariant, color: theme.colors.text, borderColor: theme.colors.border }]}
                value={carrera}
                onChangeText={setCarrera}
                placeholder={t('profile.career_placeholder')}
                placeholderTextColor={theme.colors.textSecondary}
                multiline
              />

              <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>{t('profile.location_label')}</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.colors.surfaceVariant, color: theme.colors.text, borderColor: theme.colors.border }]}
                value={ubicacion}
                onChangeText={setUbicacion}
                placeholder={t('profile.location_placeholder')}
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>

            {/* Botón Cambiar Contraseña */}
            <View style={[styles.formSection, { backgroundColor: theme.colors.surface }]}>
              <TouchableOpacity 
                style={[styles.changePasswordButton, { backgroundColor: theme.dark ? '#1e3a8a' : '#eff6ff', borderColor: theme.colors.primary }]}
                onPress={() => setPasswordModalVisible(true)}
              >
                <Lock size={20} color={theme.colors.primary} />
                <Text style={[styles.changePasswordText, { color: theme.colors.primary }]}>{t('profile.change_password')}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Modal de Cambiar Contraseña */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={passwordModalVisible}
        onRequestClose={() => setPasswordModalVisible(false)}
      >
        <View style={[styles.editContainer, { backgroundColor: theme.colors.background }]}>
          <View style={[styles.editHeader, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
            <TouchableOpacity onPress={() => setPasswordModalVisible(false)}>
              <X size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <Text style={[styles.editTitle, { color: theme.colors.text }]}>{t('profile.change_password')}</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.editForm}>
            <View style={styles.passwordContent}>
              <View style={styles.passwordIconContainer}>
                <Lock size={48} color={theme.colors.primary} />
              </View>
              
              <Text style={[styles.passwordDescription, { color: theme.colors.textSecondary }]}>
                {t('profile.password_security_info')}
              </Text>

              <View style={styles.passwordForm}>
                <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>{t('profile.current_password')}</Text>
                <View style={[styles.passwordInputContainer, { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.border }]}>
                  <TextInput
                    style={[styles.passwordInput, { color: theme.colors.text }]}
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    placeholder={t('profile.current_password_placeholder')}
                    placeholderTextColor={theme.colors.textSecondary}
                    secureTextEntry={!showCurrentPassword}
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff size={20} color={theme.colors.textSecondary} />
                    ) : (
                      <Eye size={20} color={theme.colors.textSecondary} />
                    )}
                  </TouchableOpacity>
                </View>

                <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>{t('profile.new_password')}</Text>
                <View style={[styles.passwordInputContainer, { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.border }]}>
                  <TextInput
                    style={[styles.passwordInput, { color: theme.colors.text }]}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder={t('profile.new_password_placeholder')}
                    placeholderTextColor={theme.colors.textSecondary}
                    secureTextEntry={!showNewPassword}
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff size={20} color={theme.colors.textSecondary} />
                    ) : (
                      <Eye size={20} color={theme.colors.textSecondary} />
                    )}
                  </TouchableOpacity>
                </View>

                <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>{t('profile.confirm_password')}</Text>
                <View style={[styles.passwordInputContainer, { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.border }]}>
                  <TextInput
                    style={[styles.passwordInput, { color: theme.colors.text }]}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder={t('profile.confirm_password_placeholder')}
                    placeholderTextColor={theme.colors.textSecondary}
                    secureTextEntry={!showConfirmPassword}
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} color={theme.colors.textSecondary} />
                    ) : (
                      <Eye size={20} color={theme.colors.textSecondary} />
                    )}
                  </TouchableOpacity>
                </View>
                
                <TouchableOpacity 
                  style={[styles.updatePasswordButton, { backgroundColor: theme.colors.primary }]}
                  onPress={handleChangePassword}
                >
                  <Text style={styles.updatePasswordText}>{t('profile.update_password')}</Text>
                </TouchableOpacity>
              </View>
              
              <View style={[styles.passwordTips, { backgroundColor: theme.colors.surfaceVariant }]}>
                <Text style={[styles.tipsTitle, { color: theme.colors.text }]}>{t('profile.security_tips')}</Text>
                <Text style={[styles.tipText, { color: theme.colors.textSecondary }]}>{t('profile.tip_min_chars')}</Text>
                <Text style={[styles.tipText, { color: theme.colors.textSecondary }]}>{t('profile.tip_combine')}</Text>
                <Text style={[styles.tipText, { color: theme.colors.textSecondary }]}>{t('profile.tip_no_personal')}</Text>
                <Text style={[styles.tipText, { color: theme.colors.textSecondary }]}>{t('profile.tip_avoid_common')}</Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#2563eb',
    paddingTop: 48,
    paddingBottom: 96,
    paddingHorizontal: 24,
    position: 'relative',
  },
  editButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 8,
    borderRadius: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: -64,
    marginBottom: 16,
  },
  avatarWhiteBorder: {
    backgroundColor: 'white',
    borderRadius: 64,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  avatar: {
    backgroundColor: '#dbeafe',
    borderRadius: 64,
    width: 128,
    height: 128,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainInfo: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    color: '#6b7280',
    marginLeft: 8,
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#d1d5db',
    marginHorizontal: 24,
    marginBottom: 24,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  dataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dataContent: {
    marginLeft: 12,
    flex: 1,
  },
  label: {
    fontSize: 10,
    color: '#6b7280',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
    marginTop: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  iconContainer: {
    padding: 8,
    borderRadius: 20,
  },
  menuText: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
  },
  menuSubtext: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  arrow: {
    fontSize: 24,
    color: '#9ca3af',
  },
  // Estilos de Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 32,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  modalOptionText: {
    fontSize: 16,
    color: '#1f2937',
  },
  // Estilos de Editar Perfil
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
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563eb',
  },
  editForm: {
    flex: 1,
  },
  editAvatarContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: 'white',
    marginBottom: 16,
  },
  editAvatar: {
    backgroundColor: '#dbeafe',
    borderRadius: 60,
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  changePhotoButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  changePhotoText: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '600',
  },
  formSection: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
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
  // Estilos del Modal de Ayuda
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
  textArea: {
    minHeight: 120,
    paddingTop: 12,
  },
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
  // Estilos del botón cambiar contraseña
  changePasswordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#2563eb',
  },
  changePasswordText: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  // Estilos del Modal de Cambiar Contraseña
  passwordContent: {
    padding: 20,
  },
  passwordIconContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  passwordDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  passwordForm: {
    marginBottom: 32,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 16,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  eyeButton: {
    padding: 12,
  },
  updatePasswordButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  updatePasswordText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  passwordTips: {
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