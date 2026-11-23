import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookOpen, Droplets, Info, Play, ShieldCheck, Sparkles } from 'lucide-react-native';

import { Colors } from '../src/constants/colors';
import { BorderRadius, Spacing } from '../src/constants/layout';
import { Button } from '../src/components/common/Button';
import { Card } from '../src/components/common/Card';
import { Badge } from '../src/components/common/Badge';

export default function SplashScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Educational Project Badge */}
        <View style={styles.badgeRow}>
          <Badge
            label="Educational Project • Groundwater Conservation"
            variant="turquoise"
            icon={<BookOpen size={14} color={Colors.turquoiseLight} />}
          />
        </View>

        {/* Hero Branding */}
        <View style={styles.heroSection}>
          <View style={styles.iconCircle}>
            <Droplets size={52} color={Colors.turquoise} />
          </View>
          <Text style={styles.title}>JalRakshak</Text>
          <Text style={styles.tagline}>
            Groundwater Conservation & Management Educational Game
          </Text>
        </View>

        {/* Informational Mission Card */}
        <Card variant="highlight" style={styles.missionCard}>
          <View style={styles.cardHeaderRow}>
            <Sparkles size={20} color={Colors.turquoise} />
            <Text style={styles.cardHeaderTitle}>Mission Objective</Text>
          </View>
          <Text style={styles.missionText}>
            Master real-world groundwater management strategies: mitigate drought, capture rainfall
            runoff, safeguard aquifer water quality, and champion smart micro-irrigation practices.
          </Text>
        </Card>

        {/* Feature Highlights Grid */}
        <View style={styles.gridContainer}>
          <Card style={styles.miniCard}>
            <Text style={styles.miniCardNumber}>4</Text>
            <Text style={styles.miniCardTitle}>Core Crisis Modules</Text>
            <Text style={styles.miniCardDesc}>Drought, Rain, Quality & Ag</Text>
          </Card>
          <Card style={styles.miniCard}>
            <Text style={styles.miniCardNumber}>100%</Text>
            <Text style={styles.miniCardTitle}>Scenario-Based</Text>
            <Text style={styles.miniCardDesc}>Interactive decisions & feedback</Text>
          </Card>
        </View>

        {/* Action Controls */}
        <View style={styles.actionContainer}>
          <Button
            title="Start Onboarding Walkthrough"
            size="lg"
            variant="primary"
            onPress={() => router.push('/onboarding')}
            icon={<BookOpen size={20} color={Colors.white} />}
            style={styles.primaryButton}
          />

          <Button
            title="Enter Dashboard (Guest Mode)"
            size="lg"
            variant="secondary"
            onPress={() => router.replace('/(tabs)')}
            icon={<Play size={18} color={Colors.cyanSoft} />}
            style={styles.secondaryButton}
          />

          <Button
            title="About Educational Project"
            size="md"
            variant="ghost"
            onPress={() => router.push('/modal')}
            icon={<Info size={16} color={Colors.turquoiseLight} />}
            style={styles.aboutButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.navyDark,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
    justifyContent: 'center',
  },
  badgeRow: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.navyLight,
    borderWidth: 2,
    borderColor: Colors.turquoise,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    shadowColor: Colors.turquoise,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 15,
    color: Colors.cyanSoft,
    textAlign: 'center',
    marginTop: Spacing.xs,
    maxWidth: 290,
    lineHeight: 22,
  },
  missionCard: {
    marginBottom: Spacing.md,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
    gap: Spacing.xs,
  },
  cardHeaderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.turquoiseLight,
    marginLeft: Spacing.xs,
  },
  missionText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  miniCard: {
    flex: 1,
    padding: Spacing.md,
  },
  miniCardNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.turquoise,
    marginBottom: Spacing.xs,
  },
  miniCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.white,
  },
  miniCardDesc: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  actionContainer: {
    width: '100%',
    gap: Spacing.sm,
  },
  primaryButton: {
    width: '100%',
  },
  secondaryButton: {
    width: '100%',
  },
  aboutButton: {
    alignSelf: 'center',
    marginTop: Spacing.xs,
  },
});

