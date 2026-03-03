import { writeFileSync } from "fs";
import { query } from "@anthropic-ai/claude-agent-sdk";

// Unset to allow running from within a Claude Code session
delete process.env.CLAUDECODE;

const log = (msg) => writeFileSync("/dev/stderr", msg + "\n");

log("Starting query...");

const q = query({
  prompt: "hello",
  options: {
    permissionMode: "plan",
    maxTurns: 1,
  },
});

try {
  log("Waiting for initialization...");
  const initResult = await q.initializationResult();
  log("Got initialization result");

  const lines = ["Available Claude Skills (Slash Commands):", "=".repeat(60)];
  for (const skill of initResult.commands) {
    const args = skill.argumentHint ? ` ${skill.argumentHint}` : "";
    lines.push(`  /${skill.name}${args}`);
    lines.push(`    ${skill.description}`);
    lines.push("");
  }
  lines.push(`Total: ${initResult.commands.length} skills`);

  writeFileSync("skills-output.txt", lines.join("\n"));
  log("Output written to skills-output.txt");
} catch (err) {
  log("Error: " + err.message);
} finally {
  q.close();
  log("Done");
}
