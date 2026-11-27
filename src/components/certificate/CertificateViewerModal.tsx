/**
 * Educational Achievement Certificate Viewer Modal
 * Milestone 4.4: JalRakshak Achievements & Certificates
 */

import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from 'react-native-svg';
import {
  CheckCircle2,
  FileCheck2,
  Share2,
  ShieldCheck,
  X,
} from 'lucide-react-native';

import { Colors } from '../../constants/colors';
import { BorderRadius, Spacing } from '../../constants/layout';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { CertificateData } from '../../types/certificate';
import { certificateService } from '../../services/certificateService';

interface CertificateViewerModalProps {
  visible: boolean;
  onClose: () => void;
  certificateData: CertificateData | null;
}

export const CertificateViewerModal: React.FC<CertificateViewerModalProps> = ({
  visible,
  onClose,
  certificateData,
}) => {
  const [isSharing, setIsSharing] = useState<boolean>(false);

  if (!certificateData) {
    return null;
  }

  const handleShare = async () => {
    try {
      setIsSharing(true);
      const res = await certificateService.shareCertificateSummary(certificateData);
      if (!res.success && res.error) {
        Alert.alert('Notice', res.error);
      }
    } catch {
      Alert.alert('Sharing Notice', 'Unable to open sharing sheet at this time.');
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header Bar */}
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderTitleRow}>
              <FileCheck2 size={20} color={Colors.turquoise} />
              <Text style={styles.modalHeaderTitle}>Certificate Viewer</Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              accessibilityLabel="Close Certificate Viewer"
            >
              <X size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Certificate Frame */}
            <View style={styles.certificateFrame}>
              {/* Decorative SVG Header & Border */}
              <Svg
                height="80"
                width="100%"
                viewBox="0 0 340 80"
                style={styles.svgBackground}
              >
                <Defs>
                  <LinearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <Stop offset="0%" stopColor="#0077B6" stopOpacity="0.4" />
                    <Stop offset="50%" stopColor="#00B4D8" stopOpacity="0.6" />
                    <Stop offset="100%" stopColor="#2EC4B6" stopOpacity="0.4" />
                  </LinearGradient>
                  <LinearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <Stop offset="0%" stopColor="#FFD166" />
                    <Stop offset="100%" stopColor="#F4A261" />
                  </LinearGradient>
                </Defs>

                {/* Top Corner Ribbons */}
                <Rect x="0" y="0" width="340" height="80" fill="url(#waterGrad)" rx="8" />
                <Circle cx="170" cy="40" r="32" fill="#0B132B" stroke="#00B4D8" strokeWidth="2" />
                {/* Water Droplet Graphic */}
                <Path
                  d="M 170 20 C 170 20 156 38 156 46 A 14 14 0 0 0 184 46 C 184 38 170 20 170 20 Z"
                  fill="url(#goldGrad)"
                />
              </Svg>

              <View style={styles.certificateBody}>
                {/* Official Branding */}
                <Text style={styles.orgLabel}>JALRAKSHAK · LEARN. PLAY. CONSERVE.</Text>
                <Text style={styles.certMainTitle}>Educational Achievement Certificate</Text>
                <Text style={styles.certTopicSubtitle}>
                  Foundational Groundwater Conservation & Watershed Management
                </Text>

                <View style={styles.dividerLine} />

                {/* Awarded To */}
                <Text style={styles.presentText}>This is proudly presented to</Text>
                <Text style={styles.recipientName}>{certificateData.recipientName}</Text>

                <Text style={styles.citationText}>
                  For successfully completing all four JalRakshak groundwater conservation
                  learning modules and meeting the application's educational XP achievement threshold.
                </Text>

                {/* Curriculum Modules Completed */}
                <View style={styles.modulesCompletedBox}>
                  <Text style={styles.modulesHeader}>Completed Training Modules:</Text>
                  {certificateData.completedModuleNames.map((modName, index) => (
                    <View key={index} style={styles.moduleItemRow}>
                      <CheckCircle2 size={14} color={Colors.sustainableGreenLight} />
                      <Text style={styles.moduleItemText}>{modName}</Text>
                    </View>
                  ))}
                </View>

                {/* Verified Score & Credential Specs */}
                <View style={styles.specsGrid}>
                  <View style={styles.specBox}>
                    <Text style={styles.specLabel}>ACHIEVEMENT SCORE</Text>
                    <Text style={styles.specValue}>
                      {certificateData.earnedXp.toLocaleString()} / {certificateData.maxPossibleXp.toLocaleString()} XP
                    </Text>
                    <Badge
                      label="Achievement Threshold Met"
                      variant="success"
                      style={styles.specBadge}
                    />
                  </View>

                  <View style={styles.specDivider} />

                  <View style={styles.specBox}>
                    <Text style={styles.specLabel}>ACHIEVEMENT DATE</Text>
                    <Text style={styles.specValue}>{certificateData.issueDate}</Text>
                    <Badge
                      label={certificateData.isVerified ? 'VERIFIED' : 'LOCAL SESSION'}
                      variant={certificateData.isVerified ? 'turquoise' : 'neutral'}
                      style={styles.specBadge}
                    />
                  </View>
                </View>

                {/* Verification Notice Banner */}
                <View style={styles.verificationBanner}>
                  <ShieldCheck
                    size={16}
                    color={certificateData.isVerified ? Colors.turquoise : Colors.cyanSoft}
                  />
                  <Text style={styles.verificationBannerText}>
                    Status: {certificateData.verificationLabel}
                  </Text>
                </View>

                {/* Certificate Serial Reference */}
                <View style={styles.referenceContainer}>
                  <Text style={styles.referenceLabel}>CERTIFICATE REFERENCE CODE:</Text>
                  <Text style={styles.referenceCode}>{certificateData.referenceNumber}</Text>
                </View>

                {/* Statutory / Educational Disclaimer */}
                <Text style={styles.disclaimerText}>
                  Notice: This certificate is an educational learning credential generated by the
                  JalRakshak mobile educational platform. It is not an official government certification,
                  statutory license, or accredited academic degree.
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.modalFooter}>
            <Button
              title={isSharing ? 'Sharing...' : 'Share Certificate Summary'}
              variant="primary"
              size="md"
              onPress={handleShare}
              icon={<Share2 size={16} color={Colors.white} />}
              style={styles.shareButton}
            />
            <Button
              title="Close"
              variant="secondary"
              size="md"
              onPress={onClose}
              style={styles.closeModalButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 10, 24, 0.85)',
    justifyContent: 'center',
    padding: Spacing.sm,
  },
  modalContainer: {
    maxHeight: '92%',
    backgroundColor: Colors.navyDark,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: Colors.navyCardBorder,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.navyLight,
    borderBottomWidth: 1,
    borderBottomColor: Colors.navyCardBorder,
  },
  modalHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  modalHeaderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
  },
  closeButton: {
    padding: 6,
    borderRadius: BorderRadius.sm,
  },
  scrollArea: {
    flexGrow: 0,
  },
  scrollContent: {
    padding: Spacing.md,
  },
  certificateFrame: {
    backgroundColor: Colors.navyCard,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: Colors.turquoise,
    overflow: 'hidden',
  },
  svgBackground: {
    width: '100%',
  },
  certificateBody: {
    padding: Spacing.md,
    alignItems: 'center',
  },
  orgLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.goldCoin,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  certMainTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.white,
    textAlign: 'center',
    lineHeight: 24,
  },
  certTopicSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.turquoiseLight,
    textAlign: 'center',
    marginTop: 2,
    marginBottom: Spacing.sm,
  },
  dividerLine: {
    width: '60%',
    height: 1.5,
    backgroundColor: Colors.turquoise,
    marginVertical: Spacing.xs,
    opacity: 0.6,
  },
  presentText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginTop: Spacing.xs,
  },
  recipientName: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.white,
    textAlign: 'center',
    marginVertical: 4,
    letterSpacing: 0.5,
  },
  citationText: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
    marginVertical: Spacing.xs,
    paddingHorizontal: Spacing.xs,
  },
  modulesCompletedBox: {
    width: '100%',
    backgroundColor: Colors.navyDark,
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
    marginVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(0, 180, 216, 0.25)',
  },
  modulesHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.cyanSoft,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  moduleItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginVertical: 2,
  },
  moduleItemText: {
    fontSize: 11,
    color: Colors.textPrimary,
    flex: 1,
  },
  specsGrid: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: Colors.navyDark,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    marginVertical: Spacing.xs,
    alignItems: 'center',
  },
  specBox: {
    flex: 1,
    alignItems: 'center',
  },
  specDivider: {
    width: 1,
    height: '80%',
    backgroundColor: Colors.navyCardBorder,
  },
  specLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  specValue: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.white,
    marginTop: 2,
  },
  specBadge: {
    marginTop: 4,
  },
  verificationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  verificationBannerText: {
    fontSize: 11,
    color: Colors.cyanSoft,
    fontWeight: '600',
    textAlign: 'center',
  },
  referenceContainer: {
    alignItems: 'center',
    marginVertical: Spacing.xs,
  },
  referenceLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  referenceCode: {
    fontSize: 12,
    fontFamily: 'monospace',
    fontWeight: '800',
    color: Colors.goldCoin,
    letterSpacing: 1,
    marginTop: 1,
  },
  disclaimerText: {
    fontSize: 9,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 13,
    fontStyle: 'italic',
    marginTop: Spacing.xs,
  },
  modalFooter: {
    padding: Spacing.md,
    backgroundColor: Colors.navyLight,
    borderTopWidth: 1,
    borderTopColor: Colors.navyCardBorder,
    gap: Spacing.xs,
  },
  shareButton: {
    width: '100%',
  },
  closeModalButton: {
    width: '100%',
  },
});
