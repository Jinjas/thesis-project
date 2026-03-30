import sys
import json
import re

from pathlib import Path
base_dir = Path(__file__).resolve().parent

data_dir = base_dir / "data"
data_dir.mkdir(exist_ok=True)

SAFE_FILE_TOKEN = re.compile(r"[^a-z0-9_-]")


def to_safe_filename(value: str) -> str:
    normalized = value.strip().replace(" ", "_").lower()
    safe = SAFE_FILE_TOKEN.sub("", normalized)
    if not safe:
        raise ValueError("Invalid ingredient name")
    return safe

def main():
    input_data = json.loads(sys.stdin.read())
    name = input_data["name"]

    names_file = data_dir / "NAMES.txt"
    lines = names_file.read_text(encoding="utf-8").splitlines()

    remaining = []
    
    for line in lines:
        if not line.strip():
            continue

        try:
            safe_name = to_safe_filename(line)
        except ValueError:
            continue

        data_path = data_dir / f"{safe_name}.ontodl"
        if not data_path.exists():
            continue
        if line != name:
            remaining.append(line)
        else:
            data_path.unlink()
        
        
    names_file.write_text("\n".join(remaining), encoding="utf-8")
    print(json.dumps({"ok": True}))


if __name__ == "__main__":
    main()
