"""
Run database migrations.

Usage:
    python -m scripts.run_migrations
"""
import subprocess
import sys
from pathlib import Path

# Change to backend directory
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))


def run_migrations():
    """Run alembic migrations."""
    print("🔄 Running database migrations...")
    
    result = subprocess.run(
        ["alembic", "upgrade", "head"],
        cwd=backend_dir,
        capture_output=True,
        text=True
    )
    
    if result.returncode == 0:
        print("✅ Migrations completed successfully")
        if result.stdout:
            print(result.stdout)
    else:
        print("❌ Migration failed")
        print(result.stderr)
        sys.exit(1)


if __name__ == "__main__":
    run_migrations()

