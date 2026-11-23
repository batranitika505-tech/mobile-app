import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '../src/constants/colors';
import { Spacing } from '../src/constants/layout';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Not Found',
          headerStyle: { backgroundColor: Colors.navy },
          headerTintColor: Colors.white,
        }}
      />
      <View style={styles.container}>
        <Text style={styles.title}>Screen Not Found</Text>
        <Text style={styles.subtitle}>The requested route does not exist.</Text>

        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Return to JalRakshak Home</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
    backgroundColor: Colors.navyDark,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.white,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  link: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.aquaticBlue,
    borderRadius: 8,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
  },
});
