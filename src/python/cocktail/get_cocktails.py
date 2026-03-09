import sys
import json
import re
import odlc

from pathlib import Path
base_dir = Path(__file__).resolve().parent

data_dir = base_dir / "data"
data_dir.mkdir(exist_ok=True)

def extract_ingredients_from_ontology(onto_text: str, types:set):
    lines = onto_text.strip().split('\n')
    ingredient_types = {}

    for line in lines:
        stripped_line = line.lstrip()
        pattern = re.compile(r"^(%?)\s*(\w+)\s*=\s*iof\s*=>\s*(\w+)\s*;")
        match = pattern.search(stripped_line)
        if match:
            is_commented = match.group(1) == "%"
            ingredient_name = match.group(2)
            ingredient_type = match.group(3)
            if ingredient_type in types:
                ingredient_types[ingredient_name] = {
                    "type": ingredient_type,
                    "active": not is_commented
                }
    
    result = []
    for ingredient_name in sorted(ingredient_types.keys()):
        result.append({
            "name": ingredient_name,
            "type": ingredient_types[ingredient_name]["type"],
            "active": ingredient_types[ingredient_name]["active"]
        })
    
    return result

def main():
    input_data = json.loads(sys.stdin.read())
    path = input_data["path"]
    types={"Framework", "Language", "Library", "Tool"}

    names_file = data_dir / "NAMES.txt"
    lines = names_file.read_text(encoding="utf-8").splitlines()

    result = []

    for line in lines:
        data_path = data_dir / f"{line.replace(" ","_").lower()}.ontodl"

        onto = data_path.read_text(encoding="utf-8")

        extraction = extract_ingredients_from_ontology(onto,types)

        cocktail = { 
                "name" :line,
                "updatedOnto": onto, 
                "ingredients": extraction, 
                "updatedSvg": odlc.generate_svg(onto, path)
            }
        result.append(cocktail)
    
    print(json.dumps(result))

if __name__ == "__main__":
    main()
