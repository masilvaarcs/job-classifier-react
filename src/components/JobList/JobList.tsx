import type { Vaga } from '../../types';
import { JobCard } from '../JobCard/JobCard';
import './JobList.css';

interface JobListProps {
  vagas: Vaga[];
  loading: boolean;
  error: string | null;
  onStatusChange: (id: number, status: string) => void;
  onIgnorar: (id: number) => void;
  onRestaurar: (id: number) => void;
  onFavoritar: (id: number) => void;
}

export function JobList({
  vagas,
  loading,
  error,
  onStatusChange,
  onIgnorar,
  onRestaurar,
  onFavoritar,
}: JobListProps) {
  if (loading) {
    return (
      <div className="job-list-loading">
        <div className="spinner" />
        <p>Carregando vagas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="job-list-error">
        <p>⚠️ {error}</p>
        <p className="error-hint">Tentando carregar dados offline...</p>
      </div>
    );
  }

  if (vagas.length === 0) {
    return (
      <div className="job-list-empty">
        <p>🔍 Nenhuma vaga encontrada com os filtros selecionados.</p>
      </div>
    );
  }

  return (
    <div className="job-list">
      {vagas.map((vaga) => (
        <JobCard
          key={vaga.id}
          vaga={vaga}
          onStatusChange={onStatusChange}
          onIgnorar={onIgnorar}
          onRestaurar={onRestaurar}
          onFavoritar={onFavoritar}
        />
      ))}
    </div>
  );
}
