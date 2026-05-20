import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();

console.log('🤖 Starting NeuralEvents Automated Deployment Checks...\n');

let failedChecks = 0;

function runCheck(name, fn) {
  console.log(`Checking: ${name}...`);
  try {
    fn();
    console.log(`✅ Passed!\n`);
  } catch (error) {
    console.error(`❌ Failed: ${error.message}\n`);
    failedChecks++;
  }
}

// ─── 1. BUILD SUCCESS CHECK ───
runCheck('Vite Build Target Validation', () => {
  const distDir = path.join(rootDir, 'client', 'dist');
  if (!fs.existsSync(distDir)) {
    throw new Error('client/dist folder does not exist. Run npm run build first!');
  }
  const indexHtml = path.join(distDir, 'index.html');
  if (!fs.existsSync(indexHtml)) {
    throw new Error('client/dist/index.html not found.');
  }
});

// ─── 2. VERCEL REWRITES VALIDATION ───
runCheck('Vercel Router Rewrites Check', () => {
  const vercelJsonPath = path.join(rootDir, 'vercel.json');
  if (!fs.existsSync(vercelJsonPath)) {
    throw new Error('Root vercel.json is missing.');
  }
  const content = JSON.parse(fs.readFileSync(vercelJsonPath, 'utf8'));
  if (!content.rewrites || !Array.isArray(content.rewrites)) {
    throw new Error('Vercel config is missing rewrites array.');
  }
  const rule = content.rewrites.find(r => r.source === '/(.*)' && r.destination === '/index.html');
  if (!rule) {
    throw new Error('Vercel rewrite mapping (/(.*) -> /index.html) is missing or misconfigured.');
  }
});

// ─── 3. ROUTING & PAGES IMPORT INTEGRITY ───
runCheck('JSX Lazy Loading Integrity Check', () => {
  const appJsxPath = path.join(rootDir, 'client', 'src', 'App.jsx');
  if (!fs.existsSync(appJsxPath)) {
    throw new Error('App.jsx is missing.');
  }
  const code = fs.readFileSync(appJsxPath, 'utf8');
  const lazyImports = [...code.matchAll(/lazy\(\(\)\s*=>\s*import\(['"]\.\/pages\/(.*)['"]\)\)/g)].map(m => m[1]);
  
  if (lazyImports.length === 0) {
    throw new Error('No lazy-loaded routes found in App.jsx.');
  }

  lazyImports.forEach(page => {
    const pagePath = path.join(rootDir, 'client', 'src', 'pages', `${page}.jsx`);
    if (!fs.existsSync(pagePath)) {
      throw new Error(`Lazy loaded page file client/src/pages/${page}.jsx does not exist.`);
    }
  });
});

// ─── 4. SECURITY & EXPOSED ENVIRONMENT SAFEGUARDS ───
runCheck('Sensitive Production Environment Safeguards', () => {
  const clientEnv = path.join(rootDir, 'client', '.env.production');
  const serverEnv = path.join(rootDir, 'server', '.env.production');

  [clientEnv, serverEnv].forEach(envPath => {
    if (!fs.existsSync(envPath)) {
      throw new Error(`Production environment file missing: ${path.basename(envPath)}`);
    }
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    lines.forEach(line => {
      const parts = line.split('=');
      if (parts.length > 1) {
        const value = parts[1].trim();
        // Check for placeholder credentials or empty variables
        if (value.toLowerCase().includes('your_') || value.toLowerCase().includes('<username>')) {
          console.log(`⚠️  Reminder: Update placeholder credentials in ${path.basename(envPath)}: ${parts[0]}`);
        }
      }
    });
  });
});

// ─── 5. STATIC IMAGES & BANNERS VALIDATION ───
runCheck('Static Images and Banner Formats Check', () => {
  const mockEventsPath = path.join(rootDir, 'client', 'src', 'data', 'mockEvents.js');
  if (!fs.existsSync(mockEventsPath)) {
    throw new Error('client/src/data/mockEvents.js is missing.');
  }
  const content = fs.readFileSync(mockEventsPath, 'utf8');
  const banners = [...content.matchAll(/banner:\s*['"](.*)['"]/g)].map(m => m[1]);
  if (banners.length === 0) {
    throw new Error('No static banner event image paths found.');
  }
  banners.forEach(url => {
    if (url.startsWith('https://images.unsplash.com')) {
      if (!url.includes('auto=format') || !url.includes('fit=crop')) {
        throw new Error(`Image Unsplash URL lacks optimization options: ${url}`);
      }
    }
  });
});

console.log('🏁 Deployment checks completed.');
if (failedChecks > 0) {
  console.error(`❌ ${failedChecks} checks failed. Deployment aborted.`);
  process.exit(1);
} else {
  console.log('🚀 All automated deployment validation checks passed successfully!');
  process.exit(0);
}
