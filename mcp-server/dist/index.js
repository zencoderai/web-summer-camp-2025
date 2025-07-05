#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";
import express from "express";
import { randomUUID } from "node:crypto";
import { dbService } from "./database.js";
// Create MCP server
const server = new McpServer({
    name: "web-summer-camp-mcp-server",
    version: "1.0.0"
});
// Helper function to format talk data for display
function formatTalk(talk) {
    return `**${talk.title}**
Speaker: ${talk.speaker_name} (${talk.speaker_email})
Level: ${talk.level} | Track: ${talk.track} | Duration: ${talk.duration} minutes
Description: ${talk.description}
${talk.speaker_bio ? `Speaker Bio: ${talk.speaker_bio}` : ''}
Created: ${talk.created_at.toISOString()}
---`;
}
// Helper function to format multiple talks
function formatTalks(talks) {
    if (talks.length === 0) {
        return "No talks found.";
    }
    const summary = `Found ${talks.length} talk${talks.length === 1 ? '' : 's'}:\n\n`;
    const formattedTalks = talks.map(formatTalk).join('\n\n');
    return summary + formattedTalks;
}
// Tool 1: List all submitter talks
server.registerTool("list-all-talks", {
    title: "List All Talks",
    description: "Retrieve all submitted talks from the conference database",
    inputSchema: {}
}, async () => {
    try {
        const talks = await dbService.getAllTalks();
        return {
            content: [{
                    type: "text",
                    text: formatTalks(talks)
                }]
        };
    }
    catch (error) {
        return {
            content: [{
                    type: "text",
                    text: `Error retrieving talks: ${error instanceof Error ? error.message : 'Unknown error'}`
                }],
            isError: true
        };
    }
});
// Tool 2: List talks subject to filters
server.registerTool("filter-talks", {
    title: "Filter Talks",
    description: "Filter talks by speaker name, level, track, and duration",
    inputSchema: {
        speaker_name: z.string().optional().describe("Filter by speaker name (partial match, case-insensitive)"),
        level: z.enum(["Beginner", "Intermediate", "Advanced"]).optional().describe("Filter by difficulty level"),
        track: z.string().optional().describe("Filter by conference track (partial match, case-insensitive)"),
        duration: z.number().optional().describe("Filter by exact duration in minutes"),
        min_duration: z.number().optional().describe("Filter by minimum duration in minutes"),
        max_duration: z.number().optional().describe("Filter by maximum duration in minutes")
    }
}, async (params) => {
    try {
        const filters = {};
        // Build filters object from parameters
        if (params.speaker_name)
            filters.speaker_name = params.speaker_name;
        if (params.level)
            filters.level = params.level;
        if (params.track)
            filters.track = params.track;
        if (params.duration)
            filters.duration = params.duration;
        if (params.min_duration)
            filters.min_duration = params.min_duration;
        if (params.max_duration)
            filters.max_duration = params.max_duration;
        const talks = await dbService.getTalksWithFilters(filters);
        // Create filter summary
        const appliedFilters = [];
        if (params.speaker_name)
            appliedFilters.push(`Speaker: "${params.speaker_name}"`);
        if (params.level)
            appliedFilters.push(`Level: ${params.level}`);
        if (params.track)
            appliedFilters.push(`Track: "${params.track}"`);
        if (params.duration)
            appliedFilters.push(`Duration: ${params.duration} minutes`);
        if (params.min_duration)
            appliedFilters.push(`Min Duration: ${params.min_duration} minutes`);
        if (params.max_duration)
            appliedFilters.push(`Max Duration: ${params.max_duration} minutes`);
        const filterSummary = appliedFilters.length > 0
            ? `Applied filters: ${appliedFilters.join(', ')}\n\n`
            : '';
        return {
            content: [{
                    type: "text",
                    text: filterSummary + formatTalks(talks)
                }]
        };
    }
    catch (error) {
        return {
            content: [{
                    type: "text",
                    text: `Error filtering talks: ${error instanceof Error ? error.message : 'Unknown error'}`
                }],
            isError: true
        };
    }
});
// Tool 3: Search talk by title
server.registerTool("search-talks-by-title", {
    title: "Search Talks by Title",
    description: "Search for talks by title with both exact and partial matching options",
    inputSchema: {
        search_term: z.string().describe("The title or part of the title to search for"),
        exact_match: z.boolean().optional().default(false).describe("Whether to perform exact match (true) or partial/fuzzy search (false, default)")
    }
}, async ({ search_term, exact_match = false }) => {
    try {
        const talks = await dbService.searchTalksByTitle(search_term, exact_match);
        const searchType = exact_match ? 'exact match' : 'partial match';
        const searchSummary = `Search results for "${search_term}" (${searchType}):\n\n`;
        return {
            content: [{
                    type: "text",
                    text: searchSummary + formatTalks(talks)
                }]
        };
    }
    catch (error) {
        return {
            content: [{
                    type: "text",
                    text: `Error searching talks: ${error instanceof Error ? error.message : 'Unknown error'}`
                }],
            isError: true
        };
    }
});
// Health check resource
server.registerResource("health", "conference://health", {
    title: "Server Health",
    description: "Health status of the MCP server and database connection",
    mimeType: "application/json"
}, async () => {
    const dbConnected = await dbService.testConnection();
    const health = {
        server: "healthy",
        database: dbConnected ? "connected" : "disconnected",
        timestamp: new Date().toISOString()
    };
    return {
        contents: [{
                uri: "conference://health",
                text: JSON.stringify(health, null, 2)
            }]
    };
});
// Server info resource
server.registerResource("info", "conference://info", {
    title: "Server Information",
    description: "Information about the Web Summer Camp 2025 MCP server",
    mimeType: "application/json"
}, async () => {
    const info = {
        name: "Web Summer Camp 2025 MCP Server",
        version: "1.0.0",
        description: "MCP server providing access to conference talk submissions",
        tools: [
            {
                name: "list-all-talks",
                description: "List all submitted talks"
            },
            {
                name: "filter-talks",
                description: "Filter talks by various criteria"
            },
            {
                name: "search-talks-by-title",
                description: "Search talks by title"
            }
        ],
        database: {
            host: process.env.DB_HOST || 'localhost',
            database: process.env.DB_NAME || 'conference_db'
        }
    };
    return {
        contents: [{
                uri: "conference://info",
                text: JSON.stringify(info, null, 2)
            }]
    };
});
// Main function to start the server
async function main() {
    const args = process.argv.slice(2);
    const transport = args[0] || 'stdio';
    // Test database connection on startup
    console.error('Testing database connection...');
    const dbConnected = await dbService.testConnection();
    if (!dbConnected) {
        console.error('Warning: Database connection failed. Server will start but tools may not work properly.');
    }
    else {
        console.error('Database connection successful.');
    }
    if (transport === 'streamableHttp') {
        // HTTP transport setup
        const app = express();
        app.use(express.json());
        // Map to store transports by session ID
        const transports = {};
        // Handle POST requests for client-to-server communication
        app.post('/mcp', async (req, res) => {
            const sessionId = req.headers['mcp-session-id'];
            let transport;
            if (sessionId && transports[sessionId]) {
                transport = transports[sessionId];
            }
            else if (!sessionId) {
                transport = new StreamableHTTPServerTransport({
                    sessionIdGenerator: () => randomUUID(),
                    onsessioninitialized: (sessionId) => {
                        transports[sessionId] = transport;
                    }
                });
                transport.onclose = () => {
                    if (transport.sessionId) {
                        delete transports[transport.sessionId];
                    }
                };
                await server.connect(transport);
            }
            else {
                res.status(400).json({
                    jsonrpc: '2.0',
                    error: {
                        code: -32000,
                        message: 'Bad Request: No valid session ID provided',
                    },
                    id: null,
                });
                return;
            }
            await transport.handleRequest(req, res, req.body);
        });
        // Handle GET requests for server-to-client notifications via SSE
        app.get('/mcp', async (req, res) => {
            const sessionId = req.headers['mcp-session-id'];
            if (!sessionId || !transports[sessionId]) {
                res.status(400).send('Invalid or missing session ID');
                return;
            }
            const transport = transports[sessionId];
            await transport.handleRequest(req, res);
        });
        // Handle DELETE requests for session termination
        app.delete('/mcp', async (req, res) => {
            const sessionId = req.headers['mcp-session-id'];
            if (!sessionId || !transports[sessionId]) {
                res.status(400).send('Invalid or missing session ID');
                return;
            }
            const transport = transports[sessionId];
            await transport.handleRequest(req, res);
        });
        const port = process.env.PORT || 3001;
        app.listen(port, () => {
            console.error(`Web Summer Camp MCP Server listening on port ${port}`);
            console.error('Available endpoints:');
            console.error(`  POST http://localhost:${port}/mcp - MCP requests`);
            console.error(`  GET  http://localhost:${port}/mcp - SSE notifications`);
            console.error(`  DELETE http://localhost:${port}/mcp - Session termination`);
        });
    }
    else {
        // Default to stdio transport
        const transport = new StdioServerTransport();
        console.error('Web Summer Camp MCP Server starting with stdio transport...');
        await server.connect(transport);
    }
}
// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.error('Shutting down...');
    await dbService.close();
    process.exit(0);
});
process.on('SIGTERM', async () => {
    console.error('Shutting down...');
    await dbService.close();
    process.exit(0);
});
// Start the server
main().catch((error) => {
    console.error('Server error:', error);
    process.exit(1);
});
