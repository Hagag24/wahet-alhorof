# Image Integration Checklist

This document tracks the integration status of all image assets defined in the asset map.

**Status Legend:**
- ✅ Exists: Image file exists in public folder
- ❌ Missing: Image file does not exist
- ⏳ Used in UI: Image is referenced in component code
- 🔄 Placeholder: Emoji/placeholder still used instead of image
- 📝 Notes: Additional information

**Current Status:**
- Total Assets: 85
- Files Exist: 6 (intro images only)
- Need Creation: 79

---

## Intro (6 assets) - ✅ ALL EXIST

| Asset Key | File Name | Exists | Used in UI | Placeholder | Notes |
|-----------|-----------|--------|------------|-------------|-------|
| alazhar_minarets_faculty | alazhar_minarets_faculty.png | ✅ | ⏳ | 🔄 | 1.9 MB - Splash screen scene 1 |
| magical_research_book | magical_research_book.png | ✅ | ⏳ | 🔄 | 2.1 MB - Splash screen scene 2 |
| golden_honor_board | golden_honor_board.png | ✅ | ⏳ | 🔄 | 2.5 MB - Splash screen scene 3 |
| welcome_magic_gate | welcome_magic_gate.png | ✅ | ⏳ | 🔄 | 2.3 MB - Splash screen scene 4 |
| skills_floating_island | skills_floating_island.png | ✅ | ⏳ | 🔄 | 2.5 MB - Splash screen scene 5 |
| flying_adventure_train | flying_adventure_train.png | ✅ | ⏳ | 🔄 | 2.4 MB - Splash screen scene 6 |

**Integration Status:** Ready to integrate into splash-screen.tsx

---

## Characters (12 assets) - ❌ ALL MISSING

| Asset Key | File Name | Exists | Used in UI | Placeholder | Notes |
|-----------|-----------|--------|------------|-------------|-------|
| maryam | maryam.png | ❌ | ⏳ | 🔄 | Used in story-player.tsx (emoji 👧) |
| youssef | youssef.png | ❌ | ⏳ | 🔄 | Used in story-player.tsx (emoji 👦) |
| grandfather | grandfather.png | ❌ | ⏳ | 🔄 | Used in story-player.tsx (emoji 👴) |
| mother | mother.png | ❌ | ⏳ | 🔄 | Used in story-player.tsx (emoji 🧕) |
| father | father.png | ❌ | ⏳ | 🔄 | Used in story-player.tsx (emoji 👨) |
| amira | amira.png | ❌ | ⏳ | 🔄 | Used in story-player.tsx (emoji 👧) |
| sami | sami.png | ❌ | ⏳ | 🔄 | Not yet used in UI |
| kareem | kareem.png | ❌ | ⏳ | 🔄 | Used in game-router.tsx (emoji 👦) |
| tarek | tarek.png | ❌ | ⏳ | 🔄 | Used in game-router.tsx (emoji 👦) |
| teacher_female | teacher_female.png | ❌ | ⏳ | 🔄 | Used in story-player.tsx (emoji 👩‍🏫) |
| cartoon_boy | cartoon_boy.png | ❌ | ⏳ | 🔄 | Not yet used in UI |
| cartoon_girl | cartoon_girl.png | ❌ | ⏳ | 🔄 | Not yet used in UI |

**Integration Status:** Cannot integrate - all files missing

---

## Lesson 1 - هيا نتعلم يا جدي (19 assets) - ❌ ALL MISSING

