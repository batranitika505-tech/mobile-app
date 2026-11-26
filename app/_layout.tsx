import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Colors } from '../src/constants/colors';
import { AuthProvider } from '../src/context/AuthContext';
import { GuestProgressProvider } from '../src/context/GuestProgressContext';

// Keep the splash screen visible while assets load
SplashScreen.preventAutoHideAsync().catch(() => {
  /* ignore */
});

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  useEffect(() => {
    // Hide splash screen once root is mounted
    SplashScreen.hideAsync().catch(() => {
      /* ignore */
    });
  }, []);

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <GuestProgressProvider>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: Colors.navy,
              },
              headerTintColor: Colors.white,
              headerTitleStyle: {
                fontWeight: '700',
              },
              contentStyle: {
                backgroundColor: Colors.navyDark,
              },
            }}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen
              name="onboarding"
              options={{
                title: 'Welcome to JalRakshak',
                headerShown: false,
              }}
            />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="game/[scenarioId]"
              options={{
                title: 'Groundwater Scenario',
                headerBackTitle: 'Missions',
                headerStyle: {
                  backgroundColor: Colors.navy,
                },
              }}
            />
            <Stack.Screen
              name="auth/login"
              options={{
                title: 'Sign In',
                headerBackTitle: 'Back',
                headerStyle: {
                  backgroundColor: Colors.navy,
                },
              }}
            />
            <Stack.Screen
              name="auth/register"
              options={{
                title: 'Create Account',
                headerBackTitle: 'Back',
                headerStyle: {
                  backgroundColor: Colors.navy,
                },
              }}
            />
            <Stack.Screen
              name="modal"
              options={{
                title: 'About JalRakshak',
                presentation: 'modal',
                headerStyle: {
                  backgroundColor: Colors.navy,
                },
              }}
            />
          </Stack>
        </GuestProgressProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
