from __future__ import annotations

import base64
import json
import subprocess
import tempfile
from pathlib import Path

repo = "eryckmoraiis788-bit/iOS-App"
remote_path = "app/(tabs)/index.tsx"
api_path = "app/%28tabs%29/index.tsx"
source = Path(__file__).resolve().parents[1] / remote_path

with tempfile.NamedTemporaryFile(mode="w+b", delete=False) as handle:
    metadata_path = Path(handle.name)
with metadata_path.open("wb") as output:
    subprocess.run(
        ["gh", "api", f"repos/{repo}/contents/{api_path}"],
        check=True,
        stdout=output,
    )
metadata = json.loads(metadata_path.read_text())
payload = {
    "message": "Diagnose blank Compose route with native-only screen",
    "content": base64.b64encode(source.read_bytes()).decode("ascii"),
    "sha": metadata["sha"],
    "branch": "main",
}
subprocess.run(
    ["gh", "api", "--method", "PUT", f"repos/{repo}/contents/{api_path}", "--input", "-"],
    input=json.dumps(payload),
    text=True,
    check=True,
)
print(f"Published {remote_path} to {repo}")
