/**
 * Utilidades de búsqueda tipadas: búsqueda lineal (arrays desordenados) y
 * búsqueda binaria (arrays ordenados).
 */

/** Búsqueda lineal: recorre el array y devuelve el primer elemento que cumple el predicado. */
export function linearSearch<T>(items: T[], predicate: (item: T) => boolean): T | undefined {
  for (const item of items) {
    if (predicate(item)) {
      return item;
    }
  }
  return undefined;
}

/** Búsqueda lineal que devuelve todos los elementos que cumplen el predicado. */
export function linearSearchAll<T>(items: T[], predicate: (item: T) => boolean): T[] {
  const results: T[] = [];
  for (const item of items) {
    if (predicate(item)) {
      results.push(item);
    }
  }
  return results;
}

/** Búsqueda lineal que devuelve el índice del primer elemento que cumple el predicado, o -1. */
export function linearSearchIndex<T>(items: T[], predicate: (item: T) => boolean): number {
  for (let i = 0; i < items.length; i++) {
    if (predicate(items[i])) {
      return i;
    }
  }
  return -1;
}

/**
 * Búsqueda binaria sobre un array ordenado ascendentemente según getKey.
 * Devuelve el elemento encontrado o undefined si no existe o el array está vacío.
 * El array debe estar previamente ordenado por la misma clave.
 */
export function binarySearch<T, K extends string | number>(
  sortedItems: T[],
  targetKey: K,
  getKey: (item: T) => K,
): T | undefined {
  const index = binarySearchIndex(sortedItems, targetKey, getKey);
  return index === -1 ? undefined : sortedItems[index];
}

/** Igual que binarySearch pero devuelve el índice del elemento, o -1 si no se encuentra. */
export function binarySearchIndex<T, K extends string | number>(
  sortedItems: T[],
  targetKey: K,
  getKey: (item: T) => K,
): number {
  let low = 0;
  let high = sortedItems.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const midKey = getKey(sortedItems[mid]);

    if (midKey === targetKey) {
      return mid;
    }
    if (midKey < targetKey) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return -1;
}
