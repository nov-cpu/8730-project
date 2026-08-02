import fs from 'fs';
import path from 'path';

// This reads the markdown file you showed in your screenshot
const fileName = 'V1_Base44_code.md'; 

try {
  const content = fs.readFileSync(fileName, 'utf8');
  const sections = content.split('<!-- ');

  sections.forEach(section => {
    if (section.includes('-->')) {
      const filePath = section.split('-->')[0].trim();
      const fileContent = section.substring(section.indexOf('-->') + 3).trim();

      // Skip the overview text
      if (filePath.includes('Overall Code') || !filePath) return;

      // Create the folders and write the file
      const fullPath = path.join(process.cwd(), filePath);
      fs.mkdirSync(path.dirname(fullPath), { recursive: true });
      fs.writeFileSync(fullPath, fileContent);
      console.log('✅ Created: ' + filePath);
    }
  });
  console.log('\n🎉 Extraction complete! The folder structure is ready.');
} catch (err) {
  console.error('Error: Could not read the file. Ensure the filename matches exactly!', err);
}