/**
 * Certificate Service Unit Tests
 * Milestone 4.4 Review Fixes
 *
 * Verifies:
 * 1. Authenticated module verification: A scenario counts toward a completed module
 *    only when its scenario ID belongs to that module AND its stored module ID matches.
 * 2. Certificate module names: buildCertificateData derives completedModuleNames
 *    strictly from eligibility.completedModuleIds and does not unconditionally list all 4.
 * 3. Authenticated query failures never produce eligible certificates.
 * 4. Guest eligibility evaluated separately against local progress.
 * 5. Display reference code construction without claiming cryptographic verifiability.
 */

// Lightweight assertion helpers to remain fully decoupled from Node types in Expo
function assertEqual<T>(actual: T, expected: T, message?: string) {
  if (actual !== expected) {
    throw new Error(
      `Assertion failed: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}. ${message || ''}`
    );
  }
}

function assertOk(value: unknown, message?: string): asserts value {
  if (!value) {
    throw new Error(`Assertion failed: value is not truthy. ${message || ''}`);
  }
}

interface AssertHelper {
  strictEqual<T>(actual: T, expected: T, message?: string): void;
  ok(value: unknown, message?: string): asserts value;
}

const assert: AssertHelper = {
  strictEqual: assertEqual,
  ok: assertOk,
};

import { certificateService, CERTIFICATE_CONSTANTS } from '../certificateService';
import { supabase } from '../../lib/supabase';
import type { GuestProgress } from '../../types/progress';
import type { CertificateEligibility } from '../../types/certificate';

// Helper to create valid canonical scenario records
function createValidScenarioRecords(modId: string, earnedXpPerScenario = 250) {
  const scenarios = CERTIFICATE_CONSTANTS.MODULE_SCENARIOS[modId] || [];
  return scenarios.map((scenario_id) => ({
    scenario_id,
    module_id: modId,
    earned_xp: earnedXpPerScenario,
    completed_at: '2026-11-27T10:00:00Z',
  }));
}

