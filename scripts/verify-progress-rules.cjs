#!/usr/bin/env node

/**
 * verify-progress-rules.cjs
 * 
 * Checks that progress management and 80% unlock rule is implemented:
 * - ProgressManager exists and is used
 * - 80% mastery threshold is defined
 * - Lesson unlock checks are in place
 * - localStorage progress storage is working
 * 
 * Output: docs/reports/progress-rules-report.{json,md}
 */

const fs = require('fs')
const path = require('path')

const projectRoot = path.join(__dirname, '..')
const libPath = path.join(projectRoot, 'lib')
const componentsPath = path.join(projectRoot, 'components')
const reportsDir = path.join(projectRoot, 'docs', 'reports')

// Ensure reports directory exists
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true })
}

const report = {
  timestamp: new Date().toISOString(),
  checks: {
    progressManagerExists: false,
    gameRulesThreshold: false,
    progressUsedInScreens: false,
    progressUsedInGames: false,
    localStorageUsage: false,
  },
  details: [],
  status: 'CHECKING',
}

console.log('Checking progress rule implementation...')

// Check 1: ProgressManager exists
console.log('1. Checking ProgressManager...')
const progressManagerPath = path.join(libPath, 'progress-manager.ts')
if (fs.existsSync(progressManagerPath)) {
  const content = fs.readFileSync(progressManagerPath, 'utf-8')
  if (content.includes('recordGameResult') && content.includes('isLessonUnlocked')) {
    report.checks.progressManagerExists = true
    report.details.push('✓ ProgressManager exists and has required methods')
  } else {
    report.details.push('⚠️ ProgressManager exists but missing required methods')
  }
} else {
  report.details.push('✗ ProgressManager.ts not found')
}

// Check 2: 80% threshold in game-rules.ts
console.log('2. Checking 80% mastery threshold...')
const gameRulesPath = path.join(libPath, 'game-rules.ts')
if (fs.existsSync(gameRulesPath)) {
  const content = fs.readFileSync(gameRulesPath, 'utf-8')
  if (content.includes('GAME_MASTERY_THRESHOLD') && content.includes('80')) {
    report.checks.gameRulesThreshold = true
    report.details.push('✓ 80% mastery threshold defined in game-rules.ts')
  } else {
    report.details.push('⚠️ 80% threshold not found in game-rules.ts')
  }
} else {
  report.details.push('✗ game-rules.ts not found')
}

// Check 3: Progress used in screens
console.log('3. Checking progress usage in screens...')
const screensDir = path.join(componentsPath, 'screens')
let progressImportCount = 0
if (fs.existsSync(screensDir)) {
  const screenFiles = fs.readdirSync(screensDir).filter(f => f.endsWith('.tsx'))
  screenFiles.forEach((file) => {
    const content = fs.readFileSync(path.join(screensDir, file), 'utf-8')
    if (content.includes('ProgressManager') || content.includes('useProgress')) {
      progressImportCount++
    }
  })
}
if (progressImportCount > 0) {
  report.checks.progressUsedInScreens = true
  report.details.push(`✓ Progress usage found in ${progressImportCount} screen(s)`)
} else {
  report.details.push('⚠️ Progress manager not used in any screens yet')
}

// Check 4: Progress used in games
console.log('4. Checking progress usage in games...')
const gamesDir = path.join(componentsPath, 'games')
let gameProgressCount = 0
if (fs.existsSync(gamesDir)) {
  const gameFiles = fs.readdirSync(gamesDir).filter(f => f.endsWith('.tsx'))
  gameFiles.forEach((file) => {
    const content = fs.readFileSync(path.join(gamesDir, file), 'utf-8')
    if (content.includes('ProgressManager') || content.includes('recordGameResult')) {
      gameProgressCount++
    }
  })
}
if (gameProgressCount > 0) {
  report.checks.progressUsedInGames = true
  report.details.push(`✓ Progress tracking found in ${gameProgressCount} game(s)`)
} else {
  report.details.push('⚠️ Progress tracking not integrated in games yet')
}

// Check 5: localStorage usage
console.log('5. Checking localStorage implementation...')
const progressContent = fs.existsSync(progressManagerPath) 
  ? fs.readFileSync(progressManagerPath, 'utf-8') 
  : ''
if (progressContent.includes('localStorage.setItem') && progressContent.includes('localStorage.getItem')) {
  report.checks.localStorageUsage = true
  report.details.push('✓ localStorage used for progress persistence')
} else {
  report.details.push('⚠️ localStorage usage not found in ProgressManager')
}

// Determine overall status
const allPassed = Object.values(report.checks).every(v => v === true)
report.status = allPassed ? 'COMPLETE' : 'INCOMPLETE'

// Save JSON report
console.log('Writing JSON report...')
const jsonReportPath = path.join(reportsDir, 'progress-rules-report.json')
fs.writeFileSync(jsonReportPath, JSON.stringify(report, null, 2))
console.log(`  Saved to ${jsonReportPath}`)

// Save Markdown report
console.log('Writing Markdown report...')
const mdReportPath = path.join(reportsDir, 'progress-rules-report.md')
const mdContent = `# Progress Rules Verification Report

**Generated:** ${new Date().toLocaleString()}

## Overall Status

**Status:** ${report.status} ${report.status === 'COMPLETE' ? '✓' : '⚠️'}

## Implementation Checklist

- [${report.checks.progressManagerExists ? 'x' : ' '}] ProgressManager exists with recordGameResult and isLessonUnlocked
- [${report.checks.gameRulesThreshold ? 'x' : ' '}] 80% mastery threshold defined in game-rules.ts
- [${report.checks.progressUsedInScreens ? 'x' : ' '}] Progress system integrated in lesson screens
- [${report.checks.progressUsedInGames ? 'x' : ' '}] Progress tracking integrated in games
- [${report.checks.localStorageUsage ? 'x' : ' '}] localStorage used for persistence

## Details

${report.details.map(d => `- ${d}`).join('\n')}

## Key Rules

1. **Next level unlocks only when score >= 80%**
   - Stored in localStorage
   - Checked before showing next lesson
   - Prevents URL-based access to locked levels

2. **Progress persists across sessions**
   - Stored in browser localStorage
   - Key: \`wahet_alhorof_progress\`
   - Format: JSON with lesson-id keys

3. **Game completion updates progress**
   - Called after each game completes
   - Updates mastery percentage
   - Checks 80% threshold

## Next Steps

${!report.checks.progressUsedInScreens ? '1. Integrate ProgressManager in lesson screens (check unlock status)\n' : ''}
${!report.checks.progressUsedInGames ? '2. Integrate progress recording in game components (call recordGameResult)\n' : ''}
${report.status === 'COMPLETE' ? '✓ Progress system is fully implemented!' : '⚠️ Some integration work remains.'}
`
fs.writeFileSync(mdReportPath, mdContent)
console.log(`  Saved to ${mdReportPath}`)

console.log('\n✓ Progress rules verification complete')
console.log(`  Status: ${report.status}`)
