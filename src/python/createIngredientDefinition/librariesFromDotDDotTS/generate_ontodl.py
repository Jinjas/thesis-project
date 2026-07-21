import json
import re
import sys
from dataclasses import dataclass
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from normalizeRaw import clean_dts_text


@dataclass(frozen=True)
class Declaration:
    kind: str
    name: str


DECLARATION_RE = re.compile(r"^\s*(?:export\s+)?(type|interface|class|const|function)\s+([A-Za-z_][A-Za-z0-9_]*)")


def slugify(value: str) -> str:
    slug = re.sub(r"[^A-Za-z0-9]+", "_", value).strip("_").lower()
    return slug or "item"


def pascalize(value: str) -> str:
    parts = [part for part in re.split(r"[^A-Za-z0-9]+", value) if part]
    return "".join(part[:1].upper() + part[1:] for part in parts) or value


def extract_declarations(source_text: str) -> list[Declaration]:
    declarations: list[Declaration] = []
    seen_entities: set[tuple[str, str]] = set()
    seen_features: set[str] = set()

    for raw_line in source_text.splitlines():
        line = raw_line.strip()
        if not line:
            continue
        if line.startswith("//") or line.startswith("/*") or line.startswith("*"):
            continue
        if line.startswith("declare namespace ") or line == "}":
            continue

        match = DECLARATION_RE.match(raw_line)
        if not match:
            continue

        kind, name = match.groups()
        if kind == "function":
            if name in seen_features:
                continue
            seen_features.add(name)
            declarations.append(Declaration(kind, name))
            continue

        entity_key = (kind, name)
        if entity_key in seen_entities:
            continue
        seen_entities.add(entity_key)
        declarations.append(Declaration(kind, name))

    return declarations


def build_production_name(kind: str, name: str) -> str:
    if kind == "function":
        return f"feature_{slugify(name)}_p"
    return f"entity_{kind}_{slugify(name)}_p"


def build_condition(kind: str, name: str) -> str:
    if kind == "function":
        return f"If there is a need for the React feature {name}"
    return f"If a React {kind} entity named {name} is needed"


def build_action(kind: str, name: str) -> str:
    if kind == "function":
        return f"then function {name} is written and the need for {name} is met"
    return f"then {kind} {name} is written and the need for {name} is met"


def split_declarations(declarations: list[Declaration]) -> tuple[list[Declaration], list[Declaration]]:
    entities: list[Declaration] = []
    features: list[Declaration] = []

    for declaration in declarations:
        if declaration.kind == "function":
            features.append(declaration)
        else:
            entities.append(declaration)

    return entities, features


def build_ontodl(library_name: str, declarations: list[Declaration], input_type: str) -> str:
    entities, features = split_declarations(declarations)

    entity_productions = [build_production_name(item.kind, item.name) for item in entities]
    feature_productions = [build_production_name(item.kind, item.name) for item in features]
    all_productions = entity_productions + feature_productions
    total_productions = len(all_productions)
    
    individuals = [
        library_name,
        f"{library_name}_model",
        f"{library_name}_sec1",
        f"{library_name}_sec2",
        *all_productions,
    ]

    header = "\n".join(
        [
            f"Ontology cognitive_model_{library_name}",
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
            "    " + ",\n    ".join(individuals),
            "}",
            "",
            "triples {",
            "    Language =isa=> Ingredient;",
            "    Library =isa=> Ingredient;",
            "    Framework =isa=> Ingredient;",
            "    Tool =isa=> Ingredient;",
            "    Ingredient =has=> Model;",
            "    Model =has=> Production;",
            "    Section =groups=> Production;",
            f"    {library_name} =iof=> {input_type};",
            f"    {library_name}_model =iof=> Model;",
            f"    {library_name} =has=> {library_name}_model;",
            f"    {library_name}_model =has=> {library_name}_sec1, {library_name}_sec2;",
            "",
            f"    {library_name}_sec1 =iof => Section [ title = \"Entities\" ];",
            f"    {library_name}_sec2 =iof => Section [ title = \"Features\" ];",
        ]
    )

    def build_groups_block(section_name: str, production_names: list[str]) -> str:
        if production_names:
            grouped = ",\n        ".join(production_names)
            return f"    {section_name} =[ groups =>\n        {grouped}\n    ];"
        return f"    {section_name} =[ groups =>\n    ];"

    group_blocks = [
        build_groups_block(f"{library_name}_sec1", entity_productions),
        build_groups_block(f"{library_name}_sec2", feature_productions),
    ]

    production_blocks = [
        "\n".join(
            [
                f"    {build_production_name(declaration.kind, declaration.name)} =iof => Production[",
                f"        condition = \"{build_condition(declaration.kind, declaration.name)}\" ,",
                f"        action = \"{build_action(declaration.kind, declaration.name)}\" ,",
                f"        probability = {1/total_productions}",
                "    ];",
            ]
        )
        for declaration in entities + features
    ]

    return "\n".join([header, *group_blocks, *production_blocks, "}", "."])


def library_name_from_input(name: str) -> str:
    if name.startswith("clean_"):
        name = name[len("clean_"):]
    if name.endswith(".d.ts"):
        name = name[:-5]
    elif name.endswith(".ts"):
        name = name[:-3]
    return pascalize(name)


def interpret_library(grammar_text: str, name: str, input_type: str) -> str:
    normalized_text = clean_dts_text(grammar_text, f"{name}.d.ts")
    declarations = extract_declarations(normalized_text)
    library_name = library_name_from_input(name)
    return build_ontodl(library_name, declarations, input_type)


def main() -> None:
    input_data = json.loads(sys.stdin.read())

    grammar_text = input_data["grammar_text"]
    name = input_data["name"]
    input_type = input_data["input_type"]

    ontodl = interpret_library(grammar_text, name, input_type)

    print(json.dumps({
        "ontodl": ontodl
    }))


if __name__ == "__main__":
    main()