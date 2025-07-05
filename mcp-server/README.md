# Web Summer Camp 2025 MCP Server

A Model Context Protocol (MCP) server for the Web Summer Camp 2025 conference, providing access to talk submissions through standardized tools and resources.

## Features

### Tools

1. **List All Talks** (`list-all-talks`)
   - Retrieves all submitted talks from the conference database
   - No parameters required
   - Returns formatted list of all talks with full details

2. **Filter Talks** (`filter-talks`)
   - Filter talks by various criteria
   - Parameters:
     - `speaker_name` (optional): Filter by speaker name (partial match, case-insensitive)
     - `level` (optional): Filter by difficulty level (Beginner, Intermediate, Advanced)
     - `track` (optional): Filter by conference track (partial match, case-insensitive)
     - `duration` (optional): Filter by exact duration in minutes
     - `min_duration` (optional): Filter by minimum duration in minutes
     - `max_duration` (optional): Filter by maximum duration in minutes

3. **Search Talks by Title** (`search-talks-by-title`)
   - Search for talks by title with both exact and partial matching
   - Parameters:
     - `search_term` (required): The title or part of the title to search for
     - `exact_match` (optional, default: false): Whether to perform exact match or partial/fuzzy search

### Resources

1. **Server Health** (`conference://health`)
   - Provides health status of the MCP server and database connection
   - Returns JSON with server and database status

2. **Server Information** (`conference://info`)
   - Provides information about the server, available tools, and configuration
   - Returns JSON with server metadata

## Installation

1. Navigate to the MCP server directory:
   ```bash
   cd mcp-server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the TypeScript code:
   ```bash
   npm run build
   ```

## Configuration

The server uses the following environment variables for database connection:

- `DB_HOST` (default: localhost)
- `DB_PORT` (default: 5432)
- `DB_NAME` (default: conference_db)
- `DB_USER` (default: conference_user)
- `DB_PASSWORD` (default: conference_pass)
- `PORT` (default: 3001, for HTTP transport only)

## Usage

### Stdio Transport (Default)

For command-line tools and direct integrations:

```bash
npm run start
# or
npm run start:stdio
```

For development with auto-reload:
```bash
npm run dev
# or
npm run dev:stdio
```

### Streamable HTTP Transport

For remote servers and web integrations:

```bash
npm run start:streamableHttp
```

For development:
```bash
npm run dev:streamableHttp
```

The HTTP server will start on port 3001 (or the port specified in the `PORT` environment variable) with the following endpoints:

- `POST /mcp` - MCP requests
- `GET /mcp` - SSE notifications  
- `DELETE /mcp` - Session termination

## Integration with MCP Clients

### Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "web-summer-camp": {
      "command": "node",
      "args": ["/path/to/web-summer-camp-2025/mcp-server/dist/index.js"],
      "env": {
        "DB_HOST": "localhost",
        "DB_NAME": "conference_db",
        "DB_USER": "conference_user",
        "DB_PASSWORD": "conference_pass"
      }
    }
  }
}
```

### VS Code MCP Extension

Add to your VS Code settings or `.vscode/mcp.json`:

```json
{
  "mcp": {
    "servers": {
      "web-summer-camp": {
        "command": "node",
        "args": ["/path/to/web-summer-camp-2025/mcp-server/dist/index.js"],
        "env": {
          "DB_HOST": "localhost",
          "DB_NAME": "conference_db", 
          "DB_USER": "conference_user",
          "DB_PASSWORD": "conference_pass"
        }
      }
    }
  }
}
```

### HTTP Client Integration

For HTTP transport, connect to:
```
http://localhost:3001/mcp
```

## Example Usage

### List All Talks
```typescript
const result = await client.callTool({
  name: "list-all-talks",
  arguments: {}
});
```

### Filter Talks by Level and Track
```typescript
const result = await client.callTool({
  name: "filter-talks",
  arguments: {
    level: "Intermediate",
    track: "JavaScript"
  }
});
```

### Search Talks by Title (Partial Match)
```typescript
const result = await client.callTool({
  name: "search-talks-by-title",
  arguments: {
    search_term: "React",
    exact_match: false
  }
});
```

### Search Talks by Title (Exact Match)
```typescript
const result = await client.callTool({
  name: "search-talks-by-title",
  arguments: {
    search_term: "Building Modern Web Applications with React",
    exact_match: true
  }
});
```

## Development

### Project Structure

```
mcp-server/
├── src/
│   ├── index.ts          # Main server implementation
│   └── database.ts       # Database service and types
├── dist/                 # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
└── README.md
```

### Building

```bash
npm run build
```

### Running in Development Mode

```bash
npm run dev              # stdio transport
npm run dev:streamableHttp  # HTTP transport
```

## Database Schema

The server expects a PostgreSQL database with the following table structure:

```sql
CREATE TABLE talks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    speaker_name VARCHAR(255) NOT NULL,
    speaker_email VARCHAR(255) NOT NULL,
    speaker_bio TEXT,
    description TEXT NOT NULL,
    duration INTEGER DEFAULT 30,
    level VARCHAR(50) DEFAULT 'Intermediate',
    track VARCHAR(50) DEFAULT 'JavaScript',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);
```

## Error Handling

The server includes comprehensive error handling:

- Database connection errors are logged and reported
- Invalid parameters return appropriate error messages
- Database query failures are caught and reported to the client
- Graceful shutdown on SIGINT/SIGTERM signals

## License

MIT License - see the main project license for details.