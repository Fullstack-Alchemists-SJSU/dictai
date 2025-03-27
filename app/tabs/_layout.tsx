import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import theme from '@/constants/Theme';
import { useEffect } from 'react';
import { isLoaded } from 'expo-font';

export default function TabsLayout() {
    useEffect(() => {
        console.log("theme", theme)
        console.log("font", isLoaded("SpaceMono"))
    }, [])
  return (
    
      <Tabs
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap = 'ellipse';

            switch (route.name) {
              case 'journalentries':
                iconName = focused ? 'home' : 'home-outline';
                break;
              case 'journal':
                iconName = focused ? 'mic-circle' : 'mic-circle-outline';
                break;
              case 'insightsscreen':
                iconName = focused ? 'bar-chart' : 'bar-chart-outline';
                break;
              case 'profilescreen':
                iconName = focused ? 'person' : 'person-outline';
                break;
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#000',
          tabBarInactiveTintColor: '#aaa',
        })}
      />
  );
}
