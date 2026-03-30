import sys
import json
import re

# input: ingredient name and type
# output: ingredient ontology
#
from pathlib import Path
base_dir = Path(__file__).resolve().parent

data_dir = base_dir / "data"
data_dir.mkdir(exist_ok=True)

SAFE_FILE_TOKEN = re.compile(r"[^a-z0-9_-]")


def to_safe_filename(value: str) -> str:
    normalized = value.strip().replace(" ", "_").lower()
    safe = SAFE_FILE_TOKEN.sub("", normalized)
    if not safe:
        raise ValueError("Invalid ingredient name")
    return safe

def getOntology(ingredient_name:str,ingredient_type:str):
    

    safe_name = to_safe_filename(ingredient_name)
    data_path = data_dir / f"{safe_name}.ontodl" #can change

    if data_path.exists():
        content = data_path.read_text(encoding="utf-8")
        lines = content.splitlines()
        s_index = 0
        f_index = 0
        in_zone=False
        
        for i, line in enumerate(lines):
            if line.startswith("triples {"):
                s_index = i+5
                in_zone=True
                continue
            if in_zone and line.startswith("}"):
                in_zone = False
                f_index = i
                break
                
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

        for m in patternTriple.finditer(content):
        
            subject = m.group(1)
            predicate = m.group(2)
            obj = m.group(3)
            attrs_block = m.group(4)

            if predicate == "iof" and obj == "Section":
                table[subject] = []

            elif predicate == "iof" and obj == "Production":
            
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

        #names_file = data_dir / "NAMES.txt"
        #with open(names_file, "a", encoding="utf-8") as f:
        #    if ingredient_name not in names_file.read_text(encoding="utf-8").splitlines():
        #        f.write(f"\n{ingredient_name}")
            
        characteristics = "\n".join(lines[s_index:f_index])
        extraData = "\n".join(lines[0:s_index-1])
        return content, characteristics, extraData, table
    else:
        data = [
            f"Ontology cognitive_model_{ingredient_name}\n",
            "attributes {\n    condition: string,\n    action: string,\n    strength: float,\n    probability: float\n}\n",
            "concepts {\n    Language,\n    Library,\n    Framework,\n    Tool,\n    Model,\n    Production[condition, action, strength, probability],\n    Section\n}\n",
            "relations {\n    generates\n}\n",
            "individuals {",
            f"    {ingredient_name},\n    {ingredient_name}_model,\n    {ingredient_name}_specific_section",
            "}\n",
            "triples {",
            f'    {ingredient_name} =iof=> {ingredient_type};',
            f'    {ingredient_name} =generates=> {ingredient_name}_model;',
            f'    {ingredient_name}_model =iof=> Model;\n',
            f'    {ingredient_name}_specific_section =iof=> Section;',
            f'    {ingredient_name}_specific_section =pof=> {ingredient_name}_model;',
            "}\n."
        ]

        names_file = data_dir / "NAMES.txt"
        with open(names_file, "a", encoding="utf-8") as f:
            f.write(f"\n{ingredient_name}")


        content = "\n".join(data)
        characteristics = "\n".join(data[11:13])
        extraData = "\n".join(data[:10])
        data_path.write_text(content, encoding="utf-8")
        table = {f"{ingredient_name}_specific_section": [],}
        return content, characteristics, extraData, table


def main():
    input_data = json.loads(sys.stdin.read())
    
    ingredient_name = input_data["ingredient_name"]
    ingredient_type = input_data["ingredient_type"]
    
    ingredient_Data, characteristics, extraData,table = getOntology(ingredient_name,ingredient_type)
    
    table_list = [
        {"section": section, "rows": rows}
        for section, rows in table.items()
    ]

    print(json.dumps({
        "updatedCode": ingredient_Data,
        "updatedCharacteristics": characteristics,
        "updatedExtraData": extraData,
        "table": table_list,
    }))

if __name__ == "__main__":
    main()