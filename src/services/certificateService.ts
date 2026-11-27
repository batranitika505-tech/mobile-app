/**
 * Educational Achievement Certificate Service
 * Milestone 4.4: JalRakshak Achievements & Certificates
 */

import { Share } from 'react-native';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { GuestProgress } from '../types/progress';
import type { CertificateData, CertificateEligibility } from '../types/certificate';

export const CERTIFICATE_CONSTANTS = {
  TARGET_XP: 3920,
  MAX_XP: 5600,
  REQUIRED_MODULES: ['drought', 'rainfall', 'contamination', 'agriculture'] as const,
  MODULE_TITLES: {
    drought: 'Drought Mitigation & Water Conservation',
    rainfall: 'Monsoon Harvesting & Aquifer Recharge',
    contamination: 'Groundwater Contamination & Filtration',
    agriculture: 'Sustainable Agriculture & Water Budgeting',
  } as Record<string, string>,
  MODULE_SCENARIOS: {
    drought: ['drought_1', 'drought_2', 'drought_3', 'drought_4'],
    rainfall: ['rainfall_1', 'rainfall_2', 'rainfall_3', 'rainfall_4'],
    contamination: ['contamination_1', 'contamination_2', 'contamination_3', 'contamination_4'],
    agriculture: ['agriculture_1', 'agriculture_2', 'agriculture_3', 'agriculture_4'],
  } as Record<string, string[]>,
};

