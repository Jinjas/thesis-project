import json
from math import log2
import re
import sys
from pathlib import Path

from getIngredientOnto import (
    ATTR_RE,
    PRODUCTION_DEF_RE,
    SECTION_DEF_RE,
    SECTION_GROUP_RE,
    default_section_title,
)

base_dir = Path(__file__).resolve().parent
data_dir = base_dir / "data"
data_dir.mkdir(exist_ok=True)

SAFE_FILE_TOKEN = re.compile(r"[^a-z0-9_-]")


def to_safe_filename(value: str) -> str:
    normalized = value.strip().replace(" ", "_").lower()
    safe = SAFE_FILE_TOKEN.sub("", normalized)
    if not safe:
        raise ValueError("Invalid ingredient name")
    return safe


def split_group_items(raw_items: str) -> list[str]:
    return [item.strip().rstrip(",") for item in raw_items.split(",") if item.strip()]


def parse_attributes(raw_attributes: str) -> dict[str, str]:
    attributes: dict[str, str] = {}
    for match in ATTR_RE.findall(raw_attributes):
        key = match[0]
        value = next(group for group in match[1:] if group)
        attributes[key] = value
    return attributes


def safe_entropy(probability: float) -> float:
    if probability <= 0.0 or probability >= 1.0:
        return 0.0
    return -(probability * log2(probability) + (1 - probability) * log2(1 - probability))


def build_cocktail_table(ingredient_names: list[str]):
    merged_sections: dict[str, dict[str, object]] = {}
    section_order: list[str] = []
    total_ingredients = len(ingredient_names)

    for ingredient_name in ingredient_names:
        safe_name = to_safe_filename(ingredient_name)
        data_path = data_dir / f"{safe_name}.ontodl"

        if not data_path.exists():
            continue

        content = data_path.read_text(encoding="utf-8")

        sections: dict[str, str] = {}
        section_groups: dict[str, list[str]] = {}
        productions: dict[str, dict[str, str]] = {}

        for match in SECTION_DEF_RE.finditer(content):
            section_name = match.group(1)
            title = match.group(2) or match.group(3) or default_section_title(section_name)
            sections[section_name] = title

        for match in SECTION_GROUP_RE.finditer(content):
            section_name = match.group(1)
            section_groups[section_name] = split_group_items(match.group(2))

        for match in PRODUCTION_DEF_RE.finditer(content):
            production_name = match.group(1)
            productions[production_name] = parse_attributes(match.group(2))

        ordered_sections = [*sections, *[s for s in section_groups if s not in sections]]

        for section_name in ordered_sections:
            section_title = sections.get(section_name, default_section_title(section_name))
            section_entry = merged_sections.get(section_title)

            if section_entry is None:
                section_entry = {
                    "section": section_name,
                    "title": section_title,
                    "registry": {},
                }
                merged_sections[section_title] = section_entry
                section_order.append(section_title)

            registry = section_entry["registry"]

            for production_name in section_groups.get(section_name, []):
                attrs = productions.get(production_name)
                if attrs is None:
                    continue

                key = "|".join([attrs.get("condition", ""), attrs.get("action", "")])
                probability = float(attrs.get("probability", 0)) / total_ingredients if total_ingredients else 0.0

                if key not in registry:
                    registry[key] = {
                        "condition": attrs.get("condition", ""),
                        "action": attrs.get("action", ""),
                        "probability": probability,
                    }
                else:
                    registry[key]["probability"] += probability

    table_list: list[dict] = []
    total_probability = 0.0
    total_entropy = 0.0
    global_counter = 1

    for section_title in section_order:
        section_entry = merged_sections[section_title]
        registry: dict = section_entry["registry"]
        rows: list[list[str]] = []

        for row_data in registry.values():
            prob = float(row_data["probability"])
            total_probability += prob
            entropy = safe_entropy(prob)
            total_entropy += entropy

            rows.append(
                [
                    str(global_counter),
                    str(row_data["condition"]),
                    str(row_data["action"]),
                    str(round(entropy, 3)),
                ]
            )
            global_counter += 1

        table_list.append(
            {
                "section": section_entry["section"],
                "title": section_entry["title"],
                "rows": rows,
            }
        )

    if table_list:
        table_list.append(
            {
                "section": "Total",
                "title": "Total",
                "rows": [
                    [
                        round(total_probability, 3),
                        "",
                        "Entropy",
                        round(total_entropy, 3),
                    ]
                ],
            }
        )

    return table_list


def main():
    input_data = json.loads(sys.stdin.read() or "{}")
    ingredient_names = input_data.get("ingredient_names", [])

    if not isinstance(ingredient_names, list):
        raise ValueError("ingredient_names must be a list")

    table_list = build_cocktail_table([str(name) for name in ingredient_names])

    print(json.dumps({"table": table_list}))


if __name__ == "__main__":
    main()