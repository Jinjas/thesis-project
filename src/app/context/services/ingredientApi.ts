export async function getIngredientCode(name: string, type: string) {
  const res = await fetch("/api/ingredientCode/getIngredientCode", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ingredientName: name,
      ingredientType: type,
    }),
  });

  if (!res.ok) throw new Error("Failed ingredient code");

  return res.json();
}

export async function getRemainingIngredients(
  existingIngredientNames: string[],
) {
  const res = await fetch("/api/ingredientCode/getRemainingIngredients", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      existingIngredientNames,
    }),
  });

  if (!res.ok) throw new Error("Failed to fetch remaining ingredients");

  return res.json();
}

export async function setIngredientCode(
  newName: string,
  newType: string,
  newCode: string,
) {
  const res = await fetch("/api/ingredientCode/setIngredientCode", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ingredientName: newName,
      ingredientType: newType,
      newCode: newCode,
    }),
  });

  if (!res.ok) throw new Error("Failed to update ingredient");

  return res.json();
}

export async function removeIngredient(data: any) {
  const res = await fetch("/api/ingredientCode/remIngredient", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Removing ingredient failed");
}
