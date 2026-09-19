/**
 * Modelos de dominio para Operaciones de Selección de Nexova Solutions.
 * Cubren candidatos, vacantes, consultores, clientes y procesos de selección.
 */

export type Id = string;

export type EnglishLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type ProcessStage =
  | "screening"
  | "interview"
  | "offer"
  | "hired"
  | "rejected";

export type JobStatus = "open" | "on-hold" | "closed";

export interface Candidate {
  id: Id;
  fullName: string;
  email: string;
  phone: string;
  yearsOfExperience: number;
  skills: string[];
  englishLevel: EnglishLevel;
  currentPosition: string;
  expectedSalary: number;
  availabilityDate: string; // ISO date
  cvSummary: string;
  appliedAt: string; // ISO date
}

export interface JobPosting {
  id: Id;
  clientCompanyId: Id;
  title: string;
  department: string;
  seniorityLevel: "junior" | "mid" | "senior" | "lead";
  requiredSkills: string[];
  requiredEnglishLevel: EnglishLevel;
  salaryRangeMin: number;
  salaryRangeMax: number;
  location: string;
  status: JobStatus;
  postedAt: string; // ISO date
  deadline: string; // ISO date
}

export interface Consultant {
  id: Id;
  fullName: string;
  email: string;
  specialization: string;
  activeProcesses: number;
}

export interface ClientCompany {
  id: Id;
  companyName: string;
  industry: "tecnología" | "retail" | "finanzas" | "otro";
  contactPerson: string;
  contractType: "headhunting" | "outsourcing" | "formación";
}

export interface SelectionProcess {
  id: Id;
  candidateId: Id;
  jobPostingId: Id;
  consultantId: Id;
  stage: ProcessStage;
  matchScore: number; // 0 - 100
  appliedAt: string; // ISO date
  updatedAt: string; // ISO date
  notes: string;
}

const ENGLISH_LEVEL_ORDER: Record<EnglishLevel, number> = {
  A1: 1,
  A2: 2,
  B1: 3,
  B2: 4,
  C1: 5,
  C2: 6,
};

/** Indica si el nivel de inglés de un candidato cumple con el requisito de una vacante. */
export function meetsEnglishRequirement(
  candidateLevel: EnglishLevel,
  requiredLevel: EnglishLevel,
): boolean {
  return ENGLISH_LEVEL_ORDER[candidateLevel] >= ENGLISH_LEVEL_ORDER[requiredLevel];
}

/** Devuelve el rango salarial de una vacante formateado como texto legible. */
export function formatSalaryRange(job: JobPosting): string {
  return `${job.salaryRangeMin.toLocaleString()} - ${job.salaryRangeMax.toLocaleString()}`;
}

/** Calcula los días transcurridos entre la aplicación y la última actualización de un proceso. */
export function getProcessDurationInDays(process: SelectionProcess): number {
  const applied = new Date(process.appliedAt).getTime();
  const updated = new Date(process.updatedAt).getTime();
  return Math.round((updated - applied) / (1000 * 60 * 60 * 24));
}

/** Indica si una vacante sigue abierta a la fecha actual. */
export function isJobPostingOpen(job: JobPosting): boolean {
  return job.status === "open" && new Date(job.deadline).getTime() >= Date.now();
}

// --- Instancias de ejemplo (objetos literales) ---

export const sampleClientCompanies: ClientCompany[] = [
  {
    id: "client-1",
    companyName: "TechNova Retail",
    industry: "retail",
    contactPerson: "Ana Torres",
    contractType: "headhunting",
  },
  {
    id: "client-2",
    companyName: "FinBridge Capital",
    industry: "finanzas",
    contactPerson: "Luis Peña",
    contractType: "outsourcing",
  },
];

export const sampleConsultants: Consultant[] = [
  {
    id: "consultant-1",
    fullName: "María Gómez",
    email: "maria.gomez@nexova.com",
    specialization: "Perfiles tecnológicos",
    activeProcesses: 5,
  },
  {
    id: "consultant-2",
    fullName: "Diego Fernández",
    email: "diego.fernandez@nexova.com",
    specialization: "Mandos medios",
    activeProcesses: 3,
  },
];

export const sampleJobPostings: JobPosting[] = [
  {
    id: "job-1",
    clientCompanyId: "client-1",
    title: "Backend Developer",
    department: "Tecnología",
    seniorityLevel: "senior",
    requiredSkills: ["Node.js", "TypeScript", "SQL"],
    requiredEnglishLevel: "B2",
    salaryRangeMin: 45000,
    salaryRangeMax: 60000,
    location: "Valencia, España",
    status: "open",
    postedAt: "2026-08-01",
    deadline: "2026-10-01",
  },
  {
    id: "job-2",
    clientCompanyId: "client-2",
    title: "Account Manager",
    department: "Ventas",
    seniorityLevel: "mid",
    requiredSkills: ["CRM", "Negociación"],
    requiredEnglishLevel: "C1",
    salaryRangeMin: 30000,
    salaryRangeMax: 38000,
    location: "Miami, EE. UU.",
    status: "open",
    postedAt: "2026-07-15",
    deadline: "2026-09-15",
  },
];

export const sampleCandidates: Candidate[] = [
  {
    id: "candidate-1",
    fullName: "Sofía Ramírez",
    email: "sofia.ramirez@example.com",
    phone: "+34600111222",
    yearsOfExperience: 6,
    skills: ["Node.js", "TypeScript", "AWS"],
    englishLevel: "C1",
    currentPosition: "Backend Developer",
    expectedSalary: 52000,
    availabilityDate: "2026-10-15",
    cvSummary: "Desarrolladora backend con experiencia en microservicios.",
    appliedAt: "2026-09-01",
  },
  {
    id: "candidate-2",
    fullName: "Carlos Medina",
    email: "carlos.medina@example.com",
    phone: "+34600333444",
    yearsOfExperience: 3,
    skills: ["CRM", "Negociación", "Ventas B2B"],
    englishLevel: "B2",
    currentPosition: "SDR",
    expectedSalary: 34000,
    availabilityDate: "2026-09-30",
    cvSummary: "Especialista en desarrollo de negocio B2B.",
    appliedAt: "2026-08-20",
  },
];

export const sampleSelectionProcesses: SelectionProcess[] = [
  {
    id: "process-1",
    candidateId: "candidate-1",
    jobPostingId: "job-1",
    consultantId: "consultant-1",
    stage: "interview",
    matchScore: 88,
    appliedAt: "2026-09-01",
    updatedAt: "2026-09-10",
    notes: "Muy buen encaje técnico.",
  },
  {
    id: "process-2",
    candidateId: "candidate-2",
    jobPostingId: "job-2",
    consultantId: "consultant-2",
    stage: "screening",
    matchScore: 65,
    appliedAt: "2026-08-20",
    updatedAt: "2026-08-25",
    notes: "Falta validar nivel de inglés.",
  },
];
