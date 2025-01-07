import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

import { Condominio } from '../pages/Dashboard/components/CondominiosGrid';

export const useCondominios = (empresaUid: string | null) => {
  const [condominios, setCondominios] = useState<Condominio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCondominios = async () => {
      if (!empresaUid) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('conex_condominios')
          .select('*')
          .eq('empresa', empresaUid);

        if (error) throw error;

        setCondominios(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCondominios();

    // Set up real-time subscription
    let subscription: ReturnType<typeof supabase.channel>;

    const setupSubscription = async () => {
      try {
        subscription = supabase
          .channel('conex-condominios-changes')
          .on('postgres_changes', 
            { 
              event: '*', 
              schema: 'public', 
              table: 'conex_condominios',
              filter: 'empresa=eq.' + empresaUid
            },
            (payload) => {
              console.log('Evento recebido:', payload.eventType, payload);
              fetchCondominios();
            }
          );

        await subscription.subscribe((status, err) => {
          if (err) {
            throw err;
          }
          if (status === 'SUBSCRIBED') {
            console.log('Subscribed to conex_condominios changes');
          }
        });
      } catch (err) {
        console.error('Subscription error:', err);
        setError('Failed to subscribe to condominios changes');
      }
    };

    setupSubscription();

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [empresaUid]);

  return { condominios, loading, error };
};
