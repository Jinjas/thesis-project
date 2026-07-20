import json
import re
import sys
from pathlib import Path

from math import log2


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
MODEL_HAS_RE = re.compile(r"^\s*(\w+)_model\s*=has=>\s*(.*?)\s*;$", re.MULTILINE)
TRIPLES_BLOCK_RE = re.compile(r"triples\s*\{(.*)\}\s*\.?\s*$", re.DOTALL | re.IGNORECASE)
BASE_TRIPLE_PATTERNS = [
    re.compile(r"^\s*Language\s*=isa=>\s*Ingredient\s*;\s*$"),
    re.compile(r"^\s*Ingredient\s*=has=>\s*Model\s*;\s*$"),
    re.compile(r"^\s*Model\s*=has=>\s*Production\s*;\s*$"),
    re.compile(r"^\s*Section\s*=groups=>\s*Production\s*;\s*$"),
    re.compile(r"^\s*\w+\s*=iof=>\s*\w+\s*;\s*$"),
    re.compile(r"^\s*\w+_model\s*=iof=>\s*Model\s*;\s*$"),
    re.compile(r"^\s*\w+\s*=has=>\s*\w+_model\s*;\s*$"),
    re.compile(r"^\s*\w+_model\s*=has=>\s*.*;\s*$"),
]
ATTR_RE = re.compile(r"(\w+)\s*=\s*(?:'([^']*)'|\"([^\"]*)\"|([\d.]+))")


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


def split_group_items(raw_items: str) -> list[str]:
    return [item.strip().rstrip(",") for item in raw_items.split(",") if item.strip()]


def parse_attributes(raw_attributes: str) -> dict[str, str]:
    attributes: dict[str, str] = {}
    for match in ATTR_RE.findall(raw_attributes):
        key = match[0]
        value = next(group for group in match[1:] if group)
        attributes[key] = value
    return attributes


def unique_in_order(values: list[str]) -> list[str]:
    seen: set[str] = set()
    ordered: list[str] = []
    for value in values:
        if value in seen:
            continue
        seen.add(value)
        ordered.append(value)
    return ordered


def extract_triples_body(new_code: str) -> str:
    stripped = new_code.strip()
    block_match = TRIPLES_BLOCK_RE.search(stripped)
    body = block_match.group(1).strip() if block_match else stripped

    body_lines = body.splitlines()
    while body_lines and body_lines[-1].strip() == ".":
        body_lines.pop()

    return "\n".join(body_lines).strip()


def strip_leading_base_triples(triples_body: str) -> str:
    if not triples_body:
        return ""

    lines = triples_body.splitlines()

    first_non_empty = 0
    while first_non_empty < len(lines) and not lines[first_non_empty].strip():
        first_non_empty += 1

    idx = first_non_empty
    for pattern in BASE_TRIPLE_PATTERNS:
        while idx < len(lines) and not lines[idx].strip():
            idx += 1
        if idx >= len(lines) or not pattern.match(lines[idx]):
            return triples_body.strip()
        idx += 1

    return "\n".join(lines[idx:]).strip()


def extract_section_names(new_code: str, ingredient_name: str) -> list[str]:
    sections_from_defs = [match.group(1) for match in SECTION_DEF_RE.finditer(new_code)]

    sections_from_model: list[str] = []
    ingredient_model = f"{ingredient_name}_model"
    for match in MODEL_HAS_RE.finditer(new_code):
        model_name = f"{match.group(1)}_model"
        if model_name != ingredient_model:
            continue
        sections_from_model.extend(split_group_items(match.group(2)))

    if not sections_from_model:
        generic_model_match = MODEL_HAS_RE.search(new_code)
        if generic_model_match:
            sections_from_model.extend(split_group_items(generic_model_match.group(2)))

    return unique_in_order([*sections_from_defs, *sections_from_model])


def extract_production_names(new_code: str) -> list[str]:
    return unique_in_order([match.group(1) for match in PRODUCTION_DEF_RE.finditer(new_code)])


