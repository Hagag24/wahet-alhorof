#!/usr/bin/env node
/**
 * Phase 1: Audit long spoken items for pacing issues
 * Detects narration that sounds like one continuous breath without proper pauses
 */

const fs = require('fs');
const path = require('path');

// Paths
const REVIEW_DIR = path.join(process.cwd(), 'audio-plan', 'review');
const AUDIO_MANIFEST_PATH = path.join(process.cwd(), 'audio-manifest.json');

// Target categories for pacing audit
const PACING_CATEGORIES = [
  'story', 'storyScene', 'scene', 'objective', 'lessonObjective',
  'intro', 'warmup', 'explanation', 'instruction', 'description',
  'character', 'result', 'reward', 'lesson'
];

// Long narration groups
const PACING_GROUPS = [
  'story', 'story-scene', 'lesson-intro', 'lesson-objectives',
  'game-instruction', 'explanation', 'welcome', 'official'
];

// Issue types
const ISSUE_TYPES = {
  ACCEPTABLE: 'ACCEPTABLE',
  NEEDS_PAUSE_RHYTHM_FIX: 'NEEDS_PAUSE_RHYTHM_FIX',
  NEEDS_HUMAN_REVIEW: 'NEEDS_HUMAN_REVIEW'
};

// Check if item is a long spoken narration type
function isLongSpokenItem(item) {
  // Check category
  const category = item.category || item.kind || '';
  if (PACING_CATEGORIES.some(c => category.toLowerCase().includes(c))) {
    return true;
  }

  // Check group
  const group = item.group || '';
  if (PACING_GROUPS.some(g => group.toLowerCase().includes(g))) {
    return true;
  }

  // Check ID patterns
  const id = item.id || item.audioId || '';
  const longPatterns = [
    /story-?\d+/i, /scene-?\d+/i, /lesson-\d+-full/i,
    /lesson-\d+-objectives/i, /welcome/i, /intro/i,
    /official-intro/i, /warmup/i
  ];
  if (longPatterns.some(p => p.test(id))) {
    return true;
  }

  // Check text length - anything over 50 chars is potentially long
  const text = item.ttsText || item.text || '';
  if (text.length > 50) {
    return true;
  }

  return false;
}

