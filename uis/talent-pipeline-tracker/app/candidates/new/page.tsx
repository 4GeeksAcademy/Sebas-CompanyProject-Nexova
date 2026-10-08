import Link from "next/link";
import AppShell from "../../components/app-shell";
import CandidateForm from "../../components/candidate-form";

export default function NewCandidatePage() {
  return (
    <AppShell>
      <div className="content-wrap detail-wrap form-page">
        <nav className="breadcrumbs" aria-label="Ruta de navegación">
          <Link href="/">Candidaturas</Link>
          <span aria-hidden="true">/</span>
          <span>Nueva candidatura</span>
        </nav>

        <header className="form-page-heading">
          <p className="eyebrow">Operaciones de selección</p>
          <h1>Nueva candidatura</h1>
          <p>Registra un perfil en el pipeline de Nexova.</p>
        </header>

        <section className="detail-section form-panel" aria-label="Datos de candidatura">
          <CandidateForm />
        </section>
      </div>
    </AppShell>
  );
}