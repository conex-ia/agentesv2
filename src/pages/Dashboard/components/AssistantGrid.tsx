import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, Wifi, QrCode, MoreVertical, Pause, Trash2, RefreshCw, LayoutGrid, Grid2X2, Table } from 'lucide-react';
import { useBots } from '../../../hooks/useBots';
import useAuth from '../../../stores/useAuth';
import { useKnowledgeBases } from '../../../hooks/useKnowledgeBases';
import ConfirmationModal from './ConfirmationModal';
import SyncAssistantModal from './SyncAssistantModal';
import { EmptyState } from '../../../components/EmptyState';
import { supabase } from '../../../lib/supabase';
import AssistantTable from './AssistantTable';
import Pagination from '../../../components/Pagination';
import { Switch } from '@headlessui/react';

const ITEMS_PER_PAGE = 6;

interface ConfirmModalState {
  isOpen: boolean;
  botId?: string;
  botName?: string;
  botImage?: string | null;
  action?: 'pause' | 'delete';
}

interface SyncModalState {
  isOpen: boolean;
  botId?: string;
  botName?: string;
  botImage?: string | null;
}

interface AssistantGridProps {
  viewType: 'grid' | 'table';
  onViewTypeChange: (type: 'grid' | 'table') => void;
}

const DEFAULT_PROFILE_IMAGE = 'https://tfmzozvazfbrapkzxrcz.supabase.co/storage/v1/object/public/conexia/bot-perfil.png';

const MenuGestao: React.FC<{
  bot: any;
  openMenuId: string | null;
  onMenuClick: (botId: string) => void;
  onActionClick: (bot: any, action: 'pause' | 'delete') => void;
}> = ({ bot, openMenuId, onMenuClick, onActionClick }) => (
  <div className="relative flex items-center justify-end">
    <button
      onClick={() => onMenuClick(bot.uid)}
      className="p-2 rounded-lg transition-colors hover:bg-[var(--button-secondary-hover)]"
      style={{ color: 'var(--text-secondary)' }}
    >
      <MoreVertical size={20} />
    </button>
    {openMenuId === bot.uid && (
      <div 
        className="absolute top-full right-0 mt-1 w-48 shadow-lg py-1 z-50 border backdrop-blur-sm"
        style={{ 
          backgroundColor: 'var(--table-header-bg)',
          borderColor: 'var(--modal-border)',
          borderRadius: '12px',
          overflow: 'hidden'
        }}
      >
        {bot.bot_status === 'open' && (
          <button
            onClick={() => onActionClick(bot, 'pause')}
            className="flex items-center gap-2 px-4 py-2 text-sm w-full text-left transition-colors hover:bg-[var(--menu-hover-bg)]"
            style={{ color: 'var(--text-primary)' }}
          >
            <Pause size={16} />
            Pausar
          </button>
        )}
        <button
          onClick={() => onActionClick(bot, 'delete')}
          className="flex items-center gap-2 px-4 py-2 text-sm w-full text-left transition-colors hover:bg-[var(--menu-hover-bg)]"
          style={{ color: 'var(--error-color)' }}
        >
          <Trash2 size={16} />
          Excluir
        </button>
      </div>
    )}
  </div>
);

