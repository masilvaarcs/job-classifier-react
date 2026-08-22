// Utilitários de score de compatibilidade

import type { Vaga } from '../types';

/**
 * Calcula score de compatibilidade baseado no perfil do usuário
 * Backend (.NET/C#/ASP.NET) = 40 pts máximo
 * Frontend (Angular/TypeScript) = 20 pts máximo
 * Banco de dados (SQL Server/Oracle/PG) = 15 pts máximo
 * Python = 10 pts máximo
 * Remoto ou localização (Gravataí/POA/RS) = 15 pts máximo
 * Senioridade = 5 pts
 */
export function calcularScore(vaga: Vaga): number {
  let score = 0;
  const texto = `${vaga.titulo} ${vaga.descricao} ${vaga.empresa}`.toLowerCase();

  // Backend (.NET/C#/ASP.NET) = 40 pts
  if (/\b(c#|\.net|asp\.net|dotnet|web api|entity framework)\b/i.test(texto)) {
    score += 40;
  }

  // Frontend (Angular/TypeScript) = 20 pts
  if (/\b(angular|typescript|react|vue)\b/i.test(texto)) {
    score += 20;
  }

  // Banco de dados = 15 pts
  if (/\b(sql server|oracle|postgresql|mysql|postgres)\b/i.test(texto)) {
    score += 15;
  }

  // Python = 10 pts
  if (/\bpython|django|flask|fastapi\b/i.test(texto)) {
    score += 10;
  }

  // Remoto ou localização = 15 pts
  if (/remoto|remote|home office|teletrabalho/i.test(texto)) {
    score += 15;
  } else if (/\b(gravataí|porto alegre|poa|rs)\b/i.test(texto)) {
    score += 10;
  }

  // Senioridade = 5 pts
  if (/\b(sênior|senior|lead|pleno)\b/i.test(texto)) {
    score += 5;
  }

  return Math.min(score, 100);
}

/**
 * Retorna a classe CSS baseada no score
 */
export function getScoreClass(score: number): string {
  if (score >= 70) return 'score-alto';
  if (score >= 40) return 'score-medio';
  return 'score-baixo';
}

/**
 * Retorna o label do score
 */
export function getScoreLabel(score: number): string {
  if (score >= 70) return '🟢 ALTO';
  if (score >= 40) return '🟡 MÉDIO';
  return '⚪ BAIXO';
}

/**
 * Retorna a cor do badge de tipo de trabalho
 */
export function getTipoColor(tipo: string): string {
  switch (tipo) {
    case 'REMOTO': return '#22c55e';
    case 'HIBRIDO': return '#eab308';
    case 'PRESENCIAL': return '#f97316';
    default: return '#6b7280';
  }
}

/**
 * Retorna o emoji do tipo de trabalho
 */
export function getTipoEmoji(tipo: string): string {
  switch (tipo) {
    case 'REMOTO': return '🟢';
    case 'HIBRIDO': return '🟡';
    case 'PRESENCIAL': return '🟠';
    default: return '⚪';
  }
}
