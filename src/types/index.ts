// Tipos e interfaces do Job Classifier

export interface Vaga {
  id: number;
  titulo: string;
  empresa: string;
  localizacao: string;
  salario: string;
  modalidade: string;
  publicado: string;
  data_publicacao: string;
  tipo_trabalho: 'REMOTO' | 'HIBRIDO' | 'PRESENCIAL' | 'NAO IDENTIFICADO';
  descricao: string;
  link: string;
  job_id: string;
  plataforma: string;
  data_coleta: string;
  created_at: string;
  updated_at: string;
  status_usuario: 'pendente' | 'candidatado' | 'entrevista' | 'rejeitado' | 'contratado';
  ignorada: boolean;
  pra_mim: boolean;
  score_compatibilidade: number;
  data_verificacao: string;
  ativa: boolean;
  notas: string;
}

export interface Stats {
  total_vagas: number;
  total_plataformas: number;
  vagas_por_plataforma: Record<string, number>;
  vagas_por_tipo: Record<string, number>;
  vagas_por_status: Record<string, number>;
  ultima_coleta: string;
}

export interface Plataforma {
  nome: string;
  total: number;
  ultima_coleta: string;
}

export interface BuscaStatus {
  em_andamento: boolean;
  plataformas_em_execucao: string[];
  ultima_execucao: string;
}

export interface Filtros {
  dias: number | null;
  plataforma: string;
  tipo: string;
  status: string;
  busca: string;
  ignoradas: boolean;
  apenas_pra_mim: boolean;
  page: number;
  per_page: number;
}

export interface PaginacaoResponse {
  vagas: Vaga[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}
