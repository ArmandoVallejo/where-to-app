import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { PaperProvider, MD3LightTheme as DefaultTheme } from 'react-native-paper';

// Importa tus pantallas
import HomeScreen from './screens/HomeScreen';
import MaterialDesignScreen from './screens/MaterialDesignScreen';
import ProfileScreen from './screens/ProfileScreen';
import Lugares from './screens/Lugares';


// Crea el Drawer
const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="Home">
          <Drawer.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'Inicio' }}
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