const AssistantGrid: React.FC<AssistantGridProps> = ({ viewType, onViewTypeChange }): JSX.Element => {
  const { userUid, empresaUid } = useAuth();
  const { bots, loading: botsLoading } = useBots();
  const { bases, loading: basesLoading } = useKnowledgeBases();
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({ isOpen: false });
  const [syncModal, setSyncModal] = useState<SyncModalState>({ isOpen: false });
  const [selectedKnowledgeBases, setSelectedKnowledgeBases] = useState<{ [botId: string]: string }>({});

  // Log quando bots mudar
  useEffect(() => {
    console.log('[AssistantGrid] Bots state updated:', bots?.length || 0, 'bots');
    console.log('[AssistantGrid] Current bots:', bots);
  }, [bots]);

  // Função de ordenação
  const sortBots = (botsToSort: any[]) => {
    return [...botsToSort].sort((a, b) => {
      // 1. Primeiro por status da conexão (OPEN primeiro)
      if (a.bot_status === 'open' && b.bot_status !== 'open') return -1;
      if (a.bot_status !== 'open' && b.bot_status === 'open') return 1;

      // 2. Depois por status do assistente (true primeiro)
      if (a.bot_ativo && !b.bot_ativo) return -1;
      if (!a.bot_ativo && b.bot_ativo) return 1;

      // 3. Por fim, pelo nome
      return a.bot_nome.localeCompare(b.bot_nome);
    });
  };

  // Ordenar os bots antes de paginar
  const sortedBots = bots ? sortBots(bots) : [];
  
  const totalPages = Math.ceil((sortedBots?.length || 0) / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentBots = sortedBots?.slice(startIndex, endIndex) || [];

  // Update current page when bots array changes
  useEffect(() => {
    console.log('[AssistantGrid] Checking page update:', {
      currentPage,
      currentBotsLength: currentBots.length,
      totalPages
    });
    if (currentPage > 1 && currentBots.length === 0 && totalPages > 0) {
      console.log('[AssistantGrid] Updating current page to:', Math.max(1, totalPages));
      setCurrentPage(Math.max(1, totalPages));
    }
  }, [bots?.length, currentPage, totalPages]);

  // Initialize selectedKnowledgeBases with existing bot_base values
  useEffect(() => {
    if (bots) {
      const initialKnowledgeBases = bots.reduce((acc, bot) => ({
        ...acc,
        [bot.uid]: bot.bot_base || ''
      }), {});
      setSelectedKnowledgeBases(initialKnowledgeBases);
    }
  }, [bots]); // Adicionando bots como dependência para atualizar quando os dados mudarem

  const getBotNameWithoutExtension = (fullName: string | null) => {
    if (!fullName) return '';
    // Primeiro split por ponto, depois por underline
    return fullName.split('.')[0].split('_')[0];
  };

  const isNameTaken = (name: string) => {
    return bots?.some(bot => getBotNameWithoutExtension(bot.bot_nome) === name);
  };

  const handleMenuClick = (botId: string) => {
    setOpenMenuId(openMenuId === botId ? null : botId);
  };

  const handleSyncClick = async (bot: any) => {
    setSyncModal({
      isOpen: true,
      botId: bot.uid,
      botName: bot.bot_nome,
      botImage: bot.bot_perfil || DEFAULT_PROFILE_IMAGE,
    });
  };

  const handleActionClick = (bot: any, action: 'pause' | 'delete') => {
    setConfirmModal({
      isOpen: true,
      botId: bot.uid,
      botName: getBotNameWithoutExtension(bot.bot_nome),
      botImage: bot.bot_perfil || DEFAULT_PROFILE_IMAGE,
      action,
    });
    setOpenMenuId(null);
  };

  const handleConfirmAction = async () => {
    if (!confirmModal.botId || !confirmModal.action) return { success: false, message: 'Erro ao processar ação' };

    try {
      if (confirmModal.action === 'delete') {
        // Primeiro atualiza bot_exibir para false
        const { error: updateError } = await supabase
          .from('conex-bots')
          .update({ bot_exibir: false })
          .eq('uid', confirmModal.botId);

        if (updateError) throw updateError;
      }

      const response = await fetch('https://webhook.conexcondo.com.br/webhook/gerenciar-assistente', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          acao: confirmModal.action,
          assistenteId: confirmModal.botId,
          userId: userUid,
        }),
      });

      const data = await response.json();
      setConfirmModal({ isOpen: false });
      return {
        success: true,
        message: `Assistente ${data.status === 'pausado' ? 'pausado' : 'excluído'} com sucesso`,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erro ao processar sua solicitação. Por favor, tente novamente.',
      };
    }
  };

  const handleKnowledgeBaseChange = async (botId: string, value: string) => {
    try {
      const response = await fetch('https://webhook.conexcondo.com.br/webhook/baseAssistente', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          acao: value === 'desconectar' ? 'desvincularBase' : 'vincularBase',
          userUid,
          empresaUid,
          assistenteUid: botId,
          ...(value !== 'desconectar' && { baseUid: value })
        }),
      });

      const data = await response.json();
      
      if (data.status === 'sucesso') {
        if (value === 'desconectar') {
          setSuccessMessage('Base desvinculada com sucesso');
        } else {
          setSuccessMessage('Base vinculada com sucesso');
        }
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        if (value === 'desconectar') {
          setErrorMessage('Erro ao desvincular base');
        } else {
          setErrorMessage('Erro ao vincular base');
        }
        setTimeout(() => setErrorMessage(''), 3000);
      }
    } catch (error) {
      if (value === 'desconectar') {
        setErrorMessage('Erro ao desvincular base');
      } else {
        setErrorMessage('Erro ao vincular base');
      }
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const handleToggleActive = async (botId: string, currentStatus: boolean, botBase: string) => {
    // Se não tem base vinculada ou é "Escolha uma base", não permite ativar
    if (!botBase || botBase === 'Escolha uma base') {
      setErrorMessage('Não é possível ativar um assistente sem base de conhecimento vinculada');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('conex-bots')
        .update({ bot_ativo: !currentStatus })
        .eq('uid', botId);

      if (error) throw error;

      setSuccessMessage(`Assistente ${!currentStatus ? 'ativado' : 'desativado'} com sucesso`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage('Erro ao alterar status do assistente');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  useEffect(() => {
    if (bots) {
      const currentKnowledgeBases = bots.reduce((acc, bot) => ({
        ...acc,
        [bot.uid]: bot.bot_base || ''
      }), {});

      // Só atualiza o estado se houver diferenças
      const hasChanges = Object.entries(currentKnowledgeBases).some(
        ([botId, value]) => value !== selectedKnowledgeBases[botId]
      );

      if (hasChanges) {
        setSelectedKnowledgeBases(currentKnowledgeBases);
      }
    }
  }, [bots, selectedKnowledgeBases]);

  const knowledgeBaseOptions = (botBase: string, botStatus: string) => {
    // Se o bot não estiver com status 'open', mostra apenas a opção de sincronização
    if (botStatus !== 'open') {
      return [
        { value: '', label: 'Sincronize o Assistente' }
      ];
    }

    // Se o bot_base for 'Escolha uma base', incluímos essa opção no início
    if (botBase === 'Escolha uma base') {
      return [
        { value: '', label: 'Escolha uma base' },
        ...(bases?.map(base => ({
          value: base.uid,
          label: base.nome || 'Base sem nome'
        })) || [])
      ];
    }
    
    // Se o bot_base for diferente, mostramos ele como primeira opção
    const currentBase = bases?.find(base => base.uid === botBase);
    return [
      { value: botBase, label: currentBase?.nome || 'Base sem nome' },
      { value: 'desconectar', label: 'DESCONECTAR BASE' },
      ...(bases?.filter(base => base.uid !== botBase).map(base => ({
        value: base.uid,
        label: base.nome || 'Base sem nome'
      })) || [])
    ];
  };

  if (botsLoading || basesLoading) {
    return (
      <div className="text-center text-gray-400">Carregando assistentes...</div>
    );
  }

  if (!bots || bots.length === 0) {
    return (
      <EmptyState
        icon={Bot}
        title="Nenhum assistente encontrado"
        description="Clique no botão acima para adicionar um novo assistente."
      />
    );
  }

  return (
    <div className="space-y-6">
      {successMessage && (
        <div 
          className="max-w-7xl mx-auto p-4 rounded-lg"
          style={{ 
            backgroundColor: 'var(--success-color)',
            color: 'var(--button-primary-text)'
          }}
        >
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div 
          className="max-w-7xl mx-auto p-4 rounded-lg"
          style={{ 
            backgroundColor: 'var(--error-color)',
            color: 'var(--button-primary-text)'
          }}
        >
          {errorMessage}
        </div>
      )}

      <div 
        className={viewType === 'table' ? 'rounded-lg border overflow-hidden' : ''}
        style={{ 
          backgroundColor: viewType === 'table' ? 'var(--sidebar-bg)' : 'transparent', 
          borderColor: 'var(--border-color)' 
        }}
      >
        <div className="overflow-x-auto scrollbar-thin">
          {viewType === 'table' ? (
            <AssistantTable
              bots={currentBots}
              loading={isLoading}
              bases={bases}
              knowledgeBaseOptions={knowledgeBaseOptions}
              handleSyncClick={handleSyncClick}
              handleActionClick={handleActionClick}
              handleKnowledgeBaseChange={handleKnowledgeBaseChange}
              handleToggleActive={handleToggleActive}
              selectedKnowledgeBases={selectedKnowledgeBases}
              DEFAULT_PROFILE_IMAGE={DEFAULT_PROFILE_IMAGE || ''}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {currentBots.map((bot) => (
                <div
                  key={bot.uid}
                  className="p-4 rounded-lg border backdrop-blur-sm relative"
                  style={{ 
                    backgroundColor: 'var(--sidebar-bg)',
                    borderColor: 'var(--border-color)'
                  }}
                >
                  <div className="absolute top-4 right-4">
                    <MenuGestao 
                      bot={bot}
                      openMenuId={openMenuId}
                      onMenuClick={handleMenuClick}
                      onActionClick={handleActionClick}
                    />
                  </div>

                  <div className="flex flex-col items-center mb-4">
                    <img
                      src={bot.bot_perfil || DEFAULT_PROFILE_IMAGE}
                      alt={getBotNameWithoutExtension(bot.bot_nome) || 'Bot'}
                      className="w-16 h-16 rounded-full border mb-2"
                      style={{ borderColor: 'var(--card-border)' }}
                    />
                    <h3 
                      className="text-lg font-medium"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {getBotNameWithoutExtension(bot.bot_nome)}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span style={{ color: 'var(--text-secondary)' }}>Telefone:</span>
                      <span style={{ color: 'var(--text-primary)' }}>{bot.bot_numero || '-'}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span style={{ color: 'var(--text-secondary)' }}>Status da Conexão:</span>
                      <button
                        onClick={() => handleSyncClick(bot)}
                        className="w-10 h-10 flex items-center justify-center transition-colors rounded-lg"
                        style={{
                          backgroundColor: 'var(--button-secondary-bg)',
                          color: bot.bot_status === 'open' ? 'var(--success-color)' : 'var(--button-secondary-text)'
                        }}
                      >
                        {bot.bot_status === 'open' ? <Wifi size={20} /> : <QrCode size={20} />}
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span style={{ color: 'var(--text-secondary)' }}>Status do Assistente:</span>
                      <Switch
                        checked={bot.bot_ativo}
                        onChange={() => handleToggleActive(bot.uid, bot.bot_ativo, bot.bot_base)}
                        className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none"
                        style={{
                          backgroundColor: bot.bot_ativo ? 'var(--success-color)' : 'var(--switch-bg)',
                          boxShadow: '0 2px 4px var(--switch-shadow)'
                        }}
                      >
                        <span
                          className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                          style={{
                            transform: bot.bot_ativo ? 'translateX(1.5rem)' : 'translateX(0.25rem)',
                            boxShadow: '0 1px 2px var(--switch-thumb-shadow)'
                          }}
                        />
                      </Switch>
                    </div>

                    <div>
                      <select
                        value={selectedKnowledgeBases[bot.uid] || ''}
                        onChange={(e) => handleKnowledgeBaseChange(bot.uid, e.target.value)}
                        className="w-full rounded-lg px-3 py-1.5 text-sm border focus:outline-none focus:ring-2 focus:ring-emerald-200"
                        style={{
                          backgroundColor: 'var(--input-bg)',
                          color: 'var(--input-text)',
                          borderColor: 'var(--input-border)'
                        }}
                      >
                        {knowledgeBaseOptions(bot.bot_base, bot.bot_status).map((option) => (
                          <option 
                            key={option.value} 
                            value={option.value}
                            style={{
                              backgroundColor: 'var(--input-bg)',
                              color: option.value === 'desconectar' ? 'var(--error-color)' : 'var(--text-primary)'
                            }}
                          >
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false })}
        onConfirm={handleConfirmAction}
        title={confirmModal.action === 'delete' ? 'Excluir Assistente' : 'Pausar Assistente'}
        assistantName={confirmModal.botName || ''}
        assistantImage={confirmModal.botImage}
        actionType={confirmModal.action || 'pause'}
      />

      <SyncAssistantModal
        isOpen={syncModal.isOpen}
        onClose={() => setSyncModal({ isOpen: false })}
        assistantName={syncModal.botName || ''}
        assistantImage={syncModal.botImage || null}
        assistantId={syncModal.botId || ''}
      />
    </div>
  );
};

export default AssistantGrid;