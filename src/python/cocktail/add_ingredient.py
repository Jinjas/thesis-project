import sys
import json
import re

import odlc

from pathlib import Path
base_dir = Path(__file__).resolve().parent

data_dir = base_dir / "data"
data_dir.mkdir(exist_ok=True)

SAFE_FILE_TOKEN = re.compile(r"[^a-z0-9_-]")


def to_safe_filename(value: str) -> str:
    normalized = value.strip().replace(" ", "_").lower()
    safe = SAFE_FILE_TOKEN.sub("", normalized)
    if not safe:
        raise ValueError("Invalid cocktail name")
    return safe

def add_ingredient_lines(onto_text: str, ingredient_name: str, ingredient_type: str):
    lines = onto_text.splitlines()
    result = []
    conceptsHolder = []

    in_zone1 = False
    in_zone2 = False
    cocktail_name = lines[0].strip().split()[1]

    for line in lines:
        stripped = line.lstrip()
        
        if stripped.startswith("concepts"):
            in_zone1 = True
            result.append(line)
            continue

        if in_zone1 and stripped.startswith("}"):
            in_zone1 = False
            if not result[-2].rstrip().endswith(",") and not result[-2].lstrip().startswith("concepts"):
                result[-2] = result[-2] + ","
            result.extend(conceptsHolder)
            result.append(line)
            conceptsHolder = []
            continue
        if in_zone1:
            if ingredient_type not in stripped:
                if stripped.startswith("%"):
                    conceptsHolder.append(line)
                    continue
                else:
                    result.append(line)
                    continue
            else:
                if stripped.startswith("%"):
                    idx = line.index("%")
                    line = line[:idx] + line[idx + 1 :]
                result.append(line)
                continue
        if stripped.startswith("individuals"):
            result.append(line)
            result.append(f"    {ingredient_name},")
            continue
        if stripped.startswith("triples"):
            in_zone2 = True
            result.append(line)
            result.append(f"    {ingredient_name} = iof => {ingredient_type};")
            continue
        if in_zone2 and stripped.startswith("}"):
            in_zone2 = False
            result.append(f"    {ingredient_name} = pof => {cocktail_name}Cocktail;")
            result.append(line)
            continue
        result.append(line)



    return cocktail_name, "\n".join(result)

def main():
    input_data = json.loads(sys.stdin.read())
    
    path = input_data["path"]
    onto = input_data["onto"]
    ingredient_name = input_data["ingredient_name"]
    ingredient_type = input_data["ingredient_type"]
    
    cocktail_name, updated_onto = add_ingredient_lines(onto, ingredient_name,ingredient_type)

    safe_cocktail_name = to_safe_filename(cocktail_name)
    data_path = data_dir / f"{safe_cocktail_name}.ontodl"
    data_path.write_text(updated_onto, encoding="utf-8")

    updated_svg = odlc.generate_svg(updated_onto, path)
    
    print(json.dumps({
        "updatedOnto": updated_onto,
        "updatedSvg": updated_svg
    }))

if __name__ == "__main__":
    main()
