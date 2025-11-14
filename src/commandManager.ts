import chalk from "chalk";
import {
	ensureCommandDirectories,
	getAllCommands,
	moveCommandToActive,
	moveCommandToDisabled,
} from "./commandConfig.js";

export function toggleCommands(selectedCommands: string[]): void {
	// Ensure directories exist
	ensureCommandDirectories();

	const { active, disabled } = getAllCommands();
	const allCommands = [...active, ...disabled];
	const selectedSet = new Set(selectedCommands);

	// Move commands based on selection
	for (const commandName of allCommands) {
		if (selectedSet.has(commandName)) {
			// Command should be active - move to ~/.claude/commands if not already there
			if (disabled.includes(commandName)) {
				moveCommandToActive(commandName);
				console.log(chalk.green(`✓ Enabled: ${commandName}`));
			}
		} else {
			// Command should be disabled - move to ~/.claude-ext/commands if not already there
			if (active.includes(commandName)) {
				moveCommandToDisabled(commandName);
				console.log(chalk.red(`✗ Disabled: ${commandName}`));
			}
		}
	}

	// Get final counts
	const finalActive = getAllCommands().active;
	const finalDisabled = getAllCommands().disabled;

	console.log();
	console.log(chalk.blue("Configuration updated successfully!"));
	console.log(chalk.gray(`Active commands: ${finalActive.length}`));
	console.log(chalk.gray(`Disabled commands: ${finalDisabled.length}`));
}
