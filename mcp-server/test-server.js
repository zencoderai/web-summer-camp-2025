#!/usr/bin/env node

// Simple test script to verify the MCP server can start
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Testing MCP Server startup...');

// Test stdio transport
const serverProcess = spawn('node', [join(__dirname, 'dist/index.js'), 'stdio'], {
  stdio: ['pipe', 'pipe', 'pipe']
});

let output = '';
let errorOutput = '';

serverProcess.stdout.on('data', (data) => {
  output += data.toString();
});

serverProcess.stderr.on('data', (data) => {
  errorOutput += data.toString();
  console.log('Server stderr:', data.toString());
});

// Send a simple initialize request
setTimeout(() => {
  const initRequest = {
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: {
        name: 'test-client',
        version: '1.0.0'
      }
    }
  };

  serverProcess.stdin.write(JSON.stringify(initRequest) + '\n');
  
  // Give it a moment to respond, then kill
  setTimeout(() => {
    serverProcess.kill('SIGTERM');
  }, 2000);
}, 1000);

serverProcess.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
  console.log('Error output:', errorOutput);
  
  if (errorOutput.includes('Database connection successful') || errorOutput.includes('Warning: Database connection failed')) {
    console.log('✅ Server started successfully!');
  } else {
    console.log('❌ Server may have issues');
  }
  
  if (output) {
    console.log('Server output:', output);
  }
});

serverProcess.on('error', (error) => {
  console.error('Failed to start server:', error);
});