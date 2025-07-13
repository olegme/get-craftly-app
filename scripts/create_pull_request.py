
import subprocess
import sys

def create_pull_request(title, body, base_branch=None, head_branch=None):
    try:
        command = ["gh", "pr", "create", "--title", title, "--body", body]
        if base_branch:
            command.extend(["--base", base_branch])
        if head_branch:
            command.extend(["--head", head_branch])

        result = subprocess.run(command, capture_output=True, text=True, check=True)
        print("Pull request created successfully:")
        print(result.stdout)
    except subprocess.CalledProcessError as e:
        print(f"Error creating pull request: {e}", file=sys.stderr)
        print(f"Stdout: {e.stdout}", file=sys.stderr)
        print(f"Stderr: {e.stderr}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    # Basic usage: python create_pull_request.py <title> <body>
    # With base and head branches: python create_pull_request.py <title> <body> <base_branch> <head_branch>
    if len(sys.argv) < 3 or len(sys.argv) == 4 or len(sys.argv) > 5:
        print("Usage: python create_pull_request.py <title> <body> [base_branch] [head_branch]", file=sys.stderr)
        sys.exit(1)

    title = sys.argv[1]
    body = sys.argv[2]
    base_branch = sys.argv[3] if len(sys.argv) > 3 else None
    head_branch = sys.argv[4] if len(sys.argv) > 4 else None

    create_pull_request(title, body, base_branch, head_branch)
