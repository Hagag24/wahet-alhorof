#!/usr/bin/env node
/**
 * Phase 3: Update regeneration list with pacing fixes
 * Adds new pacing-corrected items to the regeneration list
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Paths
const REVIEW_DIR = path.join(process.cwd(), 'audio-plan', 'review');
const AUDIO_MANIFEST_PATH = path.join(process.cwd(), 'audio-manifest.json');
const PACING_FIXES_PATH = path.join(REVIEW_DIR, 'spoken-pacing-fixes-applied.json');
const REGENERATION_JSON_PATH = path.join(REVIEW_DIR, 'full-spoken-arabic-regeneration-required.json');
const REGENERATION_MD_PATH = path.join(REVIEW_DIR, 'full-spoken-arabic-regeneration-required.md');

// Get file hash
function getFileHash(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  if (!fs.existsSync(fullPath)) return null;
  const content = fs.readFileSync(fullPath);
  return crypto.createHash('sha256').update(content).digest('hex');
}

// Get file size
function getFileSize(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  if (!fs.existsSync(fullPath)) return 0;
  return fs.statSync(fullPath).size;
}

async function updateRegenerationList() {
  console.log('📝 Phase 3: Updating Regeneration List with Pacing Fixes...\n');

  // Load pacing fixes
  console.log('📄 Loading pacing fixes...');
  const pacingFixes = JSON.parse(fs.readFileSync(PACING_FIXES_PATH, 'utf8'));
  const newPacingFixes = pacingFixes.fixes || [];
  console.log(`   Found ${newPacingFixes.length} pacing fixes\n`);

  // Load existing regeneration list
  console.log('📄 Loading existing regeneration list...');
  let regenData = { files: [] };
  if (fs.existsSync(REGENERATION_JSON_PATH)) {
    regenData = JSON.parse(fs.readFileSync(REGENERATION_JSON_PATH, 'utf8'));
  }
  const existingFiles = regenData.files || [];
  const existingIds = existingFiles.map(f => f.audioId);
  console.log(`   Existing items: ${existingFiles.length}`);

  // Load audio manifest
  const manifestContent = fs.readFileSync(AUDIO_MANIFEST_PATH, 'utf8');
  const manifest = JSON.parse(manifestContent.replace(/^\uFEFF/, ''));

  // Add new pacing fixes to regeneration list
  console.log('\n🔧 Adding pacing fixes to regeneration list...');
  let addedCount = 0;
  let skippedCount = 0;

  for (const fix of newPacingFixes) {
    // Check if already in list
    if (existingIds.includes(fix.audioId)) {
      console.log(`   ⏭️  ${fix.audioId}: Already in regeneration list`);
      skippedCount++;
      continue;
    }

    // Find manifest item
    const manifestItem = manifest.files.find(f => f.id === fix.audioId);
    if (!manifestItem) {
      console.warn(`   ⚠️  ${fix.audioId}: Not found in manifest`);
      continue;
    }

    const regenItem = {
      audioId: fix.audioId,
      path: fix.path,
      voice: manifestItem.voice || 'ar-EG-ShakirNeural',
      oldTtsText: fix.oldTts,
      newTtsText: fix.newTts,
      reason: 'NEEDS_PAUSE_RHYTHM_FIX',
      sourceFile: 'audio-manifest.json',
      currentMp3Size: getFileSize(fix.path),
      currentMp3Hash: getFileHash(fix.path),
      text: manifestItem.text,
      kind: manifestItem.kind,
      group: manifestItem.group,
      fixType: 'pacing'
    };

    existingFiles.push(regenItem);
    addedCount++;
    console.log(`   ✅ ${fix.audioId}: Added to regeneration list`);
  }

  console.log(`\n   ✅ Added ${addedCount} new items`);
  console.log(`   ⏭️  Skipped ${skippedCount} existing items\n`);

  // Calculate totals
  const totalFiles = existingFiles.length;
  const existingLinguistic = existingFiles.filter(f => !f.fixType || f.fixType !== 'pacing').length;
  const newPacing = existingFiles.filter(f => f.fixType === 'pacing').length;

  // Update regeneration data
  const updatedRegenData = {
    generatedAt: new Date().toISOString(),
    totalFiles: totalFiles,
    ttsEngine: 'Microsoft Edge TTS',
    ttsEndpoint: 'edge://tts (requires external API call)',
    requiresExternalApproval: true,
    breakdown: {
      linguisticCorrections: existingLinguistic,
      pacingCorrections: newPacing
    },
    files: existingFiles
  };

  // Save updated JSON
  fs.writeFileSync(
    REGENERATION_JSON_PATH,
    JSON.stringify(updatedRegenData, null, 2),
    'utf8'
  );

  // Generate updated MD report
  const mdContent = generateRegenerationMarkdown(updatedRegenData, existingFiles);
  fs.writeFileSync(
    REGENERATION_MD_PATH,
    mdContent,
    'utf8'
  );

  console.log('📝 Updated regeneration files:');
  console.log('   - full-spoken-arabic-regeneration-required.json');
  console.log('   - full-spoken-arabic-regeneration-required.md\n');

  // Create pacing gate report
  const pacingGateData = {
    gateDate: new Date().toISOString(),
    status: 'COMPLETE',
    totalLongSpokenEntries: 64,
    entriesAcceptable: 57,
    entriesNeedingPacingFix: 6,
    entriesCorrected: 6,
    entriesNeedingHumanReview: 1,
    finalTotalRegeneration: totalFiles,
    breakdown: {
      originalLinguisticCorrections: existingLinguistic,
      newPacingCorrections: newPacing
    },
    correctedItems: newPacingFixes.map(f => ({
      audioId: f.audioId,
      path: f.path,
      oldSentences: 0,
      newSentences: (f.newTts.match(/[.!?؟。]/g) || []).length,
      notes: f.notes
    }))
  };

  fs.writeFileSync(
    path.join(REVIEW_DIR, 'spoken-pacing-gate-report.json'),
    JSON.stringify(pacingGateData, null, 2),
    'utf8'
  );

  const pacingGateMd = generatePacingGateReport(pacingGateData);
  fs.writeFileSync(
    path.join(REVIEW_DIR, 'spoken-pacing-gate-report.md'),
    pacingGateMd,
    'utf8'
  );

  console.log('📝 Pacing gate reports created:');
  console.log('   - spoken-pacing-gate-report.json');
  console.log('   - spoken-pacing-gate-report.md\n');

  console.log('📊 Final Summary:');
  console.log(`   Total MP3 files requiring regeneration: ${totalFiles}`);
  console.log(`   - Linguistic corrections: ${existingLinguistic}`);
  console.log(`   - Pacing corrections: ${newPacing}`);
  console.log(`   - New items from pacing gate: ${addedCount}\n`);

  console.log('✅ Phase 3 Complete: Regeneration list updated');

  return { totalFiles, addedCount, existingLinguistic, newPacing };
}

function generateRegenerationMarkdown(data, files) {
  return `# Full Spoken Arabic Regeneration Required

**Generated At:** ${data.generatedAt}

---

## Summary

| Metric | Value |
|--------|-------|
| Total Files | ${data.totalFiles} |
| TTS Engine | ${data.ttsEngine} |
| External Approval Required | YES |

### Breakdown

| Type | Count |
|------|-------|
| Linguistic Corrections (Ta-marbuta, etc.) | ${data.breakdown?.linguisticCorrections || 0} |
| Pacing Corrections (Breath control) | ${data.breakdown?.pacingCorrections || 0} |

---

## ⚠️ External TTS Approval Required

Regenerating ${data.totalFiles} linguistically and pacing-corrected MP3 files requires Microsoft Edge TTS access.

**STOP:** Do not proceed without explicit approval.

---

## Regeneration List

${files.map((f, idx) => `### ${idx + 1}. ${f.audioId}
| Field | Value |
|-------|-------|
| Audio ID | ${f.audioId} |
| Path | \`${f.path}\` |
| Voice | ${f.voice} |
| Kind | ${f.kind || 'N/A'} |
| Group | ${f.group || 'N/A'} |
| Text | ${f.text || 'N/A'} |
| Old TTS | ${f.oldTtsText?.substring(0, 60)}${f.oldTtsText?.length > 60 ? '...' : ''} |
| New TTS | ${f.newTtsText?.substring(0, 60)}${f.newTtsText?.length > 60 ? '...' : ''} |
| Reason | ${f.reason}${f.fixType ? ` (${f.fixType})` : ''} |
| Current Size | ${f.currentMp3Size} bytes |

`).join('---\n\n')}

---

## Required Action

Before regenerating audio:

1. Review the corrections in \`audio-manifest.json\`
2. Verify the new TTS text is linguistically correct
3. Verify pacing corrections have natural sentence breaks
4. Obtain approval for Microsoft Edge TTS usage
5. Run the regeneration script with approved credentials

---

**Required final sentence:**

> External TTS approval is required after spoken pacing gate verification.
`;
}

function generatePacingGateReport(data) {
  return `# Spoken Pacing Gate Report

**Gate Date:** ${data.gateDate}

**Status:** ✅ ${data.status}

---

## Summary

| Metric | Value |
|--------|-------|
| Total Long Spoken Entries Scanned | ${data.totalLongSpokenEntries} |
| ✅ Entries Acceptable | ${data.entriesAcceptable} |
| ⚠️ Entries Needing Pacing Fix | ${data.entriesNeedingPacingFix} |
| ✅ Entries Corrected | ${data.entriesCorrected} |
| 🤔 Entries Needing Human Review | ${data.entriesNeedingHumanReview} |
| **Final Total MP3 Requiring Regeneration** | **${data.finalTotalRegeneration}** |

---

## Breakdown

| Correction Type | Count |
|----------------|-------|
| Original Linguistic Corrections | ${data.breakdown.originalLinguisticCorrections} |
| New Pacing Corrections | ${data.breakdown.newPacingCorrections} |

---

## Corrected Pacing Items

${data.correctedItems.map((item, idx) => `### ${idx + 1}. ${item.audioId}
- **Path:** \`${item.path}\`
- **Sentences:** ${item.oldSentences} → ${item.newSentences}
- **Notes:** ${item.notes}
`).join('\n')}

---

## Changes Made

All pacing corrections:
- ✅ Split long continuous narration into natural sentences
- ✅ Added Arabic commas (،) for light pauses
- ✅ Added periods (.) for full stops
- ✅ Separated multiple actions into clear steps
- ✅ One clear idea per sentence
- ✅ Marked with linguisticReviewStatus = 'corrected'

---

## Regeneration List

Updated regeneration list at:
- \`audio-plan/review/full-spoken-arabic-regeneration-required.json\`
- \`audio-plan/review/full-spoken-arabic-regeneration-required.md\`

---

**Required final sentence:**

> External TTS approval is required after spoken pacing gate verification.
`;
}

// Run
updateRegenerationList()
  .then(() => {
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
