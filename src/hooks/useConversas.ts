import { useEffect, useState, useCallback } from 'react';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import useAuth from '../stores/useAuth';

export interface Conversa {
  uid: string;
  created_at: string;
  origem: 'Assistente' | 'Humano' | null;
  dispositivo: string | null;
  messageTimestamp: Date | null;
}

export interface ContagemPorOrigem {
  assistente: number;
  humano: number;
}

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

type DispositivoNormalizado = typeof DISPOSITIVO_NORMALIZADO[keyof typeof DISPOSITIVO_NORMALIZADO];

export const useConversas = () => {
  const { empresaUid } = useAuth();
  const [conversas, setConversas] = useState<Conversa[]>([]);
  const [contagem, setContagem] = useState<ContagemPorOrigem>({ assistente: 0, humano: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const normalizarDispositivo = (dispositivo: string | null): DispositivoNormalizado => {
    if (!dispositivo) return 'Desconhecido';
    const key = dispositivo.toLowerCase().trim() as keyof typeof DISPOSITIVO_NORMALIZADO;
    return DISPOSITIVO_NORMALIZADO[key] || 'Desconhecido';
  };

  const fetchConversas = useCallback(async () => {
    if (!empresaUid) {
      setLoading(false);
      return;
    }

    try {
      // Buscar apenas os últimos 30 dias de conversas
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: conversasData, error: conversasError } = await supabase
        .from('conex_conversas')
        .select('uid, created_at, dispositivo, origem')
        .eq('empresa', empresaUid)
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false });

      if (conversasError) throw conversasError;

      const contagemTemp = { assistente: 0, humano: 0 };
      
      const conversasNormalizadas = conversasData?.map(conversa => {
        // Contagem por origem
        if (conversa.origem === 'Assistente') {
          contagemTemp.assistente++;
        } else if (conversa.origem === 'Humano') {
          contagemTemp.humano++;
        }

        return {
          ...conversa,
          dispositivo: normalizarDispositivo(conversa.dispositivo),
          messageTimestamp: conversa.created_at ? new Date(conversa.created_at) : null
        };
      }) || [];

      setConversas(conversasNormalizadas);
      setContagem(contagemTemp);
      setError(null);
    } catch (err) {
      console.error('[useConversas] Error:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar conversas');
    } finally {
      setLoading(false);
    }
  }, [empresaUid]);

  useEffect(() => {
    fetchConversas();

    const channelName = `conversas-changes-${empresaUid}-${Date.now()}`;
    
    const subscription = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conex_conversas',
          filter: `empresa=eq.${empresaUid}`
        },
        (payload: RealtimePostgresChangesPayload<Conversa>) => {
          fetchConversas();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [empresaUid, fetchConversas]);

  return { conversas, contagem, loading, error };
}; 