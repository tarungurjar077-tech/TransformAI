import os
import sys

# Force UTF-8 on Windows command consoles to prevent cp1252 charmap crashes
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

# Ensure root directory is on python path
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

import uvicorn

if __name__ == "__main__":
    port = int(os.getenv("PORT", os.getenv("BACKEND_PORT", 8000)))
    host = os.getenv("BACKEND_HOST", "0.0.0.0")
    print(f"[TransformAI] Launching Backend on http://{host}:{port}")
    uvicorn.run("backend.app.main:app", host=host, port=port, reload=True)
