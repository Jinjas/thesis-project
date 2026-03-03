import sys
import json
import re

# input: ingredient name and type
# output: ingredient ontology
#
from pathlib import Path
base_dir = Path(__file__).resolve().parent

data_dir = base_dir / "data"
data_dir.mkdir(exist_ok=True)

def getOntology(ingredient_name:str,ingredient_type:str):
    data_path = data_dir / f"{ingredient_name.lower()}.onto" #can change

    if data_path.exists():
        content = data_path.read_text(encoding="utf-8")
        lines = content.splitlines()
        characteristics = "\n".join(lines[3:])
        return content, characteristics
    else:
        data = [
            f"Name: {ingredient_name};",
            f"Type: {ingredient_type};\n",
            "Characteristics {",
            f"    {ingredient_name}Specific;",
            "}"
        ]
        content = "\n".join(data)
        characteristics = "\n".join(data[2:])
        data_path.write_text(content, encoding="utf-8")
        return content, characteristics


def main():
    input_data = json.loads(sys.stdin.read())
    
    ingredient_name = input_data["ingredient_name"]
    ingredient_type = input_data["ingredient_type"]
    
    ingredient_Data , characteristics = getOntology(ingredient_name,ingredient_type)
    
    print(json.dumps({
        "updatedCode": ingredient_Data,
        "updatedCharacteristics": characteristics,
    }))

if __name__ == "__main__":
    main()