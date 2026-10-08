import Link from "next/link";
import { notFound } from "next/navigation";
import AppShell from "../../../components/app-shell";
import CandidateForm from "../../../components/candidate-form";
import { getCandidate } from "../../../lib/records";

type EditCandidatePageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditCandidatePage({ params }: EditCandidatePageProps) {
  const { id } = await params;
  const result = await getCandidate(id).then(
    (candidate) => ({ candidate, hasError: false }),
    () => ({ candidate: null, hasError: true }),
  );

  if (result.hasError) {
    return (
      <AppShell>
        <div className="content-wrap">
          <section className="message-panel" role="alert">
            <p className="eyebrow">Conexión interrumpida</p>
            <h1>No pudimos cargar la candidatura</h1>
            <p>Comprueba la conexión con el servicio e inténtalo de nuevo.</p>
            <Link className="text-link" href={`/candidates/${id}/edit`}>
              Reintentar
            </Link>
          </section>
        </div>
      </AppShell>
    );
  }

  if (!result.candidate) {
    notFound();
  }

  return (
    <AppShell>
      <div className="content-wrap detail-wrap form-page">
        <nav className="breadcrumbs" aria-label="Ruta de navegación">
          <Link href="/">Candidaturas</Link>
          <span aria-hidden="true">/</span>
          <Link href={`/candidates/${id}`}>{result.candidate.full_name}</Link>
          <span aria-hidden="true">/</span>
          <span>Editar</span>
        </nav>

        <header className="form-page-heading">
          <p className="eyebrow">Operaciones de selección</p>
          <h1>Editar candidatura</h1>
          <p>Actualiza los datos de {result.candidate.full_name}.</p>
        </header>

        <section className="detail-section form-panel" aria-label="Editar datos de candidatura">
          <CandidateForm candidate={result.candidate} />
        </section>
      </div>
    </AppShell>
  );
}