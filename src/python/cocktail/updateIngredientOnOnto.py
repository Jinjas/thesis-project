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

def update_ingredient_line(active: bool, onto_text: str, prev_ingredient: str, new_ingredient: str, prev_ingredient_type: str, new_ingredient_type: str):
    lines = onto_text.splitlines()
    result = []

    conceptsHolder = []
    in_zone = False
    rem_concept = True
    in_zone_individual = False
    cocktail_name = lines[0].strip().split()[1]
    prev_ingredient_pattern = re.compile(r'\b' + re.escape(prev_ingredient) + r'\b')
    
    for line in lines:
        if not line.lstrip().startswith("%") and ("= iof => " + prev_ingredient_type) in line and not prev_ingredient_pattern.search(line):
            rem_concept = False
            break

    if active:
        for line in lines:
            stripped = line.lstrip()

            if stripped.startswith("concepts"):
                in_zone = True
                result.append(line)
                continue

            if stripped.startswith("individuals"):
                in_zone_individual = True
                result.append(line)
                continue

            if (in_zone or in_zone_individual) and stripped.startswith("}"):
                in_zone = False
                in_zone_individual = False
        
                if not result[-2].rstrip().endswith(",") and not result[-2].lstrip().startswith("concepts") and not result[-2].lstrip().startswith("individuals"):
                    result[-2] = result[-2] + ","

                if result[-1].rstrip().endswith(","):
                    result[-1] = result[-1].rstrip()[:-1]

                result.extend(conceptsHolder)
                result.append(line)
                conceptsHolder = []
                continue

            if in_zone:
                if new_ingredient_type not in line and prev_ingredient_type not in line: 
                    if stripped.startswith("%"):
                        conceptsHolder.append(line)
                        continue
                    else:
                        result.append(line)
                        continue
                elif new_ingredient_type in line:
                    #descomentar sem virgula
                    if stripped.startswith("%"):
                        idx = line.index("%")
                        line = line[:idx] + line[idx + 1 :]
                    result.append(line)
                    continue
                elif rem_concept:
                    # retirar virgula se tiver quando comentar
                    if not stripped.startswith("%"):
                        line = "%" + line
                        if line.rstrip().endswith(","):
                            line = line.rstrip()[:-1]
                        conceptsHolder.append(line)
                        continue
                                
            if in_zone_individual:                
                if prev_ingredient_pattern.search(line):
                    if stripped.startswith("%"):
                        line = line.replace(prev_ingredient, new_ingredient)
                        conceptsHolder.append(line)
                        continue
                    else:
                        line = line.replace(prev_ingredient, new_ingredient)
                        result.append(line)
                        continue
                else:
                    if stripped.startswith("%"):
                        conceptsHolder.append(line)
                        continue
                    else:
                        result.append(line)
                        continue

            elif prev_ingredient_pattern.search(line):
                line = line.replace(prev_ingredient, new_ingredient, 1).replace(prev_ingredient_type, new_ingredient_type, 1)
            
            result.append(line)
    
    else:
        for line in lines:
            if prev_ingredient_pattern.search(line):
                line = line.replace(prev_ingredient, new_ingredient, 1).replace(prev_ingredient_type, new_ingredient_type, 1)
            result.append(line)
    return cocktail_name, "\n".join(result)



def main():
    input_data = json.loads(sys.stdin.read())
    
    path = input_data["path"]
    onto = input_data["onto"]
    prev_ingredient = input_data["prev_ingredient"]
    new_ingredient = input_data["new_ingredient"]
    prev_ingredient_type = input_data["prev_ingredient_type"]
    new_ingredient_type = input_data["new_ingredient_type"]
    active = input_data["active"]

    cocktail_name, updated_onto = update_ingredient_line(active,onto, prev_ingredient, new_ingredient, prev_ingredient_type, new_ingredient_type)

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
