import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  AlertCircle,
  Award,
  CheckCircle2,
  Gamepad2,
  Globe2,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Trophy,
  UserCheck,
  Users,
} from 'lucide-react-native';

import { Colors } from '../../src/constants/colors';
import { BorderRadius, Spacing } from '../../src/constants/layout';
import { Button } from '../../src/components/common/Button';
import { Card } from '../../src/components/common/Card';
import { Badge } from '../../src/components/common/Badge';
import { useGuestProgress } from '../../src/context/GuestProgressContext';
import { useAuth } from '../../src/context/AuthContext';
import { leaderboardService } from '../../src/services/leaderboardService';
import { LeaderboardEntryRow, MyLeaderboardRankResult } from '../../src/types/database';

export default function LeaderboardScreen() {
  const router = useRouter();
  const { progress } = useGuestProgress();
  const { user, isConfigured } = useAuth();

  const [activeFilter, setActiveFilter] = useState<'national' | 'regional'>('national');
  const [standings, setStandings] = useState<LeaderboardEntryRow[]>([]);
  const [myRank, setMyRank] = useState<MyLeaderboardRankResult>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [rankError, setRankError] = useState<string | null>(null);

  const loadLeaderboardData = useCallback(async () => {
    try {
      setErrorMessage(null);
      setRankError(null);

      // Fetch global leaderboard
      const leaderboardRes = await leaderboardService.fetchLeaderboard(50, 0);
      if (!leaderboardRes.success) {
        setErrorMessage(leaderboardRes.error || 'Unable to retrieve leaderboard standings.');
      } else {
        setStandings(leaderboardRes.data || []);
      }

      // If authenticated, fetch personal verified rank
      if (user?.id) {
        const rankRes = await leaderboardService.fetchMyLeaderboardRank();
        if (rankRes.success) {
          setMyRank(rankRes.data || null);
          setRankError(null);
        } else {
          setMyRank(null);
          setRankError(rankRes.error || 'Unable to retrieve personal rank.');
        }
      } else {
        setMyRank(null);
        setRankError(null);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to connect to leaderboard service.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadLeaderboardData();
  }, [loadLeaderboardData]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadLeaderboardData();
  };

  // Check if current authenticated user is already in top loaded standings
  const isUserInTopStandings = Boolean(
    user?.id && standings.some((entry) => entry.user_id === user.id)
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          tintColor={Colors.turquoiseLight}
          colors={[Colors.turquoise]}
        />
      }>
      {/* Top Banner */}
      <Card variant="highlight" style={styles.bannerCard}>
        <View style={styles.bannerRow}>
          <Trophy size={28} color={Colors.goldCoin} />
          <View style={styles.bannerText}>
            <Text style={styles.bannerTitle}>Official Water Guardians</Text>
            <Text style={styles.bannerSubtitle}>Verified Competitive Rankings</Text>
          </View>
        </View>
        <Text style={styles.bannerDesc}>
          Standings reflect authoritative competitive XP calculated and verified server-side via Supabase.
          Complete conservation scenarios to climb the leaderboard.
        </Text>
      </Card>

      {/* Guest Mode Informational Callout */}
      {!user?.id ? (
        <Card variant="outlined" style={styles.guestNoticeCard}>
          <View style={styles.noticeHeader}>
            <ShieldCheck size={16} color={Colors.warningOrange} />
            <Text style={styles.noticeTitleGuest}>Guest Session • Local Progress</Text>
          </View>
          <Text style={styles.noticeText}>
            You are playing as a guest with {progress.totalXp} local game XP. Local guest progress is saved
            on your device, but official competitive leaderboard rankings require an authenticated account.
          </Text>
          <Button
            title="Sign In / Register to Compete"
            variant="secondary"
            size="sm"
            onPress={() => router.push('/(tabs)/profile')}
            style={styles.signInButton}
          />
        </Card>
      ) : myRank ? (
        <Card variant="default" style={styles.myRankCard}>
          <View style={styles.myRankHeader}>
            <UserCheck size={18} color={Colors.turquoiseLight} />
            <Text style={styles.myRankTitle}>Your Verified Standing</Text>
          </View>
          <View style={styles.myRankRow}>
            <View style={styles.myRankBadgeWrap}>
              <Text style={styles.myRankNumber}>Rank #{myRank.rank}</Text>
              <Badge
                label={myRank.tier}
                variant={
                  myRank.tier === 'Jal Nayak'
                    ? 'warning'
                    : myRank.tier === 'Jal Rakshak'
                      ? 'turquoise'
                      : myRank.tier === 'Jal Mitra'
                        ? 'success'
                        : 'neutral'
                }
              />
            </View>
            <View style={styles.myRankStatsWrap}>
              <View style={styles.xpWrap}>
                <Sparkles size={14} color={Colors.turquoiseLight} />
                <Text style={styles.myRankXp}>{myRank.verified_xp} Verified XP</Text>
              </View>
              <Text style={styles.myRankScenarios}>
                {myRank.completed_scenarios_count} {myRank.completed_scenarios_count === 1 ? 'Mission' : 'Missions'} Completed
              </Text>
            </View>
          </View>
        </Card>
      ) : rankError ? (
        <Card variant="outlined" style={styles.noRankCard}>
          <View style={styles.noticeHeader}>
            <AlertCircle size={16} color={Colors.warningOrange} />
            <Text style={styles.noticeTitleGuest}>Personal Rank Unavailable</Text>
          </View>
          <Text style={styles.noticeText}>
            Could not verify your personal standing ({rankError}). Pull down to retry.
          </Text>
        </Card>
      ) : (
        <Card variant="outlined" style={styles.noRankCard}>
          <View style={styles.noticeHeader}>
            <ShieldCheck size={16} color={Colors.turquoiseLight} />
            <Text style={styles.noticeTitle}>Authenticated Guardian • No Verified XP Yet</Text>
          </View>
          <Text style={styles.noticeText}>
            You are signed in! Complete your first groundwater scenario while connected to earn verified
            competitive XP and secure your place on the official leaderboard.
          </Text>
        </Card>
      )}

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        <Button
          title="National View"
          variant={activeFilter === 'national' ? 'primary' : 'secondary'}
          size="sm"
          onPress={() => setActiveFilter('national')}
          icon={<Globe2 size={14} color={activeFilter === 'national' ? Colors.white : Colors.cyanSoft} />}
          style={styles.filterButton}
        />
        <Button
          title="Regional (Coming Soon)"
          variant={activeFilter === 'regional' ? 'primary' : 'secondary'}
          size="sm"
          onPress={() => setActiveFilter('regional')}
          icon={<Users size={14} color={activeFilter === 'regional' ? Colors.white : Colors.cyanSoft} />}
          style={styles.filterButton}
        />
      </View>

      {/* Regional View Placeholder */}
      {activeFilter === 'regional' ? (
        <Card variant="outlined" style={styles.placeholderCard}>
          <Users size={32} color={Colors.turquoiseLight} />
          <Text style={styles.placeholderTitle}>State & Regional Standings Coming Soon</Text>
          <Text style={styles.placeholderDesc}>
            Regional state-level and watershed district rankings will be activated in an upcoming release.
            Switch back to National View to view global standings.
          </Text>
          <Button
            title="View National Standings"
            variant="secondary"
            size="sm"
            onPress={() => setActiveFilter('national')}
            style={styles.placeholderButton}
          />
        </Card>
      ) : (
        <>
          {/* Loading State */}
          {isLoading && !isRefreshing ? (
            <Card variant="default" style={styles.loadingCard}>
              <ActivityIndicator size="large" color={Colors.turquoise} />
              <Text style={styles.loadingText}>Fetching live rankings...</Text>
            </Card>
          ) : errorMessage ? (
            /* Error State */
            <Card variant="outlined" style={styles.errorCard}>
              <AlertCircle size={28} color={Colors.warningOrange} />
              <Text style={styles.errorCardTitle}>Unable to Load Standings</Text>
              <Text style={styles.errorCardText}>{errorMessage}</Text>
              <Button
                title="Retry"
                variant="primary"
                size="sm"
                onPress={loadLeaderboardData}
                icon={<RefreshCw size={14} color={Colors.white} />}
                style={styles.retryButton}
              />
            </Card>
          ) : standings.length === 0 ? (
            /* Empty State */
            <Card variant="default" style={styles.emptyCard}>
              <Trophy size={36} color={Colors.goldCoin} />
              <Text style={styles.emptyTitle}>No Ranked Guardians Yet</Text>
              <Text style={styles.emptyDesc}>
                Be the first Water Guardian to complete a mission and claim Rank #1 on the national leaderboard!
              </Text>
            </Card>
          ) : (
            /* Leaderboard Table */
            <Card variant="default" style={styles.tableCard}>
              <View style={styles.tableHeader}>
                <Text style={[styles.colHeader, styles.colRank]}>#</Text>
                <Text style={[styles.colHeader, styles.colPlayer]}>Guardian</Text>
                <Text style={[styles.colHeader, styles.colTier]}>Tier</Text>
                <Text style={[styles.colHeader, styles.colXp]}>Verified XP</Text>
              </View>

              {standings.map((entry) => {
                const isCurrentUser = Boolean(user?.id && entry.user_id === user.id);

                return (
                  <View
                    key={`${entry.rank}-${entry.user_id}`}
                    style={[
                      styles.tableRow,
                      isCurrentUser && styles.currentUserRow,
                    ]}>
                    <View style={styles.colRank}>
                      <Text
                        style={[
                          styles.rankNumber,
                          entry.rank <= 3 && styles.topRankNumber,
                          isCurrentUser && styles.currentUserText,
                        ]}>
                        {entry.rank}
                      </Text>
                    </View>

                    <View style={styles.colPlayer}>
                      <Text
                        style={[
                          styles.playerName,
                          isCurrentUser && styles.currentUserText,
                        ]}>
                        {entry.display_name}
                      </Text>
                      <Text style={styles.playerMeta}>
                        {entry.completed_scenarios_count} {entry.completed_scenarios_count === 1 ? 'mission' : 'missions'}
                        {isCurrentUser ? ' • You' : ''}
                      </Text>
                    </View>

                    <View style={styles.colTier}>
                      <Badge
                        label={entry.tier}
                        variant={
                          entry.tier === 'Jal Nayak'
                            ? 'warning'
                            : entry.tier === 'Jal Rakshak'
                              ? 'turquoise'
                              : entry.tier === 'Jal Mitra'
                                ? 'success'
                                : 'neutral'
                        }
                      />
                    </View>

                    <View style={styles.colXp}>
                      <View style={styles.xpWrap}>
                        <Sparkles size={12} color={Colors.turquoiseLight} />
                        <Text
                          style={[
                            styles.xpValue,
                            isCurrentUser && styles.currentUserText,
                          ]}>
                          {entry.verified_xp}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </Card>
          )}
        </>
      )}

      {/* CTA to Earn XP */}
      <View style={styles.ctaRow}>
        <Button
          title="Play Missions to Climb Rankings"
          variant="primary"
          size="md"
          onPress={() => router.push('/(tabs)/game')}
          icon={<Gamepad2 size={18} color={Colors.white} />}
          style={styles.ctaButton}
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
    paddingBottom: Spacing.xl,
  },
  bannerCard: {
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  bannerText: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.white,
  },
  bannerSubtitle: {
    fontSize: 12,
    color: Colors.turquoiseLight,
    marginTop: 1,
  },
  bannerDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 17,
    marginTop: Spacing.xs,
  },
  guestNoticeCard: {
    padding: Spacing.sm + 4,
    marginBottom: Spacing.md,
    borderColor: 'rgba(247, 127, 0, 0.4)',
  },
  noticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  noticeTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.turquoiseLight,
  },
  noticeTitleGuest: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.warningOrange,
  },
  noticeText: {
    fontSize: 12,
    color: Colors.textMuted,
    lineHeight: 16,
  },
  signInButton: {
    marginTop: Spacing.sm,
  },
  myRankCard: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderColor: Colors.turquoise,
    borderWidth: 1,
    backgroundColor: 'rgba(0, 180, 216, 0.08)',
  },
  myRankHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.xs,
  },
  myRankTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.turquoiseLight,
  },
  myRankRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  myRankBadgeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  myRankNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.white,
  },
  myRankStatsWrap: {
    alignItems: 'flex-end',
  },
  myRankXp: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.turquoise,
  },
  myRankScenarios: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 1,
  },
  noRankCard: {
    padding: Spacing.sm + 4,
    marginBottom: Spacing.md,
  },
  filterRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  filterButton: {
    flex: 1,
  },
  placeholderCard: {
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  placeholderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  placeholderDesc: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 17,
    marginTop: Spacing.xs,
    marginBottom: Spacing.md,
  },
  placeholderButton: {
    minWidth: 180,
  },
  loadingCard: {
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  loadingText: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: Spacing.sm,
  },
  errorCard: {
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.md,
    borderColor: 'rgba(239, 71, 111, 0.4)',
  },
  errorCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.dangerRed,
    marginTop: Spacing.xs,
  },
  errorCardText: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 16,
    marginTop: 4,
    marginBottom: Spacing.md,
  },
  retryButton: {
    minWidth: 120,
  },
  emptyCard: {
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
    marginTop: Spacing.sm,
  },
  emptyDesc: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 17,
    marginTop: Spacing.xs,
  },
  tableCard: {
    padding: 0,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: Colors.navyCard,
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.navyCardBorder,
  },
  colHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm + 4,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.navyCardBorder,
  },
  currentUserRow: {
    backgroundColor: 'rgba(0, 180, 216, 0.12)',
    borderColor: Colors.turquoise,
    borderWidth: 1,
  },
  colRank: {
    width: 32,
  },
  rankNumber: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  topRankNumber: {
    color: Colors.goldCoin,
    fontSize: 15,
    fontWeight: '800',
  },
  colPlayer: {
    flex: 1,
    paddingRight: Spacing.xs,
  },
  playerName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.white,
  },
  playerMeta: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 1,
  },
  colTier: {
    width: 90,
    alignItems: 'center',
  },
  colXp: {
    width: 76,
    alignItems: 'flex-end',
  },
  xpWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  xpValue: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.cyanSoft,
  },
  currentUserText: {
    color: Colors.turquoise,
    fontWeight: '800',
  },
  ctaRow: {
    marginTop: Spacing.xs,
  },
  ctaButton: {
    width: '100%',
  },
});
