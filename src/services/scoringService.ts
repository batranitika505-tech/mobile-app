/**
 * Centralized Scoring & Evaluation Service
 * Milestone 2B: JalRakshak
 */

import { SCORING_RULES } from '../constants/scoring';
import { DecisionChoice, DecisionOutcome, QuestionSubmission, Scenario, ScenarioCompletionSummary } from '../types/game';

export const scoringService = {
  /**
   * Evaluates an individual question choice.
   */
  evaluateChoice(choice: DecisionChoice): {
    outcome: DecisionOutcome;
    xp: number;
    coins: number;
    explanation: string;
  } {
    switch (choice.outcome) {
      case 'sustainable':
        return {
          outcome: 'sustainable',
          xp: SCORING_RULES.SUSTAINABLE.xp,
          coins: SCORING_RULES.SUSTAINABLE.coins,
          explanation: choice.explanation,
        };
      case 'partially_sustainable':
        return {
          outcome: 'partially_sustainable',
          xp: SCORING_RULES.PARTIALLY_SUSTAINABLE.xp,
          coins: SCORING_RULES.PARTIALLY_SUSTAINABLE.coins,
          explanation: choice.explanation,
        };
      case 'unsustainable':
      default:
        return {
          outcome: 'unsustainable',
          xp: SCORING_RULES.UNSUSTAINABLE.xp,
          coins: SCORING_RULES.UNSUSTAINABLE.coins,
          explanation: choice.explanation,
        };
    }
  },

  /**
   * Evaluates the complete set of answers for a scenario.
   * Handles duplicate reward prevention:
   * If isAlreadyCompleted is true, reward XP and coins are 0.
   */
  evaluateScenario(
    scenario: Scenario,
    selectedAnswers: Record<string, string>,
    isAlreadyCompleted: boolean
  ): ScenarioCompletionSummary {
    const questionsAnswered: QuestionSubmission[] = [];
    let calculatedDecisionsXp = 0;
    let calculatedDecisionsCoins = 0;

    for (const question of scenario.questions) {
      const selectedChoiceId = selectedAnswers[question.id];
      const choice = question.choices.find((c) => c.id === selectedChoiceId);

      if (choice) {
        const result = this.evaluateChoice(choice);
        calculatedDecisionsXp += result.xp;
        calculatedDecisionsCoins += result.coins;
        questionsAnswered.push({
          questionId: question.id,
          selectedChoiceId: choice.id,
          outcome: result.outcome,
          xpEarned: isAlreadyCompleted ? 0 : result.xp,
          coinsEarned: isAlreadyCompleted ? 0 : result.coins,
          explanation: result.explanation,
        });
      }
    }

    const bonusXp = isAlreadyCompleted ? 0 : SCORING_RULES.SCENARIO_COMPLETION_BONUS.xp;
    const bonusCoins = isAlreadyCompleted ? 0 : SCORING_RULES.SCENARIO_COMPLETION_BONUS.coins;

    const totalXpEarned = isAlreadyCompleted ? 0 : calculatedDecisionsXp + bonusXp;
    const totalCoinsEarned = isAlreadyCompleted ? 0 : calculatedDecisionsCoins + bonusCoins;

    return {
      scenarioId: scenario.id,
      moduleId: scenario.moduleId,
      isFirstCompletion: !isAlreadyCompleted,
      totalXpEarned,
      totalCoinsEarned,
      bonusXp,
      bonusCoins,
      questionsAnswered,
      completedAt: new Date().toISOString(),
    };
  },
};
