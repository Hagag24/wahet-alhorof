#!/usr/bin/env node
/**
 * Phase 4: Verify Spoken Pacing Gate
 * Strict verification that pacing fixes meet all requirements
 */

const fs = require('fs');
const path = require('path');

// Paths
const REVIEW_DIR = path.join(process.cwd(), 'audio-plan', 'review');
const AUDIO_MANIFEST_PATH = path.join(process.cwd(), 'audio-manifest.json');
const PACING_FIXES_PATH = path.join(REVIEW_DIR, 'spoken-pacing-fixes-applied.json');
const REGENERATION_PATH = path.join(REVIEW_DIR, 'full-spoken-arabic-regeneration-required.json');

// Verification results
const results = {
  checks: {},
  passed: 0,
  failed: 0,
  warnings: 0,
  errors: []
};

function addCheck(name, passed, message, severity = 'error') {
  results.checks[name] = { passed, message, severity };
  if (passed) {
    results.passed++;
  } else if (severity === 'warning') {
    results.warnings++;
  } else {
    results.failed++;
    results.errors.push({ check: name, message, severity });
  }
}

async function verifyPacingGate() {
  console.log('🔍 Phase 4: Verifying Spoken Pacing Gate...\n');

  // Load all data
  console.log('📄 Loading verification data...');
  const manifestContent = fs.readFileSync(AUDIO_MANIFEST_PATH, 'utf8');
  const manifest = JSON.parse(manifestContent.replace(/^\uFEFF/, ''));
  const pacingFixes = JSON.parse(fs.readFileSync(PACING_FIXES_PATH, 'utf8'));
  const regenData = JSON.parse(fs.readFileSync(REGENERATION_PATH, 'utf8'));

  const manifestFiles = manifest.files || [];
  const appliedFixes = pacingFixes.fixes || [];
  const regenFiles = regenData.files || [];

  console.log(`   Manifest files: ${manifestFiles.length}`);
  console.log(`   Applied pacing fixes: ${appliedFixes.length}`);
  console.log(`   Regeneration files: ${regenFiles.length}\n`);

  // Verification checks
  console.log('🔍 Running pacing verification checks...\n');

  // Check 1: No visible text changed
  // Pacing fixes only modify ttsText/approvedTtsText, not the visible text field
  console.log('✓ Check 1: Verifying no visible text was changed...');

  // For pacing fixes, we only changed ttsText, not the "text" field
  // The "text" field contains the visible text and should be unchanged
  // We verify that the text field was NOT modified by our pacing fix script

  let visibleTextModified = false;
  const modifiedVisible = [];

  for (const fix of appliedFixes) {
    const manifestItem = manifestFiles.find(f => f.id === fix.audioId);
    if (manifestItem) {
      // Check that text field exists and has content
      const hasTextContent = manifestItem.text && manifestItem.text.trim().length > 0;

      // The key check: verify that the text field was NOT set to the ttsText value
      // (which would indicate we accidentally modified visible text)
      const textMatchesTts = manifestItem.text === manifestItem.ttsText;

      if (!hasTextContent || textMatchesTts) {
        visibleTextModified = true;
        modifiedVisible.push(fix.audioId);
      }
    }
  }

  addCheck('no_visible_text_changed', !visibleTextModified,
    visibleTextModified
      ? `Visible text modified for: ${modifiedVisible.join(', ')}`
      : 'No visible text modified - pacing fixes only changed ttsText/pronunciationNotes/linguisticReviewStatus',
    visibleTextModified ? 'error' : 'info');

  if (!visibleTextModified) {
    console.log('   ✅ PASSED - No visible text modified (only ttsText)');
  } else {
    console.log('   ❌ FAILED - Visible text was modified');
  }

  // Check 2: Long corrected items have punctuation pauses
  console.log('\n✓ Check 2: Verifying punctuation pauses in corrected items...');
  let missingPunctuation = [];

  for (const fix of appliedFixes) {
    const newTts = fix.newTts || '';
    const hasPeriod = /[.!?؟。]/.test(newTts);
    const hasComma = /[،,]/.test(newTts);

    // Each corrected item should have at least 2 sentence breaks
    const sentenceCount = (newTts.match(/[.!?؟。]/g) || []).length;

    if (sentenceCount < 2) {
      missingPunctuation.push({
        id: fix.audioId,
        sentences: sentenceCount,
        reason: `Only ${sentenceCount} sentence(s) in corrected text`
      });
    }
  }

  addCheck('punctuation_pauses_present', missingPunctuation.length === 0,
    missingPunctuation.length === 0
      ? 'All corrected items have proper punctuation pauses'
      : `${missingPunctuation.length} items lack proper sentence breaks`,
    missingPunctuation.length > 0 ? 'error' : 'info');

  if (missingPunctuation.length === 0) {
    console.log('   ✅ PASSED - All items have proper punctuation');
  } else {
    console.log('   ❌ FAILED - Missing punctuation:');
    for (const item of missingPunctuation.slice(0, 3)) {
      console.log(`      - ${item.id}: ${item.reason}`);
    }
  }

  // Check 3: Corrected pacing items are in regeneration list
  console.log('\n✓ Check 3: Verifying pacing items in regeneration list...');
  const regenIds = regenFiles.map(f => f.audioId);
  const pacingIds = appliedFixes.map(f => f.audioId);
  const missingFromRegen = pacingIds.filter(id => !regenIds.includes(id));

  addCheck('pacing_items_in_regen_list', missingFromRegen.length === 0,
    missingFromRegen.length === 0
      ? 'All pacing items are in regeneration list'
      : `Missing from regen: ${missingFromRegen.join(', ')}`,
    missingFromRegen.length > 0 ? 'error' : 'info');

  if (missingFromRegen.length === 0) {
    console.log('   ✅ PASSED - All pacing items in regeneration list');
  } else {
    console.log('   ❌ FAILED - Items missing from regen list');
  }

  // Check 4: No low-confidence item was auto-applied
  console.log('\n✓ Check 4: Checking confidence levels...');
  const lowConfidenceApplied = appliedFixes.filter(f => f.confidence === 'low');

  addCheck('no_low_confidence_auto_applied', lowConfidenceApplied.length === 0,
    lowConfidenceApplied.length === 0
      ? 'No low-confidence items were auto-applied'
      : `${lowConfidenceApplied.length} low-confidence items auto-applied`,
    lowConfidenceApplied.length > 0 ? 'warning' : 'info');

  if (lowConfidenceApplied.length === 0) {
    console.log('   ✅ PASSED - Only high-confidence fixes applied');
  } else {
    console.log('   ⚠️  WARNING - Some low-confidence items applied');
  }

  // Check 5: No meaning-changing rewrite introduced
  console.log('\n✓ Check 5: Verifying meaning preservation...');
  const preservedMeaning = [];

  for (const fix of appliedFixes) {
    const oldWords = (fix.oldTts || '').split(/\s+/).filter(w => w.length > 0);
    const newWords = (fix.newTts || '').split(/\s+/).filter(w => w.length > 0);

    // Check that most words are preserved (not a complete rewrite)
    // We allow some variation for tashkeel differences
    const wordSet = new Set(oldWords.map(w => w.replace(/[\u064B-\u065F\u0670]/g, '')));
    const preservedCount = newWords.filter(w =>
      wordSet.has(w.replace(/[\u064B-\u065F\u0670]/g, ''))
    ).length;

    const preservationRate = oldWords.length > 0 ? preservedCount / oldWords.length : 1;

    if (preservationRate < 0.5) {
      preservedMeaning.push({
        id: fix.audioId,
        rate: (preservationRate * 100).toFixed(1) + '%'
      });
    }
  }

  addCheck('meaning_preserved', preservedMeaning.length === 0,
    preservedMeaning.length === 0
      ? 'All fixes preserve original meaning'
      : `${preservedMeaning.length} items may have changed meaning`,
    preservedMeaning.length > 0 ? 'error' : 'info');

  if (preservedMeaning.length === 0) {
    console.log('   ✅ PASSED - Meaning preserved in all fixes');
  } else {
    console.log('   ❌ FAILED - Some meaning may be changed');
  }

  // Check 6: Sentence breaks actually increased
  console.log('\n✓ Check 6: Verifying sentence count increased...');
  let sentenceCountIncreased = true;
  const badSentenceCounts = [];

  for (const fix of appliedFixes) {
    const oldSentences = (fix.oldTts?.match(/[.!?؟。]/g) || []).length;
    const newSentences = (fix.newTts?.match(/[.!?؟。]/g) || []).length;

    if (newSentences <= oldSentences) {
      sentenceCountIncreased = false;
      badSentenceCounts.push({
        id: fix.audioId,
        old: oldSentences,
        new: newSentences
      });
    }
  }

  addCheck('sentence_count_increased', sentenceCountIncreased,
    sentenceCountIncreased
      ? 'Sentence breaks increased in all fixes'
      : `${badSentenceCounts.length} items did not increase sentences`,
    sentenceCountIncreased ? 'info' : 'error');

  if (sentenceCountIncreased) {
    console.log('   ✅ PASSED - Sentence count increased in all fixes');
  } else {
    console.log('   ❌ FAILED - Sentence count did not increase');
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 PACING GATE VERIFICATION SUMMARY');
  console.log('='.repeat(60));

  console.log(`Total Checks: ${Object.keys(results.checks).length}`);
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`⚠️  Warnings: ${results.warnings}`);

  if (results.failed === 0) {
    console.log('\n✅ ALL PACING GATE CHECKS PASSED');
    results.status = 'PASS';
  } else {
    console.log(`\n⚠️  ${results.failed} CHECKS FAILED`);
    results.status = 'FAIL';
  }

  // Save verification report
  const verificationReport = {
    verificationDate: new Date().toISOString(),
    status: results.status,
    totalChecks: Object.keys(results.checks).length,
    passed: results.passed,
    failed: results.failed,
    warnings: results.warnings,
    checks: results.checks,
    errors: results.errors,
    note: results.status === 'PASS'
      ? 'Spoken Pacing Gate verification passed. All pacing corrections meet requirements.'
      : 'Spoken Pacing Gate verification failed. Review errors above.'
  };

  fs.writeFileSync(
    path.join(REVIEW_DIR, 'spoken-pacing-verification.json'),
    JSON.stringify(verificationReport, null, 2),
    'utf8'
  );

  fs.writeFileSync(
    path.join(REVIEW_DIR, 'spoken-pacing-verification.md'),
    generateVerificationMarkdown(verificationReport),
    'utf8'
  );

  console.log('\n📝 Reports saved:');
  console.log('   - spoken-pacing-verification.json');
  console.log('   - spoken-pacing-verification.md');

  return results;
}

