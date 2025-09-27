#!/usr/bin/env node

/**
 * Simple test script to verify the application setup
 * Run with: node test-setup.js
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Subathon Timer Setup...\n');

// Test 1: Check if required files exist
const requiredFiles = [
  'package.json',
  'server/package.json',
  'client/package.json',
  'server/index.js',
  'client/src/App.jsx',
  'vercel.json',
  'client/vercel.json'
];

console.log('📁 Checking required files...');
let allFilesExist = true;

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allFilesExist = false;
  }
});

// Test 2: Check package.json dependencies
console.log('\n📦 Checking dependencies...');

try {
  const serverPackage = JSON.parse(fs.readFileSync(path.join(__dirname, 'server/package.json'), 'utf8'));
  const clientPackage = JSON.parse(fs.readFileSync(path.join(__dirname, 'client/package.json'), 'utf8'));
  
  const requiredServerDeps = ['express', 'bcryptjs', 'jsonwebtoken'];
  const requiredClientDeps = ['react', 'axios'];
  
  console.log('Server dependencies:');
  requiredServerDeps.forEach(dep => {
    if (serverPackage.dependencies && serverPackage.dependencies[dep]) {
      console.log(`✅ ${dep}`);
    } else {
      console.log(`❌ ${dep} - MISSING`);
      allFilesExist = false;
    }
  });
  
  console.log('Client dependencies:');
  requiredClientDeps.forEach(dep => {
    if (clientPackage.dependencies && clientPackage.dependencies[dep]) {
      console.log(`✅ ${dep}`);
    } else {
      console.log(`❌ ${dep} - MISSING`);
      allFilesExist = false;
    }
  });
  
} catch (error) {
  console.log('❌ Error reading package.json files');
  allFilesExist = false;
}

// Test 3: Check for .env file
console.log('\n🔧 Checking environment setup...');
const envPath = path.join(__dirname, 'server/.env');
if (fs.existsSync(envPath)) {
  console.log('✅ server/.env file exists');
} else {
  console.log('⚠️  server/.env file missing - you need to create it');
  console.log('   See DEPLOYMENT.md for instructions');
}

// Test 4: Check Vercel configuration
console.log('\n🚀 Checking Vercel configuration...');
try {
  const vercelConfig = JSON.parse(fs.readFileSync(path.join(__dirname, 'vercel.json'), 'utf8'));
  if (vercelConfig.builds && vercelConfig.routes) {
    console.log('✅ Vercel configuration looks good');
  } else {
    console.log('❌ Vercel configuration incomplete');
    allFilesExist = false;
  }
} catch (error) {
  console.log('❌ Error reading vercel.json');
  allFilesExist = false;
}

// Summary
console.log('\n📊 Setup Summary:');
if (allFilesExist) {
  console.log('✅ All required files and dependencies are present!');
  console.log('\n🎉 Your Subathon Timer is ready to run!');
  console.log('\nNext steps:');
  console.log('1. Create server/.env file with your JWT_SECRET');
  console.log('2. Run: npm run dev');
  console.log('3. Open http://localhost:3000 in your browser');
  console.log('4. Create an account and start your timer!');
} else {
  console.log('❌ Some issues found. Please fix them before running the application.');
  console.log('\nTroubleshooting:');
  console.log('1. Make sure you\'re in the correct directory');
  console.log('2. Run: npm install (in root, server, and client directories)');
  console.log('3. Check that all files are present');
}

console.log('\n📚 For deployment instructions, see DEPLOYMENT.md');
console.log('📖 For more details, see README.md');
