import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Session, User } from '@supabase/supabase-js';

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { DatabaseProfile } from '../types/database';

export interface AuthContextValue {
  user: User | null;
  session: Session | null;
  profile: DatabaseProfile | null;
  isLoading: boolean;
  isConfigured: boolean;
  signUp: (
    email: string,
    pass: string,
    fullName: string
  ) => Promise<{ error?: string; requiresEmailConfirmation?: boolean }>;
  signIn: (email: string, pass: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const defaultAuthContext: AuthContextValue = {
  user: null,
  session: null,
  profile: null,
  isLoading: false,
  isConfigured: false,
  signUp: async () => ({ error: 'Auth not configured' }),
  signIn: async () => ({ error: 'Auth not configured' }),
  signOut: async () => {},
  refreshProfile: async () => {},
};

const AuthContext = createContext<AuthContextValue>(defaultAuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<DatabaseProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchProfile = useCallback(async (userId: string) => {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (!error && data) {
        setProfile(data as unknown as DatabaseProfile);
      }
    } catch (err) {
      console.warn('[AuthContext] Failed to load user profile:', err);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user?.id) {
      await fetchProfile(user.id);
    }
  }, [fetchProfile, user?.id]);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    // Load active session from persistent storage
    supabase.auth
      .getSession()
      .then(({ data: { session: initialSession }, error }) => {
        if (!isMounted) return;
        if (error) {
          console.warn('[AuthContext] Error getting initial session:', error.message);
        }
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        if (initialSession?.user) {
          fetchProfile(initialSession.user.id);
        }
      })
      .catch((err) => {
        console.warn('[AuthContext] Unexpected session error:', err);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    // Listen for state changes (SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (!isMounted) return;
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          await fetchProfile(currentSession.user.id);
        } else {
          setProfile(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      isMounted = false;
      authListener?.subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signUp = useCallback(
    async (
      email: string,
      pass: string,
      fullName: string
    ): Promise<{ error?: string; requiresEmailConfirmation?: boolean }> => {
      if (!isSupabaseConfigured || !supabase) {
        return {
          error:
            'Supabase authentication is not configured in this environment.',
        };
      }

      try {
        const cleanEmail = email.trim().toLowerCase();
        const cleanName = fullName.trim();

        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password: pass,
          options: {
            data: {
              full_name: cleanName,
            },
          },
        });

        if (error) {
          return { error: error.message };
        }

        // When email confirmation is enabled on Supabase project,
        // data.user exists but data.session is null.
        if (data.user && !data.session) {
          return { requiresEmailConfirmation: true };
        }

        // User is directly signed in
        if (data.user) {
          setUser(data.user);
          setSession(data.session);
          await fetchProfile(data.user.id);
        }

        return {};
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Registration failed';
        return { error: msg };
      }
    },
    [fetchProfile]
  );

  const signIn = useCallback(
    async (email: string, pass: string): Promise<{ error?: string }> => {
      if (!isSupabaseConfigured || !supabase) {
        return {
          error:
            'Supabase authentication is not configured in this environment.',
        };
      }

      try {
        const cleanEmail = email.trim().toLowerCase();
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: pass,
        });

        if (error) {
          return { error: error.message };
        }

        setUser(data.user);
        setSession(data.session);
        if (data.user) {
          await fetchProfile(data.user.id);
        }

        return {};
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Sign in failed';
        return { error: msg };
      }
    },
    [fetchProfile]
  );

  const signOut = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      setUser(null);
      setSession(null);
      setProfile(null);
      return;
    }

    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('[AuthContext] Sign out error:', err);
    } finally {
      setUser(null);
      setSession(null);
      setProfile(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isLoading,
        isConfigured: isSupabaseConfigured,
        signUp,
        signIn,
        signOut,
        refreshProfile,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

