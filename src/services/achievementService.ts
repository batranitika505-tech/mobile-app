/**
 * Achievement Evaluation Service
 * Milestone 4.1: JalRakshak Achievements & Certificates
 *
 * Pure, stateless evaluation engine for achievements.
 * Fully decoupled from React, AsyncStorage, and Supabase.
 */

import {
  Achievement,
  AchievementCategory,
  AchievementProgressSnapshot,
} from '../types/achievement';
import { ACHIEVEMENTS_CATALOG } from '../data/achievements';

export interface AchievementProgressDetail {
  current: number;
  target: number;
  percentage: number;
  isUnlocked: boolean;
}

/**
 * Checks whether an achievement's criteria are satisfied by a progress snapshot.
 * Pure predicate function with zero side effects.
 */
export function checkAchievementCriteria(
  achievement: Achievement,
  snapshot?: AchievementProgressSnapshot | null
): boolean {
  if (!snapshot) return false;

  const { criteria } = achievement;

  switch (criteria.type) {
    case 'scenarios_completed': {
      const required = criteria.requiredScenariosCount ?? 1;
      const count = Array.isArray(snapshot.completedScenarios)
        ? snapshot.completedScenarios.length
        : 0;
      return count >= required;
    }

    case 'module_completed': {
      if (!criteria.requiredModuleId) return false;
      const modules = Array.isArray(snapshot.completedModules)
        ? snapshot.completedModules
        : [];
      return modules.includes(criteria.requiredModuleId);
    }

    case 'all_modules_completed': {
      const requiredScenarios = criteria.requiredScenariosCount ?? 16;
      const modulesCount = Array.isArray(snapshot.completedModules)
        ? snapshot.completedModules.length
        : 0;
      const scenariosCount = Array.isArray(snapshot.completedScenarios)
        ? snapshot.completedScenarios.length
        : 0;
      return modulesCount >= 4 || scenariosCount >= requiredScenarios;
    }

    case 'min_total_xp': {
      const requiredXp = criteria.requiredTotalXp ?? 0;
      const currentXp = typeof snapshot.totalXp === 'number' ? snapshot.totalXp : 0;
      return currentXp >= requiredXp;
    }

    case 'single_scenario_perfect_score': {
      const requiredScore = criteria.requiredScenarioScore ?? 350;
      if (!snapshot.scenarioRecords || typeof snapshot.scenarioRecords !== 'object') {
        return false;
      }
      return Object.values(snapshot.scenarioRecords).some(
        (rec) => rec && typeof rec.earnedXp === 'number' && rec.earnedXp >= requiredScore
      );
    }

    case 'mastery_legend': {
      const requiredXp = criteria.requiredTotalXp ?? 5000;
      const requiredScenarios = criteria.requiredScenariosCount ?? 16;
      const currentXp = typeof snapshot.totalXp === 'number' ? snapshot.totalXp : 0;
      const scenariosCount = Array.isArray(snapshot.completedScenarios)
        ? snapshot.completedScenarios.length
        : 0;
      return currentXp >= requiredXp && scenariosCount >= requiredScenarios;
    }

    default:
      return false;
  }
}

