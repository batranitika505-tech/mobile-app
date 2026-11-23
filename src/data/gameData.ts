/**
 * Central Game Data Aggregator
 * Milestone 2B: JalRakshak
 */

import { GameModule, Scenario } from '../types/game';
import { droughtModule } from './modules/drought';
import { rainfallModule } from './modules/rainfall';
import { contaminationModule } from './modules/contamination';
import { agricultureModule } from './modules/agriculture';

export const ALL_GAME_MODULES: GameModule[] = [
  droughtModule,
  rainfallModule,
  contaminationModule,
  agricultureModule,
];

export const TOTAL_SCENARIOS_COUNT = ALL_GAME_MODULES.reduce(
  (total, mod) => total + mod.scenarios.length,
  0
);

export function getAllModules(): GameModule[] {
  return ALL_GAME_MODULES;
}

export function getModuleById(moduleId: string): GameModule | undefined {
  return ALL_GAME_MODULES.find((m) => m.id === moduleId);
}

export function getScenarioById(scenarioId: string): { scenario: Scenario; module: GameModule } | undefined {
  for (const module of ALL_GAME_MODULES) {
    const scenario = module.scenarios.find((s) => s.id === scenarioId);
    if (scenario) {
      return { scenario, module };
    }
  }
  return undefined;
}

export function getNextScenario(currentScenarioId: string): Scenario | null {
  const current = getScenarioById(currentScenarioId);
  if (!current) return null;

  const currentModule = current.module;
  const currentIndex = currentModule.scenarios.findIndex((s) => s.id === currentScenarioId);

  // If there's another scenario in the same module
  if (currentIndex >= 0 && currentIndex < currentModule.scenarios.length - 1) {
    return currentModule.scenarios[currentIndex + 1];
  }

  // Check next module
  const moduleIndex = ALL_GAME_MODULES.findIndex((m) => m.id === currentModule.id);
  if (moduleIndex >= 0 && moduleIndex < ALL_GAME_MODULES.length - 1) {
    const nextModule = ALL_GAME_MODULES[moduleIndex + 1];
    if (nextModule.scenarios.length > 0) {
      return nextModule.scenarios[0];
    }
  }

  return null;
}
