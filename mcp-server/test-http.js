#!/usr/bin/env node

// Simple HTTP test for the MCP server
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Testing MCP Server HTTP transport...\n');

// Start server with HTTP transport
const serverProcess = spawn('node', [join(__dirname, 'dist/index.js'), 'streamableHttp'], {
  stdio: ['pipe', 'pipe', 'pipe'],
  env: { ...process.env, PORT: '3003' }
});

let serverReady = false;

serverProcess.stderr.on('data', (data) => {
  const output = data.toString();
  console.log('Server:', output.trim());
  
  if (output.includes('listening on port')) {
    serverReady = true;
    testHttpEndpoint();
  }
});

serverProcess.stdout.on('data', (data) => {
  console.log('Server stdout:', data.toString());
});

async function testHttpEndpoint() {
  console.log('\nTesting HTTP endpoint...');
  
  try {
    // Test with a simple initialize request
    const initRequest = {
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: {
          name: 'http-test-client',
          version: '1.0.0'
        }
      }
    };

    const response = await fetch('http://localhost:3003/mcp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(initRequest)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ HTTP endpoint works!');
      console.log('Response:', JSON.stringify(result, null, 2));
    } else {
      console.log('❌ HTTP endpoint failed:', response.status, response.statusText);
    }
  } catch (error) {
    console.log('❌ HTTP test failed:', error.message);
  }
  
  // Clean up
  setTimeout(() => {
    serverProcess.kill('SIGTERM');
  }, 1000);
}

serverProcess.on('close', (code) => {
  console.log(`\nServer process exited with code ${code}`);
});

serverProcess.on('error', (error) => {
  console.error('Failed to start server:', error);
});

// Timeout after 10 seconds
setTimeout(() => {
  if (!serverReady) {
    console.log('❌ Server failed to start within 10 seconds');
    serverProcess.kill('SIGTERM');
  }
}, 10000);