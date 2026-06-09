#!/usr/bin/env node
/**
 * Phase 5: Prepare Regeneration List
 * Creates detailed list of MP3 files requiring regeneration with Microsoft Edge TTS
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Paths
const REVIEW_DIR = path.join(process.cwd(), 'audio-plan', 'review');
const CORRECTIONS_PATH = path.join(REVIEW_DIR, 'full-spoken-arabic-corrections-applied.json');
const AUDIO_MANIFEST_PATH = path.join(process.cwd(), 'audio-manifest.json');

// Get file hash
function getFileHash(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  const content = fs.readFileSync(fullPath);
  return crypto.createHash('sha256').update(content).digest('hex');
}

// Get file size
function getFileSize(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  if (!fs.existsSync(fullPath)) {
    return 0;
  }
  return fs.statSync(fullPath).size;
}

async function prepareRegenerationList() {
  console.log('📝 Phase 5: Preparing Regeneration List...\n');

  // Load corrections
  console.log('📄 Loading corrections...');
  const correctionsData = JSON.parse(fs.readFileSync(CORRECTIONS_PATH, 'utf8'));
  const corrections = correctionsData.corrections || [];
  console.log(`   Found ${corrections.length} corrections\n`);

  // Load audio manifest to get voice settings
  const manifestContent = fs.readFileSync(AUDIO_MANIFEST_PATH, 'utf8');
  const manifest = JSON.parse(manifestContent.replace(/^\uFEFF/, ''));

  // Build regeneration list
  const regenerationList = [];

  for (const correction of corrections) {
    // Find the item in manifest
    const manifestItem = manifest.files.find(f => f.id === correction.audioId);
    if (!manifestItem) {
      console.warn(`⚠️  Item ${correction.audioId} not found in manifest`);
      continue;
    }

    const item = {
      audioId: correction.audioId,
      path: correction.path,
      voice: manifestItem.voice || manifest.ttsSettings?.recommendedVoice || 'ar-EG-ShakirNeural',
      oldTtsText: correction.oldTtsText,
      newTtsText: correction.newTtsText,
      reason: correction.issueType,
      sourceFile: 'audio-manifest.json',
      currentMp3Size: getFileSize(correction.path),
      currentMp3Hash: getFileHash(correction.path),
      text: manifestItem.text,
      kind: manifestItem.kind,
      group: manifestItem.group
    };

    regenerationList.push(item);
  }

  // Generate regeneration files
  console.log('📝 Generating regeneration list files...');

  const regenerationData = {
    generatedAt: new Date().toISOString(),
    totalFiles: regenerationList.length,
    ttsEngine: 'Microsoft Edge TTS',
    ttsEndpoint: 'edge://tts (requires external API call)',
    requiresExternalApproval: true,
    files: regenerationList
  };

  fs.writeFileSync(
    path.join(REVIEW_DIR, 'full-spoken-arabic-regeneration-required.json'),
    JSON.stringify(regenerationData, null, 2),
    'utf8'
  );

  const mdContent = generateRegenerationMarkdown(regenerationData, regenerationList);
  fs.writeFileSync(
    path.join(REVIEW_DIR, 'full-spoken-arabic-regeneration-required.md'),
    mdContent,
    'utf8'
  );

  // Calculate total estimated time
  const estimatedSeconds = regenerationList.length * 5; // ~5 seconds per file
  const estimatedMinutes = Math.ceil(estimatedSeconds / 60);

  console.log('\n📊 Regeneration Summary:');
  console.log(`   Total files requiring regeneration: ${regenerationList.length}`);
  console.log(`   Estimated time: ~${estimatedMinutes} minutes`);
  console.log(`   TTS Engine: Microsoft Edge TTS (ar-EG-ShakirNeural / ar-EG-SalmaNeural)`);
  console.log(`   ⚠️  External TTS approval required\n`);

  // List all files
  console.log('📋 Files to regenerate:');
  for (const item of regenerationList) {
    console.log(`   - ${item.audioId}: ${item.path}`);
  }

  console.log('\n✅ Phase 5 Complete: Regeneration list prepared');

  return regenerationData;
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
| External Approval Required | ${data.requiresExternalApproval ? 'YES' : 'NO'} |

---

## ⚠️ External TTS Approval Required

Regenerating ${data.totalFiles} linguistically corrected MP3 files requires Microsoft Edge TTS access.

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
| Old TTS | ${f.oldTtsText} |
| New TTS | ${f.newTtsText} |
| Reason | ${f.reason} |
| Current Size | ${f.currentMp3Size} bytes |
| Current Hash | ${f.currentMp3Hash || 'N/A'} |

`).join('---\n\n')}

---

## Required Action

Before regenerating audio:

1. Review the corrections in \`audio-manifest.json\`
2. Verify the new TTS text is linguistically correct
3. Obtain approval for Microsoft Edge TTS usage
4. Run the regeneration script with approved credentials

---

**Required final sentence:**

> External TTS approval is required before regenerating ${data.totalFiles} corrected spoken audio files.
`;
}

// Run
prepareRegenerationList()
  .then(() => {
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
