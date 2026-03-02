import sys
import json
from pathlib import Path

base_dir = Path(__file__).resolve().parent
data_dir = base_dir / "data"
data_dir.mkdir(exist_ok=True)


def setOntology(ingredient_name: str, newOnto: str):
    data_path = data_dir / f"{ingredient_name.lower()}.onto"
    data_path.write_text(newOnto, encoding="utf-8")  # cria ou sobrescreve


def main():
    input_data = json.loads(sys.stdin.read())
    
    ingredient_name = input_data["ingredient_name"]
    newOnto = input_data["newOnto"]
    
    setOntology(ingredient_name, newOnto)
    
    print(json.dumps({
        "code": 200,
    }))


if __name__ == "__main__":
    main()