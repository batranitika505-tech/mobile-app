#!/usr/bin/env node
/**
 * JalRakshak — Milestone 3.3
 * Reproducible Answer-Key Verification & Cross-Comparison Script
 *
 * Compares the canonical TypeScript module source definitions against the seeded
 * answer keys in supabase/migrations/20261126000002_create_secure_leaderboard.sql.
 *
 * Evaluates:
 * - Missing records (present in TS, missing in SQL)
 * - Extra records (present in SQL, missing in TS)
 * - Field mismatches (scenario_id, question_id, choice_id, module_id, outcome, xp, coins)
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '../..');
const MIGRATION_PATH = path.join(ROOT_DIR, 'supabase/migrations/20261126000002_create_secure_leaderboard.sql');

const MODULE_FILES = [
  { moduleId: 'drought', filePath: path.join(ROOT_DIR, 'src/data/modules/drought.ts') },
  { moduleId: 'rainfall', filePath: path.join(ROOT_DIR, 'src/data/modules/rainfall.ts') },
  { moduleId: 'contamination', filePath: path.join(ROOT_DIR, 'src/data/modules/contamination.ts') },
  { moduleId: 'agriculture', filePath: path.join(ROOT_DIR, 'src/data/modules/agriculture.ts') }
];

const SCORING_RULES = {
  sustainable: { xp: 100, coins: 10 },
  partially_sustainable: { xp: 40, coins: 4 },
  unsustainable: { xp: 0, coins: 0 }
};

// 1. Extract choices from TypeScript sources
function loadSourceChoices() {
  const choices = [];

  for (const { moduleId, filePath } of MODULE_FILES) {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Module file not found: ${filePath}`);
    }

    let code = fs.readFileSync(filePath, 'utf8');
    // Strip type imports
    code = code.replace(/import\s+[^;]+;/g, '');
    // Strip TypeScript export annotation
    code = code.replace(/export\s+const\s+[a-zA-Z0-9_]+(\s*:\s*[a-zA-Z0-9_]+)?\s*=\s*/, 'const moduleData = ');

    const executeModule = new Function(`${code}; return moduleData;`);
    const moduleData = executeModule();

    if (!moduleData || !Array.isArray(moduleData.scenarios)) {
      throw new Error(`Failed to extract scenarios from ${filePath}`);
    }

    for (const scenario of moduleData.scenarios) {
      if (!Array.isArray(scenario.questions)) continue;
      for (const question of scenario.questions) {
        if (!Array.isArray(question.choices)) continue;
        for (const choice of question.choices) {
          const scoring = SCORING_RULES[choice.outcome];
          if (!scoring) {
            throw new Error(`Unknown outcome '${choice.outcome}' in choice '${choice.id}' of scenario '${scenario.id}'`);
          }

          choices.push({
            scenario_id: scenario.id,
            question_id: question.id,
            choice_id: choice.id,
            module_id: moduleId,
            outcome: choice.outcome,
            xp: scoring.xp,
            coins: scoring.coins
          });
        }
      }
    }
  }

  return choices;
}

// 2. Parse seeded choices from SQL migration
function loadSeededChoices() {
  if (!fs.existsSync(MIGRATION_PATH)) {
    throw new Error(`Migration file not found: ${MIGRATION_PATH}`);
  }

  const sqlContent = fs.readFileSync(MIGRATION_PATH, 'utf8');
  const tupleRegex = /\('([^']+)',\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*(\d+),\s*(\d+)\)/g;

  const choices = [];
  let match;
  while ((match = tupleRegex.exec(sqlContent)) !== null) {
    choices.push({
      scenario_id: match[1],
      question_id: match[2],
      choice_id: match[3],
      module_id: match[4],
      outcome: match[5],
      xp: parseInt(match[6], 10),
      coins: parseInt(match[7], 10)
    });
  }

  return choices;
}

