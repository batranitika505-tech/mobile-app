import AsyncStorage from '@react-native-async-storage/async-storage';

import { GuestProgress, INITIAL_GUEST_PROGRESS } from '../types/progress';

export const STORAGE_KEYS = {
  GUEST_ID: '@jalrakshak_guest_id',
  GUEST_PROGRESS: '@jalrakshak_guest_progress',
} as const;

/**
 * Generate a cryptographically distinct, persistent guest ID.
 * Format: guest_<timestamp>_<randomHex>
 */
export function generateGuestId(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 10);
  return `guest_${timestamp}_${randomPart}`;
}

/**
 * Validates and sanitizes unknown parsed data into a strict GuestProgress object.
 * Protects against corrupted or partially written JSON in AsyncStorage.
 */
export function sanitizeProgress(raw: unknown, expectedGuestId: string): GuestProgress {
  const now = new Date().toISOString();

  if (!raw || typeof raw !== 'object') {
    return INITIAL_GUEST_PROGRESS(expectedGuestId);
  }

  const candidate = raw as Record<string, unknown>;

  const guestId =
    typeof candidate.guestId === 'string' && candidate.guestId.trim().length > 0
      ? candidate.guestId
      : expectedGuestId;

  const totalXp =
    typeof candidate.totalXp === 'number' && !Number.isNaN(candidate.totalXp) && candidate.totalXp >= 0
      ? Math.floor(candidate.totalXp)
      : 0;

  const coins =
    typeof candidate.coins === 'number' && !Number.isNaN(candidate.coins) && candidate.coins >= 0
      ? Math.floor(candidate.coins)
      : 0;

  const completedScenarios = Array.isArray(candidate.completedScenarios)
    ? Array.from(new Set(candidate.completedScenarios.filter((id): id is string => typeof id === 'string' && id.trim().length > 0)))
    : [];

  const completedModules = Array.isArray(candidate.completedModules)
    ? Array.from(new Set(candidate.completedModules.filter((id): id is string => typeof id === 'string' && id.trim().length > 0)))
    : [];

  const achievements = Array.isArray(candidate.achievements)
    ? Array.from(new Set(candidate.achievements.filter((id): id is string => typeof id === 'string' && id.trim().length > 0)))
    : [];

  const createdAt =
    typeof candidate.createdAt === 'string' && !Number.isNaN(Date.parse(candidate.createdAt))
      ? candidate.createdAt
      : now;

  const updatedAt =
    typeof candidate.updatedAt === 'string' && !Number.isNaN(Date.parse(candidate.updatedAt))
      ? candidate.updatedAt
      : now;

  return {
    guestId,
    totalXp,
    coins,
    completedScenarios,
    completedModules,
    achievements,
    createdAt,
    updatedAt,
  };
}

export const progressStorageService = {
  /**
   * Retrieves or creates a persistent unique guest ID.
   * Never overwrites an existing guest ID.
   */
  async getOrCreateGuestId(): Promise<string> {
    try {
      const existingId = await AsyncStorage.getItem(STORAGE_KEYS.GUEST_ID);
      if (existingId && existingId.trim().length > 0) {
        return existingId.trim();
      }

      const newId = generateGuestId();
      await AsyncStorage.setItem(STORAGE_KEYS.GUEST_ID, newId);
      return newId;
    } catch (error) {
      console.warn('[ProgressStorage] Failed to access guest ID from AsyncStorage:', error);
      // Fallback in-memory ID if storage fails
      return generateGuestId();
    }
  },

  /**
   * Loads saved guest progress or initializes a default zeroed state.
   */
  async getGuestProgress(): Promise<GuestProgress> {
    const guestId = await this.getOrCreateGuestId();

    try {
      const rawJson = await AsyncStorage.getItem(STORAGE_KEYS.GUEST_PROGRESS);
      if (!rawJson) {
        const initial = INITIAL_GUEST_PROGRESS(guestId);
        await this.saveGuestProgress(initial);
        return initial;
      }

      const parsed = JSON.parse(rawJson);
      const sanitized = sanitizeProgress(parsed, guestId);
      return sanitized;
    } catch (error) {
      console.warn('[ProgressStorage] Error loading guest progress, restoring fallback defaults:', error);
      const fallback = INITIAL_GUEST_PROGRESS(guestId);
      try {
        await this.saveGuestProgress(fallback);
      } catch {
        /* ignore storage write error in fallback */
      }
      return fallback;
    }
  },

  /**
   * Persists progress data to AsyncStorage with timestamp update and deduplication.
   */
  async saveGuestProgress(progress: GuestProgress): Promise<void> {
    try {
      const sanitized = sanitizeProgress(
        {
          ...progress,
          updatedAt: new Date().toISOString(),
        },
        progress.guestId
      );

      await AsyncStorage.setItem(STORAGE_KEYS.GUEST_PROGRESS, JSON.stringify(sanitized));
    } catch (error) {
      console.error('[ProgressStorage] Failed to save guest progress:', error);
      throw error;
    }
  },

  /**
   * Resets gameplay progress (XP, coins, scenarios, modules, achievements) to zero,
   * while strictly preserving the persistent guest ID and creation metadata.
   */
  async resetGuestProgress(): Promise<GuestProgress> {
    const guestId = await this.getOrCreateGuestId();

    let existingCreatedAt = new Date().toISOString();
    try {
      const rawJson = await AsyncStorage.getItem(STORAGE_KEYS.GUEST_PROGRESS);
      if (rawJson) {
        const parsed = JSON.parse(rawJson);
        if (typeof parsed?.createdAt === 'string') {
          existingCreatedAt = parsed.createdAt;
        }
      }
    } catch {
      /* ignore */
    }

    const resetState: GuestProgress = {
      guestId,
      totalXp: 0,
      coins: 0,
      completedScenarios: [],
      completedModules: [],
      achievements: [],
      createdAt: existingCreatedAt,
      updatedAt: new Date().toISOString(),
    };

    try {
      await AsyncStorage.setItem(STORAGE_KEYS.GUEST_PROGRESS, JSON.stringify(resetState));
      return resetState;
    } catch (error) {
      console.error('[ProgressStorage] Failed to write reset progress state:', error);
      throw error;
    }
  },
};
