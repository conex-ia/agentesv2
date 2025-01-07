import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, Plus } from 'lucide-react';
import { useBots } from '../../hooks/useBots';
import useAuth from '../../stores/useAuth';
import { AssistantTable } from './components/AssistantTable';
import { ConfirmationModal } from '../ConfirmationModal';
import { SyncAssistantModal } from '../SyncAssistantModal';
import { ITEMS_PER_PAGE, KNOWLEDGE_BASE_OPTIONS, DEFAULT_PROFILE_IMAGE } from './constants';
import { ConfirmModalState, SyncModalState } from './types';

const AssistantGrid = () => {
  const { userUid } = useAuth();
  const { bots } = useBots();
  
  useEffect(() => {
    console.log('[AssistantGrid] Bots updated:', bots);
  }, [bots]);

  const [currentPage, setCurrentPage] = useState(1);
  const [assistantName, setAssistantName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({ isOpen: false });
  const [syncModal, setSyncModal] = useState<SyncModalState>({ isOpen: false });
  const [selectedKnowledgeBases, setSelectedKnowledgeBases] = useState<{ [key: string]: string }>({});

  const currentBots = bots.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleKnowledgeBaseChange = (botId: string, value: string) => {
    setSelectedKnowledgeBases(prev => ({
      ...prev,
      [botId]: value
    }));
  };

  const handleSyncClick = (bot: Bot) => {
    setSyncModal({
      isOpen: true,
      botId: bot.uid,
      botName: bot.bot_nome || '',
      botImage: bot.bot_perfil || DEFAULT_PROFILE_IMAGE
    });
  };

  const handleMenuClick = (botId: string) => {
    setOpenMenuId(prev => prev === botId ? null : botId);
  };

  const handleActionClick = (bot: typeof Bot, action: 'pause' | 'delete') => {
    setConfirmModal({
      isOpen: true,
      botId: bot.uid,
      botName: bot.bot_nome || '',
      botImage: bot.bot_perfil || DEFAULT_PROFILE_IMAGE,
      action
    });
  };

  const handleConfirmAction = async () => {
    // Implementar lógica de confirmação
    setConfirmModal({ isOpen: false });
  };

  return (
    <div className="w-full px-4">
      <div className="max-w-[1370px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-lg p-8 shadow-lg"
        >
          <AssistantTable
            bots={currentBots}
            selectedKnowledgeBases={selectedKnowledgeBases}
            onKnowledgeBaseChange={handleKnowledgeBaseChange}
            onSync={handleSyncClick}
            onMenuClick={handleMenuClick}
            onAction={handleActionClick}
            openMenuId={openMenuId}
            knowledgeBaseOptions={KNOWLEDGE_BASE_OPTIONS}
          />
        </motion.div>
      </div>

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false })}
        onConfirm={handleConfirmAction}
        title={`${confirmModal.action === 'pause' ? 'Pausar' : 'Excluir'} Assistente`}
        assistantName={confirmModal.botName || ''}
        assistantImage={confirmModal.botImage}
        actionType={confirmModal.action || 'pause'}
      />

      <SyncAssistantModal
        isOpen={syncModal.isOpen}
        onClose={() => setSyncModal({ isOpen: false })}
        assistantName={syncModal.botName || ''}
        assistantImage={syncModal.botImage || ''}
        assistantId={syncModal.botId || ''}
      />
    </div>
  );
};

export default AssistantGrid;
