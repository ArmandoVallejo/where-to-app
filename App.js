import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { PaperProvider } from 'react-native-paper';

// 🔹 Gluestack UI
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';

// 🔹 Pantallas
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import MaterialDesignScreen from './screens/MaterialDesignScreen';
import ProfileScreen from './screens/ProfileScreen';
import HistoryScreen from './screens/HistoryScreen';
import QRScannerScreen from './screens/QRScannerScreen';

// Evita que el splash se oculte automáticamente
SplashScreen.preventAutoHideAsync();

// Navegadores
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// 🔹 Drawer principal después del login
function DrawerNavigator() {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{ 
          title: 'Inicio',
          headerShown: false 
        }}
      />
      <Drawer.Screen
        name="Material"
        component={MaterialDesignScreen}
        options={{ title: 'Componentes Material' }}
      />
      <Drawer.Screen
        name="Perfil"
        component={ProfileScreen}
        options={{ title: 'Perfil' }}
      />
      <Drawer.Screen
        name="History"
        component={HistoryScreen}
        options={{ 
          title: 'Historial de eventos',
          headerShown: false 
        }}
      />
      <Drawer.Screen
        name="QRScanner"
        component={QRScannerScreen}
        options={{ 
          title: 'Escanear QR',
          headerShown: false 
        }}
      />
    </Drawer.Navigator>
  );
}

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      try {
        // Espera 3 segundos antes de ocultar el splash
        await new Promise(resolve => setTimeout(resolve, 3000));
      } catch (e) {
        console.warn(e);
      } finally {
        await SplashScreen.hideAsync();
        setIsReady(true);
      }
    };
    prepare();
  }, []);

  // 🔹 Muestra un loader mientras espera los 3 segundos del splash
  if (!isReady) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#ffffff',
        }}
      >
        <ActivityIndicator size="large" color="#A855F7" />
      </View>
    );
  }

  // 🔹 App principal con Gluestack UI + Paper + navegación
  return (
    <PaperProvider>
      <GluestackUIProvider config={config}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Main" component={DrawerNavigator} />
          </Stack.Navigator>
        </NavigationContainer>
      </GluestackUIProvider>
    </PaperProvider>
  );
}
