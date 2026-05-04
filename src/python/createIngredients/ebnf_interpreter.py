from __future__ import annotations

import argparse
import re
from dataclasses import dataclass, field
from pathlib import Path
from typing import Iterable

from lark import Lark, Transformer


BASE_DIR = Path(__file__).resolve().parent
GRAMMAR_PATH = BASE_DIR / "ebnf_grammar.lark"


@dataclass
class Node:
    kind: str
    value: str | None = None
    children: list["Node"] = field(default_factory=list)


@dataclass
class RuleSpec:
    name: str
    blocks: list[list[Node]]


@dataclass
class ProductionSpec:
    name: str
    condition: str
    action: str
    strength: float = 1.0
    probability: float = 1.0


class GrammarTransformer(Transformer):
    def start(self, children):
        return list(children)

    def rule(self, children):
        return Node("rule", children=list(children))

    def expression(self, children):
        return Node("expression", children=list(children))

    def optional_group(self, children):
        return Node("optional_group", children=list(children))

    def repeated_group(self, children):
        return Node("repeated_group", children=list(children))

    def name(self, children):
        (token,) = children
        return Node("name", token.value)

    def terminal(self, children):
        (token,) = children
        return Node("terminal", token.value)

    def reserved_string(self, children):
        (token,) = children
        return Node("reserved_string", clean_literal(token.value))

    def PIPE(self, token):
        return Node("pipe", token.value)


def load_parser() -> Lark:
    grammar = GRAMMAR_PATH.read_text(encoding="utf-8")
    return Lark(grammar, start="start", parser="lalr")


def clean_literal(value: str) -> str:
    text = value.strip().strip('"')
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def escape_text(value: str) -> str:
    return value.replace("\\", "\\\\")


def split_expression(expression_node: Node) -> list[list[Node]]:
    blocks: list[list[Node]] = []
    current_block: list[Node] = []

    for child in expression_node.children:
        if child.kind == "pipe":
            blocks.append(current_block)
            current_block = []
            continue

        current_block.append(child)

    blocks.append(current_block)
    return blocks


def parse_rules(nodes: list[Node]) -> list[RuleSpec]:
    rules: list[RuleSpec] = []

    for node in nodes:
        if node.kind != "rule" or len(node.children) < 2:
            continue

        name_node = node.children[0]
        rhs_node = node.children[1]
        if name_node.kind != "name":
            continue

        if rhs_node.kind == "expression":
            blocks = split_expression(rhs_node)
        else:
            blocks = [[rhs_node]]

        rules.append(RuleSpec(name_node.value or "", blocks))

    return rules


def collect_names(nodes: Iterable[Node]) -> list[str]:
    names: list[str] = []

    for node in nodes:
        if node.kind == "name" and node.value:
            names.append(node.value)
        elif node.children:
            names.extend(collect_names(node.children))

    return names


def collect_terminals(nodes: Iterable[Node]) -> list[str]:
    terminals: list[str] = []

    for node in nodes:
        if node.kind == "terminal" and node.value:
            terminals.append(node.value)
        elif node.kind == "reserved_string" and node.value:
            terminals.append(f"'{node.value}'")
        elif node.children:
            terminals.extend(collect_terminals(node.children))

    return terminals


def describe_nodes(nodes: Iterable[Node]) -> str:
    parts: list[str] = []

    for node in nodes:
        if node.kind == "name" and node.value:
            parts.append(node.value)
        elif node.kind == "terminal" and node.value:
            parts.append(node.value)
        elif node.kind == "reserved_string" and node.value:
            parts.append(f"'{node.value}'")
        elif node.kind == "optional_group":
            parts.append(f"optional group [{describe_nodes(node.children)}]")
        elif node.kind == "repeated_group":
            parts.append(f"repeated group {{{describe_nodes(node.children)}}}")
        elif node.children:
            parts.append(describe_nodes(node.children))

    return " ".join(part for part in parts if part)


