import sys
import os
import re
from tree_sitter import Language, Parser
import tree_sitter_typescript as ts_types

#  python normalizeRaw.py ..\librariesDefs\react.d.ts

TS_LANGUAGE = Language(ts_types.language_typescript())
parser = Parser(TS_LANGUAGE)

BANNED_KEYWORDS = [
    "IntrinsicElements", "HTMLAttributes", "SVGAttributes", 
    "DOMAttributes", "DetailedHTMLProps", "HTMLElementType"
]

def sanitize_text(text):
    return re.sub(r"[\ud800-\udfff]", "", text)

def remove_comments(text):
    """Remove todos os comentários multi-linha (/*...*/) e de linha única (//...) do texto."""
    text = re.sub(r'/\*[\s\S]*?\*/', '', text)
    text = re.sub(r'//.*', '', text)
    lines = [line for line in text.splitlines() if line.strip()]
    return '\n'.join(lines)


def clean_dts_text(source_code, file_name="input.d.ts"):
    source_code = sanitize_text(source_code)
    source_bytes = bytes(source_code, "utf8")
    tree = parser.parse(source_bytes)
    root_node = tree.root_node

    output_lines = [
        "/**",
        f" * Assinatura Limpa Gerada Automaticamente para: {os.path.basename(file_name)}",
        " */",
        ""
    ]

    seen_signatures = set()
    opened_namespace = False

    def process_node(node, indent_level=0):
        nonlocal opened_namespace
        if not node or node.type in ["comment", ";", "}", "{"]:
            return

        indent = "    " * indent_level
        node_type = node.type

        if node_type in ["internal_module", "module_declaration", "ambient_declaration"]:
            text_block = source_bytes[node.start_byte:node.end_byte].decode("utf8").strip()
            if "namespace React" in text_block and not opened_namespace:
                output_lines.append("declare namespace React {")
                opened_namespace = True

                body_node = node.child_by_field_name("body")
                if body_node:
                    for child in body_node.children:
                        process_node(child, 1)
                else:
                    for child in node.children:
                        process_node(child, 1)
                return

        VALID_TARGETS = [
            "function_declaration", "method_signature", "method_definition",
            "lexical_declaration", "type_alias_declaration", "interface_declaration",
            "class_declaration", "generator_function_declaration"
        ]

        raw_text = source_bytes[node.start_byte:node.end_byte].decode("utf8").strip()
        if not raw_text or raw_text in seen_signatures:
            return

        is_declaration = node_type in VALID_TARGETS or any(raw_text.startswith(k) for k in ["function ", "interface ", "class ", "type ", "const ", "export function "])

        if is_declaration:
            if any(banned in raw_text for banned in BANNED_KEYWORDS):
                return
            if "export =" in raw_text or "export as namespace" in raw_text:
                return

            clean_text = remove_comments(raw_text)
            if not clean_text.strip():
                return

            line_count = clean_text.count("\n")
            if "interface " in clean_text and line_count > 30:
                return
            if "type " in clean_text and line_count > 12:
                return

            if node_type in ["method_definition", "method_signature"]:
                if "function " not in raw_text and "export function " not in raw_text:
                    if any("class Component" in sig for sig in seen_signatures):
                        return

            if clean_text.startswith("export "):
                clean_text = clean_text.replace("export ", "", 1)

            is_global_type = any(clean_text.startswith(k) for k in ["type Native", "type Booleanish", "type CrossOrigin"])
            actual_indent = "    " if (opened_namespace and not is_global_type) else ""

            formatted_text = clean_text.replace("\n", f"\n{actual_indent}")
            output_lines.append(f"{actual_indent}{formatted_text}")
            seen_signatures.add(raw_text)
            return

        for child in node.children:
            process_node(child, indent_level)

    for child in root_node.children:
        process_node(child, 0)

    if opened_namespace:
        output_lines.append("}")

    return "\n".join(output_lines)

def clean_dts(file_path):
    if not os.path.exists(file_path):
        print(f"Erro: O ficheiro '{file_path}' não foi encontrado.")
        return

    with open(file_path, "r", encoding="utf-8") as f:
        source_code = f.read()
    output_text = clean_dts_text(source_code, os.path.basename(file_path))
    output_filename = f"clean_{os.path.basename(file_path)}"
    with open(output_filename, "w", encoding="utf-8") as f:
        f.write(output_text)
    
    print(f"Concluído! Assinatura guardada com sucesso em: '{output_filename}'")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        clean_dts(sys.argv[1])
    else:
        print("Por favor, indique o caminho do arquivo d.ts. Exemplo: python script.py react.d.ts")