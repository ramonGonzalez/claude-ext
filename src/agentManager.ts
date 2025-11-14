import chalk from "chalk";
import {
	ensureAgentDirectories,
	getAllAgents,
	moveAgentToActive,
	moveAgentToDisabled,
} from "./agentConfig.js";

export function toggleAgents(selectedAgents: string[]): void {
	// Ensure directories exist
	ensureAgentDirectories();

	const { active, disabled } = getAllAgents();
	const allAgents = [...active, ...disabled];
	const selectedSet = new Set(selectedAgents);

	// Move agents based on selection
	for (const agentName of allAgents) {
		if (selectedSet.has(agentName)) {
			// Agent should be active - move to ~/.claude/agents if not already there
			if (disabled.includes(agentName)) {
				moveAgentToActive(agentName);
				console.log(chalk.green(`✓ Enabled: ${agentName}`));
			}
		} else {
			// Agent should be disabled - move to ~/.claude-ext/agents if not already there
			if (active.includes(agentName)) {
				moveAgentToDisabled(agentName);
				console.log(chalk.red(`✗ Disabled: ${agentName}`));
			}
		}
	}

	// Get final counts
	const finalActive = getAllAgents().active;
	const finalDisabled = getAllAgents().disabled;

	console.log();
	console.log(chalk.blue("Configuration updated successfully!"));
	console.log(chalk.gray(`Active agents: ${finalActive.length}`));
	console.log(chalk.gray(`Disabled agents: ${finalDisabled.length}`));
}
