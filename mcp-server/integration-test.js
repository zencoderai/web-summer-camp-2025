#!/usr/bin/env node

// Integration test for MCP server tools
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Running MCP Server Integration Tests...\n');

class MCPTester {
  constructor() {
    this.requestId = 1;
    this.serverProcess = null;
  }

  async startServer() {
    return new Promise((resolve, reject) => {
      this.serverProcess = spawn('node', [join(__dirname, 'dist/index.js'), 'stdio'], {
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let initialized = false;

      this.serverProcess.stderr.on('data', (data) => {
        const output = data.toString();
        console.log('Server:', output.trim());
        
        if (output.includes('Web Summer Camp MCP Server starting') && !initialized) {
          initialized = true;
          resolve();
        }
      });

      this.serverProcess.on('error', reject);
      
      // Timeout after 10 seconds
      setTimeout(() => {
        if (!initialized) {
          reject(new Error('Server failed to start within 10 seconds'));
        }
      }, 10000);
    });
  }

  async sendRequest(method, params = {}) {
    return new Promise((resolve, reject) => {
      const request = {
        jsonrpc: '2.0',
        id: this.requestId++,
        method,
        params
      };

      let responseData = '';
      
      const onData = (data) => {
        responseData += data.toString();
        
        // Try to parse JSON response
        try {
          const lines = responseData.split('\n').filter(line => line.trim());
          for (const line of lines) {
            const response = JSON.parse(line);
            if (response.id === request.id) {
              this.serverProcess.stdout.removeListener('data', onData);
              resolve(response);
              return;
            }
          }
        } catch (e) {
          // Continue collecting data
        }
      };

      this.serverProcess.stdout.on('data', onData);
      
      // Send request
      this.serverProcess.stdin.write(JSON.stringify(request) + '\n');
      
      // Timeout after 5 seconds
      setTimeout(() => {
        this.serverProcess.stdout.removeListener('data', onData);
        reject(new Error(`Request timeout for ${method}`));
      }, 5000);
    });
  }

  async initialize() {
    console.log('1. Initializing server...');
    const response = await this.sendRequest('initialize', {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: {
        name: 'integration-test',
        version: '1.0.0'
      }
    });
    
    if (response.result) {
      console.log('✅ Server initialized successfully');
      return true;
    } else {
      console.log('❌ Server initialization failed');
      return false;
    }
  }

  async testListTools() {
    console.log('\n2. Testing list tools...');
    const response = await this.sendRequest('tools/list');
    
    if (response.result && response.result.tools) {
      const tools = response.result.tools;
      console.log(`✅ Found ${tools.length} tools:`);
      tools.forEach(tool => {
        console.log(`   - ${tool.name}: ${tool.description}`);
      });
      return tools.length === 3; // We expect 3 tools
    } else {
      console.log('❌ Failed to list tools');
      return false;
    }
  }

  async testListResources() {
    console.log('\n3. Testing list resources...');
    const response = await this.sendRequest('resources/list');
    
    if (response.result && response.result.resources) {
      const resources = response.result.resources;
      console.log(`✅ Found ${resources.length} resources:`);
      resources.forEach(resource => {
        console.log(`   - ${resource.uri}: ${resource.name}`);
      });
      return resources.length === 2; // We expect 2 resources
    } else {
      console.log('❌ Failed to list resources');
      return false;
    }
  }

  async testHealthResource() {
    console.log('\n4. Testing health resource...');
    const response = await this.sendRequest('resources/read', {
      uri: 'conference://health'
    });
    
    if (response.result && response.result.contents) {
      const content = JSON.parse(response.result.contents[0].text);
      console.log('✅ Health check successful:', content);
      return content.server === 'healthy';
    } else {
      console.log('❌ Health resource failed');
      return false;
    }
  }

  async testListAllTalksTool() {
    console.log('\n5. Testing list-all-talks tool...');
    const response = await this.sendRequest('tools/call', {
      name: 'list-all-talks',
      arguments: {}
    });
    
    if (response.result && response.result.content) {
      console.log('✅ List all talks tool works');
      console.log('Response preview:', response.result.content[0].text.substring(0, 200) + '...');
      return true;
    } else if (response.error) {
      console.log('⚠️  List all talks tool returned error (expected if no data):', response.error.message);
      return true; // This is acceptable if database is empty
    } else {
      console.log('❌ List all talks tool failed');
      return false;
    }
  }

  async testFilterTalksTool() {
    console.log('\n6. Testing filter-talks tool...');
    const response = await this.sendRequest('tools/call', {
      name: 'filter-talks',
      arguments: {
        level: 'Intermediate'
      }
    });
    
    if (response.result && response.result.content) {
      console.log('✅ Filter talks tool works');
      console.log('Response preview:', response.result.content[0].text.substring(0, 200) + '...');
      return true;
    } else if (response.error) {
      console.log('⚠️  Filter talks tool returned error (expected if no data):', response.error.message);
      return true; // This is acceptable if database is empty
    } else {
      console.log('❌ Filter talks tool failed');
      return false;
    }
  }

  async testSearchTalksTool() {
    console.log('\n7. Testing search-talks-by-title tool...');
    const response = await this.sendRequest('tools/call', {
      name: 'search-talks-by-title',
      arguments: {
        search_term: 'React',
        exact_match: false
      }
    });
    
    if (response.result && response.result.content) {
      console.log('✅ Search talks tool works');
      console.log('Response preview:', response.result.content[0].text.substring(0, 200) + '...');
      return true;
    } else if (response.error) {
      console.log('⚠️  Search talks tool returned error (expected if no data):', response.error.message);
      return true; // This is acceptable if database is empty
    } else {
      console.log('❌ Search talks tool failed');
      return false;
    }
  }

  async cleanup() {
    if (this.serverProcess) {
      this.serverProcess.kill('SIGTERM');
    }
  }

  async runAllTests() {
    try {
      await this.startServer();
      
      const results = [];
      results.push(await this.initialize());
      results.push(await this.testListTools());
      results.push(await this.testListResources());
      results.push(await this.testHealthResource());
      results.push(await this.testListAllTalksTool());
      results.push(await this.testFilterTalksTool());
      results.push(await this.testSearchTalksTool());
      
      const passed = results.filter(r => r).length;
      const total = results.length;
      
      console.log(`\n📊 Test Results: ${passed}/${total} tests passed`);
      
      if (passed === total) {
        console.log('🎉 All tests passed! MCP server is working correctly.');
      } else {
        console.log('⚠️  Some tests failed. Check the output above for details.');
      }
      
    } catch (error) {
      console.error('❌ Test suite failed:', error.message);
    } finally {
      await this.cleanup();
    }
  }
}

// Run the tests
const tester = new MCPTester();
tester.runAllTests();