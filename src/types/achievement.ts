/**
 * Achievement System Type Definitions
 * Milestone 4.1: JalRakshak Achievements & Certificates
 */

import { ScenarioRecord } from './progress';

export type AchievementCategory = 'progression' | 'module' | 'mastery' | 'score';

export type AchievementTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export type AchievementCriteriaType =
  | 'scenarios_completed'
  | 'module_completed'
  | 'all_modules_completed'
  | 'min_total_xp'
  | 'single_scenario_perfect_score'
  | 'mastery_legend';

export interface AchievementCriteria {
  type: AchievementCriteriaType;
  /** Number of scenarios required (e.g. 1 for First Drop, 8 for Water Explorer, 16 for all) */
  requiredScenariosCount?: number;
  /** Canonical module ID required (e.g. 'drought', 'rainfall', 'contamination', 'agriculture') */
  requiredModuleId?: string;
  /** Total XP required (e.g. 3500 for Conservation Champion, 5000 for Water Legend) */
  requiredTotalXp?: number;
  /** Single scenario score required (e.g. 350 for High Scorer) */
  requiredScenarioScore?: number;
}

export interface Achievement {
  /** Unique stable identifier (e.g. 'first_drop', 'drought_resilient') */
  id: string;
  /** Display title */
  title: string;
  /** Descriptive explanation of what was achieved */
  description: string;
  /** Functional category */
  category: AchievementCategory;
  /** Quality tier */
  tier: AchievementTier;
  /** Name of the icon to render */
  icon: string;
  /** Structured unlock criteria evaluated by achievementService */
  criteria: AchievementCriteria;
  /** Eco Coins reward granted on unlock */
  coinReward: number;
}

/**
 * Minimal progress snapshot shape consumed by achievement evaluation.
 * Compatible with GuestProgress while remaining loosely coupled.
 */
export interface AchievementProgressSnapshot {
  totalXp?: number;
  coins?: number;
  completedScenarios?: string[];
  completedModules?: string[];
  scenarioRecords?: Record<string, ScenarioRecord | { earnedXp: number }>;
  achievements?: string[];
}
