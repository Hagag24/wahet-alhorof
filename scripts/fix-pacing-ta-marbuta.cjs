#!/usr/bin/env node
/**
 * Fix ta-marbuta Variant A in pacing fixes and regenerate affected files
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const AUDIO_MANIFEST_PATH = path.join(process.cwd(), 'audio-manifest.json');

// Ta-marbuta Variant A: Replace ة with هْ at end of words
function applyTaMarbutaVariantA(text) {
  // Match ta-marbuta (ة) with optional tashkeel after it
  // Replace with هْ followed by the same tashkeel
  return text.replace(/ة([\u064B-\u065F\u0670]*)([^\u0621-\u064A]|$)/g, 'هْ$1$2');
}

// Items that need ta-marbuta fix
const ITEMS_TO_FIX = [
  'official_intro_scene_2',
  'official_intro_scene_3',
  'welcome_intro_scene_3'
];

async function fixTaMarbutaInPacing() {
  console.log('🔧 Fixing Ta-marbuta Variant A in pacing fixes...\n');

  // Load manifest
  const manifestContent = fs.readFileSync(AUDIO_MANIFEST_PATH, 'utf8');
  const manifest = JSON.parse(manifestContent.replace(/^\uFEFF/, ''));

  let fixedCount = 0;

  for (const itemId of ITEMS_TO_FIX) {
    const item = manifest.files.find(f => f.id === itemId);
    if (!item) {
      console.warn(`⚠️  Item ${itemId} not found`);
      continue;
    }

    const oldTts = item.ttsText;
    const newTts = applyTaMarbutaVariantA(oldTts);

    if (oldTts !== newTts) {
      item.ttsText = newTts;
      item.pronunciationNotes = (item.pronunciationNotes || '') +
        ' + Ta-marbuta Variant A applied.';
      fixedCount++;

      console.log(`✅ ${itemId}:`);
      console.log(`   Before: ${oldTts.substring(0, 60)}...`);
      console.log(`   After:  ${newTts.substring(0, 60)}...\n`);
    } else {
      console.log(`⏭️  ${itemId}: No changes needed\n`);
    }
  }

  // Save manifest
  fs.writeFileSync(AUDIO_MANIFEST_PATH, JSON.stringify(manifest, null, 4), 'utf8');
  console.log(`✅ Manifest updated: ${fixedCount} items fixed\n`);

  // Regenerate the 3 files
  if (fixedCount > 0) {
    console.log('🎙️  Regenerating affected MP3 files...\n');
    const idArgs = ITEMS_TO_FIX.join(' ');
    const pythonCmd = `py generate-audio.py ${idArgs}`;

    console.log(`   Command: ${pythonCmd}\n`);

    try {
      execSync(pythonCmd, {
        stdio: 'inherit',
        cwd: process.cwd(),
        timeout: 120000
      });
      console.log('\n✅ Regeneration complete\n');
    } catch (error) {
      console.error('\n❌ Regeneration failed:', error.message);
      throw error;
    }
  }

  return fixedCount;
}

fixTaMarbutaInPacing()
  .then((count) => {
    console.log(`✅ Complete: ${count} files fixed and regenerated`);
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
