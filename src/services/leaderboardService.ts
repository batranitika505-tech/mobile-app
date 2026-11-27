/**
 * Leaderboard & Competitive Score Submission Service
 * Milestone 3.4: JalRakshak Online Leaderboard Integration
 *
 * Interacts strictly with the verified Supabase RPC functions:
 * - get_leaderboard
 * - get_my_leaderboard_rank
 * - submit_verified_scenario
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  LeaderboardEntryRow,
  MyLeaderboardRankResult,
  VerifiedScenarioResult,
} from '../types/database';

export interface LeaderboardResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const leaderboardService = {
  /**
   * Fetches the global verified competitive leaderboard standings.
   * Executable by both authenticated and anonymous roles.
   *
   * @param limit Maximum number of records to return (1-100, default: 50)
   * @param offset Number of records to skip for pagination (default: 0)
   */
  async fetchLeaderboard(
    limit: number = 50,
    offset: number = 0
  ): Promise<LeaderboardResult<LeaderboardEntryRow[]>> {
    if (!isSupabaseConfigured || !supabase) {
      return {
        success: false,
        error: 'Supabase client is not configured. Running in offline/guest mode.',
      };
    }

    try {
      const { data, error } = await supabase.rpc('get_leaderboard', {
        p_limit: limit,
        p_offset: offset,
      });

      if (error) {
        console.warn('[leaderboardService] Error fetching leaderboard:', error.message);
        return {
          success: false,
          error: error.message || 'Failed to fetch leaderboard standings',
        };
      }

      return {
        success: true,
        data: Array.isArray(data) ? (data as unknown as LeaderboardEntryRow[]) : [],
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unexpected network error';
      console.warn('[leaderboardService] Unexpected fetchLeaderboard exception:', message);
      return {
        success: false,
        error: message,
      };
    }
  },

  /**
   * Fetches the authenticated player's personal rank and verified score.
   * Requires an authenticated session; returns null data if the user has
   * not earned competitive XP yet or is unauthenticated.
   */
  async fetchMyLeaderboardRank(): Promise<LeaderboardResult<MyLeaderboardRankResult>> {
    if (!isSupabaseConfigured || !supabase) {
      return {
        success: false,
        error: 'Supabase client is not configured.',
      };
    }

    try {
      const { data, error } = await supabase.rpc('get_my_leaderboard_rank');

      if (error) {
        console.warn('[leaderboardService] Error fetching personal rank:', error.message);
        return {
          success: false,
          error: error.message || 'Failed to fetch personal leaderboard rank',
        };
      }

      return {
        success: true,
        data: (data as unknown as MyLeaderboardRankResult) ?? null,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unexpected network error';
      console.warn('[leaderboardService] Unexpected fetchMyRank exception:', message);
      return {
        success: false,
        error: message,
      };
    }
  },

  /**
   * Submits scenario answers for authoritative server-side evaluation and
   * competitive XP calculation.
   *
   * @param scenarioId The canonical scenario ID (e.g. 'drought_1')
   * @param answers Key-value mapping of question IDs to choice IDs (e.g. { "d1_q1": "d1_q1_c1", ... })
   */
  async submitVerifiedScenario(
    scenarioId: string,
    answers: Record<string, string>
  ): Promise<LeaderboardResult<VerifiedScenarioResult>> {
    if (!isSupabaseConfigured || !supabase) {
      return {
        success: false,
        error: 'Supabase client is not configured. Competitive scoring unavailable.',
      };
    }

    try {
      const { data, error } = await supabase.rpc('submit_verified_scenario', {
        p_scenario_id: scenarioId,
        p_answers: answers,
      });

      if (error) {
        console.warn('[leaderboardService] Score verification RPC error:', error.message);
        return {
          success: false,
          error: error.message || 'Failed to submit scenario for verification',
        };
      }

      const result = data as unknown as VerifiedScenarioResult;

      return {
        success: true,
        data: result,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unexpected network error';
      console.warn('[leaderboardService] Unexpected submitVerifiedScenario exception:', message);
      return {
        success: false,
        error: message,
      };
    }
  },
};
