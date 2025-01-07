import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export const useKnowledgeBaseNames = (baseIds: string[] | undefined) => {
  const [baseNames, setBaseNames] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBaseNames = async () => {
      if (!baseIds || baseIds.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('conex-bases_t')
          .select('uid, nome')
          .in('uid', baseIds);

        if (error) throw error;

        const namesMap = (data || []).reduce((acc, base) => ({
          ...acc,
          [base.uid]: base.nome
        }), {});

        setBaseNames(namesMap);
      } catch (err) {
        console.error('Erro ao buscar nomes das bases:', err);
        setError(err instanceof Error ? err.message : 'Erro ao buscar nomes das bases');
      } finally {
        setLoading(false);
      }
    };

    fetchBaseNames();
  }, [baseIds]);

  return { baseNames, loading, error };
};
