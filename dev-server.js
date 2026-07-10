const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Determine port
let port = 9001;

// Load env files in order of Next.js priority
const envFiles = ['.env.development.local', '.env.local', '.env.development', '.env'];

for (const file of envFiles) {
  const envPath = path.join(__dirname, file);
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    // Match line like PORT=9001
    const match = content.match(/^PORT\s*=\s*(\d+)/m);
    if (match) {
      port = parseInt(match[1], 10);
      break;
    }
  }
}

// Check if environment PORT variable overrides it
if (process.env.PORT) {
  port = parseInt(process.env.PORT, 10);
}

const isStart = process.argv.includes('start');
const command = isStart ? 'start' : 'dev';

console.log(`Starting Next.js server in ${command} mode on port: ${port}`);
try {
  execSync(`npx next ${command} -p ${port}`, { stdio: 'inherit' });
} catch (error) {
  // Silence error if process was interrupted/killed by user
  if (error.status !== 130) {
    console.error(`Failed to start Next.js server in ${command} mode:`, error.message);
  }
}
