import { DecisionOutcome } from './game';
import { ScenarioRecord } from './progress';

export interface DatabaseProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface DatabaseGameProgress {
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
}

export interface Database {
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
      };
    };
  };
}

