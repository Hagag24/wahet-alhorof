#!/usr/bin/env node
/**
 * Full Spoken Arabic Linguistic Audit Script
 * Phase 1: Discover all spoken Arabic sources
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Configuration
const AUDIO_MANIFEST_PATH = path.join(process.cwd(), 'audio-manifest.json');
const AUDIO_MAPPING_PATH = path.join(process.cwd(), 'lib', 'audio-mapping.ts');
const LESSONS_PATH = path.join(process.cwd(), 'data', 'lessons.ts');
const REVIEW_DIR = path.join(process.cwd(), 'audio-plan', 'review');
const PUBLIC_AUDIO_DIR = path.join(process.cwd(), 'public', 'audio');

// Ensure review directory exists
if (!fs.existsSync(REVIEW_DIR)) {
  fs.mkdirSync(REVIEW_DIR, { recursive: true });
}

// Helper: Get file size and hash
function getFileInfo(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  if (!fs.existsSync(fullPath)) {
    return { exists: false, size: 0, hash: null };
  }
  const stats = fs.statSync(fullPath);
  const content = fs.readFileSync(fullPath);
  return {
    exists: true,
    size: stats.size,
    hash: crypto.createHash('sha256').update(content).digest('hex').substring(0, 16)
  };
}

// Helper: Detect ta-marbuta words ending with ة
function hasTaMarbuta(text) {
  return /ة/.test(text);
}

// Helper: Check if ttsText uses Variant A (containing هْ)
function usesTaMarbutaVariantA(ttsText) {
  return /هْ/.test(ttsText);
}

// Helper: Check for fake normal ت at end (like مدرست)
function hasFakeNormalTa(text) {
  return /[بتثجحخدذرزسشصضطظعغفقكلمنهوي]ت\b/.test(text);
}

// Helper: Check if tashkeel is present
function hasTashkeel(text) {
  return /[َُِّْ]/.test(text);
}

// Helper: Check for proper shadda usage
function hasShadda(text) {
  return /ّ/.test(text);
}

// Helper: Check for proper hamza forms
function hasProperHamza(text) {
  // Check for أ إ ؤ ئ
  return /[أإؤئ]/.test(text);
}

// Categories for classification
const CATEGORIES = {
  WORD: 'word',
  PHRASE: 'phrase',
  STORY_SCENE: 'storyScene',
  LESSON_OBJECTIVE: 'lessonObjective',
  LESSON_DESCRIPTION: 'lessonDescription',
  GAME_INSTRUCTION: 'gameInstruction',
  FEEDBACK: 'feedback',
  INTRO: 'intro'
};

// Main audit function
async function runAudit() {
  console.log('🔍 Starting Full Spoken Arabic Linguistic Audit...\n');

  // 1. Load audio-manifest.json
  console.log('📄 Loading audio-manifest.json...');
  const manifestContent = fs.readFileSync(AUDIO_MANIFEST_PATH, 'utf8');
  // Remove BOM if present
  const cleanContent = manifestContent.replace(/^\uFEFF/, '');
  const manifest = JSON.parse(cleanContent);
  const audioFiles = manifest.files || [];
  console.log(`   Found ${audioFiles.length} audio entries\n`);

  // 2. Load audio-mapping.ts to understand UI usage
  console.log('📄 Loading audio-mapping.ts...');
  const mappingContent = fs.readFileSync(AUDIO_MAPPING_PATH, 'utf8');
  const mappingMatches = [...mappingContent.matchAll(/"([^"]+)":\s*"([^"]+)"/g)];
  const uiMapping = {};
  mappingMatches.forEach(match => {
    uiMapping[match[2]] = match[1]; // audioId -> visible text
  });
  console.log(`   Found ${Object.keys(uiMapping).length} UI mappings\n`);

  // 3. Process each audio entry
  const auditItems = [];
  const taMarbutaIssues = [];
  const tashkeelIssues = [];
  const pacingIssues = [];
  const criticalPreservationChecks = [];

  console.log('🔍 Processing audio entries...');

  for (const file of audioFiles) {
    const fileInfo = getFileInfo(file.path);
    const visibleText = uiMapping[file.id] || null;

    const item = {
      audioId: file.id,
      path: file.path,
      sourceFile: 'audio-manifest.json',
      visibleText: visibleText,
      text: file.text || null,
      ttsText: file.ttsText || null,
      approvedTtsText: file.approvedTtsText || null,
      voice: file.voice || manifest.ttsSettings?.recommendedVoice || 'ar-EG-ShakirNeural',
      category: file.kind || 'unknown',
      group: file.group || null,
      lessonNumber: extractLessonNumber(file.id, file.group),
      mp3Exists: fileInfo.exists,
      mp3Size: fileInfo.size,
      mp3Hash: fileInfo.hash,
      usedInUI: !!visibleText,

      // Linguistic analysis
      hasTaMarbutaInText: hasTaMarbuta(file.text || ''),
      usesVariantA: usesTaMarbutaVariantA(file.ttsText || ''),
      hasFakeNormalTa: hasFakeNormalTa(file.ttsText || ''),
      hasTashkeel: hasTashkeel(file.ttsText || ''),
      hasShadda: hasShadda(file.ttsText || ''),
      hasProperHamza: hasProperHamza(file.ttsText || ''),

      // Length analysis for pacing
      ttsLength: (file.ttsText || '').length,
      sentenceCount: countSentences(file.ttsText || ''),

      // Issues (to be classified in Phase 2)
      issues: []
    };

    // Check critical preservation rules
    if (file.id === 'word-052') {
      const isCorrect = file.ttsText === 'مِيم' || file.ttsText === 'مِيمْ';
      criticalPreservationChecks.push({
        id: file.id,
        expected: 'مِيم',
        actual: file.ttsText,
        passed: isCorrect
      });
    }

    if (file.text === 'م' && file.id !== 'word-052') {
      // Check mapping for م
      const mappedId = uiMapping['م'];
      if (mappedId && mappedId !== 'word-052') {
        criticalPreservationChecks.push({
          id: file.id,
          issue: 'م mapped to wrong ID',
          expected: 'word-052',
          actual: mappedId,
          passed: false
        });
      }
    }

    // Check for ta-marbuta issues (Variant A should be used)
    if (item.hasTaMarbutaInText && !item.usesVariantA && !item.hasFakeNormalTa) {
      taMarbutaIssues.push({
        id: file.id,
        text: file.text,
        ttsText: file.ttsText,
        issue: 'Ta-marbuta not using Variant A (ending with هْ)'
      });
    }

    // Check for fake normal ت
    if (item.hasFakeNormalTa) {
      taMarbutaIssues.push({
        id: file.id,
        text: file.text,
        ttsText: file.ttsText,
        issue: 'Uses fake normal ت instead of Variant A'
      });
    }

    // Check for missing tashkeel
    if ((file.text || '').length > 2 && !item.hasTashkeel && file.kind !== 'word') {
      tashkeelIssues.push({
        id: file.id,
        text: file.text,
        ttsText: file.ttsText,
        issue: 'Missing tashkeel for multi-word content'
      });
    }

    // Check for long narration (pacing issues)
    if (file.kind === 'storyScene' || file.kind === 'lessonObjective' || file.id?.includes('objectives')) {
      const wordCount = (file.ttsText || '').split(/\s+/).length;
      if (wordCount > 15 && item.sentenceCount < 3) {
        pacingIssues.push({
          id: file.id,
          text: file.text,
          ttsText: file.ttsText,
          wordCount,
          sentenceCount: item.sentenceCount,
          issue: 'Long narration with insufficient pauses'
        });
      }
    }

    auditItems.push(item);
  }

  console.log(`   ✅ Processed ${auditItems.length} items\n`);

  // 4. Generate source map
  console.log('📝 Generating source map files...');

  const sourceMap = {
    auditDate: new Date().toISOString(),
    totalItems: auditItems.length,
    items: auditItems
  };

  fs.writeFileSync(
    path.join(REVIEW_DIR, 'full-spoken-arabic-audit-source-map.json'),
    JSON.stringify(sourceMap, null, 2),
    'utf8'
  );

  // Generate markdown summary
  const mdContent = generateSourceMapMarkdown(sourceMap, taMarbutaIssues, tashkeelIssues, pacingIssues, criticalPreservationChecks);
  fs.writeFileSync(
    path.join(REVIEW_DIR, 'full-spoken-arabic-audit-source-map.md'),
    mdContent,
    'utf8'
  );

  console.log('   ✅ Source map files created\n');

  // Summary
  console.log('📊 Audit Summary:');
  console.log(`   Total items scanned: ${auditItems.length}`);
  console.log(`   Items with ta-marbuta issues: ${taMarbutaIssues.length}`);
  console.log(`   Items with tashkeel issues: ${tashkeelIssues.length}`);
  console.log(`   Items with pacing issues: ${pacingIssues.length}`);
  console.log(`   Critical preservation checks: ${criticalPreservationChecks.length}`);
  console.log(`   Items used in UI: ${auditItems.filter(i => i.usedInUI).length}`);
  console.log(`   Items with MP3: ${auditItems.filter(i => i.mp3Exists).length}`);

  return {
    auditItems,
    taMarbutaIssues,
    tashkeelIssues,
    pacingIssues,
    criticalPreservationChecks
  };
}

// Helper: Extract lesson number from ID or group
function extractLessonNumber(id, group) {
  const match = (id || '').match(/lesson-(\d+)/) || (group || '').match(/story-(\d+)/);
  return match ? parseInt(match[1]) : null;
}

// Helper: Count sentences in text
function countSentences(text) {
  if (!text) return 0;
  const sentences = text.split(/[.!?。؟!]+/).filter(s => s.trim().length > 0);
  return sentences.length;
}

// Generate markdown source map
function generateSourceMapMarkdown(sourceMap, taMarbutaIssues, tashkeelIssues, pacingIssues, criticalChecks) {
  return `# Full Spoken Arabic Audit Source Map

**Audit Date:** ${sourceMap.auditDate}

**Total Items:** ${sourceMap.totalItems}

---

## Summary

| Category | Count |
|----------|-------|
| Total Audio Items | ${sourceMap.totalItems} |
| Items with Ta-Marbuta Issues | ${taMarbutaIssues.length} |
| Items with Tashkeel Issues | ${tashkeelIssues.length} |
| Items with Pacing Issues | ${pacingIssues.length} |
| Critical Preservation Checks | ${criticalChecks.length} |

---

## Critical Preservation Status

${criticalChecks.map(check => `- **${check.id}**: ${check.passed ? '✅ PASS' : '❌ FAIL'} (Expected: "${check.expected}", Actual: "${check.actual}")`).join('\n') || 'All critical items preserved correctly.'}

---

## Items by Category

${generateItemsByCategoryTable(sourceMap.items)}

---

## Ta-Marbuta Issues Found

${taMarbutaIssues.map(issue => `### ${issue.id}
- **Text:** ${issue.text}
- **TTS:** ${issue.ttsText}
- **Issue:** ${issue.issue}
`).join('\n') || 'No ta-marbuta issues found.'}

---

## Tashkeel Issues Found

${tashkeelIssues.map(issue => `### ${issue.id}
- **Text:** ${issue.text}
- **TTS:** ${issue.ttsText}
- **Issue:** ${issue.issue}
`).join('\n') || 'No tashkeel issues found.'}

---

## Pacing Issues Found

${pacingIssues.map(issue => `### ${issue.id}
- **Text:** ${issue.text}
- **TTS:** ${issue.ttsText}
- **Word Count:** ${issue.wordCount}
- **Sentence Count:** ${issue.sentenceCount}
- **Issue:** ${issue.issue}
`).join('\n') || 'No pacing issues found.'}

---

## Full Item List

${sourceMap.items.map(item => `### ${item.audioId}
- **Path:** \`${item.path}\`
- **Category:** ${item.category}
- **Group:** ${item.group || 'N/A'}
- **Visible Text:** ${item.visibleText || 'N/A'}
- **Text:** ${item.text || 'N/A'}
- **TTS:** ${item.ttsText || 'N/A'}
- **Voice:** ${item.voice}
- **Lesson:** ${item.lessonNumber || 'N/A'}
- **MP3 Exists:** ${item.mp3Exists ? '✅' : '❌'} (${item.mp3Size} bytes)
- **Used in UI:** ${item.usedInUI ? '✅' : '❌'}
`).join('\n')}
`;
}

function generateItemsByCategoryTable(items) {
  const byCategory = {};
  items.forEach(item => {
    byCategory[item.category] = (byCategory[item.category] || 0) + 1;
  });

  return `| Category | Count |
|----------|-------|
${Object.entries(byCategory).map(([cat, count]) => `| ${cat} | ${count} |`).join('\n')}`;
}

// Run the audit
runAudit()
  .then(() => {
    console.log('\n✅ Phase 1 Complete: Source map generated');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
