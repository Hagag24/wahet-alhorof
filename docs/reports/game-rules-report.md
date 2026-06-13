# Game Rules Verification Report

**Generated:** 6/13/2026, 9:03:47 AM

## Summary

- **Total Game Components:** 10
- **Total Violations:** 14
- **Status:** ⚠️ Issues found

## Violation Types

- Reveal Correct Answer Patterns: 6

## Game-by-Game Results


### build-word-game.tsx
⚠️ 1 issue(s)

- **potential-reveal**: Potential correct-answer reveal pattern detected


### catch-different-word-game.tsx
⚠️ 1 issue(s)

- **potential-reveal**: Potential correct-answer reveal pattern detected


### choose-sound-game.tsx
⚠️ 2 issue(s)

- **potential-reveal**: Potential correct-answer reveal pattern detected
- **revealCorrectAnswer**: Styling non-selected correct answers with bg-success/20


### complete-sentence-game.tsx
⚠️ 2 issue(s)

- **potential-reveal**: Potential correct-answer reveal pattern detected
- **revealCorrectAnswer**: Styling non-selected correct answers with bg-success/20


### game-router.tsx
OK ✓

No violations detected.


### game-wrapper.tsx
OK ✓

No violations detected.


### letter-position-game.tsx
⚠️ 2 issue(s)

- **potential-reveal**: Potential correct-answer reveal pattern detected
- **revealCorrectAnswer**: Styling non-selected correct answers with bg-success/20


### match-picture-word-game.tsx
⚠️ 2 issue(s)

- **potential-reveal**: Potential correct-answer reveal pattern detected
- **revealCorrectAnswer**: Styling non-selected correct answers with bg-success/20


### similar-words-game.tsx
⚠️ 2 issue(s)

- **potential-reveal**: Potential correct-answer reveal pattern detected
- **revealCorrectAnswer**: Styling non-selected correct answers with bg-success/20


### syllable-clap-game.tsx
⚠️ 2 issue(s)

- **potential-reveal**: Potential correct-answer reveal pattern detected
- **revealCorrectAnswer**: Styling non-selected correct answers with bg-success/20


## Recommendations

⚠️ Found 14 violation(s). Review and fix the patterns above.

### Key Rules

1. **Do not reveal the correct answer** after a wrong attempt
2. **Show only retry message** like "حاول مرة أخرى يا بطل"
3. **Keep question available** until learner tries again
4. **Disable non-selected options** after correct answer (via opacity or cursor, not color)
