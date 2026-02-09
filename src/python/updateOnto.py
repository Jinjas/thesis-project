import sys
import json

def main():
    onto = sys.argv[1]
    ingredient_name = sys.argv[2]
    ingredient_type = sys.argv[3]
    active = sys.argv[4].lower() == "true"

    updated_onto = (
        onto
        + "\n"
        + ("add " if active else "remove ")
        + f"{ingredient_type}:{ingredient_name}"
    )

    updated_svg = f"""
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="60">
      <text x="10" y="35" font-size="14">
        {ingredient_name} {'ON' if active else 'OFF'}
      </text>
    </svg>
    """

    print(json.dumps({
        "updatedOnto": updated_onto,
        "updatedSvg": updated_svg
    }))

if __name__ == "__main__":
    main()
