import React from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
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
import { useGuestProgress } from '../../src/context/GuestProgressContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { progress, isLoading, resetProgress } = useGuestProgress();

  const currentLevel = Math.floor(progress.totalXp / 250) + 1;

  // Maximum scenarios is 16; total max XP is 1600; 70% threshold is 1120 XP
  const maxConfiguredXp = 1600;
  const targetXp70Percent = 1120;
  const moduleProgress = progress.completedModules.length / 4;
  const xpProgress = Math.min(1, progress.totalXp / targetXp70Percent);
  const certPercentage = Math.round(((moduleProgress + xpProgress) / 2) * 100);

  const handleResetGuestData = () => {
    Alert.alert(
      'Reset Gameplay Progress',
      'This will reset your earned XP, coins, completed scenarios, and modules back to zero.\n\nYour persistent Guest ID will be preserved.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset Progress',
          style: 'destructive',
          onPress: async () => {
            try {
              await resetProgress();
              Alert.alert('Reset Complete', 'Your gameplay progress has been reset to zero.');
            } catch {
              Alert.alert('Error', 'Failed to reset progress. Please try again.');
            }
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
              <Badge label={`Level ${currentLevel}`} variant="neutral" />
            </View>
            <Text style={styles.playerName}>Cadet JalRakshak</Text>
            <Text style={styles.playerRole}>
              Trainee • ID: {progress.guestId ? progress.guestId.slice(0, 16) + '...' : 'Loading...'}
            </Text>
          </View>
        </View>

        {/* Progress Grid */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={Colors.turquoise} />
            <Text style={styles.loadingText}>Loading progress data...</Text>
          </View>
        ) : (
          <View style={styles.statsGrid}>
            <View style={styles.gridBox}>
              <Text style={styles.gridLabel}>Total XP</Text>
              <Text style={styles.gridValue}>{progress.totalXp}</Text>
              <Text style={styles.gridSub}>Target: 1,600 XP</Text>
            </View>
            <View style={styles.gridBox}>
              <Text style={styles.gridLabel}>Coins</Text>
              <Text style={styles.gridValue}>{progress.coins}</Text>
              <Text style={styles.gridSub}>Eco Tokens</Text>
            </View>
            <View style={styles.gridBox}>
              <Text style={styles.gridLabel}>Missions</Text>
              <Text style={styles.gridValue}>{progress.completedModules.length} / 4</Text>
              <Text style={styles.gridSub}>Modules Complete</Text>
            </View>
          </View>
        )}
      </Card>

      {/* Educational Certificate Eligibility Card */}
      <Card variant="default" style={styles.certCard}>
        <View style={styles.certHeader}>
          <FileCheck2 size={24} color={Colors.turquoise} />
          <View style={styles.certTitleWrap}>
            <Text style={styles.certTitle}>Educational Achievement Certificate</Text>
            <Text style={styles.certSub}>Project-issued educational learning certificate</Text>
          </View>
        </View>

        <Text style={styles.certExplanation}>
          Eligible upon completing all 4 modules and achieving at least 70% of maximum scenario XP ({targetXp70Percent} XP).
        </Text>

        <View style={styles.progressBarContainer}>
          <View style={styles.progressBackground}>
            <View style={[styles.progressFill, { width: `${certPercentage}%` }]} />
          </View>
          <Text style={styles.progressText}>{certPercentage}% of requirement met</Text>
        </View>

        <View style={styles.reqRow}>
          <View style={styles.reqItem}>
            <CheckCircle
              size={14}
              color={progress.completedModules.length === 4 ? Colors.sustainableGreen : Colors.textMuted}
            />
            <Text style={styles.reqText}>Complete 4 Modules ({progress.completedModules.length}/4)</Text>
          </View>
          <View style={styles.reqItem}>
            <CheckCircle
              size={14}
              color={progress.totalXp >= targetXp70Percent ? Colors.sustainableGreen : Colors.textMuted}
            />
            <Text style={styles.reqText}>
              Earn ≥ 70% Max XP ({progress.totalXp} / {targetXp70Percent} XP)
            </Text>
          </View>
        </View>

        <Text style={styles.certDisclaimer}>
          Notice: The certificate is a project-generated learning achievement for this educational
          app and is not an official government certification.
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
          title="About JalRakshak Project"
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
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.navyDark,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.navyCardBorder,
  },
  loadingText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
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

