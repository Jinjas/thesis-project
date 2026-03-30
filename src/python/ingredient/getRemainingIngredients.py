import sys
import json
import re
from pathlib import Path

from getIngredientOnto import getOntology


base_dir = Path(__file__).resolve().parent
data_dir = base_dir / "data"


def parse_ingredient_type(content: str, ingredient_name: str) -> str:
    escaped_name = re.escape(ingredient_name)
    match = re.search(
        rf"^\s*{escaped_name}\s*=\s*iof\s*=>\s*(\w+)\s*;",
        content,
        re.MULTILINE,
    )
    return match.group(1) if match else "UNDEFINED"


def get_remaining(existing_names: list[str]):
    names_file = data_dir / "NAMES.txt"
    if not names_file.exists():
        return []

    existing_lookup = {name.strip().lower() for name in existing_names if name.strip()}

    remaining = []
    seen = set()

    for raw_name in names_file.read_text(encoding="utf-8").splitlines():
        ingredient_name = raw_name.strip()
        if not ingredient_name:
            continue

        normalized = ingredient_name.lower()
        if normalized in existing_lookup or normalized in seen:
            continue

        updated_code, updated_characteristics, updated_extra_data, table = getOntology(
            ingredient_name,
            "UNDEFINED",
        )
        ingredient_type = parse_ingredient_type(updated_code, ingredient_name)

        remaining.append(
            {
                "name": ingredient_name,
                "type": ingredient_type,
                "updatedCode": updated_code,
                "updatedCharacteristics": updated_characteristics,
                "updatedExtraData": updated_extra_data,
                "table": [
                    {"section": section, "rows": rows}
                    for section, rows in table.items()
                ],
            }
        )
        seen.add(normalized)

    return remaining


def main():
    input_data = json.loads(sys.stdin.read() or "{}")
    existing_names = input_data.get("existing_names", [])

    if not isinstance(existing_names, list):
        raise ValueError("existing_names must be a list")

    ingredients = get_remaining([str(value) for value in existing_names])
    print(json.dumps({"ingredients": ingredients}))


if __name__ == "__main__":
    main()