import { useEffect, useState } from 'react';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import useAuth from '../stores/useAuth';

export interface Conversa {
  uid: string;
  created_at: string;
  instancia: string | null;
  origem: string | null;
  mensagem: string | null;
  remote_jid: string | null;
  empresa: string | null;
  dispositivo: string | null;
  messageTimestamp: Date | null;
  messageType: string | null;
  fonte_tipo: string | null;
}

export interface ContagemPorOrigem {
  assistente: number;
  humano: number;
}

interface TotalPorDispositivo {
  dispositivo: string;
  origem: string;
  total: number;
}

// Mapa de normalização dos dispositivos
const DISPOSITIVO_NORMALIZADO = {
  'android': 'Android',
  'whatsapp android': 'Android',
  'desktop': 'WhatsApp Web',
  'whatsapp': 'WhatsApp Web',
  'whatsapp unknown': 'WhatsApp Web',
  'ios': 'iOS',
  'whatsapp web': 'WhatsApp Web',
  'typebot': 'Typebot',
  'unknown': 'Desconhecido',
  'web': 'WhatsApp Web'
} as const;

export const useConversas = () => {
  const { empresaUid } = useAuth();
  const [conversas, setConversas] = useState<Conversa[]>([]);
  const [contagem, setContagem] = useState<ContagemPorOrigem>({ assistente: 0, humano: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!empresaUid) {
      setLoading(false);
      return;
    }

    const fetchConversas = async () => {
      try {
        console.log('[useConversas] Fetching conversas data...');
        
        // Primeiro, vamos contar o total de registros
        const { count } = await supabase
          .from('conex_conversas')
          .select('*', { count: 'exact', head: true })
          .eq('empresa', empresaUid);

        console.log('[useConversas] Total de registros encontrados:', count);

        // Agora vamos buscar todos os registros usando range
        const { data: conversasData, error: conversasError } = await supabase
          .from('conex_conversas')
          .select('uid, created_at, dispositivo, origem')
          .eq('empresa', empresaUid)
          .range(0, count ? count - 1 : 1000);

        if (conversasError) throw conversasError;

        // Calcular contagens
        const contagemTemp = {
          assistente: 0,
          humano: 0
        };

        // Converter e contar em uma única passagem
        const conversasCompletas = (conversasData || []).map(conversa => {
          // Contar origem
          if (conversa.origem === 'Assistente') {
            contagemTemp.assistente++;
          } else if (conversa.origem === 'Humano') {
            contagemTemp.humano++;
          }

          // Normalizar dispositivo
          const dispositivo = (conversa.dispositivo || 'unknown').toLowerCase().trim();
          const dispositivoNormalizado = DISPOSITIVO_NORMALIZADO[dispositivo as keyof typeof DISPOSITIVO_NORMALIZADO] || 'Desconhecido';

          // Retornar objeto completo
          return {
            ...conversa,
            dispositivo: dispositivoNormalizado,
            instancia: null,
            mensagem: null,
            remote_jid: null,
            empresa: empresaUid,
            messageTimestamp: null,
            messageType: null,
            fonte_tipo: null
          };
        });

        console.log('[useConversas] Total de registros retornados:', conversasData?.length);
        console.log('[useConversas] Contagem por origem:', contagemTemp);

        setConversas(conversasCompletas);
        setContagem(contagemTemp);
      } catch (err) {
        console.error('[useConversas] Error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchConversas();

    // Configurar subscription do realtime
    const channelName = `conversas-changes-${empresaUid}-${Date.now()}`;
    console.log('[useConversas] Setting up realtime channel:', channelName);

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
          table: 'conex_conversas',
          filter: `empresa=eq.${empresaUid}`
        },
        async (payload: RealtimePostgresChangesPayload<Conversa>) => {
          console.log('[useConversas] Realtime event received:', payload);
          await fetchConversas();
        }
      )
      .subscribe((status) => {
        console.log('[useConversas] Realtime subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('[useConversas] Successfully subscribed to conversas changes');
        }
      });

    return () => {
      console.log('[useConversas] Cleaning up subscription for channel:', channelName);
      subscription.unsubscribe();
    };
  }, [empresaUid]);

  return { conversas, contagem, loading, error };
}; 