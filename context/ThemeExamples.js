// Example: Quick Theme Implementation Snippets

// ============================================
// 1. BASIC SCREEN WITH THEME
// ============================================
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function ExampleScreen() {
  const { theme } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Theme Example
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

// ============================================
// 2. THEME SWITCHER BUTTON
// ============================================
import { TouchableOpacity, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';

function ThemeSwitcher() {
  const { isDarkMode, toggleTheme, theme } = useTheme();
  
  return (
    <TouchableOpacity 
      onPress={toggleTheme}
      style={{ 
        padding: 12, 
        backgroundColor: theme.colors.primary,
        borderRadius: 8 
      }}
    >
      <Text style={{ color: theme.colors.onPrimary }}>
        {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </Text>
    </TouchableOpacity>
  );
}

// ============================================
// 3. THEMED CARD COMPONENT
// ============================================
import { Card } from 'react-native-paper';
import { useTheme } from '../context/ThemeContext';

function ThemedCard({ title, description }) {
  const { theme } = useTheme();
  
  return (
    <Card style={{ 
      backgroundColor: theme.colors.surface,
      marginBottom: 12 
    }}>
      <Card.Content>
        <Text style={{ 
          color: theme.colors.text,
          fontSize: 18,
          fontWeight: 'bold',
          marginBottom: 8 
        }}>
          {title}
        </Text>
        <Text style={{ color: theme.colors.textSecondary }}>
          {description}
        </Text>
      </Card.Content>
    </Card>
  );
}

// ============================================
// 4. THEMED MODAL
// ============================================
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';

function ThemedModal({ visible, onClose, children }) {
  const { theme } = useTheme();
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20
      }}>
        <View style={{
          backgroundColor: theme.colors.surface,
          borderRadius: 12,
          padding: 20
        }}>
          {children}
          
          <TouchableOpacity 
            onPress={onClose}
            style={{
              marginTop: 20,
              padding: 12,
              backgroundColor: theme.colors.primary,
              borderRadius: 8,
              alignItems: 'center'
            }}
          >
            <Text style={{ color: theme.colors.onPrimary }}>
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ============================================
// 5. THEMED LIST ITEM
// ============================================
import { TouchableOpacity, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

function ThemedListItem({ icon, title, subtitle, onPress }) {
  const { theme } = useTheme();
  
  return (
    <TouchableOpacity 
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border
      }}
    >
      <Ionicons 
        name={icon} 
        size={24} 
        color={theme.colors.primary} 
      />
      <View style={{ flex: 1, marginLeft: 16 }}>
        <Text style={{ 
          color: theme.colors.text,
          fontSize: 16,
          fontWeight: '500' 
        }}>
          {title}
        </Text>
        {subtitle && (
          <Text style={{ 
            color: theme.colors.textSecondary,
            fontSize: 14,
            marginTop: 4 
          }}>
            {subtitle}
          </Text>
        )}
      </View>
      <Ionicons 
        name="chevron-forward" 
        size={20} 
        color={theme.colors.textSecondary} 
      />
    </TouchableOpacity>
  );
}

// ============================================
// 6. THEMED INPUT FIELD
// ============================================
import { TextInput, View, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';

function ThemedInput({ label, value, onChangeText, ...props }) {
  const { theme } = useTheme();
  
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ 
        color: theme.colors.textSecondary,
        fontSize: 14,
        marginBottom: 8,
        fontWeight: '500'
      }}>
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={{
          backgroundColor: theme.colors.surfaceVariant,
          borderWidth: 1,
          borderColor: theme.colors.border,
          borderRadius: 8,
          padding: 12,
          fontSize: 16,
          color: theme.colors.text
        }}
        placeholderTextColor={theme.colors.textSecondary}
        {...props}
      />
    </View>
  );
}

// ============================================
// 7. THEMED HEADER
// ============================================
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

