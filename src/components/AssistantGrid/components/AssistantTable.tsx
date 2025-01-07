import React from 'react';
import { Bot, KnowledgeBaseOption } from '../types';
import { BotTableRow } from './BotTableRow';

interface AssistantTableProps {
  bots: Bot[];
  selectedKnowledgeBases: { [key: string]: string };
  onKnowledgeBaseChange: (botId: string, value: string) => void;
  onSync: (bot: Bot) => void;
  onMenuClick: (botId: string) => void;
  onAction: (bot: Bot, action: 'pause' | 'delete') => void;
  openMenuId: string | null;
  knowledgeBaseOptions: KnowledgeBaseOption[];
}

const AssistantTableComponent: React.FC<AssistantTableProps> = ({
  bots,
  selectedKnowledgeBases,
  onKnowledgeBaseChange,
  onSync,
  onMenuClick,
  onAction,
  openMenuId,
  knowledgeBaseOptions
}) => {
  return (
    <div className="overflow-x-auto custom-scrollbar">
      <table className="w-full min-w-[1000px]">
        <thead>
          <tr className="text-left text-gray-400 border-b border-gray-700">
            <th className="pb-4 font-medium">Perfil</th>
            <th className="pb-4 font-medium">Nome</th>
            <th className="pb-4 font-medium">Telefone</th>
            <th className="pb-4 font-medium">Status da Conexão</th>
            <th className="pb-4 font-medium">Status do Assistente</th>
            <th className="pb-4 font-medium">Base de Conhecimento</th>
            <th className="pb-4 font-medium text-right">Gerenciar</th>
          </tr>
        </thead>
        <tbody>
          {bots.map((bot) => (
            <BotTableRow
              key={bot.uid}
              bot={bot}
              selectedKnowledgeBase={selectedKnowledgeBases[bot.uid] || ''}
              onKnowledgeBaseChange={(value) => onKnowledgeBaseChange(bot.uid, value)}
              onSync={() => onSync(bot)}
              onMenuClick={() => onMenuClick(bot.uid)}
              onAction={(action) => onAction(bot, action)}
              isMenuOpen={openMenuId === bot.uid}
              knowledgeBaseOptions={knowledgeBaseOptions}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const AssistantTable = React.memo(AssistantTableComponent);
export default AssistantTable;
