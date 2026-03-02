import sys
import json
import re

import odlc

def add_ingredient_lines(onto_text: str, ingredient_name: str, ingredient_type: str) -> str:
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
            result.append(f"    {cocktail_name}Cocktail = is_composed_of => {ingredient_name};")
            result.append(line)
            continue
        result.append(line)



    return "\n".join(result)

def main():
    input_data = json.loads(sys.stdin.read())
    
    path = input_data["path"]
    onto = input_data["onto"]
    ingredient_name = input_data["ingredient_name"]
    ingredient_type = input_data["ingredient_type"]
    
    updated_onto = add_ingredient_lines(onto, ingredient_name,ingredient_type)

    updated_svg = odlc.generate_svg(updated_onto, path)
    
    print(json.dumps({
        "updatedOnto": updated_onto,
        "updatedSvg": updated_svg
    }))

if __name__ == "__main__":
    main()
