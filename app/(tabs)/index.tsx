import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Award,
  BookOpen,
  CheckCircle2,
  Coins,
  Droplets,
  Flame,
  Gamepad2,
  ShieldAlert,
  Sprout,
  Trophy,
} from 'lucide-react-native';

import { Colors } from '../../src/constants/colors';
import { BorderRadius, Spacing } from '../../src/constants/layout';
import { Button } from '../../src/components/common/Button';
import { Card } from '../../src/components/common/Card';
import { Badge } from '../../src/components/common/Badge';
import { useGuestProgress } from '../../src/context/GuestProgressContext';
import { ALL_GAME_MODULES } from '../../src/data/gameData';

export default function HomeScreen() {
  const router = useRouter();
  const { progress, isLoading } = useGuestProgress();

  const currentLevel = Math.floor(progress.totalXp / 250) + 1;
  const levelTitle =
    currentLevel === 1
      ? 'Novice'
      : currentLevel === 2
        ? 'Apprentice'
        : currentLevel === 3
          ? 'Guardian'
          : 'Master';

  const guestLabel = progress.guestId
    ? `Guest: ${progress.guestId.slice(-6)}`
    : 'Guest Session';

  const getModuleCompletedCount = (moduleId: string) => {
    const mod = ALL_GAME_MODULES.find((m) => m.id === moduleId);
    if (!mod) return 0;
    return mod.scenarios.filter((s) => progress.completedScenarios.includes(s.id)).length;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Cadet Header Banner */}
      <Card variant="highlight" style={styles.cadetBanner}>
        <View style={styles.bannerHeader}>
          <View>
            <Text style={styles.welcomeSubtitle}>Welcome Back, Cadet</Text>
            <Text style={styles.cadetName}>Groundwater Guardian</Text>
          </View>
          <Badge
            label={guestLabel}
            variant="turquoise"
            icon={<Droplets size={12} color={Colors.turquoiseLight} />}
          />
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={Colors.turquoise} />
            <Text style={styles.loadingText}>Restoring saved progress...</Text>
          </View>
        ) : (
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <View style={styles.statIconRow}>
                <Award size={16} color={Colors.turquoise} />
                <Text style={styles.statLabel}>Total XP</Text>
              </View>
              <Text style={styles.statValue}>{progress.totalXp} XP</Text>
              <Text style={styles.statSub}>Level {currentLevel}: {levelTitle}</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statBox}>
              <View style={styles.statIconRow}>
                <Coins size={16} color={Colors.goldCoin} />
                <Text style={styles.statLabel}>Coins</Text>
              </View>
              <Text style={styles.statValue}>{progress.coins}</Text>
              <Text style={styles.statSub}>Eco Credits</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statBox}>
              <View style={styles.statIconRow}>
                <CheckCircle2 size={16} color={Colors.sustainableGreen} />
                <Text style={styles.statLabel}>Cleared</Text>
              </View>
              <Text style={styles.statValue}>{progress.completedScenarios.length} / 16</Text>
              <Text style={styles.statSub}>Scenarios</Text>
            </View>
          </View>
        )}
      </Card>

      {/* Main Call to Action */}
      <Card style={styles.actionCard}>
        <View style={styles.actionCardHeader}>
          <Droplets size={24} color={Colors.turquoise} />
          <View style={styles.actionTextContainer}>
            <Text style={styles.actionCardTitle}>Ready to Conserve Groundwater?</Text>
            <Text style={styles.actionCardDesc}>
              Make tactical decisions across drought, rainfall, and irrigation scenarios.
            </Text>
          </View>
        </View>
        <Button
          title="Go to Game Missions"
          variant="primary"
          size="md"
          onPress={() => router.push('/(tabs)/game')}
          icon={<Gamepad2 size={18} color={Colors.white} />}
          style={styles.actionButton}
        />
      </Card>

      {/* Educational Modules Overview */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Groundwater Modules</Text>
        <Badge label="4 Crises" variant="neutral" />
      </View>

      {/* Module 1 */}
      <Card
        onPress={() => router.push('/(tabs)/game')}
        variant="default"
        style={styles.moduleItemCard}>
        <View style={styles.moduleRow}>
          <View style={[styles.moduleIconBox, { backgroundColor: Colors.warningBg }]}>
            <Flame size={24} color={Colors.warningOrange} />
          </View>
          <View style={styles.moduleInfo}>
            <View style={styles.moduleTagRow}>
              <Badge label="Module 1" variant="warning" />
              <Text style={styles.scenarioCount}>{getModuleCompletedCount('drought')} / 4 Cleared</Text>
            </View>
            <Text style={styles.moduleTitle}>Drought Crisis</Text>
            <Text style={styles.moduleSummary}>
              Curb over-extraction, mandate micro-irrigation, and protect critical aquifers.
            </Text>
          </View>
        </View>
      </Card>

      {/* Module 2 */}
      <Card
        onPress={() => router.push('/(tabs)/game')}
        variant="default"
        style={styles.moduleItemCard}>
        <View style={styles.moduleRow}>
          <View style={[styles.moduleIconBox, { backgroundColor: 'rgba(0, 180, 216, 0.15)' }]}>
            <Droplets size={24} color={Colors.turquoise} />
          </View>
          <View style={styles.moduleInfo}>
            <View style={styles.moduleTagRow}>
              <Badge label="Module 2" variant="turquoise" />
              <Text style={styles.scenarioCount}>{getModuleCompletedCount('rainfall')} / 4 Cleared</Text>
            </View>
            <Text style={styles.moduleTitle}>Rainfall Opportunity</Text>
            <Text style={styles.moduleSummary}>
              Harvest monsoon runoffs with artificial recharge pits and check dams.
            </Text>
          </View>
        </View>
      </Card>

      {/* Module 3 */}
      <Card
        onPress={() => router.push('/(tabs)/game')}
        variant="default"
        style={styles.moduleItemCard}>
        <View style={styles.moduleRow}>
          <View style={[styles.moduleIconBox, { backgroundColor: Colors.dangerBg }]}>
            <ShieldAlert size={24} color={Colors.dangerRed} />
          </View>
          <View style={styles.moduleInfo}>
            <View style={styles.moduleTagRow}>
              <Badge label="Module 3" variant="danger" />
              <Text style={styles.scenarioCount}>{getModuleCompletedCount('contamination')} / 4 Cleared</Text>
            </View>
            <Text style={styles.moduleTitle}>Contamination Crisis</Text>
            <Text style={styles.moduleSummary}>
              Detect hazardous chemical runoff, test borehole water, and stop pollution.
            </Text>
          </View>
        </View>
      </Card>

      {/* Module 4 */}
      <Card
        onPress={() => router.push('/(tabs)/game')}
        variant="default"
        style={styles.moduleItemCard}>
        <View style={styles.moduleRow}>
          <View style={[styles.moduleIconBox, { backgroundColor: Colors.sustainableGreenBg }]}>
            <Sprout size={24} color={Colors.sustainableGreen} />
          </View>
          <View style={styles.moduleInfo}>
            <View style={styles.moduleTagRow}>
              <Badge label="Module 4" variant="success" />
              <Text style={styles.scenarioCount}>{getModuleCompletedCount('agriculture')} / 4 Cleared</Text>
            </View>
            <Text style={styles.moduleTitle}>Smart Agriculture</Text>
            <Text style={styles.moduleSummary}>
              Implement crop diversification and sensor-guided precision irrigation.
            </Text>
          </View>
        </View>
      </Card>

      {/* Quick Navigation Footer Row */}
      <View style={styles.footerRow}>
        <Button
          title="View Leaderboard"
          variant="secondary"
          size="sm"
          onPress={() => router.push('/(tabs)/leaderboard')}
          icon={<Trophy size={16} color={Colors.cyanSoft} />}
          style={styles.footerButton}
        />
        <Button
          title="Review Tutorial"
          variant="secondary"
          size="sm"
          onPress={() => router.push('/onboarding')}
          icon={<BookOpen size={16} color={Colors.cyanSoft} />}
          style={styles.footerButton}
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
    paddingBottom: Spacing.xl,
  },
  cadetBanner: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  bannerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  welcomeSubtitle: {
    fontSize: 12,
    color: Colors.turquoiseLight,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontWeight: '600',
  },
  cadetName: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.white,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.navyDark,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
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
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.white,
  },
  statSub: {
    fontSize: 10,
    color: Colors.turquoiseLight,
    marginTop: 1,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.navyCardBorder,
    marginVertical: 4,
  },
  actionCard: {
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    backgroundColor: Colors.navyLight,
    borderColor: Colors.aquaticBlue,
    borderWidth: 1,
  },
  actionCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
  },
  actionCardDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginTop: 2,
  },
  actionButton: {
    marginTop: Spacing.xs,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    marginTop: Spacing.xs,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.white,
  },
  moduleItemCard: {
    marginBottom: Spacing.sm,
    padding: Spacing.md,
  },
  moduleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  moduleIconBox: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  moduleInfo: {
    flex: 1,
  },
  moduleTagRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  scenarioCount: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  moduleTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 2,
  },
  moduleSummary: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  footerRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  footerButton: {
    flex: 1,
  },
});
