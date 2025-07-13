
import subprocess
import sys

def create_issue(title, body):
    try:
        command = ["gh", "issue", "create", "--title", title, "--body", body]
        result = subprocess.run(command, capture_output=True, text=True, check=True)
        print("Issue created successfully:")
        print(result.stdout)
    except subprocess.CalledProcessError as e:
        print(f"Error creating issue: {e}", file=sys.stderr)
        print(f"Stdout: {e.stdout}", file=sys.stderr)
        print(f"Stderr: {e.stderr}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python create_git_issue.py <title> <body>", file=sys.stderr)
        sys.exit(1)
    create_issue(sys.argv[1], sys.argv[2])
