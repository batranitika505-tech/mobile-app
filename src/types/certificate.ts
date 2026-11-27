/**
 * Educational Achievement Certificate Type Definitions
 * Milestone 4.4: JalRakshak Achievements & Certificates
 */

export interface CertificateEligibility {
  /** Whether both conditions (4 modules + 3,920 XP) are fulfilled */
  isEligible: boolean;
  /** Whether the eligibility is derived from authoritative server-verified records */
  isVerified: boolean;
  /** Current eligible XP (verified XP for authenticated, local XP for guest) */
  currentXp: number;
  /** Target XP requirement (3,920 XP) */
  targetXp: number;
  /** Number of completed modules */
  completedModulesCount: number;
  /** Total required modules (4) */
  totalModulesCount: number;
  /** Array of completed canonical module IDs */
  completedModuleIds: string[];
  /** Detailed human-readable missing requirements */
  missingRequirements: string[];
  /** Clear verification status badge label */
  verificationStatus: 'server_verified' | 'local_guest' | 'error';
  /** Error message if authenticated fetch failed */
  errorMessage?: string;
  /** ISO timestamp of the latest completed scenario record */
  latestCompletedAt?: string;
}

export interface CertificateData {
  /** Recipient display name */
  recipientName: string;
  /** Reference code for record-keeping and educational sharing */
  referenceNumber: string;
  /** Formatted issue date string */
  issueDate: string;
  /** Earned XP (verified or local) */
  earnedXp: number;
  /** Maximum possible scenario XP (5,600) */
  maxPossibleXp: number;
  /** Whether this certificate is backed by server-verified records */
  isVerified: boolean;
  /** Label describing verification status clearly */
  verificationLabel: string;
  /** Full descriptive names of the completed modules */
  completedModuleNames: string[];
}
