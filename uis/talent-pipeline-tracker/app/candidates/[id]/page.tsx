import Link from "next/link";
import { notFound } from "next/navigation";
import AppShell from "../../components/app-shell";
import CandidateNotes from "../../components/candidate-notes";
import CandidateWorkflow from "../../components/candidate-workflow";
import { formatDate, getCandidate } from "../../lib/records";

type CandidatePageProps = {
  params: Promise<{ id: string }>;
};

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toLocaleUpperCase("es");
}

export default async function CandidatePage({ params }: CandidatePageProps) {
  const { id } = await params;
  let candidate;

  try {
    candidate = await getCandidate(id);
  } catch {
    return (
      <AppShell>
        <div className="content-wrap">
          <section className="message-panel" role="alert">
            <p className="eyebrow">Conexión interrumpida</p>
            <h1>No pudimos cargar esta candidatura</h1>
            <p>Comprueba la conexión con el servicio e inténtalo de nuevo.</p>
            <Link className="text-link" href={`/candidates/${id}`}>
              Reintentar
            </Link>
          </section>
        </div>
      </AppShell>
    );
  }

  if (!candidate) {
    notFound();
  }

  return (
    <AppShell>
      <div className="content-wrap detail-wrap">
        <nav className="breadcrumbs" aria-label="Ruta de navegación">
          <Link href="/">Candidaturas</Link>
          <span aria-hidden="true">/</span>
          <span>Detalle</span>
        </nav>

        <header className="detail-heading">
          <div className="detail-person">
            <span className="detail-avatar" aria-hidden="true">
              {initials(candidate.full_name)}
            </span>
            <div>
              <p className="eyebrow">Ficha de candidatura</p>
              <h1>{candidate.full_name}</h1>
              <p className="detail-position">{candidate.position}</p>
            </div>
          </div>
          <div className="detail-actions">
            <Link className="primary-action" href={`/candidates/${candidate.id}/edit`}>
              Editar candidatura
            </Link>
            <Link className="back-link" href="/">
              Volver al listado
            </Link>
          </div>
        </header>

        <section className="detail-summary" aria-label="Estado de candidatura">
          <CandidateWorkflow
            id={candidate.id}
            status={candidate.status}
            stage={candidate.stage}
          />
          <div className="summary-state">
            <span className="metric-label">Experiencia</span>
            <strong>
              {candidate.experience_years == null
                ? "No indicada"
                : `${candidate.experience_years} ${candidate.experience_years === 1 ? "año" : "años"}`}
            </strong>
          </div>
        </section>

        <section className="detail-section" aria-labelledby="contact-heading">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Perfil</p>
              <h2 id="contact-heading">Información de candidatura</h2>
            </div>
          </div>

          <dl className="detail-grid">
            <div className="detail-field">
              <dt>Correo electrónico</dt>
              <dd>
                <a href={`mailto:${candidate.email}`}>{candidate.email}</a>
              </dd>
            </div>
            <div className="detail-field">
              <dt>Teléfono</dt>
              <dd>
                {candidate.phone ? (
                  <a href={`tel:${candidate.phone}`}>{candidate.phone}</a>
                ) : (
                  "No indicado"
                )}
              </dd>
            </div>
            <div className="detail-field">
              <dt>Fecha de candidatura</dt>
              <dd>{formatDate(candidate.applied_at)}</dd>
            </div>
            <div className="detail-field">
              <dt>Última actualización</dt>
              <dd>{formatDate(candidate.updated_at)}</dd>
            </div>
          </dl>

          <div className="profile-links">
            {candidate.linkedin_url && (
              <a href={candidate.linkedin_url} target="_blank" rel="noreferrer">
                Perfil de LinkedIn <span aria-hidden="true">↗</span>
              </a>
            )}
            {candidate.cv_url && (
              <a href={candidate.cv_url} target="_blank" rel="noreferrer">
                Abrir CV <span aria-hidden="true">↗</span>
              </a>
            )}
            {!candidate.linkedin_url && !candidate.cv_url && (
              <span className="muted-copy">No hay documentos vinculados.</span>
            )}
          </div>
        </section>

        <CandidateNotes candidateId={candidate.id} />
      </div>
    </AppShell>
  );
}