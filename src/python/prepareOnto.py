import sys
import json
import re

import odlc

def extract_ingredients_from_ontology(onto_text: str, types:set) -> dict:
    typesActive = set()
    ingredientsGeneral = set()
    activeIngreds = set()

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
                    activeIngreds.add(ingredient_name)
    
    result = []
    for ingredient_name in sorted(ingredient_types.keys()):
        result.append({
            "name": ingredient_name,
            "type": ingredient_types[ingredient_name]["type"],
            "active": ingredient_types[ingredient_name]["active"]
        })
    
    return {"ingredients": result, "types": list(typesActive), "generalIngreds": list(ingredientsGeneral) , "activeIngreds": list(activeIngreds)}

def getNewData(onto_text: str, path:str) -> dict:
    types={"Framework", "Language", "Library", "Tool"}

    extractions = extract_ingredients_from_ontology(onto_text,types)

    activeTypes = extractions["types"]
    generalIngreds = extractions["generalIngreds"]
    activeIngreds = extractions["activeIngreds"]


    lines = onto_text.splitlines()
    cocktail_name = lines[0].strip().split()[1]
    final_onto_lines = []
    in_concept_zone = False
    in_indiv_zone = False
    in_triple_zone = False
    for line in lines:
        stripped = line.lstrip()
        if stripped.startswith("concepts"):
            in_concept_zone = True
            final_onto_lines.append(line)
            for activeType in activeTypes:
                final_onto_lines.append(f"    {activeType},")
            final_onto_lines[-1] = final_onto_lines[-1].rstrip(",")  # Remove the comma from the last active type
            for tipe in types:
                if tipe not in activeTypes:
                    final_onto_lines.append(f"%    {tipe}")
            continue
        if in_concept_zone and stripped.startswith("}"):
            in_concept_zone = False
            final_onto_lines.append(line)
            continue
        if in_concept_zone:
            continue

        if stripped.startswith("individuals"):
            in_indiv_zone = True
            final_onto_lines.append(line)
            continue
        if in_indiv_zone and stripped.startswith("}"):
            in_indiv_zone = False
            for ingred in activeIngreds:
                final_onto_lines.append(f"    {ingred},")
            final_onto_lines[-1] = final_onto_lines[-1].rstrip(",")  # Remove the comma from the last active ingredient
            for ingred in generalIngreds:
                if ingred not in activeIngreds:
                    final_onto_lines.append(f"%    {ingred}")
            final_onto_lines.append(line)
            continue
        if in_indiv_zone:
            if cocktail_name in line:
                final_onto_lines.append(line)
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
            if any(type in line for type in types) or cocktail_name + "Cocktail" in line or cocktail_name + "Development" in line:
                final_onto_lines.append(line)
            continue
        final_onto_lines.append(line)

    final_onto = "\n".join(final_onto_lines)

    result = { "updatedOnto": final_onto, 
               "ingreds": extractions["ingredients"], 
               "updatedSvg": odlc.generate_svg(final_onto, path)
            }

    return result



def main():
    input_data = json.loads(sys.stdin.read())
    
    path = input_data["path"]
    onto = input_data["onto"]

    prepared_Data = getNewData(onto, path)
    
    print(json.dumps(prepared_Data))

if __name__ == "__main__":
    main()
