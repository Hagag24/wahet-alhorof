#!/usr/bin/env node

/**
 * verify-game-rules.cjs
 * 
 * Checks game components for violations of game rules:
 * - Wrong-answer reveal patterns (showing correct answer)
 * - Correct-answer confirmation patterns  
 * - Answer feedback behaviors
 * 
 * Output: docs/reports/game-rules-report.{json,md}
 */

const fs = require('fs')
const path = require('path')

const projectRoot = path.join(__dirname, '..')
const gamesDir = path.join(projectRoot, 'components', 'games')
const reportsDir = path.join(projectRoot, 'docs', 'reports')

// Ensure reports directory exists
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true })
}

const report = {
  timestamp: new Date().toISOString(),
  gameComponents: [],
  totalViolations: 0,
  violationTypes: {
    revealCorrectAnswer: 0,
    disabledAnswerHighlight: 0,
    successBackgroundHighlight: 0,
  }
}

// Patterns that indicate correct-answer reveal
const revealPatterns = [
  /bg-success\/20.*text-success/,
  /isCorrect === true.*bg-success/,
  /isCorrectAnswer.*disabled.*text-success/,
  /showCorrectAnswer/,
  /revealCorrectAnswer.*true/,
]

console.log('Scanning game components...')
const gameFiles = fs.readdirSync(gamesDir).filter(f => f.endsWith('.tsx'))

gameFiles.forEach((file) => {
  const filePath = path.join(gamesDir, file)
  const content = fs.readFileSync(filePath, 'utf-8')

  const violations = []

  // Check for reveal patterns
  revealPatterns.forEach((pattern) => {
    if (pattern.test(content)) {
      violations.push({
        type: 'potential-reveal',
        pattern: pattern.toString(),
        description: 'Potential correct-answer reveal pattern detected',
      })
    }
  })

  // Check specific problematic patterns
  if (/isCorrect === true && isCorrectAnswer && !isSelected.*?bg-success\/20/s.test(content)) {
    violations.push({
      type: 'revealCorrectAnswer',
      description: 'Styling non-selected correct answers with bg-success/20',
    })
    report.violationTypes.revealCorrectAnswer++
  }

  if (violations.length > 0) {
    report.gameComponents.push({
      file,
      violationCount: violations.length,
      violations,
    })
    report.totalViolations += violations.length
  } else {
    report.gameComponents.push({
      file,
      violationCount: 0,
      violations: [],
      status: 'OK ✓',
    })
  }

  console.log(`  ${file}: ${violations.length > 0 ? '⚠️ ' + violations.length + ' issue(s)' : '✓'}`)
})

// Save JSON report
console.log('Writing JSON report...')
const jsonReportPath = path.join(reportsDir, 'game-rules-report.json')
fs.writeFileSync(jsonReportPath, JSON.stringify(report, null, 2))
console.log(`  Saved to ${jsonReportPath}`)

// Save Markdown report
console.log('Writing Markdown report...')
const mdReportPath = path.join(reportsDir, 'game-rules-report.md')
const mdContent = `# Game Rules Verification Report

**Generated:** ${new Date().toLocaleString()}

## Summary

- **Total Game Components:** ${report.gameComponents.length}
- **Total Violations:** ${report.totalViolations}
- **Status:** ${report.totalViolations === 0 ? '✓ All clear!' : '⚠️ Issues found'}

## Violation Types

- Reveal Correct Answer Patterns: ${report.violationTypes.revealCorrectAnswer}

## Game-by-Game Results

${report.gameComponents.map(comp => `
### ${comp.file}
${comp.status || (comp.violationCount === 0 ? '✓ OK' : '⚠️ ' + comp.violationCount + ' issue(s)')}

${comp.violations.length > 0 
  ? comp.violations.map(v => `- **${v.type}**: ${v.description}`).join('\n')
  : 'No violations detected.'
}
`).join('\n')}

## Recommendations

${report.totalViolations === 0 
  ? '✓ All game components comply with game rules.' 
  : `⚠️ Found ${report.totalViolations} violation(s). Review and fix the patterns above.`
}

### Key Rules

1. **Do not reveal the correct answer** after a wrong attempt
2. **Show only retry message** like "حاول مرة أخرى يا بطل"
3. **Keep question available** until learner tries again
4. **Disable non-selected options** after correct answer (via opacity or cursor, not color)
`
fs.writeFileSync(mdReportPath, mdContent)
console.log(`  Saved to ${mdReportPath}`)

console.log('\n✓ Game rules verification complete')
console.log(`  Violations: ${report.totalViolations}`)
