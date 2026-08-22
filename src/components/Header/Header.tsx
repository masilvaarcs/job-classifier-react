import './Header.css';

export function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-logo">
          <span className="logo-text">JT</span>
        </div>
        <div className="header-info">
          <h1 className="header-title">Job Classifier</h1>
          <p className="header-subtitle">Dashboard de Vagas de Emprego</p>
        </div>
      </div>
    </header>
  );
}
