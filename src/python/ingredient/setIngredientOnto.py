import sys
import json
from pathlib import Path

base_dir = Path(__file__).resolve().parent
data_dir = base_dir / "data"
data_dir.mkdir(exist_ok=True)


def setOntology(ingredient_name: str, ingredient_type: str, newCode: str):
    data_path = data_dir / f"{ingredient_name.lower()}.onto"
    newOnto = f"Name: {ingredient_name};\nType: {ingredient_type};\n\n{newCode}"
    data_path.write_text(newOnto, encoding="utf-8")  # cria ou sobrescreve
    return newOnto

def main():
    input_data = json.loads(sys.stdin.read())
    
    ingredient_name = input_data["ingredient_name"]
    ingredient_type = input_data["ingredient_type"]
    newCode = input_data["newCode"]
    
    newOnto = setOntology(ingredient_name,ingredient_type, newCode)
    
    print(json.dumps({
        "onto": newOnto,
    }))


if __name__ == "__main__":
    main()