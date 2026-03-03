import Anthropic from "@anthropic-ai/sdk";

const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
  console.error(
    "Error: ANTHROPIC_API_KEY environment variable is not set.\n" +
      "Set it with: export ANTHROPIC_API_KEY=sk-ant-..."
  );
  process.exit(1);
}

const client = new Anthropic({ apiKey });

// List Anthropic-managed Skills
const skills = await client.beta.skills.list({
  source: "anthropic",
  betas: ["skills-2025-10-02"],
});

console.log("Anthropic-managed Skills:");
console.log("=".repeat(60));

for (const skill of skills.data) {
  console.log(`\n  ID:             ${skill.id}`);
  console.log(`  Display Title:  ${skill.display_title}`);
  console.log(`  Source:         ${skill.source}`);
  console.log(`  Latest Version: ${skill.latest_version}`);
  console.log(`  Created:        ${skill.created_at}`);
  console.log(`  Updated:        ${skill.updated_at}`);

  // Fetch version details (name, description, directory)
  if (skill.latest_version) {
    try {
      const version = await client.beta.skills.versions.retrieve(
        skill.latest_version,
        {
          skill_id: skill.id,
          betas: ["skills-2025-10-02"],
        }
      );
      console.log(`  Name:           ${version.name}`);
      console.log(`  Description:    ${version.description}`);
      console.log(`  Directory:      ${version.directory}`);
    } catch (err) {
      console.log(`  (Could not fetch version details: ${err.message})`);
    }
  }
}

console.log("\n" + "=".repeat(60));
console.log(`Total: ${skills.data.length} skills`);
