import React, { useState, useMemo } from 'react';
import { useBots, BotData } from '../../hooks/useBots';
import { useKnowledgeBases } from '../../hooks/useKnowledgeBases';
import { useProjetosSelect } from '../../hooks/useProjetosSelect';
import { StatsCards } from './components/StatsCards';
import AssistantesHeader from './components/AssistantesHeader';
import AssistantGrid from './components/AssistantGrid';
import useAuth from '../../stores/useAuth';
import { useProject } from '../../contexts/ProjectContext';
import SyncAssistantModal from '../../pages/Dashboard/components/SyncAssistantModal';
import AssistantDetailsModal from '../../pages/Dashboard/components/AssistantDetailsModal';
import WelcomeHeader from '../Dashboard/components/WelcomeHeader';

const WhatsApp = () => {
  const [viewType, setViewType] = useState<'grid' | 'table'>(() => {
    const savedViewType = localStorage.getItem('whatsappViewType');
    return (savedViewType as 'grid' | 'table') || 'table';
  });
  const [syncModalOpen, setSyncModalOpen] = useState(false);
  const [selectedBot, setSelectedBot] = useState<BotData | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const { userUid, empresaUid } = useAuth();
  const { bots, loading, isSubscribed, addBot, updateBot, deleteBot } = useBots();
  const { bases } = useKnowledgeBases();
  const { projetos, loading: loadingProjetos } = useProjetosSelect(empresaUid);
  const { selectedProject } = useProject();

  const filteredBots = useMemo(() => {
    if (selectedProject === 'all') {
      return bots;
    }
    return bots.filter(bot => bot.projeto === selectedProject);
  }, [bots, selectedProject]);

  const stats = useMemo(() => {
    return {
      total: filteredBots.length,
      online: filteredBots.filter((bot) => bot.bot_status === 'open').length,
      offline: filteredBots.filter((bot) => bot.bot_status !== 'open').length,
      active: filteredBots.filter((bot) => bot.bot_ativo).length,
    };
  }, [filteredBots]);

  const handleAddAssistant = async (name: string) => {
    await addBot(name);
  };

  const handleBaseChange = async (botUid: string, baseUid: string) => {
    try {
      const response = await fetch('https://webhook.conexcondo.com.br/webhook/baseAssistente', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          acao: baseUid ? 'vincularBase' : 'desvincularBase',
          assistenteUid: botUid,
          baseUid: baseUid,
          userId: userUid
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error('Erro ao atualizar base');
      }

      const updatedBot = bots.find(bot => bot.uid === botUid);
      if (updatedBot) {
        updateBot(botUid, { bot_base: baseUid });
      }

      console.log('Base atualizada com sucesso:', data);
    } catch (error) {
      console.error('Erro ao atualizar base:', error);
    }
  };

  const handleSync = async (bot: BotData) => {
    if (bot.bot_status !== 'open') {
      setSelectedBot(bot);
      setSyncModalOpen(true);
    }
  };

  const handlePause = async (bot: BotData) => {
    await updateBot(bot.uid, { status: 'disconnected' });
  };

  const handleDelete = async (bot: BotData) => {
    await deleteBot(bot.uid);
  };

  const handleCustomize = (bot: BotData) => {
    setSelectedBot(bot);
    setDetailsModalOpen(true);
  };

  const handleViewChange = (type: 'grid' | 'table') => {
    setViewType(type);
    localStorage.setItem('whatsappViewType', type);
  };

  const handleProjectChange = async (botUid: string, projectId: string) => {
    try {
      await updateBot(botUid, { projeto: projectId || null });
      console.log('Projeto atualizado com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar projeto:', error);
    }
  };

  if (loading || !isSubscribed || loadingProjetos) {
    return (
      <div className="w-full px-4 pb-4 sm:pb-6">
        <div className="max-w-[1370px] mx-auto">
          <div 
            className="rounded-lg p-8 shadow-lg"
            style={{ backgroundColor: 'var(--bg-primary)' }}
          >
            <span style={{ color: 'var(--text-primary)' }}>
              {loading || loadingProjetos ? 'Carregando...' : 'Conectando ao serviço de bots...'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--sidebar-active-bg)' }}>
      <WelcomeHeader route="whatsapp" />
      <div className="w-full px-4 pb-4 pt-4 sm:pb-6">
        <div className="max-w-[1370px] mx-auto">
          <div className="flex flex-col gap-6">
            <StatsCards {...stats} />
            <AssistantesHeader
              viewType={viewType}
              onViewChange={handleViewChange}
              onAddAssistant={handleAddAssistant}
            />
            <div 
              className={viewType === 'table' ? 'rounded-lg p-6' : ''}
              style={{ 
                backgroundColor: viewType === 'table' ? 'var(--bg-primary)' : 'transparent',
                borderRadius: '0.75rem'
              }}
            >
              <AssistantGrid
                bots={filteredBots}
                bases={bases}
                projetos={projetos}
                viewType={viewType}
                onBaseChange={handleBaseChange}
                onSync={handleSync}
                onPause={handlePause}
                onDelete={handleDelete}
                onCustomize={handleCustomize}
                onProjectChange={handleProjectChange}
              />
            </div>
          </div>

          {selectedBot && (
            <>
              <SyncAssistantModal
                isOpen={syncModalOpen}
                onClose={() => {
                  setSyncModalOpen(false);
                  setSelectedBot(null);
                }}
                assistantName={selectedBot.bot_nome}
                assistantImage={selectedBot.bot_perfil || null}
                assistantId={selectedBot.uid}
              />

              <AssistantDetailsModal
                isOpen={detailsModalOpen}
                onClose={() => {
                  setDetailsModalOpen(false);
                  setSelectedBot(null);
                }}
                bot={selectedBot}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WhatsApp;
