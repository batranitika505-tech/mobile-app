import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowRight,
  CheckCircle,
  CloudRain,
  Compass,
  Droplet,
  Flame,
  Sprout,
} from 'lucide-react-native';

import { Colors } from '../src/constants/colors';
import { BorderRadius, Spacing } from '../src/constants/layout';
import { Button } from '../src/components/common/Button';
import { Card } from '../src/components/common/Card';
import { Badge } from '../src/components/common/Badge';

interface OnboardingSlide {
  id: string;
  moduleTitle: string;
  headline: string;
  description: string;
  bulletPoints: string[];
  icon: React.ReactNode;
  badgeLabel: string;
  badgeVariant: 'primary' | 'turquoise' | 'success' | 'warning' | 'danger';
}

const slides: OnboardingSlide[] = [
  {
    id: 'drought',
    moduleTitle: 'Module 1: Drought Crisis',
    headline: 'Protect Declining Aquifers Under Water Scarcity',
    description:
      'Experience severe drought conditions and manage rapidly dropping groundwater tables. Learn to curb excessive extraction and shift to water-efficient techniques.',
    bulletPoints: [
      'Implement precision drip irrigation over flood watering.',
      'Adopt drought-tolerant and diversified crops.',
      'Regulate extraction borewells to prevent total aquifer collapse.',
    ],
    icon: <Flame size={40} color={Colors.warningOrange} />,
    badgeLabel: 'Scarcity Management',
    badgeVariant: 'warning',
  },
  {
    id: 'rainfall',
    moduleTitle: 'Module 2: Rainfall Opportunity',
    headline: 'Harness Monsoon Surpluses via Artificial Recharge',
    description:
      'Monsoon runoffs often go to waste as flash floods. Deploy engineering recharge structures to direct rainwater directly back into subterranean aquifers.',
    bulletPoints: [
      'Construct percolation tanks, check dams, and recharge shafts.',
      'Implement community rainwater harvesting systems.',
      'Replenish shallow and deep water tables before the dry season.',
    ],
    icon: <CloudRain size={40} color={Colors.turquoise} />,
    badgeLabel: 'Water Harvesting',
    badgeVariant: 'turquoise',
  },
  {
    id: 'contamination',
    moduleTitle: 'Module 3: Contamination Crisis',
    headline: 'Safeguard Water Quality & Prevent Pollution',
    description:
      'Groundwater is susceptible to industrial effluents, agricultural nitrates, and chemical leaching. Detect contaminants and restore drinking water safety.',
    bulletPoints: [
      'Locate pollution sources and perform water testing.',
      'Eliminate untreated sewage and agrochemical runoff.',
      'Maintain community filter units and buffer zones.',
    ],
    icon: <Droplet size={40} color={Colors.dangerRed} />,
    badgeLabel: 'Quality Control',
    badgeVariant: 'danger',
  },
  {
    id: 'agriculture',
    moduleTitle: 'Module 4: Smart Agriculture',
    headline: 'Optimize Farm Irrigation with Precision Tech',
    description:
      'Agriculture accounts for over 80% of groundwater consumption. Adopt smart irrigation sensors and water budgeting to maximize crop yield per drop.',
    bulletPoints: [
      'Shift away from water-guzzling crops in critical blocks.',
      'Schedule irrigation using soil moisture indicators.',
      'Achieve sustainable agricultural prosperity.',
    ],
    icon: <Sprout size={40} color={Colors.sustainableGreen} />,
    badgeLabel: 'Micro-Irrigation',
    badgeVariant: 'success',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const isLastSlide = currentSlideIndex === slides.length - 1;
  const currentSlide = slides[currentSlideIndex];

  const handleNext = () => {
    if (isLastSlide) {
      router.replace('/(tabs)');
    } else {
      setCurrentSlideIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <View style={styles.headerLeft}>
          <Compass size={18} color={Colors.turquoiseLight} />
          <Text style={styles.headerTitle}>JalRakshak Academy</Text>
        </View>
        <Button
          title="Skip"
          variant="ghost"
          size="sm"
          onPress={handleSkip}
          textStyle={styles.skipText}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Slide Counter Dots */}
        <View style={styles.dotsRow}>
          {slides.map((slide, index) => (
            <View
              key={slide.id}
              style={[
                styles.dot,
                index === currentSlideIndex ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>

        {/* Slide Badge */}
        <View style={styles.slideBadgeRow}>
          <Badge
            label={currentSlide.badgeLabel}
            variant={currentSlide.badgeVariant}
            icon={currentSlide.icon}
          />
        </View>

        {/* Module Header Card */}
        <Card variant="highlight" style={styles.slideCard}>
          <Text style={styles.moduleSubhead}>{currentSlide.moduleTitle}</Text>
          <Text style={styles.slideHeadline}>{currentSlide.headline}</Text>
          <Text style={styles.slideDescription}>{currentSlide.description}</Text>

          {/* Educational Bullet Points */}
          <View style={styles.bulletsSection}>
            <Text style={styles.bulletsHeader}>Key Competencies:</Text>
            {currentSlide.bulletPoints.map((point, index) => (
              <View key={index} style={styles.bulletRow}>
                <CheckCircle size={16} color={Colors.sustainableGreen} style={styles.bulletIcon} />
                <Text style={styles.bulletText}>{point}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Project Purpose Callout */}
        <Card variant="outlined" style={styles.infoCallout}>
          <Text style={styles.calloutText}>
            Every scenario in JalRakshak is designed as an educational simulation of practical
            groundwater conservation and artificial recharge techniques.
          </Text>
        </Card>
      </ScrollView>

      {/* Bottom Navigation Controls */}
      <View style={styles.bottomControls}>
        {currentSlideIndex > 0 ? (
          <Button
            title="Previous"
            variant="secondary"
            size="md"
            onPress={handlePrev}
            style={styles.backButton}
          />
        ) : (
          <View style={styles.backPlaceholder} />
        )}

        <Button
          title={isLastSlide ? 'Enter Dashboard' : 'Next Module'}
          variant="primary"
          size="md"
          onPress={handleNext}
          icon={isLastSlide ? undefined : <ArrowRight size={18} color={Colors.white} />}
          iconPosition="right"
          style={styles.nextButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.navyDark,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.navyCardBorder,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.white,
    marginLeft: Spacing.xs,
  },
  skipText: {
    color: Colors.turquoiseLight,
    fontSize: 13,
  },
  scrollContent: {
    padding: Spacing.md,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: Spacing.sm,
    gap: Spacing.xs + 2,
  },
  dot: {
    height: 8,
    borderRadius: BorderRadius.full,
  },
  activeDot: {
    width: 28,
    backgroundColor: Colors.turquoise,
  },
  inactiveDot: {
    width: 8,
    backgroundColor: Colors.navyCardBorder,
  },
  slideBadgeRow: {
    alignItems: 'center',
    marginVertical: Spacing.sm,
  },
  slideCard: {
    padding: Spacing.lg,
    marginVertical: Spacing.sm,
  },
  moduleSubhead: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.turquoise,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  slideHeadline: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.white,
    marginTop: Spacing.xs,
    marginBottom: Spacing.sm,
    lineHeight: 28,
  },
  slideDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  bulletsSection: {
    borderTopWidth: 1,
    borderTopColor: Colors.navyCardBorder,
    paddingTop: Spacing.md,
  },
  bulletsHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.cyanSoft,
    marginBottom: Spacing.sm,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  bulletIcon: {
    marginTop: 2,
    marginRight: Spacing.sm,
  },
  bulletText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textPrimary,
    lineHeight: 18,
  },
  infoCallout: {
    padding: Spacing.md,
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  calloutText: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
  bottomControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.navy,
    borderTopWidth: 1,
    borderTopColor: Colors.navyCardBorder,
    gap: Spacing.md,
  },
  backButton: {
    flex: 1,
  },
  backPlaceholder: {
    flex: 1,
  },
  nextButton: {
    flex: 2,
  },
});

