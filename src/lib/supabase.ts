import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AppState } from 'react-native';

import { Database } from '../types/database';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseKey &&
    supabaseUrl.startsWith('https://') &&
    supabaseKey.length > 10
);

let client: SupabaseClient<Database> | null = null;

if (isSupabaseConfigured && supabaseUrl && supabaseKey) {
  client = createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });

  // Manage automatic token refresh depending on React Native AppState
  AppState.addEventListener('change', (state) => {
    if (!client) return;
    if (state === 'active') {
      client.auth.startAutoRefresh();
    } else {
      client.auth.stopAutoRefresh();
    }
  });
} else {
  console.info(
    '[Supabase] Supabase credentials not fully configured. Running in local-only / guest mode.'
  );
}

export const supabase = client;

