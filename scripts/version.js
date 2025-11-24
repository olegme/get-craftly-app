import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Get the current git commit hash
let gitCommit = 'unknown';
try {
  gitCommit = execSync('git rev-parse --short HEAD').toString().trim();
} catch (e) {
  console.log('Could not get git commit hash, using "unknown"');
}

// Get the current version from package.json
const packageJsonPath = path.resolve('package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const version = packageJson.version;

// Get current timestamp
const buildTime = new Date().toISOString();

// Create environment variables file
const envContent = `VITE_APP_VERSION=${version}
VITE_BUILD_TIME=${buildTime}
VITE_GIT_COMMIT=${gitCommit}
`;

const envPath = path.resolve('.env.local');
fs.writeFileSync(envPath, envContent);

console.log(`Version info generated:
  Version: ${version}
  Build Time: ${buildTime}
  Git Commit: ${gitCommit}
`);