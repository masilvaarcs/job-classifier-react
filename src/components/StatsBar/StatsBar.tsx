import type { Stats } from '../../types';
import './StatsBar.css';

interface StatsBarProps {
  stats: Stats | null;
  loading: boolean;
}

export function StatsBar({ stats, loading }: StatsBarProps) {
  if (loading || !stats) {
    return (
      <div className="stats-bar">
        <div className="stats-loading">Carregando estatísticas...</div>
      </div>
    );
  }

  // Adaptar ao formato da API (original ou nova)
  const totalVagas = stats.total_vagas ?? stats.total ?? 0;
  const totalPlataformas = stats.total_plataformas ?? Object.keys(stats.vagas_por_plataforma ?? stats.porPlataforma ?? {}).length;
  const ultimaColeta = stats.ultima_coleta ?? 'N/A';

  const statCards = [
    { label: 'Total de Vagas', value: totalVagas.toLocaleString(), color: '#2563eb' },
    { label: 'Plataformas', value: totalPlataformas, color: '#8b5cf6' },
    { label: 'Última Coleta', value: ultimaColeta, color: '#10b981' },
  ];

  return (
    <div className="stats-bar">
      {statCards.map((card) => (
        <div key={card.label} className="stat-card">
          <div className="stat-accent" style={{ backgroundColor: card.color }} />
          <div className="stat-content">
            <span className="stat-value">{card.value}</span>
            <span className="stat-label">{card.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
