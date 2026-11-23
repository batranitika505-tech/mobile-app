import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  ChevronDown,
  ChevronUp,
  Droplets,
  Flame,
  Info,
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

interface GameModule {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  topics: string[];
  scenarios: {
    title: string;
    description: string;
    targetAction: string;
  }[];
  icon: React.ReactNode;
  variant: 'warning' | 'turquoise' | 'danger' | 'success';
}

const gameModules: GameModule[] = [
  {
    id: 'drought',
    number: 1,
    title: 'Drought Crisis',
    subtitle: 'Groundwater Conservation Under Severe Scarcity',
    description:
      'The local aquifer level has dropped 15 meters below normal. Farmers are competing for deep borewells. Guide community water budgeting.',
    topics: ['Drip Irrigation', 'Water-Efficient Crops', 'Diversification', 'Over-Extraction'],
    icon: <Flame size={24} color={Colors.warningOrange} />,
    variant: 'warning',
    scenarios: [
      {
        title: 'Scenario 1.1: Deep Borewell Over-Extraction',
        description: 'Borewell yield has dropped 40%. Farmers request permits for deeper drillings.',
        targetAction: 'Enforce artificial extraction caps and transition to drip micro-irrigation.',
      },
      {
        title: 'Scenario 1.2: Water-Intensive Crop Shift',
        description: 'Sugarcane cultivation is draining 85% of regional groundwater in drought.',
        targetAction: 'Incentivize millet and pulse crop diversification.',
      },
      {
        title: 'Scenario 1.3: Community Well Rationing',
        description: 'Drinking water borewells are running dry across 6 villages.',
        targetAction: 'Establish community water sharing and emergency reserve quotas.',
      },
      {
        title: 'Scenario 1.4: Feeder Canal Evaporation Loss',
        description: 'Open channels are losing 35% of water to evaporation under extreme heat.',
        targetAction: 'Implement underground pipeline conveyance and night irrigation.',
      },
    ],
  },
  {
    id: 'rainfall',
    number: 2,
    title: 'Rainfall Opportunity',
    subtitle: 'Sustainable Surplus Water Management & Harvesting',
    description:
      'Unusually heavy monsoon showers have begun. Surface runoff is causing erosion rather than soaking into aquifers. Direct runoff subterraneanly.',
    topics: ['Artificial Recharge', 'Recharge Pits', 'Rainwater Harvesting', 'Runoff Management'],
    icon: <Droplets size={24} color={Colors.turquoise} />,
    variant: 'turquoise',
    scenarios: [
      {
        title: 'Scenario 2.1: Urban Rooftop Runoff',
        description: 'Flash rains in district towns are flooding storm drains without recharging.',
        targetAction: 'Mandate rooftop rainwater harvesting filter shafts for all public structures.',
      },
      {
        title: 'Scenario 2.2: Village Check Dam Placement',
        description: 'Monsoon streams flow swiftly out of the watershed into rivers.',
        targetAction: 'Construct cascading check dams and percolation pits along contour lines.',
      },
      {
        title: 'Scenario 2.3: Desiltation of Traditional Water Bodies',
        description: 'Ancient stepwells and village ponds have lost storage due to silt buildup.',
        targetAction: 'Organize community desilting and clear recharge intake channels.',
      },
      {
        title: 'Scenario 2.4: Injection Well Recharge in Overexploited Block',
        description: 'Deep unconfined aquifers require direct replenishment from clean flood waters.',
        targetAction: 'Install sand-gravel filter injection wells connected to sediment basins.',
      },
    ],
  },
  {
    id: 'contamination',
    number: 3,
    title: 'Contamination Crisis',
    subtitle: 'Groundwater Quality & Pollution Abatement',
    description:
      'Elevated fluoride, nitrate, and heavy metal concentrations have been detected in regional test borewells. Isolate pollutants.',
    topics: ['Source Identification', 'Water Quality Testing', 'Pollution Prevention', 'Safe Water Usage'],
    icon: <ShieldAlert size={24} color={Colors.dangerRed} />,
    variant: 'danger',
    scenarios: [
      {
        title: 'Scenario 3.1: Fertilizer Leaching Detection',
        description: 'High nitrate levels found in drinking wells near intensive pesticide zones.',
        targetAction: 'Introduce organic buffer zones and soil nutrient balancing.',
      },
      {
        title: 'Scenario 3.2: Industrial Effluent Seepage',
        description: 'Unlined factory waste pits threaten the primary drinking water table.',
        targetAction: 'Seal effluent pits, enforce zero liquid discharge, and drill monitoring wells.',
      },
      {
        title: 'Scenario 3.3: Fluoride Affected Village Well',
        description: 'Deep aquifer water contains 3.5 mg/L fluoride, exceeding safe limits.',
        targetAction: 'Cap deep fluoride borewell and connect village to shallow filtered recharge.',
      },
      {
        title: 'Scenario 3.4: Saline Ingress in Coastal Aquifer',
        description: 'Excessive pumping near the coast has inverted hydraulic gradients, causing saltwater intrusion.',
        targetAction: 'Halt coastal pumping and construct a freshwater hydraulic barrier.',
      },
    ],
  },
  {
    id: 'agriculture',
    number: 4,
    title: 'Smart Agriculture',
    subtitle: 'Sustainable Agricultural & Micro-Irrigation Practices',
    description:
      'Optimize crop water productivity. Demonstrate how high-yield agriculture can prosper with 40% less groundwater consumption.',
    topics: ['Micro-Irrigation', 'Crop Selection', 'Irrigation Scheduling', 'Efficient Utilization'],
    icon: <Sprout size={24} color={Colors.sustainableGreen} />,
    variant: 'success',
    scenarios: [
      {
        title: 'Scenario 4.1: Flood vs Drip Irrigation Comparison',
        description: 'Farmers use flood furrows on cotton crops, losing 50% water to deep percolation.',
        targetAction: 'Install solar-powered drip lateral lines with pressure compensators.',
      },
      {
        title: 'Scenario 4.2: Tensiometer Soil Moisture Scheduling',
        description: 'Pumps are run on fixed timers regardless of existing root-zone moisture.',
        targetAction: 'Deploy tensiometer moisture sensors to schedule irrigation dynamically.',
      },
      {
        title: 'Scenario 4.3: Mulching & Soil Moisture Retention',
        description: 'High soil evaporation during dry spells requires frequent borewell cycles.',
        targetAction: 'Apply organic crop residue mulching to retain 30% soil moisture.',
      },
      {
        title: 'Scenario 4.4: Participatory Groundwater Management (PGWM)',
        description: 'Neighboring farmers over-pump without knowing neighboring extraction rates.',
        targetAction: 'Form village groundwater user association for collective water budgeting.',
      },
    ],
  },
];

