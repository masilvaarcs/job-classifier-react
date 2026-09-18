import { createClient } from '@connectrpc/connect';
import { createGrpcWebTransport } from '@connectrpc/connect-web';
import { timestampDate } from '@bufbuild/protobuf/wkt';
import type { Timestamp } from '@bufbuild/protobuf/wkt';
import {
  VagaService,
  type Stats as StatsPb,
  type Vaga as VagaPb,
} from '../gen/job/v1/vagas_pb';
import type { Vaga, Stats, Plataforma, BuscaStatus, Filtros, PaginacaoResponse } from '../types';

// ============================================================
// Transporte: gRPC-Web via proxy do Vite.
// O Vite encaminha /dotnet -> http://127.0.0.1:8000 (serviço job-classifier-dotnet).
// ============================================================

const transport = createGrpcWebTransport({ baseUrl: '/dotnet' });
const client = createClient(VagaService, transport);

// ---------- Conversores proto -> tipos locais ----------

function iso(t: Timestamp | undefined): string {
  if (!t) return '';
  try {
    return timestampDate(t).toISOString();
  } catch {
    return '';
  }
}

function mapVaga(v: VagaPb): Vaga {
  return {
    id: Number(v.id),
    titulo: v.titulo,
    empresa: v.empresa,
    localizacao: v.localizacao,
    salario: v.salario,
    modalidade: v.modalidade,
    publicado: v.publicado,
    data_publicacao: iso(v.dataPublicacao),
    tipo_trabalho: v.tipoTrabalho as Vaga['tipo_trabalho'],
    descricao: v.descricao,
    link: v.link,
    job_id: v.jobId,
    plataforma: v.plataforma,
    data_coleta: iso(v.dataColeta),
    created_at: iso(v.createdAt),
    updated_at: iso(v.updatedAt),
    status_usuario: v.statusUsuario as Vaga['status_usuario'],
    ignorada: v.ignorada,
    pra_mim: v.praMim,
    score_compatibilidade: v.scoreCompatibilidade,
    data_verificacao: iso(v.dataVerificacao),
    ativa: v.ativa,
    notas: v.notas,
  };
}

function mapBigMap(m: Record<string, bigint>): Record<string, number> {
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(m)) out[k] = Number(v);
  return out;
}

function mapStats(s: StatsPb): Stats {
  return {
    total_vagas: Number(s.totalVagas),
    total_plataformas: s.totalPlataformas,
    vagas_por_plataforma: mapBigMap(s.vagasPorPlataforma),
    vagas_por_tipo: mapBigMap(s.vagasPorTipo),
    vagas_por_status: mapBigMap(s.vagasPorStatus),
    ultima_coleta: s.ultimaColeta || 'N/A',
  };
}

function toErrorMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'rawMessage' in err) {
    return String((err as { rawMessage?: string }).rawMessage || 'Erro na chamada RPC');
  }
  return err instanceof Error ? err.message : 'Erro desconhecido';
}

// === Vagas ===

export async function buscarVagas(filtros: Filtros): Promise<PaginacaoResponse> {
  try {
    const res = await client.listVagas({
      filtros: {
        dias: filtros.dias ?? 0,
        plataforma: filtros.plataforma === 'Todas' ? '' : filtros.plataforma,
        tipo: filtros.tipo === 'Todos' ? '' : filtros.tipo,
        status: filtros.status === 'Todos' ? '' : filtros.status,
        busca: filtros.busca,
        ignoradas: filtros.ignoradas,
        apenasPraMim: filtros.apenas_pra_mim,
        page: filtros.page,
        perPage: filtros.per_page,
      },
    });

    return {
      vagas: res.vagas.map(mapVaga),
      total: Number(res.paginacao?.total ?? 0),
      page: res.paginacao?.page ?? filtros.page,
      per_page: res.paginacao?.perPage ?? filtros.per_page,
      total_pages: res.paginacao?.totalPages ?? 1,
    };
  } catch (err) {
    throw new Error(toErrorMessage(err));
  }
}

