import type { Cocktail, Ingredient, TableDict } from "../../types";

export function buildCocktailTable(
  cocktail: Pick<Cocktail, "ingredients">,
  ingredients: Ingredient[],
): TableDict[] {
  let counter = 1;
  const cocktailIngredients: Ingredient[] = Object.entries(cocktail.ingredients)
    .filter(([_, active]) => active)
    .map(([ingredientId]) =>
      ingredients.find((ingredient) => ingredient.id === ingredientId),
    )
    .filter((ingredient): ingredient is Ingredient => !!ingredient);

  const sectionMap: Record<string, TableDict> = {};

  for (const ingredient of cocktailIngredients) {
    for (const table of ingredient.table) {
      const sectionTitle = table.title ?? table.section;

      if (!sectionMap[sectionTitle]) {
        sectionMap[sectionTitle] = {
          section: table.section,
          title: sectionTitle,
          rows: table.rows.map((row) => {
            const newRow = [...row];
            newRow[0] = "0";
            newRow[newRow.length - 1] = "--";
            return newRow;
          }),
        };
      } else {
        const existingRows = sectionMap[sectionTitle].rows;

        for (const row of table.rows) {
          const newRow = [...row];
          newRow[0] = "0";
          newRow[newRow.length - 1] = "--";

          if (
            !existingRows.some(
              (existingRow) => existingRow.join() === newRow.join(),
            )
          ) {
            existingRows.push(newRow);
          }
        }
      }
    }
  }

  return Object.entries(sectionMap).map(([section, sectionData]) => ({
    section,
    title: sectionData.title,
    rows: sectionData.rows.map((row) => {
      row[0] = String(counter++);
      return row;
    }),
  }));
}
