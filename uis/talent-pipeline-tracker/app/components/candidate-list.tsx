"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  CANDIDATE_STAGES,
  CANDIDATE_STATUSES,
  type Candidate,
  type CandidateStage,
  type CandidateStatus,
  formatDate,
  stageLabel,
  statusLabel,
} from "../lib/records";

function isCandidateStatus(value: string | null): value is CandidateStatus {
  return value !== null && Object.hasOwn(CANDIDATE_STATUSES, value);
}

function isCandidateStage(value: string | null): value is CandidateStage {
  return value !== null && Object.hasOwn(CANDIDATE_STAGES, value);
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toLocaleUpperCase("es");
}

function avatarTone(id: string) {
  const tones = ["sage", "coral", "sky", "gold", "lilac"];
  return tones[id.charCodeAt(0) % tones.length];
}

export default function CandidateList({
  candidates,
}: {
  candidates: Candidate[];
}) {
  const [query, setQuery] = useState("");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status");
  const stageParam = searchParams.get("stage");
  const status = isCandidateStatus(statusParam) ? statusParam : "all";
  const stage = isCandidateStage(stageParam) ? stageParam : "all";
  const normalizedQuery = query.trim().toLocaleLowerCase("es");

  function updateFilter(name: "status" | "stage", value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "all") {
      params.delete(name);
    } else {
      params.set(name, value);
    }

    const queryString = params.toString();
    window.history.replaceState(
      null,
      "",
      queryString ? `${pathname}?${queryString}` : pathname,
    );
  }

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesQuery = [candidate.full_name, candidate.email]
      .some((value) => value.toLocaleLowerCase("es").includes(normalizedQuery));
    const matchesStatus = status === "all" || candidate.status === status;
    const matchesStage = stage === "all" || candidate.stage === stage;

    return matchesQuery && matchesStatus && matchesStage;
  });

  return (
    <section className="candidate-panel" aria-labelledby="list-heading">
      <div className="list-toolbar">
        <div>
          <p className="eyebrow">Vista general</p>
          <h2 id="list-heading">Pipeline completo</h2>
          <p className="list-count">
            {filteredCandidates.length} de {candidates.length} candidaturas
          </p>
        </div>
        <div className="list-filters">
          <label className="search-field">
            <span className="sr-only">Buscar por nombre o email</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por nombre o email"
            />
          </label>
          <label>
            <span className="sr-only">Filtrar por estado</span>
            <select value={status} onChange={(event) => updateFilter("status", event.target.value)}>
              <option value="all">Todos los estados</option>
              {Object.entries(CANDIDATE_STATUSES).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>
          <label>
            <span className="sr-only">Filtrar por etapa</span>
            <select value={stage} onChange={(event) => updateFilter("stage", event.target.value)}>
              <option value="all">Todas las etapas</option>
              {Object.entries(CANDIDATE_STAGES).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {filteredCandidates.length > 0 ? (
        <div className="table-scroll">
          <table className="candidate-table">
            <thead>
              <tr>
                <th scope="col">Candidata/o</th>
                <th scope="col">Puesto</th>
                <th scope="col">Estado actual</th>
                <th scope="col">Etapa actual</th>
                <th scope="col">Fecha de ingreso</th>
              </tr>
            </thead>
            <tbody>
              {filteredCandidates.map((candidate) => (
                <tr key={candidate.id}>
                  <td data-label="Candidata/o" className="candidate-cell">
                    <Link
                      className="candidate-link"
                      href={`/candidates/${candidate.id}`}
                      prefetch={false}
                    >
                      <span
                        className={`avatar avatar-${avatarTone(candidate.id)}`}
                        aria-hidden="true"
                      >
                        {initials(candidate.full_name)}
                      </span>
                      <span className="candidate-identity">
                        <strong>{candidate.full_name}</strong>
                        <small>{candidate.email}</small>
                      </span>
                    </Link>
                  </td>
                  <td data-label="Puesto" className="position-cell">
                    {candidate.position}
                  </td>
                  <td data-label="Estado actual">
                    <span className={`status status-${candidate.status}`}>
                      <span className="status-dot" />
                      {statusLabel(candidate.status)}
                    </span>
                  </td>
                  <td data-label="Etapa actual">
                    <span className="stage-label">{stageLabel(candidate.stage)}</span>
                  </td>
                  <td data-label="Fecha de ingreso" className="date-cell">
                    {formatDate(candidate.applied_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-results">
          <strong>No hay coincidencias</strong>
          <p>Prueba con otro nombre, puesto o estado.</p>
        </div>
      )}
    </section>
  );
}