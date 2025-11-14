import { checkbox } from "@inquirer/prompts";
import chalk from "chalk";
import { getAllAgents } from "./agentConfig.js";
import type { AgentToggleItem } from "./types.js";

export function createAgentToggleItems(): AgentToggleItem[] {
	const { active, disabled } = getAllAgents();
	const items: AgentToggleItem[] = [];

	// Add active agents (checked by default)
	for (const name of active) {
		items.push({
			name: `${chalk.green("✓")} ${name} ${chalk.gray("(active)")}`,
			value: name,
			checked: true,
		});
	}

	// Add disabled agents (unchecked by default)
	for (const name of disabled) {
		items.push({
			name: `${chalk.red("✗")} ${name} ${chalk.gray("(disabled)")}`,
			value: name,
			checked: false,
		});
	}

	return items.sort((a, b) => a.value.localeCompare(b.value));
}

export async function showAgentToggleUI(): Promise<string[]> {
	const items = createAgentToggleItems();

	if (items.length === 0) {
		console.log(
			chalk.yellow(
				"No agents found in ~/.claude/agents or ~/.claude-ext/agents",
			),
		);
		return [];
	}

	console.log(chalk.blue("Agent Manager"));
	console.log(chalk.gray("Select which agents should be active in Claude:"));
	console.log();

	const selectedAgents = await checkbox({
		message: "Toggle agents (active agents will be in ~/.claude/agents):",
		choices: items,
		pageSize: 15,
	});

	return selectedAgents;
}