def pluralize(text: str) -> str:
    if not text:
        return text
    if text == "media":
        return text
    if text.endswith("s"):
        return text
    return f"{text}s"


def block_slug(nodes: Iterable[Node], index: int) -> str:
    names = collect_names(nodes)
    if names:
        return "_".join(names[:2])

    terminals = collect_terminals(nodes)
    if terminals:
        candidate = terminals[0].strip("'\"").lower()
        candidate = re.sub(r"[^a-z0-9_]+", "_", candidate)
        candidate = candidate.strip("_")
        if candidate:
            return candidate

    return f"block{index}"


def describe_block_condition(lhs: str, nodes: Iterable[Node], is_alternative: bool) -> str:
    block_text = describe_nodes(nodes)
    if is_alternative:
        if block_text:
            return f"If {lhs} is a subgoal and the block '{escape_text(block_text)}' is needed"
        return f"If {lhs} is a subgoal and the block is needed"

    return f"If {lhs} is a subgoal"


def describe_block_action(nodes: Iterable[Node]) -> str:
    node_list = list(nodes)
    names = collect_names(nodes)
    terminals = collect_terminals(nodes)

    if names and not terminals:
        if len(node_list) == 1 and node_list[0].kind == "name":
            return f"then {names[0]} becomes a subgoal"
        if len(names) == 1:
            return f"then {pluralize(names[0])} become subgoals"
        joined = ", ".join(names[:-1]) + f" and {names[-1]}"
        return f"then {joined} become subgoals"

    if terminals and not names:
        if len(terminals) == 1:
            return f"then {terminals[0]} is written"
        joined = ", ".join(terminals[:-1]) + f" and {terminals[-1]}"
        return f"then {joined} are written"

    if names and terminals:
        written = ", ".join(terminals)
        if len(names) == 1:
            return f"then {written} is written and {names[0]} becomes a subgoal"
        joined = ", ".join(names[:-1]) + f" and {names[-1]}"
        return f"then {written} is written and {joined} become subgoals"

    group_text = describe_nodes(nodes)
    if group_text:
        return f"then the block '{escape_text(group_text)}' is written"

    return "then the block is written"


def build_production(spec: ProductionSpec) -> str:
    return (
        f"{spec.name} =iof=> Production[\n"
        f"\t\tcondition = \"{escape_text(spec.condition)}\" ,\n"
        f"\t\taction = \"{escape_text(spec.action)}\" ,\n"
        f"\t\tstrength = {spec.strength:.1f}\n"
        f"\t];"
    )


def build_section_triple(production_name: str, section_name: str) -> str:
    return f"{production_name} =pof=> {section_name};"


def partition_productions(productions: list[ProductionSpec]) -> dict[str, list[ProductionSpec]]:
    sections = {
        "Goals and subgoals": [],
        "Production rules": [],
    }
    goal_names = {"goal_p", "subgoal_p", "source_p"}
    for prod in productions:
        if prod.name in goal_names:
            sections["Goals and subgoals"].append(prod)
        else:
            sections["Production rules"].append(prod)
    return {k: v for k, v in sections.items() if v}


