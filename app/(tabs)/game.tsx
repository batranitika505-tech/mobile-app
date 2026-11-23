import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Award,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Droplets,
  Flame,
  Gamepad2,
  Play,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Sprout,
  Target,
} from 'lucide-react-native';

import { Colors } from '../../src/constants/colors';
import { BorderRadius, Spacing } from '../../src/constants/layout';
import { Button } from '../../src/components/common/Button';
import { Card } from '../../src/components/common/Card';
import { Badge } from '../../src/components/common/Badge';
import { ALL_GAME_MODULES } from '../../src/data/gameData';
import { useGuestProgress } from '../../src/context/GuestProgressContext';

export default function GameScreen() {
  const router = useRouter();
  const { isScenarioCompleted, getScenarioRecord, progress } = useGuestProgress();
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>('drought');

  const toggleModule = (id: string) => {
    setExpandedModuleId((prev) => (prev === id ? null : id));
  };

  const getModuleIcon = (iconName: string, variant: string) => {
    switch (iconName) {
      case 'Flame':
        return <Flame size={24} color={Colors.warningOrange} />;
      case 'Droplets':
        return <Droplets size={24} color={Colors.turquoise} />;
      case 'ShieldAlert':
        return <ShieldAlert size={24} color={Colors.dangerRed} />;
      case 'Sprout':
      default:
        return <Sprout size={24} color={Colors.sustainableGreen} />;
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Intro Header */}
      <Card variant="highlight" style={styles.headerCard}>
        <View style={styles.headerRow}>
          <Target size={24} color={Colors.turquoise} />
          <View style={styles.headerTextWrap}>
            <Text style={styles.headerTitle}>Groundwater Mission Arena</Text>
            <Text style={styles.headerSubtitle}>
              4 Comprehensive Modules • 16 Real-World Scenarios
            </Text>
          </View>
        </View>
        <Text style={styles.headerExplanation}>
          Each module explores critical groundwater conservation dilemmas. Make tactical management
          decisions, earn XP and eco coins, and master sustainable hydrogeological stewardship.
        </Text>

        <View style={styles.progressSummaryRow}>
          <View style={styles.progressMetric}>
            <Text style={styles.metricNumber}>{progress.completedScenarios.length} / 16</Text>
            <Text style={styles.metricLabel}>Scenarios Cleared</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.progressMetric}>
            <Text style={styles.metricNumber}>{progress.completedModules.length} / 4</Text>
            <Text style={styles.metricLabel}>Modules Complete</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.progressMetric}>
            <Text style={styles.metricNumber}>{progress.totalXp} XP</Text>
            <Text style={styles.metricLabel}>Verified Score</Text>
          </View>
        </View>
      </Card>

      {/* Modules List */}
      {ALL_GAME_MODULES.map((module) => {
        const isExpanded = expandedModuleId === module.id;
        const completedCount = module.scenarios.filter((s) => isScenarioCompleted(s.id)).length;
        const isModuleComplete = completedCount === module.scenarios.length;

        return (
          <Card key={module.id} variant="default" style={styles.moduleCard}>
            {/* Card Header (Clickable Accordion) */}
            <View style={styles.cardTopRow}>
              <View style={styles.iconAndTitle}>
                <View
                  style={[
                    styles.moduleIconContainer,
                    {
                      backgroundColor:
                        module.variant === 'warning'
                          ? Colors.warningBg
                          : module.variant === 'turquoise'
                            ? 'rgba(0, 180, 216, 0.15)'
                            : module.variant === 'danger'
                              ? Colors.dangerBg
                              : Colors.sustainableGreenBg,
                    },
                  ]}>
                  {getModuleIcon(module.iconName, module.variant)}
                </View>
                <View style={styles.titleContainer}>
                  <View style={styles.moduleBadgeRow}>
                    <Badge label={`Module ${module.number}`} variant={module.variant} />
                    {isModuleComplete ? (
                      <Badge
                        label="Module Complete"
                        variant="success"
                        icon={<CheckCircle2 size={12} color={Colors.sustainableGreenLight} />}
                      />
                    ) : (
                      <Badge label={`${completedCount}/4 Cleared`} variant="neutral" />
                    )}
                  </View>
                  <Text style={styles.moduleTitle}>{module.title}</Text>
                  <Text style={styles.moduleSubtitle}>{module.subtitle}</Text>
                </View>
              </View>
            </View>

            <Text style={styles.description}>{module.description}</Text>

            {/* Topic Chips */}
            <View style={styles.topicRow}>
              {module.topics.map((topic, idx) => (
                <View key={idx} style={styles.topicChip}>
                  <Text style={styles.topicText}>{topic}</Text>
                </View>
              ))}
            </View>

            {/* Toggle Expansion Button */}
            <Button
              title={isExpanded ? 'Hide Scenarios' : `View 4 Scenarios (${completedCount}/4 Cleared)`}
              variant="secondary"
              size="sm"
              onPress={() => toggleModule(module.id)}
              icon={
                isExpanded ? (
                  <ChevronUp size={16} color={Colors.cyanSoft} />
                ) : (
                  <ChevronDown size={16} color={Colors.cyanSoft} />
                )
              }
              iconPosition="right"
              style={styles.toggleButton}
            />

            {/* Scenarios List (Expanded) */}
            {isExpanded && (
              <View style={styles.scenariosContainer}>
                <Text style={styles.scenariosHeader}>Interactive Mission Scenarios:</Text>
                {module.scenarios.map((sc) => {
                  const isCompleted = isScenarioCompleted(sc.id);
                  const record = getScenarioRecord(sc.id);

                  return (
                    <Card key={sc.id} variant="outlined" style={styles.scenarioCard}>
                      <View style={styles.scenarioHeaderRow}>
                        <Text style={styles.scenarioTitle}>
                          {sc.number}. {sc.title}
                        </Text>
                        {isCompleted ? (
                          <Badge
                            label={`Cleared (+${record?.earnedXp ?? 0} XP)`}
                            variant="success"
                            icon={<CheckCircle2 size={12} color={Colors.sustainableGreenLight} />}
                          />
                        ) : (
                          <Badge label="Up to 350 XP" variant="turquoise" />
                        )}
                      </View>
                      <Text style={styles.scenarioDesc}>{sc.description}</Text>

                      <View style={styles.actionPreviewRow}>
                        <Text style={styles.targetLabel}>Situation Challenge:</Text>
                        <Text style={styles.targetAction} numberOfLines={2}>
                          {sc.situation}
                        </Text>
                      </View>

                      <Button
                        title={isCompleted ? 'Replay Scenario' : 'Play Scenario'}
                        variant={isCompleted ? 'secondary' : 'primary'}
                        size="sm"
                        onPress={() => router.push(`/game/${sc.id}` as any)}
                        icon={
                          isCompleted ? (
                            <RotateCcw size={14} color={Colors.cyanSoft} />
                          ) : (
                            <Play size={14} color={Colors.white} />
                          )
                        }
                        style={styles.scenarioLaunchBtn}
                      />
                    </Card>
                  );
                })}
              </View>
            )}
          </Card>
        );
      })}

      {/* Completion Trophy Callout if all modules complete */}
      {progress.completedModules.length === 4 && (
        <Card variant="sustainable" style={styles.completionBannerCard}>
          <View style={styles.trophyHeader}>
            <Award size={24} color={Colors.sustainableGreenLight} />
            <Text style={styles.trophyTitle}>All 4 Modules Cleared!</Text>
          </View>
          <Text style={styles.trophyBody}>
            Outstanding dedication, Cadet! You have completed all 16 groundwater scenarios. Check
            your Player Profile to view your Educational Achievement Certificate eligibility.
          </Text>
        </Card>
      )}
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
  headerCard: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  headerTextWrap: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.white,
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.turquoiseLight,
    marginTop: 2,
    fontWeight: '500',
  },
  headerExplanation: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginTop: Spacing.xs,
  },
  progressSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: Colors.navyDark,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.navyCardBorder,
  },
  progressMetric: {
    alignItems: 'center',
    flex: 1,
  },
  metricNumber: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.white,
  },
  metricLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 1,
  },
  metricDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.navyCardBorder,
  },
  moduleCard: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  iconAndTitle: {
    flexDirection: 'row',
    gap: Spacing.md,
    flex: 1,
  },
  moduleIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  titleContainer: {
    flex: 1,
  },
  moduleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  moduleTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.white,
    marginTop: 4,
  },
  moduleSubtitle: {
    fontSize: 12,
    color: Colors.cyanSoft,
    marginTop: 2,
  },
  description: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginTop: Spacing.sm,
  },
  topicRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginVertical: Spacing.sm,
  },
  topicChip: {
    backgroundColor: Colors.navyCard,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.navyCardBorder,
  },
  topicText: {
    fontSize: 11,
    color: Colors.turquoiseLight,
    fontWeight: '500',
  },
  toggleButton: {
    marginTop: Spacing.xs,
  },
  scenariosContainer: {
    marginTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.navyCardBorder,
    paddingTop: Spacing.sm,
  },
  scenariosHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: Spacing.sm,
  },
  scenarioCard: {
    padding: Spacing.sm + 4,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.navyDark,
  },
  scenarioHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  scenarioTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.white,
    flex: 1,
    marginRight: Spacing.sm,
  },
  scenarioDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
    marginBottom: 6,
  },
  actionPreviewRow: {
    backgroundColor: Colors.navyCard,
    padding: 6,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.sm,
  },
  targetLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.turquoiseLight,
    textTransform: 'uppercase',
  },
  targetAction: {
    fontSize: 11,
    color: Colors.textPrimary,
    marginTop: 2,
    lineHeight: 15,
  },
  scenarioLaunchBtn: {
    width: '100%',
  },
  completionBannerCard: {
    padding: Spacing.md,
    marginTop: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  trophyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs + 2,
    marginBottom: Spacing.xs,
  },
  trophyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.sustainableGreenLight,
  },
  trophyBody: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});
