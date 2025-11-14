# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`claude-ext` is a CLI tool for managing Claude MCP (Model Context Protocol) servers, agents, and commands. It provides an interactive checkbox interface to toggle MCP servers, agents, and commands between active and disabled states.

- **MCP Servers**: Active servers are stored in `~/.claude.json` and available to Claude, while disabled servers are moved to `~/.claude-ext.json` to preserve their configurations without loading them.
- **Agents**: Active agents are stored in `~/.claude/agents` directory and available to Claude, while disabled agents are moved to `~/.claude-ext/agents` to preserve their files without loading them.
- **Commands**: Active commands are stored in `~/.claude/commands` directory and available to Claude, while disabled commands are moved to `~/.claude-ext/commands` to preserve their files without loading them.

## Development Commands

```bash
# Build the project (compiles TypeScript to dist/)
npm run build

# Run in development mode with tsx (no build required)
npm run dev

# Run the compiled CLI tool
npm start

# Lint the codebase with Biome
npm run lint

# Lint and auto-fix issues
npm run lint:fix

# Format code with Biome
npm run format

# Type check without emitting files
npm run typecheck

# Test the CLI locally (after building)
node dist/index.js mcp
node dist/index.js agents
node dist/index.js commands
```

## Architecture

### Core Data Flow

The application manages three types of resources:

**MCP Servers:**
- `~/.claude.json` - Contains active MCP servers that Claude will load
- `~/.claude-ext.json` - Contains disabled MCP servers (configs preserved but not loaded)

**Agents:**
- `~/.claude/agents/` - Contains active agent files (.md) that Claude will load
- `~/.claude-ext/agents/` - Contains disabled agent files (files preserved but not loaded)

**Commands:**
- `~/.claude/commands/` - Contains active command files (.md) that Claude will load
- `~/.claude-ext/commands/` - Contains disabled command files (files preserved but not loaded)

**Flow:** Config/File Reading → UI Display → User Selection → Config/File Writing

**MCP Servers:**
1. **Config Layer** (`src/config.ts`): Reads/writes both config files, merges server lists
2. **UI Layer** (`src/ui.ts`): Creates checkbox interface using `@inquirer/prompts`, displays servers with status indicators
3. **Manager Layer** (`src/manager.ts`): Redistributes servers between active/disabled configs based on user selection

**Agents:**
1. **Config Layer** (`src/agentConfig.ts`): Reads agent directories, lists .md files, moves files between directories
2. **UI Layer** (`src/agentUI.ts`): Creates checkbox interface using `@inquirer/prompts`, displays agents with status indicators
3. **Manager Layer** (`src/agentManager.ts`): Moves agent files between active/disabled directories based on user selection

**Commands:**
1. **Config Layer** (`src/commandConfig.ts`): Reads command directories, lists .md files, moves files between directories
2. **UI Layer** (`src/commandUI.ts`): Creates checkbox interface using `@inquirer/prompts`, displays commands with status indicators
3. **Manager Layer** (`src/commandManager.ts`): Moves command files between active/disabled directories based on user selection

**Entry Point** (`src/index.ts`): CLI command parser using Commander.js, handles 'mcp', 'agents', and 'commands' commands

### Key Architectural Patterns

- **Dual Storage Pattern**: Resources are never deleted, only moved between active and disabled locations
  - **MCP Servers**: Moved between `~/.claude.json` (active) and `~/.claude-ext.json` (disabled)
  - **Agents**: Moved between `~/.claude/agents/` (active) and `~/.claude-ext/agents/` (disabled)
  - **Commands**: Moved between `~/.claude/commands/` (active) and `~/.claude-ext/commands/` (disabled)
- **Stateless Operations**: Each run reads fresh state, applies changes, and writes/moves atomically
- **Type Safety**: TypeScript interfaces define `ClaudeConfig`, `McpServer`, `ServerToggleItem`, `AgentToggleItem`, and `CommandToggleItem` structures
- **Parallel Architecture**: MCP, agent, and command management use the same patterns but operate independently

### Module Interactions

