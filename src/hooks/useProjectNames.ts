import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useProjectNames(projectIds: (string | null)[]) {
  const [projectNames, setProjectNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectNames = async () => {
      // Filtra os IDs nulos e duplicados
      const validProjectIds = [...new Set(projectIds.filter((id): id is string => id !== null))];
      
      if (validProjectIds.length === 0) {
        setProjectNames({});
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('conex_projetos')
          .select('uid, nome')
          .in('uid', validProjectIds)
          .eq('ativo', true);

        if (error) throw error;

        const namesMap = (data || []).reduce((acc, project) => ({
          ...acc,
          [project.uid]: project.nome
        }), {});

        setProjectNames(namesMap);
      } catch (error) {
        console.error('Erro ao buscar nomes dos projetos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectNames();
  }, [projectIds]);

  return { projectNames, loading };
} 