import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useProjectNames(projectIds: (string | null)[]) {
  const [projectNames, setProjectNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const fetchProjectNames = async () => {
    // Filtra os IDs nulos e duplicados
    const validProjectIds = [...new Set(projectIds.filter((id): id is string => id !== null))];
    
    if (validProjectIds.length === 0) {
      console.log('[useProjectNames] Nenhum ID válido para buscar');
      setProjectNames({});
      setLoading(false);
      return;
    }

    try {
      console.log('[useProjectNames] Buscando nomes para projetos:', validProjectIds);
      
      const { data, error } = await supabase
        .from('conex_projetos')
        .select('uid, nome')
        .in('uid', validProjectIds);

      if (error) {
        console.error('[useProjectNames] Erro na query:', error);
        throw error;
      }

      console.log('[useProjectNames] Dados retornados:', data);

      if (!data || data.length === 0) {
        console.log('[useProjectNames] Nenhum projeto encontrado para os IDs:', validProjectIds);
        setProjectNames({});
        setLoading(false);
        return;
      }

      const namesMap = data.reduce((acc, project) => {
        if (!project.uid || !project.nome) {
          console.log('[useProjectNames] Projeto inválido:', project);
          return acc;
        }
        return {
          ...acc,
          [project.uid]: project.nome
        };
      }, {} as Record<string, string>);

      console.log('[useProjectNames] Mapa de nomes construído:', namesMap);
      setProjectNames(namesMap);
    } catch (error) {
      console.error('[useProjectNames] Erro ao buscar nomes dos projetos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Busca inicial
    fetchProjectNames();

    // Filtra IDs válidos
    const validProjectIds = [...new Set(projectIds.filter((id): id is string => id !== null))];
    
    if (validProjectIds.length === 0) return;

    // Cria um nome único para o canal
    const timestamp = Date.now();
    const channelName = `project-names-${timestamp}`;

    console.log('[useProjectNames] Configurando realtime:', {
      canal: channelName,
      projetos: validProjectIds
    });

    // Configura subscription para mudanças nos projetos
    const channel = supabase.channel(channelName);

    channel
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conex_projetos',
          filter: `uid=in.(${validProjectIds.map(id => `'${id}'`).join(',')})`
        },
        (payload) => {
          console.log('[useProjectNames] Mudança detectada:', {
            canal: channelName,
            evento: payload.eventType,
            dados: payload.new
          });
          
          // Atualiza os nomes
          fetchProjectNames();
        }
      )
      .subscribe((status) => {
        console.log('[useProjectNames] Status da subscription:', {
          canal: channelName,
          status
        });
      });

    return () => {
      console.log('[useProjectNames] Limpando subscription:', channelName);
      channel.unsubscribe();
    };
  }, [projectIds]);

  return { projectNames, loading };
}