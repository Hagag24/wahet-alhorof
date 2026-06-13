#!/usr/bin/env node
/**
 * Zero-Byte Audio Recovery Verifier
 * Verifies all manifest MP3 paths exist, no MP3 is zero-byte
 */

const fs = require('fs');
const path = require('path');

const AUDIO_MANIFEST_PATH = path.join(process.cwd(), 'audio-manifest.json');
const REVIEW_DIR = path.join(process.cwd(), 'audio-plan', 'review');

async function verifyZeroByteAudio() {
  console.log('🔍 Zero-Byte Audio Recovery Verifier\n');
  console.log('='.repeat(60));

  // Load manifest
  const manifestContent = fs.readFileSync(AUDIO_MANIFEST_PATH, 'utf8');
  const manifest = JSON.parse(manifestContent.replace(/^\uFEFF/, ''));
  const files = manifest.files || [];

  console.log(`\n📄 Checking ${files.length} audio files...\n`);

  const results = {
    totalFiles: files.length,
    existingFiles: 0,
    missingFiles: [],
    zeroByteFiles: [],
    validFiles: []
  };

  for (const file of files) {
    const filePath = path.join(process.cwd(), file.path);
    const exists = fs.existsSync(filePath);

    if (!exists) {
      results.missingFiles.push({
        id: file.id,
        path: file.path
      });
      console.log(`❌ MISSING: ${file.id} -> ${file.path}`);
      continue;
    }

    const stats = fs.statSync(filePath);
    const size = stats.size;

    if (size === 0) {
      results.zeroByteFiles.push({
        id: file.id,
        path: file.path
      });
      console.log(`⚠️  ZERO-BYTE: ${file.id} -> ${file.path}`);
    } else {
      results.existingFiles++;
      results.validFiles.push({
        id: file.id,
        path: file.path,
        size: size
      });
      console.log(`✅ VALID: ${file.id} (${size} bytes)`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total files checked: ${results.totalFiles}`);
  console.log(`Valid files: ${results.existingFiles}`);
  console.log(`Missing files: ${results.missingFiles.length}`);
  console.log(`Zero-byte files: ${results.zeroByteFiles.length}`);

  // Save report
  const reportPath = path.join(REVIEW_DIR, 'zero-byte-audio-verification.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2), 'utf8');
  console.log(`\n📝 Report saved: ${reportPath}`);

  // Exit code
  const hasIssues = results.missingFiles.length > 0 || results.zeroByteFiles.length > 0;

  if (hasIssues) {
    console.log('\n❌ VERIFICATION FAILED');
    console.log('Missing files:');
    results.missingFiles.forEach(f => console.log(`  - ${f.id}: ${f.path}`));
    console.log('\nZero-byte files:');
    results.zeroByteFiles.forEach(f => console.log(`  - ${f.id}: ${f.path}`));
    process.exit(1);
  } else {
    console.log('\n✅ ALL AUDIO FILES VALID');
    console.log('No missing or zero-byte files found.');
    process.exit(0);
  }
}

verifyZeroByteAudio().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
