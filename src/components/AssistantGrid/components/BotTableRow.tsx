import React from 'react';
import { Wifi, QrCode, MoreVertical, Pause, Trash2 } from 'lucide-react';
import { Bot } from '../types';
import { DEFAULT_PROFILE_IMAGE } from '../constants';

interface BotTableRowProps {
  bot: Bot;
  selectedKnowledgeBase: string;
  onKnowledgeBaseChange: (value: string) => void;
  onSync: () => void;
  onMenuClick: () => void;
  onAction: (action: 'pause' | 'delete') => void;
  isMenuOpen: boolean;
  knowledgeBaseOptions: Array<{ value: string; label: string; }>;
}

export const BotTableRow: React.FC<BotTableRowProps> = ({
  bot,
  selectedKnowledgeBase,
  onKnowledgeBaseChange,
  onSync,
  onMenuClick,
  onAction,
  isMenuOpen,
  knowledgeBaseOptions
}) => {
  const getBotNameWithoutExtension = (fullName: string) => {
    return fullName.split('.')[0].split('_')[0];
  };

  const formatLabel = (label: string) => {
    if (label === 'Vincule uma Base' || label === 'Desvincular Base') return label;
    return label.split('_')[0];
  };

  return (
    <tr className="border-b border-gray-700/50">
      <td className="py-4">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700">
          <img
            src={bot.bot_perfil || DEFAULT_PROFILE_IMAGE}
            alt={bot.bot_nome}
            className="w-full h-full object-cover"
          />
        </div>
      </td>
      <td className="py-4 text-white">
        {getBotNameWithoutExtension(bot.bot_nome)}
      </td>
      <td className="py-4 text-white">{bot.bot_numero || '-'}</td>
      <td className="py-4">
        <div className="flex items-center gap-2">
          {bot.bot_status === 'open' ? (
            <>
              <Wifi size={18} className="text-emerald-400" />
              <span className="text-emerald-400">Online</span>
            </>
          ) : (
            <button
              onClick={onSync}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <QrCode size={18} />
              <span>Sincronizar</span>
            </button>
          )}
        </div>
      </td>
      <td className="py-4 text-white">
        {bot.bot_ligado ? 'Ativo' : 'Inativo'}
      </td>
      <td className="py-4">
        <select
          value={selectedKnowledgeBase}
          onChange={(e) => onKnowledgeBaseChange(e.target.value)}
          className="bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        >
          {knowledgeBaseOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {formatLabel(option.label)}
            </option>
          ))}
        </select>
      </td>
      <td className="py-4 text-right relative">
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <MoreVertical size={20} className="text-gray-400" />
        </button>
        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-700 ring-1 ring-black ring-opacity-5">
            <div className="py-1">
              {bot.bot_status === 'open' && (
                <button
                  onClick={() => onAction('pause')}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-white hover:bg-gray-600 w-full text-left"
                >
                  <Pause size={16} />
                  Pausar
                </button>
              )}
              <button
                onClick={() => onAction('delete')}
                className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-gray-600 w-full text-left"
              >
                <Trash2 size={16} />
                Excluir
              </button>
            </div>
          </div>
        )}
      </td>
    </tr>
  );
};