| Asset Key | File Name | Exists | Used in UI | Placeholder | Notes |
|-----------|-----------|--------|------------|-------------|-------|
| grandfather_missing_letter_message | grandfather_missing_letter_message.png | ❌ | ⏳ | 🔄 | Warmup scene |
| letter_bubbles_j_d_y | letter_bubbles_j_d_y.png | ❌ | ⏳ | 🔄 | Game: رسالة الجد المفقودة |
| maryam_age_6 | maryam_age_6.png | ❌ | ⏳ | 🔄 | Story: قصة مريم ويوسف |
| youssef_age_9 | youssef_age_9.png | ❌ | ⏳ | 🔄 | Story: قصة مريم ويوسف |
| youssef_helping_family | youssef_helping_family.png | ❌ | ⏳ | 🔄 | Story: قصة مريم ويوسف |
| youssef_red_bicycle | youssef_red_bicycle.png | ❌ | ⏳ | 🔄 | Story: قصة مريم ويوسف |
| maryam_sad_garden | maryam_sad_garden.png | ❌ | ⏳ | 🔄 | Story: قصة مريم ويوسف |
| smart_board_sit_sad | smart_board_sit_sad.png | ❌ | ⏳ | 🔄 | Game: ما الكلمة الصحيحة للصورة |
| dal_letter_forms_bicycle | dal_letter_forms_bicycle.png | ❌ | ⏳ | 🔄 | Game: أشكال الحروف |
| meem_identity_card_store | meem_identity_card_store.png | ❌ | ⏳ | 🔄 | Game: أشكال الحروف |
| hazina_sound_blocks | hazina_sound_blocks.png | ❌ | ⏳ | 🔄 | Game: صياد الأصوات |
| bike_picture | bike_picture.png | ❌ | ⏳ | 🔄 | Game: ما الكلمة الصحيحة للصورة (emoji 🚲) |
| youssef_picture | youssef_picture.png | ❌ | ⏳ | 🔄 | Game: ما الكلمة الصحيحة للصورة (emoji 👦) |
| store_picture | store_picture.png | ❌ | ⏳ | 🔄 | Game: ما الكلمة الصحيحة للصورة (emoji 🏪) |
| sound_hunter_boxes | sound_hunter_boxes.png | ❌ | ⏳ | 🔄 | Game: صياد الأصوات |
| harakat_jump_house | harakat_jump_house.png | ❌ | ⏳ | 🔄 | Game: قفزة الحركات |
| youssef_rain_umbrella | youssef_rain_umbrella.png | ❌ | ⏳ | 🔄 | Game: مظلة يوسف |
| letter_train_stations | letter_train_stations.png | ❌ | ⏳ | 🔄 | Game: قطار الحروف |
| meem_star_hunt | meem_star_hunt.png | ❌ | ⏳ | 🔄 | Game: بستان الحروف |
| letter_orchard_trees | letter_orchard_trees.png | ❌ | ⏳ | 🔄 | Game: بستان الحروف |

**Integration Status:** Cannot integrate - all files missing

---

## Lesson 2 - أميرة وأسرتها السعيدة (13 assets) - ❌ ALL MISSING

| Asset Key | File Name | Exists | Used in UI | Placeholder | Notes |
|-----------|-----------|--------|------------|-------------|-------|
| amira_character | amira_character.png | ❌ | ⏳ | 🔄 | Warmup: أهداف أميرة |
| harakat_balloons_alef | harakat_balloons_alef.png | ❌ | ⏳ | 🔄 | Game: سلة الحركات |
| magic_pen_father_amira | magic_pen_father_amira.png | ❌ | ⏳ | 🔄 | Game: القلم السحري |
| family_surprise_box | family_surprise_box.png | ❌ | ⏳ | 🔄 | Game: صندوق المفاجآت |
| family_house_drop_zone | family_house_drop_zone.png | ❌ | ⏳ | 🔄 | Game: صندوق المفاجآت |
| amira_happy_family_story | amira_happy_family_story.png | ❌ | ⏳ | 🔄 | Story: قصة أميرة |
| amira_movement_baskets | amira_movement_baskets.png | ❌ | ⏳ | 🔄 | Game: سلة الحركات |
| magic_syllable_scissors | magic_syllable_scissors.png | ❌ | ⏳ | 🔄 | Game: محقق المقاطع |
| amira_magic_blocks | amira_magic_blocks.png | ❌ | ⏳ | 🔄 | Game: مكعبات أميرة |
| amira_magic_gate_similar_sounds | amira_magic_gate_similar_sounds.png | ❌ | ⏳ | 🔄 | Game: محطة الأصوات |
| magic_binocular_word_hunter | magic_binocular_word_hunter.png | ❌ | ⏳ | 🔄 | Game: صائد الكلمات |
| amira_sound_train_station | amira_sound_train_station.png | ❌ | ⏳ | 🔄 | Game: قطار الأصوات |
| amira_different_word_balloons | amira_different_word_balloons.png | ❌ | ⏳ | 🔄 | Game: كاشف الكلمة المختلفة |

**Integration Status:** Cannot integrate - all files missing

---

## Lesson 3 - عالم الحيوان (12 assets) - ❌ ALL MISSING

