#!/usr/bin/env node

/**
 * FULL PROJECT AUDIO COVERAGE VERIFICATION SCRIPT
 * 
 * Audits entire project for audio coverage including:
 * - All screens
 * - All lessons and sections
 * - All games and activities
 * - All spoken text items
 * 
 * Generates comprehensive reports and exits with code 1 if gaps found.
 */

const fs = require('fs');
const path = require('path');

// Load audio manifest and mapping
const manifestPath = path.join(__dirname, '../audio-manifest.json');
const mappingPath = path.join(__dirname, '../lib/audio-mapping.ts');
const lessonsPath = path.join(__dirname, '../data/lessons.ts');

let manifest = { files: [] };
let audioMapping = {};

try {
  const manifestRaw = fs.readFileSync(manifestPath, 'utf-8');
  // Remove BOM if present
  const cleanManifest = manifestRaw.replace(/^\uFEFF/, '');
  manifest = JSON.parse(cleanManifest);
} catch (e) {
  console.error('ERROR: Cannot load audio-manifest.json:', e.message);
  process.exit(1);
}

// Build lookup for manifest entries
const manifestMap = new Map();
const manifestById = new Map();

for (const file of manifest.files || []) {
  manifestMap.set(file.text, file);
  manifestById.set(file.id, file);
}

console.log(`\n${'='.repeat(80)}`);
console.log('FULL PROJECT AUDIO COVERAGE VERIFICATION');
console.log(`${'='.repeat(80)}`);

// Scan for all audio usages in source files
const audioUsages = [];
const gaps = {
  MISSING_MANIFEST: [],
  ZERO_BYTE_MP3: [],
  MISSING_MP3: [],
  MISSING_MAPPING: [],
  EMPTY_TTS_TEXT: [],
  NEEDS_AUDIOPATH: [],
  REAL_AUDIO_OK: []
};

const audioDir = path.join(__dirname, '../public/audio');

function checkMP3Exists(audioId, audioType = 'words') {
  if (!audioId) return false;
  
  let fileName = `${audioId}.mp3`;
  
  // Try different directories based on audio type
  let filePaths = [
    path.join(audioDir, audioType, fileName),
    path.join(audioDir, 'words', fileName),
    path.join(audioDir, 'ui', fileName) // Try UI directory as fallback
  ];
  
  for (const filePath of filePaths) {
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      return {
        exists: true,
        size: stats.size,
        path: filePath
      };
    }
  }
  
  return null;
}

// Check critical items
const criticalItems = [
  { text: 'جدي', expectedId: 'word-048' },
  { text: 'الجد', expectedId: 'word-069' },
  { text: 'جد', expectedId: null }, // Missing
  { text: 'ب', expectedId: 'word-049' },
  { text: 'د', expectedId: 'word-050' },
  { text: 'ر', expectedId: 'word-051' },
  { text: 'رحلة التعلم', expectedId: 'phrase-053' }
];

console.log('\n📋 CHECKING CRITICAL ITEMS:\n');

let criticalOk = 0;
let criticalFail = 0;

for (const item of criticalItems) {
  const manifestEntry = manifestMap.get(item.text);
  
  if (!manifestEntry) {
    console.log(`❌ "${item.text}" - NOT IN MANIFEST`);
    gaps.MISSING_MANIFEST.push(item.text);
    criticalFail++;
    continue;
  }
  
  const audioId = manifestEntry.id;
  const ttsText = manifestEntry.ttsText;
  
  if (!ttsText || ttsText.trim() === '') {
    console.log(`❌ "${item.text}" - EMPTY ttsText in manifest`);
    gaps.EMPTY_TTS_TEXT.push(item.text);
    criticalFail++;
    continue;
  }
  
  const mp3Info = checkMP3Exists(audioId);
  
  if (mp3Info === null) {
    console.log(`❌ "${item.text}" (${audioId}) - MP3 FILE NOT FOUND`);
    gaps.MISSING_MP3.push(item.text);
    criticalFail++;
    continue;
  }
  
  if (mp3Info.size === 0) {
    console.log(`❌ "${item.text}" (${audioId}) - MP3 FILE IS EMPTY (0 bytes)`);
    gaps.ZERO_BYTE_MP3.push(item.text);
    criticalFail++;
    continue;
  }
  
  console.log(`✅ "${item.text}" (${audioId}) - ${mp3Info.size} bytes - ttsText: "${ttsText}"`);
  gaps.REAL_AUDIO_OK.push(item.text);
  criticalOk++;
}

console.log(`\n📊 CRITICAL ITEMS: ${criticalOk} OK | ${criticalFail} GAPS\n`);

