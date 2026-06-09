const fs = require('fs');
const path = require('path');

// Read asset map
const assetMapPath = path.join(__dirname, '../docs/asset_map_all_lessons.json');
const assetMap = JSON.parse(fs.readFileSync(assetMapPath, 'utf-8'));

// Critical intro images
const criticalIntroImages = [
  'public/images/intro/alazhar_minarets_faculty.png',
  'public/images/intro/magical_research_book.png',
  'public/images/intro/golden_honor_board.png',
  'public/images/intro/welcome_magic_gate.png',
  'public/images/intro/skills_floating_island.png',
  'public/images/intro/flying_adventure_train.png'
];

// Valid image extensions
const validExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.svg'];

// Group assets by category
const categories = {
  intro: [],
  characters: [],
  'lesson-1': [],
  'lesson-2': [],
  'lesson-3': [],
  'lesson-4': [],
  icons: []
};

assetMap.forEach(asset => {
  if (categories[asset.category]) {
    categories[asset.category].push(asset);
  }
});

// Check each file
const results = {
  intro: { total: 0, found: 0, missing: 0, empty: 0, files: [] },
  characters: { total: 0, found: 0, missing: 0, empty: 0, files: [] },
  'lesson-1': { total: 0, found: 0, missing: 0, empty: 0, files: [] },
  'lesson-2': { total: 0, found: 0, missing: 0, empty: 0, files: [] },
  'lesson-3': { total: 0, found: 0, missing: 0, empty: 0, files: [] },
  'lesson-4': { total: 0, found: 0, missing: 0, empty: 0, files: [] },
  icons: { total: 0, found: 0, missing: 0, empty: 0, files: [] }
};

Object.keys(categories).forEach(category => {
  categories[category].forEach(asset => {
    results[category].total++;
    const fullPath = path.join(__dirname, '..', asset.path);
    
    if (fs.existsSync(fullPath)) {
      const stats = fs.statSync(fullPath);
      const ext = path.extname(asset.fileName).toLowerCase();
      
      if (stats.size === 0) {
        results[category].empty++;
        results[category].files.push({
          fileName: asset.fileName,
          path: asset.path,
          status: 'EMPTY',
          size: stats.size,
          extension: ext
        });
      } else if (!validExtensions.includes(ext)) {
        results[category].files.push({
          fileName: asset.fileName,
          path: asset.path,
          status: 'INVALID_EXT',
          size: stats.size,
          extension: ext
        });
      } else {
        results[category].found++;
        results[category].files.push({
          fileName: asset.fileName,
          path: asset.path,
          status: 'FOUND',
          size: stats.size,
          extension: ext
        });
      }
    } else {
      results[category].missing++;
      results[category].files.push({
        fileName: asset.fileName,
        path: asset.path,
        status: 'MISSING',
        size: 0,
        extension: path.extname(asset.fileName).toLowerCase()
      });
    }
  });
});

// Check critical intro images
console.log('\n=== CRITICAL INTRO IMAGES ===\n');
let allCriticalExist = true;
criticalIntroImages.forEach(imgPath => {
  const fullPath = path.join(__dirname, '..', imgPath);
  if (fs.existsSync(fullPath)) {
    const stats = fs.statSync(fullPath);
    console.log(`✅ ${imgPath} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
  } else {
    console.log(`❌ ${imgPath} - MISSING`);
    allCriticalExist = false;
  }
});

console.log('\n=== IMAGE VERIFICATION REPORT ===\n');

Object.keys(results).forEach(category => {
  const cat = results[category];
  if (cat.total === 0) return;
  
  console.log(`\n--- ${category.toUpperCase()} ---`);
  console.log(`Total Expected: ${cat.total}`);
  console.log(`Found: ${cat.found}`);
  console.log(`Missing: ${cat.missing}`);
  console.log(`Empty/Corrupt: ${cat.empty}`);
  
  if (cat.missing > 0 || cat.empty > 0) {
    console.log('\nIssues:');
    cat.files.filter(f => f.status !== 'FOUND').forEach(file => {
      console.log(`  ${file.status}: ${file.fileName} (${file.path})`);
    });
  }
});

// Summary
console.log('\n=== SUMMARY ===\n');
const totalExpected = Object.values(results).reduce((sum, cat) => sum + cat.total, 0);
const totalFound = Object.values(results).reduce((sum, cat) => sum + cat.found, 0);
const totalMissing = Object.values(results).reduce((sum, cat) => sum + cat.missing, 0);
const totalEmpty = Object.values(results).reduce((sum, cat) => sum + cat.empty, 0);

console.log(`Total Expected Images: ${totalExpected}`);
console.log(`Total Found: ${totalFound}`);
console.log(`Total Missing: ${totalMissing}`);
console.log(`Total Empty/Corrupt: ${totalEmpty}`);

// Exit codes
if (!allCriticalExist) {
  console.log('\n❌ CRITICAL: Some intro images are missing!');
  process.exit(1);
} else {
  console.log('\n✅ All critical intro images exist.');
  if (totalMissing > 0) {
    console.log(`⚠️  Note: ${totalMissing} lesson/character images are missing (expected).`);
  }
  process.exit(0);
}