export const achievementService = {
  /**
   * Returns the entire canonical achievement catalog.
   */
  getAllAchievements(): Achievement[] {
    return ACHIEVEMENTS_CATALOG;
  },

  /**
   * Looks up an achievement by ID.
   */
  getAchievementById(id: string): Achievement | undefined {
    return ACHIEVEMENTS_CATALOG.find((a) => a.id === id);
  },

  /**
   * Filters achievements by functional category.
   */
  getAchievementsByCategory(category: AchievementCategory): Achievement[] {
    return ACHIEVEMENTS_CATALOG.filter((a) => a.category === category);
  },

  /**
   * Evaluates player progress against all catalog criteria.
   *
   * @param progressSnapshot Current progress data snapshot
   * @param existingUnlockedIds Array of previously unlocked achievement IDs
   * @returns Array of NEWLY unlocked achievements (empty if none)
   */
  evaluateAchievements(
    progressSnapshot?: AchievementProgressSnapshot | null,
    existingUnlockedIds?: string[]
  ): Achievement[] {
    if (!progressSnapshot) {
      return [];
    }

    // Determine currently unlocked IDs without mutating inputs
    const previouslyUnlocked = new Set<string>(
      existingUnlockedIds ?? progressSnapshot.achievements ?? []
    );

    const newlyUnlocked: Achievement[] = [];

    for (const achievement of ACHIEVEMENTS_CATALOG) {
      // Guard against duplicate unlocking
      if (previouslyUnlocked.has(achievement.id)) {
        continue;
      }

      // Check criteria
      if (checkAchievementCriteria(achievement, progressSnapshot)) {
        newlyUnlocked.push(achievement);
      }
    }

    return newlyUnlocked;
  },

  /**
   * Calculates numerical and percentage completion for a given achievement.
   */
  calculateAchievementProgress(
    achievement: Achievement,
    snapshot?: AchievementProgressSnapshot | null,
    unlockedIds?: string[]
  ): AchievementProgressDetail {
    const unlockedSet = new Set<string>(
      unlockedIds ?? snapshot?.achievements ?? []
    );
    const isUnlocked = unlockedSet.has(achievement.id);

    if (isUnlocked) {
      return {
        current: 100,
        target: 100,
        percentage: 100,
        isUnlocked: true,
      };
    }

    if (!snapshot) {
      return {
        current: 0,
        target: 1,
        percentage: 0,
        isUnlocked: false,
      };
    }

    const { criteria } = achievement;

    switch (criteria.type) {
      case 'scenarios_completed': {
        const target = criteria.requiredScenariosCount ?? 1;
        const current = Math.min(
          target,
          Array.isArray(snapshot.completedScenarios)
            ? snapshot.completedScenarios.length
            : 0
        );
        return {
          current,
          target,
          percentage: Math.min(100, Math.round((current / target) * 100)),
          isUnlocked: current >= target,
        };
      }

      case 'module_completed': {
        const modules = Array.isArray(snapshot.completedModules)
          ? snapshot.completedModules
          : [];
        const isModDone = Boolean(
          criteria.requiredModuleId && modules.includes(criteria.requiredModuleId)
        );
        return {
          current: isModDone ? 1 : 0,
          target: 1,
          percentage: isModDone ? 100 : 0,
          isUnlocked: isModDone,
        };
      }

      case 'all_modules_completed': {
        const target = criteria.requiredScenariosCount ?? 16;
        const scenariosCount = Array.isArray(snapshot.completedScenarios)
          ? snapshot.completedScenarios.length
          : 0;
        const current = Math.min(target, scenariosCount);
        return {
          current,
          target,
          percentage: Math.min(100, Math.round((current / target) * 100)),
          isUnlocked: current >= target,
        };
      }

      case 'min_total_xp': {
        const target = criteria.requiredTotalXp ?? 3500;
        const xp = typeof snapshot.totalXp === 'number' ? snapshot.totalXp : 0;
        const current = Math.min(target, xp);
        return {
          current,
          target,
          percentage: Math.min(100, Math.round((current / target) * 100)),
          isUnlocked: current >= target,
        };
      }

      case 'single_scenario_perfect_score': {
        const target = criteria.requiredScenarioScore ?? 350;
        let maxFound = 0;
        if (snapshot.scenarioRecords && typeof snapshot.scenarioRecords === 'object') {
          for (const rec of Object.values(snapshot.scenarioRecords)) {
            if (rec && typeof rec.earnedXp === 'number' && rec.earnedXp > maxFound) {
              maxFound = rec.earnedXp;
            }
          }
        }
        const current = Math.min(target, maxFound);
        return {
          current,
          target,
          percentage: Math.min(100, Math.round((current / target) * 100)),
          isUnlocked: current >= target,
        };
      }

      case 'mastery_legend': {
        const targetXp = criteria.requiredTotalXp ?? 5000;
        const targetScenarios = criteria.requiredScenariosCount ?? 16;
        const xp = typeof snapshot.totalXp === 'number' ? snapshot.totalXp : 0;
        const scenariosCount = Array.isArray(snapshot.completedScenarios)
          ? snapshot.completedScenarios.length
          : 0;

        const xpFraction = Math.min(1, xp / targetXp);
        const scenariosFraction = Math.min(1, scenariosCount / targetScenarios);
        const avgPercentage = Math.min(
          100,
          Math.round(((xpFraction + scenariosFraction) / 2) * 100)
        );

        return {
          current: scenariosCount,
          target: targetScenarios,
          percentage: avgPercentage,
          isUnlocked: xp >= targetXp && scenariosCount >= targetScenarios,
        };
      }

      default:
        return {
          current: 0,
          target: 1,
          percentage: 0,
          isUnlocked: false,
        };
    }
  },
};
