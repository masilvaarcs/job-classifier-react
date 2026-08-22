import type { Vaga } from '../../types';
import { getScoreClass, getScoreLabel, getTipoEmoji } from '../../utils/score';
import './JobCard.css';

interface JobCardProps {
  vaga: Vaga;
  onStatusChange: (id: number, status: string) => void;
  onIgnorar: (id: number) => void;
  onRestaurar: (id: number) => void;
  onFavoritar: (id: number) => void;
}

const STATUS_OPTIONS = [
  { value: 'pendente', label: 'Pendente' },
  { value: 'candidatado', label: 'Candidatado' },
  { value: 'entrevista', label: 'Entrevista' },
  { value: 'rejeitado', label: 'Rejeitado' },
  { value: 'contratado', label: 'Contratado' },
];

export function JobCard({ vaga, onStatusChange, onIgnorar, onRestaurar, onFavoritar }: JobCardProps) {
  const scoreClass = getScoreClass(vaga.score_compatibilidade);
  const scoreLabel = getScoreLabel(vaga.score_compatibilidade);

  return (
    <div className={`job-card ${vaga.ignorada ? 'ignored' : ''}`}>
      <div className="job-card-header">
        <div className="job-card-title-row">
          <h3 className="job-title">{vaga.titulo}</h3>
          <span className={`score-badge ${scoreClass}`}>
            {vaga.score_compatibilidade} {scoreLabel}
          </span>
        </div>
        <div className="job-meta">
          <span className="meta-badge empresa">🏢 {vaga.empresa}</span>
          <span className="meta-badge local">📍 {vaga.localizacao}</span>
          {vaga.salario && <span className="meta-badge salario">💰 {vaga.salario}</span>}
          <span className="meta-badge plataforma">🌐 {vaga.plataforma}</span>
          <span className="meta-badge tipo">
            {getTipoEmoji(vaga.tipo_trabalho)} {vaga.tipo_trabalho}
          </span>
          {vaga.publicado && <span className="meta-badge data">📅 {vaga.publicado}</span>}
        </div>
      </div>

      {vaga.descricao && (
        <p className="job-description">
          {vaga.descricao.substring(0, 200)}
          {vaga.descricao.length > 200 ? '...' : ''}
        </p>
      )}

      <div className="job-card-actions">
        <button
          className={`action-btn favoritar ${vaga.pra_mim ? 'active' : ''}`}
          onClick={() => onFavoritar(vaga.id)}
          title={vaga.pra_mim ? 'Remover dos favoritos' : 'Marcar como Pra Mim'}
        >
          ★
        </button>

        {vaga.ignorada ? (
          <button
            className="action-btn restaurar"
            onClick={() => onRestaurar(vaga.id)}
            title="Restaurar vaga"
          >
            🔄 Restaurar
          </button>
        ) : (
          <button
            className="action-btn ignorar"
            onClick={() => onIgnorar(vaga.id)}
            title="Ignorar vaga"
          >
            🚫 Ignorar
          </button>
        )}

        <select
          className="status-select"
          value={vaga.status_usuario}
          onChange={(e) => onStatusChange(vaga.id, e.target.value)}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <a
          href={vaga.link}
          target="_blank"
          rel="noopener noreferrer"
          className="action-btn ver-vaga"
        >
          🔗 Ver Vaga
        </a>
      </div>
    </div>
  );
}
