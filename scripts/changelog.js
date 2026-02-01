import fs from 'fs';
import path from 'path';

const changesPath = path.resolve('docs/CHANGES.md');
const packageJsonPath = path.resolve('package.json');

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const version = packageJson.version;
const date = new Date().toISOString().slice(0, 10);

const existing = fs.existsSync(changesPath) ? fs.readFileSync(changesPath, 'utf8') : '';
if (existing.includes(`Version: ${version}`)) {
  process.exit(0);
}

const entry = `## ${date}\n### Release\n- Version: ${version}\n\n`;
const next = entry + existing;
fs.writeFileSync(changesPath, next);
