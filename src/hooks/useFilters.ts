import { useState } from 'react';
import type { Filtros } from '../types';

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

export function useFilters() {
  const [filtros, setFiltros] = useState<Filtros>(FILTROS_PADRAO);
  const [buscaExpandida, setBuscaExpandida] = useState(false);

  const atualizar = (novosFiltros: Partial<Filtros>) => {
    setFiltros((prev) => ({
      ...prev,
      ...novosFiltros,
      page: novosFiltros.page ?? 1,
    }));
  };

  const resetar = () => {
    setFiltros(FILTROS_PADRAO);
  };

  const toggleIgnoradas = () => {
    atualizar({ ignoradas: !filtros.ignoradas });
  };

  const togglePraMim = () => {
    atualizar({ apenas_pra_mim: !filtros.apenas_pra_mim });
  };

  return {
    filtros,
    buscaExpandida,
    setBuscaExpandida,
    atualizar,
    resetar,
    toggleIgnoradas,
    togglePraMim,
  };
}
