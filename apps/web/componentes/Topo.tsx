import Link from 'next/link';

export function Topo({ crumb, children }: { crumb?: string; children?: React.ReactNode }) {
  return (
    <header className="top">
      <div className="top-in">
        <Link className="brand" href="/" aria-label="Ir para a lista de eventos">
          <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
            <rect x="1" y="1" width="24" height="24" rx="6" fill="var(--ink)" />
            <path d="M8 18V8l10 10V8" stroke="var(--paper)" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>Publicador</span>
        </Link>
        {crumb && <span className="crumb">{crumb}</span>}
        {children}
      </div>
    </header>
  );
}
