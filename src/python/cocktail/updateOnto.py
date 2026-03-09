import sys
import json
import re

import odlc

from pathlib import Path
base_dir = Path(__file__).resolve().parent

data_dir = base_dir / "data"
data_dir.mkdir(exist_ok=True)

def toggle_ingredient_lines(onto_text: str, ingredient: str,ingredient_type: str, active: bool):
    lines = onto_text.splitlines()
    result = []

    conceptsHolder = []
    in_zone = False
    rem_concept = True
    in_zone_individual = False
    cocktail_name = lines[0].strip().split()[1]
    ingredient_pattern = re.compile(r'\b' + re.escape(ingredient) + r'\b')
    
    if not active:
        for line in lines:
            if not line.lstrip().startswith("%") and ("= iof => " + ingredient_type) in line and not ingredient_pattern.search(line):
                rem_concept = False
                break
    
    for i, line in enumerate(lines):
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
    
            if active:
                if not result[-2].rstrip().endswith(",") and not result[-2].lstrip().startswith("concepts") and not result[-2].lstrip().startswith("individuals"):
                    result[-2] = result[-2] + ","

            elif result[-1].rstrip().endswith(","):
                    result[-1] = result[-1].rstrip()[:-1]

            result.extend(conceptsHolder)
            result.append(line)
            conceptsHolder = []
            continue

        if in_zone:
            if ingredient_type not in line or (not active and not rem_concept): 
                if stripped.startswith("%"):
                    conceptsHolder.append(line)
                    continue
                else:
                    result.append(line)
                    continue
            elif active:
                #descomentar sem virgula
                if stripped.startswith("%"):
                    idx = line.index("%")
                    line = line[:idx] + line[idx + 1 :]
                result.append(line)
                continue
            else:
                # retirar virgula se tiver quando comentar
                if not stripped.startswith("%"):
                    line = "%" + line
                    if line.rstrip().endswith(","):
                        line = line.rstrip()[:-1]
                    conceptsHolder.append(line)
                    continue
                            
        if in_zone_individual:
            if ingredient_pattern.search(line):
                if active:
                    if stripped.startswith("%"):
                        idx = line.index("%")
                        line = line[:idx] + line[idx + 1 :]
                    result.append(line)
                    continue
                elif not stripped.startswith("%"):
                    line = "%" + line
                    if line.rstrip().endswith(","):
                        line = line.rstrip()[:-1]
                    conceptsHolder.append(line)
                    continue
                else:
                    conceptsHolder.append(line)
                    continue
            else:
                if stripped.startswith("%"):
                    conceptsHolder.append(line)
                    continue
                else:
                    result.append(line)
                    continue

        elif ingredient_pattern.search(line):
            if active:
                if stripped.startswith("%"):
                    idx = line.index("%")
                    line = line[:idx] + line[idx + 1 :]
            else:
                if not stripped.startswith("%"):
                    line = "%" + line

        result.append(line)

    return cocktail_name, "\n".join(result)



def main():
    input_data = json.loads(sys.stdin.read())
    
    path = input_data["path"]
    onto = input_data["onto"]
    ingredient_name = input_data["ingredient_name"]
    ingredient_type = input_data["ingredient_type"]
    active = input_data["active"]


   

    cocktail_name, updated_onto = toggle_ingredient_lines(onto, ingredient_name,ingredient_type, active)
    
    data_path = data_dir / f"{cocktail_name.lower()}.ontodl"
    data_path.write_text(updated_onto, encoding="utf-8")
    
    updated_svg = odlc.generate_svg(updated_onto, path)

    print(json.dumps({
        "updatedOnto": updated_onto,
        "updatedSvg": updated_svg
    }))

if __name__ == "__main__":
    main()
