import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export interface Projeto {
  uid: string;
  nome: string;
  empresa: string;
  bases?: string[];
  ativo: boolean;
  created_at: string;
}

export const useProjetos = (empresaUid: string | null) => {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjetos = async () => {
      if (!empresaUid) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('conex_projetos')
          .select('uid, nome, empresa, bases, ativo, created_at')
          .eq('empresa', empresaUid)
          .eq('ativo', true);

        if (error) throw error;

        setProjetos(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProjetos();

    // Set up real-time subscription
    const subscription = supabase
      .channel('public:conex_projetos')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conex_projetos',
          filter: `empresa=eq.${empresaUid}`
        },
        async (payload) => {
          console.log('Realtime event received:', payload);
          await fetchProjetos();
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
      });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [empresaUid]);

  return { projetos, loading, error };
};
