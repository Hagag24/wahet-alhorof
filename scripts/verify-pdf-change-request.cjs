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
const { audioMapping } = loadTs("lib/audio-mapping.ts");

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

function normalizeAudioLookupKey(text) {
  return String(text)
    .replace(/[\u064B-\u065F\u0670]/g, "")
    .replace(/[!؟?.:,،؛]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function getQuestionAudioTextForTest(q) {
  if (q.pronounceQuestionAndOptions) {
    return `${q.question} ${q.options.join("، ")}`;
  }
  if (q.audioText) {
    return q.audioText;
  }
  return q.word || q.image || q.question;
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
  assert.doesNotMatch(splashSource, /INTRO_SEEN_KEY|introSeen/, "Splash should not skip the intro from an introSeen flag");
  assert.doesNotMatch(splashSource, /localStorage\.getItem\(["']introSeen["']\)/, "Splash should always show the intro when visiting /");
  assert.doesNotMatch(splashSource, /localStorage\.setItem\(["']introSeen["']\s*,/, "Splash should not persist intro completion as a skip flag");
  assert.match(splashSource, /goToPreviousScene/, "Splash should support previous-scene navigation");
  assert.match(splashSource, /playSceneAudio/, "Splash should play each intro scene through its own audio controller");
  assert.match(splashSource, /audio\.onended/, "Splash should advance only after the current audio ends");
  assert.match(splashSource, /completionStartedRef/, "Splash should guard onComplete from repeated navigation");
  assert.doesNotMatch(splashSource, /durationMs/, "Splash must not advance intro scenes by fixed timers");
  assert.match(splashSource, /official_intro_scene_1/, "Splash should include official intro scene 1 audio key");
  assert.match(splashSource, /official_intro_scene_2/, "Splash should include official intro scene 2 audio key");
  assert.match(splashSource, /official_intro_scene_3/, "Splash should include official intro scene 3 audio key");
  assert.match(splashSource, /welcome_intro_scene_1/, "Splash should include welcome intro scene 1 audio key");
  assert.match(splashSource, /welcome_intro_scene_2/, "Splash should include welcome intro scene 2 audio key");
  assert.match(splashSource, /welcome_intro_scene_3/, "Splash should include welcome intro scene 3 audio key");
  assert.match(splashSource, /تشغيل الصوت/, "Splash should expose an explicit play-audio button");
  assert.match(splashSource, /إعادة المشهد/, "Splash should expose replay for the current scene");
  assert.match(splashSource, /عودة/, "Splash should expose previous navigation");
  assert.match(splashSource, /تخطي المقدمة/, "Splash should expose a skip-intro button");
  assert.doesNotMatch(splashSource, /useState\(\s*hasSeenIntro/, "Splash must not read localStorage in a state initializer");
}

{
  const lessonHubSource = fs.readFileSync(path.join(root, "components/screens/lesson-hub.tsx"), "utf8");
  const sectionOrder = [
    '<SectionShell id="objectives"',
    '<SectionShell id="warmup"',
    '<SectionShell id="story"',
    '<SectionShell id="words"',
    '<SectionShell id="explanation"',
    '<SectionShell id="games"',
  ].map((marker) => lessonHubSource.indexOf(marker));

  for (const index of sectionOrder) {
    assert.ok(index >= 0, "Lesson hub should render all requested Lesson 1 sections");
  }
  for (let i = 1; i < sectionOrder.length; i += 1) {
    assert.ok(sectionOrder[i] > sectionOrder[i - 1], "Lesson hub sections should follow the requested internal order");
  }

  assert.match(lessonHubSource, /رسالة الجد المفقودة/, "Lesson 1 warmup should be the missing grandfather message");
  assert.match(lessonHubSource, /choice === "د"/, "Warmup correct choice should be د");
  assert.match(lessonHubSource, /ج _ ي/, "Warmup should show the missing-letter word without revealing the answer first");
  assert.match(lessonHubSource, /setCompleted\(true\)/, "Warmup should unlock the story only after a correct choice");
  assert.match(lessonHubSource, /الانتقال إلى القصة/, "Warmup should provide the next step after completion");
  assert.match(lessonHubSource, /lesson-1-full\.mp3/, "Lesson 1 story playback should target one full story audio clip");
  assert.match(lessonHubSource, /lesson-1-objectives\.mp3/, "Lesson 1 objectives should use the generated objectives MP3");
  assert.match(lessonHubSource, /phrase-034\.mp3/, "Lesson 1 warmup should use phrase-034.mp3 (the warmup narration)");
  assert.match(lessonHubSource, /lesson-1-explanation\.mp3/, "Lesson 1 explanation should use the generated explanation MP3");
  assert.match(lessonHubSource, /phrase-035\.mp3/, "Warmup missing-sound button should use a generated MP3");
  assert.match(lessonHubSource, /phrase-036\.mp3/, "Warmup success narration should use a generated MP3");
  assert.match(lessonHubSource, /phrase-037\.mp3/, "Warmup retry narration should use a generated MP3");
}

{
  const storySource = fs.readFileSync(path.join(root, "components/screens/story-player.tsx"), "utf8");
  assert.match(storySource, /lesson-1-full-story/, "Lesson 1 story player should collapse the story into one scene");
  assert.match(storySource, /story\.id === "lesson-1" && story\.story/, "Lesson 1 story player should use the continuous story text");
  assert.match(storySource, /lesson-1-full\.mp3/, "Lesson 1 story player should request the unified story audio");
}

{
  const l1 = lesson("lesson-1");
  assert.equal(
    l1.story,
    "مريم عمرها ست سنوات. يوسف عمره تسع سنوات. يوسف يساعد أمه وأباه. مثل شراء الأكل من المتجر. يوسف يركب الدراجة إلى المتجر. مريم تشعر بالحزن لأنها تريد مساعدة والديها.",
    "Lesson 1 source story should be the requested continuous text"
  );
}

{
  const progressSource = fs.readFileSync(path.join(root, "hooks/use-local-storage.ts"), "utf8");
  assert.match(progressSource, /setStoredValue\(\(currentValue\)/, "Local storage setter should use the latest stored state for functional updates");

  const gamePageSource = fs.readFileSync(path.join(root, "app/lessons/[lessonId]/game/[gameIndex]/game-page-client.tsx"), "utf8");
  assert.match(gamePageSource, /isLoaded/, "Game page should wait for progress to load before unlock checks");
  assert.match(gamePageSource, /if \(!isLoaded\) \{\s*return;\s*\}/s, "Game page should not redirect locked pages before localStorage progress loads");
}

{
  const manifest = JSON.parse(fs.readFileSync(path.join(root, "audio-manifest.json"), "utf8"));
  const ids = new Set(manifest.files.map((file) => file.id));
  for (const id of [
    "welcome_intro_scene_2",
    "welcome_intro_scene_3",
    "lesson-1-full",
    "phrase-034",
    "lesson-1-objectives",
    "lesson-1-explanation",
    "phrase-035",
    "phrase-036",
    "phrase-037",
  ]) {
    assert.ok(ids.has(id), `Audio manifest should include ${id}`);
  }
  for (const id of [
    "lesson-1-full",
    "phrase-034",
    "lesson-1-objectives",
    "lesson-1-explanation",
  ]) {
    const entry = manifest.files.find((file) => file.id === id);
    assert.equal(entry.missing, undefined, `${id} should not be marked missing after MP3 generation`);
    const audioPath = path.join(root, entry.path);
    assert.ok(fs.existsSync(audioPath), `${entry.path} should physically exist`);
    assert.ok(fs.statSync(audioPath).size > 0, `${entry.path} should not be zero bytes`);
  }
  for (const id of ["phrase-036", "phrase-037", "phrase-038"]) {
    const entry = manifest.files.find((file) => file.id === id);
    assert.ok(entry, `Audio manifest should include ${id}`);
    const audioPath = path.join(root, entry.path);
    assert.ok(fs.existsSync(audioPath), `${entry.path} should physically exist`);
    assert.ok(fs.statSync(audioPath).size > 0, `${entry.path} should not be zero bytes`);
  }
}

{
  for (const l of lessons) {
    for (const g of l.games.filter((item) => !item.hidden)) {
      for (const q of g.questions) {
        const text = getQuestionAudioTextForTest(q);
        const id = audioMapping[normalizeAudioLookupKey(text)] || audioMapping[text];
        assert.ok(id, `Missing audio mapping for ${l.id}/${g.id}/${q.id}: ${text}`);
      }
    }
  }
}

{
  const manifest = JSON.parse(fs.readFileSync(path.join(root, "audio-manifest.json"), "utf8"));
  const manifestById = new Map(manifest.files.map((file) => [file.id, file]));
  for (const [text, id] of Object.entries(audioMapping)) {
    assert.ok(text.trim(), `Audio mapping for ${id} should have non-empty text`);
    const entry = manifestById.get(id);
    assert.ok(entry, `Audio mapping "${text}" points to missing manifest id ${id}`);
    const audioPath = path.join(root, entry.path);
    assert.ok(fs.existsSync(audioPath), `Audio mapping "${text}" points to missing file ${entry.path}`);
    assert.ok(fs.statSync(audioPath).size > 0, `Audio mapping "${text}" points to zero-byte file ${entry.path}`);
  }
}

console.log("PDF change request checks passed.");