def build_ontology(name: str, input_type: str, productions: list[ProductionSpec]) -> str:
    partitions = partition_productions(productions)
    section_names = [f"{name}_sec{i+1}" for i in range(len(partitions))]
    section_titles = list(partitions.keys())
    
    individuals = [
        name,
        f"{name}_model",
    ]
    for section_name in section_names:
        individuals.append(section_name)
    
    for production in productions:
        individuals.append(production.name)

    hidden_lines = [
        f"\t{input_type} =isa=> Ingredient;",
        f"\tIngredient =has=> Model;",
        f"\tModel =has=> Production;",
        f"\tSection =groups=> Production;",
        f"\t{name} =iof=> {input_type};",
        f"\t{name}_model =iof=> Model;",
        f"\t{name} =has=> {name}_model;",
        f"\t{name}_model =has=> {', '.join(section_names)};" if section_names else f"\t{name}_model =has=> ;",
    ]

    for section_idx, section_name in enumerate(section_names):
        hidden_lines.append(f"\t{section_name} =iof=> Section [ title = \"{escape_text(section_titles[section_idx])}\" ];")

    editable_triples: list[str] = []

    for section_idx, section_name in enumerate(section_names):
        section_prods = list(partitions.values())[section_idx]
        section_prod_list = ",\n\t\t".join(p.name for p in section_prods)
        editable_triples.append(f"\t{section_name} =[ groups =>\n\t\t{section_prod_list}\n\t];")
    
    for production in productions:
        editable_triples.append(f"\t{build_production(production)}")

    individuals_str = ",\n\t".join(individuals)

    return (
        f"Ontology cognitive_model_{name}\n\n"
        "attributes { condition : string , action : string , strength : float , title : string }\n\n"
        "concepts {\n"
        "\tIngredient , Language , Library , Framework , Tool , Model , Section [ title ] ,\n"
        "\tProduction [ condition , action , strength ]\n"
        "}\n\n"
        "relationships { has , groups }\n\n"
        "individuals {\n"
        f"\t{individuals_str}\n"
        "}\n\n"
        + "\n".join(hidden_lines)
        + "\n\ntriples {\n"
        + "\n".join(editable_triples)
        + "\n}\n."
    )


def build_scene_from_rules(name: str, input_type: str, rules: list[RuleSpec]) -> str:
    productions: list[ProductionSpec] = []

    productions.append(
        ProductionSpec(
            "goal_p",
            "If all subgoals were met",
            "then the goal is met",
            1.0,
            1.0,
        )
    )
    productions.append(
        ProductionSpec(
            "subgoal_p",
            "If a subgoal is already written",
            "then the subgoal is met",
            1.1,
            1.0,
        )
    )
    productions.append(
        ProductionSpec(
            "source_p",
            "If new source text must be written",
            "then the grammar construct becomes a subgoal",
            1.1,
            1.0,
        )
    )

    for rule in rules:
        if len(rule.blocks) == 1:
            block = rule.blocks[0]
            condition = describe_block_condition(rule.name, block, False)
            action = describe_block_action(block)
            if action.startswith("then "):
                action = f"then the {rule.name} subgoal is met and {action[5:]}"
            productions.append(ProductionSpec(f"{rule.name}_p", condition, action))
            continue

        for index, block in enumerate(rule.blocks, start=1):
            slug = block_slug(block, index)
            condition = describe_block_condition(rule.name, block, True)
            action = describe_block_action(block)
            if action.startswith("then "):
                action = f"then the {rule.name} subgoal is met and {action[5:]}"
            productions.append(ProductionSpec(f"{rule.name}_{slug}_p", condition, action))

    return build_ontology(name, input_type, productions)


def interpret_grammar(grammar_text: str, name: str, input_type: str) -> str:
    parser = load_parser()
    tree = parser.parse(grammar_text)
    transformed = GrammarTransformer().transform(tree)
    rules = parse_rules(transformed)
    return build_scene_from_rules(name, input_type, rules)


def default_output_path(input_path: Path) -> Path:
    return input_path.with_suffix(".ontodl")


def main() -> None:
    arg_parser = argparse.ArgumentParser(description="Generate iof-style productions from an EBNF grammar.")
    arg_parser.add_argument(
        "input",
        nargs="?",
        default=str(BASE_DIR / "firstGrammarEX.txt"),
        help="Path to the EBNF grammar example",
    )
    arg_parser.add_argument(
        "--output",
        help="Optional file path where the generated scene will be written",
    )
    args = arg_parser.parse_args()

    input_path = Path(args.input)
    grammar_text = input_path.read_text(encoding="utf-8")
    scene = interpret_grammar(grammar_text, input_path.stem, "Language")
    output_path = Path(args.output) if args.output else default_output_path(input_path)

    output_path.write_text(scene + "\n", encoding="utf-8")
    print(output_path)


if __name__ == "__main__":
    main()