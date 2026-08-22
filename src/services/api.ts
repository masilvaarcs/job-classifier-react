import axios from 'axios';
import type { Vaga, Stats, Plataforma, BuscaStatus, Filtros, PaginacaoResponse } from '../types';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
);

// === Vagas ===

export async function buscarVagas(filtros: Filtros): Promise<PaginacaoResponse> {
  const params: Record<string, string | number | boolean> = {};
  
  if (filtros.dias !== null && filtros.dias > 0) params.dias = filtros.dias;
  if (filtros.plataforma && filtros.plataforma !== 'Todas') params.plataforma = filtros.plataforma;
  if (filtros.tipo && filtros.tipo !== 'Todos') params.tipo = filtros.tipo;
  if (filtros.status && filtros.status !== 'Todos') params.status = filtros.status;
  if (filtros.busca) params.busca = filtros.busca;
  if (filtros.ignoradas) params.ignoradas = true;
  if (filtros.apenas_pra_mim) params.apenas_pra_mim = true;
  params.page = filtros.page;
  params.per_page = filtros.per_page;

  const { data } = await api.get<PaginacaoResponse>('/vagas', { params });
  return data;
}

export async function atualizarStatusVaga(
  id: number,
  updates: { status_usuario?: string; notas?: string; ignorada?: boolean; pra_mim?: boolean }
): Promise<Vaga> {
  const { data } = await api.put<Vaga>(`/vagas/${id}/status`, updates);
  return data;
}

export async function ignorarVaga(id: number): Promise<void> {
  await api.post(`/vagas/${id}/ignorar`);
}

export async function restaurarVaga(id: number): Promise<void> {
  await api.post(`/vagas/${id}/restaurar`);
}

export async function toggleFavoritar(id: number): Promise<Vaga> {
  const { data } = await api.post<Vaga>(`/vagas/${id}/favoritar`);
  return data;
}

// === Stats ===

export async function buscarStats(): Promise<Stats> {
  const { data } = await api.get<Stats>('/stats');
  return data;
}

// === Plataformas ===

export async function buscarPlataformas(): Promise<Plataforma[]> {
  const { data } = await api.get<Plataforma[]>('/plataformas');
  return data;
}

// === Busca ===

export async function iniciarBuscaTodas(): Promise<void> {
  await api.post('/buscar/todas');
}

export async function iniciarBuscaPlataforma(plataforma: string): Promise<void> {
  await api.post(`/buscar/${plataforma}`);
}

export async function statusBusca(): Promise<BuscaStatus> {
  const { data } = await api.get<BuscaStatus>('/status');
  return data;
}

// === Importação ===

export async function importarDados(): Promise<void> {
  await api.post('/importar');
}

export async function calcularScores(): Promise<void> {
  await api.post('/calcular-scores');
}

// === Download ===

export async function downloadExcel(plataforma: string): Promise<Blob> {
  const { data } = await api.get(`/download/${plataforma}`, {
    responseType: 'blob',
  });
  return data;
}

export default api;
