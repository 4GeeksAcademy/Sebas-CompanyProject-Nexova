import AppShell from "../../components/app-shell";

export default function CandidateLoading() {
  return (
    <AppShell>
      <div className="content-wrap detail-wrap" aria-label="Cargando candidatura">
        <div className="skeleton skeleton-short" />
        <div className="skeleton skeleton-heading" />
        <div className="skeleton skeleton-summary" />
        <div className="skeleton skeleton-panel" />
      </div>
    </AppShell>
  );
}