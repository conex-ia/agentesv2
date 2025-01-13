import React, { useState, useMemo } from 'react';
import { useBots, BotData } from '../../hooks/useBots';
import { useKnowledgeBases } from '../../hooks/useKnowledgeBases';
import { StatsCards } from './components/StatsCards';
import AssistantesHeader from './components/AssistantesHeader';
import AssistantGrid from './components/AssistantGrid';
import useAuth from '../../stores/useAuth';
import SyncAssistantModal from '../../pages/Dashboard/components/SyncAssistantModal';
import AssistantDetailsModal from '../../pages/Dashboard/components/AssistantDetailsModal';

const WhatsApp = () => {
  const [viewType, setViewType] = useState<'grid' | 'table'>(() => {
    const savedViewType = localStorage.getItem('whatsappViewType');
    return (savedViewType as 'grid' | 'table') || 'table';
  });
  const [syncModalOpen, setSyncModalOpen] = useState(false);
  const [selectedBot, setSelectedBot] = useState<BotData | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const { userUid } = useAuth();
  const { bots, loading, isSubscribed, addBot, updateBot, deleteBot } = useBots();
  const { bases } = useKnowledgeBases();

  const stats = useMemo(() => {
    return {
      total: bots.length,
      online: bots.filter((bot) => bot.bot_status === 'open').length,
      offline: bots.filter((bot) => bot.bot_status !== 'open').length,
      active: bots.filter((bot) => bot.bot_ativo).length,
    };
  }, [bots]);

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

  if (loading || !isSubscribed) {
    return (
      <div className="w-full px-4 pb-4 sm:pb-6">
        <div className="max-w-[1370px] mx-auto">
          <div 
            className="rounded-lg p-8 shadow-lg"
            style={{ backgroundColor: 'var(--bg-primary)' }}
          >
            <span style={{ color: 'var(--text-primary)' }}>
              {loading ? 'Carregando...' : 'Conectando ao serviço de bots...'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
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
              bots={bots}
              bases={bases}
              viewType={viewType}
              onBaseChange={handleBaseChange}
              onSync={handleSync}
              onPause={handlePause}
              onDelete={handleDelete}
              onCustomize={handleCustomize}
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
  );
};

export default WhatsApp;
