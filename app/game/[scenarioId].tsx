import React, { useMemo, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  AlertCircle,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Coins,
  Compass,
  CornerDownRight,
  Droplet,
  Flame,
  HelpCircle,
  Play,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Sprout,
  Target,
  Trophy,
  XCircle,
} from 'lucide-react-native';

import { Colors } from '../../src/constants/colors';
import { BorderRadius, Spacing } from '../../src/constants/layout';
import { Button } from '../../src/components/common/Button';
import { Card } from '../../src/components/common/Card';
import { Badge } from '../../src/components/common/Badge';
import { getNextScenario, getScenarioById } from '../../src/data/gameData';
import { scoringService } from '../../src/services/scoringService';
import { useGuestProgress } from '../../src/context/GuestProgressContext';
import { useAuth } from '../../src/context/AuthContext';
import { leaderboardService } from '../../src/services/leaderboardService';
import { VerifiedScenarioResult } from '../../src/types/database';
import { Achievement } from '../../src/types/achievement';
import { DecisionChoice, DecisionOutcome, QuestionSubmission, ScenarioCompletionSummary } from '../../src/types/game';

function renderAchievementIcon(iconName: string) {
  switch (iconName) {
    case 'Droplet':
      return <Droplet size={22} color={Colors.turquoiseLight} />;
    case 'ShieldAlert':
      return <ShieldAlert size={22} color={Colors.warningOrange} />;
    case 'Sparkles':
      return <Sparkles size={22} color={Colors.goldCoin} />;
    case 'ShieldCheck':
      return <ShieldCheck size={22} color={Colors.sustainableGreenLight} />;
    case 'Sprout':
      return <Sprout size={22} color={Colors.sustainableGreenLight} />;
    case 'Compass':
      return <Compass size={22} color={Colors.cyanSoft} />;
    case 'Award':
      return <Award size={22} color={Colors.goldCoin} />;
    case 'Flame':
      return <Flame size={22} color={Colors.warningOrange} />;
    case 'Target':
      return <Target size={22} color={Colors.dangerRed} />;
    case 'Trophy':
      return <Trophy size={22} color={Colors.goldCoin} />;
    default:
      return <Award size={22} color={Colors.turquoise} />;
  }
}

type ScenarioStep = 'intro' | 'question' | 'summary';

