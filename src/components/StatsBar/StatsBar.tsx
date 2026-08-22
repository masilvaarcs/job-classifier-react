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

  const statCards = [
    { label: 'Total de Vagas', value: stats.total_vagas.toLocaleString(), color: '#2563eb' },
    { label: 'Plataformas', value: stats.total_plataformas, color: '#8b5cf6' },
    { label: 'Última Coleta', value: stats.ultima_coleta || 'N/A', color: '#10b981' },
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