function ThemedHeader({ title, onBackPress, rightIcon, onRightPress }) {
  const { theme } = useTheme();
  
  return (
    <>
      <StatusBar 
        barStyle={theme.dark ? "light-content" : "dark-content"}
        backgroundColor={theme.colors.primary}
      />
      <View style={{
        backgroundColor: theme.colors.primary,
        paddingTop: 48,
        paddingBottom: 16,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center'
      }}>
        {onBackPress && (
          <TouchableOpacity onPress={onBackPress} style={{ marginRight: 16 }}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.onPrimary} />
          </TouchableOpacity>
        )}
        
        <Text style={{
          flex: 1,
          color: theme.colors.onPrimary,
          fontSize: 20,
          fontWeight: 'bold'
        }}>
          {title}
        </Text>
        
        {rightIcon && onRightPress && (
          <TouchableOpacity onPress={onRightPress}>
            <Ionicons name={rightIcon} size={24} color={theme.colors.onPrimary} />
          </TouchableOpacity>
        )}
      </View>
    </>
  );
}

// ============================================
// 8. THEMED BUTTON VARIANTS
// ============================================
import { TouchableOpacity, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';

function PrimaryButton({ title, onPress }) {
  const { theme } = useTheme();
  return (
    <TouchableOpacity 
      onPress={onPress}
      style={{
        backgroundColor: theme.colors.primary,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center'
      }}
    >
      <Text style={{ color: theme.colors.onPrimary, fontWeight: '600' }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

function OutlineButton({ title, onPress }) {
  const { theme } = useTheme();
  return (
    <TouchableOpacity 
      onPress={onPress}
      style={{
        borderWidth: 2,
        borderColor: theme.colors.primary,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center'
      }}
    >
      <Text style={{ color: theme.colors.primary, fontWeight: '600' }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

function GhostButton({ title, onPress }) {
  const { theme } = useTheme();
  return (
    <TouchableOpacity 
      onPress={onPress}
      style={{
        padding: 16,
        alignItems: 'center'
      }}
    >
      <Text style={{ color: theme.colors.primary, fontWeight: '600' }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

// ============================================
// 9. THEMED BOTTOM SHEET
// ============================================
import { Modal, View, Text, TouchableOpacity, Pressable } from 'react-native';
import { useTheme } from '../context/ThemeContext';

function ThemedBottomSheet({ visible, onClose, title, children }) {
  const { theme } = useTheme();
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable 
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'flex-end'
        }}
        onPress={onClose}
      >
        <Pressable 
          style={{
            backgroundColor: theme.colors.surface,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingBottom: 32
          }}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 20,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border
          }}>
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: theme.colors.text
            }}>
              {title}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ============================================
// 10. THEME COLOR PALETTE DISPLAY
// ============================================
import { View, Text, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';

function ThemeColorPalette() {
  const { theme } = useTheme();
  
  const colors = [
    { name: 'Primary', value: theme.colors.primary },
    { name: 'Secondary', value: theme.colors.secondary },
    { name: 'Background', value: theme.colors.background },
    { name: 'Surface', value: theme.colors.surface },
    { name: 'Text', value: theme.colors.text },
    { name: 'Text Secondary', value: theme.colors.textSecondary },
    { name: 'Error', value: theme.colors.error },
    { name: 'Success', value: theme.colors.success },
    { name: 'Border', value: theme.colors.border },
  ];
  
  return (
    <ScrollView style={{ backgroundColor: theme.colors.background }}>
      {colors.map((color, index) => (
        <View key={index} style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border
        }}>
          <View style={{
            width: 50,
            height: 50,
            backgroundColor: color.value,
            borderRadius: 8,
            marginRight: 16,
            borderWidth: 1,
            borderColor: theme.colors.border
          }} />
          <View>
            <Text style={{ 
              color: theme.colors.text,
              fontSize: 16,
              fontWeight: '500'
            }}>
              {color.name}
            </Text>
            <Text style={{ 
              color: theme.colors.textSecondary,
              fontSize: 14
            }}>
              {color.value}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

export {
  ExampleScreen,
  ThemeSwitcher,
  ThemedCard,
  ThemedModal,
  ThemedListItem,
  ThemedInput,
  ThemedHeader,
  PrimaryButton,
  OutlineButton,
  GhostButton,
  ThemedBottomSheet,
  ThemeColorPalette
};
