const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectName = process.argv[2];

if (!projectName) {
  console.error('❌ Please provide a project name.');
  console.error('Usage: node .trae/scaffold/bin/scaffold_project.js <project_name>');
  process.exit(1);
}

const rootDir = path.resolve(__dirname, '../../../');
const sourceDir = path.join(rootDir, 'Source', projectName);
const projectsDir = path.join(rootDir, 'projects');
const targetDir = path.join(projectsDir, projectName);

// 1. Validate Source Exists
if (!fs.existsSync(sourceDir)) {
  console.log(`ℹ️  Source directory not found. Creating: ${sourceDir}`);
  fs.mkdirSync(sourceDir, { recursive: true });

  // Copy Template Files (if template exists)
  const templateDir = path.resolve(__dirname, '../templates/Object_Name');
  if (fs.existsSync(templateDir)) {
    try {
      fs.cpSync(templateDir, sourceDir, { recursive: true });
      console.log('   ✅ Initialized Source with Template');
    } catch (err) {
      console.error('   ❌ Failed to copy template:', err);
    }
  } else {
    // Create minimal structure if template missing
    fs.mkdirSync(path.join(sourceDir, 'input'), { recursive: true });
    fs.writeFileSync(path.join(sourceDir, 'project_state.json'), JSON.stringify({ status: "raw", created: new Date() }, null, 2));
    console.log('   ✅ Initialized empty Source structure');
  }
}

// 2. Ensure projects/ folder exists
if (!fs.existsSync(projectsDir)) {
  fs.mkdirSync(projectsDir, { recursive: true });
}

// 3. Create Vite Project if it doesn't exist
if (!fs.existsSync(targetDir)) {
  console.log(`🚀 Scaffolding new project: ${projectName}...`);
  try {
    // Run npm create vite
    execSync(`npm create vite@latest ${projectName} -- --template react-ts`, {
      cwd: projectsDir,
      stdio: 'inherit'
    });
    
    // Install dependencies (optional, but good for UX)
    console.log('📦 Installing dependencies...');
    execSync('npm install', {
      cwd: targetDir,
      stdio: 'inherit'
    });
    
    // Install standard UI libs
    console.log('🎨 Installing UI libraries (lucide-react, framer-motion, clsx, tailwind-merge)...');
    execSync('npm install lucide-react framer-motion clsx tailwind-merge', {
      cwd: targetDir,
      stdio: 'inherit'
    });

    // Install Tailwind (Standard Vite approach)
    console.log('🌬️ Initializing Tailwind CSS...');
    execSync('npm install -D tailwindcss postcss autoprefixer', { cwd: targetDir, stdio: 'inherit' });
    execSync('npx tailwindcss init -p', { cwd: targetDir, stdio: 'inherit' });

  } catch (error) {
    console.error('❌ Failed to create project:', error);
    process.exit(1);
  }
} else {
  console.log(`ℹ️  Project directory already exists: ${targetDir}`);
}

// 5. Inject Assets
console.log('💉 Injecting Figma Make assets...');

// 5.1 System Prompt (Copy)
const promptSrc = path.join(sourceDir, 'system_prompt.md');
const promptDest = path.join(targetDir, 'system_prompt.md');
if (fs.existsSync(promptSrc)) {
  fs.copyFileSync(promptSrc, promptDest);
  console.log('   ✅ Copied: system_prompt.md');
} else {
  console.warn('   ⚠️  Missing source: system_prompt.md');
}

// 5.2 Data Link (Symlink - Tier 3 Strategy)
const dataDir = path.join(targetDir, 'src/data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const contentSrc = path.join(sourceDir, 'web_content.js');
const contentLink = path.join(dataDir, 'source_content.js'); // Renamed to imply it's raw source
// Relative path from src/data to Source/Project
// targetDir/src/data -> targetDir -> projectsDir -> root -> Source -> Project -> file
const relPath = path.relative(dataDir, contentSrc);

if (fs.existsSync(contentSrc)) {
  try {
    if (fs.existsSync(contentLink)) fs.unlinkSync(contentLink); // Remove existing
    fs.symlinkSync(relPath, contentLink);
    console.log('   🔗 Linked: src/data/source_content.js -> Source (Live Link)');
  } catch (e) {
    console.error('   ❌ Failed to link data:', e.message);
    // Fallback to copy if symlink fails
    fs.copyFileSync(contentSrc, contentLink);
    console.log('   ⚠️  Fallback: Copied file instead of link.');
  }
} else {
  console.warn('   ⚠️  Missing source: web_content.js');
}

// 5.3 Generate content.ts wrapper
const contentTsPath = path.join(dataDir, 'content.ts');
if (!fs.existsSync(contentTsPath)) {
  const tsContent = `// Generated Content Wrapper
// This file imports the live data from Source and types it.
// DO NOT EDIT THE DATA HERE. Edit Source/[Name]/web_content.js instead.

// @ts-ignore
import { content as rawContent } from './source_content';

export type WebContent = typeof rawContent;
export const content: WebContent = rawContent;
`;
  fs.writeFileSync(contentTsPath, tsContent);
  console.log('   ✅ Generated: src/data/content.ts (Wrapper)');
}

// 5. Create Image Directory
const imageDir = path.join(targetDir, 'src/assets/images');
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir, { recursive: true });
  console.log('   ✅ Created: src/assets/images/');
}

console.log(`
🎉 Project Scaffolding Complete!
----------------------------------------
👉 Next Steps:
1. cd projects/${projectName}
2. Open in IDE
3. Drag "system_prompt.md" to Trae/Cursor Chat
4. "Start Coding!"
`);
