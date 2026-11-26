import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { GuestProgress, ScenarioRecord } from '../types/progress';
import { DatabaseGameProgress } from '../types/database';

export interface CloudSyncResult {
  success: boolean;
  progress?: GuestProgress;
  error?: string;
}

/**
 * Converts a database game_progress row into the application's GuestProgress model.
 */
export function mapDatabaseToGuestProgress(
  row: DatabaseGameProgress,
  userId: string
): GuestProgress {
  return {
    guestId: `cloud_${userId.slice(0, 8)}`,
    totalXp: Number(row.total_xp) || 0,
    coins: Number(row.coins) || 0,
    completedScenarios: Array.isArray(row.completed_scenarios)
      ? Array.from(new Set(row.completed_scenarios))
      : [],
    completedModules: Array.isArray(row.completed_modules)
      ? Array.from(new Set(row.completed_modules))
      : [],
    scenarioRecords: (row.scenario_records as Record<string, ScenarioRecord>) || {},
    achievements: Array.isArray(row.achievements)
      ? Array.from(new Set(row.achievements))
      : [],
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString(),
  };
}

/**
 * Merges local guest progress with existing cloud progress safely and idempotently.
 * Prevents loss of progress and prevents duplicate XP inflation.
 */
export function mergeProgressStates(
  local: GuestProgress,
  cloud: GuestProgress
): GuestProgress {
  const mergedCompletedScenarios = Array.from(
    new Set([...local.completedScenarios, ...cloud.completedScenarios])
  );
  const mergedCompletedModules = Array.from(
    new Set([...local.completedModules, ...cloud.completedModules])
  );
  const mergedAchievements = Array.from(
    new Set([...local.achievements, ...cloud.achievements])
  );

  const mergedRecords: Record<string, ScenarioRecord> = {
    ...cloud.scenarioRecords,
  };

  // Merge local records if not present in cloud
  for (const [scenarioId, rec] of Object.entries(local.scenarioRecords)) {
    if (!mergedRecords[scenarioId]) {
      mergedRecords[scenarioId] = rec;
    }
  }

  // Calculate verified total XP from the distinct scenario records to prevent inflation
  let verifiedXp = 0;
  let verifiedCoins = 0;
  for (const rec of Object.values(mergedRecords)) {
    verifiedXp += rec.earnedXp;
    verifiedCoins += rec.earnedCoins;
  }

  // Ensure totalXp and coins are at least the max of existing sums
  const finalXp = Math.max(verifiedXp, local.totalXp, cloud.totalXp);
  const finalCoins = Math.max(verifiedCoins, local.coins, cloud.coins);

  const now = new Date().toISOString();

  return {
    guestId: cloud.guestId,
    totalXp: finalXp,
    coins: finalCoins,
    completedScenarios: mergedCompletedScenarios,
    completedModules: mergedCompletedModules,
    scenarioRecords: mergedRecords,
    achievements: mergedAchievements,
    createdAt: cloud.createdAt || local.createdAt || now,
    updatedAt: now,
  };
}

export const cloudProgressService = {
  /**
   * Fetches saved progress for an authenticated user from Supabase.
   */
  async fetchCloudProgress(userId: string): Promise<GuestProgress | null> {
    if (!isSupabaseConfigured || !supabase) {
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('game_progress')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.warn('[CloudProgressService] Error fetching cloud progress:', error.message);
        return null;
      }

      if (!data) {
        return null;
      }

      return mapDatabaseToGuestProgress(data as unknown as DatabaseGameProgress, userId);
    } catch (err) {
      console.warn('[CloudProgressService] Unexpected error in fetchCloudProgress:', err);
      return null;
    }
  },

  /**
   * Upserts the user's progress in Supabase.
   */
  async saveCloudProgress(
    userId: string,
    progress: GuestProgress
  ): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: 'Supabase client is not configured' };
    }

    try {
      const now = new Date().toISOString();
      const payload = {
        user_id: userId,
        total_xp: progress.totalXp,
        coins: progress.coins,
        completed_scenarios: progress.completedScenarios,
        completed_modules: progress.completedModules,
        scenario_records: progress.scenarioRecords,
        achievements: progress.achievements,
        last_synced_at: now,
        updated_at: now,
      };

      const { error } = await (supabase.from('game_progress') as any)
        .upsert(payload, { onConflict: 'user_id' });

      if (error) {
        console.warn('[CloudProgressService] Error saving cloud progress:', error.message);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unexpected save error';
      console.warn('[CloudProgressService] Unexpected error in saveCloudProgress:', message);
      return { success: false, error: message };
    }
  },

  /**
   * Safely migrates local guest progress to a user account upon registration or sign-in.
   * If the user already had cloud data, merges without losing completed items.
   */
  async migrateGuestToCloud(
    userId: string,
    guestProgress: GuestProgress
  ): Promise<CloudSyncResult> {
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: 'Supabase client is not configured' };
    }

    try {
      // 1. Check existing cloud progress
      const existingCloud = await this.fetchCloudProgress(userId);

      let finalProgress: GuestProgress;

      if (!existingCloud) {
        // No prior cloud progress: upload guest progress directly
        finalProgress = {
          ...guestProgress,
          guestId: `cloud_${userId.slice(0, 8)}`,
          updatedAt: new Date().toISOString(),
        };
      } else {
        // Prior cloud progress exists: merge cleanly
        finalProgress = mergeProgressStates(guestProgress, existingCloud);
      }

      const saveResult = await this.saveCloudProgress(userId, finalProgress);
      if (!saveResult.success) {
        return {
          success: false,
          progress: existingCloud || guestProgress,
          error: saveResult.error || 'Failed to upload progress to cloud',
        };
      }

      return {
        success: true,
        progress: finalProgress,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown migration error';
      console.warn('[CloudProgressService] Migration exception:', message);
      return { success: false, error: message };
    }
  },
};
