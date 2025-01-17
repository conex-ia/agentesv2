import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export interface ProjetoOption {
  uid: string;
  nome: string;
}

export const useProjetosSelect = (empresaUid: string | null) => {
  const [projetos, setProjetos] = useState<ProjetoOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjetos = async () => {
      if (!empresaUid) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('conex_projetos')
          .select('uid, nome')
          .eq('empresa', empresaUid)
          .eq('ativo', true);

        if (error) throw error;

        setProjetos(data || []);
      } catch (err) {
        console.error('Erro ao carregar projetos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjetos();

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
        () => {
          fetchProjetos();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [empresaUid]);

  return { projetos, loading };
}; 