// Analyze pacing quality
function analyzePacing(ttsText) {
  if (!ttsText) return { issue: ISSUE_TYPES.ACCEPTABLE, reasons: [] };

  const reasons = [];
  let score = 0; // 0 = good, higher = more issues

  // Count words
  const words = ttsText.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;

  // Count sentences (by period, question mark, exclamation)
  const sentenceMatches = ttsText.match(/[.!?؟。]+/g);
  const sentenceCount = sentenceMatches ? sentenceMatches.length : 0;

  // Count Arabic commas
  const commaMatches = ttsText.match(/[،,]/g);
  const commaCount = commaMatches ? commaMatches.length : 0;

  // Check for multiple ideas in one sentence (run-on)
  // Look for connecting words that might indicate run-on sentences
  const connectingWords = ['ثُمَّ', 'ثم', 'وَ', 'و', 'بَعْدَ', 'بعد', 'لِذَلِكَ', 'لذلك',
    'لِأَنَّ', 'لأن', 'عِنْدَمَا', 'عندما', 'فَ', 'ف', 'لَكِنَّ', 'لكن'];
  const connectingCount = connectingWords.reduce((count, word) => {
    const matches = ttsText.match(new RegExp(word, 'g'));
    return count + (matches ? matches.length : 0);
  }, 0);

  // Criteria for pacing issues

  // 1. Very long text with few sentences
  if (wordCount > 15 && sentenceCount === 0) {
    reasons.push(`No sentence breaks in ${wordCount}-word text`);
    score += 3;
  }

  // 2. Long text with only 1 sentence
  if (wordCount > 20 && sentenceCount <= 1) {
    reasons.push(`Long text (${wordCount} words) with only ${sentenceCount} sentence(s)`);
    score += 2;
  }

  // 3. Very long sentence (>30 words without break)
  if (wordCount > 30 && sentenceCount < 2) {
    reasons.push(`Very long run-on sentence: ${wordCount} words, ${sentenceCount} sentence(s)`);
    score += 3;
  }

  // 4. Multiple actions in one sentence (instructional)
  const actionWords = ['اِسْتَمِعْ', 'استمع', 'انْظُرْ', 'انظر', 'اخْتَرْ', 'اختر',
    'اِضْغَطْ', 'اضغط', 'أَجِبْ', 'أجب', 'اقْرَأْ', 'اقرأ'];
  const actionCount = actionWords.reduce((count, word) => {
    const matches = ttsText.match(new RegExp(word, 'g'));
    return count + (matches ? matches.length : 0);
  }, 0);

  if (actionCount >= 3 && sentenceCount <= 1) {
    reasons.push(`${actionCount} action verbs in one sentence: needs breaks between steps`);
    score += 3;
  }

  // 5. Objective narration listing multiple skills
  if (wordCount > 25 && ttsText.includes('تَتَعَلَّمُ') || ttsText.includes('ستتعلم')) {
    const skillConnectors = (ttsText.match(/،/g) || []).length;
    if (skillConnectors < 2) {
      reasons.push(`Multiple learning objectives without proper pauses`);
      score += 2;
    }
  }

  // 6. Missing commas in medium-length text
  if (wordCount > 15 && commaCount === 0 && sentenceCount <= 1) {
    reasons.push(`No comma pauses in ${wordCount}-word text`);
    score += 1;
  }

  // 7. Story narration with multiple actions
  const storyMarkers = ['رَأَى', 'رأى', 'ذَهَبَ', 'ذهب', 'جَلَسَ', 'جلس', 'وَجَدَ', 'وجد'];
  const storyActionCount = storyMarkers.reduce((count, word) => {
    const matches = ttsText.match(new RegExp(word, 'g'));
    return count + (matches ? matches.length : 0);
  }, 0);

  if (storyActionCount >= 2 && sentenceCount < 2 && commaCount < 2) {
    reasons.push(`Story narration with ${storyActionCount} actions needs more pauses`);
    score += 2;
  }

  // Determine classification
  if (score >= 3) {
    return { issue: ISSUE_TYPES.NEEDS_PAUSE_RHYTHM_FIX, reasons, wordCount, sentenceCount, commaCount };
  } else if (score >= 1) {
    return { issue: ISSUE_TYPES.NEEDS_HUMAN_REVIEW, reasons, wordCount, sentenceCount, commaCount };
  } else {
    return { issue: ISSUE_TYPES.ACCEPTABLE, reasons, wordCount, sentenceCount, commaCount };
  }
}

