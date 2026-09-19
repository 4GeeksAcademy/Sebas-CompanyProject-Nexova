/**
 * Transformaciones y agregaciones sobre colecciones de datos de Nexova:
 * conteos por categoría, sumas, promedios, máximos/mínimos y reportes de negocio.
 */

import type { Candidate, JobPosting, ProcessStage, SelectionProcess } from "../types/models.js";

/** Cuenta cuántos elementos existen por cada categoría devuelta por keySelector. */
export function countByCategory<T, K extends string | number>(
  items: T[],
  keySelector: (item: T) => K,
): Record<K, number> {
  const counts = {} as Record<K, number>;
  for (const item of items) {
    const key = keySelector(item);
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
}

/** Suma los valores numéricos devueltos por valueSelector. Devuelve 0 si el array está vacío. */
export function sumBy<T>(items: T[], valueSelector: (item: T) => number): number {
  return items.reduce((total, item) => total + valueSelector(item), 0);
}

/** Calcula el promedio de los valores numéricos devueltos por valueSelector. Devuelve 0 si está vacío. */
export function averageBy<T>(items: T[], valueSelector: (item: T) => number): number {
  if (items.length === 0) {
    return 0;
  }
  return sumBy(items, valueSelector) / items.length;
}

/** Encuentra el elemento con el valor máximo según valueSelector. Devuelve undefined si está vacío. */
export function findMaxBy<T>(items: T[], valueSelector: (item: T) => number): T | undefined {
  return items.reduce<T | undefined>((max, item) => {
    if (max === undefined || valueSelector(item) > valueSelector(max)) {
      return item;
    }
    return max;
  }, undefined);
}

/** Encuentra el elemento con el valor mínimo según valueSelector. Devuelve undefined si está vacío. */
export function findMinBy<T>(items: T[], valueSelector: (item: T) => number): T | undefined {
  return items.reduce<T | undefined>((min, item) => {
    if (min === undefined || valueSelector(item) < valueSelector(min)) {
      return item;
    }
    return min;
  }, undefined);
}

// --- Reportes de negocio para Operaciones de Selección ---

/** Reporte de cuántos candidatos hay por cada nivel de inglés. */
export function generateCandidatesByEnglishLevelReport(
  candidates: Candidate[],
): Record<string, number> {
  return countByCategory(candidates, (candidate) => candidate.englishLevel);
}

/** Reporte de cuántas vacantes abiertas hay por departamento. */
export function generateOpenJobPostingsByDepartmentReport(
  jobPostings: JobPosting[],
): Record<string, number> {
  const openPostings = jobPostings.filter((job) => job.status === "open");
  return countByCategory(openPostings, (job) => job.department);
}

/** Reporte del embudo de selección: cuántos procesos hay en cada etapa. */
export function generateSelectionFunnelReport(
  processes: SelectionProcess[],
): Record<ProcessStage, number> {
  return countByCategory(processes, (process) => process.stage);
}

/** Calcula el match score promedio de los procesos de selección de un consultor. */
export function calculateAverageMatchScoreByConsultant(
  processes: SelectionProcess[],
  consultantId: string,
): number {
  const consultantProcesses = processes.filter((process) => process.consultantId === consultantId);
  return averageBy(consultantProcesses, (process) => process.matchScore);
}

/** Devuelve el candidato con mayor cantidad de años de experiencia. */
export function findMostExperiencedCandidate(candidates: Candidate[]): Candidate | undefined {
  return findMaxBy(candidates, (candidate) => candidate.yearsOfExperience);
}

/** Devuelve el salario esperado más bajo y más alto entre un grupo de candidatos. */
export function getExpectedSalaryRange(candidates: Candidate[]): { min: number; max: number } {
  const min = findMinBy(candidates, (candidate) => candidate.expectedSalary);
  const max = findMaxBy(candidates, (candidate) => candidate.expectedSalary);
  return {
    min: min?.expectedSalary ?? 0,
    max: max?.expectedSalary ?? 0,
  };
}
