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

def getOntology(ingredient_name:str,ingredient_type:str) -> str:
    data_path = data_dir / f"{ingredient_name.lower()}.onto" #can change

    if data_path.exists():
        return data_path.read_text(encoding="utf-8")
    else:
        data = [
            f"Name: {ingredient_name};",
            f"Type: {ingredient_type};",
            "\nCharacteristics {\n}"
        ]
        content = "\n".join(data)
        data_path.write_text(content, encoding="utf-8")
        return content


def main():
    input_data = json.loads(sys.stdin.read())
    
    ingredient_name = input_data["ingredient_name"]
    ingredient_type = input_data["ingredient_type"]
    
    ingredient_Data = getOntology(ingredient_name,ingredient_type)
    
    print(json.dumps({
        "updatedCode": ingredient_Data,
    }))

if __name__ == "__main__":
    main()