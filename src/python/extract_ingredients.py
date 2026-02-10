import sys
import json
import re

def extract_ingredients_from_ontology(onto_text: str) -> list:
    lines = onto_text.strip().split('\n')
    
    # Extrair ingredientes: tudo que tem "= iof =>" é um ingrediente
    ingredient_types = {}
    for line in lines:
        stripped_line = line.lstrip()
        # Regex: optional %, optional spaces, word, =, iof, =>, word, ;
        pattern = re.compile(r"^(%?)\s*(\w+)\s*=\s*iof\s*=>\s*(\w+)\s*;")
        match = pattern.search(stripped_line)
        if match:
            is_commented = match.group(1) == "%"
            ingredient_name = match.group(2)
            ingredient_type = match.group(3)
            ingredient_types[ingredient_name] = {
                "type": ingredient_type,
                "active": not is_commented
            }
    
    # Construir resultado ordenado
    result = []
    for ingredient_name in sorted(ingredient_types.keys()):
        result.append({
            "name": ingredient_name,
            "type": ingredient_types[ingredient_name]["type"],
            "active": ingredient_types[ingredient_name]["active"]
        })
    
    return result

def main():
    onto = sys.stdin.read()
    
    ingredients = extract_ingredients_from_ontology(onto)
    
    print(json.dumps({
        "ingredients": ingredients
    }))

if __name__ == "__main__":
    main()