export default function GameScreen() {
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>('drought');

  const toggleModule = (id: string) => {
    setExpandedModuleId((prev) => (prev === id ? null : id));
  };

  const handleLaunchScenario = (moduleTitle: string, scenarioTitle: string) => {
    Alert.alert(
      'Scenario Preview',
      `Selected: ${scenarioTitle}\nModule: ${moduleTitle}\n\nInteractive scenario gameplay with decision choices, educational feedback, and XP scoring will be activated in Milestone 2.`,
      [{ text: 'Close', style: 'default' }]
    );
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
          Each module explores groundwater dilemmas based on educational problem statements and
          hydrological conservation principles. Choose your path wisely.
        </Text>
      </Card>

      {/* Modules List */}
      {gameModules.map((module) => {
        const isExpanded = expandedModuleId === module.id;

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
                  {module.icon}
                </View>
                <View style={styles.titleContainer}>
                  <Badge label={`Module ${module.number}`} variant={module.variant} />
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
              title={isExpanded ? 'Hide Scenarios' : `View 4 Scenarios`}
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
                <Text style={styles.scenariosHeader}>Interactive Scenarios:</Text>
                {module.scenarios.map((sc, scIdx) => (
                  <Card key={scIdx} variant="outlined" style={styles.scenarioCard}>
                    <View style={styles.scenarioHeaderRow}>
                      <Text style={styles.scenarioTitle}>{sc.title}</Text>
                      <Badge label="100 XP" variant="success" />
                    </View>
                    <Text style={styles.scenarioDesc}>{sc.description}</Text>
                    <View style={styles.actionPreviewRow}>
                      <Text style={styles.targetLabel}>Target Strategy:</Text>
                      <Text style={styles.targetAction}>{sc.targetAction}</Text>
                    </View>
                    <Button
                      title="Launch Scenario"
                      variant="primary"
                      size="sm"
                      onPress={() => handleLaunchScenario(module.title, sc.title)}
                      icon={<Sparkles size={14} color={Colors.white} />}
                      style={styles.scenarioLaunchBtn}
                    />
                  </Card>
                ))}
              </View>
            )}
          </Card>
        );
      })}

      {/* Milestone 1 Notice */}
      <Card variant="outlined" style={styles.footerNoteCard}>
        <View style={styles.noteHeader}>
          <Info size={16} color={Colors.turquoiseLight} />
          <Text style={styles.noteTitle}>Milestone 1 Foundation Preview</Text>
        </View>
        <Text style={styles.noteBody}>
          Module definitions, scenario outlines, and screen navigation are initialized. Interactive
          decision options, educational feedback, and scoring mechanics will be implemented in
          Milestone 2.
        </Text>
      </Card>
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
  footerNoteCard: {
    padding: Spacing.md,
    marginTop: Spacing.xs,
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  noteTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.turquoiseLight,
  },
  noteBody: {
    fontSize: 12,
    color: Colors.textMuted,
    lineHeight: 16,
  },
});