export async function atualizarStatusVaga(
  id: number,
  updates: { status_usuario?: string; notas?: string; ignorada?: boolean; pra_mim?: boolean }
): Promise<Vaga> {
  const res = await client.updateVaga({
    id: BigInt(id),
    statusUsuario: updates.status_usuario,
    notas: updates.notas,
    ignorada: updates.ignorada,
    praMim: updates.pra_mim,
  });
  if (!res.vaga) throw new Error('Vaga não encontrada');
  return mapVaga(res.vaga);
}

export async function ignorarVaga(id: number): Promise<void> {
  await client.ignorarVaga({ id: BigInt(id) });
}

export async function restaurarVaga(id: number): Promise<void> {
  await client.restaurarVaga({ id: BigInt(id) });
}

export async function toggleFavoritar(id: number): Promise<Vaga> {
  const res = await client.toggleFavoritar({ id: BigInt(id) });
  if (!res.vaga) throw new Error('Vaga não encontrada');
  return mapVaga(res.vaga);
}

// === Stats ===

export async function buscarStats(): Promise<Stats> {
  const res = await client.getStats({});
  if (!res.stats) throw new Error('Stats vazias');
  return mapStats(res.stats);
}

// === Plataformas ===

export async function buscarPlataformas(): Promise<Plataforma[]> {
  const res = await client.listPlataformas({});
  return res.plataformas.map((p) => ({
    nome: p.nome,
    total: Number(p.total),
    ultima_coleta: p.ultimaColeta || 'N/A',
  }));
}

// === Busca (scraping) ===

export async function iniciarBuscaTodas(): Promise<void> {
  await client.startScraping({ plataforma: '' });
}

export async function iniciarBuscaPlataforma(plataforma: string): Promise<void> {
  await client.startScraping({ plataforma });
}

export async function statusBusca(): Promise<BuscaStatus> {
  const res = await client.getScrapingStatus({});
  const emExecucao = res.plataformas.filter((p) => p.status === 'em_andamento');
  const ultima = res.plataformas
    .map((p) => p.fim || p.inicio)
    .filter(Boolean)
    .sort()
    .pop();

  return {
    em_andamento: emExecucao.length > 0,
    plataformas_em_execucao: emExecucao.map((p) => p.plataforma),
    ultima_execucao: ultima ?? 'N/A',
  };
}

// === Importação ===

export interface VagaImportada {
  titulo: string;
  empresa: string;
  localizacao: string;
  salario: string;
  modalidade: string;
  publicado: string;
  dataPublicacao: string;
  tipoTrabalho: string;
  descricao: string;
  link: string;
  jobId: string;
  plataforma: string;
}

export async function importarDados(): Promise<{ importadas: number; atualizadas: number }> {
  // 1. Busca dados do Python (FastAPI) - todos os JSONs salvos
  const res = await fetch('/dados', { method: 'GET' });
  if (!res.ok) throw new Error('Falha ao buscar dados do Python');
  const { vagas } = await res.json();

  if (!vagas || vagas.length === 0) {
    return { importadas: 0, atualizadas: 0 };
  }

  // 2. Converte para formato do .NET ImportVagas
  const vagasImportadas: VagaImportada[] = vagas.map((v: any) => ({
    titulo: v.titulo || '',
    empresa: v.empresa || '',
    localizacao: v.localizacao || '',
    salario: v.salario || '',
    modalidade: v.modalidade || '',
    publicado: v.publicado || '',
    dataPublicacao: v.data_publicacao || '',
    tipoTrabalho: v.tipo_trabalho || 'NAO IDENTIFICADO',
    descricao: v.descricao || '',
    link: v.link || '',
    jobId: v.job_id || '',
    plataforma: v.plataforma || '',
  }));

  // 3. Chama .NET ImportVagas via gRPC
  const importRes = await client.importVagas({ vagas: vagasImportadas });
  return {
    importadas: importRes.importadas,
    atualizadas: importRes.atualizadas,
  };
}

export async function calcularScores(): Promise<void> {
  await client.recalcularScores({});
}

// === Download ===
// Exportação Excel segue no microserviço Python (HTTP) — fora do escopo RPC v1.

export async function downloadExcel(plataforma: string): Promise<Blob> {
  // Usa o proxy do Vite (mesma origem) para o FastAPI do Python
  const res = await fetch(`/exportar/${encodeURIComponent(plataforma)}`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error(`Falha ao exportar ${plataforma}`);
  return await res.blob();
}

export default client;
