import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

import { DecisionOutcome, ScenarioCompletionSummary } from '../types/game';
import { GuestProgress, INITIAL_GUEST_PROGRESS, ScenarioRecord } from '../types/progress';
import { progressStorageService } from '../services/progressStorage';
import { cloudProgressService } from '../services/cloudProgressService';
import { getModuleById } from '../data/gameData';
import { useAuth } from './AuthContext';

interface GuestProgressContextValue {
  progress: GuestProgress;
  isLoading: boolean;
  isSyncing: boolean;
  refreshProgress: () => Promise<void>;
  resetProgress: () => Promise<void>;
  updateProgress: (partial: Partial<GuestProgress>) => Promise<void>;
  completeScenario: (
    summary: ScenarioCompletionSummary
  ) => Promise<{ isFirstCompletion: boolean; earnedXp: number; earnedCoins: number }>;
  isScenarioCompleted: (scenarioId: string) => boolean;
  getScenarioRecord: (scenarioId: string) => ScenarioRecord | undefined;
  syncWithCloud: () => Promise<void>;
}

const defaultFallbackProgress: GuestProgress = INITIAL_GUEST_PROGRESS('guest_init');

const GuestProgressContext = createContext<GuestProgressContextValue>({
  progress: defaultFallbackProgress,
  isLoading: true,
  isSyncing: false,
  refreshProgress: async () => {},
  resetProgress: async () => {},
  updateProgress: async () => {},
  completeScenario: async () => ({ isFirstCompletion: false, earnedXp: 0, earnedCoins: 0 }),
  isScenarioCompleted: () => false,
  getScenarioRecord: () => undefined,
  syncWithCloud: async () => {},
});

export const GuestProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<GuestProgress>(defaultFallbackProgress);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const syncedUserIdRef = useRef<string | null>(null);

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

  // Synchronize and migrate guest progress when an authenticated user signs in
  useEffect(() => {
    let isMounted = true;
    if (user?.id && syncedUserIdRef.current !== user.id && !isLoading) {
      syncedUserIdRef.current = user.id;
      setIsSyncing(true);

      cloudProgressService
        .migrateGuestToCloud(user.id, progress)
        .then((res) => {
          if (!isMounted) return;
          if (res.success && res.progress) {
            setProgress(res.progress);
            progressStorageService.saveGuestProgress(res.progress).catch(() => {});
          }
        })
        .catch((err) => {
          console.warn('[GuestProgressContext] Background cloud sync error:', err);
        })
        .finally(() => {
          if (isMounted) {
            setIsSyncing(false);
          }
        });
    } else if (!user?.id) {
      syncedUserIdRef.current = null;
    }

    return () => {
      isMounted = false;
    };
  }, [user?.id, isLoading, progress]);

  const syncWithCloud = useCallback(async () => {
    if (!user?.id) return;
    try {
      setIsSyncing(true);
      const res = await cloudProgressService.migrateGuestToCloud(user.id, progress);
      if (res.success && res.progress) {
        setProgress(res.progress);
        await progressStorageService.saveGuestProgress(res.progress);
      }
    } catch (err) {
      console.warn('[GuestProgressContext] Manual sync error:', err);
    } finally {
      setIsSyncing(false);
    }
  }, [user?.id, progress]);

  const handleResetProgress = useCallback(async () => {
    try {
      setIsLoading(true);
      const reset = await progressStorageService.resetGuestProgress();
      setProgress(reset);

      if (user?.id) {
        await cloudProgressService.saveCloudProgress(user.id, reset);
      }
    } catch (error) {
      console.error('[GuestProgressContext] Error resetting progress:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

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

        if (user?.id) {
          cloudProgressService.saveCloudProgress(user.id, next).catch(() => {});
        }
      } catch (error) {
        console.error('[GuestProgressContext] Error updating progress:', error);
        throw error;
      }
    },
    [progress, user?.id]
  );

  const isScenarioCompleted = useCallback(
    (scenarioId: string): boolean => {
      return progress.completedScenarios.includes(scenarioId);
    },
    [progress.completedScenarios]
  );

  const getScenarioRecord = useCallback(
    (scenarioId: string): ScenarioRecord | undefined => {
      return progress.scenarioRecords[scenarioId];
    },
    [progress.scenarioRecords]
  );

  const handleCompleteScenario = useCallback(
    async (
      summary: ScenarioCompletionSummary
    ): Promise<{ isFirstCompletion: boolean; earnedXp: number; earnedCoins: number }> => {
      const isAlreadyCompleted = progress.completedScenarios.includes(summary.scenarioId);

      // Duplicate reward prevention:
      // If scenario was previously completed, do not increment totalXp or coins.
      if (isAlreadyCompleted) {
        return {
          isFirstCompletion: false,
          earnedXp: 0,
          earnedCoins: 0,
        };
      }

      const answers: Record<string, string> = {};
      const outcomes: Record<string, DecisionOutcome> = {};
      for (const q of summary.questionsAnswered) {
        answers[q.questionId] = q.selectedChoiceId;
        outcomes[q.questionId] = q.outcome;
      }

      const newRecord: ScenarioRecord = {
        scenarioId: summary.scenarioId,
        moduleId: summary.moduleId,
        earnedXp: summary.totalXpEarned,
        earnedCoins: summary.totalCoinsEarned,
        completedAt: summary.completedAt,
        answers,
        outcomes,
      };

      const updatedCompletedScenarios = Array.from(
        new Set([...progress.completedScenarios, summary.scenarioId])
      );
      const updatedRecords = {
        ...progress.scenarioRecords,
        [summary.scenarioId]: newRecord,
      };

      // Check if all scenarios for this module are completed
      const moduleData = getModuleById(summary.moduleId);
      let updatedCompletedModules = [...progress.completedModules];
      if (moduleData) {
        const allModuleScenarioIds = moduleData.scenarios.map((s) => s.id);
        const allComplete = allModuleScenarioIds.every((id) =>
          updatedCompletedScenarios.includes(id)
        );
        if (allComplete && !updatedCompletedModules.includes(summary.moduleId)) {
          updatedCompletedModules.push(summary.moduleId);
        }
      }

      const nextProgress: GuestProgress = {
        ...progress,
        totalXp: progress.totalXp + summary.totalXpEarned,
        coins: progress.coins + summary.totalCoinsEarned,
        completedScenarios: updatedCompletedScenarios,
        completedModules: updatedCompletedModules,
        scenarioRecords: updatedRecords,
        updatedAt: new Date().toISOString(),
      };

      await progressStorageService.saveGuestProgress(nextProgress);
      setProgress(nextProgress);

      // Async cloud sync if authenticated
      if (user?.id) {
        cloudProgressService.saveCloudProgress(user.id, nextProgress).catch((err) => {
          console.warn('[GuestProgressContext] Background cloud save error:', err);
        });
      }

      return {
        isFirstCompletion: true,
        earnedXp: summary.totalXpEarned,
        earnedCoins: summary.totalCoinsEarned,
      };
    },
    [progress, user?.id]
  );

  return (
    <GuestProgressContext.Provider
      value={{
        progress,
        isLoading,
        isSyncing,
        refreshProgress: loadProgress,
        resetProgress: handleResetProgress,
        updateProgress: handleUpdateProgress,
        completeScenario: handleCompleteScenario,
        isScenarioCompleted,
        getScenarioRecord,
        syncWithCloud,
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
