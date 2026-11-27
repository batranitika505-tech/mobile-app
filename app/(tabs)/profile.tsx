import React, { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Award,
  BookOpen,
  CheckCircle,
  CheckCircle2,
  Cloud,
  CloudCheck,
  Coins,
  Compass,
  Droplet,
  FileCheck2,
  Flame,
  Info,
  Lock,
  LogIn,
  LogOut,
  RefreshCw,
  RotateCcw,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Sprout,
  Target,
  Trophy,
  User,
  UserPlus,
} from 'lucide-react-native';

import { Colors } from '../../src/constants/colors';
import { BorderRadius, Spacing } from '../../src/constants/layout';
import { Button } from '../../src/components/common/Button';
import { Card } from '../../src/components/common/Card';
import { Badge } from '../../src/components/common/Badge';
import { useGuestProgress } from '../../src/context/GuestProgressContext';
import { useAuth } from '../../src/context/AuthContext';
import { achievementService } from '../../src/services/achievementService';
import { Achievement } from '../../src/types/achievement';
import {
  CERTIFICATE_CONSTANTS,
  certificateService,
} from '../../src/services/certificateService';
import { CertificateEligibility } from '../../src/types/certificate';
import { CertificateViewerModal } from '../../src/components/certificate/CertificateViewerModal';

