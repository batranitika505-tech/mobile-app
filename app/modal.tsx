import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Award, BookOpen, CheckCircle, Droplets, Info, ShieldCheck, X } from 'lucide-react-native';

import { Colors } from '../src/constants/colors';
import { BorderRadius, Spacing } from '../src/constants/layout';
import { Button } from '../src/components/common/Button';
import { Card } from '../src/components/common/Card';
import { Badge } from '../src/components/common/Badge';

export default function ModalScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Emblem & Title */}
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Droplets size={36} color={Colors.turquoise} />
          </View>
          <Text style={styles.title}>JalRakshak</Text>
          <Text style={styles.subtitle}>
            Groundwater Conservation & Management Educational Platform
          </Text>
        </View>

        {/* Educational Problem Statement Scope */}
        <Card variant="highlight" style={styles.card}>
          <View style={styles.row}>
            <ShieldCheck size={20} color={Colors.turquoise} />
            <Text style={styles.cardHeader}>Educational Problem Statement</Text>
          </View>
          <View style={styles.authorityContent}>
            <Text style={styles.entityTitle}>Groundwater Conservation & Management</Text>
            <Text style={styles.deptTitle}>Educational game based on conservation problem statements</Text>
            <Text style={styles.bodyText}>
              JalRakshak is an independent student educational project designed to teach scientific
              groundwater replenishment, artificial recharge, and sustainable irrigation principles.
              It is not an official application of the Ministry of Jal Shakti or Central Ground
              Water Board (CGWB).
            </Text>
          </View>
        </Card>

        {/* Technical Architecture */}
        <Card variant="default" style={styles.card}>
          <View style={styles.row}>
            <Award size={20} color={Colors.cyanSoft} />
            <Text style={styles.cardHeader}>Core Technology Stack</Text>
          </View>
          <View style={styles.techList}>
            <View style={styles.techItem}>
              <CheckCircle size={14} color={Colors.sustainableGreen} />
              <Text style={styles.techText}>React Native + Expo SDK (Expo Router v4)</Text>
            </View>
            <View style={styles.techItem}>
              <CheckCircle size={14} color={Colors.sustainableGreen} />
              <Text style={styles.techText}>TypeScript Strict Mode</Text>
            </View>
            <View style={styles.techItem}>
              <CheckCircle size={14} color={Colors.sustainableGreen} />
              <Text style={styles.techText}>Supabase PostgreSQL & Authentication (Milestone 2)</Text>
            </View>
            <View style={styles.techItem}>
              <CheckCircle size={14} color={Colors.sustainableGreen} />
              <Text style={styles.techText}>Expo EAS Android APK Build Delivery</Text>
            </View>
          </View>
        </Card>

        {/* Milestone 1 Status */}
        <Card variant="outlined" style={styles.card}>
          <View style={styles.row}>
            <BookOpen size={20} color={Colors.turquoiseLight} />
            <Text style={styles.cardHeader}>Milestone 1 Implementation Status</Text>
          </View>
          <View style={styles.badgeWrap}>
            <Badge label="Milestone 1 Foundation" variant="turquoise" />
            <Badge label="Offline Ready" variant="neutral" />
          </View>
          <Text style={styles.statusDescription}>
            Scaffolding, TypeScript configuration, EAS build profile, asset styling, tab navigation,
            onboarding, and screen foundations are active. Subsequent milestones will implement
            interactive decision mechanics, Supabase auth, and leaderboard synchronization.
          </Text>
        </Card>

        {/* Dismiss Button */}
        <Button
          title="Return to Application"
          variant="primary"
          size="lg"
          onPress={() => router.back()}
          icon={<X size={18} color={Colors.white} />}
          style={styles.closeButton}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.navyDark,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginVertical: Spacing.md,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.navyLight,
    borderWidth: 2,
    borderColor: Colors.turquoise,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.white,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.cyanSoft,
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 280,
    lineHeight: 18,
  },
  card: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  cardHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
    marginLeft: Spacing.xs,
  },
  authorityContent: {
    marginTop: 2,
  },
  entityTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.turquoiseLight,
  },
  deptTitle: {
    fontSize: 12,
    color: Colors.cyanSoft,
    marginTop: 2,
    fontWeight: '600',
  },
  bodyText: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginTop: Spacing.xs,
  },
  techList: {
    gap: 6,
  },
  techItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  techText: {
    fontSize: 13,
    color: Colors.textPrimary,
  },
  badgeWrap: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginVertical: Spacing.xs,
  },
  statusDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginTop: Spacing.xs,
  },
  closeButton: {
    marginTop: Spacing.sm,
    width: '100%',
  },
});
