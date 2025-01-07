import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import useAuth from '../stores/useAuth';

export interface Assistant {
  uid: string;
  created_at: string;
  nome: string;
  descricao: string;
  status: string;
  modelo: string;
  titular: string;
}

export const useAssistants = () => {
  const { empresaUid } = useAuth();
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!empresaUid) {
      setLoading(false);
      return;
    }

    const fetchAssistants = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('conex-assistants_t')
          .select('*')
          .eq('titular', empresaUid)
          .eq('status', 'open')
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;
        setAssistants(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching assistants:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssistants();

    // Configuração do realtime
    const channelName = `assistants-changes-${empresaUid}-${Date.now()}`;
    
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'conex-assistants_t',
          filter: `titular=eq.${empresaUid}`,
        },
        (payload) => {
          console.log('INSERT event received:', payload);
          fetchAssistants();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'conex-assistants_t',
          filter: `titular=eq.${empresaUid}`,
        },
        (payload) => {
          console.log('UPDATE event received:', payload);
          fetchAssistants();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'conex-assistants_t',
          filter: `titular=eq.${empresaUid}`,
        },
        (payload) => {
          console.log('DELETE event received:', payload);
          fetchAssistants();
        }
      );

    channel
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to assistants changes');
        } else if (status === 'CLOSED') {
          console.log('Channel closed, attempting to reconnect...');
          await channel.subscribe();
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Channel error occurred');
          await channel.subscribe();
        }
      });

    return () => {
      console.log('Unsubscribing from channel:', channelName);
      channel.unsubscribe();
    };
  }, [empresaUid]);

  return { assistants, loading, error };
};
