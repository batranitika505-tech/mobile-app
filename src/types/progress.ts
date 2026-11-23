/**
 * Progress and Guest Session Data Models
 * Milestone 2B: JalRakshak
 */

import { DecisionOutcome } from './game';

export interface ScenarioRecord {
  scenarioId: string;
  moduleId: string;
  earnedXp: number;
  earnedCoins: number;
  completedAt: string;
  answers: Record<string, string>;
  outcomes: Record<string, DecisionOutcome>;
}

export interface GuestProgress {
  /** Persistent unique identifier for the guest device/session */
  guestId: string;
  /** Total verified XP earned across scenarios */
  totalXp: number;
  /** Accumulated eco coins */
  coins: number;
  /** Unique completed scenario IDs (e.g. 'drought_1') */
  completedScenarios: string[];
  /** Unique completed module IDs (e.g. 'drought', 'rainfall') */
  completedModules: string[];
  /** Detailed record of completed scenarios */
  scenarioRecords: Record<string, ScenarioRecord>;
  /** Unlocked achievement IDs */
  achievements: string[];
  /** ISO timestamp of creation */
  createdAt: string;
  /** ISO timestamp of last update */
  updatedAt: string;
}

export const INITIAL_GUEST_PROGRESS = (guestId: string): GuestProgress => {
  const now = new Date().toISOString();
  return {
    guestId,
    totalXp: 0,
    coins: 0,
    completedScenarios: [],
    completedModules: [],
    scenarioRecords: {},
    achievements: [],
    createdAt: now,
    updatedAt: now,
  };
};
