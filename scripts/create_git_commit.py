
import subprocess
import sys

def create_commit_from_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            message = f.read()
        command = ["git", "commit", "-F", filepath]
        result = subprocess.run(command, capture_output=True, text=True, check=True)
        print("Commit created successfully:")
        print(result.stdout)
    except subprocess.CalledProcessError as e:
        print(f"Error creating commit: {e}", file=sys.stderr)
        print(f"Stdout: {e.stdout}", file=sys.stderr)
        print(f"Stderr: {e.stderr}", file=sys.stderr)
        sys.exit(1)
    except FileNotFoundError:
        print(f"Error: Commit message file not found at {filepath}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python create_git_commit.py <filepath_to_message>", file=sys.stderr)
        sys.exit(1)
    create_commit_from_file(sys.argv[1])
