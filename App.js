// App.js
import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import {
  PaperProvider,
  Drawer as PaperDrawer,
  useTheme as usePaperTheme,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

import i18n from './i18n';

// 🔹 Pantallas
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import MaterialDesignScreen from "./screens/MaterialDesignScreen";
import ProfileScreen from "./screens/ProfileScreen";
import Lugares from "./screens/Lugares";
import HistoryScreen from "./screens/HistoryScreen";
import QRScannerScreen from "./screens/QRScannerScreen";
import ParticipantsScreen from "./screens/ParticipantsScreen";
import HelpScreen from "./screens/HelpScreen";

import { runSeed  } from "./config/seed";

// Evita que el splash se oculte automáticamente
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// 🔹 Drawer personalizado con Logout
function CustomDrawerContent(props) {
  // const theme = useTheme();
  const paperTheme = usePaperTheme();
  const { theme } = useTheme();
  const { t } = useTranslation();

  const { navigation } = props;
  const [active, setActive] = useState("Home");

  const menuItems = [
    { label: t('sidebar.home'), icon: 'home-outline', route: 'Home' },
    { label: t('sidebar.profile'), icon: 'person-outline', route: 'Perfil' },
    // { label: 'Eventos', icon: 'calendar-outline', route: 'Eventos' },
    { label: t('sidebar.places'), icon: 'location-outline', route: 'Lugares' },
    { label: t('sidebar.history'), icon: 'time-outline', route: 'History' },
    { label: "Help", icon: "help-circle-outline", route: "Help" },
    // { label: 'Escanear QR', icon: 'qr-code-outline', route: 'QRScanner' },
  ];

  const handleLogout = async () => {
    // 👉 Aquí podrías limpiar el estado o token del usuario
    await AsyncStorage.removeItem('userId');
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  const handleLanguageChange = () => {
    const newLanguage = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(newLanguage);
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ flex: 1, justifyContent: "space-between" }}
    >
      {/* 🔹 Sección principal */}
      <View>
        <PaperDrawer.Section title={t('sidebar.main_menu')}>
          {menuItems.map((item) => (
            <DrawerItem
              key={item.route}
              label={item.label}
              icon={({ size }) => (
                <Ionicons 
                  name={item.icon} 
                  size={size} 
                  color={active === item.route ? theme.colors.secondary : theme.colors.textSecondary} 
                />
              )}
              focused={active === item.route}
              onPress={() => {
                setActive(item.route);
                navigation.navigate(item.route);
              }}
              style={{
                borderRadius: 12,
                marginHorizontal: 8,
              }}
              labelStyle={{
                fontSize: 16,
                color: active === item.route ? theme.colors.secondary : theme.colors.text,
              }}
            />
          ))}
        </PaperDrawer.Section>
      </View>

      {/* 🔹 Sección inferior: Cambiar idioma y Logout */}
      <PaperDrawer.Section
        style={{
          borderTopWidth: 1,
          borderTopColor: paperTheme.colors.surfaceVariant,
          paddingTop: 8,
        }}
      >
        <DrawerItem
          label={t('sidebar.change_language')}
          icon={({ size }) => (
            <Ionicons name="language-outline" size={size} color="#7C3AED" />
          )}
          onPress={handleLanguageChange}
          labelStyle={{
            color: '#7C3AED',
            fontWeight: '600',
          }}
        />
        <DrawerItem
          label={t('sidebar.logout')}
          icon={({ size }) => (
            <Ionicons name="log-out-outline" size={size} color={theme.colors.error} />
          )}
          onPress={handleLogout}
          labelStyle={{
            color: theme.colors.error,
            fontWeight: "bold",
          }}
        />
      </PaperDrawer.Section>
    </DrawerContentScrollView>
  );
}

// 🔹 Drawer principal
function DrawerNavigator() {

  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: theme.colors.primary },
        headerTintColor: "#fff",
        drawerActiveBackgroundColor: theme.colors.tertiary,
        drawerActiveTintColor: theme.colors.secondary,
        drawerLabelStyle: { fontSize: 15, marginLeft: -10 },
        drawerStyle: { backgroundColor: theme.colors.surface },
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} options={{ title: t('sidebar.home') }} />
      <Drawer.Screen name="Perfil" component={ProfileScreen} options={{ title: t('sidebar.profile') }} />
      <Drawer.Screen name="Help" component={HelpScreen} />

      {/* <Drawer.Screen name="Eventos" component={MaterialDesignScreen} /> */}
      <Drawer.Screen name="Lugares" component={Lugares} options={{ title: t('sidebar.places') }} />
      <Drawer.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: t('history.title'),
        }}
      />
      {/* <Drawer.Screen
        name="QRScanner"
        component={QRScannerScreen}
        options={{
          title: 'Escanear QR',
          headerShown: false,
        }}
      /> */}
      <Drawer.Screen
        name="Participants"
        component={ParticipantsScreen}
        options={{ title: t('participants.title') }}
      />
    </Drawer.Navigator>
  );
}

// 🔹 App principal
export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initializeSeed = async () => {
      try {
        await runSeed();
      } catch (error) {
        console.log("❌ Error ejecutando seed:", error);
      }
    };

    initializeSeed();
  }, []);

  useEffect(() => {
    const prepare = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn(e);
      } finally {
        await SplashScreen.hideAsync();
        setIsReady(true);
      }
    };

    prepare();
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#A855F7" />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

// Separate component to access theme context
function AppContent() {
  const { theme } = useTheme();

  return (
    <GluestackUIProvider config={config}>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Main" component={DrawerNavigator} />
            {/* <Stack.Screen name="Participants" component={ParticipantsScreen} /> */}
            <Stack.Screen name="QRScanner" component={QRScannerScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </GluestackUIProvider>
  );
}
