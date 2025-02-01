import { useEffect, useState } from 'react';
import useAuth from '../stores/useAuth';
import { supabase } from '../lib/supabase';
import type { TrainingData } from '../types/training';
import { useProjectNames } from './useProjectNames';

export function useTrainingData() {
  const [trainings, setTrainings] = useState<TrainingData[]>([]);
  const [loading, setLoading] = useState(true);
  const { empresaUid } = useAuth();

  useEffect(() => {
    if (!empresaUid) return;

    const fetchTrainings = async () => {
      try {
        console.log('[useTrainingData] Buscando treinamentos ativos...');
        const { data, error } = await supabase
          .from('conex-treinamentos')
          .select('*')
          .eq('titular', empresaUid)
          .eq('ativa', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        console.log('[useTrainingData] Treinamentos encontrados:', data?.length || 0);
        setTrainings(data || []);
      } catch (error) {
        console.error('[useTrainingData] Erro ao buscar treinamentos:', error);
      } finally {
        setLoading(false);
      }
    };

    // Busca inicial
    fetchTrainings();

    // Gera um timestamp único para o canal
    const channelId = `conex-treinamentos-${Date.now()}`;
    console.log('[useTrainingData] Configurando subscription do realtime no canal:', channelId);
    
    const subscription = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conex-treinamentos',
          filter: `titular=eq.${empresaUid}`
        },
        async (payload) => {
          console.log('[useTrainingData] Evento realtime recebido no canal', channelId, ':', payload);
          
          // Se for INSERT, adiciona o item se estiver ativo
          if (payload.eventType === 'INSERT' && payload.new.ativa === true) {
            console.log('[useTrainingData] Novo item ativo inserido');
            setTrainings(current => [payload.new, ...current]);
          }
          // Se for UPDATE e o item foi desativado
          else if (payload.eventType === 'UPDATE') {
            if (payload.new.ativa === false) {
              console.log('[useTrainingData] Item desativado, removendo da lista');
              setTrainings(current => current.filter(item => item.uid !== payload.new.uid));
            } else {
              console.log('[useTrainingData] Item atualizado, atualizando na lista');
              setTrainings(current => 
                current.map(item => 
                  item.uid === payload.new.uid ? payload.new : item
                )
              );
            }
          }
          // Se for DELETE
          else if (payload.eventType === 'DELETE') {
            console.log('[useTrainingData] Item deletado, removendo da lista');
            setTrainings(current => current.filter(item => item.uid !== payload.old.uid));
          }
        }
      )
      .subscribe();

    return () => {
      console.log('[useTrainingData] Limpando subscription do canal:', channelId);
      subscription.unsubscribe();
    };
  }, [empresaUid]);

  return { trainings, loading };
}

export type { TrainingData };
