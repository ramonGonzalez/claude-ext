import {
	existsSync,
	mkdirSync,
	readdirSync,
	renameSync,
	statSync,
} from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const CLAUDE_COMMANDS_PATH = join(homedir(), ".claude", "commands");
const CLAUDE_EXT_COMMANDS_PATH = join(homedir(), ".claude-ext", "commands");

export function ensureCommandDirectories(): void {
	if (!existsSync(CLAUDE_COMMANDS_PATH)) {
		mkdirSync(CLAUDE_COMMANDS_PATH, { recursive: true });
	}
	if (!existsSync(CLAUDE_EXT_COMMANDS_PATH)) {
		mkdirSync(CLAUDE_EXT_COMMANDS_PATH, { recursive: true });
	}
}

export function getActiveCommands(): string[] {
	try {
		if (!existsSync(CLAUDE_COMMANDS_PATH)) {
			return [];
		}
		const files = readdirSync(CLAUDE_COMMANDS_PATH);
		return files
			.filter(
				(file) =>
					file.endsWith(".md") &&
					statSync(join(CLAUDE_COMMANDS_PATH, file)).isFile(),
			)
			.map((file) => file.replace(/\.md$/, ""));
	} catch (error) {
		console.error("Failed to read ~/.claude/commands:", error);
		return [];
	}
}

export function getDisabledCommands(): string[] {
	try {
		if (!existsSync(CLAUDE_EXT_COMMANDS_PATH)) {
			return [];
		}
		const files = readdirSync(CLAUDE_EXT_COMMANDS_PATH);
		return files
			.filter(
				(file) =>
					file.endsWith(".md") &&
					statSync(join(CLAUDE_EXT_COMMANDS_PATH, file)).isFile(),
			)
			.map((file) => file.replace(/\.md$/, ""));
	} catch (error) {
		console.error("Failed to read ~/.claude-ext/commands:", error);
		return [];
	}
}

export function getAllCommands(): {
	active: string[];
	disabled: string[];
} {
	return {
		active: getActiveCommands(),
		disabled: getDisabledCommands(),
	};
}

export function moveCommandToActive(commandName: string): void {
	const sourcePath = join(CLAUDE_EXT_COMMANDS_PATH, `${commandName}.md`);
	const destPath = join(CLAUDE_COMMANDS_PATH, `${commandName}.md`);

	if (existsSync(sourcePath)) {
		renameSync(sourcePath, destPath);
	}
}

export function moveCommandToDisabled(commandName: string): void {
	const sourcePath = join(CLAUDE_COMMANDS_PATH, `${commandName}.md`);
	const destPath = join(CLAUDE_EXT_COMMANDS_PATH, `${commandName}.md`);

	if (existsSync(sourcePath)) {
		renameSync(sourcePath, destPath);
	}
}
