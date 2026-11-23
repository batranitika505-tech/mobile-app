/**
 * Progress and Guest Session Data Models
 * Milestone 2A: Guest Mode and Local Progress Persistence
 */

export interface GuestProgress {
  /** Persistent unique identifier for the guest device/session */
  guestId: string;
  /** Total verified XP earned across scenarios */
  totalXp: number;
  /** Accumulated eco coins */
  coins: number;
  /** Unique completed scenario IDs (e.g. 'drought_1_1') */
  completedScenarios: string[];
  /** Unique completed module IDs (e.g. 'drought', 'rainfall') */
  completedModules: string[];
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
    achievements: [],
    createdAt: now,
    updatedAt: now,
  };
};
