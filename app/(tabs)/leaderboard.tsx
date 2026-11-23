import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Award, Gamepad2, Globe2, ShieldCheck, Sparkles, Trophy, Users } from 'lucide-react-native';

import { Colors } from '../../src/constants/colors';
import { BorderRadius, Spacing } from '../../src/constants/layout';
import { Button } from '../../src/components/common/Button';
import { Card } from '../../src/components/common/Card';
import { Badge } from '../../src/components/common/Badge';

interface LeaderboardEntry {
  rank: number;
  name: string;
  state: string;
  xp: number;
  tier: string;
  isCurrentUser?: boolean;
}

const mockRankings: LeaderboardEntry[] = [
  { rank: 1, name: 'Sample: Aarav S.', state: 'Sample State A', xp: 2450, tier: 'Jal Nayak' },
  { rank: 2, name: 'Sample: Priya P.', state: 'Sample State B', xp: 2380, tier: 'Jal Nayak' },
  { rank: 3, name: 'Sample: Rohit V.', state: 'Sample State C', xp: 2190, tier: 'Jal Rakshak' },
  { rank: 4, name: 'Sample: Ananya I.', state: 'Sample State D', xp: 1980, tier: 'Jal Rakshak' },
  { rank: 5, name: 'Sample: Harpreet S.', state: 'Sample State E', xp: 1850, tier: 'Jal Mitra' },
  { rank: 6, name: 'You (Guest Preview)', state: 'Local Session', xp: 0, tier: 'Water Cadet', isCurrentUser: true },
];

export default function LeaderboardScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<'national' | 'regional'>('national');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top Banner */}
      <Card variant="highlight" style={styles.bannerCard}>
        <View style={styles.bannerRow}>
          <Trophy size={28} color={Colors.goldCoin} />
          <View style={styles.bannerText}>
            <Text style={styles.bannerTitle}>Leaderboard Layout Preview</Text>
            <Text style={styles.bannerSubtitle}>Sample Mock Standings (Preview Only)</Text>
          </View>
        </View>
        <Text style={styles.bannerDesc}>
          The rankings below are sample preview records to demonstrate leaderboard presentation.
          Real player standings and Supabase database synchronization will be activated in
          subsequent milestones.
        </Text>
      </Card>

      {/* Guest Mode Informational Callout */}
      <Card variant="outlined" style={styles.guestNoticeCard}>
        <View style={styles.noticeHeader}>
          <ShieldCheck size={16} color={Colors.turquoiseLight} />
          <Text style={styles.noticeTitle}>Sample Preview Data • Not Live Rankings</Text>
        </View>
        <Text style={styles.noticeText}>
          All entries below are simulated placeholder records for UI and responsiveness verification.
          No live leaderboard or real player accounts are connected in Milestone 1.
        </Text>
      </Card>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        <Button
          title="Sample: National View"
          variant={activeFilter === 'national' ? 'primary' : 'secondary'}
          size="sm"
          onPress={() => setActiveFilter('national')}
          icon={<Globe2 size={14} color={activeFilter === 'national' ? Colors.white : Colors.cyanSoft} />}
          style={styles.filterButton}
        />
        <Button
          title="Sample: State View"
          variant={activeFilter === 'regional' ? 'primary' : 'secondary'}
          size="sm"
          onPress={() => setActiveFilter('regional')}
          icon={<Users size={14} color={activeFilter === 'regional' ? Colors.white : Colors.cyanSoft} />}
          style={styles.filterButton}
        />
      </View>

      {/* Leaderboard Table */}
      <Card variant="default" style={styles.tableCard}>
        <View style={styles.tableHeader}>
          <Text style={[styles.colHeader, styles.colRank]}>#</Text>
          <Text style={[styles.colHeader, styles.colPlayer]}>Sample Player / Region</Text>
          <Text style={[styles.colHeader, styles.colTier]}>Tier</Text>
          <Text style={[styles.colHeader, styles.colXp]}>Sample XP</Text>
        </View>

        {mockRankings.map((entry) => (
          <View
            key={entry.rank}
            style={[
              styles.tableRow,
              entry.isCurrentUser && styles.currentUserRow,
            ]}>
            <View style={styles.colRank}>
              <Text
                style={[
                  styles.rankNumber,
                  entry.rank <= 3 && styles.topRankNumber,
                  entry.isCurrentUser && styles.currentUserText,
                ]}>
                {entry.rank}
              </Text>
            </View>

            <View style={styles.colPlayer}>
              <Text
                style={[
                  styles.playerName,
                  entry.isCurrentUser && styles.currentUserText,
                ]}>
                {entry.name}
              </Text>
              <Text style={styles.playerState}>{entry.state}</Text>
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
                    entry.isCurrentUser && styles.currentUserText,
                  ]}>
                  {entry.xp}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </Card>

      {/* CTA to Earn XP */}
      <View style={styles.ctaRow}>
        <Button
          title="Play Missions to Earn XP"
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
  noticeText: {
    fontSize: 12,
    color: Colors.textMuted,
    lineHeight: 16,
  },
  filterRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  filterButton: {
    flex: 1,
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
  playerState: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 1,
  },
  colTier: {
    width: 90,
    alignItems: 'center',
  },
  colXp: {
    width: 70,
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

