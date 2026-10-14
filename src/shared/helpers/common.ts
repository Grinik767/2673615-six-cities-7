export function generateRandomValue(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomItem<T>(items: T[]): T {
  return items[generateRandomValue(0, items.length - 1)];
}

export function getRandomItems<T>(items: T[]): T[] {
  const selected = items.filter(() => generateRandomValue(0, 1) === 1);
  return selected.length > 0 ? selected : [getRandomItem(items)];
}

export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