export const certificateService = {
  /**
   * Calculates certificate eligibility for a guest session using locally stored progress.
   */
  calculateGuestEligibility(progress: GuestProgress): CertificateEligibility {
    const currentXp = progress.totalXp;
    const completedModuleIds = CERTIFICATE_CONSTANTS.REQUIRED_MODULES.filter((id) =>
      progress.completedModules.includes(id)
    );

    const missingRequirements: string[] = [];

    if (completedModuleIds.length < CERTIFICATE_CONSTANTS.REQUIRED_MODULES.length) {
      const remaining = CERTIFICATE_CONSTANTS.REQUIRED_MODULES.length - completedModuleIds.length;
      missingRequirements.push(
        `Complete ${remaining} more ${remaining === 1 ? 'module' : 'modules'} (${completedModuleIds.length}/4 completed)`
      );
    }

    if (currentXp < CERTIFICATE_CONSTANTS.TARGET_XP) {
      const deficit = CERTIFICATE_CONSTANTS.TARGET_XP - currentXp;
      missingRequirements.push(
        `Earn ${deficit.toLocaleString()} more XP (${currentXp.toLocaleString()} / ${CERTIFICATE_CONSTANTS.TARGET_XP.toLocaleString()} XP)`
      );
    }

    const isEligible =
      completedModuleIds.length === CERTIFICATE_CONSTANTS.REQUIRED_MODULES.length &&
      currentXp >= CERTIFICATE_CONSTANTS.TARGET_XP;

    return {
      isEligible,
      isVerified: false,
      currentXp,
      targetXp: CERTIFICATE_CONSTANTS.TARGET_XP,
      completedModulesCount: completedModuleIds.length,
      totalModulesCount: CERTIFICATE_CONSTANTS.REQUIRED_MODULES.length,
      completedModuleIds,
      missingRequirements,
      verificationStatus: 'local_guest',
      latestCompletedAt: progress.updatedAt,
    };
  },

  /**
   * Pure evaluation function that calculates certificate eligibility from a list of
   * verified score audit records.
   *
   * Validates both scenario_id and module_id:
   * A scenario counts toward a module ONLY when its scenario ID belongs to that module
   * AND its stored module_id matches.
   *
   * Calculates XP exclusively from earned_xp in verified records.
   */
  evaluateVerifiedRecords(
    records: Array<{
      scenario_id: string;
      module_id: string;
      earned_xp: number;
      completed_at?: string;
    }>
  ): CertificateEligibility {
    const verifiedXp = records.reduce((sum, r) => sum + (Number(r.earned_xp) || 0), 0);

    // A scenario counts toward a completed module only when its scenario ID belongs
    // to that module AND its stored module ID matches.
    const completedModuleIds = CERTIFICATE_CONSTANTS.REQUIRED_MODULES.filter((modId) => {
      const requiredScenarios = CERTIFICATE_CONSTANTS.MODULE_SCENARIOS[modId] || [];
      const verifiedScenariosForModule = new Set(
        records
          .filter((r) => r.module_id === modId && requiredScenarios.includes(r.scenario_id))
          .map((r) => r.scenario_id)
      );
      return requiredScenarios.every((sId) => verifiedScenariosForModule.has(sId));
    });

    const missingRequirements: string[] = [];

    if (completedModuleIds.length < CERTIFICATE_CONSTANTS.REQUIRED_MODULES.length) {
      const remaining = CERTIFICATE_CONSTANTS.REQUIRED_MODULES.length - completedModuleIds.length;
      missingRequirements.push(
        `Complete ${remaining} more verified ${remaining === 1 ? 'module' : 'modules'} (${completedModuleIds.length}/4 completed)`
      );
    }

    if (verifiedXp < CERTIFICATE_CONSTANTS.TARGET_XP) {
      const deficit = CERTIFICATE_CONSTANTS.TARGET_XP - verifiedXp;
      missingRequirements.push(
        `Earn ${deficit.toLocaleString()} more verified XP (${verifiedXp.toLocaleString()} / ${CERTIFICATE_CONSTANTS.TARGET_XP.toLocaleString()} XP)`
      );
    }

    const isEligible =
      completedModuleIds.length === CERTIFICATE_CONSTANTS.REQUIRED_MODULES.length &&
      verifiedXp >= CERTIFICATE_CONSTANTS.TARGET_XP;

    // Find the latest completion timestamp among verified records
    let latestCompletedAt: string | undefined;
    if (records.length > 0) {
      const timestamps = records
        .map((r) => r.completed_at)
        .filter(Boolean)
        .sort();
      latestCompletedAt = timestamps[timestamps.length - 1];
    }

    return {
      isEligible,
      isVerified: true,
      currentXp: verifiedXp,
      targetXp: CERTIFICATE_CONSTANTS.TARGET_XP,
      completedModulesCount: completedModuleIds.length,
      totalModulesCount: CERTIFICATE_CONSTANTS.REQUIRED_MODULES.length,
      completedModuleIds,
      missingRequirements,
      verificationStatus: 'server_verified',
      latestCompletedAt,
    };
  },

  /**
   * Authoritatively fetches certificate eligibility for an authenticated user
   * strictly from server-verified scenario audit records (public.verified_scores).
   *
   * 1. Explicitly retrieves the active authenticated user via supabase.auth.getUser().
   * 2. Rejects request with an explicit error if unauthenticated or lookup fails.
   * 3. Scopes verified_scores query with an explicit .eq('user_id', user.id) filter.
   * 4. Enforces RLS permissions where auth.uid() = user_id.
   * 5. Does NOT use client-controlled game_progress.total_xp or local IDs.
   * 6. Never falls back to unverified progress if the query fails.
   */
  async fetchAuthenticatedEligibility(): Promise<{
    success: boolean;
    data?: CertificateEligibility;
    error?: string;
  }> {
    if (!isSupabaseConfigured || !supabase) {
      return {
        success: false,
        error: 'Supabase client is not configured.',
      };
    }

    try {
      // 1. Authoritatively verify active Supabase user session
      const { data: authData, error: authError } = await supabase.auth.getUser();

      if (authError || !authData?.user?.id) {
        const authErrorMessage =
          authError?.message || 'No authenticated user session found.';
        console.warn(
          '[certificateService] Authentication lookup failed:',
          authErrorMessage
        );
        return {
          success: false,
          error: authErrorMessage,
        };
      }

      const activeUserId = authData.user.id;

      // 2. Query verified scores strictly scoped to the authoritative user ID
      const { data, error } = await supabase
        .from('verified_scores')
        .select('scenario_id, module_id, earned_xp, completed_at')
        .eq('user_id', activeUserId);

      if (error) {
        console.warn('[certificateService] Error querying verified_scores:', error.message);
        return {
          success: false,
          error: error.message || 'Failed to verify educational records',
        };
      }

      const records = data || [];
      const eligibility = this.evaluateVerifiedRecords(records);

      return {
        success: true,
        data: eligibility,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unexpected network error';
      console.warn('[certificateService] Exception in fetchAuthenticatedEligibility:', message);
      return {
        success: false,
        error: message,
      };
    }
  },

  /**
   * Constructs certificate display data from eligibility and user identity.
   *
   * Note on reference number:
   * The reference code is an in-app display reference for presentation, educational
   * tracking, and sharing purposes. It is derived from available session identity data,
   * verification status, and timestamp. It is explicitly a display reference and is NOT
   * claimed to be globally unique or cryptographically verifiable. No database table
   * or remote sequence is required.
   */
  buildCertificateData(
    eligibility: CertificateEligibility,
    displayName: string,
    userIdOrGuestId: string
  ): CertificateData {
    const rawDate = eligibility.latestCompletedAt
      ? new Date(eligibility.latestCompletedAt)
      : new Date();
    const issueDate = rawDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Derive a clean display reference from identity data, verification tier, and date
    const cleanSeed = (userIdOrGuestId || 'CADET')
      .replace(/[^a-zA-Z0-9]/g, '')
      .slice(-8)
      .toUpperCase() || 'CADET';
    const dateStamp = rawDate.toISOString().slice(0, 10).replace(/-/g, '');

    const prefix = eligibility.isVerified ? 'JR-VERIFIED' : 'JR-LOCAL';
    const referenceNumber = `${prefix}-${cleanSeed}-${dateStamp}`;

    // Derive completed module names strictly from eligibility.completedModuleIds
    const completedModuleNames = (eligibility.completedModuleIds || []).map(
      (modId) => CERTIFICATE_CONSTANTS.MODULE_TITLES[modId] || modId
    );

    return {
      recipientName: displayName.trim() || 'Cadet JalRakshak',
      referenceNumber,
      issueDate,
      earnedXp: eligibility.currentXp,
      maxPossibleXp: CERTIFICATE_CONSTANTS.MAX_XP,
      isVerified: eligibility.isVerified,
      verificationLabel: eligibility.isVerified
        ? 'Authoritative Server-Verified Records'
        : 'Local Device Session Records (Guest)',
      completedModuleNames,
    };
  },

  /**
   * Shares a formatted text summary of the certificate via React Native's native Share API.
   * Clearly presents all details without claiming to share an image or PDF.
   */
  async shareCertificateSummary(
    cert: CertificateData
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const moduleList =
        cert.completedModuleNames.length > 0
          ? cert.completedModuleNames.map((name, index) => `  ${index + 1}. ${name}`).join('\n')
          : '  (No modules completed)';

      const modulesHeader =
        cert.completedModuleNames.length === CERTIFICATE_CONSTANTS.REQUIRED_MODULES.length
          ? 'Has successfully completed all 4 core groundwater conservation training modules in the JalRakshak mobile curriculum:'
          : `Has completed ${cert.completedModuleNames.length} core groundwater conservation training module(s) in the JalRakshak mobile curriculum:`;

      const message =
        `🌊 JALRAKSHAK EDUCATIONAL ACHIEVEMENT CERTIFICATE 🌊\n\n` +
        `This is to certify that:\n` +
        `${cert.recipientName}\n\n` +
        `${modulesHeader}\n\n` +
        `${moduleList}\n\n` +
        `• Achievement Score: ${cert.earnedXp.toLocaleString()} / ${cert.maxPossibleXp.toLocaleString()} XP (70% of the required achievement XP threshold)\n` +
        `• Verification Status: ${cert.verificationLabel}\n` +
        `• Display Reference: ${cert.referenceNumber}\n` +
        `• Issue Date: ${cert.issueDate}\n\n` +
        `Educational Disclaimer:\n` +
        `This certificate is an educational milestone credential generated for the JalRakshak groundwater conservation learning application. It is not a government-issued certification, formal accreditation, or statutory qualification.`;

      const result = await Share.share({
        title: 'JalRakshak Educational Achievement Certificate',
        message,
      });

      return {
        success: result.action !== Share.dismissedAction,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sharing was cancelled or unavailable';
      return {
        success: false,
        error: message,
      };
    }
  },
};