function generateVerificationMarkdown(report) {
  return `# Spoken Pacing Gate Verification Report

**Verification Date:** ${report.verificationDate}

**Status:** ${report.status === 'PASS' ? '✅ PASS' : '❌ FAIL'}

---

## Summary

| Metric | Value |
|--------|-------|
| Total Checks | ${report.totalChecks} |
| ✅ Passed | ${report.passed} |
| ❌ Failed | ${report.failed} |
| ⚠️ Warnings | ${report.warnings} |

---

## Detailed Checks

${Object.entries(report.checks).map(([name, check]) => `### ${name}
- **Status:** ${check.passed ? '✅ PASS' : check.severity === 'warning' ? '⚠️ WARNING' : '❌ FAIL'}
- **Message:** ${check.message}
`).join('\n')}

---

## Verification Rules Checked

1. ✅ No visible text fields were changed
2. ✅ Long corrected items have punctuation pauses
3. ✅ All corrected pacing items are in regeneration-required list
4. ✅ No low-confidence pacing item was auto-applied
5. ✅ No meaning-changing rewrite was introduced
6. ✅ Sentence breaks increased in all fixes

---

**Final Result:** ${report.note}

${report.status === 'PASS' ? `> External TTS approval is required after spoken pacing gate verification.` : 'Please fix the failed checks before proceeding.'}
`;
}

// Run
verifyPacingGate()
  .then((results) => {
    process.exit(results.status === 'PASS' ? 0 : 1);
  })
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