function renderAchievementIcon(iconName: string, isUnlocked: boolean) {
  const color = isUnlocked ? Colors.sustainableGreenLight : Colors.textMuted;
  switch (iconName) {
    case 'Droplet':
      return <Droplet size={22} color={isUnlocked ? Colors.turquoiseLight : color} />;
    case 'ShieldAlert':
      return <ShieldAlert size={22} color={isUnlocked ? Colors.warningOrange : color} />;
    case 'Sparkles':
      return <Sparkles size={22} color={isUnlocked ? Colors.goldCoin : color} />;
    case 'ShieldCheck':
      return <ShieldCheck size={22} color={isUnlocked ? Colors.sustainableGreenLight : color} />;
    case 'Sprout':
      return <Sprout size={22} color={isUnlocked ? Colors.sustainableGreenLight : color} />;
    case 'Compass':
      return <Compass size={22} color={isUnlocked ? Colors.cyanSoft : color} />;
    case 'Award':
      return <Award size={22} color={isUnlocked ? Colors.goldCoin : color} />;
    case 'Flame':
      return <Flame size={22} color={isUnlocked ? Colors.warningOrange : color} />;
    case 'Target':
      return <Target size={22} color={isUnlocked ? Colors.dangerRed : color} />;
    case 'Trophy':
      return <Trophy size={22} color={isUnlocked ? Colors.goldCoin : color} />;
    default:
      return <Award size={22} color={color} />;
  }
}

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, profile, signOut, isConfigured } = useAuth();
  const {
    progress,
    isLoading,
    isSyncing,
    syncStatus,
    lastSyncError,
    resetProgress,
    syncWithCloud,
  } = useGuestProgress();
  const [syncingManual, setSyncingManual] = useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [isLoadingCertEligibility, setIsLoadingCertEligibility] = useState(false);

  // Derive stable session key based on current auth state / guest ID
  const currentSessionKey = user?.id ? `auth:${user.id}` : `guest:${progress.guestId || 'default'}`;

  // Session-bound certificate eligibility container
  const [sessionEligibility, setSessionEligibility] = useState<{
    sessionKey: string;
    eligibility: CertificateEligibility;
  } | null>(null);
  const [prevSessionKey, setPrevSessionKey] = useState(currentSessionKey);

  // Synchronously invalidate stale session data immediately during render (never wait for useEffect)
  if (prevSessionKey !== currentSessionKey) {
    setPrevSessionKey(currentSessionKey);
    setIsCertModalOpen(false);
    setSessionEligibility(null);
  }

  // Verify that stored eligibility belongs to current active session
  const isMatchingSession = sessionEligibility?.sessionKey === currentSessionKey;
  const validSessionEligibility = isMatchingSession ? sessionEligibility.eligibility : null;

  useEffect(() => {
    let isCancelled = false;
    const requestSessionKey = currentSessionKey;

    async function evaluateEligibility() {
      if (user?.id) {
        setIsLoadingCertEligibility(true);
        try {
          const res = await certificateService.fetchAuthenticatedEligibility();
          if (isCancelled || requestSessionKey !== currentSessionKey) return;

          if (res.success && res.data) {
            setSessionEligibility({
              sessionKey: requestSessionKey,
              eligibility: res.data,
            });
          } else {
            // Authenticated query failed - set explicitly ineligible error state; NEVER guest progress
            setSessionEligibility({
              sessionKey: requestSessionKey,
              eligibility: {
                isEligible: false,
                isVerified: false,
                currentXp: 0,
                targetXp: CERTIFICATE_CONSTANTS.TARGET_XP,
                completedModulesCount: 0,
                totalModulesCount: CERTIFICATE_CONSTANTS.REQUIRED_MODULES.length,
                completedModuleIds: [],
                missingRequirements: [
                  'Server verification unavailable. Please check your network connection or try syncing progress.',
                ],
                verificationStatus: 'error',
                errorMessage: res.error || 'Failed to verify educational records',
              },
            });
          }
        } catch (err) {
          if (isCancelled || requestSessionKey !== currentSessionKey) return;
          // Exception thrown - strictly set ineligible error state; NEVER guest progress
          setSessionEligibility({
            sessionKey: requestSessionKey,
            eligibility: {
              isEligible: false,
              isVerified: false,
              currentXp: 0,
              targetXp: CERTIFICATE_CONSTANTS.TARGET_XP,
              completedModulesCount: 0,
              totalModulesCount: CERTIFICATE_CONSTANTS.REQUIRED_MODULES.length,
              completedModuleIds: [],
              missingRequirements: [
                'Server verification unavailable. Please check your network connection or try syncing progress.',
              ],
              verificationStatus: 'error',
              errorMessage: err instanceof Error ? err.message : 'Failed to query verified records',
            },
          });
        } finally {
          if (!isCancelled && requestSessionKey === currentSessionKey) {
            setIsLoadingCertEligibility(false);
          }
        }
      } else {
        // Guest user - evaluate strictly from local guest session progress
        setIsLoadingCertEligibility(false);
        const guestCalc = certificateService.calculateGuestEligibility(progress);
        if (!isCancelled && requestSessionKey === currentSessionKey) {
          setSessionEligibility({
            sessionKey: requestSessionKey,
            eligibility: guestCalc,
          });
        }
      }
    }

    evaluateEligibility();

    return () => {
      isCancelled = true;
    };
  }, [currentSessionKey, progress, syncStatus]);

  const currentLevel = Math.floor(progress.totalXp / 250) + 1;

  // Authoritative or local certificate calculation
  // CRITICAL SECURITY GUARD: Authenticated users must NEVER receive guest progress fallback
  const activeEligibility: CertificateEligibility = user
    ? validSessionEligibility || {
        isEligible: false,
        isVerified: false,
        currentXp: 0,
        targetXp: CERTIFICATE_CONSTANTS.TARGET_XP,
        completedModulesCount: 0,
        totalModulesCount: CERTIFICATE_CONSTANTS.REQUIRED_MODULES.length,
        completedModuleIds: [],
        missingRequirements: ['Verifying server audit records...'],
        verificationStatus: 'server_verified',
      }
    : validSessionEligibility || certificateService.calculateGuestEligibility(progress);

  // The certificate button and modal strictly require:
  // 1. Eligibility belongs to the current session (matching session identity)
  // 2. isEligible is true
  // 3. For authenticated users: must be server-verified (isVerified === true)
  // 4. For guests: must be local guest eligibility (!isVerified)
  const canShowCertificate = Boolean(
    isMatchingSession &&
    activeEligibility.isEligible &&
    (user ? activeEligibility.isVerified : !activeEligibility.isVerified)
  );

  const maxPossibleXp = CERTIFICATE_CONSTANTS.MAX_XP; // 5,600 XP
  const targetXp70Percent = CERTIFICATE_CONSTANTS.TARGET_XP; // 3,920 XP
  const moduleProgress =
    activeEligibility.completedModulesCount / CERTIFICATE_CONSTANTS.REQUIRED_MODULES.length;
  const xpProgress = Math.min(1, activeEligibility.currentXp / targetXp70Percent);
  const certPercentage = Math.round(((moduleProgress + xpProgress) / 2) * 100);

  const allAchievements = achievementService.getAllAchievements();
  const unlockedSet = new Set(progress.achievements || []);
  const totalUnlockedBadges = allAchievements.filter((a) => unlockedSet.has(a.id)).length;

  const handleManualSync = async () => {
    try {
      setSyncingManual(true);
      const res = await syncWithCloud();
      if (res.success) {
        Alert.alert('Sync Successful', 'Your conservation progress is up to date in the cloud.');
      } else {
        Alert.alert(
          'Sync Failed',
          res.error || 'Could not sync progress with the cloud. Please check network connectivity or database permissions.'
        );
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred during sync.';
      Alert.alert('Sync Error', message);
    } finally {
      setSyncingManual(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out of your account?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          try {
            setSessionEligibility(null);
            setIsCertModalOpen(false);
            await signOut();
            Alert.alert('Signed Out', 'You are now operating in local Guest Mode.');
          } catch {
            Alert.alert('Error', 'Failed to sign out. Please try again.');
          }
        },
      },
    ]);
  };

  const handleResetGuestData = () => {
    Alert.alert(
      'Reset Gameplay Progress',
      'This will reset your earned XP, coins, completed scenarios, and modules back to zero.\n\nYour session ID will be preserved.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset Progress',
          style: 'destructive',
          onPress: async () => {
            try {
              await resetProgress();
              Alert.alert('Reset Complete', 'Your gameplay progress has been reset to zero.');
            } catch {
              Alert.alert('Error', 'Failed to reset progress. Please try again.');
            }
          },
        },
      ]
    );
  };

  const displayName = user
    ? profile?.full_name || profile?.display_name || user.email?.split('@')[0] || 'Guardian'
    : 'Cadet JalRakshak';

  const userSubtitle = user
    ? user.email || 'Verified Account'
    : `Trainee • ID: ${progress.guestId ? progress.guestId.slice(0, 16) + '...' : 'Loading...'}`;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: Math.max(Spacing.xxl, Spacing.xxl + insets.bottom) },
      ]}>
      {/* Player Identity Card */}
      <Card variant="highlight" style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarCircle}>
            <User size={36} color={Colors.turquoise} />
          </View>
          <View style={styles.profileInfo}>
            <View style={styles.badgeRow}>
              {user ? (
                <Badge label="Verified Account" variant="turquoise" />
              ) : (
                <Badge label="Guest Mode" variant="neutral" />
              )}
              <Badge label={`Level ${currentLevel}`} variant="neutral" />
            </View>
            <Text style={styles.playerName}>{displayName}</Text>
            <Text style={styles.playerRole}>{userSubtitle}</Text>
          </View>
        </View>

        {/* Progress Grid */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={Colors.turquoise} />
            <Text style={styles.loadingText}>Loading progress data...</Text>
          </View>
        ) : (
          <View style={styles.statsGrid}>
            <View style={styles.gridBox}>
              <Text style={styles.gridLabel}>Total XP</Text>
              <Text style={styles.gridValue}>{progress.totalXp}</Text>
              <Text style={styles.gridSub}>Target: 3,920 XP</Text>
            </View>
            <View style={styles.gridBox}>
              <Text style={styles.gridLabel}>Coins</Text>
              <Text style={styles.gridValue}>{progress.coins}</Text>
              <Text style={styles.gridSub}>Eco Tokens</Text>
            </View>
            <View style={styles.gridBox}>
              <Text style={styles.gridLabel}>Missions</Text>
              <Text style={styles.gridValue}>{progress.completedModules.length} / 4</Text>
              <Text style={styles.gridSub}>Modules Complete</Text>
            </View>
          </View>
        )}
      </Card>

      {/* Account Cloud Status Card */}
      {user ? (
        <Card variant="default" style={styles.syncCard}>
          <View style={styles.syncHeader}>
            <View style={styles.syncStatusLeft}>
              <Cloud
                size={20}
                color={syncStatus === 'error' ? Colors.warningOrange : Colors.turquoise}
              />
              <View style={styles.syncTextWrap}>
                <Text style={styles.syncTitle}>Cloud Synchronization</Text>
                <Text
                  style={[
                    styles.syncSubtitle,
                    syncStatus === 'error' && styles.syncSubtitleError,
                  ]}
                  numberOfLines={2}>
                  {isSyncing || syncingManual
                    ? 'Syncing with cloud...'
                    : syncStatus === 'error'
                      ? `Sync failed: ${lastSyncError || 'Check permissions or network'}`
                      : syncStatus === 'synced'
                        ? 'Your progress is backed up securely in the cloud'
                        : 'Tap to sync progress with cloud'}
                </Text>
              </View>
            </View>
            <Button
              title={syncingManual ? 'Syncing...' : 'Sync Now'}
              variant="secondary"
              size="sm"
              onPress={handleManualSync}
              disabled={syncingManual || isSyncing}
              icon={
                syncingManual ? (
                  <ActivityIndicator size="small" color={Colors.white} />
                ) : (
                  <RefreshCw size={14} color={Colors.white} />
                )
              }
            />
          </View>
        </Card>
      ) : (
        <Card variant="default" style={styles.authPromptCard}>
          <View style={styles.authPromptContent}>
            <View style={styles.authPromptIcon}>
              <Cloud size={24} color={Colors.turquoise} />
            </View>
            <View style={styles.authPromptTextWrap}>
              <Text style={styles.authPromptTitle}>Save Progress to the Cloud</Text>
              <Text style={styles.authPromptDesc}>
                Create an account or sign in to safeguard your progress and access your certificate
                across devices.
              </Text>
            </View>
          </View>
          <View style={styles.authPromptBtnRow}>
            <Button
              title="Sign In"
              variant="secondary"
              size="sm"
              onPress={() => router.push('/auth/login' as any)}
              icon={<LogIn size={14} color={Colors.white} />}
              style={styles.authPromptBtn}
            />
            <Button
              title="Create Account"
              variant="primary"
              size="sm"
              onPress={() => router.push('/auth/register' as any)}
              icon={<UserPlus size={14} color={Colors.white} />}
              style={styles.authPromptBtn}
            />
          </View>
        </Card>
      )}

      {/* Educational Certificate Eligibility Card */}
      <Card
        variant={canShowCertificate ? 'sustainable' : 'default'}
        style={styles.certCard}
      >
        <View style={styles.certHeader}>
          <View style={styles.certHeaderLeft}>
            <FileCheck2
              size={24}
              color={canShowCertificate ? Colors.sustainableGreenLight : Colors.turquoise}
            />
            <View style={styles.certTitleWrap}>
              <Text style={styles.certTitle}>Educational Achievement Certificate</Text>
              <Text style={styles.certSub}>
                {activeEligibility.isVerified
                  ? 'Authoritative Server-Verified Records'
                  : user
                    ? activeEligibility.verificationStatus === 'error'
                      ? 'Server Verification Unavailable'
                      : isLoadingCertEligibility || !isMatchingSession
                        ? 'Verifying Server Audit Records...'
                        : 'Syncing with Server Audit Records'
                    : 'Local Session Learning Achievement'}
              </Text>
            </View>
          </View>
          <Badge
            label={
              activeEligibility.isVerified
                ? 'VERIFIED'
                : user
                  ? activeEligibility.verificationStatus === 'error'
                    ? 'UNVERIFIED'
                    : 'SYNC PENDING'
                  : 'GUEST'
            }
            variant={
              activeEligibility.isVerified
                ? 'success'
                : user
                  ? 'warning'
                  : 'neutral'
            }
          />
        </View>

        <Text style={styles.certExplanation}>
          Awarded upon completing all 4 conservation modules and achieving at least 70% of maximum scenario XP (
          {targetXp70Percent.toLocaleString()} of {maxPossibleXp.toLocaleString()} XP).
          {activeEligibility.isVerified && ' Your verified audit records confirm full requirement fulfillment.'}
          {user && activeEligibility.verificationStatus === 'error' &&
            ` Notice: ${activeEligibility.errorMessage || 'Server audit records could not be verified.'}`}
        </Text>

        <View style={styles.progressBarContainer}>
          <View style={styles.progressBackground}>
            <View style={[styles.progressFill, { width: `${certPercentage}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {isLoadingCertEligibility
              ? 'Verifying server audit records...'
              : `${certPercentage}% of requirement met`}
          </Text>
        </View>

        <View style={styles.reqRow}>
          <View style={styles.reqItem}>
            <CheckCircle
              size={14}
              color={
                activeEligibility.completedModulesCount === 4
                  ? Colors.sustainableGreenLight
                  : Colors.textMuted
              }
            />
            <Text style={styles.reqText}>
              Complete 4 Modules ({activeEligibility.completedModulesCount}/4)
            </Text>
          </View>
          <View style={styles.reqItem}>
            <CheckCircle
              size={14}
              color={
                activeEligibility.currentXp >= targetXp70Percent
                  ? Colors.sustainableGreenLight
                  : Colors.textMuted
              }
            />
            <Text style={styles.reqText}>
              Earn ≥ 70% Max XP ({activeEligibility.currentXp.toLocaleString()} / {targetXp70Percent.toLocaleString()} XP)
            </Text>
          </View>
        </View>

        {canShowCertificate ? (
          <View style={styles.certActionWrap}>
            <Button
              title="View Educational Certificate"
              variant="primary"
              size="md"
              onPress={() => setIsCertModalOpen(true)}
              icon={<Award size={18} color={Colors.white} />}
              style={styles.viewCertBtn}
            />
          </View>
        ) : (
          activeEligibility.missingRequirements.length > 0 && (
            <View style={styles.certMissingWrap}>
              <Text style={styles.certMissingHeader}>Requirements Remaining:</Text>
              {activeEligibility.missingRequirements.map((req, idx) => (
                <Text key={idx} style={styles.certMissingItem}>
                  • {req}
                </Text>
              ))}
            </View>
          )
        )}

        <Text style={styles.certDisclaimer}>
          Notice: The certificate is a project-generated learning achievement for this educational
          app and is not an official government certification or formal accreditation.
        </Text>
      </Card>

      {/* Achievement Badges Showcase */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Achievement Badges</Text>
        <Badge
          label={`${totalUnlockedBadges} / ${allAchievements.length} Unlocked`}
          variant={totalUnlockedBadges > 0 ? 'success' : 'neutral'}
        />
      </View>

      <View style={styles.badgesList}>
        {allAchievements.map((ach) => {
          const isUnlocked = unlockedSet.has(ach.id);
          const progressDetail = achievementService.calculateAchievementProgress(
            ach,
            progress,
            progress.achievements
          );

          return (
            <Card
              key={ach.id}
              variant={isUnlocked ? 'sustainable' : 'outlined'}
              style={[
                styles.badgeCard,
                isUnlocked ? styles.badgeCardUnlocked : styles.badgeCardLocked,
              ]}
            >
              <View style={styles.badgeTopRow}>
                <View
                  style={[
                    styles.badgeIconCircle,
                    isUnlocked ? styles.badgeIconCircleUnlocked : styles.badgeIconCircleLocked,
                  ]}
                >
                  {renderAchievementIcon(ach.icon, isUnlocked)}
                </View>

                <View style={styles.badgeHeaderWrap}>
                  <View style={styles.badgeTitleRow}>
                    <Text style={[styles.badgeTitle, !isUnlocked && styles.badgeTitleLocked]}>
                      {ach.title}
                    </Text>
                    <Badge
                      label={ach.tier.toUpperCase()}
                      variant={
                        ach.tier === 'platinum'
                          ? 'primary'
                          : ach.tier === 'gold'
                            ? 'warning'
                            : ach.tier === 'silver'
                              ? 'turquoise'
                              : 'neutral'
                      }
                    />
                  </View>
                  <Text style={styles.badgeDesc}>{ach.description}</Text>
                </View>
              </View>

              {/* Incremental / Module Criteria Progress */}
              {!isUnlocked && (
                <View style={styles.badgeProgressWrap}>
                  {ach.criteria.type === 'scenarios_completed' && (
                    <>
                      <Text style={styles.badgeProgressLabel}>
                        Progress: {Math.min(ach.criteria.requiredScenariosCount ?? 1, progress.completedScenarios.length)} / {ach.criteria.requiredScenariosCount ?? 1} {ach.criteria.requiredScenariosCount === 1 ? 'Scenario' : 'Scenarios'}
                      </Text>
                      <View style={styles.badgeProgressBarBg}>
                        <View style={[styles.badgeProgressBarFill, { width: `${progressDetail.percentage}%` }]} />
                      </View>
                    </>
                  )}

                  {ach.criteria.type === 'module_completed' && (
                    <Text style={styles.badgeProgressLabel}>
                      Status: Incomplete • Clear 4 scenarios in this module
                    </Text>
                  )}

                  {ach.criteria.type === 'all_modules_completed' && (
                    <>
                      <Text style={styles.badgeProgressLabel}>
                        Progress: {Math.min(16, progress.completedScenarios.length)} / 16 Scenarios ({progress.completedModules.length} / 4 Modules)
                      </Text>
                      <View style={styles.badgeProgressBarBg}>
                        <View style={[styles.badgeProgressBarFill, { width: `${progressDetail.percentage}%` }]} />
                      </View>
                    </>
                  )}

                  {ach.criteria.type === 'min_total_xp' && (
                    <>
                      <Text style={styles.badgeProgressLabel}>
                        XP Progress: {progress.totalXp.toLocaleString()} / {(ach.criteria.requiredTotalXp ?? 3500).toLocaleString()} XP
                      </Text>
                      <View style={styles.badgeProgressBarBg}>
                        <View style={[styles.badgeProgressBarFill, { width: `${progressDetail.percentage}%` }]} />
                      </View>
                    </>
                  )}

                  {ach.criteria.type === 'single_scenario_perfect_score' && (
                    <Text style={styles.badgeProgressLabel}>
                      Best Mission Score: {Object.values(progress.scenarioRecords || {}).reduce((max, r) => Math.max(max, r?.earnedXp || 0), 0)} / 350 XP (350 required on a single scenario)
                    </Text>
                  )}

                  {ach.criteria.type === 'mastery_legend' && (
                    <>
                      <Text style={styles.badgeProgressLabel}>
                        XP: {progress.totalXp.toLocaleString()} / 5,000 • Scenarios: {Math.min(16, progress.completedScenarios.length)} / 16
                      </Text>
                      <View style={styles.badgeProgressBarBg}>
                        <View style={[styles.badgeProgressBarFill, { width: `${progressDetail.percentage}%` }]} />
                      </View>
                    </>
                  )}
                </View>
              )}

              {/* Bottom Footer: Reward and Status */}
              <View style={styles.badgeFooter}>
                <View style={styles.rewardWrap}>
                  <Coins size={13} color={isUnlocked ? Colors.goldCoin : Colors.textMuted} />
                  <Text style={[styles.rewardText, !isUnlocked && styles.rewardTextLocked]}>
                    +{ach.coinReward} Eco Coins
                  </Text>
                </View>

                {isUnlocked ? (
                  <View style={styles.statusUnlockedWrap}>
                    <CheckCircle2 size={13} color={Colors.sustainableGreenLight} />
                    <Text style={styles.statusUnlockedText}>Unlocked</Text>
                  </View>
                ) : (
                  <View style={styles.statusLockedWrap}>
                    <Lock size={12} color={Colors.textMuted} />
                    <Text style={styles.statusLockedText}>Locked</Text>
                  </View>
                )}
              </View>
            </Card>
          );
        })}
      </View>

      {/* Navigation Shortcuts & Session Controls */}
      <View style={styles.actionsSection}>
        <Button
          title="Review Onboarding Tutorial"
          variant="secondary"
          size="md"
          onPress={() => router.push('/onboarding')}
          icon={<BookOpen size={18} color={Colors.cyanSoft} />}
          style={styles.actionBtn}
        />

        <Button
          title="About JalRakshak Project"
          variant="secondary"
          size="md"
          onPress={() => router.push('/modal')}
          icon={<Info size={18} color={Colors.cyanSoft} />}
          style={styles.actionBtn}
        />

        {user ? (
          <Button
            title="Sign Out of Account"
            variant="ghost"
            size="md"
            onPress={handleSignOut}
            icon={<LogOut size={18} color={Colors.warningOrange} />}
            textStyle={{ color: Colors.warningOrange }}
            style={styles.actionBtn}
          />
        ) : null}

        <Button
          title="Reset Local Progress"
          variant="ghost"
          size="sm"
          onPress={handleResetGuestData}
          icon={<RotateCcw size={16} color={Colors.dangerRed} />}
          textStyle={{ color: Colors.dangerRed }}
          style={styles.resetBtn}
        />
      </View>

      {/* Educational Achievement Certificate Viewer Modal */}
      <CertificateViewerModal
        visible={isCertModalOpen && canShowCertificate}
        onClose={() => setIsCertModalOpen(false)}
        certificateData={
          canShowCertificate
            ? certificateService.buildCertificateData(
                activeEligibility,
                displayName,
                user?.id || progress.guestId
              )
            : null
        }
      />
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
  profileCard: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.navyDark,
    borderWidth: 2,
    borderColor: Colors.turquoise,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginBottom: 4,
  },
  playerName: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.white,
  },
  playerRole: {
    fontSize: 12,
    color: Colors.turquoiseLight,
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.xs,
    backgroundColor: Colors.navyDark,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.navyCardBorder,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.navyDark,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.navyCardBorder,
  },
  loadingText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  gridBox: {
    flex: 1,
    alignItems: 'center',
  },
  gridLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  gridValue: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.white,
    marginVertical: 2,
  },
  gridSub: {
    fontSize: 9,
    color: Colors.cyanSoft,
  },
  syncCard: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  syncHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  syncStatusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  syncTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.white,
  },
  syncTextWrap: {
    flex: 1,
  },
  syncSubtitle: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  syncSubtitleError: {
    color: Colors.warningOrange,
  },
  authPromptCard: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
    backgroundColor: Colors.navy,
  },
  authPromptContent: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  authPromptIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.navyDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  authPromptTextWrap: {
    flex: 1,
  },
  authPromptTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
  },
  authPromptDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
    lineHeight: 16,
  },
  authPromptBtnRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  authPromptBtn: {
    flex: 1,
  },
  certCard: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  certHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  certHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  certTitleWrap: {
    flex: 1,
  },
  certTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
  },
  certSub: {
    fontSize: 11,
    color: Colors.turquoiseLight,
    marginTop: 1,
  },
  certExplanation: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 17,
    marginVertical: Spacing.xs,
  },
  progressBarContainer: {
    marginVertical: Spacing.sm,
  },
  progressBackground: {
    height: 8,
    backgroundColor: Colors.navyDark,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.navyCardBorder,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.sustainableGreen,
  },
  progressText: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 4,
    textAlign: 'right',
  },
  reqRow: {
    gap: 4,
    marginVertical: Spacing.xs,
  },
  reqItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reqText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  certActionWrap: {
    marginTop: Spacing.md,
  },
  viewCertBtn: {
    width: '100%',
  },
  certMissingWrap: {
    marginTop: Spacing.sm,
    backgroundColor: Colors.navyDark,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.navyCardBorder,
  },
  certMissingHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.warningOrange,
    marginBottom: 2,
  },
  certMissingItem: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginLeft: Spacing.xs,
    marginTop: 1,
  },
  certDisclaimer: {
    fontSize: 10,
    color: Colors.textMuted,
    fontStyle: 'italic',
    marginTop: Spacing.sm,
    lineHeight: 14,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
  },
  badgesList: {
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  badgeCard: {
    width: '100%',
    padding: Spacing.md,
  },
  badgeCardUnlocked: {
    borderColor: Colors.sustainableGreen,
  },
  badgeCardLocked: {
    borderColor: Colors.navyCardBorder,
    opacity: 0.9,
  },
  badgeTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  badgeIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeIconCircleUnlocked: {
    backgroundColor: 'rgba(46, 196, 182, 0.15)',
    borderWidth: 1,
    borderColor: Colors.sustainableGreen,
  },
  badgeIconCircleLocked: {
    backgroundColor: Colors.navyDark,
    borderWidth: 1,
    borderColor: Colors.navyCardBorder,
  },
  badgeHeaderWrap: {
    flex: 1,
  },
  badgeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.xs,
    marginBottom: 2,
  },
  badgeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.white,
    flex: 1,
  },
  badgeTitleLocked: {
    color: Colors.textPrimary,
  },
  badgeDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  badgeProgressWrap: {
    marginTop: Spacing.xs,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  badgeProgressLabel: {
    fontSize: 11,
    color: Colors.cyanSoft,
    marginBottom: 4,
    fontWeight: '600',
  },
  badgeProgressBarBg: {
    height: 6,
    backgroundColor: Colors.navyDark,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.navyCardBorder,
  },
  badgeProgressBarFill: {
    height: '100%',
    backgroundColor: Colors.turquoise,
  },
  badgeFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  rewardWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rewardText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.goldCoin,
  },
  rewardTextLocked: {
    color: Colors.textMuted,
  },
  statusUnlockedWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusUnlockedText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.sustainableGreenLight,
  },
  statusLockedWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusLockedText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  actionsSection: {
    gap: Spacing.sm,
  },
  actionBtn: {
    width: '100%',
  },
  resetBtn: {
    alignSelf: 'center',
    marginTop: Spacing.xs,
  },
});
