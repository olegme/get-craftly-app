# Rules to follow on every task

- After each completed task run build process to make sure there are no syntax errors. If working on an Angular project, use 'ng build -c development' command for build.

- After finishing a task, wait for my explicit confirmation, summaries the changes made and add an entry to CHANGES.md with a timestamp. Then wait for my explicit order and after my direct order commit the changes.

- Use 'gh' command line tool to interact with GitHub to manage issues. You are allowed to manage issues without my permission.
- Never ever commit to git without my explicit permission.
- After any change run linting, but don't run the application unless explicitly commanded to to so

After we worked on a task, wait for my confirmation that the changes are accepted and the application runs without issues. After that add a short summary of the made changes to @docs/CHANGES.md and commit current git branch.

## Agent Guidelines for Windows Environment

When executing shell commands, be mindful of potential differences between Windows and Linux shell environments. Adapt commands as necessary to ensure compatibility and correct execution on a Windows operating system.

  # Commit preparation

  - When I ask you to prepare for commit, do the following: 1. Run build, eliminate syntax errors of any. 2. Summarise changes that are not yet commited and add a short summary to @docs/CHANGES.md with a timestamp. 3. Stage @docs/CHANGES.md for commit as well. 4. Ask me for permission to commit, commit to git if I cofirm 