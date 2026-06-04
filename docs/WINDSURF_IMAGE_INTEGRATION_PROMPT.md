# Windsurf / Codex Prompt — تنظيم وإدخال صور كل الدروس في مشروع Kids

You are working on the existing Kids Arabic Educational Games project.

Important:
- Do not rebuild the project.
- Do not change lesson/game behavior unless needed to reference images.
- Do not break current passing build, lint, tests, or TypeScript.
- Use the provided asset map files:
  - docs/ASSET_MAP_ALL_LESSONS_AR.md
  - docs/asset_map_all_lessons.json
- Use the organized image folders under:
  - public/images/characters
  - public/images/lesson-1
  - public/images/lesson-2
  - public/images/lesson-3
  - public/images/lesson-4
  - public/images/icons

Task:
1. Inspect current project image usage.
2. Find where lessons, stories, games, warmups, intros, and characters are rendered.
3. Add a centralized image asset map if one does not exist, for example:
   - data/image-assets.ts
   - or lib/image-assets.ts
4. Map every image path from asset_map_all_lessons.json to a typed object.
5. Replace emoji-only or placeholder visuals gradually with image references where the related image exists.
6. Do not hardcode paths in many components; prefer a central map.
7. If an expected image file is missing, keep the current placeholder and log/mark it in a checklist.
8. Keep Arabic RTL and current visual style.
9. Use Next.js Image component if the project already uses it; otherwise keep normal img tags consistently.
10. Ensure all image alt text is Arabic and meaningful.

Specific requirements:
- Character images should be reusable across lessons.
- Lesson 1 images should be used in:
  - رسالة الجد المفقودة
  - قصة مريم ويوسف
  - ما الكلمة الصحيحة للصورة
  - صياد الأصوات
  - قفزة الحركات
  - مظلة يوسف
  - قطار الحروف
  - بستان الحروف
- Lesson 2 images should be used in:
  - أهداف أميرة
  - صندوق المفاجآت
  - قصة أميرة
  - سلة الحركات
  - محقق المقاطع
  - مكعبات أميرة
  - محطة الأصوات
  - صائد الكلمات
- Lesson 3 images should be used in:
  - ألبوم حيوانات سامي
  - من خلف الشجرة
  - ألبوم الغابة السحري
  - قطار الكلمات في غابة الحيوان
  - مغناطيس الأصوات
- Lesson 4 images should be used in:
  - صندوق الأصوات الضائع
  - قصة كريم
  - قطار كلمات كريم السريع
  - توائم الأصوات
  - مدفع الأصوات
  - مغناطيس الجمل

Checklist:
Create or update:
docs/image-integration-checklist.md

For each asset, record:
- Exists
- Used in UI
- Placeholder still used
- Needs better image
- Notes

After changes run:
- npm run build
- npm run lint
- npm test
- npx tsc --noEmit

Final response:
Return:
1. Changed files.
2. Which images were integrated.
3. Which images were missing.
4. Which placeholders remain.
5. Commands run and results.
