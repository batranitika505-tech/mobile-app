/**
 * Canonical Achievements Catalog
 * Milestone 4.1: JalRakshak Achievements & Certificates
 */

import { Achievement } from '../types/achievement';

export const ACHIEVEMENT_IDS = {
  FIRST_DROP: 'first_drop',
  DROUGHT_RESILIENT: 'drought_resilient',
  RECHARGE_MASTER: 'recharge_master',
  AQUIFER_GUARDIAN: 'aquifer_guardian',
  JAL_KRANTI_PIONEER: 'jal_kranti_pioneer',
  WATER_EXPLORER: 'water_explorer',
  GROUNDWATER_GUARDIAN: 'groundwater_guardian',
  CONSERVATION_CHAMPION: 'conservation_champion',
  HIGH_SCORER: 'high_scorer',
  WATER_LEGEND: 'water_legend',
} as const;

export type AchievementId = (typeof ACHIEVEMENT_IDS)[keyof typeof ACHIEVEMENT_IDS];

export const ACHIEVEMENTS_CATALOG: Achievement[] = [
  {
    id: ACHIEVEMENT_IDS.FIRST_DROP,
    title: 'First Drop',
    description: 'Complete your first groundwater conservation scenario.',
    category: 'progression',
    tier: 'bronze',
    icon: 'Droplet',
    criteria: {
      type: 'scenarios_completed',
      requiredScenariosCount: 1,
    },
    coinReward: 20,
  },
  {
    id: ACHIEVEMENT_IDS.DROUGHT_RESILIENT,
    title: 'Drought Resilient',
    description: 'Master drip irrigation and drought mitigation by completing Module 1.',
    category: 'module',
    tier: 'silver',
    icon: 'ShieldAlert',
    criteria: {
      type: 'module_completed',
      requiredModuleId: 'drought',
    },
    coinReward: 50,
  },
  {
    id: ACHIEVEMENT_IDS.RECHARGE_MASTER,
    title: 'Recharge Master',
    description: 'Capture monsoon surplus and restore groundwater tables by completing Module 2.',
    category: 'module',
    tier: 'silver',
    icon: 'Sparkles',
    criteria: {
      type: 'module_completed',
      requiredModuleId: 'rainfall',
    },
    coinReward: 50,
  },
  {
    id: ACHIEVEMENT_IDS.AQUIFER_GUARDIAN,
    title: 'Aquifer Guardian',
    description: 'Protect groundwater from chemical contamination and runoff by completing Module 3.',
    category: 'module',
    tier: 'silver',
    icon: 'ShieldCheck',
    criteria: {
      type: 'module_completed',
      requiredModuleId: 'contamination',
    },
    coinReward: 50,
  },
  {
    id: ACHIEVEMENT_IDS.JAL_KRANTI_PIONEER,
    title: 'Jal Kranti Pioneer',
    description: 'Champion community water-budgeting and crop rotation by completing Module 4.',
    category: 'module',
    tier: 'silver',
    icon: 'Sprout',
    criteria: {
      type: 'module_completed',
      requiredModuleId: 'agriculture',
    },
    coinReward: 50,
  },
  {
    id: ACHIEVEMENT_IDS.WATER_EXPLORER,
    title: 'Water Explorer',
    description: 'Complete at least 8 groundwater conservation scenarios across regions.',
    category: 'progression',
    tier: 'silver',
    icon: 'Compass',
    criteria: {
      type: 'scenarios_completed',
      requiredScenariosCount: 8,
    },
    coinReward: 60,
  },
  {
    id: ACHIEVEMENT_IDS.GROUNDWATER_GUARDIAN,
    title: 'Groundwater Guardian',
    description: 'Successfully resolve all 16 scenarios across all 4 JalRakshak modules.',
    category: 'mastery',
    tier: 'gold',
    icon: 'Award',
    criteria: {
      type: 'all_modules_completed',
      requiredScenariosCount: 16,
    },
    coinReward: 100,
  },
  {
    id: ACHIEVEMENT_IDS.CONSERVATION_CHAMPION,
    title: 'Conservation Champion',
    description: 'Amass 3,500 total conservation XP through exemplary water decisions.',
    category: 'score',
    tier: 'gold',
    icon: 'Flame',
    criteria: {
      type: 'min_total_xp',
      requiredTotalXp: 3500,
    },
    coinReward: 100,
  },
  {
    id: ACHIEVEMENT_IDS.HIGH_SCORER,
    title: 'High Scorer',
    description: 'Achieve a perfect score of 350 XP on any single groundwater mission.',
    category: 'mastery',
    tier: 'gold',
    icon: 'Target',
    criteria: {
      type: 'single_scenario_perfect_score',
      requiredScenarioScore: 350,
    },
    coinReward: 80,
  },
  {
    id: ACHIEVEMENT_IDS.WATER_LEGEND,
    title: 'Water Legend',
    description: 'Achieve supreme mastery: earn ≥ 5,000 XP and complete all 16 conservation scenarios.',
    category: 'mastery',
    tier: 'platinum',
    icon: 'Trophy',
    criteria: {
      type: 'mastery_legend',
      requiredTotalXp: 5000,
      requiredScenariosCount: 16,
    },
    coinReward: 200,
  },
];
