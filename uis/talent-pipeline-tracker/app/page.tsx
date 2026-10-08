import Link from "next/link";
import { Suspense } from "react";
import AppShell from "./components/app-shell";
import CandidateList from "./components/candidate-list";
import { getCandidates } from "./lib/records";

async function CandidateContent() {
  const candidates = await getCandidates().catch(() => null);

  if (!candidates) {
    return (
      <div className="content-wrap">
        <section className="message-panel" role="alert">
          <p className="eyebrow">Conexión interrumpida</p>
          <h1>No pudimos cargar las candidaturas</h1>
          <p>Comprueba la conexión con el servicio y vuelve a intentarlo.</p>
          <Link className="text-link" href="/">Reintentar</Link>
        </section>
      </div>
    );
  }

  const inProgress = candidates.filter((candidate) => candidate.status === "in_progress").length;
  const selected = candidates.filter((candidate) => candidate.status === "selected").length;
  const received = candidates.filter((candidate) => candidate.status === "received").length;

  return (
    <div className="content-wrap">
      <header className="page-heading">
        <div>
          <p className="eyebrow">Talent operations / Candidaturas</p>
          <h1>Candidaturas</h1>
          <p className="page-description">Sigue cada perfil desde su recepción hasta la decisión final.</p>
        </div>
        <div className="heading-actions">
          <div className="api-indicator"><span className="live-dot" />Datos sincronizados</div>
          <Link className="primary-action" href="/candidates/new">
            Nueva candidatura
          </Link>
        </div>
      </header>

      <section className="metrics" aria-label="Resumen de candidaturas">
        <div className="metric metric-total"><span className="metric-label">Total candidaturas</span><strong>{candidates.length}</strong><span className="metric-footnote">en todos los puestos</span></div>
        <div className="metric"><span className="metric-label">En proceso</span><strong>{inProgress}</strong><span className="metric-footnote">en evaluación activa</span></div>
        <div className="metric"><span className="metric-label">Seleccionadas</span><strong>{selected}</strong><span className="metric-footnote">listas para avanzar</span></div>
        <div className="metric"><span className="metric-label">Recibidas</span><strong>{received}</strong><span className="metric-footnote">pendientes de revisión</span></div>
      </section>

      <CandidateList candidates={candidates} />
    </div>
  );
}

function CandidateLoading() {
  return (
    <div className="content-wrap" aria-label="Cargando candidaturas">
      <div className="skeleton skeleton-short" />
      <div className="skeleton skeleton-heading" />
      <div className="skeleton skeleton-summary" />
      <div className="skeleton skeleton-panel" />
    </div>
  );
}

export default function Home() {
  return (
    <AppShell>
      <Suspense fallback={<CandidateLoading />}>
        <CandidateContent />
      </Suspense>
    </AppShell>
  );
}