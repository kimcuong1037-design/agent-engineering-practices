import { query } from "@anthropic-ai/claude-agent-sdk";

// Create a query in plan mode (no tool execution) just to inspect available skills
const q = query({
  prompt: "list skills",
  options: {
    permissionMode: "plan",
  },
});

// Use supportedCommands() to get the list of available skills
const skills = await q.supportedCommands();

console.log("Available Claude Skills (Slash Commands):");
console.log("=".repeat(60));
for (const skill of skills) {
  const args = skill.argumentHint ? ` ${skill.argumentHint}` : "";
  console.log(`  /${skill.name}${args}`);
  console.log(`    ${skill.description}`);
  console.log();
}
console.log(`Total: ${skills.length} skills`);

q.close();
