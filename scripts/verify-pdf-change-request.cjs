const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

const root = path.resolve(__dirname, "..");

function loadTs(relativePath) {
  const filename = path.join(root, relativePath);
  const source = fs.readFileSync(filename, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
      verbatimModuleSyntax: false,
    },
  }).outputText;

  const module = { exports: {} };
  const localRequire = (id) => {
    if (id === "@/types") return {};
    throw new Error(`Unexpected require in ${relativePath}: ${id}`);
  };

  vm.runInNewContext(output, {
    module,
    exports: module.exports,
    require: localRequire,
    console,
  }, { filename });

  return module.exports;
}

const { lessons } = loadTs("data/lessons.ts");
const rules = loadTs("lib/game-rules.ts");

function lesson(id) {
  const found = lessons.find((item) => item.id === id);
  assert.ok(found, `Missing lesson ${id}`);
  return found;
}

function game(lessonId, gameId) {
  const found = lesson(lessonId).games.find((item) => item.id === gameId);
  assert.ok(found, `Missing game ${gameId}`);
  return found;
}

function question(gameConfig, questionId) {
  const found = gameConfig.questions.find((item) => item.id === questionId);
  assert.ok(found, `Missing question ${questionId} in ${gameConfig.id}`);
  return found;
}

{
  const wrong = rules.evaluateAnswer("باب", "بيت");
  assert.equal(wrong.correct, false, "Wrong answer should be incorrect");
  assert.equal(wrong.retrySameQuestion, true, "Wrong answer should retry same question");
  assert.equal(wrong.advanceQuestion, false, "Wrong answer should not advance");
  assert.equal(wrong.revealCorrectAnswer, false, "Wrong answer should not reveal correct answer");

  const correct = rules.evaluateAnswer("بيت", "بيت");
  assert.equal(correct.correct, true, "Correct answer should be correct");
  assert.equal(correct.advanceQuestion, true, "Correct answer should advance");
  assert.equal(correct.revealCorrectAnswer, false, "Correct answer should not need answer reveal");
}

{
  assert.equal(rules.calculateMastery(4, 5), 80, "4/5 should be 80% mastery");
  assert.equal(rules.shouldUnlockNextLevel(80), true, "80% should unlock the next level");
  assert.equal(rules.shouldUnlockNextLevel(79), false, "Less than 80% should stay locked");
  assert.equal(rules.shouldAdvanceToNextInternalLevel(80, 1, 2), true, "Mastery should advance to next visible level");
  assert.equal(rules.shouldAdvanceToNextInternalLevel(79, 1, 2), false, "Sub-mastery should not auto-advance");
}

{
  const level1 = game("lesson-1", "game-1-1");
  assert.equal(question(level1, "q1").options.indexOf("دراجة"), 2, "دراجة must be option 3");
  assert.equal(question(level1, "q2").options.indexOf("يوسف"), 1, "يوسف must be option 2");
  assert.equal(question(level1, "q3").options.indexOf("متجر"), 3, "المتجر/متجر must be option 4");
  assert.equal(question(level1, "q1").audioText, "دراجة", "دراجة audio must pronounce the word only");
  assert.equal(question(level1, "q2").audioText, "يوسف", "يوسف audio must pronounce the word only");
  assert.equal(question(level1, "q3").audioText, "المتجر", "متجر audio must pronounce with AL");
}

{
  const level2 = game("lesson-1", "game-1-2");
  const q1 = question(level2, "q1");
  assert.deepEqual(Array.from(q1.options), ["باب", "حديقة", "بيت"], "Lesson 1 level 2 words must keep the requested order");
  assert.equal(q1.pronounceQuestionAndOptions, true, "Lesson 1 level 2 must pronounce the question and words");
}

{
  const l2 = lesson("lesson-2");
  for (const hiddenId of ["game-2-5", "game-2-6", "game-2-7"]) {
    assert.equal(game("lesson-2", hiddenId).hidden, true, `${hiddenId} must be hidden`);
  }
  const visibleIds = l2.games.filter((item) => !item.hidden).map((item) => item.id);
  assert.deepEqual(
    Array.from(visibleIds),
    ["game-2-1", "game-2-2", "game-2-3", "game-2-4", "game-2-8", "game-2-9", "game-2-10"],
    "Lesson 2 visible student flow must hide levels 5, 6, and 7"
  );

  const amiraSyllables = question(game("lesson-2", "game-2-2"), "q1").syllables;
  assert.equal(amiraSyllables.length, 4, "أميرة should display 4 syllable chips");
}

{
  const routerSource = fs.readFileSync(path.join(root, "components/games/game-router.tsx"), "utf8");
  assert.match(routerSource, /isSelected \? 'wrong' : 'idle'/, "Wrong state should mark only the selected option");
  assert.match(routerSource, /return;\s*\}\s*setTimeout/s, "Wrong branch should return before the correct-answer advance timer");
}

{
  const splashSource = fs.readFileSync(path.join(root, "components/screens/splash-screen.tsx"), "utf8");
  assert.match(splashSource, /INTRO_SEEN_KEY = "introSeen"/, "Splash should persist the introSeen flag");
  assert.match(splashSource, /localStorage\.getItem\(INTRO_SEEN_KEY\)/, "Splash should read introSeen from localStorage after mount");
  assert.match(splashSource, /localStorage\.setItem\(INTRO_SEEN_KEY, "true"\)/, "Splash should mark the intro as seen after completion");
  assert.match(splashSource, /shouldForceReplayIntro/, "Splash should support developer replay/reset of the intro");
  assert.match(splashSource, /official_intro_scene_1/, "Splash should include official intro scene 1 audio key");
  assert.match(splashSource, /official_intro_scene_2/, "Splash should include official intro scene 2 audio key");
  assert.match(splashSource, /official_intro_scene_3/, "Splash should include official intro scene 3 audio key");
  assert.match(splashSource, /welcome_intro_scene_1/, "Splash should include welcome intro scene 1 audio key");
  assert.match(splashSource, /welcome_intro_scene_2/, "Splash should include welcome intro scene 2 audio key");
  assert.match(splashSource, /welcome_intro_scene_3/, "Splash should include welcome intro scene 3 audio key");
  assert.match(splashSource, /CinematicScenePlayer/, "Splash should render through the cinematic scene player");
  assert.match(splashSource, /تخطي المقدمة/, "Splash should expose a skip-intro button");
  assert.doesNotMatch(splashSource, /useState\(\s*hasSeenIntro/, "Splash must not read localStorage in a state initializer");
}

console.log("PDF change request checks passed.");
