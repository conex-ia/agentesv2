import React from 'react';
import { Bot, MoreVertical, Wifi, QrCode, Pause, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { EmptyState } from '../../../components/EmptyState';
import { BotData } from '../../../hooks/useBots';

interface AssistantTableProps {
  bots: BotData[];
  loading: boolean;
  bases: any[];
  knowledgeBaseOptions: (currentBase: string, status: string) => { value: string; label: string; }[];
  handleSyncClick: (bot: BotData) => void;
  handleActionClick: (bot: BotData, action: 'pause' | 'delete') => void;
  handleKnowledgeBaseChange: (botId: string, baseId: string) => void;
  handleToggleActive: (botId: string, isActive: boolean, baseId: string) => void;
  selectedKnowledgeBases: Record<string, string>;
  DEFAULT_PROFILE_IMAGE: string;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const AssistantTable: React.FC<AssistantTableProps> = ({
  bots,
  loading,
  bases,
  knowledgeBaseOptions,
  handleSyncClick,
  handleActionClick,
  handleKnowledgeBaseChange,
  handleToggleActive,
  selectedKnowledgeBases,
  DEFAULT_PROFILE_IMAGE,
  currentPage,
  totalPages,
  onPageChange
}) => {
  const [openMenuId, setOpenMenuId] = React.useState<string | null>(null);

  const handleMenuClick = (botId: string) => {
    setOpenMenuId(openMenuId === botId ? null : botId);
  };

  const getBotNameWithoutExtension = (name: string | null | undefined) => {
    if (!name) return '';
    // Primeiro split por ponto, depois por underline
    return name.split('.')[0].split('_')[0];
  };

  if (loading) {
    return (
      <div style={{ color: 'var(--text-secondary)' }} className="text-center">
        Carregando assistentes...
      </div>
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full rounded-lg overflow-hidden"
      style={{ backgroundColor: 'var(--sidebar-bg)' }}
    >
      <div className="overflow-x-auto scrollbar-thin" style={{ margin: 0, padding: 0 }}>
        <table className="w-full min-w-[1000px] table-auto">
          <thead style={{ backgroundColor: 'var(--table-header-bg)', color: 'var(--text-secondary)' }}>
            <tr 
              className="text-left" 
              style={{ 
                color: 'var(--text-secondary)',
                borderBottom: '1px solid var(--table-border-color)'
              }}
            >
              <th className="p-4 font-medium w-[80px]">Perfil</th>
              <th className="p-4 font-medium">Nome</th>
              <th className="p-4 font-medium">Telefone</th>
              <th className="p-4 font-medium">Status da Conexão</th>
              <th className="p-4 font-medium">Status do Assistente</th>
              <th className="p-4 font-medium">Base de Conhecimento</th>
              <th className="p-4 font-medium text-right">Gerenciar</th>
            </tr>
          </thead>
          <tbody>
            {bots.map((bot, index) => (
              <tr 
                key={bot.uid} 
                className={`${index !== bots.length - 1 ? 'border-b' : ''}`}
                style={{ borderColor: 'var(--table-border-color)' }}
              >
                <td className="py-4 pl-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    <img
                      src={bot.bot_perfil || DEFAULT_PROFILE_IMAGE}
                      alt={bot.bot_nome}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </td>
                <td className="py-4 pl-4" style={{ color: 'var(--text-primary)' }}>
                  {getBotNameWithoutExtension(bot.bot_nome)}
                </td>
                <td className="py-4 pl-4" style={{ color: 'var(--text-primary)' }}>
                  {bot.bot_numero || '-'}
                </td>
                <td className="py-4 pl-4">
                  <div className="flex items-center gap-2">
                    {bot.bot_status === 'open' ? (
                      <>
                        <Wifi size={18} style={{ color: 'var(--success-color)' }} />
                        <span style={{ color: 'var(--success-color)' }}>Online</span>
                      </>
                    ) : (
                      <button
                        onClick={() => handleSyncClick(bot)}
                        className="flex items-center gap-2 transition-colors"
                        style={{ 
                          color: 'var(--text-secondary)',
                          ':hover': { color: 'var(--text-primary)' }
                        }}
                      >
                        <QrCode size={18} />
                        <span>Sincronizar</span>
                      </button>
                    )}
                  </div>
                </td>
                <td className="py-4 pl-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={bot.bot_ativo}
                      onChange={() => handleToggleActive(bot.uid, bot.bot_ativo, bot.bot_base)}
                      disabled={!bot.bot_base || bot.bot_base === 'Escolha uma base'}
                      className="sr-only"
                    />
                    <div 
                      className="custom-toggle"
                      data-disabled={!bot.bot_base || bot.bot_base === 'Escolha uma base'}
                      data-active={bot.bot_ativo}
                    ></div>
                    <span className="ml-3 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {bot.bot_ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </label>
                  {(!bot.bot_base || bot.bot_base === 'Escolha uma base') && (
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      (Vincule uma base)
                    </span>
                  )}
                </td>
                <td className="py-4 pl-4">
                  <select
                    value={bot.bot_status !== 'open' ? '' : (selectedKnowledgeBases[bot.uid] || bot.bot_base || '')}
                    onChange={(e) => handleKnowledgeBaseChange(bot.uid, e.target.value)}
                    disabled={bot.bot_status !== 'open'}
                    className="border focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent px-3 py-2 w-full"
                    style={{ 
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)',
                      '--tw-ring-color': 'var(--accent-color)'
                    }}
                  >
                    {knowledgeBaseOptions(bot.bot_base, bot.bot_status).map((option) => (
                      <option 
                        key={option.value} 
                        value={option.value}
                        {...(option.value === 'desconectar' ? { 'data-disconnect': true } : {})}
                        className="p-2"
                        style={{ color: option.value === 'desconectar' ? 'var(--error-color)' : 'inherit' }}
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-4 pl-4 text-right relative">
                  <button
                    onClick={() => handleMenuClick(bot.uid)}
                    className="p-2 transition-colors"
                    style={{ 
                      color: 'var(--text-secondary)',
                      ':hover': { backgroundColor: 'var(--bg-secondary)' }
                    }}
                  >
                    <MoreVertical size={20} />
                  </button>
                  {openMenuId === bot.uid && (
                    <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg border py-1 z-10" style={{ 
                      backgroundColor: 'var(--table-header-bg)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-secondary)'
                    }}>
                      {bot.bot_status !== 'open' && (
                        <button
                          onClick={() => handleSyncClick(bot)}
                          className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 transition-colors hover:bg-[var(--menu-hover-bg)]"
                          style={{ 
                            color: 'var(--text-secondary)'
                          }}
                        >
                          <Wifi className="w-4 h-4" />
                          Sincronizar Base
                        </button>
                      )}
                      <button
                        onClick={() => handleActionClick(bot, 'pause')}
                        className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 transition-colors hover:bg-[var(--menu-hover-bg)]"
                        style={{ 
                          color: 'var(--text-secondary)'
                        }}
                      >
                        <Pause className="w-4 h-4" />
                        Pausar Assistente
                      </button>
                      <button
                        onClick={() => handleActionClick(bot, 'delete')}
                        className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 transition-colors hover:bg-[var(--menu-hover-bg)]"
                        style={{ 
                          color: 'var(--error-color)'
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                        Excluir Assistente
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default AssistantTable;
