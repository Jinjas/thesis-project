import json
from math import log2
import re
import sys
from pathlib import Path


base_dir = Path(__file__).resolve().parent
data_dir = base_dir / "data"
data_dir.mkdir(exist_ok=True)

SAFE_FILE_TOKEN = re.compile(r"[^a-z0-9_-]")
SECTION_DEF_RE = re.compile(
    r"^\s*(\w+)\s*=\s*iof\s*=>\s*Section(?:\s*\[\s*title\s*=\s*(?:'([^']*)'|\"([^\"]*)\")\s*\])?\s*;$",
    re.MULTILINE,
)
SECTION_GROUP_RE = re.compile(
    r"^\s*(\w+)\s*=\s*\[\s*groups\s*=>\s*(.*?)\s*\]\s*;$",
    re.MULTILINE | re.DOTALL,
)
PRODUCTION_DEF_RE = re.compile(
    r"^\s*(\w+)\s*=\s*iof\s*=>\s*Production\s*\[(.*?)\]\s*;$",
    re.MULTILINE | re.DOTALL,
)
ATTR_RE = re.compile(r"(\w+)\s*=\s*(?:'([^']*)'|\"([^\"]*)\"|([\d.]+))")
MODEL_HAS_LINE_RE = re.compile(r"^\s*\w+_model\s*=has=>\s*.*;\s*$")


def to_safe_filename(value: str) -> str:
    normalized = value.strip().replace(" ", "_").lower()
    safe = SAFE_FILE_TOKEN.sub("", normalized)
    if not safe:
        raise ValueError("Invalid ingredient name")
    return safe


def default_section_title(section_name: str) -> str:
    return section_name.replace("_", " ").strip().title() or section_name


def append_name_to_names_file(ingredient_name: str) -> None:
    names_file = data_dir / "NAMES.txt"
    existing_names = []
    if names_file.exists():
        existing_names = names_file.read_text(encoding="utf-8").splitlines()

    normalized = ingredient_name.strip().lower()
    if any(name.strip().lower() == normalized for name in existing_names):
        return

    updated_names = [name for name in existing_names if name.strip()]
    updated_names.append(ingredient_name)
    names_file.write_text("\n".join(updated_names), encoding="utf-8")


def split_triples_block(content: str) -> tuple[str, str]:
    lines = content.splitlines()
    triples_start_idx = next(
        (idx for idx, line in enumerate(lines) if line.strip().lower() == "triples {"),
        -1,
    )
    if triples_start_idx == -1:
        return "", content.rstrip()

    triples_end_idx = next(
        (idx for idx in range(triples_start_idx + 1, len(lines)) if lines[idx].strip() == "}"),
        len(lines),
    )

    model_has_idx = next(
        (
            idx
            for idx in range(triples_start_idx + 1, triples_end_idx)
            if MODEL_HAS_LINE_RE.match(lines[idx])
        ),
        -1,
    )

    if model_has_idx != -1:
        extra_data = "\n".join(lines[: model_has_idx + 1]).rstrip()
        body_lines = lines[model_has_idx + 1 : triples_end_idx]
    else:
        extra_data = "\n".join(lines[:triples_start_idx]).rstrip()
        body_lines = lines[triples_start_idx + 1 : triples_end_idx]

    while body_lines and not body_lines[0].strip():
        body_lines.pop(0)
    while body_lines and not body_lines[-1].strip():
        body_lines.pop()

    characteristics = "\n".join(body_lines).rstrip()
    return characteristics, extra_data


def split_group_items(raw_items: str) -> list[str]:
    return [item.strip().rstrip(",") for item in raw_items.split(",") if item.strip()]


def parse_attributes(raw_attributes: str) -> dict[str, str]:
    attributes: dict[str, str] = {}
    for match in ATTR_RE.findall(raw_attributes):
        key = match[0]
        value = next(group for group in match[1:] if group)
        attributes[key] = value
    return attributes


