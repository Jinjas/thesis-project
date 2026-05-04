import json
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
LEGACY_POF_RE = re.compile(r"^\s*(\w+)\s*=\s*pof\s*=>\s*(\w+)\s*;$", re.MULTILINE)
ATTR_RE = re.compile(r"(\w+)\s*=\s*(?:'([^']*)'|\"([^\"]*)\"|([\d.]+))")


def to_safe_filename(value: str) -> str:
    normalized = value.strip().replace(" ", "_").lower()
    safe = SAFE_FILE_TOKEN.sub("", normalized)
    if not safe:
        raise ValueError("Invalid ingredient name")
    return safe


def default_section_title(section_name: str) -> str:
    return section_name.replace("_", " ").strip().title() or section_name


def split_triples_block(content: str) -> tuple[str, str]:
    marker = "triples {"
    start = content.find(marker)
    if start == -1:
        return "", content.rstrip()

    end = content.find("\n}", start)
    if end == -1:
        end = content.find("}", start)
    if end == -1:
        end = len(content)

    extra_data = content[:start].rstrip()
    characteristics = content[start + len(marker):end].strip()
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


def build_table_from_ontology(content: str) -> dict[str, dict[str, object]]:
    sections: dict[str, dict[str, object]] = {}
    section_order: list[str] = []
    section_groups: dict[str, list[str]] = {}
    production_attrs: dict[str, dict[str, str]] = {}
    legacy_links: dict[str, str] = {}

    def ensure_section(section_name: str, title: str | None = None) -> None:
        if section_name not in sections:
            sections[section_name] = {
                "title": title or default_section_title(section_name),
                "rows": [],
            }
            section_order.append(section_name)
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

    for match in LEGACY_POF_RE.finditer(content):
        legacy_links[match.group(1)] = match.group(2)

    prod_id = 1
    used_productions: set[str] = set()

    if section_groups:
        ordered_sections = section_order + [section for section in section_groups if section not in section_order]
        for section_name in ordered_sections:
            for production_name in section_groups.get(section_name, []):
                attrs = production_attrs.get(production_name)
                if attrs is None:
                    continue

                sections[section_name]["rows"].append([
                    str(prod_id),
                    attrs.get("condition", ""),
                    attrs.get("action", ""),
                    attrs.get("strength", ""),
                ])
                used_productions.add(production_name)
                prod_id += 1

    if not used_productions and legacy_links:
        for production_name, section_name in legacy_links.items():
            attrs = production_attrs.get(production_name)
            if attrs is None:
                continue

            ensure_section(section_name)

            sections[section_name]["rows"].append([
                str(prod_id),
                attrs.get("condition", ""),
                attrs.get("action", ""),
                attrs.get("strength", ""),
            ])
            prod_id += 1

    return sections


def getOntology(ingredient_name: str, ingredient_type: str):
    safe_name = to_safe_filename(ingredient_name)
    data_path = data_dir / f"{safe_name}.ontodl"

    if data_path.exists():
        content = data_path.read_text(encoding="utf-8")
        table = build_table_from_ontology(content)
        characteristics, extra_data = split_triples_block(content)
        return content, characteristics, extra_data, table

    section_name = f"{ingredient_name}_specific_section"
    content = "\n".join([
        f"Ontology cognitive_model_{ingredient_name}",
        "",
        "attributes { condition : string , action : string , strength : float , title : string }",
        "",
        "concepts {",
        "\tIngredient , Language , Library , Framework , Tool , Model , Section [ title ] ,",
        "\tProduction [ condition , action , strength ]",
        "}",
        "",
        "relationships { has , groups }",
        "",
        "individuals {",
        f"\t{ingredient_name},",
        f"\t{ingredient_name}_model,",
        f"\t{section_name}",
        "}",
        "",
        f"\tLanguage =isa=> Ingredient;",
        f"\tIngredient =has=> Model;",
        f"\tModel =has=> Production;",
        f"\tSection =groups=> Production;",
        f"\t{ingredient_name} =iof=> {ingredient_type};",
        f"\t{ingredient_name}_model =iof=> Model;",
        f"\t{ingredient_name} =has=> {ingredient_name}_model;",
        f"\t{ingredient_name}_model =has=> {section_name};",
        f"\t{section_name} =iof=> Section [ title = 'Production rules' ];",
        "",
        "triples {",
        f"\t{section_name} =[ groups =>",
        "\t];",
        "}",
        ".",
    ])

    characteristics, extra_data = split_triples_block(content)
    data_path.write_text(content, encoding="utf-8")
    table = {section_name: {"title": "Production rules", "rows": []}}
    return content, characteristics, extra_data, table


def main():
    input_data = json.loads(sys.stdin.read())

    ingredient_name = input_data["ingredient_name"]
    ingredient_type = input_data["ingredient_type"]

    ingredient_data, characteristics, extra_data, table = getOntology(ingredient_name, ingredient_type)

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
    }))


if __name__ == "__main__":
    main()
