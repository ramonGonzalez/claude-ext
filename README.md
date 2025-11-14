# claude-ext

CLI tool to manage Claude MCP (Model Context Protocol) servers, agents, and commands. Easily toggle MCP servers, agents, and commands between active and disabled states with an interactive checkbox interface.

## Installation

```bash
npm install -g claude-ext
```

## Usage

### Manage MCP Servers

Run the interactive MCP server manager:

```bash
claude-ext mcp
```

This will show you a checkbox interface where you can:
- See all your MCP servers and their current status
- Toggle servers on/off with the spacebar
- Press `a` to toggle all servers
- Press `i` to invert selection
- Press Enter to apply changes

### Manage Agents

Run the interactive agent manager:

```bash
claude-ext agents
```

This will show you a checkbox interface where you can:
- See all your agents and their current status
- Toggle agents on/off with the spacebar
- Press `a` to toggle all agents
- Press `i` to invert selection
- Press Enter to apply changes

### Manage Commands

Run the interactive command manager:

```bash
claude-ext commands
```

This will show you a checkbox interface where you can:
- See all your commands and their current status
- Toggle commands on/off with the spacebar
- Press `a` to toggle all commands
- Press `i` to invert selection
- Press Enter to apply changes

## How it works

### MCP Servers

- **Active servers** (checked ✓) are stored in `~/.claude.json` and available in Claude
- **Disabled servers** (unchecked ✗) are moved to `~/.claude-ext.json` and not loaded by Claude
- All server configurations are preserved when toggling between states

### Agents

- **Active agents** (checked ✓) are stored in `~/.claude/agents` and available in Claude
- **Disabled agents** (unchecked ✗) are moved to `~/.claude-ext/agents` and not loaded by Claude
- All agent files (.md) are preserved when toggling between states

### Commands

- **Active commands** (checked ✓) are stored in `~/.claude/commands` and available in Claude
- **Disabled commands** (unchecked ✗) are moved to `~/.claude-ext/commands` and not loaded by Claude
- All command files (.md) are preserved when toggling between states

## Requirements

- Node.js 16+
- For MCP servers: Existing `~/.claude.json` file with MCP servers configured
- For agents: Existing `~/.claude/agents` directory with agent files (.md)
- For commands: Existing `~/.claude/commands` directory with command files (.md)

## Examples

### MCP Servers

```
❯ claude-ext mcp
MCP Server Manager
Select which MCP servers should be active in Claude:

? Toggle MCP servers (active servers will be in ~/.claude.json):
❯◉ ✓ google_maps_mcp_server (active)
 ◉ ✓ playwright (active)
 ◯ ✗ postgres-beta (disabled)
 ◉ ✓ slack-user-mcp (active)
```

### Agents

```
❯ claude-ext agents
Agent Manager
Select which agents should be active in Claude:

? Toggle agents (active agents will be in ~/.claude/agents):
❯◉ ✓ architect-reviewer (active)
 ◉ ✓ code-reviewer (active)
 ◉ ✓ pr-reviewer (active)
 ◯ ✗ security-reviewer (disabled)
 ◉ ✓ ticket-implementer (active)
```

### Commands

```
❯ claude-ext commands
Command Manager
Select which commands should be active in Claude:

? Toggle commands (active commands will be in ~/.claude/commands):
❯◉ ✓ ep-architect (active)
 ◉ ✓ ep-pr-create (active)
 ◉ ✓ ep-pr-review (active)
 ◯ ✗ ep-security-check (disabled)
 ◉ ✓ ep-ticket-check (active)
```

## License

MIT