def build_table_from_new_code(new_code: str) -> dict[str, dict[str, object]]:
    table: dict[str, dict[str, object]] = {}
    section_groups: dict[str, list[str]] = {}
    production_attrs: dict[str, dict[str, str]] = {}

    def ensure_section(section_name: str, title: str | None = None) -> None:
        if section_name not in table:
            table[section_name] = {
                "title": title or default_section_title(section_name),
                "rows": [],
            }
        elif title:
            table[section_name]["title"] = title

    for match in SECTION_DEF_RE.finditer(new_code):
        section_name = match.group(1)
        title = match.group(2) or match.group(3)
        ensure_section(section_name, title)

    for match in SECTION_GROUP_RE.finditer(new_code):
        section_name = match.group(1)
        ensure_section(section_name)
        section_groups[section_name] = split_group_items(match.group(2))

    for match in PRODUCTION_DEF_RE.finditer(new_code):
        production_name = match.group(1)
        production_attrs[production_name] = parse_attributes(match.group(2))

    prod_id = 1
    total_entropy = 0.0
    total_prob = 0.0
    if section_groups:
        ordered_sections = [*table, *[section for section in section_groups if section not in table]]
        for section_name in ordered_sections:
            for production_name in section_groups.get(section_name, []):
                attrs = production_attrs.get(production_name)
                if attrs is None:
                    continue

                prob = float(attrs.get("probability", 0))
                entropy = -(prob * log2(prob) + (1 - prob) * log2(1 - prob))
                total_entropy += entropy
                total_prob += prob

                table[section_name]["rows"].append([
                    str(prod_id),
                    attrs.get("condition", ""),
                    attrs.get("action", ""),
                    entropy,
                ])
                prod_id += 1
        table["total"] = {
            "title": "Total",
            "rows": [
                [round(total_prob, 3), "", "Entropy", round(total_entropy, 3)],
            ],
        }
    return table


def setOntology(ingredient_name: str, ingredient_type: str, newCode: str):
    safe_name = to_safe_filename(ingredient_name)
    data_path = data_dir / f"{safe_name}.ontodl"

    triples_body = extract_triples_body(newCode)
    normalized_triples_body = strip_leading_base_triples(triples_body)

    table = build_table_from_new_code(normalized_triples_body)
    section_names = extract_section_names(normalized_triples_body, ingredient_name)
    production_names = extract_production_names(normalized_triples_body)
    number_of_productions = len(production_names)
    individuals = unique_in_order([
        ingredient_name,
        f"{ingredient_name}_model",
        *section_names,
        *production_names,
    ])

    individuals_list = ",\n    ".join(individuals)

    model_sections = ", ".join(section_names)
    model_has_line = (
        f"    {ingredient_name}_model =has=> {model_sections};"
        if model_sections
        else f"    {ingredient_name}_model =has=> ;"
    )

    lines = [
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
        f"    {individuals_list}",
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
        model_has_line,
    ]

    extraData = "\n".join(lines).rstrip()

    if normalized_triples_body:
        lines.append("")
        lines.append(f"    {normalized_triples_body}")

    lines.extend([
        "}",
        ".",
    ])

    newOnto = "\n".join(lines)
    data_path.write_text(newOnto, encoding="utf-8")
    append_name_to_names_file(ingredient_name)
    return newOnto, extraData, table, number_of_productions


def main():
    input_data = json.loads(sys.stdin.read())

    ingredient_name = input_data["ingredient_name"]
    ingredient_type = input_data["ingredient_type"]
    newCode = input_data["newCode"]

    newOnto, extraData, table, number_of_productions = setOntology(ingredient_name, ingredient_type, newCode)

    table_list = [
        {
            "section": section,
            "title": info.get("title", default_section_title(section)),
            "rows": info.get("rows", []),
        }
        for section, info in table.items()
    ]

    print(json.dumps({
        "onto": newOnto,
        "extraData": extraData,
        "table": table_list,
        "number_of_productions": number_of_productions,
    }))


if __name__ == "__main__":
    main()
