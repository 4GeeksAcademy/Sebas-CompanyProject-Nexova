import { CANDIDATE_STAGES, CANDIDATE_STATUSES } from "../types/records";
import type {
  Candidate,
  CandidateStage,
  CandidateStatus,
  RecordsResponse,
} from "../types/records";

export { CANDIDATE_STAGES, CANDIDATE_STATUSES } from "../types/records";
export type {
  Candidate,
  CandidateNote,
  CandidateStage,
  CandidateStatus,
  CandidateNotesResponse,
  CandidateNoteCreatePayload,
  CandidatePatchPayload,
  CandidateWritePayload,
  RecordsResponse,
} from "../types/records";

export function recordsUrl(path: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }

  return `${baseUrl}/records${path}`;
}

async function fetchRecordsPage(page: number, limit: number) {
  const response = await fetch(recordsUrl(`?page=${page}&limit=${limit}`), {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Records request failed with status ${response.status}`);
  }

  return (await response.json()) as RecordsResponse;
}

export async function getCandidates() {
  const firstPage = await fetchRecordsPage(1, 100);
  const pageCount = Math.ceil(firstPage.total / firstPage.limit);

  if (pageCount <= 1) {
    return firstPage.data;
  }

  const remainingPages = await Promise.all(
    Array.from({ length: pageCount - 1 }, (_, index) =>
      fetchRecordsPage(index + 2, firstPage.limit),
    ),
  );

  return [firstPage, ...remainingPages].flatMap((page) => page.data);
}

export async function getCandidate(id: string) {
  const response = await fetch(recordsUrl(`/${encodeURIComponent(id)}`), {
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Candidate request failed with status ${response.status}`);
  }

  return (await response.json()) as Candidate;
}

export function statusLabel(status: CandidateStatus) {
  return CANDIDATE_STATUSES[status];
}

export function stageLabel(stage: CandidateStage) {
  return CANDIDATE_STAGES[stage];
}

export function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Sin fecha";
  }

  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(date);
}