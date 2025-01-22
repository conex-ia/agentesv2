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
          .eq('ativo', true)
          .order('nome');

        if (error) {
          console.error('Error fetching projetos:', error);
          return;
        }

        setProjetos(data || []);
      } catch (error) {
        console.error('Error fetching projetos:', error);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    fetchProjetos();
  }, [empresaUid]);

  return { projetos, loading };
};

export default useProjetosSelect;