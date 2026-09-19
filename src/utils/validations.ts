/**
 * Validaciones de negocio para las entidades de Operaciones de Selección de Nexova.
 * Cada validación devuelve un ValidationResult con la lista de errores encontrados.
 */

import type { Candidate, JobPosting, SelectionProcess } from "../types/models.js";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Valida el formato básico de un correo electrónico. */
export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

/** Valida que fromDate sea anterior o igual a toDate. */
export function isChronologicalOrder(fromDate: string, toDate: string): boolean {
  return new Date(fromDate).getTime() <= new Date(toDate).getTime();
}

/** Valida que un número esté dentro de un rango inclusivo. */
export function isWithinRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

function buildResult(errors: string[]): ValidationResult {
  return { isValid: errors.length === 0, errors };
}

/** Valida los campos obligatorios y reglas de negocio de un candidato. */
export function validateCandidate(candidate: Candidate): ValidationResult {
  const errors: string[] = [];

  if (!candidate.fullName.trim()) {
    errors.push("El candidato debe tener un nombre completo.");
  }
  if (!isValidEmail(candidate.email)) {
    errors.push("El correo electrónico del candidato no es válido.");
  }
  if (candidate.yearsOfExperience < 0 || candidate.yearsOfExperience > 60) {
    errors.push("Los años de experiencia deben estar entre 0 y 60.");
  }
  if (candidate.skills.length === 0) {
    errors.push("El candidato debe tener al menos una habilidad registrada.");
  }
  if (candidate.expectedSalary <= 0) {
    errors.push("El salario esperado debe ser mayor que cero.");
  }

  return buildResult(errors);
}

/** Valida los campos obligatorios y reglas de negocio de una vacante. */
export function validateJobPosting(job: JobPosting): ValidationResult {
  const errors: string[] = [];

  if (!job.title.trim()) {
    errors.push("La vacante debe tener un título.");
  }
  if (job.requiredSkills.length === 0) {
    errors.push("La vacante debe requerir al menos una habilidad.");
  }
  if (job.salaryRangeMin < 0 || job.salaryRangeMax < 0) {
    errors.push("El rango salarial no puede contener valores negativos.");
  }
  if (job.salaryRangeMin > job.salaryRangeMax) {
    errors.push("El salario mínimo no puede ser mayor que el salario máximo.");
  }
  if (!isChronologicalOrder(job.postedAt, job.deadline)) {
    errors.push("La fecha límite debe ser posterior a la fecha de publicación.");
  }

  return buildResult(errors);
}

/** Valida los campos obligatorios y reglas de negocio de un proceso de selección. */
export function validateSelectionProcess(process: SelectionProcess): ValidationResult {
  const errors: string[] = [];

  if (!process.candidateId.trim() || !process.jobPostingId.trim() || !process.consultantId.trim()) {
    errors.push("El proceso debe estar asociado a un candidato, una vacante y un consultor.");
  }
  if (!isWithinRange(process.matchScore, 0, 100)) {
    errors.push("El match score debe estar entre 0 y 100.");
  }
  if (!isChronologicalOrder(process.appliedAt, process.updatedAt)) {
    errors.push("La fecha de actualización no puede ser anterior a la fecha de aplicación.");
  }

  return buildResult(errors);
}
