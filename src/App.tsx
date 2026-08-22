import { Header } from './components/Header/Header';
import { StatsBar } from './components/StatsBar/StatsBar';
import { Filters } from './components/Filters/Filters';
import { JobList } from './components/JobList/JobList';
import { Pagination } from './components/Pagination/Pagination';
import { useJobs } from './hooks/useJobs';
import { useStats } from './hooks/useStats';
import { useFilters } from './hooks/useFilters';
import { atualizarStatusVaga, ignorarVaga, restaurarVaga, toggleFavoritar } from './services/api';
import './App.css';

function App() {
  const {
    vagas,
    total,
    totalPages,
    loading,
    error,
    atualizarFiltros,
    irParaPagina,
    recarregar,
  } = useJobs();

  const { stats, loading: statsLoading } = useStats();
  const { filtros, buscaExpandida, setBuscaExpandida, atualizar } = useFilters();

  const handleFiltroChange = (novosFiltros: Parameters<typeof atualizar>[0]) => {
    atualizar(novosFiltros);
    atualizarFiltros(novosFiltros);
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await atualizarStatusVaga(id, { status_usuario: status });
      recarregar();
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
    }
  };

  const handleIgnorar = async (id: number) => {
    try {
      await ignorarVaga(id);
      recarregar();
    } catch (err) {
      console.error('Erro ao ignorar vaga:', err);
    }
  };

  const handleRestaurar = async (id: number) => {
    try {
      await restaurarVaga(id);
      recarregar();
    } catch (err) {
      console.error('Erro ao restaurar vaga:', err);
    }
  };

  const handleFavoritar = async (id: number) => {
    try {
      await toggleFavoritar(id);
      recarregar();
    } catch (err) {
      console.error('Erro ao favoritar vaga:', err);
    }
  };

  return (
    <div className="app">
      <Header />
      <StatsBar stats={stats} loading={statsLoading} />
      <main className="main-content">
        <Filters
          filtros={filtros}
          onFiltroChange={handleFiltroChange}
          buscaExpandida={buscaExpandida}
          onToggleBusca={() => setBuscaExpandida(!buscaExpandida)}
        />
        <JobList
          vagas={vagas}
          loading={loading}
          error={error}
          onStatusChange={handleStatusChange}
          onIgnorar={handleIgnorar}
          onRestaurar={handleRestaurar}
          onFavoritar={handleFavoritar}
        />
        <Pagination
          currentPage={filtros.page}
          totalPages={totalPages}
          total={total}
          onPageChange={irParaPagina}
        />
      </main>
    </div>
  );
}

export default App;
