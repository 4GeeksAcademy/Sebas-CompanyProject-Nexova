"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  CANDIDATE_STAGES,
  CANDIDATE_STATUSES,
  type Candidate,
  type CandidatePatchPayload,
  type CandidateStage,
  type CandidateStatus,
  recordsUrl,
} from "../lib/records";

type CandidateWorkflowProps = Pick<Candidate, "id" | "status" | "stage">;

export default function CandidateWorkflow({
  id,
  status: initialStatus,
  stage: initialStage,
}: CandidateWorkflowProps) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [stage, setStage] = useState(initialStage);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [hasError, setHasError] = useState(false);

  async function updateCandidate(
    field: "status" | "stage",
    value: CandidateStatus | CandidateStage,
  ) {
    const previousStatus = status;
    const previousStage = stage;

    if (field === "status") {
      setStatus(value as CandidateStatus);
    } else {
      setStage(value as CandidateStage);
    }

    setIsSaving(true);
    setFeedback("Guardando cambio...");
    setHasError(false);

    try {
      const payload: CandidatePatchPayload =
        field === "status"
          ? { status: value as CandidateStatus }
          : { stage: value as CandidateStage };
      const response = await fetch(recordsUrl(`/${encodeURIComponent(id)}`), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("No se pudo guardar el cambio.");
      }

      const updatedCandidate = (await response.json()) as Candidate;
      setStatus(updatedCandidate.status);
      setStage(updatedCandidate.stage);
      setFeedback("Cambio guardado.");
      router.refresh();
    } catch {
      setStatus(previousStatus);
      setStage(previousStage);
      setFeedback("No se pudo guardar. Inténtalo de nuevo.");
      setHasError(true);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="workflow-controls">
      <label className="workflow-field">
        <span className="metric-label">Estado actual</span>
        <select
          className="workflow-select"
          value={status}
          disabled={isSaving}
          onChange={(event) =>
            void updateCandidate("status", event.target.value as CandidateStatus)
          }
        >
          {Object.entries(CANDIDATE_STATUSES).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </label>
      <label className="workflow-field">
        <span className="metric-label">Etapa actual</span>
        <select
          className="workflow-select"
          value={stage}
          disabled={isSaving}
          onChange={(event) =>
            void updateCandidate("stage", event.target.value as CandidateStage)
          }
        >
          {Object.entries(CANDIDATE_STAGES).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </label>
      <p className={`workflow-feedback${hasError ? " workflow-error" : ""}`} role={hasError ? "alert" : "status"}>
        {feedback}
      </p>
    </div>
  );
}