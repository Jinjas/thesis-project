import sys
import json
import re
from pathlib import Path

base_dir = Path(__file__).resolve().parent
data_dir = base_dir / "data"
data_dir.mkdir(exist_ok=True)


def setOntology(ingredient_name: str, ingredient_type: str, newCode: str):
    data_path = data_dir / f"{ingredient_name.lower()}.ontodl"

    # get list necessary individuals:
    individualsList = f"    {ingredient_name},\n    {ingredient_name}_model"
    pattern = re.compile(
    r"^\s*(\w+)\s*=\s*iof\s*=>\s*(section|production)"
    r"(?:\[(.*?)\])?\s*;",
    re.MULTILINE | re.DOTALL
)
    for match in pattern.finditer(newCode):
        individualName = match.group(1)
        individualsList += f",\n    {individualName}"

    


    data = [
            f"Ontology cognitive_model_{ingredient_name}\n",
            "attributes {\n    condition: string,\n    action: string,\n    strength: float,\n    probability: float\n}\n",
            "concepts {\n    ingredient,\n    language,\n    library,\n    framework,\n    tool,\n    model,\n    production[condition, action, strength, probability],\n    section\n}\n",
            "relations {\n    generates\n}\n",
            "individuals {",
            individualsList,
            "}\n",
            "triples {",
            f'    {ingredient_name} =iof=> {ingredient_type};',
            f'    {ingredient_name} =generates=> {ingredient_name}_model;',
            f'    {ingredient_name}_model =iof=> model;',
            f'\n{newCode}\n'
            "}\n."
        ]
    
    newOnto = "\n".join(data)
    extraData = "\n".join(data[:10])
    data_path.write_text(newOnto, encoding="utf-8") 
    return newOnto, extraData

def main():
    input_data = json.loads(sys.stdin.read())
    
    ingredient_name = input_data["ingredient_name"]
    ingredient_type = input_data["ingredient_type"]
    newCode = input_data["newCode"]
    
    newOnto,extraData = setOntology(ingredient_name,ingredient_type, newCode)
    
    print(json.dumps({
        "onto": newOnto,
        "extraData":extraData,
    }))


if __name__ == "__main__":
    main()