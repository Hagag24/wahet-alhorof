const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const introImages = [
  'alazhar_minarets_faculty.png',
  'magical_research_book.png',
  'golden_honor_board.png',
  'welcome_magic_gate.png',
  'skills_floating_island.png',
  'flying_adventure_train.png'
];

const sourceDir = path.join(__dirname, '../public/images/intro');
const thumbDir = path.join(__dirname, '../public/images/intro/thumbs');

// Create thumbs directory if it doesn't exist
if (!fs.existsSync(thumbDir)) {
  fs.mkdirSync(thumbDir, { recursive: true });
}

async function generateThumbnail(imageName) {
  const sourcePath = path.join(sourceDir, imageName);
  const thumbPath = path.join(thumbDir, imageName);
  
  try {
    await sharp(sourcePath)
      .resize(400, 300, { fit: 'cover' })
      .jpeg({ quality: 80 })
      .toFile(thumbPath);
    
    console.log(`✅ Generated thumbnail: ${imageName}`);
  } catch (error) {
    console.error(`❌ Error generating thumbnail for ${imageName}:`, error.message);
  }
}

async function generateAllThumbnails() {
  console.log('Generating thumbnails for intro images...\n');
  
  for (const image of introImages) {
    await generateThumbnail(image);
  }
  
  console.log('\n✅ Thumbnail generation complete!');
}

generateAllThumbnails().catch(console.error);
