import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Link, Tabs } from 'expo-router';
import { Gamepad2, Home, Info, Trophy, User } from 'lucide-react-native';

import { Colors } from '../../src/constants/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.turquoise,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          backgroundColor: Colors.navy,
          borderTopColor: Colors.navyCardBorder,
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: Colors.navy,
          borderBottomColor: Colors.navyCardBorder,
          borderBottomWidth: 1,
        },
        headerTintColor: Colors.white,
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerTitle: 'JalRakshak Dashboard',
          tabBarIcon: ({ color, size }) => <Home size={size || 22} color={color} />,
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable hitSlop={10} style={styles.headerRightButton}>
                {({ pressed }) => (
                  <View style={[styles.infoIconWrapper, { opacity: pressed ? 0.6 : 1 }]}>
                    <Info size={20} color={Colors.turquoiseLight} />
                  </View>
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="game"
        options={{
          title: 'Missions',
          headerTitle: 'Groundwater Missions',
          tabBarIcon: ({ color, size }) => <Gamepad2 size={size || 22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: 'Ranks',
          headerTitle: 'Leaderboard Rankings',
          tabBarIcon: ({ color, size }) => <Trophy size={size || 22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerTitle: 'Cadet Profile',
          tabBarIcon: ({ color, size }) => <User size={size || 22} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerRightButton: {
    marginRight: 16,
  },
  infoIconWrapper: {
    padding: 4,
  },
});
