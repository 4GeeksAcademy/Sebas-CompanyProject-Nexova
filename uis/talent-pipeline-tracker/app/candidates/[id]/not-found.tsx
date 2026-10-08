import Link from "next/link";
import AppShell from "../../components/app-shell";

export default function CandidateNotFound() {
  return (
    <AppShell>
      <div className="content-wrap">
        <section className="message-panel">
          <p className="eyebrow">Candidatura no encontrada</p>
          <h1>Este perfil ya no está disponible</h1>
          <p>Puede que el registro se haya eliminado o que el enlace no sea válido.</p>
          <Link className="text-link" href="/">
            Volver a candidaturas
          </Link>
        </section>
      </div>
    </AppShell>
  );
}