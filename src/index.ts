#!/usr/bin/env node

import chalk from "chalk";
import { Command } from "commander";
import { toggleAgents } from "./agentManager.js";
import { showAgentToggleUI } from "./agentUI.js";
import { toggleCommands } from "./commandManager.js";
import { showCommandToggleUI } from "./commandUI.js";
import { toggleMcpServers } from "./manager.js";
import { showServerToggleUI } from "./ui.js";

const program = new Command();

program
	.name("claude-ext")
	.description("Claude MCP Server, Agent, and Command Manager")
	.version("1.0.1")
	.argument("[command]", "Command: 'mcp', 'agents', or 'commands'")
	.action(async (command?: string) => {
		if (command === "mcp") {
			try {
				const selectedServers = await showServerToggleUI();
				if (selectedServers.length >= 0) {
					toggleMcpServers(selectedServers);
				}
			} catch (error) {
				console.error(chalk.red("Error:"), error);
				process.exit(1);
			}
		} else if (command === "agents") {
			try {
				const selectedAgents = await showAgentToggleUI();
				if (selectedAgents.length >= 0) {
					toggleAgents(selectedAgents);
				}
			} catch (error) {
				console.error(chalk.red("Error:"), error);
				process.exit(1);
			}
		} else if (command === "commands") {
			try {
				const selectedCommands = await showCommandToggleUI();
				if (selectedCommands.length >= 0) {
					toggleCommands(selectedCommands);
				}
			} catch (error) {
				console.error(chalk.red("Error:"), error);
				process.exit(1);
			}
		} else {
			program.help();
		}
	});

program.parse();
