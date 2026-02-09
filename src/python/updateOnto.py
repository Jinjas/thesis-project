import sys
import json


import odlc

def toggle_ingredient_lines(onto_text: str, ingredient: str, active: bool) -> str:
    lines = onto_text.splitlines()
    result = []

    in_triples = False

    for line in lines:
        stripped = line.lstrip()

        if stripped.startswith("triples"):
            in_triples = True
            result.append(line)
            continue

        if in_triples and stripped.startswith("}"):
            in_triples = False
            result.append(line)
            continue

        if in_triples and ingredient in line:
            if active:
                if stripped.startswith("%"):
                    idx = line.index("%")
                    line = line[:idx] + line[idx + 1 :]
            else:
                if not stripped.startswith("%"):
                    line = "%" + line

        result.append(line)

    return "\n".join(result)



def main():
    # Read input from stdin (JSON format)
    input_data = json.loads(sys.stdin.read())
    
    path = input_data["path"]
    onto = input_data["onto"]
    ingredient_name = input_data["ingredient_name"]
    ingredient_type = input_data["ingredient_type"]
    active = input_data["active"]

    updated_onto = toggle_ingredient_lines(onto, ingredient_name, active)
    
    updated_svg = odlc.generate_svg(updated_onto, path)

    print(json.dumps({
        "updatedOnto": updated_onto,
        "updatedSvg": updated_svg
    }))

if __name__ == "__main__":
    main()
