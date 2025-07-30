#!/usr/bin/env node

import { spawn } from 'child_process';

console.log('🚀 Installing SEO Audit Agent dependencies...\n');

const installProcess = spawn('npm', ['install'], {
  stdio: 'inherit',
  shell: true
});

installProcess.on('close', (code) => {
  if (code === 0) {
    console.log('\n✅ Installation completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('   1. Run: npm run dev');
    console.log('   2. Open: http://localhost:3000');
    console.log('   3. Start crawling and auditing websites!');
    console.log('\n🔧 Anti-Detection Features Enabled:');
    console.log('   ✓ Rotating User Agents');
    console.log('   ✓ Stealth Mode Browser');
    console.log('   ✓ Random Delays & Rate Limiting');
    console.log('   ✓ Fallback Audit Method');
    console.log('   ✓ Retry Logic with Exponential Backoff');
  } else {
    console.error('\n❌ Installation failed. Please check the error messages above.');
    process.exit(1);
  }
});