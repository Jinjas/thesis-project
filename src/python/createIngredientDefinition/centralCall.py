import json
import sys
from pathlib import Path
import re

# Add the script's parent directory to sys.path to enable imports
sys.path.insert(0, str(Path(__file__).parent))

from ebnf_definition.ebnf_interpreter import interpret_grammar


def main():
    input_data = json.loads(sys.stdin.read())

    grammar_text = input_data.get("grammar_text", "")
    name = input_data.get("name", "")
    input_type = input_data.get("input_type", "Language")
    fileType = input_data.get("fileType", "txt")
    ontodl = ""

    if input_type == "Language":
        if fileType == "ebnf":
            ontodl = interpret_grammar(grammar_text, name, input_type)
        else:
            raise ValueError(f"Unsupported file type: {fileType}")
    elif input_type == "Tool":
        if fileType == "json":
            raise ValueError(f"Not implemented file type: {fileType}")
        else:
            raise ValueError(f"Unsupported file type: {fileType}")
    elif input_type == "Framework":
        if fileType == "json":
            raise ValueError(f"Not implemented file type: {fileType}")
        else:
            raise ValueError(f"Unsupported file type: {fileType}")
    elif input_type == "Library":
        if fileType == "json":
            raise ValueError(f"Not implemented file type: {fileType}")
        else:
            raise ValueError(f"Unsupported file type: {fileType}")
    else:
        raise ValueError(f"Unsupported input type: {input_type}")

    

    ontodl_text = ontodl or ""
    lines = ontodl_text.splitlines(keepends=True)
    split_idx = None
    pattern = re.compile(r"^\s*" + re.escape(name) + r"_model\s*=has=>.*;\s*$")
    for idx, line in enumerate(lines):
        if pattern.match(line):
            split_idx = idx
            break

    if split_idx is not None:
        extraData = "".join(lines[: split_idx + 1])
        characteristics = "".join(lines[split_idx + 2 :])
    else:
        
        extraData = ontodl_text
        characteristics = ""

    print(json.dumps({"updatedCode": characteristics, "extraData": extraData}))


if __name__ == "__main__":
    main()