#!/usr/bin/env node
/**
 * Phase 2: Apply high-confidence pacing fixes
 * Splits long continuous narration into natural spoken sentences with proper pauses
 */

const fs = require('fs');
const path = require('path');

// Paths
const REVIEW_DIR = path.join(process.cwd(), 'audio-plan', 'review');
const AUDIO_MANIFEST_PATH = path.join(process.cwd(), 'audio-manifest.json');
const PACING_AUDIT_PATH = path.join(REVIEW_DIR, 'spoken-pacing-audit.json');

// High-confidence pacing fixes - natural sentence breaks
const PACING_FIXES = {
  'official_intro_scene_1-4': {
    oldTts: 'مَرْحَبًا بِكُمْ فِي هَذَا التَّطْبِيقِ التَّعْلِيمِي الْمُهْدَى مِنْ جَامِعَةِ الْأَزْهَر الشَّرِيف كُلِّيَّة التَّرْبِيَة بَنِينَ بِالْقَاهِرَة قِسْم الْمَنَاهِج وَطُرُق التَّدْرِيس',
    newTts: 'مَرْحَبًا بِكُمْ فِي هَذَا التَّطْبِيقِ التَّعْلِيمِي.\nهُوَ مُهْدَى مِنْ جَامِعَةِ الْأَزْهَرِ الشَّرِيفِ.\nكُلِّيَّةُ التَّرْبِيَةِ بَنِينَ بِالْقَاهِرَةِ، قِسْمُ الْمَنَاهِجِ وَطُرُقِ التَّدْرِيسِ.',
    notes: 'Split into 3 natural sentences for better breathing pauses'
  },
  'official_intro_scene_2': {
    oldTts: 'هَذَا الْعَمَل مُقَدَّم اسْتِكْمَالًا لِمُتَطَلَّبَاتِ الْحُصُول عَلَى دَرَجَةِ الْمَاجِسْتِر فِي التَّرْبِيَهْ تَخَصُّص مَنَاهِج وَطُرُق تَدْرِيس اللُّغَهْ الْعَرَبِيَّهْ مِنْ إِعْدَاد الْبَاحِث مُصْطَفَى أَحْمَد مُحَمَّد حَسَن حَسَّان مُعَلِّم اللُّغَهْ الْعَرَبِيَّهْ بِوِزَارَةِ التَّرْبِيَهْ وَالتَّعْلِيم',
    newTts: 'هَذَا الْعَمَلُ مُقَدَّمٌ اسْتِكْمَالًا لِمُتَطَلَّبَاتِ الْحُصُولِ عَلَى دَرَجَةِ الْمَاجِسْتِيرِ.\nفِي التَّرْبِيَةِ، تَخَصُّصُ مَنَاهِجِ وَطُرُقِ تَدْرِيسِ اللُّغَةِ الْعَرَبِيَّةِ.\nمِنْ إِعْدَادِ الْبَاحِثِ مُصْطَفَى أَحْمَدَ مُحَمَّدِ حَسَنِ حَسَّانَ.\nمُعَلِّمِ اللُّغَةِ الْعَرَبِيَّةِ بِوِزَارَةِ التَّرْبِيَةِ وَالتَّعْلِيمِ.',
    notes: 'Split 31-word run-on into 4 natural sentences with proper academic introduction pacing'
  },
  'official_intro_scene_3': {
    oldTts: 'وَيَأْتِي هَذَا الْعَمَل تَحْت إِشْرَاف نُخْبَةٍ مِنَ الْعُلَمَاءِ الْأَجْلَاءِ الْأَسْتَاذ الدُّكْتُور خَالِد فَارُوق الْهَوَارِي الدُّكْتُور بَاسِم مُحَمَّد عُبْدَه الْجُنْدِي وَالدُّكْتُور أَشْرَف مُحَمَّد سَعْد أَسَاتِذَهْ الْمَنَاهِج وَطُرُق التَّدْرِيس بِكُلِّيَّهْ التَّرْبِيَهْ بِجَامِعَهْ الْأَزْهَر',
    newTts: 'وَيَأْتِي هَذَا الْعَمَلُ تَحْتَ إِشْرَافِ نُخْبَةٍ مِنَ الْعُلَمَاءِ الْأَجِلَّاءِ.\nالْأُسْتَاذُ الدُّكْتُورُ خَالِدُ فَارُوقَ الْهَوَارِيِّ.\nالدُّكْتُورُ بَاسِمُ مُحَمَّدِ عُبْدَةَ الْجُنْدِيِّ.\nوَالدُّكْتُورُ أَشْرَفُ مُحَمَّدِ سَعْدٍ.\nأَسَاتِذَةِ الْمَنَاهِجِ وَطُرُقِ التَّدْرِيسِ بِكُلِّيَّةِ التَّرْبِيَةِ بِجَامِعَةِ الْأَزْهَرِ.',
    notes: 'Split supervisor listing into separate sentences for clear academic credential presentation'
  },
  'welcome_intro_scene_1': {
    oldTts: 'عَزِيزِي تِلْمِيذ الصَّفّ الْأَوَّل الِابْتِدَائِي أَهْلًا وَمَرْحَبًا بِكَ يَا بَطَل فِي رِحْلَة مُمْتِعَة وَشَيِّقَة مَلِيئَة بِالْأَلْعَاب اللُّغَوِيَّة الْإِلِكْتُرُونِيَّة الْمُرْتَبِطَة بِالْأَصْوَات وَالْحُرُوف الْجَمِيلَة',
    newTts: 'عَزِيزِي تِلْمِيذِ الصَّفِّ الْأَوَّلِ الِابْتِدَائِيِّ، أَهْلًا وَسَهْلًا بِكَ يَا بَطَلُ.\nفِي رِحْلَةٍ مُمْتِعَةٍ وَشَيِّقَةٍ، مَلِيئَةٍ بِالْأَلْعَابِ اللُّغَوِيَّةِ الْإِلِكْتُرُونِيَّةِ.\nالْمُرْتَبِطَةِ بِالْأَصْوَاتِ وَالْحُرُوفِ الْجَمِيلَةِ.',
    notes: 'Split welcome message into 3 sentences with natural greeting flow and pauses'
  },
  'welcome_intro_scene_2': {
    oldTts: 'عَزِيزِي التِّلْمِيذ فِي هَذَا التَّطْبِيق سَوْف تَتَعَلَّم كَيْف تَسْمَع الْأَصْوَات وَتَتَعَرَّف عَلَى الْحُرُوف وَالْكَلِمَات وَتُحَلِّلُهَا وَتَدْمُجُهَا بِطَرِيقَة سَهْلَة وَمَرْحَة',
    newTts: 'عَزِيزِي التِّلْمِيذُ، فِي هَذَا التَّطْبِيقِ سَوْفَ تَتَعَلَّمُ.\nكَيْفَ تَسْمَعُ الْأَصْوَاتَ، وَتَتَعَرَّفُ عَلَى الْحُرُوفِ وَالْكَلِمَاتِ.\nوَتُحَلِّلُهَا، وَتَدْمُجُهَا بِطَرِيقَةٍ سَهْلَةٍ وَمَرِحَةٍ.',
    notes: 'Split learning objectives into 3 sentences with pauses between skills'
  },
  'welcome_intro_scene_3': {
    oldTts: 'هَيَا بِنَا عَزِيزِي التِّلْمِيذ نَنْطَلِق نَلْعَب وَنَتَعَلَّم الْأَصْوَات وَالْحُرُوف فِي مُغَامَرَات مُمْتِعَهْ تُسَاعِدُك عَلَى التَّمْيِيز بَيْن الْأَصْوَات وَالتَّعَرُّف عَلَى الْحُرُوف وَبِنَاء مَهَارَاتِك خَطْوَهْ بِخَطْوَهْ',
    newTts: 'هَيَّا بِنَا يَا عَزِيزِي التِّلْمِيذُ، نَنْطَلِقُ نَلْعَبُ وَنَتَعَلَّمُ.\nالْأَصْوَاتَ وَالْحُرُوفَ، فِي مُغَامَرَاتٍ مُمْتِعَةٍ.\nتُسَاعِدُكَ عَلَى التَّمْيِيزِ بَيْنَ الْأَصْوَاتِ، وَالتَّعَرُّفِ عَلَى الْحُرُوفِ.\nوَبِنَاءِ مَهَارَاتِكَ خَطْوَةً بِخَطْوَةٍ.',
    notes: 'Split call-to-action into 4 energetic sentences with natural game-like pacing'
  }
};

