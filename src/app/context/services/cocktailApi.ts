export async function getCocktails() {
  const res = await fetch("/api/ontology/getCocktails");
  if (!res.ok) throw new Error("Failed to fetch cocktails");
  return res.json();
}

export async function generate(data: any) {
  const res = await fetch("/api/ontology/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to generate cocktail");
  return res.json();
}

export async function addIngredientToOntology(data: any) {
  const res = await fetch("/api/ontology/addIngredient", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Ontology update failed");
  return res.json();
}

export async function update(data: any) {
  const res = await fetch("/api/ontology/update", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Ontology update failed");

  return res.json();
}

export async function prepare(data: any) {
  const res = await fetch("/api/ontology/prepare", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Preparing ontology failed");
  return res.json();
}

export async function remove(data: any) {
  const res = await fetch("/api/ontology/remCocktail", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Removing cocktail failed");
}