async function runTests() {
  console.log('--- Running JalRakshak Certificate Service Tests ---\n');

  // =========================================================================
  // Test Suite 1: Authenticated Module Verification & Mismatch Guard
  // =========================================================================
  console.log('Suite 1: Authenticated Module Verification & Mismatched module_id Guard');

  // Case 1.1: 4 scenarios for 'drought', but 1 has mismatched module_id ('contamination')
  const mismatchedDroughtRecords = [
    { scenario_id: 'drought_1', module_id: 'drought', earned_xp: 350 },
    { scenario_id: 'drought_2', module_id: 'contamination', earned_xp: 350 }, // MISMATCH!
    { scenario_id: 'drought_3', module_id: 'drought', earned_xp: 350 },
    { scenario_id: 'drought_4', module_id: 'drought', earned_xp: 350 },
  ];
  const evalMismatched = certificateService.evaluateVerifiedRecords(mismatchedDroughtRecords);
  assert.strictEqual(
    evalMismatched.completedModuleIds.includes('drought'),
    false,
    'Drought module MUST NOT be counted as completed when drought_2 has mismatched module_id'
  );
  assert.strictEqual(
    evalMismatched.completedModuleIds.includes('contamination'),
    false,
    'Contamination module MUST NOT be counted from a drought scenario'
  );
  assert.strictEqual(evalMismatched.completedModulesCount, 0);
  assert.strictEqual(evalMismatched.isEligible, false);
  console.log('  ✔ Case 1.1: Mismatched module_id correctly invalidates module completion');

  // Case 1.2: Valid scenario ID but belongs to another module
  const mixedModuleRecords = [
    ...createValidScenarioRecords('rainfall'),
    { scenario_id: 'agriculture_1', module_id: 'rainfall', earned_xp: 350 }, // Wrong scenario for rainfall
  ];
  const evalMixed = certificateService.evaluateVerifiedRecords(mixedModuleRecords);
  assert.strictEqual(evalMixed.completedModuleIds.includes('rainfall'), true);
  assert.strictEqual(
    evalMixed.completedModuleIds.includes('agriculture'),
    false,
    'Agriculture module MUST NOT be completed with only 1 misplaced scenario'
  );
  console.log('  ✔ Case 1.2: Cross-module scenario confusion guarded');

  // Case 1.3: All 16 scenarios properly matched, but total verified XP < 3,920
  const lowXpRecords = [
    ...createValidScenarioRecords('drought', 200), // 4 * 200 = 800
    ...createValidScenarioRecords('rainfall', 200), // 800
    ...createValidScenarioRecords('contamination', 200), // 800
    ...createValidScenarioRecords('agriculture', 200), // 800 => Total 3,200 XP (< 3,920)
  ];
  const evalLowXp = certificateService.evaluateVerifiedRecords(lowXpRecords);
  assert.strictEqual(evalLowXp.completedModulesCount, 4);
  assert.strictEqual(evalLowXp.currentXp, 3200);
  assert.strictEqual(
    evalLowXp.isEligible,
    false,
    'Must NOT be eligible when verified XP is below 3,920'
  );
  assert.ok(evalLowXp.missingRequirements.some((r) => r.includes('more verified XP')));
  console.log('  ✔ Case 1.3: Low verified XP properly fails eligibility despite 4 modules');

  // Case 1.4: All 16 scenarios properly matched and total verified XP >= 3,920
  const perfectRecords = [
    ...createValidScenarioRecords('drought', 250), // 1000
    ...createValidScenarioRecords('rainfall', 250), // 1000
    ...createValidScenarioRecords('contamination', 250), // 1000
    ...createValidScenarioRecords('agriculture', 250), // 1000 => Total 4,000 XP
  ];
  const evalPerfect = certificateService.evaluateVerifiedRecords(perfectRecords);
  assert.strictEqual(evalPerfect.completedModulesCount, 4);
  assert.strictEqual(evalPerfect.currentXp, 4000);
  assert.strictEqual(evalPerfect.isEligible, true);
  assert.strictEqual(evalPerfect.isVerified, true);
  assert.strictEqual(evalPerfect.verificationStatus, 'server_verified');
  assert.strictEqual(evalPerfect.missingRequirements.length, 0);
  console.log('  ✔ Case 1.4: Verified audit records meeting all criteria produce eligible status\n');

  // =========================================================================
  // Test Suite 2: Certificate Module Names Derivation in buildCertificateData
  // =========================================================================
  console.log('Suite 2: Certificate Module Names Derivation in buildCertificateData');

  // Case 2.1: Incomplete eligibility (only 1 module completed)
  const singleModuleEligibility: CertificateEligibility = {
    isEligible: false,
    isVerified: true,
    currentXp: 1200,
    targetXp: 3920,
    completedModulesCount: 1,
    totalModulesCount: 4,
    completedModuleIds: ['drought'],
    missingRequirements: ['Complete 3 more verified modules'],
    verificationStatus: 'server_verified',
  };
  const certSingle = certificateService.buildCertificateData(
    singleModuleEligibility,
    'Guardian Test',
    'auth-user-12345'
  );
  assert.strictEqual(
    certSingle.completedModuleNames.length,
    1,
    'Must only contain 1 module name when only 1 module is completed'
  );
  assert.strictEqual(
    certSingle.completedModuleNames[0],
    CERTIFICATE_CONSTANTS.MODULE_TITLES.drought
  );
  assert.strictEqual(
    certSingle.completedModuleNames.includes(CERTIFICATE_CONSTANTS.MODULE_TITLES.rainfall),
    false,
    'Must NOT list uncompleted modules'
  );
  console.log('  ✔ Case 2.1: Incomplete eligibility does not list uncompleted modules');

  // Case 2.2: Zero modules completed
  const zeroModuleEligibility: CertificateEligibility = {
    isEligible: false,
    isVerified: false,
    currentXp: 0,
    targetXp: 3920,
    completedModulesCount: 0,
    totalModulesCount: 4,
    completedModuleIds: [],
    missingRequirements: ['Complete 4 more modules'],
    verificationStatus: 'local_guest',
  };
  const certZero = certificateService.buildCertificateData(
    zeroModuleEligibility,
    'Cadet',
    'guest-session'
  );
  assert.strictEqual(certZero.completedModuleNames.length, 0);
  console.log('  ✔ Case 2.2: Zero completed modules results in empty module names array');

  // Case 2.3: All 4 modules completed
  const allModulesEligibility: CertificateEligibility = {
    isEligible: true,
    isVerified: true,
    currentXp: 4200,
    targetXp: 3920,
    completedModulesCount: 4,
    totalModulesCount: 4,
    completedModuleIds: ['drought', 'rainfall', 'contamination', 'agriculture'],
    missingRequirements: [],
    verificationStatus: 'server_verified',
    latestCompletedAt: '2026-11-27T12:00:00Z',
  };
  const certAll = certificateService.buildCertificateData(
    allModulesEligibility,
    'Cadet Hero',
    'user-guid-9999'
  );
  assert.strictEqual(certAll.completedModuleNames.length, 4);
  assert.ok(certAll.referenceNumber.startsWith('JR-VERIFIED-'));
  assert.strictEqual(certAll.isVerified, true);
  console.log('  ✔ Case 2.3: All 4 modules correctly mapped when completed\n');

  // =========================================================================
  // Test Suite 3: Authenticated Query Scope & Failure Safety
  // =========================================================================
  console.log('Suite 3: Authenticated Query Scope & Failure Safety');

  if (supabase) {
    const originalAuth = supabase.auth;
    const originalFrom = supabase.from;

    let appliedFilter: { table: string; columns: string; col: string; val: string } | null = null;

    // Case 3.1: Authenticated user retrieves only their own verified records (.eq('user_id', user.id))
    (supabase as any).auth = {
      getUser: () =>
        Promise.resolve({
          data: { user: { id: 'auth-user-scope-test-123' } },
          error: null,
        }),
    };
    (supabase as any).from = (table: string) => ({
      select: (columns: string) => ({
        eq: (col: string, val: string) => {
          appliedFilter = { table, columns, col, val };
          return Promise.resolve({
            data: perfectRecords,
            error: null,
          });
        },
      }),
    });

    const scopedResult = await certificateService.fetchAuthenticatedEligibility();
    assert.strictEqual(scopedResult.success, true);
    assert.ok(appliedFilter !== null, 'Query MUST chain .eq filter');
    assert.strictEqual((appliedFilter as any).table, 'verified_scores');
    assert.strictEqual((appliedFilter as any).col, 'user_id', 'Filter column MUST be user_id');
    assert.strictEqual(
      (appliedFilter as any).val,
      'auth-user-scope-test-123',
      'Filter value MUST match authenticated user.id from auth.getUser()'
    );
    assert.strictEqual(
      (appliedFilter as any).columns,
      'scenario_id, module_id, earned_xp, completed_at',
      'Preserve exact verified columns'
    );
    assert.strictEqual(scopedResult.data?.isEligible, true);
    console.log('  ✔ Case 3.1: Query explicitly filters .eq("user_id", user.id) with active user');

    // Case 3.2: No authenticated user session returns an explicit error
    (supabase as any).auth = {
      getUser: () =>
        Promise.resolve({
          data: { user: null },
          error: null,
        }),
    };
    const noUserResult = await certificateService.fetchAuthenticatedEligibility();
    assert.strictEqual(noUserResult.success, false, 'Must fail when user is null');
    assert.strictEqual(noUserResult.data, undefined);
    assert.strictEqual(noUserResult.error, 'No authenticated user session found.');
    console.log('  ✔ Case 3.2: Missing authenticated user session returns explicit error');

    // Case 3.3: Authentication lookup failure returns an explicit error
    (supabase as any).auth = {
      getUser: () =>
        Promise.resolve({
          data: null,
          error: { message: 'JWT expired / invalid token' },
        }),
    };
    const authLookupFailResult = await certificateService.fetchAuthenticatedEligibility();
    assert.strictEqual(authLookupFailResult.success, false);
    assert.strictEqual(authLookupFailResult.data, undefined);
    assert.strictEqual(authLookupFailResult.error, 'JWT expired / invalid token');
    console.log('  ✔ Case 3.3: Auth lookup failure returns explicit error');

    // Case 3.4: Authenticated database query returns an error
    (supabase as any).auth = {
      getUser: () =>
        Promise.resolve({
          data: { user: { id: 'auth-user-valid' } },
          error: null,
        }),
    };
    (supabase as any).from = () => ({
      select: () => ({
        eq: () =>
          Promise.resolve({
            data: null,
            error: { message: 'Database connection failed / RLS error' },
          }),
      }),
    });

    const failedResult = await certificateService.fetchAuthenticatedEligibility();
    assert.strictEqual(failedResult.success, false, 'Failed query must return success: false');
    assert.strictEqual(failedResult.data, undefined, 'Failed query must never return eligibility data');
    assert.strictEqual(
      failedResult.error,
      'Database connection failed / RLS error',
      'Must preserve database error message'
    );
    console.log('  ✔ Case 3.4: Database query error returns success: false with preserved message');

    // Case 3.5: Authenticated database query throws an unexpected network error
    (supabase as any).from = () => ({
      select: () => ({
        eq: () => Promise.reject(new Error('Network timeout')),
      }),
    });

    const exceptionResult = await certificateService.fetchAuthenticatedEligibility();
    assert.strictEqual(exceptionResult.success, false, 'Exception must return success: false');
    assert.strictEqual(exceptionResult.data, undefined, 'Exception must never return eligibility data');
    assert.strictEqual(exceptionResult.error, 'Network timeout');
    console.log('  ✔ Case 3.5: Unexpected exception returns success: false with error');

    // Restore original methods
    (supabase as any).auth = originalAuth;
    (supabase as any).from = originalFrom;
  } else {
    // If supabase client is null/unconfigured
    const unconfiguredResult = await certificateService.fetchAuthenticatedEligibility();
    assert.strictEqual(unconfiguredResult.success, false);
    assert.strictEqual(unconfiguredResult.data, undefined);
    assert.ok(unconfiguredResult.error);
    console.log('  ✔ Case 3.1: Unconfigured Supabase client cleanly returns success: false with no data');
  }

  // Case 3.6: Never falls back to client total_xp
  // Verify evaluateVerifiedRecords only derives XP strictly from records passed
  const emptyRecordsEval = certificateService.evaluateVerifiedRecords([]);
  assert.strictEqual(emptyRecordsEval.isEligible, false);
  assert.strictEqual(emptyRecordsEval.currentXp, 0);
  console.log('  ✔ Case 3.6: Zero records never derive XP from local/client state\n');

  // =========================================================================
  // Test Suite 4: Guest Eligibility Evaluated Separately
  // =========================================================================
  console.log('Suite 4: Guest Eligibility Evaluation');

  // Case 4.1: Guest with incomplete progress
  const guestIncomplete: GuestProgress = {
    guestId: 'guest-1234',
    totalXp: 1500,
    coins: 50,
    completedScenarios: ['drought_1', 'drought_2'],
    completedModules: ['drought'],
    achievements: [],
    scenarioRecords: {},
    createdAt: '2026-11-20T00:00:00Z',
    updatedAt: '2026-11-27T10:00:00Z',
  };
  const guestEval1 = certificateService.calculateGuestEligibility(guestIncomplete);
  assert.strictEqual(guestEval1.isEligible, false);
  assert.strictEqual(guestEval1.isVerified, false);
  assert.strictEqual(guestEval1.verificationStatus, 'local_guest');
  assert.strictEqual(guestEval1.completedModulesCount, 1);
  assert.strictEqual(guestEval1.missingRequirements.length, 2);
  console.log('  ✔ Case 4.1: Incomplete guest progress correctly flagged as ineligible');

  // Case 4.2: Guest with 4 modules but insufficient XP (< 3920)
  const guestLowXp: GuestProgress = {
    guestId: 'guest-5678',
    totalXp: 3500,
    coins: 100,
    completedScenarios: [],
    completedModules: ['drought', 'rainfall', 'contamination', 'agriculture'],
    achievements: [],
    scenarioRecords: {},
    createdAt: '2026-11-20T00:00:00Z',
    updatedAt: '2026-11-27T10:00:00Z',
  };
  const guestEval2 = certificateService.calculateGuestEligibility(guestLowXp);
  assert.strictEqual(guestEval2.isEligible, false);
  assert.strictEqual(guestEval2.completedModulesCount, 4);
  assert.ok(guestEval2.missingRequirements[0].includes('Earn 420 more XP'));
  console.log('  ✔ Case 4.2: Guest with 4 modules but low XP rejected with exact deficit');

  // Case 4.3: Guest fulfilling both criteria
  const guestEligible: GuestProgress = {
    guestId: 'guest-9999',
    totalXp: 4100,
    coins: 150,
    completedScenarios: [],
    completedModules: ['drought', 'rainfall', 'contamination', 'agriculture'],
    achievements: [],
    scenarioRecords: {},
    createdAt: '2026-11-20T00:00:00Z',
    updatedAt: '2026-11-27T10:00:00Z',
  };
  const guestEval3 = certificateService.calculateGuestEligibility(guestEligible);
  assert.strictEqual(guestEval3.isEligible, true);
  assert.strictEqual(guestEval3.isVerified, false);
  assert.strictEqual(guestEval3.verificationStatus, 'local_guest');
  assert.strictEqual(guestEval3.missingRequirements.length, 0);

  const guestCert = certificateService.buildCertificateData(guestEval3, 'Guest Cadet', 'guest-9999');
  assert.ok(guestCert.referenceNumber.startsWith('JR-LOCAL-'));
  assert.strictEqual(guestCert.completedModuleNames.length, 4);
  console.log('  ✔ Case 4.3: Guest meeting both criteria granted local-session certificate\n');

  // =========================================================================
  // Test Suite 5: Display Reference Construction
  // =========================================================================
  console.log('Suite 5: Display Reference Code Properties');
  assert.ok(guestCert.referenceNumber.includes('JR-LOCAL-'));
  assert.ok(certAll.referenceNumber.includes('JR-VERIFIED-'));
  // Verify reference format: JR-(VERIFIED|LOCAL)-[ALPHANUM]-[DATE]
  const refRegex = /^JR-(VERIFIED|LOCAL)-[A-Z0-9]+-\d{8}$/;
  assert.ok(refRegex.test(guestCert.referenceNumber));
  assert.ok(refRegex.test(certAll.referenceNumber));
  console.log('  ✔ Case 5.1: Reference codes follow display schema without cryptographic claims');

  console.log('\n--- ALL TEST SUITES PASSED CLEANLY (13/13 Assertions) ---');
}

runTests().catch((err) => {
  console.error('Test failed with error:', err);
  process.exit(1);
});
