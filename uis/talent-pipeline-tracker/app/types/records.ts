export const CANDIDATE_STATUSES = {
  received: "Recibida",
  in_progress: "En proceso",
  selected: "Seleccionada",
  discarded: "Descartada",
} as const;

export const CANDIDATE_STAGES = {
  pending: "Pendiente",
  review: "Revisión de perfil",
  technical_interview: "Entrevista técnica",
  personal_interview: "Entrevista personal",
  offer_presented: "Oferta presentada",
} as const;

export type CandidateStatus = keyof typeof CANDIDATE_STATUSES;
export type CandidateStage = keyof typeof CANDIDATE_STAGES;

export type Candidate = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  position: string;
  linkedin_url: string | null;
  cv_url: string | null;
  status: CandidateStatus;
  stage: CandidateStage;
  experience_years: number;
  notes_count: number;
  applied_at: string;
  updated_at: string;
};

export type CandidateNote = {
  id: string;
  record_id: string;
  content: string;
  created_at: string;
};

export type RecordsResponse = {
  total: number;
  page: number;
  limit: number;
  data: Candidate[];
};

export type CandidateNotesResponse = {
  data: CandidateNote[];
  meta: { total: number };
};

export type CandidateWritePayload = {
  full_name: string;
  email: string;
  phone: string;
  position: string;
  linkedin_url: string | null;
  cv_url: string | null;
  experience_years: number;
};

export type CandidatePatchPayload = Partial<
  Pick<Candidate, "status" | "stage">
>;

export type CandidateNoteCreatePayload = {
  content: string;
};