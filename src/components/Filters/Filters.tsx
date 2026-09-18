import type { Filtros } from '../../types';
import './Filters.css';

interface FiltersProps {
  filtros: Filtros;
  onFiltroChange: (novosFiltros: Partial<Filtros>) => void;
  buscaExpandida: boolean;
  onToggleBusca: () => void;
  onSincronizar: () => void;
  sincronizando: boolean;
}

const PERIODOS = [
  { label: '24h', value: 0 },
  { label: '5 dias', value: 5 },
  { label: '10 dias', value: 10 },
  { label: '15 dias', value: 15 },
  { label: 'Todas', value: null },
];

const PLATAFORMAS = ['Todas', 'LinkedIn', 'Indeed', 'Jooble', 'Freelancer', 'Glassdoor', 'BNE'];

const TIPOS = ['Todos', '🟢 Remoto', '🟡 Híbrido', '🟠 Presencial'];

const STATUS_LISTA = ['Todos', 'Pendente', 'Candidatado', 'Entrevista', 'Rejeitado', 'Contratado'];

export function Filters({ filtros, onFiltroChange, buscaExpandida, onToggleBusca, onSincronizar, sincronizando }: FiltersProps) {
  return (
    <div className="filters-container">
      {/* Período */}
      <div className="filter-group">
        <label className="filter-label">Período</label>
        <div className="filter-buttons">
          {PERIODOS.map((periodo) => (
            <button
              key={periodo.label}
              className={`filter-btn ${filtros.dias === periodo.value ? 'active' : ''}`}
              onClick={() => onFiltroChange({ dias: periodo.value })}
            >
              {periodo.label}
            </button>
          ))}
        </div>
      </div>

      {/* Plataforma */}
      <div className="filter-group">
        <label className="filter-label">Plataforma</label>
        <div className="filter-buttons">
          {PLATAFORMAS.map((plataforma) => (
            <button
              key={plataforma}
              className={`filter-btn ${filtros.plataforma === plataforma ? 'active' : ''}`}
              onClick={() => onFiltroChange({ plataforma })}
            >
              {plataforma}
            </button>
          ))}
        </div>
      </div>

      {/* Tipo */}
      <div className="filter-group">
        <label className="filter-label">Tipo</label>
        <div className="filter-buttons">
          {TIPOS.map((tipo) => (
            <button
              key={tipo}
              className={`filter-btn ${filtros.tipo === tipo ? 'active' : ''}`}
              onClick={() => onFiltroChange({ tipo })}
            >
              {tipo}
            </button>
          ))}
        </div>
      </div>

      {/* Status */}
      <div className="filter-group">
        <label className="filter-label">Status</label>
        <div className="filter-buttons">
          {STATUS_LISTA.map((status) => (
            <button
              key={status}
              className={`filter-btn ${filtros.status === status ? 'active' : ''}`}
              onClick={() => onFiltroChange({ status })}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Busca textual */}
      <div className="filter-group">
        <button
          className="filter-toggle"
          onClick={onToggleBusca}
        >
          🔍 Busca
        </button>
        {buscaExpandida && (
          <input
            type="text"
            className="filter-search"
            placeholder="Buscar por título, empresa, localização..."
            value={filtros.busca}
            onChange={(e) => onFiltroChange({ busca: e.target.value })}
          />
        )}
      </div>

      {/* Toggle buttons */}
      <div className="filter-group filter-toggles">
        <button
          className={`filter-toggle-btn ${filtros.apenas_pra_mim ? 'active' : ''}`}
          onClick={() => onFiltroChange({ apenas_pra_mim: !filtros.apenas_pra_mim })}
        >
          🎯 Pra Mim
        </button>
        <button
          className={`filter-toggle-btn ${filtros.ignoradas ? 'active' : ''}`}
          onClick={() => onFiltroChange({ ignoradas: !filtros.ignoradas })}
        >
          🚫 Ignoradas
        </button>
      </div>

      {/* Sincronização */}
      <div className="filter-group">
        <button
          className="filter-btn-sync"
          onClick={onSincronizar}
          disabled={sincronizando}
        >
          {sincronizando ? '⏳ Sincronizando...' : '🔄 Sincronizar'}
        </button>
      </div>
    </div>
  );
}
