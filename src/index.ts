/**
 * Página de prueba manual: conecta botones de la interfaz con las utilidades
 * de colecciones, búsqueda, transformaciones y validaciones.
 */

import {
  sampleCandidates,
  sampleJobPostings,
  sampleSelectionProcesses,
} from "./types/models.js";
import type { EnglishLevel } from "./types/models.js";
import {
  filterCandidatesByCriteria,
  filterJobPostingsByCriteria,
  groupBy,
  sortBy,
  sortByMultiple,
} from "./utils/collections.js";
import { binarySearch, linearSearch } from "./utils/search.js";
import {
  generateCandidatesByEnglishLevelReport,
  generateSelectionFunnelReport,
  findMostExperiencedCandidate,
  getExpectedSalaryRange,
} from "./utils/transformations.js";
import { validateCandidate, validateJobPosting } from "./utils/validations.js";

function renderOutput(lines: string[]): void {
  const outputElement = document.getElementById("output");
  if (outputElement) {
    outputElement.innerHTML = lines
      .map((line) => `<li class="py-1 border-b border-slate-200">${line}</li>`)
      .join("");
  }
  lines.forEach((line) => console.log(line));
}

function runFilterCandidates(): void {
  const skillInput = (document.getElementById("filter-skill") as HTMLInputElement | null)?.value.trim();
  const englishLevel = (document.getElementById("filter-english") as HTMLSelectElement | null)?.value as
    | EnglishLevel
    | "";

  const filtered = filterCandidatesByCriteria(sampleCandidates, {
    skill: skillInput || undefined,
    englishLevel: englishLevel || undefined,
  });

  renderOutput(
    filtered.length > 0
      ? filtered.map(
          (candidate) => `${candidate.fullName} — ${candidate.englishLevel} — ${candidate.skills.join(", ")}`,
        )
      : ["No se encontraron candidatos con esos criterios."],
  );
}

function runFilterJobPostings(): void {
  const filtered = filterJobPostingsByCriteria(sampleJobPostings, { status: "open" });
  renderOutput(
    filtered.map((job) => `${job.title} (${job.department}) — ${job.salaryRangeMin}-${job.salaryRangeMax}`),
  );
}

function runSortMultiField(): void {
  const sorted = sortByMultiple(sampleJobPostings, [
    { selector: (job) => job.department, order: "asc" },
    { selector: (job) => job.salaryRangeMax, order: "desc" },
  ]);
  renderOutput(sorted.map((job) => `${job.department} — ${job.title} — ${job.salaryRangeMax}`));
}

function runLinearSearch(): void {
  const found = linearSearch(sampleCandidates, (candidate) => candidate.skills.includes("CRM"));
  renderOutput([`Búsqueda lineal (skill CRM): ${found?.fullName ?? "no encontrado"}`]);
}

function runBinarySearch(): void {
  const sortedByExperience = sortBy(sampleCandidates, (candidate) => candidate.yearsOfExperience);
  const found = binarySearch(sortedByExperience, 3, (candidate) => candidate.yearsOfExperience);
  renderOutput([`Búsqueda binaria (3 años de experiencia): ${found?.fullName ?? "no encontrado"}`]);
}

function runReports(): void {
  const groupedByEnglishLevel = groupBy(sampleCandidates, (candidate) => candidate.englishLevel);
  const salaryRange = getExpectedSalaryRange(sampleCandidates);

  renderOutput([
    `Candidatos agrupados por nivel de inglés: ${groupedByEnglishLevel.size} grupos`,
    `Reporte por nivel de inglés: ${JSON.stringify(generateCandidatesByEnglishLevelReport(sampleCandidates))}`,
    `Embudo de selección: ${JSON.stringify(generateSelectionFunnelReport(sampleSelectionProcesses))}`,
    `Candidato más experimentado: ${findMostExperiencedCandidate(sampleCandidates)?.fullName ?? "n/a"}`,
    `Rango de salario esperado: ${salaryRange.min} - ${salaryRange.max}`,
  ]);
}

function runValidations(): void {
  const candidateValidation = validateCandidate(sampleCandidates[0]);
  const jobValidation = validateJobPosting(sampleJobPostings[0]);

  renderOutput([
    `Validación del primer candidato: ${candidateValidation.isValid ? "válido" : candidateValidation.errors.join(", ")}`,
    `Validación de la primera vacante: ${jobValidation.isValid ? "válida" : jobValidation.errors.join(", ")}`,
  ]);
}

document.getElementById("btn-filter-candidates")?.addEventListener("click", runFilterCandidates);
document.getElementById("btn-filter-jobs")?.addEventListener("click", runFilterJobPostings);
document.getElementById("btn-sort-multi")?.addEventListener("click", runSortMultiField);
document.getElementById("btn-linear-search")?.addEventListener("click", runLinearSearch);
document.getElementById("btn-binary-search")?.addEventListener("click", runBinarySearch);
document.getElementById("btn-reports")?.addEventListener("click", runReports);
document.getElementById("btn-validations")?.addEventListener("click", runValidations);

runReports();
