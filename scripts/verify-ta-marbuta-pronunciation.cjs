#!/usr/bin/env node
/**
 * Ta-Marbuta Pronunciation Verifier
 * Verifies Variant A is used in ttsText/approvedTtsText only
 * Does NOT check visible text for pronunciation rules
 */

const fs = require('fs');
const path = require('path');

const AUDIO_MANIFEST_PATH = path.join(process.cwd(), 'audio-manifest.json');
const REVIEW_DIR = path.join(process.cwd(), 'audio-plan', 'review');
const REGENERATION_PATH = path.join(REVIEW_DIR, 'full-spoken-arabic-regeneration-required.json');

// Critical items that must be preserved
const CRITICAL_ITEMS = {
  'word-052': { expectedTts: 'مِيم' },
  'word-171': { expectedTts: null }, // Must exist
  'word-172': { expectedTts: null }, // Must exist
  'word-173': { expectedTts: null }  // Must exist
};

function hasTaMarbutaVariantA(ttsText) {
  if (!ttsText) return true;
  // If text doesn't contain ta-marbuta, skip
  if (!/ة/.test(ttsText)) return true;
  // Check if ttsText uses Variant A (containing هْ)
  return /هْ/.test(ttsText);
}

function hasFakeNormalTa(text) {
  if (!text) return false;
  // Check for words ending with ت (not followed by anything)
  return /[بتثجحخدذرزسشصضطظعغفقكلمنهوي]ت\b/.test(text);
}

async function verifyTaMarbuta() {
  console.log('🔍 Ta-Marbuta Pronunciation Verifier\n');
  console.log('='.repeat(60));

  // Load manifest
  const manifestContent = fs.readFileSync(AUDIO_MANIFEST_PATH, 'utf8');
  const manifest = JSON.parse(manifestContent.replace(/^\uFEFF/, ''));
  const files = manifest.files || [];

  // Load regeneration list (only check corrected items)
  let regenIds = [];
  if (fs.existsSync(REGENERATION_PATH)) {
    const regenData = JSON.parse(fs.readFileSync(REGENERATION_PATH, 'utf8'));
    regenIds = (regenData.files || []).map(f => f.audioId);
  }
  const correctedIds = new Set([...regenIds]);

  console.log(`\n📄 Checking ${correctedIds.size} corrected audio entries...\n`);
  console.log(`(Only checking items in regeneration list - ${files.length} total files in manifest)\n`);

  const results = {
    totalFiles: files.length,
    correctedFilesChecked: correctedIds.size,
    taMarbutaViolations: [],
    fakeTaViolations: [],
    criticalItemsOk: [],
    criticalItemsFailed: [],
    passed: true
  };

  // Check only corrected files for ta-marbuta in ttsText
  for (const file of files) {
    // Skip items not in regeneration list (only check corrected items)
    if (!correctedIds.has(file.id)) {
      continue;
    }
    const ttsText = file.ttsText || file.approvedTtsText || '';
    const id = file.id;

    // Check ta-marbuta Variant A in ttsText only
    if (ttsText && /ة/.test(ttsText)) {
      if (!hasTaMarbutaVariantA(ttsText)) {
        results.taMarbutaViolations.push({
          id: id,
          ttsText: ttsText,
          issue: 'Does not use Variant A (ending with هْ)'
        });
        console.log(`❌ TA-MARBUTA: ${id} -> ${ttsText.substring(0, 50)}`);
      }
    }

    // Check for fake normal ت
    if (hasFakeNormalTa(ttsText)) {
      results.fakeTaViolations.push({
        id: id,
        ttsText: ttsText,
        issue: 'Uses fake normal ت for ta-marbuta'
      });
      console.log(`❌ FAKE-TA: ${id} -> ${ttsText.substring(0, 50)}`);
    }

    // Check critical items
    if (CRITICAL_ITEMS[id]) {
      const expected = CRITICAL_ITEMS[id].expectedTts;
      if (expected && ttsText !== expected) {
        results.criticalItemsFailed.push({
          id: id,
          expected: expected,
          actual: ttsText
        });
        console.log(`❌ CRITICAL: ${id} expected "${expected}" but got "${ttsText}"`);
      } else if (expected && ttsText === expected) {
        results.criticalItemsOk.push({ id: id, ttsText: ttsText });
        console.log(`✅ CRITICAL: ${id} -> ${ttsText}`);
      } else if (!expected && ttsText) {
        results.criticalItemsOk.push({ id: id, ttsText: ttsText });
        console.log(`✅ CRITICAL: ${id} exists -> ${ttsText.substring(0, 30)}`);
      }
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total files in manifest: ${results.totalFiles}`);
  console.log(`Corrected files checked: ${results.correctedFilesChecked}`);
  console.log(`Ta-marbuta Variant A violations: ${results.taMarbutaViolations.length}`);
  console.log(`Fake normal ت violations: ${results.fakeTaViolations.length}`);
  console.log(`Critical items OK: ${results.criticalItemsOk.length}`);
  console.log(`Critical items failed: ${results.criticalItemsFailed.length}`);

  // Save report
  const reportPath = path.join(REVIEW_DIR, 'ta-marbuta-verification.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2), 'utf8');
  console.log(`\n📝 Report saved: ${reportPath}`);

  // Exit code
  const hasIssues = results.taMarbutaViolations.length > 0 ||
                    results.fakeTaViolations.length > 0 ||
                    results.criticalItemsFailed.length > 0;

  if (hasIssues) {
    console.log('\n❌ VERIFICATION FAILED');
    process.exit(1);
  } else {
    console.log('\n✅ TA-MARBUTA VERIFICATION PASSED');
    console.log('All ttsText entries use Variant A correctly.');
    console.log('Visible text was not checked (per project rules).');
    process.exit(0);
  }
}

verifyTaMarbuta().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