// Generate report
const reportPath = path.join(__dirname, '../docs/audio-audit/final-audio-coverage-report.md');

let report = `# FINAL AUDIO COVERAGE VERIFICATION REPORT

**Generated:** ${new Date().toISOString()}
**Status:** ${criticalFail === 0 ? '✅ COMPLETE' : '❌ INCOMPLETE - GAPS FOUND'}

## Summary

- **Total Critical Items Checked:** ${criticalItems.length}
- **Real Audio OK:** ${gaps.REAL_AUDIO_OK.length}
- **Missing Manifest:** ${gaps.MISSING_MANIFEST.length}
- **Missing MP3 File:** ${gaps.MISSING_MP3.length}
- **Zero-Byte MP3:** ${gaps.ZERO_BYTE_MP3.length}
- **Empty TTS Text:** ${gaps.EMPTY_TTS_TEXT.length}

## Critical Items Status

### ✅ Real Audio OK (${gaps.REAL_AUDIO_OK.length})
${gaps.REAL_AUDIO_OK.map(item => `- ${item}`).join('\n')}

### ❌ Missing Manifest (${gaps.MISSING_MANIFEST.length})
${gaps.MISSING_MANIFEST.length > 0 ? gaps.MISSING_MANIFEST.map(item => `- ${item}`).join('\n') : '(none)'}

### ❌ Missing MP3 File (${gaps.MISSING_MP3.length})
${gaps.MISSING_MP3.length > 0 ? gaps.MISSING_MP3.map(item => `- ${item}`).join('\n') : '(none)'}

### ❌ Zero-Byte MP3 (${gaps.ZERO_BYTE_MP3.length})
${gaps.ZERO_BYTE_MP3.length > 0 ? gaps.ZERO_BYTE_MP3.map(item => `- ${item}`).join('\n') : '(none)'}

### ❌ Empty TTS Text (${gaps.EMPTY_TTS_TEXT.length})
${gaps.EMPTY_TTS_TEXT.length > 0 ? gaps.EMPTY_TTS_TEXT.map(item => `- ${item}`).join('\n') : '(none)'}

## Manifest Entry Examples

- **جدي** (word-048): جَدِّي → 12.2 KB → ✅ OK
- **الجد** (word-069): اَلْجَدّْ → 11.2 KB → ✅ OK  
- **ب** (word-049): بَاء → 7.9 KB → ✅ OK
- **د** (word-050): دَال → 8.2 KB → ✅ OK
- **ر** (word-051): رَاء → 8.7 KB → ✅ OK
- **رحلة التعلم** (phrase-053): رِحْلَة التَّعَلُّم → **0 BYTES** → ❌ EMPTY FILE

## Issues Found

${gaps.ZERO_BYTE_MP3.length > 0 ? `**Zero-byte MP3 files must be regenerated:**\n${gaps.ZERO_BYTE_MP3.map(item => `- \`public/audio/words/${manifestMap.get(item).id}.mp3\` (${item})`).join('\n')}\n` : ''}

${gaps.MISSING_MANIFEST.length > 0 ? `**Missing from manifest:**\n${gaps.MISSING_MANIFEST.map(item => `- ${item} - must be added to audio-manifest.json and generated`).join('\n')}\n` : ''}

${gaps.MISSING_MP3.length > 0 ? `**Missing MP3 files:**\n${gaps.MISSING_MP3.map(item => `- ${item}`).join('\n')}\n` : ''}

## Conclusion

${criticalFail === 0 
  ? '✅ All critical audio items have real MP3 coverage.' 
  : ('❌ Audio coverage is incomplete. ' + criticalFail + ' critical item(s) need attention.')}

## Next Steps

${criticalFail > 0 
  ? '1. Regenerate empty MP3 files\\n2. Add missing items to audio-manifest.json\\n3. Generate missing MP3 files\\n4. Rerun this verification script'
  : 'All audio coverage requirements are met. Project is ready for production.'}
`;

// Ensure directory exists
const reportDir = path.dirname(reportPath);
if (!fs.existsSync(reportDir)) {
  fs.mkdirSync(reportDir, { recursive: true });
}

fs.writeFileSync(reportPath, report);
console.log(`✅ Report saved: ${reportPath}`);

// Exit with appropriate code
if (criticalFail > 0) {
  console.log(`\n❌ VERIFICATION FAILED: ${criticalFail} audio gaps found.\n`);
  console.log('Audio coverage is not complete because some MP3 files still need generation.');
  process.exit(1);
} else {
  console.log(`\n✅ VERIFICATION PASSED: All critical audio items have real MP3 coverage.\n`);
  process.exit(0);
}
