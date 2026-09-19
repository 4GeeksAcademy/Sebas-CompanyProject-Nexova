/**
 * Utilidades genéricas para manipular colecciones (arrays) de forma tipada.
 */

import type { Candidate, EnglishLevel, JobPosting, JobStatus } from "../types/models.js";

export type SortOrder = "asc" | "desc";

export interface SortCriterion<T> {
  selector: (item: T) => string | number;
  order?: SortOrder;
}

/** Filtra los elementos de un array que cumplen un predicado. Devuelve [] si el array está vacío. */
export function filterBy<T>(items: T[], predicate: (item: T) => boolean): T[] {
  return items.filter(predicate);
}

/** Ordena una copia del array según el valor devuelto por keySelector. No muta el array original. */
export function sortBy<T, K extends string | number>(
  items: T[],
  keySelector: (item: T) => K,
  order: SortOrder = "asc",
): T[] {
  const sorted = [...items].sort((a, b) => {
    const keyA = keySelector(a);
    const keyB = keySelector(b);
    if (keyA < keyB) return order === "asc" ? -1 : 1;
    if (keyA > keyB) return order === "asc" ? 1 : -1;
    return 0;
  });
  return sorted;
}

/** Ordena una copia del array aplicando varios criterios en orden de prioridad (multi-campo). */
export function sortByMultiple<T>(items: T[], criteria: SortCriterion<T>[]): T[] {
  return [...items].sort((a, b) => {
    for (const { selector, order = "asc" } of criteria) {
      const keyA = selector(a);
      const keyB = selector(b);
      if (keyA < keyB) return order === "asc" ? -1 : 1;
      if (keyA > keyB) return order === "asc" ? 1 : -1;
    }
    return 0;
  });
}

/** Agrupa los elementos de un array en un Map según la clave devuelta por keySelector. */
export function groupBy<T, K>(items: T[], keySelector: (item: T) => K): Map<K, T[]> {
  const groups = new Map<K, T[]>();
  for (const item of items) {
    const key = keySelector(item);
    const group = groups.get(key);
    if (group) {
      group.push(item);
    } else {
      groups.set(key, [item]);
    }
  }
  return groups;
}

/** Elimina duplicados de un array conservando el primer elemento para cada clave. */
export function uniqueBy<T, K>(items: T[], keySelector: (item: T) => K): T[] {
  const seen = new Set<K>();
  const result: T[] = [];
  for (const item of items) {
    const key = keySelector(item);
    if (!seen.has(key)) {
      seen.add(key);
      result.push(item);
    }
  }
  return result;
}

/** Divide un array en bloques (chunks) de tamaño fijo. Lanza un error si el tamaño no es positivo. */
export function chunk<T>(items: T[], size: number): T[][] {
  if (size <= 0) {
    throw new Error("El tamaño del chunk debe ser mayor que cero.");
  }
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

/** Devuelve una página específica de un array dado un número de página (1-indexado) y un tamaño. */
export function paginate<T>(items: T[], page: number, pageSize: number): T[] {
  if (page < 1 || pageSize <= 0) {
    return [];
  }
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

// --- Filtros multi-criterio para las entidades de Operaciones de Selección ---

export interface CandidateFilterCriteria {
  skill?: string;
  englishLevel?: EnglishLevel;
  minExperience?: number;
  maxExperience?: number;
}

/** Filtra candidatos combinando uno o más criterios opcionales (habilidad, inglés, rango de experiencia). */
export function filterCandidatesByCriteria(
  candidates: Candidate[],
  criteria: CandidateFilterCriteria,
): Candidate[] {
  return candidates.filter((candidate) => {
    if (criteria.skill && !candidate.skills.includes(criteria.skill)) {
      return false;
    }
    if (criteria.englishLevel && candidate.englishLevel !== criteria.englishLevel) {
      return false;
    }
    if (criteria.minExperience !== undefined && candidate.yearsOfExperience < criteria.minExperience) {
      return false;
    }
    if (criteria.maxExperience !== undefined && candidate.yearsOfExperience > criteria.maxExperience) {
      return false;
    }
    return true;
  });
}

export interface JobPostingFilterCriteria {
  department?: string;
  status?: JobStatus;
  minSalary?: number;
  maxSalary?: number;
}

/** Filtra vacantes combinando uno o más criterios opcionales (departamento, estado, rango salarial). */
export function filterJobPostingsByCriteria(
  jobPostings: JobPosting[],
  criteria: JobPostingFilterCriteria,
): JobPosting[] {
  return jobPostings.filter((job) => {
    if (criteria.department && job.department !== criteria.department) {
      return false;
    }
    if (criteria.status && job.status !== criteria.status) {
      return false;
    }
    if (criteria.minSalary !== undefined && job.salaryRangeMax < criteria.minSalary) {
      return false;
    }
    if (criteria.maxSalary !== undefined && job.salaryRangeMin > criteria.maxSalary) {
      return false;
    }
    return true;
  });
}
