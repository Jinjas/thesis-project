import sys
import json
import re

import odlc

def create_Ontology(cocktail_name: str, ingredient_name: str, ingredient_type: str) -> str:
    types={"Framework", "Language", "Library", "Tool"}

    result = []
    result.append(f"Ontologia {cocktail_name}\n")
    result.append("concepts {\n" + f"    {ingredient_type}")

    for tipe in types:
        if tipe != ingredient_type:
            result.append(f"%    {tipe}")
    result.append("}\n")
    result.append("individuals {\n"
                  + f"    {cocktail_name},\n"
                  + f"    {cocktail_name}Development,\n"
                  + f"    {cocktail_name}Cocktail,\n"
                  + f"    {ingredient_name}\n"
                  + "}\n")
    result.append("relations {\n    uses,\n    requires,\n    is_composed_of,\n    supports,\n    is_used_for\n}\n")
    result.append("triples {\n"
                  + f"    {ingredient_name} = iof => {ingredient_type};\n"
                  + f"    {cocktail_name} = requires => {cocktail_name}Development;\n"
                  + f"    {cocktail_name}Development = uses => {cocktail_name}Cocktail;\n"
                  + f"    {cocktail_name}Cocktail = is_composed_of => {ingredient_name};\n"
                  + "}\n")
    result.append(".")    
    
    return "\n".join(result)

def main():
    input_data = json.loads(sys.stdin.read())
    
    path = input_data["path"]
    cocktail_name = input_data["cocktail_name"]
    ingredient_name = input_data["ingredient_name"]
    ingredient_type = input_data["ingredient_type"]
    
    new_onto = create_Ontology(cocktail_name, ingredient_name, ingredient_type)

    updated_svg = odlc.generate_svg(new_onto, path)
    
    print(json.dumps({
        "updatedOnto": new_onto,
        "updatedSvg": updated_svg
    }))

if __name__ == "__main__":
    main()