| Asset Key | File Name | Exists | Used in UI | Placeholder | Notes |
|-----------|-----------|--------|------------|-------------|-------|
| sami_animal_album | sami_animal_album.png | ❌ | ⏳ | 🔄 | Warmup: ألبوم حيوانات سامي |
| living_room_forest_tv | living_room_forest_tv.png | ❌ | ⏳ | 🔄 | Warmup: ألبوم حيوانات سامي |
| lion_behind_tree_shadow | lion_behind_tree_shadow.png | ❌ | ⏳ | 🔄 | Game: من خلف الشجرة |
| cartoon_lion_tree | cartoon_lion_tree.png | ❌ | ⏳ | 🔄 | Game: من خلف الشجرة (emoji 🦁) |
| bulbul_on_branch | bulbul_on_branch.png | ❌ | ⏳ | 🔄 | Game: ألبوم الغابة السحري |
| rabbit_running_forest | rabbit_running_forest.png | ❌ | ⏳ | 🔄 | Game: ألبوم الغابة السحري (emoji 🐰) |
| ant_carrying_grain | ant_carrying_grain.png | ❌ | ⏳ | 🔄 | Game: ألبوم الغابة السحري (emoji 🐜) |
| animal_word_cutting_machine | animal_word_cutting_machine.png | ❌ | ⏳ | 🔄 | Game: قطار الكلمات في غابة الحيوان |
| magic_potion_merge_word | magic_potion_merge_word.png | ❌ | ⏳ | 🔄 | Game: مغناطيس الأصوات |
| flying_pen_animal_album | flying_pen_animal_album.png | ❌ | ⏳ | 🔄 | Game: ألبوم الغابة السحري |
| magic_word_train_forest | magic_word_train_forest.png | ❌ | ⏳ | 🔄 | Game: قطار الكلمات في غابة الحيوان |
| magnetic_word_box_animals | magnetic_word_box_animals.png | ❌ | ⏳ | 🔄 | Game: مغناطيس الأصوات |

**Integration Status:** Cannot integrate - all files missing

---

## Lesson 4 - يوم في المدرسة (13 assets) - ❌ ALL MISSING

| Asset Key | File Name | Exists | Used in UI | Placeholder | Notes |
|-----------|-----------|--------|------------|-------------|-------|
| kareem_school_bag | kareem_school_bag.png | ❌ | ⏳ | 🔄 | Warmup: صندوق الأصوات الضائع |
| teacher_welcomes_kareem | teacher_welcomes_kareem.png | ❌ | ⏳ | 🔄 | Story: قصة كريم (emoji 👩‍🏫) |
| drawing_classroom | drawing_classroom.png | ❌ | ⏳ | 🔄 | Story: قصة كريم |
| kareem_drawing_flower | kareem_drawing_flower.png | ❌ | ⏳ | 🔄 | Story: قصة كريم (emoji 🌸) |
| tarek_gives_eraser | tarek_gives_eraser.png | ❌ | ⏳ | 🔄 | Story: قصة كريم |
| color_smart_board | color_smart_board.png | ❌ | ⏳ | 🔄 | Game: مدفع الأصوات |
| lost_sounds_gift_box | lost_sounds_gift_box.png | ❌ | ⏳ | 🔄 | Game: صندوق الأصوات الضائع |
| keys_ka_qa_kha | keys_ka_qa_kha.png | ❌ | ⏳ | 🔄 | Game: صندوق الأصوات الضائع |
| kareem_fast_words_train | kareem_fast_words_train.png | ❌ | ⏳ | 🔄 | Game: قطار كلمات كريم السريع |
| sound_twins_balloons | sound_twins_balloons.png | ❌ | ⏳ | 🔄 | Game: توائم الأصوات |
| magic_bubble_cannon_words | magic_bubble_cannon_words.png | ❌ | ⏳ | 🔄 | Game: مدفع الأصوات |
| magic_sentence_magnet | magic_sentence_magnet.png | ❌ | ⏳ | 🔄 | Game: مغناطيس الجمل |
| kareem_final_colored_flower | kareem_final_colored_flower.png | ❌ | ⏳ | 🔄 | Story: قصة كريم (emoji 🌸) |

**Integration Status:** Cannot integrate - all files missing

---

## Icons (15 assets) - ❌ ALL MISSING

