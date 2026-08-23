import { useState, useEffect, useCallback } from 'react';
import type { Vaga, Filtros, PaginacaoResponse } from '../types';
import { buscarVagas } from '../services/api';

const FILTROS_PADRAO: Filtros = {
  dias: 5,
  plataforma: 'Todas',
  tipo: 'Todos',
  status: 'Todos',
  busca: '',
  ignoradas: false,
  apenas_pra_mim: false,
  page: 1,
  per_page: 20,
};

export function useJobs() {
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filtros, setFiltros] = useState<Filtros>(FILTROS_PADRAO);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const carregarVagas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response: PaginacaoResponse = await buscarVagas(filtros);
      setVagas(response.vagas);
      setTotal(response.total);
      // Adaptar ao formato da API (original ou nova)
      setTotalPages(response.total_pages ?? response.totalPaginas ?? 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar vagas');
      // Fallback: tentar carregar JSON offline
      try {
        const fallbackResponse = await fetch('/data/vagas_fallback.json');
        if (fallbackResponse.ok) {
          const data = await fallbackResponse.json();
          setVagas(data.vagas || []);
          setTotal(data.vagas?.length || 0);
        }
      } catch {
        // Se fallback também falhar, mantém estado de erro
      }
    } finally {
      setLoading(false);
    }
  }, [filtros]);

  useEffect(() => {
    carregarVagas();
  }, [carregarVagas]);

  const atualizarFiltros = (novosFiltros: Partial<Filtros>) => {
    setFiltros((prev) => ({
      ...prev,
      ...novosFiltros,
      page: novosFiltros.page ?? 1, // Reset page ao mudar filtros
    }));
  };

  const irParaPagina = (page: number) => {
    setFiltros((prev) => ({ ...prev, page }));
  };

  return {
    vagas,
    total,
    totalPages,
    filtros,
    loading,
    error,
    atualizarFiltros,
    irParaPagina,
    recarregar: carregarVagas,
  };
}
