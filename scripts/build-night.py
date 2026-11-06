"""Build all runtime sources and the runnable V2 night, preserving the legacy entry.
Run: python3 scripts/build-night.py
Then: python3 -m http.server 8000 --directory dist/play
Open http://localhost:8000/ (V2) or /legacy.html (original journey).
"""
from pathlib import Path
import subprocess
import sys
ROOT = Path(__file__).resolve().parents[1]
for script in ('film/build.py', 'anthology/build-all.py', 'hub/build.py', 'scripts/build-play.py'):
    subprocess.run([sys.executable, str(ROOT / script)], cwd=ROOT, check=True)
