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
        name="Lugares"
        component={Lugares}
        options={{ title: 'Lugares' }}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
