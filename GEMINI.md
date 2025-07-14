# Advanced workflow
- When I ask you to fix a new issue, follow the below steps:
1. Ask me for an issue description and create a git issue with that title using the 'gh' command
2. Create and check-out a local branch, name it in a clever way to reflect the issue title
3. Fix the issue. Work on it until I confirmed the issue is resolved.
4. Run build process to make sure there are no syntax errors. If working on an Angular project, use 'ng build -c development' command for build.
5. Summarise all changes that are not yet commited and add a short summary to @docs/CHANGES.md with a timestamp. 
6. Stage @docs/CHANGES.md for commit as well. 
7. Ask me for permission to commit, commit to git if I cofirm.
8. Upload the changes to the remote
9. Create a pull request, make sure to add a comment, which will also close the respective issue.

## Agent Guidelines for Windows Environment

When executing shell commands, be mindful of potential differences between Windows and Linux shell environments. Adapt commands as necessary to ensure compatibility and correct execution on a Windows operating system.

  # Commit preparation

  - When I ask you to prepare for commit, do the following: 1. Run build, eliminate syntax errors of any. 2. Summarise changes that are not yet commited and add a short summary to @docs/CHANGES.md with a timestamp. 3. Stage @docs/CHANGES.md for commit as well. 4. Ask me for permission to commit, commit to git if I cofirm 