const queues = new Map<string, Promise<void>>();

export function enqueueCocktailUpdate(
  cocktailId: string,
  task: () => Promise<void>,
) {
  const prev = queues.get(cocktailId) ?? Promise.resolve();

  const next = prev.then(task).catch(console.error);

  queues.set(cocktailId, next);
}