export default function ScenarioPlayerScreen() {
  const router = useRouter();
  const { scenarioId } = useLocalSearchParams<{ scenarioId: string }>();
  const { isScenarioCompleted, getScenarioRecord, completeScenario } = useGuestProgress();
  const { user } = useAuth();

  const scenarioData = useMemo(() => {
    if (!scenarioId) return undefined;
    return getScenarioById(scenarioId);
  }, [scenarioId]);

  const [currentStep, setCurrentStep] = useState<ScenarioStep>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [submittedChoice, setSubmittedChoice] = useState<DecisionChoice | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [questionSubmissions, setQuestionSubmissions] = useState<QuestionSubmission[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [finalSummary, setFinalSummary] = useState<ScenarioCompletionSummary | null>(null);
  const [unlockedAchievements, setUnlockedAchievements] = useState<Achievement[]>([]);
  const [verifiedResult, setVerifiedResult] = useState<VerifiedScenarioResult | null>(null);
  const [verifiedStatus, setVerifiedStatus] = useState<
    'idle' | 'success' | 'already_completed' | 'unauthenticated' | 'failed'
  >('idle');
  const [verifiedError, setVerifiedError] = useState<string | null>(null);

  if (!scenarioData) {
    return (
      <View style={styles.errorContainer}>
        <AlertCircle size={48} color={Colors.warningOrange} />
        <Text style={styles.errorTitle}>Scenario Not Found</Text>
        <Text style={styles.errorSubtitle}>The requested groundwater mission could not be located.</Text>
        <Button
          title="Return to Missions"
          variant="primary"
          size="md"
          onPress={() => router.push('/(tabs)/game')}
          style={styles.errorButton}
        />
      </View>
    );
  }

  const { scenario, module } = scenarioData;
  const isAlreadyCompleted = isScenarioCompleted(scenario.id);
  const previousRecord = getScenarioRecord(scenario.id);
  const currentQuestion = scenario.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === scenario.questions.length - 1;

  // Handle selecting an answer
  const handleSelectChoice = (choiceId: string) => {
    if (submittedChoice) return; // Prevent changing after submission
    setSelectedChoiceId(choiceId);
  };

  // Submit single decision question
  const handleSubmitDecision = () => {
    if (!selectedChoiceId || submittedChoice) return;

    const choice = currentQuestion.choices.find((c) => c.id === selectedChoiceId);
    if (!choice) return;

    const result = scoringService.evaluateChoice(choice);
    const submission: QuestionSubmission = {
      questionId: currentQuestion.id,
      selectedChoiceId: choice.id,
      outcome: result.outcome,
      xpEarned: isAlreadyCompleted ? 0 : result.xp,
      coinsEarned: isAlreadyCompleted ? 0 : result.coins,
      explanation: result.explanation,
    };

    setSubmittedChoice(choice);
    setUserAnswers((prev) => ({ ...prev, [currentQuestion.id]: choice.id }));
    setQuestionSubmissions((prev) => [...prev, submission]);
  };

  // Next question or finish
  const handleNextQuestion = async () => {
    if (!submittedChoice) return;

    if (!isLastQuestion) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedChoiceId(null);
      setSubmittedChoice(null);
    } else {
      // Completed all questions in the scenario!
      setIsSubmitting(true);
      try {
        const fullAnswers = { ...userAnswers, [currentQuestion.id]: submittedChoice.id };
        const summary = scoringService.evaluateScenario(scenario, fullAnswers, isAlreadyCompleted);

        // Persist immediately to AsyncStorage via context (local progress always protected)
        const completionResult = await completeScenario(summary);
        setFinalSummary(summary);
        setUnlockedAchievements(completionResult.newlyUnlockedAchievements || []);

        // Submit to competitive leaderboard RPC if authenticated
        if (user?.id) {
          try {
            const rpcRes = await leaderboardService.submitVerifiedScenario(scenario.id, fullAnswers);
            if (rpcRes.success && rpcRes.data) {
              setVerifiedResult(rpcRes.data);
              setVerifiedStatus(rpcRes.data.status === 'success' ? 'success' : 'already_completed');
            } else {
              setVerifiedStatus('failed');
              setVerifiedError(rpcRes.error || 'Server validation failed');
            }
          } catch (rpcErr) {
            setVerifiedStatus('failed');
            setVerifiedError(rpcErr instanceof Error ? rpcErr.message : 'Network error submitting for verification');
          }
        } else {
          setVerifiedStatus('unauthenticated');
        }

        setCurrentStep('summary');
      } catch (err) {
        Alert.alert('Storage Notice', 'Failed to save progress. Please check storage permissions.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Reset scenario session for replay
  const handleReplayScenario = () => {
    setCurrentStep('intro');
    setCurrentQuestionIndex(0);
    setSelectedChoiceId(null);
    setSubmittedChoice(null);
    setUserAnswers({});
    setQuestionSubmissions([]);
    setFinalSummary(null);
    setUnlockedAchievements([]);
    setVerifiedResult(null);
    setVerifiedStatus('idle');
    setVerifiedError(null);
  };

  const nextScenario = getNextScenario(scenario.id);

  // --------------------------------------------------------------------------
  // STEP 1: SCENARIO INTRODUCTION
  // --------------------------------------------------------------------------
  if (currentStep === 'intro') {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Module Header Bar */}
        <View style={styles.headerBadgeRow}>
          <Badge label={module.title} variant={module.variant} />
          {isAlreadyCompleted ? (
            <Badge label="Cleared Previously" variant="success" icon={<CheckCircle2 size={12} color={Colors.sustainableGreenLight} />} />
          ) : (
            <Badge label={`Scenario ${scenario.number} of ${module.scenarios.length}`} variant="neutral" />
          )}
        </View>

        {/* Title Card */}
        <Card variant="highlight" style={styles.introCard}>
          <Text style={styles.scenarioNumber}>Scenario {scenario.number}</Text>
          <Text style={styles.scenarioTitle}>{scenario.title}</Text>
          <Text style={styles.scenarioSubtitle}>{scenario.subtitle}</Text>
          <Text style={styles.scenarioDescription}>{scenario.description}</Text>
        </Card>

        {/* Replay Notice if applicable */}
        {isAlreadyCompleted && (
          <Card variant="outlined" style={styles.replayNoticeCard}>
            <View style={styles.noticeHeader}>
              <RotateCcw size={16} color={Colors.turquoiseLight} />
              <Text style={styles.noticeTitle}>Replay Mode</Text>
            </View>
            <Text style={styles.noticeText}>
              You have previously completed this mission (earned {previousRecord?.earnedXp ?? 0} XP and {previousRecord?.earnedCoins ?? 0} coins).
              You can replay freely to test different conservation strategies; replay scores will not duplicate rewards.
            </Text>
          </Card>
        )}

        {/* Realistic Situation Card */}
        <Card variant="default" style={styles.situationCard}>
          <View style={styles.sectionHeaderRow}>
            <Compass size={20} color={Colors.turquoise} />
            <Text style={styles.sectionHeaderTitle}>Current Groundwater Situation</Text>
          </View>
          <Text style={styles.situationText}>{scenario.situation}</Text>
        </Card>

        {/* Learning Objectives */}
        <Card variant="default" style={styles.objectivesCard}>
          <View style={styles.sectionHeaderRow}>
            <Target size={20} color={Colors.cyanSoft} />
            <Text style={styles.sectionHeaderTitle}>Learning Objectives</Text>
          </View>
          {scenario.learningObjectives.map((obj, idx) => (
            <View key={idx} style={styles.objectiveRow}>
              <CheckCircle2 size={16} color={Colors.sustainableGreen} style={styles.objectiveIcon} />
              <Text style={styles.objectiveText}>{obj}</Text>
            </View>
          ))}
        </Card>

        {/* Rewards & Details Card */}
        <Card variant="outlined" style={styles.rewardsPreviewCard}>
          <View style={styles.rewardsRow}>
            <View style={styles.rewardItem}>
              <Award size={18} color={Colors.turquoise} />
              <Text style={styles.rewardText}>Up to 300 Decision XP</Text>
            </View>
            <View style={styles.rewardItem}>
              <Sparkles size={18} color={Colors.goldCoin} />
              <Text style={styles.rewardText}>+50 Completion Bonus</Text>
            </View>
          </View>
        </Card>

        {/* Action Controls */}
        <View style={styles.actionButtonsCol}>
          <Button
            title="Begin Scenario Decisions"
            variant="primary"
            size="lg"
            onPress={() => setCurrentStep('question')}
            icon={<Play size={18} color={Colors.white} />}
            style={styles.fullButton}
          />
          <Button
            title="Return to Missions"
            variant="ghost"
            size="md"
            onPress={() => router.back()}
            style={styles.fullButton}
          />
        </View>
      </ScrollView>
    );
  }

  // --------------------------------------------------------------------------
  // STEP 2: DECISION QUESTIONS & IMMEDIATE FEEDBACK
  // --------------------------------------------------------------------------
  if (currentStep === 'question') {
    const questionNumber = currentQuestionIndex + 1;
    const totalQuestions = scenario.questions.length;

    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Progress Tracker */}
        <View style={styles.trackerRow}>
          <Badge label={`Question ${questionNumber} of ${totalQuestions}`} variant="turquoise" />
          {isAlreadyCompleted && <Badge label="Replay Mode" variant="neutral" />}
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${(questionNumber / totalQuestions) * 100}%` },
            ]}
          />
        </View>

        {/* Question Header Card */}
        <Card variant="highlight" style={styles.questionCard}>
          {currentQuestion.situationContext && (
            <View style={styles.contextBox}>
              <Text style={styles.contextLabel}>Hydrogeological Context:</Text>
              <Text style={styles.contextText}>{currentQuestion.situationContext}</Text>
            </View>
          )}
          <Text style={styles.questionPrompt}>{currentQuestion.question}</Text>
        </Card>

        {/* Answer Choices */}
        <View style={styles.choicesContainer}>
          <Text style={styles.choicesHeader}>Select Your Management Action:</Text>

          {currentQuestion.choices.map((choice) => {
            const isSelected = selectedChoiceId === choice.id;
            const isSubmitted = !!submittedChoice;
            const isThisSubmitted = submittedChoice?.id === choice.id;

            let cardVariant: 'default' | 'highlight' | 'sustainable' | 'outlined' = 'default';
            if (isSubmitted) {
              if (isThisSubmitted) {
                cardVariant =
                  choice.outcome === 'sustainable'
                    ? 'sustainable'
                    : choice.outcome === 'partially_sustainable'
                      ? 'highlight'
                      : 'outlined';
              }
            } else if (isSelected) {
              cardVariant = 'highlight';
            }

            return (
              <TouchableOpacity
                key={choice.id}
                activeOpacity={isSubmitted ? 1 : 0.8}
                disabled={isSubmitted}
                onPress={() => handleSelectChoice(choice.id)}
                style={[
                  styles.choiceTouchable,
                  isSelected && !isSubmitted && styles.choiceSelected,
                  isThisSubmitted && choice.outcome === 'sustainable' && styles.choiceSustainable,
                  isThisSubmitted && choice.outcome === 'partially_sustainable' && styles.choicePartial,
                  isThisSubmitted && choice.outcome === 'unsustainable' && styles.choiceUnsustainable,
                ]}>
                <View style={styles.choiceHeaderRow}>
                  <View
                    style={[
                      styles.radioCircle,
                      isSelected && styles.radioCircleActive,
                      isThisSubmitted && styles.radioCircleSubmitted,
                    ]}>
                    {isSelected && <View style={styles.radioInnerDot} />}
                  </View>
                  <Text style={styles.choiceText}>{choice.text}</Text>
                </View>

                {/* Post-Submission Result Tag on the selected choice */}
                {isThisSubmitted && (
                  <View style={styles.outcomeTagRow}>
                    {choice.outcome === 'sustainable' ? (
                      <Badge
                        label={`Sustainable Action • +${isAlreadyCompleted ? 0 : 100} XP`}
                        variant="success"
                        icon={<CheckCircle2 size={12} color={Colors.sustainableGreenLight} />}
                      />
                    ) : choice.outcome === 'partially_sustainable' ? (
                      <Badge
                        label={`Partially Sustainable • +${isAlreadyCompleted ? 0 : 40} XP`}
                        variant="warning"
                        icon={<HelpCircle size={12} color={Colors.warningOrange} />}
                      />
                    ) : (
                      <Badge
                        label={`Unsustainable Action • +0 XP`}
                        variant="danger"
                        icon={<XCircle size={12} color={Colors.dangerRed} />}
                      />
                    )}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Immediate Educational Feedback Card */}
        {submittedChoice && (
          <Card
            variant={
              submittedChoice.outcome === 'sustainable'
                ? 'sustainable'
                : submittedChoice.outcome === 'partially_sustainable'
                  ? 'highlight'
                  : 'outlined'
            }
            style={styles.feedbackCard}>
            <View style={styles.feedbackHeaderRow}>
              {submittedChoice.outcome === 'sustainable' ? (
                <CheckCircle2 size={22} color={Colors.sustainableGreen} />
              ) : submittedChoice.outcome === 'partially_sustainable' ? (
                <HelpCircle size={22} color={Colors.warningOrange} />
              ) : (
                <XCircle size={22} color={Colors.dangerRed} />
              )}
              <Text style={styles.feedbackTitle}>
                {submittedChoice.outcome === 'sustainable'
                  ? 'Scientific Assessment: Sustainable'
                  : submittedChoice.outcome === 'partially_sustainable'
                    ? 'Scientific Assessment: Partially Sustainable'
                    : 'Scientific Assessment: Unsustainable'}
              </Text>
            </View>

            <Text style={styles.feedbackBody}>{submittedChoice.explanation}</Text>

            <View style={styles.rewardSummaryRow}>
              <View style={styles.rewardPill}>
                <Award size={14} color={Colors.turquoise} />
                <Text style={styles.rewardPillText}>
                  XP: +{isAlreadyCompleted ? 0 : scoringService.evaluateChoice(submittedChoice).xp}
                </Text>
              </View>
              <View style={styles.rewardPill}>
                <Coins size={14} color={Colors.goldCoin} />
                <Text style={styles.rewardPillText}>
                  Coins: +{isAlreadyCompleted ? 0 : scoringService.evaluateChoice(submittedChoice).coins}
                </Text>
              </View>
              {isAlreadyCompleted && (
                <Text style={styles.replayZeroNotice}>(Replay: No Duplicate Rewards)</Text>
              )}
            </View>
          </Card>
        )}

        {/* Controls */}
        <View style={styles.decisionActionRow}>
          {!submittedChoice ? (
            <Button
              title="Confirm & Submit Decision"
              variant="primary"
              size="lg"
              disabled={!selectedChoiceId}
              onPress={handleSubmitDecision}
              icon={<CheckCircle2 size={18} color={Colors.white} />}
              style={styles.fullButton}
            />
          ) : (
            <Button
              title={isLastQuestion ? 'Review Scenario Summary' : 'Proceed to Next Decision'}
              variant="primary"
              size="lg"
              loading={isSubmitting}
              onPress={handleNextQuestion}
              icon={<ArrowRight size={18} color={Colors.white} />}
              iconPosition="right"
              style={styles.fullButton}
            />
          )}
        </View>
      </ScrollView>
    );
  }

  // --------------------------------------------------------------------------
  // STEP 3: FINAL SCENARIO SUMMARY & RESULTS
  // --------------------------------------------------------------------------
  const summary = finalSummary;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Celebration Header */}
      <View style={styles.summaryHeader}>
        <View style={styles.trophyCircle}>
          <Award size={48} color={Colors.turquoise} />
        </View>
        <Text style={styles.summaryTitle}>
          {summary?.isFirstCompletion ? 'Mission Successfully Completed!' : 'Mission Replay Completed!'}
        </Text>
        <Text style={styles.summarySubtitle}>{scenario.title}</Text>
      </View>

      {/* Rewards Scoreboard */}
      <Card variant="highlight" style={styles.scoreCard}>
        <Text style={styles.scoreCardHeading}>Mission Accomplishment</Text>

        <View style={styles.scoreGrid}>
          <View style={styles.scoreBox}>
            <Award size={20} color={Colors.turquoise} />
            <Text style={styles.scoreNumber}>
              +{summary?.isFirstCompletion ? summary.totalXpEarned : 0}
            </Text>
            <Text style={styles.scoreLabel}>Total XP Earned</Text>
          </View>

          <View style={styles.scoreDivider} />

          <View style={styles.scoreBox}>
            <Coins size={20} color={Colors.goldCoin} />
            <Text style={styles.scoreNumber}>
              +{summary?.isFirstCompletion ? summary.totalCoinsEarned : 0}
            </Text>
            <Text style={styles.scoreLabel}>Eco Coins Earned</Text>
          </View>
        </View>

        {summary?.isFirstCompletion ? (
          <View style={styles.bonusBanner}>
            <Sparkles size={16} color={Colors.sustainableGreenLight} />
            <Text style={styles.bonusText}>
              Includes +{summary.bonusXp} XP and +{summary.bonusCoins} Coins scenario completion bonus!
            </Text>
          </View>
        ) : (
          <View style={styles.bonusBanner}>
            <RotateCcw size={16} color={Colors.cyanSoft} />
            <Text style={styles.replayNoticeSummary}>
              Replay score calculated for practice. Permanent rewards were previously credited.
            </Text>
          </View>
        )}
      </Card>

      {/* Newly Unlocked Achievements Notification / Cards */}
      {unlockedAchievements.length > 0 && (
        <View style={styles.unlockedAchievementsSection}>
          <View style={styles.unlockedHeaderRow}>
            <Trophy size={20} color={Colors.goldCoin} />
            <Text style={styles.unlockedSectionTitle}>
              {unlockedAchievements.length === 1
                ? 'Achievement Unlocked!'
                : `${unlockedAchievements.length} Achievements Unlocked!`}
            </Text>
          </View>

          {unlockedAchievements.map((ach) => (
            <Card key={ach.id} variant="highlight" style={styles.achievementUnlockCard}>
              <View style={styles.achievementRow}>
                <View style={styles.achievementIconCircle}>
                  {renderAchievementIcon(ach.icon)}
                </View>
                <View style={styles.achievementTextWrap}>
                  <View style={styles.achievementBadgeRow}>
                    <Text style={styles.achievementCardTitle}>{ach.title}</Text>
                    <Badge
                      label={ach.tier.toUpperCase()}
                      variant={
                        ach.tier === 'platinum' || ach.tier === 'gold'
                          ? 'warning'
                          : ach.tier === 'silver'
                            ? 'turquoise'
                            : 'neutral'
                      }
                    />
                  </View>
                  <Text style={styles.achievementCardDesc}>{ach.description}</Text>
                  {ach.coinReward > 0 && (
                    <View style={styles.achievementRewardBadge}>
                      <Coins size={14} color={Colors.goldCoin} />
                      <Text style={styles.achievementRewardText}>
                        +{ach.coinReward} Eco Coins Earned
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </Card>
          ))}
        </View>
      )}

      {/* Competitive Leaderboard Verification Status */}
      {verifiedStatus === 'success' && verifiedResult && (
        <Card variant="highlight" style={styles.leaderboardStatusCard}>
          <View style={styles.statusRow}>
            <CheckCircle2 size={22} color={Colors.turquoise} />
            <View style={styles.statusTextContainer}>
              <Text style={styles.statusTitle}>Official Ranking Updated</Text>
              <Text style={styles.statusSubtitle}>
                +{verifiedResult.earned_xp} competitive XP verified and credited to the National Leaderboard!
              </Text>
            </View>
          </View>
        </Card>
      )}

      {verifiedStatus === 'already_completed' && (
        <Card variant="outlined" style={styles.leaderboardStatusCard}>
          <View style={styles.statusRow}>
            <RotateCcw size={22} color={Colors.cyanSoft} />
            <View style={styles.statusTextContainer}>
              <Text style={styles.statusTitle}>Practice Mission Replay</Text>
              <Text style={styles.statusSubtitle}>
                You already completed this mission. Verified leaderboard XP was credited on your first completion.
              </Text>
            </View>
          </View>
        </Card>
      )}

      {verifiedStatus === 'failed' && (
        <Card variant="outlined" style={styles.leaderboardStatusCard}>
          <View style={styles.statusRow}>
            <AlertCircle size={22} color={Colors.warningOrange} />
            <View style={styles.statusTextContainer}>
              <Text style={styles.statusTitle}>Competitive Credit Not Confirmed</Text>
              <Text style={styles.statusSubtitle}>
                Your local progress is safely saved, but competitive leaderboard credit was not confirmed ({verifiedError || 'Offline'}). This submission will not automatically sync.
              </Text>
            </View>
          </View>
        </Card>
      )}

      {verifiedStatus === 'unauthenticated' && (
        <Card variant="outlined" style={styles.leaderboardStatusCard}>
          <View style={styles.statusRow}>
            <Sparkles size={22} color={Colors.cyanSoft} />
            <View style={styles.statusTextContainer}>
              <Text style={styles.statusTitle}>Compete on National Leaderboard</Text>
              <Text style={styles.statusSubtitle}>
                Your progress is saved locally. Sign in with a JalRakshak account to record verified scores and climb the national leaderboard.
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/auth/login')}
                style={styles.signInLink}
              >
                <Text style={styles.signInLinkText}>Sign in to compete →</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Card>
      )}

      {/* Decision Review List */}
      <View style={styles.reviewSection}>
        <Text style={styles.reviewSectionTitle}>Decision Performance Review:</Text>

        {summary?.questionsAnswered.map((item, index) => {
          const q = scenario.questions.find((x) => x.id === item.questionId);
          const choice = q?.choices.find((c) => c.id === item.selectedChoiceId);

          return (
            <Card key={item.questionId} variant="default" style={styles.reviewCard}>
              <View style={styles.reviewHeaderRow}>
                <Text style={styles.reviewQNumber}>Decision {index + 1}</Text>
                {item.outcome === 'sustainable' ? (
                  <Badge label="Sustainable" variant="success" />
                ) : item.outcome === 'partially_sustainable' ? (
                  <Badge label="Partially Sustainable" variant="warning" />
                ) : (
                  <Badge label="Unsustainable" variant="danger" />
                )}
              </View>

              <Text style={styles.reviewQuestionText}>{q?.question}</Text>

              <View style={styles.reviewChoiceBox}>
                <Text style={styles.reviewChoiceLabel}>Selected Choice:</Text>
                <Text style={styles.reviewChoiceText}>{choice?.text}</Text>
              </View>

              <Text style={styles.reviewExplanationText}>{item.explanation}</Text>
            </Card>
          );
        })}
      </View>

      {/* Navigation Controls */}
      <View style={styles.summaryActions}>
        {nextScenario && (
          <Button
            title={`Next: Scenario ${nextScenario.number}`}
            variant="primary"
            size="lg"
            onPress={() => {
              router.replace(`/game/${nextScenario.id}` as any);
            }}
            icon={<ArrowRight size={18} color={Colors.white} />}
            iconPosition="right"
            style={styles.fullButton}
          />
        )}

        <Button
          title="Replay This Scenario"
          variant="secondary"
          size="md"
          onPress={handleReplayScenario}
          icon={<RotateCcw size={16} color={Colors.cyanSoft} />}
          style={styles.fullButton}
        />

        <Button
          title="Return to Mission Arena"
          variant="ghost"
          size="md"
          onPress={() => router.push('/(tabs)/game')}
          style={styles.fullButton}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.navyDark,
  },
  content: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    backgroundColor: Colors.navyDark,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.white,
    marginTop: Spacing.md,
  },
  errorSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  errorButton: {
    minWidth: 200,
  },
  headerBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  introCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  scenarioNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.turquoise,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  scenarioTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.white,
    marginTop: 4,
    marginBottom: 2,
  },
  scenarioSubtitle: {
    fontSize: 13,
    color: Colors.cyanSoft,
    fontWeight: '500',
    marginBottom: Spacing.sm,
  },
  scenarioDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  replayNoticeCard: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderColor: Colors.turquoise,
  },
  noticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  noticeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.turquoiseLight,
  },
  noticeText: {
    fontSize: 12,
    color: Colors.textMuted,
    lineHeight: 17,
  },
  situationCard: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs + 2,
    marginBottom: Spacing.sm,
  },
  sectionHeaderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
  },
  situationText: {
    fontSize: 13,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  objectivesCard: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  objectiveRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs + 2,
  },
  objectiveIcon: {
    marginTop: 2,
    marginRight: Spacing.sm,
  },
  objectiveText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  rewardsPreviewCard: {
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  rewardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rewardText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.white,
  },
  actionButtonsCol: {
    gap: Spacing.sm,
  },
  fullButton: {
    width: '100%',
  },
  trackerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: Colors.navyLight,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.navyCardBorder,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.turquoise,
  },
  questionCard: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  contextBox: {
    backgroundColor: Colors.navyDark,
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: Colors.turquoise,
  },
  contextLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.turquoiseLight,
    textTransform: 'uppercase',
  },
  contextText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  questionPrompt: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
    lineHeight: 22,
  },
  choicesContainer: {
    marginBottom: Spacing.md,
  },
  choicesHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.cyanSoft,
    marginBottom: Spacing.sm,
  },
  choiceTouchable: {
    backgroundColor: Colors.navyLight,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.navyCardBorder,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  choiceSelected: {
    borderColor: Colors.turquoise,
    backgroundColor: Colors.navyCard,
  },
  choiceSustainable: {
    borderColor: Colors.sustainableGreen,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
  },
  choicePartial: {
    borderColor: Colors.warningOrange,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
  },
  choiceUnsustainable: {
    borderColor: Colors.dangerRed,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
  },
  choiceHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  radioCircleActive: {
    borderColor: Colors.turquoise,
  },
  radioCircleSubmitted: {
    borderColor: Colors.white,
  },
  radioInnerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.turquoise,
  },
  choiceText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  outcomeTagRow: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.navyCardBorder,
  },
  feedbackCard: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  feedbackHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs + 2,
    marginBottom: Spacing.xs,
  },
  feedbackTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.white,
  },
  feedbackBody: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
    marginVertical: Spacing.xs,
  },
  rewardSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  rewardPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.navyDark,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  rewardPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.white,
  },
  replayZeroNotice: {
    fontSize: 11,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
  decisionActionRow: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  summaryHeader: {
    alignItems: 'center',
    marginVertical: Spacing.md,
  },
  trophyCircle: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.navyLight,
    borderWidth: 2,
    borderColor: Colors.turquoise,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  summaryTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.white,
    textAlign: 'center',
  },
  summarySubtitle: {
    fontSize: 14,
    color: Colors.cyanSoft,
    textAlign: 'center',
    marginTop: 2,
  },
  scoreCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  scoreCardHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.turquoiseLight,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  scoreGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: Colors.navyDark,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.navyCardBorder,
  },
  scoreBox: {
    alignItems: 'center',
    flex: 1,
  },
  scoreNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.white,
    marginVertical: 4,
  },
  scoreLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  scoreDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.navyCardBorder,
  },
  bonusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: Spacing.md,
  },
  bonusText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.sustainableGreenLight,
  },
  replayNoticeSummary: {
    fontSize: 12,
    color: Colors.cyanSoft,
    textAlign: 'center',
  },
  reviewSection: {
    marginBottom: Spacing.lg,
  },
  reviewSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: Spacing.sm,
  },
  reviewCard: {
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  reviewHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  reviewQNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.turquoise,
    textTransform: 'uppercase',
  },
  reviewQuestionText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: Spacing.xs,
    lineHeight: 18,
  },
  reviewChoiceBox: {
    backgroundColor: Colors.navyDark,
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
    marginVertical: Spacing.xs,
  },
  reviewChoiceLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
  },
  reviewChoiceText: {
    fontSize: 12,
    color: Colors.textPrimary,
    marginTop: 2,
    lineHeight: 16,
  },
  reviewExplanationText: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 17,
    marginTop: Spacing.xs,
  },
  summaryActions: {
    gap: Spacing.sm,
  },
  leaderboardStatusCard: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  statusTextContainer: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 2,
  },
  statusSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 17,
  },
  signInLink: {
    marginTop: Spacing.xs,
  },
  signInLinkText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.turquoise,
  },
  unlockedAchievementsSection: {
    marginBottom: Spacing.md,
  },
  unlockedHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  unlockedSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.goldCoin,
  },
  achievementUnlockCard: {
    marginBottom: Spacing.xs,
    padding: Spacing.sm,
  },
  achievementRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  achievementIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.navyDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementTextWrap: {
    flex: 1,
  },
  achievementBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  achievementCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.white,
    flex: 1,
    marginRight: Spacing.xs,
  },
  achievementCardDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  achievementRewardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing.xs,
  },
  achievementRewardText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.goldCoin,
  },
});
