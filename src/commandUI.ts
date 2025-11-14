import { checkbox } from "@inquirer/prompts";
import chalk from "chalk";
import { getAllCommands } from "./commandConfig.js";
import type { CommandToggleItem } from "./types.js";

export function createCommandToggleItems(): CommandToggleItem[] {
	const { active, disabled } = getAllCommands();
	const items: CommandToggleItem[] = [];

	// Add active commands (checked by default)
	for (const name of active) {
		items.push({
			name: `${chalk.green("✓")} ${name} ${chalk.gray("(active)")}`,
			value: name,
			checked: true,
		});
	}

	// Add disabled commands (unchecked by default)
	for (const name of disabled) {
		items.push({
			name: `${chalk.red("✗")} ${name} ${chalk.gray("(disabled)")}`,
			value: name,
			checked: false,
		});
	}

	return items.sort((a, b) => a.value.localeCompare(b.value));
}

export async function showCommandToggleUI(): Promise<string[]> {
	const items = createCommandToggleItems();

	if (items.length === 0) {
		console.log(
			chalk.yellow(
				"No commands found in ~/.claude/commands or ~/.claude-ext/commands",
			),
		);
		return [];
	}

	console.log(chalk.blue("Command Manager"));
	console.log(chalk.gray("Select which commands should be active in Claude:"));
	console.log();

	const selectedCommands = await checkbox({
		message: "Toggle commands (active commands will be in ~/.claude/commands):",
		choices: items,
		pageSize: 15,
	});

	return selectedCommands;
}
