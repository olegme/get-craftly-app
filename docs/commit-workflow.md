# Commit Preparation Rules

When the user requests "prepare for commit", follow these mandatory steps:

1. Compile or lint every changed programming artifact (Python, JS, etc.) since the last commit to ensure there are no syntax errors.
2. Review all files changed since the last commit and append a short, timestamped summary of the changes to `docs/CHANGES.md`.
3. Stage all modified and newly created files.
4. Draft a `git commit` command with a concise, one-line message and request explicit user approval before committing.
5. Never execute the commit without receiving that approval.

Keep this document up to date if the workflow evolves.
