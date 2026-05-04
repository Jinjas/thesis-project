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


def split_group_items(raw_items: str) -> list[str]:
    return [item.strip().rstrip(",") for item in raw_items.split(",") if item.strip()]


def parse_attributes(raw_attributes: str) -> dict[str, str]:
    attributes: dict[str, str] = {}
    for match in ATTR_RE.findall(raw_attributes):
        key = match[0]
        value = next(group for group in match[1:] if group)
        attributes[key] = value
    return attributes


def build_table_from_new_code(new_code: str) -> tuple[dict[str, dict[str, object]], list[str], dict[str, str]]:
    table: dict[str, dict[str, object]] = {}
    section_order: list[str] = []
    section_groups: dict[str, list[str]] = {}
    section_titles: dict[str, str] = {}
    production_attrs: dict[str, dict[str, str]] = {}
    legacy_links: dict[str, str] = {}

    def ensure_section(section_name: str, title: str | None = None) -> None:
        if section_name not in table:
            table[section_name] = {
                "title": title or default_section_title(section_name),
                "rows": [],
            }
            section_order.append(section_name)
        elif title:
            table[section_name]["title"] = title

    for match in SECTION_DEF_RE.finditer(new_code):
        section_name = match.group(1)
        title = match.group(2) or match.group(3)
        if title:
            section_titles[section_name] = title
        ensure_section(section_name, title)

    for match in SECTION_GROUP_RE.finditer(new_code):
        section_name = match.group(1)
        ensure_section(section_name, section_titles.get(section_name))
        section_groups[section_name] = split_group_items(match.group(2))

    for match in PRODUCTION_DEF_RE.finditer(new_code):
        production_name = match.group(1)
        production_attrs[production_name] = parse_attributes(match.group(2))

    for match in LEGACY_POF_RE.finditer(new_code):
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

                table[section_name]["rows"].append([
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

            ensure_section(section_name, section_titles.get(section_name))
            table[section_name]["rows"].append([
                str(prod_id),
                attrs.get("condition", ""),
                attrs.get("action", ""),
                attrs.get("strength", ""),
            ])
            prod_id += 1

    return table, section_order, section_titles


def setOntology(ingredient_name: str, ingredient_type: str, newCode: str):
    safe_name = to_safe_filename(ingredient_name)
    data_path = data_dir / f"{safe_name}.ontodl"

    table, section_order, section_titles = build_table_from_new_code(newCode)
    section_names = list(section_order or table.keys())

    individuals = [ingredient_name, f"{ingredient_name}_model", *section_names]
    for match in PRODUCTION_DEF_RE.finditer(newCode):
        individuals.append(match.group(1))

    seen = set()
    individuals = [value for value in individuals if not (value in seen or seen.add(value))]
    individuals_list = ",\n    ".join(individuals)

    lines = [
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
        f"\t{individuals_list}",
        "}",
        "",
        f"\tLanguage =isa=> Ingredient;",
        f"\tIngredient =has=> Model;",
        f"\tModel =has=> Production;",
        f"\tSection =groups=> Production;",
        f"\t{ingredient_name} =iof=> {ingredient_type};",
        f"\t{ingredient_name}_model =iof=> Model;",
        f"\t{ingredient_name} =has=> {ingredient_name}_model;",
        f"\t{ingredient_name}_model =has=> {', '.join(section_names)};" if section_names else f"\t{ingredient_name}_model =has=> ;",
        *[
            f"\t{section_name} =iof=> Section [ title = '{table.get(section_name, {}).get('title', section_titles.get(section_name, default_section_title(section_name)))}' ];"
            for section_name in section_names
        ],
        "",
        "triples {",
    ]

    for section_name in section_names:
        rows = table.get(section_name, {}).get("rows", [])
        lines.append(f"\t{section_name} =[ groups =>")
        lines.append("\t\t" + ",\n\t\t".join(row[0] for row in rows))
        lines.append("\t];")

    for production in PRODUCTION_DEF_RE.finditer(newCode):
        prod_name = production.group(1)
        attrs = parse_attributes(production.group(2))
        condition = attrs.get("condition", "")
        action = attrs.get("action", "")
        strength = attrs.get("strength", "1.0")
        lines.append(
            f"\t{prod_name} =iof=> Production[\n"
            f"\t\tcondition = '{condition}' ,\n"
            f"\t\taction = '{action}' ,\n"
            f"\t\tstrength = {strength}\n"
            f"\t];"
        )

    lines.extend([
        "}",
        ".",
    ])

    newOnto = "\n".join(lines)
    extraData = newOnto.split("triples {", 1)[0].rstrip()
    data_path.write_text(newOnto, encoding="utf-8")
    return newOnto, extraData, table


def main():
    input_data = json.loads(sys.stdin.read())

    ingredient_name = input_data["ingredient_name"]
    ingredient_type = input_data["ingredient_type"]
    newCode = input_data["newCode"]

    newOnto, extraData, table = setOntology(ingredient_name, ingredient_type, newCode)

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
    }))


if __name__ == "__main__":
    main()
