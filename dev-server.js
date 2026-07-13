#!/usr/bin/env node

/**
 * GraveFinder Cross-Platform Development Server Launcher
 * 
 * Usage:
 *   npm run dev
 * 
 * This script automatically selects the appropriate command based on the OS
 * and provides a consistent experience across Windows, macOS, and Linux
 */

const os = require('os');
const { spawn } = require('child_process');
const path = require('path');

// Detect the operating system
const platform = os.platform();
const isWindows = platform === 'win32';

console.log(`\n🌍 GraveFinder Development Server`);
console.log(`📱 Platform: ${platform === 'win32' ? 'Windows' : platform === 'darwin' ? 'macOS' : 'Linux'}`);
console.log(`🔧 Node version: ${process.version}\n`);

// Start the HTTP server
const command = isWindows ? 'npx.cmd' : 'npx';
const args = ['http-server', '-p', '8000', '-g'];

console.log(`⏳ Starting local development server on http://localhost:8000\n`);
console.log(`📂 Serving files from: ${path.resolve(__dirname)}\n`);
console.log('💡 Tips:');
console.log('   • Open http://localhost:8000 in your browser');
console.log('   • Press Ctrl+C to stop the server');
console.log('   • Files are auto-reloaded (refresh your browser)\n');

const server = spawn(command, args, { stdio: 'inherit' });

server.on('close', (code) => {
  if (code !== 0 && code !== null) {
    console.error(`\n❌ Server stopped with error code ${code}`);
  } else {
    console.log(`\n✅ Development server stopped`);
  }
  process.exit(code);
});

// Handle termination signals
process.on('SIGINT', () => {
  console.log('\n\n👋 Shutting down development server...');
  server.kill();
});

process.on('SIGTERM', () => {
  server.kill();
});