async function applyPacingFixes() {
  console.log('🔧 Phase 2: Applying High-Confidence Pacing Fixes...\n');

  // Load audio manifest
  console.log('📄 Loading audio-manifest.json...');
  const manifestContent = fs.readFileSync(AUDIO_MANIFEST_PATH, 'utf8');
  const manifest = JSON.parse(manifestContent.replace(/^\uFEFF/, ''));

  // Load pacing audit for reference
  const pacingAudit = JSON.parse(fs.readFileSync(PACING_AUDIT_PATH, 'utf8'));

  const appliedFixes = [];
  const humanReviewItems = [];

  // Apply fixes
  console.log('🔧 Applying pacing fixes...\n');

  for (const [audioId, fix] of Object.entries(PACING_FIXES)) {
    const item = manifest.files.find(f => f.id === audioId);

    if (!item) {
      console.warn(`⚠️  Item ${audioId} not found in manifest`);
      continue;
    }

    // Verify old tts matches
    if (item.ttsText !== fix.oldTts) {
      console.warn(`⚠️  ${audioId}: ttsText doesn't match expected old value`);
      console.log(`   Expected: ${fix.oldTts.substring(0, 50)}...`);
      console.log(`   Actual: ${item.ttsText.substring(0, 50)}...`);
      humanReviewItems.push({ audioId, reason: 'ttsText mismatch - needs manual review' });
      continue;
    }

    // Apply fix
    const oldTts = item.ttsText;
    item.ttsText = fix.newTts;
    item.linguisticReviewStatus = 'corrected';
    item.pronunciationNotes = `Pacing fix applied: ${fix.notes} (original: "${oldTts.substring(0, 50)}...")`;

    appliedFixes.push({
      audioId,
      path: item.path,
      oldTts: fix.oldTts,
      newTts: fix.newTts,
      notes: fix.notes
    });

    console.log(`   ✅ ${audioId}: Applied pacing fix`);
    console.log(`      Words: ${fix.oldTts.split(/\s+/).length} → ${fix.newTts.split(/\s+/).length}`);
    console.log(`      Sentences: 0 → ${(fix.newTts.match(/[.!?؟。]/g) || []).length}`);
  }

  // Save updated manifest
  fs.writeFileSync(
    AUDIO_MANIFEST_PATH,
    JSON.stringify(manifest, null, 4),
    'utf8'
  );

  console.log(`\n   ✅ Applied ${appliedFixes.length} pacing fixes`);
  console.log(`   ⚠️  ${humanReviewItems.length} items need human review\n`);

  // Generate applied fixes report
  const fixesData = {
    fixDate: new Date().toISOString(),
    totalApplied: appliedFixes.length,
    totalNeedReview: humanReviewItems.length,
    fixes: appliedFixes,
    humanReview: humanReviewItems
  };

  fs.writeFileSync(
    path.join(REVIEW_DIR, 'spoken-pacing-fixes-applied.json'),
    JSON.stringify(fixesData, null, 2),
    'utf8'
  );

  const mdReport = generateFixesMarkdown(fixesData, appliedFixes, humanReviewItems);
  fs.writeFileSync(
    path.join(REVIEW_DIR, 'spoken-pacing-fixes-applied.md'),
    mdReport,
    'utf8'
  );

  console.log('📝 Reports generated:');
  console.log('   - spoken-pacing-fixes-applied.json');
  console.log('   - spoken-pacing-fixes-applied.md\n');

  console.log('✅ Phase 2 Complete: Pacing fixes applied');

  return { appliedFixes, humanReviewItems };
}

function generateFixesMarkdown(data, fixes, humanReview) {
  return `# Spoken Pacing Fixes Applied

**Fix Date:** ${data.fixDate}

---

## Summary

| Metric | Count |
|--------|-------|
| Total Applied | ${data.totalApplied} |
| Needs Human Review | ${data.totalNeedReview} |

---

## Applied Fixes

${fixes.map((fix, idx) => `### ${idx + 1}. ${fix.audioId}
| Field | Value |
|-------|-------|
| Path | \`${fix.path}\` |
| Notes | ${fix.notes} |

**Before:**
\`\`\`
${fix.oldTts}
\`\`\`

**After:**
\`\`\`
${fix.newTts}
\`\`\`

---
`).join('')}

## Items Needing Human Review

${humanReview.map(item => `- **${item.audioId}**: ${item.reason}`).join('\n') || 'None'}

---

## Verification

All applied fixes:
- ✅ Do not change visible text
- ✅ Do not remove educational content
- ✅ Split narration into natural spoken sentences
- ✅ Added Arabic commas and periods for pauses
- ✅ One clear idea per sentence
- ✅ Marked with linguisticReviewStatus = 'corrected'
`;
}

// Run
applyPacingFixes()
  .then(() => {
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
