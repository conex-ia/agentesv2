import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import useAuth from '../stores/useAuth';

export interface BotData {
  uid: string;
  bot_nome: string;
  bot_numero: string | null;
  bot_status: 'open' | 'close';
  bot_ativo: boolean;
  bot_base: string | null;
  bot_titular: string;
  bot_exibir: boolean;
  bot_perfil?: string;
  bot_criado: string;
  bot_modificado: string | null;
}

interface UpdateBotData {
  base_id?: string;
  status?: 'connected' | 'disconnected';
  bot_base?: string | null;
}

const TABLE_NAME = 'conex-bots';

export const useBots = () => {
  const { userUid, empresaUid } = useAuth();
  const [bots, setBots] = useState<BotData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const fetchBots = async () => {
    if (!empresaUid) {
      console.log('No empresaUid available, skipping fetch');
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching bots for empresa:', empresaUid);
      
      // Primeiro, vamos fazer uma query sem filtros para ver todos os bots
      const allBotsQuery = await supabase
        .from(TABLE_NAME)
        .select('*');
      
      console.log('All bots in table:', allBotsQuery.data?.length || 0);
      
      // Agora a query com os filtros
        const { data, error } = await supabase
        .from(TABLE_NAME)
          .select('*')
          .eq('bot_titular', empresaUid)
          .eq('bot_exibir', true);

      if (error) {
        console.error('Error details:', error);
        throw error;
      }
      
      console.log('Bots query result:', {
        total: data?.length || 0,
        empresaUid,
        firstBot: data?.[0],
        allBots: data
      });
      
        setBots(data || []);
      } catch (err) {
      console.error('Error fetching bots:', err);
      setError('Erro ao carregar os bots');
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    if (!empresaUid) {
      console.log('No empresaUid available, skipping subscription');
      return;
    }

    console.log('Setting up bots subscription for empresa:', empresaUid);
    const channel = supabase.channel(`bots-changes-${empresaUid}`);

    channel
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: TABLE_NAME,
          filter: `bot_titular=eq.${empresaUid}`
        },
        (payload) => {
          console.log('Bots change received:', payload);
          fetchBots();
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
        if (status === 'SUBSCRIBED') {
          setIsSubscribed(true);
          fetchBots();
        }
      });

    return () => {
      console.log('Cleaning up subscription');
      channel.unsubscribe();
      setIsSubscribed(false);
    };
  }, [empresaUid]);

  const addBot = async (name: string) => {
    if (!userUid) {
      setError('Usuário não autenticado');
      return;
    }

    try {
      const response = await fetch('https://webhook.conexcondo.com.br/webhook/gerenciar-assistente', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          acao: 'criarAssistente',
          nome: name,
          userId: userUid
        }),
      });

      const data = await response.json();
      
      if (!response.ok || data.status !== 'criado') {
        throw new Error('Erro ao adicionar bot');
      }

      console.log('Bot criado com sucesso:', data);
    } catch (err) {
      console.error('Error adding bot:', err);
      setError('Erro ao adicionar bot');
    }
  };

  const updateBot = async (botId: string, data: UpdateBotData) => {
    try {
      console.log('Updating bot:', botId, data);
      const updateData: Partial<BotData> = {};
      
      if (data.base_id !== undefined) {
        updateData.bot_base = data.base_id;
      }
      
      if (data.status !== undefined) {
        updateData.bot_status = data.status === 'connected' ? 'open' : 'close';
      }

      const { error } = await supabase
        .from(TABLE_NAME)
        .update(updateData)
        .eq('uid', botId);

      if (error) throw error;
    } catch (err) {
      console.error('Error updating bot:', err);
      setError('Erro ao atualizar bot');
    }
  };

  const deleteBot = async (botId: string) => {
    try {
      console.log('Deleting bot:', botId);
      const { error } = await supabase
        .from(TABLE_NAME)
        .update({ bot_exibir: false })
        .eq('uid', botId);

      if (error) throw error;
    } catch (err) {
      console.error('Error deleting bot:', err);
      setError('Erro ao excluir bot');
    }
  };

  return {
    bots,
    loading,
    error,
    addBot,
    updateBot,
    deleteBot,
    isSubscribed
  };
};