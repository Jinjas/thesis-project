import ast
import json
import re
from dataclasses import dataclass


@dataclass(frozen=True)
class Declaration:
    kind: str
    name: str
    owner: str | None = None


def slugify(value: str) -> str:
    slug = re.sub(r"[^A-Za-z0-9]+", "_", value).strip("_").lower()
    return slug or "item"


def pascalize(value: str) -> str:
    parts = [part for part in re.split(r"[^A-Za-z0-9]+", value) if part]
    return "".join(part[:1].upper() + part[1:] for part in parts) or value


def declaration_name(node: ast.AST) -> str | None:
    if isinstance(node, ast.AnnAssign) and isinstance(node.target, ast.Name):
        return node.target.id
    if isinstance(node, (ast.Assign, ast.AugAssign)):
        target = node.target if isinstance(node, ast.AugAssign) else node.targets[0]
        if isinstance(target, ast.Name):
            return target.id
    return None


def is_interface(node: ast.ClassDef) -> bool:
    return any(
        isinstance(base, ast.Name) and base.id == "Protocol"
        for base in node.bases
    )


def extract_declarations(source_text: str) -> list[Declaration]:
    tree = ast.parse(source_text)
    declarations: list[Declaration] = []
    seen: set[tuple[str, str, str | None]] = set()

    def add(kind: str, name: str, owner: str | None = None) -> None:
        declaration = Declaration(kind, name, owner)
        key = (kind, name, owner)
        if key not in seen:
            seen.add(key)
            declarations.append(declaration)

    for node in tree.body:
        if isinstance(node, ast.ClassDef):
            add("interface" if is_interface(node) else "class", node.name)
            for member in node.body:
                if isinstance(member, (ast.FunctionDef, ast.AsyncFunctionDef)):
                    add("function", member.name, node.name)
        elif isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
            add("function", node.name)
        elif isinstance(node, ast.TypeAlias) if hasattr(ast, "TypeAlias") else False:
            add("type", node.name.id)
        elif isinstance(node, ast.AnnAssign):
            name = declaration_name(node)
            if name:
                add("const", name)
        elif isinstance(node, ast.Assign):
            name = declaration_name(node)
            if name:
                add("type", name)

    return declarations


def build_production_name(declaration: Declaration) -> str:
    prefix = "feature" if declaration.kind == "function" else "entity"
    name = f"{declaration.owner}_{declaration.name}" if declaration.owner else declaration.name
    return f"{prefix}_{slugify(name)}_p"


def build_condition(declaration: Declaration) -> str:
    if declaration.kind == "function":
        if declaration.owner:
            return f"If there is a need for the feature {declaration.name} of {declaration.owner}"
        return f"If there is a need for the feature {declaration.name}"
    if declaration.kind == "interface":
        return f"If an interface entity named {declaration.name} is needed"
    return f"If a {declaration.kind} entity named {declaration.name} is needed"


def build_action(declaration: Declaration) -> str:
    if declaration.kind == "function":
        if declaration.owner:
            return f"then function {declaration.name} of {declaration.owner} is written and the need for {declaration.name} is met"
        return f"then function {declaration.name} is written and the need for {declaration.name} is met"
    return f"then {declaration.kind} {declaration.name} is written and the need for {declaration.name} is met"


def split_declarations(
    declarations: list[Declaration],
) -> tuple[list[Declaration], list[Declaration]]:
    entities = [
        item for item in declarations if item.kind != "function"
    ]
    features = [
        item for item in declarations if item.kind == "function"
    ]
    return entities, features


def build_ontodl(library_name: str, declarations: list[Declaration], input_type: str) -> str:
    entities, features = split_declarations(declarations)
    ordered = entities + features
    production_names = [build_production_name(item) for item in ordered]
    total_productions = len(production_names)
    probability = 1 / total_productions if total_productions else 1

    individuals = [
        library_name,
        f"{library_name}_model",
        f"{library_name}_sec1",
        f"{library_name}_sec2",
        *production_names,
    ]

    lines = [
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
        f'    {library_name}_sec1 =iof => Section [ title = "Entities" ];',
        f'    {library_name}_sec2 =iof => Section [ title = "Features" ];',
    ]

    def add_group(section: str, items: list[Declaration]) -> None:
        names = [build_production_name(item) for item in items]
        grouped = ",\n        ".join(names)
        lines.extend(
            [
                f"    {section} =[ groups =>",
                f"        {grouped}" if grouped else "        ",
                "    ];",
            ]
        )

    add_group(f"{library_name}_sec1", entities)
    add_group(f"{library_name}_sec2", features)

    for declaration in ordered:
        production = build_production_name(declaration)
        lines.extend(
            [
                f"    {production} =iof => Production[",
                f'        condition = "{build_condition(declaration)}" ,',
                f'        action = "{build_action(declaration)}" ,',
                f"        probability = {probability}",
                "    ];",
            ]
        )

    return "\n".join([*lines, "}", "."])


def library_name_from_input(name: str) -> str:
    for suffix in (".pyi", ".py"):
        if name.endswith(suffix):
            name = name[: -len(suffix)]
            break
    return pascalize(name.removeprefix("clean_"))


def interpret_library(grammar_text: str, name: str, input_type: str) -> str:
    declarations = extract_declarations(grammar_text)
    return build_ontodl(library_name_from_input(name), declarations, input_type)


def main() -> None:
    input_data = json.loads(__import__("sys").stdin.read())
    ontodl = interpret_library(
        input_data["grammar_text"],
        input_data["name"],
        input_data["input_type"],
    )
    print(json.dumps({"ontodl": ontodl}))


if __name__ == "__main__":
    main()