def build_table_from_ontology(content: str):
    sections: dict[str, dict[str, object]] = {}
    section_groups: dict[str, list[str]] = {}
    production_attrs: dict[str, dict[str, str]] = {}

    def ensure_section(section_name: str, title: str | None = None) -> None:
        if section_name not in sections:
            sections[section_name] = {
                "title": title or default_section_title(section_name),
                "rows": [],
            }
        elif title:
            sections[section_name]["title"] = title

    for match in SECTION_DEF_RE.finditer(content):
        section_name = match.group(1)
        title = match.group(2) or match.group(3)
        ensure_section(section_name, title)

    for match in SECTION_GROUP_RE.finditer(content):
        section_name = match.group(1)
        ensure_section(section_name)
        section_groups[section_name] = split_group_items(match.group(2))

    for match in PRODUCTION_DEF_RE.finditer(content):
        production_name = match.group(1)
        production_attrs[production_name] = parse_attributes(match.group(2))

    prod_id = 1
    total_entropy = 0.0
    number_of_productions = 0
    total_prob = 0.0
    
    if section_groups:
        ordered_sections = [*sections, *[section for section in section_groups if section not in sections]]
        for section_name in ordered_sections:
            for production_name in section_groups.get(section_name, []):
                attrs = production_attrs.get(production_name)
                if attrs is None:
                    continue

                prob = float(attrs.get("probability", 0))
                entropy = -(prob * log2(prob) + (1 - prob) * log2(1 - prob))
                total_entropy += entropy
                number_of_productions += 1
                total_prob += prob

                sections[section_name]["rows"].append([
                    str(prod_id),
                    attrs.get("condition", ""),
                    attrs.get("action", ""),
                    entropy,
                ])
                prod_id += 1
        sections["total"] = {
            "title": "Total",
            "rows": [
                ["", "", "Entropy", round(total_entropy, 3)],
                ["", "", "Probability", round(total_prob, 3)],
            ],
        }
    return  number_of_productions, sections


def getOntology(ingredient_name: str, ingredient_type: str):
    safe_name = to_safe_filename(ingredient_name)
    data_path = data_dir / f"{safe_name}.ontodl"

    if data_path.exists():
        content = data_path.read_text(encoding="utf-8")
        number_of_productions, table = build_table_from_ontology(content)
        characteristics, extra_data = split_triples_block(content)
        append_name_to_names_file(ingredient_name)
        return content, characteristics, extra_data, table, number_of_productions

    section_name = f"{ingredient_name}_specific_section"
    content = "\n".join([
        f"Ontology cognitive_model_{ingredient_name}",
        "",
        "attributes { condition : string , action : string , probability : float , title : string }",
        "",
        "concepts {",
        "    Ingredient , Language , Library , Framework , Tool , Model , Section [ title ] ,",
        "    Production [ condition , action , probability ]",
        "}",
        "",
        "relationships { has , groups }",
        "",
        "individuals {",
        f"    {ingredient_name},",
        f"    {ingredient_name}_model,",
        f"    {section_name}",
        "}",
        "",
        "triples {",
        f"    Language =isa=> Ingredient;\n    Library =isa=> Ingredient;\n    Framework =isa=> Ingredient;\n    Tool =isa=> Ingredient;",
        f"    Ingredient =has=> Model;",
        f"    Model =has=> Production;",
        f"    Section =groups=> Production;",
        f"    {ingredient_name} =iof=> {ingredient_type};",
        f"    {ingredient_name}_model =iof=> Model;",
        f"    {ingredient_name} =has=> {ingredient_name}_model;",
        f"    {ingredient_name}_model =has=> {section_name};",
        "",
        f"    {section_name} =iof=> Section [ title = 'Production rules' ];",
        f"    {section_name} =[ groups =>",
        "    ];",
        "}",
        ".",
    ])

    characteristics, extra_data = split_triples_block(content)
    data_path.write_text(content, encoding="utf-8")
    append_name_to_names_file(ingredient_name)
    table = {section_name: {"title": "Production rules", "rows": []},
             "Total": {"title": "Total", "rows": [["", "", "Entropy", 0.0], ["", "", "Probability", 0.0]]}}
    return content, characteristics, extra_data, table, 0


def main():
    input_data = json.loads(sys.stdin.read())

    ingredient_name = input_data["ingredient_name"]
    ingredient_type = input_data["ingredient_type"]

    ingredient_data, characteristics, extra_data, table, number_of_productions = getOntology(ingredient_name, ingredient_type)

    table_list = [
        {
            "section": section,
            "title": info.get("title", default_section_title(section)),
            "rows": info.get("rows", []),
        }
        for section, info in table.items()
    ]

    print(json.dumps({
        "updatedCode": ingredient_data,
        "updatedCharacteristics": characteristics,
        "updatedExtraData": extra_data,
        "table": table_list,
        "number_of_productions": number_of_productions,
    }))


if __name__ == "__main__":
    main()
