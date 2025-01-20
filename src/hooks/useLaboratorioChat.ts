import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import useAuth from '../stores/useAuth';
import { useKnowledgeBase } from '../contexts/KnowledgeBaseContext';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

export interface ChatMessage {
  uid: string;
  created_at: string;
  empresa: string | null;
  tabela: string | null;
  remetente: string | null;
  mensagem: string | null;
}

export const useLaboratorioChat = () => {
  const { empresaUid } = useAuth();
  const { selectedKnowledgeBase } = useKnowledgeBase();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const fetchMessages = async () => {
    try {
      if (!selectedKnowledgeBase || selectedKnowledgeBase === 'all') {
        setMessages([]);
        setError(null);
        return;
      }

      console.log('[useLaboratorioChat] Buscando mensagens...');
      const { data, error: fetchError } = await supabase
        .from('conex_laboratorio')
        .select('*')
        .eq('empresa', empresaUid)
        .eq('tabela', selectedKnowledgeBase)
        .order('created_at', { ascending: true });

      if (fetchError) {
        console.error('[useLaboratorioChat] Erro ao buscar mensagens:', fetchError);
        throw fetchError;
      }

      console.log('[useLaboratorioChat] Mensagens encontradas:', data?.length || 0);
      setMessages(data || []);
      setError(null);
    } catch (err) {
      console.error('[useLaboratorioChat] Erro ao buscar mensagens:', err);
      setError(err instanceof Error ? err.message : 'Erro ao buscar mensagens');
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRealtimeChange = (payload: RealtimePostgresChangesPayload<ChatMessage>) => {
    console.log('[useLaboratorioChat] Evento realtime recebido:', payload);
    console.log('[useLaboratorioChat] Tipo do evento:', payload.eventType);
    console.log('[useLaboratorioChat] Nova mensagem:', payload.new);
    console.log('[useLaboratorioChat] Estado atual:', { empresaUid, selectedKnowledgeBase });
    
    if (payload.eventType === 'INSERT') {
      const newMessage = payload.new as ChatMessage;
      console.log('[useLaboratorioChat] Verificando filtros:', {
        empresaMatch: newMessage.empresa === empresaUid,
        tabelaMatch: newMessage.tabela === selectedKnowledgeBase
      });

      if (newMessage.empresa === empresaUid && newMessage.tabela === selectedKnowledgeBase) {
        setMessages(prev => {
          const updated = [...prev, newMessage];
          console.log('[useLaboratorioChat] Estado atualizado:', updated);
          if (newMessage.remetente === 'Assistente') {
            setSending(false); // Desativa o sending quando recebe resposta do assistente
          }
          return updated;
        });
      }
    }
  };

  const sendMessage = async (message: string, remetente: string) => {
    setSending(true);
    try {
      console.log('[useLaboratorioChat] Enviando mensagem:', { message, remetente });
      
      if (!empresaUid || !selectedKnowledgeBase || selectedKnowledgeBase === 'all') {
        throw new Error('Dados necessários não disponíveis');
      }

      const response = await fetch('https://webhook.conexcondo.com.br/webhook/chat_laboratorio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          empresaUid,
          baseUid: selectedKnowledgeBase,
          mensagem: message,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar mensagem para o webhook');
      }

      console.log('[useLaboratorioChat] Mensagem enviada com sucesso para o webhook');
      
    } catch (err) {
      console.error('[useLaboratorioChat] Erro ao enviar mensagem:', err);
      setSending(false); // Só desativa o sending em caso de erro
      throw err;
    }
  };

  useEffect(() => {
    if (!empresaUid) {
      setLoading(false);
      return;
    }

    if (!selectedKnowledgeBase || selectedKnowledgeBase === 'all') {
      setMessages([]);
      setLoading(false);
      return;
    }

    fetchMessages();

    const channel = supabase.channel('chat-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'conex_laboratorio',
        },
        handleRealtimeChange
      )
      .subscribe((status, err) => {
        console.log('[useLaboratorioChat] Status da inscrição:', status);
        if (err) {
          console.error('[useLaboratorioChat] Erro na inscrição:', err);
        }
      });

    return () => {
      console.log('[useLaboratorioChat] Limpando inscrição do canal');
      channel.unsubscribe();
    };
  }, [empresaUid, selectedKnowledgeBase]);

  return {
    messages,
    loading,
    error,
    sending,
    sendMessage
  };
};

export default useLaboratorioChat;
