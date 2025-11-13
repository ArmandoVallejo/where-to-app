// App.js
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator
} from '@react-navigation/native-stack';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem
} from '@react-navigation/drawer';
import {
  PaperProvider,
  Drawer as PaperDrawer,
  useTheme
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';

// Pantallas
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import MaterialDesignScreen from './screens/MaterialDesignScreen';
import ProfileScreen from './screens/ProfileScreen';
import Lugares from './screens/Lugares';

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();


// 🔹 Drawer personalizado con Logout
function CustomDrawerContent(props) {
  const theme = useTheme();
  const { navigation } = props;
  const [active, setActive] = useState('Home');

  const menuItems = [
    { label: 'Inicio', icon: 'home-outline', route: 'Home' },
    { label: 'Perfil', icon: 'person-outline', route: 'Perfil' },
    { label: 'Eventos', icon: 'calendar-outline', route: 'Eventos' },
    { label: 'Lugares', icon: 'location-outline', route: 'Lugares' },
  ];

  const handleLogout = () => {
    // 👉 Aquí podrías limpiar el estado o token del usuario
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ flex: 1, justifyContent: 'space-between' }}
    >
      {/* 🔹 Sección principal */}
      <View>
        <PaperDrawer.Section title="Menú principal">
          {menuItems.map((item) => (
            <DrawerItem
              key={item.route}
              label={item.label}
              icon={({ color, size }) => (
                <Ionicons name={item.icon} size={size} color={color} />
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
              }}
            />
          ))}
        </PaperDrawer.Section>
      </View>

      {/* 🔹 Sección inferior: Logout */}
      <PaperDrawer.Section
        style={{
          borderTopWidth: 1,
          borderTopColor: theme.colors.surfaceVariant,
          paddingTop: 8,
        }}
      >
        <DrawerItem
          label="Cerrar sesión"
          icon={({ size }) => (
            <Ionicons name="log-out-outline" size={size} color="#DC2626" />
          )}
          onPress={handleLogout}
          labelStyle={{
            color: '#DC2626',
            fontWeight: 'bold',
          }}
        />
      </PaperDrawer.Section>
    </DrawerContentScrollView>
  );
}


// 🔹 Drawer principal
function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#A855F7' },
        headerTintColor: '#fff',
        drawerActiveBackgroundColor: '#EDE9FE',
        drawerActiveTintColor: '#6D28D9',
        drawerLabelStyle: { fontSize: 15, marginLeft: -10 },
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} options={{ title: 'Inicio' }} />
      <Drawer.Screen name="Perfil" component={ProfileScreen} />
      <Drawer.Screen name="Eventos" component={MaterialDesignScreen} />
      <Drawer.Screen name="Lugares" component={Lugares} />
    </Drawer.Navigator>
  );
}


// 🔹 App principal
export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 3000));
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
