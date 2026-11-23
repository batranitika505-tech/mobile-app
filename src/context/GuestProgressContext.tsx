import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { GuestProgress, INITIAL_GUEST_PROGRESS } from '../types/progress';
import { progressStorageService } from '../services/progressStorage';

interface GuestProgressContextValue {
  progress: GuestProgress;
  isLoading: boolean;
  refreshProgress: () => Promise<void>;
  resetProgress: () => Promise<void>;
  updateProgress: (partial: Partial<GuestProgress>) => Promise<void>;
}

const defaultFallbackProgress: GuestProgress = INITIAL_GUEST_PROGRESS('guest_init');

const GuestProgressContext = createContext<GuestProgressContextValue>({
  progress: defaultFallbackProgress,
  isLoading: true,
  refreshProgress: async () => {},
  resetProgress: async () => {},
  updateProgress: async () => {},
});

export const GuestProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<GuestProgress>(defaultFallbackProgress);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadProgress = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await progressStorageService.getGuestProgress();
      setProgress(data);
    } catch (error) {
      console.error('[GuestProgressContext] Failed to load progress:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  const handleResetProgress = useCallback(async () => {
    try {
      setIsLoading(true);
      const reset = await progressStorageService.resetGuestProgress();
      setProgress(reset);
    } catch (error) {
      console.error('[GuestProgressContext] Error resetting progress:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleUpdateProgress = useCallback(
    async (partial: Partial<GuestProgress>) => {
      try {
        const next: GuestProgress = {
          ...progress,
          ...partial,
          updatedAt: new Date().toISOString(),
        };
        await progressStorageService.saveGuestProgress(next);
        setProgress(next);
      } catch (error) {
        console.error('[GuestProgressContext] Error updating progress:', error);
        throw error;
      }
    },
    [progress]
  );

  return (
    <GuestProgressContext.Provider
      value={{
        progress,
        isLoading,
        refreshProgress: loadProgress,
        resetProgress: handleResetProgress,
        updateProgress: handleUpdateProgress,
      }}>
      {children}
    </GuestProgressContext.Provider>
  );
};

export function useGuestProgress(): GuestProgressContextValue {
  const context = useContext(GuestProgressContext);
  if (!context) {
    throw new Error('useGuestProgress must be used within a GuestProgressProvider');
  }
  return context;
}
