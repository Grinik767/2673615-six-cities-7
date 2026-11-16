import {ClassConstructor, plainToInstance} from 'class-transformer';

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
export function fillDTO<T, V>(dto: ClassConstructor<T>, plainObjects: V[]): T[];
export function fillDTO<T, V>(dto: ClassConstructor<T>, plainObject: V): T;
export function fillDTO<T, V>(dto: ClassConstructor<T>, plainObject: V | V[]): T | T[] {
  return plainToInstance(dto, plainObject, {excludeExtraneousValues: true});
}

export function createErrorObject(message: string): {message: string} {
  return {message};
}
