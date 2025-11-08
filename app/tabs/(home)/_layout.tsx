import React, { useCallback } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

interface TabBarIconProps {
  readonly name: React.ComponentProps<typeof FontAwesome>['name'];
  readonly color: string;
  readonly focused?: boolean;
}

function TabBarIcon({ name, color, focused }: TabBarIconProps) {
  return (
    <FontAwesome 
      name={name}
      size={focused ? 26 : 22}
      color={color}
      style={{ marginBottom: -3 }} 
    />
  );
}

const createTabBarIcon = (iconName: React.ComponentProps<typeof FontAwesome>['name']) => {
  return ({ color, focused }: { color: string; focused: boolean }) => (
    <TabBarIcon 
      name={iconName} 
      color={color}
      focused={focused}
    />
  );
};


export default function HomeLayout() {

  // Memoizar las funciones de iconos con diferentes iconos
  const homeIcon = useCallback(createTabBarIcon('home'), []);
  const profileIcon = useCallback(createTabBarIcon('user'), []);
  const eventsIcon = useCallback(createTabBarIcon('folder'), []);

  return (
    <Tabs
      screenOptions={{
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
        tabBarActiveTintColor: '#667eea',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#f0f0f0',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
      }}
    >
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: profileIcon,
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: 'Inicio',
          tabBarIcon: homeIcon,
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: 'Eventos',
          tabBarIcon: eventsIcon,
        }}
      />
    </Tabs>
  );
}
