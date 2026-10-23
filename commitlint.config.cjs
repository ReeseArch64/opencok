module.exports = {
  extends: ["@commitlint/config-conventional"],
  // Dependabot's own commit subjects ("Bump foo from 1 to 2") are
  // capitalized and would otherwise fail `subject-case`; they're
  // machine-generated and out of the team's control, so skip linting them.
  ignores: [(message) => message.includes("Signed-off-by: dependabot[bot]")],
};