**MCP Servers:**
```
index.ts (CLI entry - 'mcp' command)
    ↓
ui.ts (showServerToggleUI)
    → config.ts (getAllMcpServers) → Returns {active, disabled}
    → Returns selectedServers[]
    ↓
manager.ts (toggleMcpServers)
    → config.ts (read both configs)
    → Redistributes servers based on selection
    → config.ts (write both configs)
```

**Agents:**
```
index.ts (CLI entry - 'agents' command)
    ↓
agentUI.ts (showAgentToggleUI)
    → agentConfig.ts (getAllAgents) → Returns {active, disabled}
    → Returns selectedAgents[]
    ↓
agentManager.ts (toggleAgents)
    → agentConfig.ts (getAllAgents)
    → Moves agent files based on selection
    → agentConfig.ts (moveAgentToActive/moveAgentToDisabled)
```

**Commands:**
```
index.ts (CLI entry - 'commands' command)
    ↓
commandUI.ts (showCommandToggleUI)
    → commandConfig.ts (getAllCommands) → Returns {active, disabled}
    → Returns selectedCommands[]
    ↓
commandManager.ts (toggleCommands)
    → commandConfig.ts (getAllCommands)
    → Moves command files based on selection
    → commandConfig.ts (moveCommandToActive/moveCommandToDisabled)
```

## Code Style

- **Formatter**: Biome with tab indentation and double quotes
- **TypeScript**: Strict mode enabled with no implicit any/returns, unused variable checks
- **Module System**: ESM (ES modules) with `.js` extensions in imports (compiled output)
- **Error Handling**: Try-catch blocks with console.error for config operations

## Project Structure

- `src/index.ts` - CLI command parser (commander), handles 'mcp', 'agents', and 'commands' commands
- `src/config.ts` - File I/O for MCP server config files
- `src/manager.ts` - MCP server toggle logic
- `src/ui.ts` - Interactive checkbox interface for MCP servers
- `src/agentConfig.ts` - File I/O for agent directories
- `src/agentManager.ts` - Agent toggle logic
- `src/agentUI.ts` - Interactive checkbox interface for agents
- `src/commandConfig.ts` - File I/O for command directories
- `src/commandManager.ts` - Command toggle logic
- `src/commandUI.ts` - Interactive checkbox interface for commands
- `src/types.ts` - TypeScript type definitions
- `dist/` - Compiled JavaScript output (gitignored)

## Important Implementation Details

### MCP Server Configuration

Each server in the config has this structure:
```typescript
{
  command: string;      // Executable path
  args?: string[];      // Optional command arguments
  env?: Record<string, string>;  // Optional environment variables
}
```

### MCP Config File Operations

All config operations use synchronous fs methods (`readFileSync`, `writeFileSync`) since this is a short-lived CLI tool. Missing config files return empty objects rather than throwing errors.

### MCP Selection Logic

The `toggleMcpServers` function:
1. Merges all servers from both configs
2. Clears both config's `mcpServers` objects
3. Redistributes servers: selected → `~/.claude.json`, unselected → `~/.claude-ext.json`
4. Writes both configs atomically

### Agent File Operations

All file operations use synchronous fs methods (`readdirSync`, `renameSync`, `existsSync`) since this is a short-lived CLI tool. The agent manager:
- Filters for `.md` files only
- Uses `renameSync` to move files between directories (atomic operation)
- Creates directories if they don't exist (`mkdirSync` with `recursive: true`)

### Agent Selection Logic

The `toggleAgents` function:
1. Gets all agents from both directories
2. For each agent:
   - If selected and currently disabled → move to `~/.claude/agents`
   - If not selected and currently active → move to `~/.claude-ext/agents`
3. Files are moved using `renameSync` (atomic operation)

### Command File Operations

All file operations use synchronous fs methods (`readdirSync`, `renameSync`, `existsSync`) since this is a short-lived CLI tool. The command manager:
- Filters for `.md` files only
- Uses `renameSync` to move files between directories (atomic operation)
- Creates directories if they don't exist (`mkdirSync` with `recursive: true`)

### Command Selection Logic

The `toggleCommands` function:
1. Gets all commands from both directories
2. For each command:
   - If selected and currently disabled → move to `~/.claude/commands`
   - If not selected and currently active → move to `~/.claude-ext/commands`
3. Files are moved using `renameSync` (atomic operation)
