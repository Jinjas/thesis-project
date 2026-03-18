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

def create_Ontology(cocktail_name: str, ingredient_name: str, ingredient_type: str) -> str:
    types={"Framework", "Language", "Library", "Tool"}

    cocktail_name = cocktail_name.replace(" ","_")


    result = []
    result.append(f"Ontology {cocktail_name}\n")
    result.append("concepts {\n" + f"    {ingredient_type}")

    for type in types:
        if type != ingredient_type:
            result.append(f"%    {type}")
    result.append("}\n")
    result.append("individuals {\n"
                  + f"    {cocktail_name},\n"
                  + f"    {cocktail_name}Development,\n"
                  + f"    {cocktail_name}Cocktail,\n"
                  + f"    {ingredient_name}\n"
                  + "}\n")
    result.append("relations {\n    uses,\n    requires\n}\n")
    result.append("triples {\n"
                  + f"    {ingredient_name} = iof => {ingredient_type};\n"
                  + f"    {cocktail_name} = requires => {cocktail_name}Development;\n"
                  + f"    {cocktail_name}Development = uses => {cocktail_name}Cocktail;\n"
                  + f"    {ingredient_name} = pof => {cocktail_name}Cocktail;\n"
                  + "}\n")
    result.append(".")    
    
    return "\n".join(result)

def main():
    input_data = json.loads(sys.stdin.read())
    
    path = input_data["path"]
    cocktail_name = input_data["cocktail_name"]
    ingredient_name = input_data["ingredient_name"]
    ingredient_type = input_data["ingredient_type"]

    safe_cocktail_name = to_safe_filename(cocktail_name)
    data_path = data_dir / f"{safe_cocktail_name}.ontodl"

    new_onto = create_Ontology(cocktail_name, ingredient_name, ingredient_type)
    data_path.write_text(new_onto, encoding="utf-8")

    
    names_file = data_dir / "NAMES.txt"
    with open(names_file, "a", encoding="utf-8") as f:
        f.write(f"\n{cocktail_name}")

    updated_svg = odlc.generate_svg(new_onto, path)
    
    print(json.dumps({
        "updatedOnto": new_onto,
        "updatedSvg": updated_svg
    }))

if __name__ == "__main__":
    main()
