/**
 * Centralized Scoring Rules
 * Milestone 2B: JalRakshak
 */

import { DecisionOutcome } from '../types/game';

export const SCORING_RULES = {
  SUSTAINABLE: {
    xp: 100,
    coins: 10,
    label: 'Sustainable Action',
  },
  PARTIALLY_SUSTAINABLE: {
    xp: 40,
    coins: 4,
    label: 'Partially Sustainable Action',
  },
  UNSUSTAINABLE: {
    xp: 0,
    coins: 0,
    label: 'Unsustainable Action',
  },
  SCENARIO_COMPLETION_BONUS: {
    xp: 50,
    coins: 5,
    label: 'Scenario Completion Bonus',
  },
} as const;

export function getScoreForOutcome(outcome: DecisionOutcome): { xp: number; coins: number } {
  switch (outcome) {
    case 'sustainable':
      return { xp: SCORING_RULES.SUSTAINABLE.xp, coins: SCORING_RULES.SUSTAINABLE.coins };
    case 'partially_sustainable':
      return { xp: SCORING_RULES.PARTIALLY_SUSTAINABLE.xp, coins: SCORING_RULES.PARTIALLY_SUSTAINABLE.coins };
    case 'unsustainable':
    default:
      return { xp: SCORING_RULES.UNSUSTAINABLE.xp, coins: SCORING_RULES.UNSUSTAINABLE.coins };
  }
}
