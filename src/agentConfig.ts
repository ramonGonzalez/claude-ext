import {
	existsSync,
	mkdirSync,
	readdirSync,
	renameSync,
	statSync,
} from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const CLAUDE_AGENTS_PATH = join(homedir(), ".claude", "agents");
const CLAUDE_EXT_AGENTS_PATH = join(homedir(), ".claude-ext", "agents");

export function ensureAgentDirectories(): void {
	if (!existsSync(CLAUDE_AGENTS_PATH)) {
		mkdirSync(CLAUDE_AGENTS_PATH, { recursive: true });
	}
	if (!existsSync(CLAUDE_EXT_AGENTS_PATH)) {
		mkdirSync(CLAUDE_EXT_AGENTS_PATH, { recursive: true });
	}
}

export function getActiveAgents(): string[] {
	try {
		if (!existsSync(CLAUDE_AGENTS_PATH)) {
			return [];
		}
		const files = readdirSync(CLAUDE_AGENTS_PATH);
		return files
			.filter(
				(file) =>
					file.endsWith(".md") &&
					statSync(join(CLAUDE_AGENTS_PATH, file)).isFile(),
			)
			.map((file) => file.replace(/\.md$/, ""));
	} catch (error) {
		console.error("Failed to read ~/.claude/agents:", error);
		return [];
	}
}

export function getDisabledAgents(): string[] {
	try {
		if (!existsSync(CLAUDE_EXT_AGENTS_PATH)) {
			return [];
		}
		const files = readdirSync(CLAUDE_EXT_AGENTS_PATH);
		return files
			.filter(
				(file) =>
					file.endsWith(".md") &&
					statSync(join(CLAUDE_EXT_AGENTS_PATH, file)).isFile(),
			)
			.map((file) => file.replace(/\.md$/, ""));
	} catch (error) {
		console.error("Failed to read ~/.claude-ext/agents:", error);
		return [];
	}
}

export function getAllAgents(): {
	active: string[];
	disabled: string[];
} {
	return {
		active: getActiveAgents(),
		disabled: getDisabledAgents(),
	};
}

export function moveAgentToActive(agentName: string): void {
	const sourcePath = join(CLAUDE_EXT_AGENTS_PATH, `${agentName}.md`);
	const destPath = join(CLAUDE_AGENTS_PATH, `${agentName}.md`);

	if (existsSync(sourcePath)) {
		renameSync(sourcePath, destPath);
	}
}

export function moveAgentToDisabled(agentName: string): void {
	const sourcePath = join(CLAUDE_AGENTS_PATH, `${agentName}.md`);
	const destPath = join(CLAUDE_EXT_AGENTS_PATH, `${agentName}.md`);

	if (existsSync(sourcePath)) {
		renameSync(sourcePath, destPath);
	}
}
