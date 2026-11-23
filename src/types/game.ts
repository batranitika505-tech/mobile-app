/**
 * Game Content & Scenario Engine Type Definitions
 * Milestone 2B: JalRakshak
 */

export type DecisionOutcome = 'sustainable' | 'partially_sustainable' | 'unsustainable';

export interface DecisionChoice {
  id: string;
  text: string;
  outcome: DecisionOutcome;
  explanation: string;
}

export interface DecisionQuestion {
  id: string;
  question: string;
  situationContext?: string;
  choices: DecisionChoice[];
}

export interface Scenario {
  id: string;
  moduleId: string;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  situation: string;
  learningObjectives: string[];
  questions: DecisionQuestion[];
  bonusXp: number;
  bonusCoins: number;
}

export interface GameModule {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  topics: string[];
  iconName: 'Flame' | 'Droplets' | 'ShieldAlert' | 'Sprout';
  variant: 'warning' | 'turquoise' | 'danger' | 'success';
  scenarios: Scenario[];
}

export interface QuestionSubmission {
  questionId: string;
  selectedChoiceId: string;
  outcome: DecisionOutcome;
  xpEarned: number;
  coinsEarned: number;
  explanation: string;
}

export interface ScenarioCompletionSummary {
  scenarioId: string;
  moduleId: string;
  isFirstCompletion: boolean;
  totalXpEarned: number;
  totalCoinsEarned: number;
  bonusXp: number;
  bonusCoins: number;
  questionsAnswered: QuestionSubmission[];
  completedAt: string;
}
