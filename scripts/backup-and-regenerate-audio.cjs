#!/usr/bin/env node
/**
 * Backup existing audio files and regenerate using Edge TTS
 * Only regenerates the 34 files in the regeneration list
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

// Paths
const REGENERATION_LIST_PATH = path.join(process.cwd(), 'audio-plan/review/full-spoken-arabic-regeneration-required.json');
const BACKUP_DIR = path.join(process.cwd(), 'audio-plan/backups/before-full-spoken-arabic-regeneration');
const INVENTORY_PATH = path.join(process.cwd(), 'audio-plan/review/full-spoken-arabic-generated-files.json');

// Get file hash
function getFileHash(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(content).digest('hex');
}

// Get file size
function getFileSize(filePath) {
  if (!fs.existsSync(filePath)) return 0;
  return fs.statSync(filePath).size;
}

async function backupAndRegenerate() {
  console.log('🎵 Audio Regeneration with Backup\n');
  console.log('=' .repeat(60));

  // Load regeneration list
  console.log('\n📄 Loading regeneration list...');
  const regenData = JSON.parse(fs.readFileSync(REGENERATION_LIST_PATH, 'utf8'));
  const filesToRegenerate = regenData.files || [];
  console.log(`   Found ${filesToRegenerate.length} files to regenerate\n`);

  // Step 1: Backup existing files
  console.log('💾 Step 1: Backing up existing audio files...');
  let backedUp = 0;
  let missing = 0;

  for (const file of filesToRegenerate) {
    const sourcePath = path.join(process.cwd(), file.path);
    const backupPath = path.join(BACKUP_DIR, file.audioId + '.mp3');

    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, backupPath);
      backedUp++;
      console.log(`   ✅ ${file.audioId}: Backed up`);
    } else {
      missing++;
      console.log(`   ⚠️  ${file.audioId}: Source file not found (will be created)`);
    }
  }

  console.log(`\n   Backup complete: ${backedUp} files backed up, ${missing} new files to create\n`);

  // Step 2: Extract IDs for Python script
  const ids = filesToRegenerate.map(f => f.audioId);
  console.log('🎯 Step 2: Preparing to regenerate...');
  console.log(`   Audio IDs: ${ids.join(', ')}\n`);

  // Step 3: Run Python generation
  console.log('🎙️  Step 3: Running Edge TTS generation...');
  console.log('   This may take several minutes...\n');

  try {
    // Run the Python script with the IDs
    const idArgs = ids.join(' ');
    const pythonCmd = `py generate-audio.py ${idArgs}`;

    console.log(`   Command: ${pythonCmd}\n`);

    // Execute with stdio visible
    execSync(pythonCmd, {
      stdio: 'inherit',
      cwd: process.cwd(),
      timeout: 300000 // 5 minutes
    });

    console.log('\n✅ Generation complete\n');
  } catch (error) {
    console.error('\n❌ Generation failed:', error.message);
    throw error;
  }

  // Step 4: Create inventory
  console.log('📋 Step 4: Creating inventory file...');
  const inventory = {
    generationDate: new Date().toISOString(),
    totalFiles: filesToRegenerate.length,
    files: []
  };

  for (const file of filesToRegenerate) {
    const filePath = path.join(process.cwd(), file.path);
    const size = getFileSize(filePath);
    const hash = getFileHash(filePath);

    inventory.files.push({
      audioId: file.audioId,
      path: file.path,
      text: file.text,
      oldTtsText: file.oldTtsText,
      newTtsText: file.newTtsText,
      voice: file.voice,
      size: size,
      hash: hash,
      reason: file.reason,
      fixType: file.fixType || 'linguistic'
    });

    console.log(`   ✅ ${file.audioId}: ${size} bytes`);
  }

  fs.writeFileSync(INVENTORY_PATH, JSON.stringify(inventory, null, 2), 'utf8');
  console.log(`\n   Inventory saved to: ${INVENTORY_PATH}\n`);

  // Summary
  console.log('='.repeat(60));
  console.log('📊 REGENERATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total files processed: ${filesToRegenerate.length}`);
  console.log(`Backup folder: ${BACKUP_DIR}`);
  console.log(`Inventory file: ${INVENTORY_PATH}`);

  return { backedUp, missing, total: filesToRegenerate.length };
}

// Run
backupAndRegenerate()
  .then(() => {
    console.log('\n✅ Backup and regeneration complete!');
    process.exit(0);
  })
  .catch(err => {
    console.error('\n❌ Error:', err);
    process.exit(1);
  });
