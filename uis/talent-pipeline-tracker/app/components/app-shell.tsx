import Link from "next/link";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-frame">
      <aside className="sidebar">
        <Link className="brand" href="/" aria-label="Nexova Talent, inicio">
          <span className="brand-mark">N</span>
          <span className="brand-copy">
            <strong>NEXOVA</strong>
            <span>TALENT OPERATIONS</span>
          </span>
        </Link>

        <p className="sidebar-label">GESTIÓN</p>
        <nav aria-label="Navegación principal">
          <Link className="nav-link nav-link-active" href="/" aria-current="page">
            <span className="nav-index">01</span>
            Candidaturas
          </Link>
        </nav>

        <div className="sidebar-footer">
          <span className="workspace-mark">N</span>
          <span>
            <strong>Equipo Nexova</strong>
            <small>Espacio de talento</small>
          </span>
        </div>
      </aside>
      <main className="main-content">{children}</main>
    </div>
  );
}