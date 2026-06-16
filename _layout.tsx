import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Activity, Camera, Calendar, User, Zap, Lock } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { NutritionProvider, useNutrition } from '../context/NutritionContext';



function TabBarIconWithStatus({ name, color, size }: { name: string; color: string; size: number }) {
  const { isPremium } = useNutrition();
  
  if (name === 'home') return <Activity size={size} color={color} />;
  if (name === 'explore') return <Camera size={size} color={color} />;
  if (name === 'history') return <Calendar size={size} color={color} />;
  if (name === 'profile') return <User size={size} color={color} />;
  if (name === 'paywall') {
    return (
      <View style={styles.premiumIconContainer}>
        <Zap size={size} color={isPremium ? '#10b981' : '#eab308'} />
        {!isPremium && <View style={styles.badgeDot} />}
      </View>
    );
  }
  return <Activity size={size} color={color} />;
}

export default function RootLayout() {
  return (
    <NutritionProvider>
      <View style={styles.appContainer}>
        <StatusBar style="light" />
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: '#10b981',
            tabBarInactiveTintColor: '#9ca3af',
            tabBarStyle: {
              backgroundColor: '#030712',
              borderTopColor: '#1f2937',
              borderTopWidth: 1.5,
              paddingBottom: 8,
              paddingTop: 8,
              height: 64,
              marginBottom:20,
              marginHorizontal:4
            },
            headerStyle: {
              backgroundColor: '#030712',
              borderBottomColor: '#1f2937',
              borderBottomWidth: 1,
            },
            headerTitleStyle: {
              fontWeight: '900',
              color: '#f9fafb',
              fontSize: 18,
              letterSpacing: 0.5,
            },
            headerTintColor: '#f9fafb',
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Welcome',
              tabBarLabel: 'Get Started',
              headerShown: false,
              href: '/', // Entry gateway splash/onboard
              tabBarButton: () => null, // Hidden from navigation bar bottom
            }}
          />
          
          <Tabs.Screen
            name="home"
            options={{
              title: 'Home Dashboard',
              tabBarLabel: 'Today',
              headerShown: true,
              tabBarIcon: ({ color, size }) => <TabBarIconWithStatus name="home" color={color} size={size} />,
            }}
          />
          
          <Tabs.Screen
            name="explore"
            options={{
              title: 'AI Scanner',
              tabBarLabel: 'Snap Food',
              headerShown: true,
              tabBarIcon: ({ color, size }) => <TabBarIconWithStatus name="explore" color={color} size={size} />,
            }}
          />
          
          <Tabs.Screen
            name="history"
            options={{
              title: 'Timeline Log',
              tabBarLabel: 'History',
              headerShown: true,
              tabBarIcon: ({ color, size }) => <TabBarIconWithStatus name="history" color={color} size={size} />,
            }}
          />

          <Tabs.Screen
            name="paywall"
            options={{
              title: 'Pro Access',
              tabBarLabel: 'Premium',
              headerShown: true,
              tabBarIcon: ({ color, size }) => <TabBarIconWithStatus name="paywall" color={color} size={size} />,
            }}
          />
          
          <Tabs.Screen
            name="profile"
            options={{
              title: 'Athlete Profile',
              tabBarLabel: 'Profile',
              headerShown: true,
              tabBarIcon: ({ color, size }) => <TabBarIconWithStatus name="profile" color={color} size={size} />,
            }}
          />
        </Tabs>
      </View>
    </NutritionProvider>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#030712',
  },
  premiumIconContainer: {
    position: 'relative',
  },
  badgeDot: {
    position: 'absolute',
    right: -4,
    top: -2,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#eab308',
  }
});