// Main function
async function runPacingAudit() {
  console.log('🎙️  Phase 1: Auditing Spoken Pacing...\n');

  // Load audio manifest
  console.log('📄 Loading audio-manifest.json...');
  const manifestContent = fs.readFileSync(AUDIO_MANIFEST_PATH, 'utf8');
  const manifest = JSON.parse(manifestContent.replace(/^\uFEFF/, ''));
  const files = manifest.files || [];

  // Filter for long spoken items
  console.log('🔍 Filtering for long spoken narration items...');
  const longSpokenItems = files.filter(isLongSpokenItem);
  console.log(`   Found ${longSpokenItems.length} long spoken items\n`);

  // Analyze each item
  console.log('🎵 Analyzing pacing quality...');
  const auditedItems = [];
  const acceptable = [];
  const needsFix = [];
  const needsReview = [];

  for (const item of longSpokenItems) {
    const ttsText = item.ttsText || item.text || '';
    const pacing = analyzePacing(ttsText);

    const audited = {
      audioId: item.id,
      path: item.path,
      category: item.kind || 'unknown',
      group: item.group || null,
      text: item.text,
      ttsText: ttsText,
      wordCount: pacing.wordCount || 0,
      sentenceCount: pacing.sentenceCount || 0,
      commaCount: pacing.commaCount || 0,
      issue: pacing.issue,
      reasons: pacing.reasons,
      confidence: pacing.issue === ISSUE_TYPES.NEEDS_PAUSE_RHYTHM_FIX ? 'high' :
                  pacing.issue === ISSUE_TYPES.NEEDS_HUMAN_REVIEW ? 'medium' : 'high'
    };

    auditedItems.push(audited);

    if (pacing.issue === ISSUE_TYPES.ACCEPTABLE) {
      acceptable.push(audited);
    } else if (pacing.issue === ISSUE_TYPES.NEEDS_PAUSE_RHYTHM_FIX) {
      needsFix.push(audited);
    } else if (pacing.issue === ISSUE_TYPES.NEEDS_HUMAN_REVIEW) {
      needsReview.push(audited);
    }
  }

  console.log(`   ✅ Acceptable: ${acceptable.length}`);
  console.log(`   ⚠️  Needs pause/rhythm fix: ${needsFix.length}`);
  console.log(`   🤔 Needs human review: ${needsReview.length}\n`);

  // Generate reports
  console.log('📝 Generating pacing audit reports...');

  const auditData = {
    auditDate: new Date().toISOString(),
    totalLongSpoken: longSpokenItems.length,
    acceptable: acceptable.length,
    needsPauseRhythmFix: needsFix.length,
    needsHumanReview: needsReview.length,
    items: auditedItems
  };

  fs.writeFileSync(
    path.join(REVIEW_DIR, 'spoken-pacing-audit.json'),
    JSON.stringify(auditData, null, 2),
    'utf8'
  );

  const mdReport = generatePacingAuditMarkdown(auditData, acceptable, needsFix, needsReview);
  fs.writeFileSync(
    path.join(REVIEW_DIR, 'spoken-pacing-audit.md'),
    mdReport,
    'utf8'
  );

  console.log('   ✅ Reports generated:');
  console.log('      - spoken-pacing-audit.json');
  console.log('      - spoken-pacing-audit.md\n');

  console.log('✅ Phase 1 Complete: Spoken pacing audit finished');

  return { auditedItems, acceptable, needsFix, needsReview };
}

function generatePacingAuditMarkdown(data, acceptable, needsFix, needsReview) {
  return `# Spoken Pacing Audit Report

**Audit Date:** ${data.auditDate}

---

## Summary

| Metric | Count |
|--------|-------|
| Total Long Spoken Items | ${data.totalLongSpoken} |
| ✅ Acceptable | ${data.acceptable} |
| ⚠️ Needs Pause/Rhythm Fix | ${data.needsPauseRhythmFix} |
| 🤔 Needs Human Review | ${data.needsHumanReview} |

---

## Items Needing Pause/Rhythm Fix (High Confidence)

${needsFix.map((item, idx) => `### ${idx + 1}. ${item.audioId}
| Field | Value |
|-------|-------|
| Path | \`${item.path}\` |
| Category | ${item.category} |
| Group | ${item.group || 'N/A'} |
| Words | ${item.wordCount} |
| Sentences | ${item.sentenceCount} |
| Commas | ${item.commaCount} |

**Current TTS:**
\`\`\`
${item.ttsText}
\`\`\`

**Issues:**
${item.reasons.map(r => `- ${r}`).join('\n')}

`).join('---\n\n')}

---

## Items Needing Human Review (Medium Confidence)

${needsReview.map((item, idx) => `### ${idx + 1}. ${item.audioId}
- **Path:** \`${item.path}\`
- **Words:** ${item.wordCount}, **Sentences:** ${item.sentenceCount}
- **Issues:** ${item.reasons.join('; ')}
- **TTS Preview:** ${item.ttsText.substring(0, 80)}${item.ttsText.length > 80 ? '...' : ''}
`).join('\n')}

---

## Acceptable Items

${acceptable.map(item => `- **${item.audioId}**: ${item.wordCount} words, ${item.sentenceCount} sentences`).join('\n')}

---

## Next Steps

1. Review items needing pause/rhythm fix
2. Apply high-confidence fixes to ttsText
3. Add fixed items to regeneration list
4. Run verification

**Note:** This audit focused on breathing/pacing quality in spoken narration.
`;
}

// Run
runPacingAudit()
  .then(() => {
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
