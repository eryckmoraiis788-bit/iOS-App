from __future__ import annotations

import base64
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REPO = "eryckmoraiis08-lgtm/Notificacao-iOS"

files = []
for path in ROOT.rglob("*"):
    if not path.is_file():
        continue
    relative = path.relative_to(ROOT)
    if ".git" in relative.parts or relative.name == "publish_github.py":
        continue
    files.append((relative.as_posix(), path))

for index, (remote_path, path) in enumerate(sorted(files), start=1):
    payload = {
        "message": f"Add project file {remote_path}",
        "content": base64.b64encode(path.read_bytes()).decode("ascii"),
        "branch": "main",
    }
    command = [
        "gh",
        "api",
        "--method",
        "PUT",
        f"repos/{REPO}/contents/{remote_path}",
        "--input",
        "-",
    ]
    result = subprocess.run(
        command,
        input=json.dumps(payload),
        text=True,
        capture_output=True,
    )
    if result.returncode != 0:
        raise SystemExit(
            f"Falha ao enviar {remote_path} ({index}/{len(files)}): {result.stderr.strip()}"
        )
    print(f"Enviado {index}/{len(files)}: {remote_path}")

print(f"Concluído: {len(files)} arquivos enviados para {REPO} na branch main.")