| Asset Key | File Name | Exists | Used in UI | Placeholder | Notes |
|-----------|-----------|--------|------------|-------------|-------|
| home | home.png | ❌ | ⏳ | 🔄 | Lucide icons currently used |
| back | back.png | ❌ | ⏳ | 🔄 | Lucide icons currently used |
| next | next.png | ❌ | ⏳ | 🔄 | Lucide icons currently used |
| sound_on | sound_on.png | ❌ | ⏳ | 🔄 | Lucide icons currently used |
| sound_off | sound_off.png | ❌ | ⏳ | 🔄 | Lucide icons currently used |
| star | star.png | ❌ | ⏳ | 🔄 | Lucide icons currently used |
| trophy | trophy.png | ❌ | ⏳ | 🔄 | Lucide icons currently used (emoji 🏆) |
| medal | medal.png | ❌ | ⏳ | 🔄 | Not yet used in UI |
| heart | heart.png | ❌ | ⏳ | 🔄 | Not yet used in UI |
| help | help.png | ❌ | ⏳ | 🔄 | Not yet used in UI |
| hint | hint.png | ❌ | ⏳ | 🔄 | Not yet used in UI |
| check | check.png | ❌ | ⏳ | 🔄 | Lucide icons currently used |
| wrong | wrong.png | ❌ | ⏳ | 🔄 | Lucide icons currently used |
| play | play.png | ❌ | ⏳ | 🔄 | Lucide icons currently used |
| pause | pause.png | ❌ | ⏳ | 🔄 | Lucide icons currently used |

**Integration Status:** Cannot integrate - all files missing (Lucide icons working well)

---

## Integration Priority

### ✅ READY TO INTEGRATE: Intro Images (6/6)
All intro images exist and are ready for integration into splash-screen.tsx:
- alazhar_minarets_faculty.png (1.9 MB)
- magical_research_book.png (2.1 MB)
- golden_honor_board.png (2.5 MB)
- welcome_magic_gate.png (2.3 MB)
- skills_floating_island.png (2.5 MB)
- flying_adventure_train.png (2.4 MB)

### ❌ NOT READY: Character Images (0/12)
All character images are missing. Keep emoji fallbacks.

### ❌ NOT READY: Lesson Images (0/57)
All lesson images are missing. Keep emoji fallbacks.

### ❌ NOT READY: Icons (0/15)
All custom icons are missing. Lucide icons working well, no need to replace.

### High Priority (Story & Warmup Images)
These should be integrated first as they set the visual context for lessons:
- All character images (maryam, youssef, amira, sami, kareem)
- Story scene images for all 4 lessons
- Warmup/intro images for all 4 lessons

### Medium Priority (Game Visuals)
Game-specific images that enhance gameplay:
- Picture matching games (bike_picture, youssef_picture, store_picture)
- Animal images for lesson 3 games
- School images for lesson 4 games

### Low Priority (Icons)
The project currently uses Lucide React icons which are working well. Custom icons can be added later for branding purposes.

---

## Current Implementation Status

### Components Using Emojis/Placeholders:
1. **story-player.tsx** - Uses `getEmojiForScene()` function with emoji fallbacks
2. **game-router.tsx** - Uses `getEmojiForWord()` function with emoji fallbacks
3. **character-select-screen.tsx** - Uses `characterEmojis` object with emoji fallbacks

### Components Ready for Image Integration:
1. **story-player.tsx** - Already has `renderVisual()` function that supports both images and emojis
2. **game-router.tsx** - Has image display logic in place
3. **character-select-screen.tsx** - Has character display logic in place

---

## Next Steps

1. **Create Image Files**: All 57 image files need to be created according to the specifications in `docs/ASSET_MAP_ALL_LESSONS_AR.md`
2. **Add Files to Public Folder**: Place images in:
   - `public/images/characters/` (12 files)
   - `public/images/lesson-1/` (19 files)
   - `public/images/lesson-2/` (13 files)
   - `public/images/lesson-3/` (12 files)
   - `public/images/lesson-4/` (13 files)
   - `public/images/icons/` (15 files)
3. **Update Components**: Replace emoji fallbacks with image references using the centralized `imageAssets` map
4. **Test**: Verify images display correctly across all lessons, stories, and games
5. **Update Checklist**: Mark assets as ✅ Exists and ⏳ Used in UI as integration progresses

---

## Notes

- All image folders are currently empty (0 items)
- The project uses Next.js Image component is available but not currently used in these components
- Current emoji fallbacks provide good UX while images are being created
- Arabic RTL support is maintained in all components
- All alt text should be in Arabic as specified in the image assets map
