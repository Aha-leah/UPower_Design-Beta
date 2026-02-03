const fs = require('fs');
const path = require('path');

const TRAE_ROOT = path.resolve(__dirname, '../../');
const RULES_DIR = path.join(TRAE_ROOT, 'rules');
const KB_DIR = path.join(TRAE_ROOT, 'knowledgebase');

function readMarkdownFiles(dir, title) {
    if (!fs.existsSync(dir)) return '';
    
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.md') && f.toLowerCase() !== 'readme.md');
    if (files.length === 0) return '';

    let content = `\n\n# ${title}\n`;
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        content += `\n## File: ${file}\n${fileContent}\n---`;
    });
    
    return content;
}

function main() {
    const rulesContent = readMarkdownFiles(RULES_DIR, '🛑 CRITICAL RULES (Highest Priority)');
    const kbContent = readMarkdownFiles(KB_DIR, '📚 KNOWLEDGE BASE (Reference Context)');
    
    if (!rulesContent && !kbContent) {
        console.log("No custom rules or knowledge base files found.");
        return;
    }

    console.log(rulesContent);
    console.log(kbContent);
}

main();
