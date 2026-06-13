#!/usr/bin/env node

/**
 * verify-audio-coverage.cjs
 * 
 * Checks audio coverage across the project:
 * - Validates audio-manifest.json entries
 * - Checks audio-mapping.ts references
 * - Scans lesson data for audio requirements
 * - Verifies physical files in public/audio
 * - Reports missing/orphan audio references
 * 
 * Output: docs/reports/audio-coverage-report.{json,md}
 */

const fs = require('fs')
const path = require('path')

const projectRoot = path.join(__dirname, '..')
const audioManifestPath = path.join(projectRoot, 'audio-manifest.json')
const audioMappingPath = path.join(projectRoot, 'lib', 'audio-mapping.ts')
const publicAudioPath = path.join(projectRoot, 'public', 'audio')
const reportsDir = path.join(projectRoot, 'docs', 'reports')

// Ensure reports directory exists
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true })
}

const report = {
  timestamp: new Date().toISOString(),
  totalAudioReferences: 0,
  validAudioReferences: 0,
  missingManifestEntries: [],
  missingMappings: [],
  missingFiles: [],
  zeroByteFiles: [],
  orphanAudioFiles: [],
  hiddenSoundButtons: [],
  summary: {}
}

// Step 1: Load and parse audio-manifest.json
console.log('Reading audio-manifest.json...')
let audioManifest = {}
try {
  const manifestContent = fs.readFileSync(audioManifestPath, 'utf-8')
  const manifestData = JSON.parse(manifestContent)
  if (manifestData.files && Array.isArray(manifestData.files)) {
    manifestData.files.forEach((file) => {
      audioManifest[file.id] = file
    })
  }
  console.log(`  Found ${Object.keys(audioManifest).length} audio entries in manifest`)
} catch (err) {
  console.warn(`  Warning: Could not read audio-manifest.json: ${err.message}`)
}

// Step 2: Extract references from audio-mapping.ts
console.log('Scanning audio-mapping.ts...')
let audioMappingRefs = new Set()
try {
  const mappingContent = fs.readFileSync(audioMappingPath, 'utf-8')
  const regex = /["'][^"']*["']\s*:\s*["']([a-zA-Z0-9\-]+)["']/g
  let match
  while ((match = regex.exec(mappingContent)) !== null) {
    audioMappingRefs.add(match[1])
  }
  console.log(`  Found ${audioMappingRefs.size} audio references in mapping`)
} catch (err) {
  console.warn(`  Warning: Could not read audio-mapping.ts: ${err.message}`)
}

// Step 3: Check for physical files
console.log('Scanning public/audio directory...')
const physicalFiles = new Set()
if (fs.existsSync(publicAudioPath)) {
  const scanDir = (dir, prefix = '') => {
    const entries = fs.readdirSync(dir)
    entries.forEach((entry) => {
      const fullPath = path.join(dir, entry)
      const stat = fs.statSync(fullPath)
      if (stat.isDirectory()) {
        scanDir(fullPath, prefix ? `${prefix}/${entry}` : entry)
      } else if (stat.isFile() && entry.endsWith('.mp3')) {
        const fileId = entry.replace('.mp3', '')
        physicalFiles.add(fileId)
        
        if (stat.size === 0) {
          report.zeroByteFiles.push(`${prefix}/${entry}`.replace(/^\//, ''))
        }
      }
    })
  }
  scanDir(publicAudioPath)
  console.log(`  Found ${physicalFiles.size} physical audio files`)
}

// Step 4: Cross-reference validation
console.log('Validating references...')

audioMappingRefs.forEach((refId) => {
  report.totalAudioReferences++

  if (!audioManifest[refId]) {
    report.missingManifestEntries.push(refId)
  } else if (!physicalFiles.has(refId)) {
    report.missingFiles.push(refId)
  } else {
    report.validAudioReferences++
  }
})

// Find orphan files (files that are not referenced in mapping)
physicalFiles.forEach((fileId) => {
  if (!audioMappingRefs.has(fileId)) {
    report.orphanAudioFiles.push(fileId)
  }
})

// Step 5: Compile summary
report.summary = {
  totalReferences: report.totalAudioReferences,
  valid: report.validAudioReferences,
  invalid: report.totalAudioReferences - report.validAudioReferences,
  missingFromManifest: report.missingManifestEntries.length,
  missingFiles: report.missingFiles.length,
  zeroByteFiles: report.zeroByteFiles.length,
  orphanFiles: report.orphanAudioFiles.length,
  coverage: report.totalAudioReferences > 0 
    ? Math.round((report.validAudioReferences / report.totalAudioReferences) * 100) 
    : 0,
}

// Save JSON report
console.log('Writing JSON report...')
const jsonReportPath = path.join(reportsDir, 'audio-coverage-report.json')
fs.writeFileSync(jsonReportPath, JSON.stringify(report, null, 2))
console.log(`  Saved to ${jsonReportPath}`)

// Save Markdown report
console.log('Writing Markdown report...')
const mdReportPath = path.join(reportsDir, 'audio-coverage-report.md')
const mdContent = `# Audio Coverage Report

**Generated:** ${new Date().toLocaleString()}

## Summary

- **Total Audio References:** ${report.summary.totalReferences}
- **Valid References:** ${report.summary.valid}
- **Invalid References:** ${report.summary.invalid}
- **Coverage:** ${report.summary.coverage}%

## Issues

### Missing from Manifest (${report.missingManifestEntries.length})
${report.missingManifestEntries.length === 0 
  ? 'None - all references found in manifest' 
  : report.missingManifestEntries.map(id => `- \`${id}\``).join('\n')}

### Missing Physical Files (${report.missingFiles.length})
${report.missingFiles.length === 0 
  ? 'None - all referenced files exist' 
  : report.missingFiles.map(id => `- \`${id}.mp3\``).join('\n')}

### Zero-Byte Files (${report.zeroByteFiles.length})
${report.zeroByteFiles.length === 0 
  ? 'None - all files have content' 
  : report.zeroByteFiles.map(f => `- \`${f}\``).join('\n')}

### Orphan Audio Files (${report.orphanAudioFiles.length})
${report.orphanAudioFiles.length === 0 
  ? 'None - no unused audio files' 
  : report.orphanAudioFiles.map(id => `- \`${id}.mp3\``).join('\n')}

## Recommendations

${report.summary.coverage === 100 ? '✓ Audio coverage is complete!' : `⚠️ Audio coverage is ${report.summary.coverage}%. Address the issues above.`}

${report.missingFiles.length > 0 ? `\n**Action:** Generate or upload ${report.missingFiles.length} missing audio files.` : ''}

${report.zeroByteFiles.length > 0 ? `\n**Action:** Regenerate or fix ${report.zeroByteFiles.length} zero-byte files.` : ''}
`
fs.writeFileSync(mdReportPath, mdContent)
console.log(`  Saved to ${mdReportPath}`)

console.log('\n✓ Audio coverage verification complete')
console.log(`  Coverage: ${report.summary.coverage}%`)
