import json
import sys
from pathlib import Path

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

    print(
        json.dumps(
            {
                "updatedCode": ontodl,
            }
        )
    )


if __name__ == "__main__":
    main()