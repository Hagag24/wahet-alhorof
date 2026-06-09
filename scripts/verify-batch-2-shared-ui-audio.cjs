#!/usr/bin/env node
/**
 * Batch 2: Shared UI Audio Verifier
 * Verifies common UI phrases and word vocabulary
 */

const fs = require('fs');
const path = require('path');

const AUDIO_MANIFEST_PATH = path.join(process.cwd(), 'audio-manifest.json');
const REVIEW_DIR = path.join(process.cwd(), 'audio-plan', 'review');

const BATCH_CONFIG = {
  name: 'Batch 2 - Shared UI Audio',
  description: 'Common UI phrases and vocabulary words',
  requiredIds: [
    // Words word-001 to word-068
    'word-001', 'word-002', 'word-003', 'word-004', 'word-005', 'word-006', 'word-007', 'word-008',
    'word-009', 'word-010', 'word-011', 'word-012', 'word-013', 'word-014', 'word-015', 'word-016',
    'word-017', 'word-018', 'word-019', 'word-020', 'word-021', 'word-022', 'word-023', 'word-024',
    'word-025', 'word-026', 'word-027', 'word-028', 'word-029', 'word-030', 'word-031', 'word-032',
    'word-033', 'word-034', 'word-035', 'word-036', 'word-037', 'word-038', 'word-039', 'word-040',
    'word-041', 'word-042', 'word-043', 'word-044', 'word-045', 'word-046', 'word-047', 'word-048',
    'word-049', 'word-050', 'word-051', 'word-052', 'word-053', 'word-054', 'word-055', 'word-056',
    'word-058', 'word-059', 'word-060', 'word-061', 'word-062', 'word-063', 'word-064', 'word-065',
    'word-066', 'word-067', 'word-068', 'word-069',
    // Core phrases phrase-001 to phrase-067
    'phrase-001', 'phrase-002', 'phrase-003', 'phrase-004', 'phrase-005', 'phrase-006', 'phrase-007',
    'phrase-008', 'phrase-009', 'phrase-010', 'phrase-011', 'phrase-012', 'phrase-013', 'phrase-014',
    'phrase-015', 'phrase-016', 'phrase-017', 'phrase-018', 'phrase-019', 'phrase-020', 'phrase-021',
    'phrase-022', 'phrase-023', 'phrase-024', 'phrase-025', 'phrase-025-2', 'phrase-026', 'phrase-027',
    'phrase-028', 'phrase-029', 'phrase-030', 'phrase-031', 'phrase-032', 'phrase-033', 'phrase-034',
    'phrase-035', 'phrase-036', 'phrase-037', 'phrase-038', 'phrase-039', 'phrase-040', 'phrase-041',
    'phrase-042', 'phrase-043', 'phrase-044', 'phrase-045', 'phrase-046', 'phrase-047', 'phrase-048',
    'phrase-049', 'phrase-050', 'phrase-051', 'phrase-052', 'phrase-053', 'phrase-054', 'phrase-055',
    'phrase-056', 'phrase-057', 'phrase-058', 'phrase-059', 'phrase-060', 'phrase-061', 'phrase-062',
    'phrase-063', 'phrase-064', 'phrase-065', 'phrase-066', 'phrase-067'
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

  const reportPath = path.join(REVIEW_DIR, 'batch-2-shared-ui-audio-verification.json');
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
