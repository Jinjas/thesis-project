import sys
import json
import re
from pathlib import Path

base_dir = Path(__file__).resolve().parent
data_dir = base_dir / "data"
data_dir.mkdir(exist_ok=True)


def setOntology(ingredient_name: str, ingredient_type: str, newCode: str):
    data_path = data_dir / f"{ingredient_name.lower()}.ontodl"

    # get list necessary individuals:
    individualsList = f"    {ingredient_name},\n    {ingredient_name}_model"
    pattern = re.compile(
    r"^\s*(\w+)\s*=\s*iof\s*=>\s*(section|production)"
    r"(?:\[(.*?)\])?\s*;",
    re.MULTILINE | re.DOTALL
)
    for match in pattern.finditer(newCode):
        individualName = match.group(1)
        individualsList += f",\n    {individualName}"

    patternTriple = re.compile(
        r'''
        ^\s*(\w+)              # sujeito
        \s*=\s*(\w+)\s*=>\s*   # predicado
        (\w+)                  # objeto
        (?:\[\s*(.*?)\s*\])?   # atributos opcionais
        \s*;
        ''',
        re.MULTILINE | re.DOTALL | re.VERBOSE
    )

    patternAttr = re.compile(
        r'(\w+)\s*=\s*("(?:[^"]*)"|[\d.]+)'
    )

    table = {}
    productions = {}
    pof = {}

    prod_id = 1

    for m in patternTriple.finditer(newCode):

        subject = m.group(1)
        predicate = m.group(2)
        obj = m.group(3)
        attrs_block = m.group(4)

        if predicate == "iof" and obj == "section":
            table[subject] = []

        elif predicate == "iof" and obj == "production":

            attrs = {}
            if attrs_block:
                attrs = {k: v.strip('"') for k, v in patternAttr.findall(attrs_block)}

            productions[subject] = attrs

        elif predicate == "pof":
            pof[subject] = obj


    for prod, attrs in productions.items():

        section = pof.get(prod)
        if section in table:

            row = [
                str(prod_id),
                attrs.get("condition", ""),
                attrs.get("action", ""),
                attrs.get("strength", "")
            ]

            table[section].append(row)
            prod_id += 1    



    data = [
            f"Ontology cognitive_model_{ingredient_name}\n",
            "attributes {\n    condition: string,\n    action: string,\n    strength: float,\n    probability: float\n}\n",
            "concepts {\n    ingredient,\n    language,\n    library,\n    framework,\n    tool,\n    model,\n    production[condition, action, strength, probability],\n    section\n}\n",
            "relations {\n    generates\n}\n",
            "individuals {",
            individualsList,
            "}\n",
            "triples {",
            f'    {ingredient_name} =iof=> {ingredient_type};',
            f'    {ingredient_name} =generates=> {ingredient_name}_model;',
            f'    {ingredient_name}_model =iof=> model;',
            f'\n{newCode}\n'
            "}\n."
        ]
    
    newOnto = "\n".join(data)
    extraData = "\n".join(data[:10])
    data_path.write_text(newOnto, encoding="utf-8") 
    return newOnto, extraData, table

def main():
    input_data = json.loads(sys.stdin.read())
    
    ingredient_name = input_data["ingredient_name"]
    ingredient_type = input_data["ingredient_type"]
    newCode = input_data["newCode"]
    
    newOnto,extraData,table = setOntology(ingredient_name,ingredient_type, newCode)
    
    table_list = [
        {"section": section, "rows": rows}
        for section, rows in table.items()
    ]
    
    print(json.dumps({
        "onto": newOnto,
        "extraData":extraData,
        "table":table_list
    }))


if __name__ == "__main__":
    main()