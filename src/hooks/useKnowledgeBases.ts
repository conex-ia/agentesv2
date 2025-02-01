import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import useAuth from '../stores/useAuth';

export interface KnowledgeBase {
  uid: string;                    // uuid not null default gen_random_uuid()
  titular: string | null;         // uuid null
  created_at: string;            // timestamp with time zone not null default now()
  nome: string | null;           // text null
  treinamentos_qtd: number;      // numeric null default '0'::numeric
  treinamentos: string[] | null; // text[] null
  ativa: boolean;                // boolean null default true
  id: number | null;             // bigint null default nextval('conex_bases_t_id_seq'::regclass)
  treinamentosuid: string[] | null; // uuid[] null
  projeto: string | null;        // uuid null
  prompt: string | null;         // text null
  tipo: string | null;           // text null
}

export const useKnowledgeBases = () => {
  const { empresaUid, userUid } = useAuth();
  const [bases, setBases] = useState<KnowledgeBase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeletingBase, setIsDeletingBase] = useState<string | null>(null);

  const fetchBases = async () => {
    try {
      console.log('[useKnowledgeBases] Buscando bases de conhecimento...');
      const { data, error: fetchError } = await supabase
        .from('conex-bases_t')
        .select('*')
        .eq('titular', empresaUid)
        .eq('ativa', true)
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('[useKnowledgeBases] Erro ao buscar bases:', fetchError);
        throw fetchError;
      }

      console.log('[useKnowledgeBases] Bases encontradas:', data?.length || 0);
      setBases(data || []);
      setError(null); // Limpa qualquer erro anterior
    } catch (err) {
      console.error('[useKnowledgeBases] Erro ao buscar bases:', err);
      setError(err instanceof Error ? err.message : 'Erro ao buscar bases');
      setBases([]); // Limpa as bases em caso de erro
    } finally {
      setLoading(false);
    }
  };

  const deleteBase = async (baseUid: string) => {
    console.log('[useKnowledgeBases] Iniciando exclusão da base:', baseUid);
    setIsDeletingBase(baseUid);
    
    try {
      if (!empresaUid || !userUid) {
        throw new Error('Usuário não autenticado');
      }

      const body = {
        acao: 'excluirTabela',
        empresaUid,
        userUid,
        baseUid
      };

      console.log('[useKnowledgeBases] Enviando POST com body:', body);

      const response = await fetch('https://webhook.conexcondo.com.br/webhook/cod-gerenciartabela', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[useKnowledgeBases] Erro na resposta do webhook:', errorText);
        throw new Error(`Erro ao excluir base: ${response.statusText}. ${errorText}`);
      }

      const result = await response.json();
      console.log('[useKnowledgeBases] Resposta do webhook:', result);

      return { success: true, message: 'Base excluída com sucesso' };
    } catch (err) {
      console.error('[useKnowledgeBases] Erro ao excluir base:', err);
      return { 
        success: false, 
        message: err instanceof Error ? err.message : 'Erro ao excluir base' 
      };
    } finally {
      setIsDeletingBase(null);
    }
  };

  const addBase = async (nome: string, projetoUid: string) => {
    try {
      console.log('[useKnowledgeBases] Criando nova base:', { nome, projetoUid });
      
      if (!empresaUid || !userUid) {
        throw new Error('Usuário não autenticado');
      }

      const body = {
        acao: 'criarTabela',
        empresaUid,
        userUid,
        nome,
        projetoUid
      };

      console.log('[useKnowledgeBases] Enviando POST com body:', body);

      // Faz o POST para o webhook com a URL correta
      const response = await fetch('https://webhook.conexcondo.com.br/webhook/cod-gerenciartabela', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      });

      console.log('[useKnowledgeBases] Status da resposta:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[useKnowledgeBases] Erro na resposta:', errorText);
        throw new Error(`Erro ao criar base: ${response.statusText}. ${errorText}`);
      }

      const result = await response.json();
      console.log('[useKnowledgeBases] Base criada com sucesso:', result);
      
      // Atualiza a lista de bases
      await fetchBases();
      
      return result;
    } catch (err) {
      console.error('[useKnowledgeBases] Erro ao criar base:', err);
      throw err;
    }
  };

  const updateBasePrompt = async (baseUid: string, prompt: string, tipo: string) => {
    try {
      console.log('[useKnowledgeBases] Atualizando prompt e tipo da base:', baseUid);
      
      const { data, error } = await supabase
        .from('conex-bases_t')
        .update({ prompt, tipo })
        .eq('uid', baseUid)
        .select();

      if (error) {
        console.error('[useKnowledgeBases] Erro ao atualizar prompt e tipo:', error);
        throw error;
      }

      // Atualiza o estado local
      setBases(prevBases => 
        prevBases.map(base => 
          base.uid === baseUid ? { ...base, prompt, tipo } : base
        )
      );

      return { success: true, data };
    } catch (err) {
      console.error('[useKnowledgeBases] Erro ao atualizar prompt e tipo:', err);
      throw err;
    }
  };

  useEffect(() => {
    if (!empresaUid) {
      setLoading(false);
      return;
    }

    // Busca inicial
    fetchBases();

    // Cria um nome único para o canal usando timestamp
    const channelName = `public:conex-bases_t:${Date.now()}`;
    console.log('[useKnowledgeBases] Criando canal com nome único:', channelName);

    // Configura subscription do realtime
    const subscription = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',  // Escuta todos os eventos (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'conex-bases_t',
          filter: `titular=eq.${empresaUid}`
        },
        async (payload) => {
          console.log('[useKnowledgeBases] Evento realtime recebido:', payload);
          
          // Força um refetch para garantir dados consistentes
          await fetchBases();

          // Adiciona log adicional para debug
          console.log('[useKnowledgeBases] Lista atualizada após evento realtime');
        }
      )
      .subscribe((status) => {
        console.log('[useKnowledgeBases] Status da inscrição:', status);
        if (status === 'SUBSCRIBED') {
          console.log(`[useKnowledgeBases] Inscrito com sucesso no canal: ${channelName}`);
        }
      });

    // Cleanup
    return () => {
      console.log(`[useKnowledgeBases] Limpando inscrição do canal: ${channelName}`);
      subscription.unsubscribe();
    };
  }, [empresaUid]);

  return { 
    bases, 
    loading, 
    error,
    isDeletingBase,
    deleteBase,
    addBase,
    updateBasePrompt
  };
};
