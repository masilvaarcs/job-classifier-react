import { useState, useEffect } from 'react';
import type { Stats } from '../types';
import { buscarStats } from '../services/api';

export function useStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function carregar() {
      try {
        const data = await buscarStats();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar stats');
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, []);

  return { stats, loading, error };
}
