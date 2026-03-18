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

def extract_ingredients_from_ontology(onto_text: str, types:set) -> dict:
    typesActive = set()
    ingredientsGeneral = set()
    activeIngredients = set()

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
                ingredientsGeneral.add(ingredient_name)
                if not is_commented:
                    typesActive.add(ingredient_type)
                    activeIngredients.add(ingredient_name)
    
    result = []
    for ingredient_name in sorted(ingredient_types.keys()):
        result.append({
            "name": ingredient_name,
            "type": ingredient_types[ingredient_name]["type"],
            "active": ingredient_types[ingredient_name]["active"]
        })
    
    return {"ingredients": result, "types": list(typesActive), "generalIngredients": list(ingredientsGeneral) , "activeIngredients": list(activeIngredients)}

def getNewData(onto_text: str, name: str, path:str) -> dict:
    types={"Framework", "Language", "Library", "Tool"}

    extractions = extract_ingredients_from_ontology(onto_text,types)

    activeTypes = extractions["types"]
    generalIngredients = extractions["generalIngredients"]
    activeIngredients = extractions["activeIngredients"]
    
    name = name.replace(" ", "_")
    lines = onto_text.splitlines()
    cocktail_name = lines[0].strip().split()[1]
    lines[0] = lines[0].replace(cocktail_name,name)
    final_onto_lines = []
    in_concept_zone = False
    in_individual_zone = False
    in_triple_zone = False
    for line in lines:
        stripped = line.lstrip()
        if stripped.startswith("concepts"):
            in_concept_zone = True
            final_onto_lines.append(line)
            for activeType in activeTypes:
                final_onto_lines.append(f"    {activeType},")
            final_onto_lines[-1] = final_onto_lines[-1].rstrip(",")  # Remove the comma from the last active type
            for type in types:
                if type not in activeTypes:
                    final_onto_lines.append(f"%    {type}")
            continue
        if in_concept_zone and stripped.startswith("}"):
            in_concept_zone = False
            final_onto_lines.append(line)
            continue
        if in_concept_zone:
            continue

        if stripped.startswith("individuals"):
            in_individual_zone = True
            final_onto_lines.append(line)
            continue
        if in_individual_zone and stripped.startswith("}"):
            in_individual_zone = False
            for ingredient in activeIngredients:
                final_onto_lines.append(f"    {ingredient},")
            final_onto_lines[-1] = final_onto_lines[-1].rstrip(",")  # Remove the comma from the last active ingredient
            for ingredient in generalIngredients:
                if ingredient not in activeIngredients:
                    final_onto_lines.append(f"%    {ingredient}")
            final_onto_lines.append(line)
            continue
        if in_individual_zone:
            if cocktail_name in line:
                final_onto_lines.append(line.replace(cocktail_name,name))
            continue
    
        if stripped.startswith("triples"):
            final_onto_lines.append(line)
            in_triple_zone = True
            continue
        if in_triple_zone and stripped.startswith("}"):
            in_triple_zone = False
            final_onto_lines.append(line)
            continue
        if in_triple_zone:
            if cocktail_name + "Cocktail" in line or cocktail_name + "Development" in line:
                final_onto_lines.append(line.replace(cocktail_name,name))
                continue
            if any(type in line for type in types):
                final_onto_lines.append(line)
            continue
        final_onto_lines.append(line)

    final_onto = "\n".join(final_onto_lines)

    safe_name = to_safe_filename(name)
    data_path = data_dir / f"{safe_name}.ontodl"

    data_path.write_text(final_onto, encoding="utf-8")

    result = { "updatedOnto": final_onto, 
               "ingredients": extractions["ingredients"], 
               "updatedSvg": odlc.generate_svg(final_onto, path)
            }

    return result



def main():
    input_data = json.loads(sys.stdin.read())
    
    path = input_data["path"]
    onto = input_data["onto"]
    name = input_data["name"]

    prepared_Data = getNewData(onto,name, path)
    
    print(json.dumps(prepared_Data))

if __name__ == "__main__":
    main()
