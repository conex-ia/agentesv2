import { useEffect, useState } from 'react';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import useAuth from '../stores/useAuth';

export interface BotData {
  uid: string;
  bot_criado: string;
  bot_titular: string;
  bot_modificado: string | null;
  bot_nome: string | null;
  bot_token: string | null;
  bot_status: 'open' | 'close' | null;
  bot_url: string | null;
  bot_qrcode: string | null;
  bot_perfil: string | null;
  bot_numero: string | null;
  bot_pairing: string | null;
  bot_pesquisa: string | null;
  bot_looping: number | null;
  bot_ligado: boolean | null;
  bot_typebotId: string | null;
  bot_assistente: string | null;
  bot_resumo: string | null;
  bot_jid: string | null;
  bot_instanceId: string | null;
  bot_ativo: boolean | null;
  bot_base: string | null;
  bot_base_uid: string | null;
  bot_agente_nome: string | null;
  lgpd: boolean | null;
  saudacao: string | null;
  bot_exibir: boolean | null;
  projeto: string | null;
}

export const useBots = () => {
  const { empresaUid } = useAuth();
  const [bots, setBots] = useState<BotData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!empresaUid) {
      setLoading(false);
      return;
    }

    const fetchBotsData = async () => {
      try {
        console.log('[useBots] Fetching bots data...');
        const { data, error } = await supabase
          .from('conex-bots')
          .select('*')
          .eq('bot_titular', empresaUid)
          .eq('bot_exibir', true);

        if (error) throw error;
        console.log('[useBots] Bots data fetched:', data?.length || 0, 'bots');
        setBots(data || []);
      } catch (err) {
        console.error('[useBots] Error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBotsData();

    // Configurar subscription do realtime
    const channelName = `bots-changes-${empresaUid}-${Date.now()}`;
    console.log('[useBots] Setting up realtime channel:', channelName);

    const subscription = supabase
      .channel(channelName, {
        config: {
          broadcast: { self: true },
          presence: { key: channelName }
        }
      })
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conex-bots',
          filter: `bot_titular=eq.${empresaUid}`
        },
        async (payload) => {
          console.log('[useBots] Realtime event received:', payload);
          await fetchBotsData();
        }
      )
      .subscribe((status) => {
        console.log('[useBots] Realtime subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('[useBots] Successfully subscribed to bots changes');
        }
      });

    return () => {
      console.log('[useBots] Cleaning up subscription for channel:', channelName);
      subscription.unsubscribe();
    };
  }, [empresaUid]);

  return { bots, loading, error };
};