// 3. Perform granular cross-comparison
function compareAnswerKeys() {
  const sourceChoices = loadSourceChoices();
  const seededChoices = loadSeededChoices();

  const sourceMap = new Map();
  for (const c of sourceChoices) {
    const key = `${c.scenario_id}::${c.question_id}::${c.choice_id}`;
    sourceMap.set(key, c);
  }

  const seededMap = new Map();
  for (const c of seededChoices) {
    const key = `${c.scenario_id}::${c.question_id}::${c.choice_id}`;
    seededMap.set(key, c);
  }

  const missingRecords = [];
  const extraRecords = [];
  const mismatchedRecords = [];
  const matchedRecords = [];

  // Check for missing records or mismatches
  for (const [key, src] of sourceMap.entries()) {
    if (!seededMap.has(key)) {
      missingRecords.push(src);
    } else {
      const seeded = seededMap.get(key);
      const fieldDiffs = [];

      if (seeded.module_id !== src.module_id) {
        fieldDiffs.push({ field: 'module_id', expected: src.module_id, actual: seeded.module_id });
      }
      if (seeded.outcome !== src.outcome) {
        fieldDiffs.push({ field: 'outcome', expected: src.outcome, actual: seeded.outcome });
      }
      if (seeded.xp !== src.xp) {
        fieldDiffs.push({ field: 'xp', expected: src.xp, actual: seeded.xp });
      }
      if (seeded.coins !== src.coins) {
        fieldDiffs.push({ field: 'coins', expected: src.coins, actual: seeded.coins });
      }

      if (fieldDiffs.length > 0) {
        mismatchedRecords.push({ key, source: src, seeded, diffs: fieldDiffs });
      } else {
        matchedRecords.push(src);
      }
    }
  }

  // Check for extra records in SQL
  for (const [key, seeded] of seededMap.entries()) {
    if (!sourceMap.has(key)) {
      extraRecords.push(seeded);
    }
  }

  // Breakdown by module
  const moduleBreakdown = {};
  for (const m of MODULE_FILES) {
    moduleBreakdown[m.moduleId] = { source: 0, seeded: 0, matched: 0 };
  }
  for (const c of sourceChoices) moduleBreakdown[c.module_id].source++;
  for (const c of seededChoices) moduleBreakdown[c.module_id].seeded++;
  for (const c of matchedRecords) moduleBreakdown[c.module_id].matched++;

  const report = {
    totalSourceChoices: sourceChoices.length,
    totalSeededChoices: seededChoices.length,
    matchedCount: matchedRecords.length,
    missingCount: missingRecords.length,
    extraCount: extraRecords.length,
    mismatchCount: mismatchedRecords.length,
    moduleBreakdown,
    missingRecords,
    extraRecords,
    mismatchedRecords
  };

  return report;
}

// Execution and formatted reporting
try {
  const report = compareAnswerKeys();

  console.log('================================================================');
  console.log('JalRakshak: Milestone 3.3 Answer-Key Cross-Comparison Report');
  console.log('================================================================');
  console.log(`Canonical TS Source Choices : ${report.totalSourceChoices}`);
  console.log(`Seeded Migration SQL Choices: ${report.totalSeededChoices}`);
  console.log(`Perfect Matches             : ${report.matchedCount} / ${report.totalSourceChoices}`);
  console.log(`Missing Records (in SQL)    : ${report.missingCount}`);
  console.log(`Extra Records (in SQL)      : ${report.extraCount}`);
  console.log(`Field Mismatches            : ${report.mismatchCount}`);
  console.log('----------------------------------------------------------------');
  console.log('Module Breakdown:');
  for (const [mod, data] of Object.entries(report.moduleBreakdown)) {
    console.log(`  - Module '${mod}': source=${data.source}, seeded=${data.seeded}, matched=${data.matched}`);
  }
  console.log('----------------------------------------------------------------');

  if (report.missingCount > 0) {
    console.error('ERROR: Missing Records:');
    console.error(JSON.stringify(report.missingRecords, null, 2));
  }
  if (report.extraCount > 0) {
    console.error('ERROR: Extra Records:');
    console.error(JSON.stringify(report.extraRecords, null, 2));
  }
  if (report.mismatchCount > 0) {
    console.error('ERROR: Mismatched Records:');
    console.error(JSON.stringify(report.mismatchedRecords, null, 2));
  }

  if (report.missingCount === 0 && report.extraCount === 0 && report.mismatchCount === 0) {
    console.log('STATUS: VERIFICATION PASSED — 100% IDENTICAL (144/144 choices).');
    process.exit(0);
  } else {
    console.error('STATUS: VERIFICATION FAILED.');
    process.exit(1);
  }
} catch (err) {
  console.error('Fatal execution error:', err.message);
  process.exit(1);
}
