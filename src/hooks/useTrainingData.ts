import { useEffect, useState } from 'react';
import useAuth from '../stores/useAuth';
import { supabase } from '../lib/supabase';
import type { TrainingData } from '../pages/Dashboard/components/Training/types';

export function useTrainingData() {
  const [trainings, setTrainings] = useState<TrainingData[]>([]);
  const [loading, setLoading] = useState(true);
  const { empresaUid } = useAuth();

  useEffect(() => {
    if (!empresaUid) return;

    const fetchTrainings = async () => {
      try {
        console.log('Buscando treinamentos para empresa:', empresaUid);
        const { data, error } = await supabase
          .from('conex-treinamentos')
          .select('*')
          .eq('titular', empresaUid)
          .eq('ativa', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        console.log('Treinamentos encontrados:', data?.length || 0);
        setTrainings(data || []);
      } catch (error) {
        console.error('Error fetching trainings:', error);
      } finally {
        setLoading(false);
      }
    };

    // Busca inicial
    fetchTrainings();

    // Configura subscription do realtime
    const subscription = supabase
      .channel('public:conex-treinamentos')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conex-treinamentos',
          filter: `titular=eq.${empresaUid}`
        },
        async (payload) => {
          console.log('Realtime event received:', payload);
          await fetchTrainings();
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
      });

    // Cleanup
    return () => {
      subscription.unsubscribe();
    };
  }, [empresaUid]);

  return { trainings, loading };
}
