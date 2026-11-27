import { DecisionOutcome } from './game';
import { ScenarioRecord } from './progress';

export type DatabaseProfile = {
  id: string;
  email: string | null;
  full_name: string | null;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type DatabaseGameProgress = {
  id: string;
  user_id: string;
  total_xp: number;
  coins: number;
  completed_scenarios: string[];
  completed_modules: string[];
  scenario_records: Record<string, ScenarioRecord>;
  achievements: string[];
  last_synced_at: string;
  created_at: string;
  updated_at: string;
};

export type DatabaseLeaderboardStanding = {
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  verified_xp: number;
  verified_coins: number;
  completed_scenarios_count: number;
  last_earned_at: string;
  updated_at: string;
};

export type DatabaseVerifiedScore = {
  id: string;
  user_id: string;
  scenario_id: string;
  module_id: string;
  earned_xp: number;
  earned_coins: number;
  submitted_answers: Record<string, string>;
  completed_at: string;
};

export type LeaderboardTier = 'Jal Nayak' | 'Jal Rakshak' | 'Jal Mitra' | 'Water Cadet';

export type LeaderboardEntryRow = {
  rank: number;
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  verified_xp: number;
  completed_scenarios_count: number;
  tier: LeaderboardTier | string;
};

export type MyLeaderboardRankResult = LeaderboardEntryRow | null;

export type VerifiedScenarioResult = {
  status: 'success' | 'already_completed';
  is_first_completion: boolean;
  scenario_id: string;
  earned_xp: number;
  earned_coins: number;
  total_verified_xp: number;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: DatabaseProfile;
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      game_progress: {
        Row: DatabaseGameProgress;
        Insert: {
          id?: string;
          user_id: string;
          total_xp?: number;
          coins?: number;
          completed_scenarios?: string[];
          completed_modules?: string[];
          scenario_records?: Record<string, ScenarioRecord>;
          achievements?: string[];
          last_synced_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          total_xp?: number;
          coins?: number;
          completed_scenarios?: string[];
          completed_modules?: string[];
          scenario_records?: Record<string, ScenarioRecord>;
          achievements?: string[];
          last_synced_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      leaderboard_standings: {
        Row: DatabaseLeaderboardStanding;
        Insert: Record<string, never>;
        Update: Record<string, never>;
        Relationships: [];
      };
      verified_scores: {
        Row: DatabaseVerifiedScore;
        Insert: Record<string, never>;
        Update: Record<string, never>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      get_leaderboard: {
        Args: {
          p_limit?: number;
          p_offset?: number;
        };
        Returns: LeaderboardEntryRow[];
      };
      get_my_leaderboard_rank: {
        Args: Record<string, never>;
        Returns: MyLeaderboardRankResult;
      };
      submit_verified_scenario: {
        Args: {
          p_scenario_id: string;
          p_answers: Record<string, string>;
        };
        Returns: VerifiedScenarioResult;
      };
    };
  };
};

