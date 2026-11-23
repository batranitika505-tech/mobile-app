import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Award,
  BookOpen,
  CheckCircle,
  FileCheck2,
  Info,
  RotateCcw,
  Shield,
  Sparkles,
  Trophy,
  User,
} from 'lucide-react-native';

import { Colors } from '../../src/constants/colors';
import { BorderRadius, Spacing } from '../../src/constants/layout';
import { Button } from '../../src/components/common/Button';
import { Card } from '../../src/components/common/Card';
import { Badge } from '../../src/components/common/Badge';

export default function ProfileScreen() {
  const router = useRouter();

  const handleResetGuestData = () => {
    Alert.alert(
      'Reset Local Data',
      'This will clear local guest progress and restore starting baseline metrics.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Reset Complete', 'Local guest session has been reset.');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Player Identity Card */}
      <Card variant="highlight" style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarCircle}>
            <User size={36} color={Colors.turquoise} />
          </View>
          <View style={styles.profileInfo}>
            <View style={styles.badgeRow}>
              <Badge label="Guest Mode" variant="turquoise" />
              <Badge label="Level 1" variant="neutral" />
            </View>
            <Text style={styles.playerName}>Cadet JalRakshak</Text>
            <Text style={styles.playerRole}>Groundwater Conservation Trainee</Text>
          </View>
        </View>

        {/* Progress Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.gridBox}>
            <Text style={styles.gridLabel}>Total XP</Text>
            <Text style={styles.gridValue}>0</Text>
            <Text style={styles.gridSub}>Target: 1,600 XP</Text>
          </View>
          <View style={styles.gridBox}>
            <Text style={styles.gridLabel}>Coins</Text>
            <Text style={styles.gridValue}>0</Text>
            <Text style={styles.gridSub}>Eco Tokens</Text>
          </View>
          <View style={styles.gridBox}>
            <Text style={styles.gridLabel}>Missions</Text>
            <Text style={styles.gridValue}>0 / 4</Text>
            <Text style={styles.gridSub}>Modules Complete</Text>
          </View>
        </View>
      </Card>

      {/* Educational Certificate Eligibility Card */}
      <Card variant="default" style={styles.certCard}>
        <View style={styles.certHeader}>
          <FileCheck2 size={24} color={Colors.turquoise} />
          <View style={styles.certTitleWrap}>
            <Text style={styles.certTitle}>Educational Achievement Certificate</Text>
            <Text style={styles.certSub}>Project-issued CGWB learning certification</Text>
          </View>
        </View>

        <Text style={styles.certExplanation}>
          Eligible upon completing all 4 modules and achieving at least 70% of maximum scenario XP.
        </Text>

        <View style={styles.progressBarContainer}>
          <View style={styles.progressBackground}>
            <View style={[styles.progressFill, { width: '0%' }]} />
          </View>
          <Text style={styles.progressText}>0% of requirement met</Text>
        </View>

        <View style={styles.reqRow}>
          <View style={styles.reqItem}>
            <CheckCircle size={14} color={Colors.textMuted} />
            <Text style={styles.reqText}>Complete 4 Modules (0/4)</Text>
          </View>
          <View style={styles.reqItem}>
            <CheckCircle size={14} color={Colors.textMuted} />
            <Text style={styles.reqText}>Earn ≥ 70% Max XP (0 XP)</Text>
          </View>
        </View>

        <Text style={styles.certDisclaimer}>
          Notice: The certificate is a project-generated learning achievement and is not an official
          government certification.
        </Text>
      </Card>

      {/* Achievement Badges Showcase */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Achievement Badges</Text>
        <Badge label="4 Available" variant="neutral" />
      </View>

      <View style={styles.badgesGrid}>
        <Card variant="outlined" style={styles.badgeCard}>
          <Shield size={24} color={Colors.warningOrange} />
          <Text style={styles.badgeTitle}>Drought Resilient</Text>
          <Text style={styles.badgeDesc}>Master drip irrigation under water scarcity</Text>
        </Card>

        <Card variant="outlined" style={styles.badgeCard}>
          <Sparkles size={24} color={Colors.turquoise} />
          <Text style={styles.badgeTitle}>Recharge Master</Text>
          <Text style={styles.badgeDesc}>Capture monsoon surplus via recharge shafts</Text>
        </Card>

        <Card variant="outlined" style={styles.badgeCard}>
          <Award size={24} color={Colors.dangerRed} />
          <Text style={styles.badgeTitle}>Aquifer Guardian</Text>
          <Text style={styles.badgeDesc}>Detect and mitigate borehole contamination</Text>
        </Card>

        <Card variant="outlined" style={styles.badgeCard}>
          <Trophy size={24} color={Colors.sustainableGreen} />
          <Text style={styles.badgeTitle}>Smart Farmer</Text>
          <Text style={styles.badgeDesc}>Implement crop budgeting & micro-irrigation</Text>
        </Card>
      </View>

      {/* Navigation Shortcuts */}
      <View style={styles.actionsSection}>
        <Button
          title="Review Onboarding Tutorial"
          variant="secondary"
          size="md"
          onPress={() => router.push('/onboarding')}
          icon={<BookOpen size={18} color={Colors.cyanSoft} />}
          style={styles.actionBtn}
        />

        <Button
          title="About JalRakshak & CGWB"
          variant="secondary"
          size="md"
          onPress={() => router.push('/modal')}
          icon={<Info size={18} color={Colors.cyanSoft} />}
          style={styles.actionBtn}
        />

        <Button
          title="Reset Local Guest Progress"
          variant="ghost"
          size="sm"
          onPress={handleResetGuestData}
          icon={<RotateCcw size={16} color={Colors.dangerRed} />}
          textStyle={{ color: Colors.dangerRed }}
          style={styles.resetBtn}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.navyDark,
  },
  content: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  profileCard: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.navyDark,
    borderWidth: 2,
    borderColor: Colors.turquoise,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginBottom: 4,
  },
  playerName: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.white,
  },
  playerRole: {
    fontSize: 12,
    color: Colors.turquoiseLight,
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.xs,
    backgroundColor: Colors.navyDark,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.navyCardBorder,
  },
  gridBox: {
    flex: 1,
    alignItems: 'center',
  },
  gridLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  gridValue: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.white,
    marginVertical: 2,
  },
  gridSub: {
    fontSize: 9,
    color: Colors.cyanSoft,
  },
  certCard: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  certHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  certTitleWrap: {
    flex: 1,
  },
  certTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
  },
  certSub: {
    fontSize: 11,
    color: Colors.turquoiseLight,
    marginTop: 1,
  },
  certExplanation: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 17,
    marginVertical: Spacing.xs,
  },
  progressBarContainer: {
    marginVertical: Spacing.sm,
  },
  progressBackground: {
    height: 8,
    backgroundColor: Colors.navyDark,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.navyCardBorder,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.sustainableGreen,
  },
  progressText: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 4,
    textAlign: 'right',
  },
  reqRow: {
    gap: 4,
    marginVertical: Spacing.xs,
  },
  reqItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reqText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  certDisclaimer: {
    fontSize: 10,
    color: Colors.textMuted,
    fontStyle: 'italic',
    marginTop: Spacing.sm,
    lineHeight: 14,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  badgeCard: {
    width: '48%',
    padding: Spacing.md,
    alignItems: 'flex-start',
  },
  badgeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.white,
    marginTop: Spacing.xs,
  },
  badgeDesc: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
    lineHeight: 15,
  },
  actionsSection: {
    gap: Spacing.sm,
  },
  actionBtn: {
    width: '100%',
  },
  resetBtn: {
    alignSelf: 'center',
    marginTop: Spacing.xs,
  },
});
