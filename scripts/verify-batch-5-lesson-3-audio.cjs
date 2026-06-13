#!/usr/bin/env node
/**
 * Batch 5: Lesson 3 Audio Verifier
 * Verifies Lesson 3 story scenes and lesson content
 */

const fs = require('fs');
const path = require('path');

const AUDIO_MANIFEST_PATH = path.join(process.cwd(), 'audio-manifest.json');
const REVIEW_DIR = path.join(process.cwd(), 'audio-plan', 'review');

const BATCH_CONFIG = {
  name: 'Batch 5 - Lesson 3 Audio',
  description: 'Lesson 3 content: story-03 scenes and lesson audio',
  requiredIds: [
    // Story 03 scenes (Lesson 3)
    'story-03-scene-01', 'story-03-scene-02', 'story-03-scene-03', 'story-03-scene-04',
    'story-03-scene-05', 'story-03-scene-06',
    // Lesson 3 content
    'lesson-3-description', 'lesson-3-full'
  ]
};

async function verifyBatch() {
  console.log(`🔍 ${BATCH_CONFIG.name} Verifier`);
  console.log(`${BATCH_CONFIG.description}\n`);
  console.log('='.repeat(60));

  const manifestContent = fs.readFileSync(AUDIO_MANIFEST_PATH, 'utf8');
  const manifest = JSON.parse(manifestContent.replace(/^\uFEFF/, ''));
  const files = manifest.files || [];

  const manifestIds = new Set(files.map(f => f.id));
  const results = {
    batchName: BATCH_CONFIG.name,
    totalRequired: BATCH_CONFIG.requiredIds.length,
    foundInManifest: 0,
    missingFromManifest: [],
    existingFiles: 0,
    missingFiles: [],
    zeroByteFiles: [],
    passed: true
  };

  console.log(`\n📄 Checking ${BATCH_CONFIG.requiredIds.length} required audio IDs...\n`);

  for (const id of BATCH_CONFIG.requiredIds) {
    if (!manifestIds.has(id)) {
      results.missingFromManifest.push(id);
      console.log(`❌ NOT IN MANIFEST: ${id}`);
      continue;
    }

    results.foundInManifest++;
    const file = files.find(f => f.id === id);
    const filePath = path.join(process.cwd(), file.path);
    const exists = fs.existsSync(filePath);

    if (!exists) {
      results.missingFiles.push({ id, path: file.path });
      console.log(`❌ MISSING FILE: ${id} -> ${file.path}`);
      continue;
    }

    const stats = fs.statSync(filePath);
    if (stats.size === 0) {
      results.zeroByteFiles.push({ id, path: file.path });
      console.log(`⚠️  ZERO-BYTE: ${id} -> ${file.path}`);
    } else {
      results.existingFiles++;
      console.log(`✅ VALID: ${id} (${stats.size} bytes)`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total required: ${results.totalRequired}`);
  console.log(`Found in manifest: ${results.foundInManifest}`);
  console.log(`Missing from manifest: ${results.missingFromManifest.length}`);
  console.log(`Existing files: ${results.existingFiles}`);
  console.log(`Missing files: ${results.missingFiles.length}`);
  console.log(`Zero-byte files: ${results.zeroByteFiles.length}`);

  const reportPath = path.join(REVIEW_DIR, 'batch-5-lesson-3-audio-verification.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2), 'utf8');
  console.log(`\n📝 Report saved: ${reportPath}`);

  results.passed = results.missingFromManifest.length === 0 &&
                   results.missingFiles.length === 0 &&
                   results.zeroByteFiles.length === 0;

  if (results.passed) {
    console.log(`\n✅ ${BATCH_CONFIG.name} VERIFICATION PASSED`);
    process.exit(0);
  } else {
    console.log(`\n❌ ${BATCH_CONFIG.name} VERIFICATION FAILED`);
    process.exit(1);
  }
}

verifyBatch().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
