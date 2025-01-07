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
}

export const useKnowledgeBases = () => {
  const { empresaUid } = useAuth();
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
      // Primeiro faz o soft delete da base (update ativa = false)
      const { error: updateError } = await supabase
        .from('conex-bases_t')
        .update({ ativa: false })
        .eq('uid', baseUid);

      if (updateError) {
        console.error('[useKnowledgeBases] Erro ao desativar base:', updateError);
        throw updateError;
      }

      // Aguarda 1 segundo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Depois faz o hard delete da base
      const { error: deleteError } = await supabase
        .from('conex-bases_t')
        .delete()
        .eq('uid', baseUid);

      if (deleteError) {
        console.error('[useKnowledgeBases] Erro ao excluir base:', deleteError);
        throw deleteError;
      }

      console.log('[useKnowledgeBases] Base excluída com sucesso:', baseUid);
      await fetchBases(); // Atualiza a lista após deletar
      return { success: true, message: 'Base excluída com sucesso' };
    } catch (err) {
      console.error('[useKnowledgeBases] Erro ao excluir base:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Erro ao excluir base' 
      };
    } finally {
      setIsDeletingBase(null);
    }
  };

  const addBase = async (nome: string, projetoUid: string) => {
    try {
      console.log('[useKnowledgeBases] Criando nova base:', { nome, projetoUid });
      const { data, error } = await supabase
        .from('conex-bases_t')
        .insert([
          {
            nome,
            projeto: projetoUid,
            titular: empresaUid,
            ativa: true
          }
        ]);

      if (error) throw error;

      console.log('[useKnowledgeBases] Base criada com sucesso, workflow iniciado');
      return 'Workflow started';
    } catch (err) {
      console.error('[useKnowledgeBases] Erro ao criar base:', err);
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
    addBase 
  };
};
