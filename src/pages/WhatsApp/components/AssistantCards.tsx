import { BotData } from '../../../hooks/useBots';
import { KnowledgeBase } from '../../../hooks/useKnowledgeBases';
import { RefreshCw, Play, Pause, Wifi, QrCode, Trash2, Bot } from 'lucide-react';

interface AssistantCardsProps {
  bots: BotData[];
  bases: KnowledgeBase[];
  onBaseChange: (botUid: string, baseUid: string) => void;
  onSync: (bot: BotData) => void;
  onPause: (bot: BotData) => void;
  onDelete: (bot: BotData) => void;
  onCustomize: (bot: BotData) => void;
}

const AssistantCards = ({
  bots,
  bases,
  onBaseChange,
  onSync,
  onPause,
  onDelete,
  onCustomize,
}: AssistantCardsProps) => {
  const handleToggleActive = (bot: BotData) => {
    onPause(bot);
  };

  const getBotName = (name: string) => {
    return name.split('-')[0] || name;
  };

  // Mapeamento de nome para uid
  const baseNameToUid = Object.fromEntries(bases.map(base => [base.nome, base.uid]));
  // Mapeamento de uid para nome
  const baseUidToName = Object.fromEntries(bases.map(base => [base.uid, base.nome]));

  const handleBaseChange = (botUid: string, selectedValue: string) => {
    // Se selecionou "Desvincular Base" ou "Vincule uma Base"
    if (!selectedValue) {
      onBaseChange(botUid, '');
      return;
    }
    // Converte o nome selecionado para uid
    const baseUid = baseNameToUid[selectedValue];
    onBaseChange(botUid, baseUid);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {bots.map(bot => (
        <div
          key={bot.uid}
          className="rounded-lg p-6 hover:-translate-y-1"
          style={{ 
            backgroundColor: 'var(--bg-primary)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-elevation-medium)',
            transition: 'all 0.2s ease-in-out'
          }}
        >
          <div className="flex items-center gap-4 mb-6">
            <img
              src={bot.bot_perfil || 'https://tfmzozvazfbrapkzxrcz.supabase.co/storage/v1/object/public/conexia/bot-perfil.png'}
              alt="Perfil"
              className="w-12 h-12 rounded-full border-2"
              style={{ borderColor: 'var(--border-color)' }}
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                {getBotName(bot.bot_nome)}
              </h3>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {bot.bot_numero || 'Número não configurado'}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>Status da Conexão</span>
              {bot.bot_status === 'open' ? (
                <div 
                  className="flex items-center justify-center w-10 h-10 rounded-lg shadow-sm"
                  style={{ 
                    backgroundColor: 'var(--success-color)15',
                    border: '1px solid var(--success-color)30'
                  }}
                >
                  <Wifi size={20} style={{ color: 'var(--success-color)' }} />
                </div>
              ) : (
                <div 
                  className="flex items-center justify-center w-10 h-10 rounded-lg shadow-sm cursor-pointer hover:shadow-md"
                  style={{ 
                    backgroundColor: 'var(--text-secondary)15',
                    border: '1px solid var(--text-secondary)30',
                    color: 'var(--text-secondary)'
                  }}
                  onClick={() => onSync(bot)}
                >
                  <QrCode size={20} />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>Status do Assistente</span>
              <div 
                className="w-12 h-6 rounded-full transition-colors cursor-pointer"
                style={{
                  backgroundColor: bot.bot_ativo ? 'var(--success-color)' : 'var(--text-secondary)30',
                  boxShadow: 'var(--shadow-elevation-low)'
                }}
                onClick={() => handleToggleActive(bot)}
              >
                <div 
                  className="w-5 h-5 rounded-full bg-white transform transition-transform shadow-sm"
                  style={{ 
                    transform: bot.bot_ativo ? 'translateX(24px)' : 'translateX(4px)',
                    marginTop: '2px'
                  }}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>Base de Conhecimento</span>
              {bases.length > 0 ? (
                <select
                  value={bot.bot_base || ''}
                  onChange={(e) => handleBaseChange(bot.uid, e.target.value)}
                  className="w-full p-2 rounded-lg transition-colors hover:border-[var(--accent-color)] focus:border-[var(--accent-color)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:ring-opacity-15"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <option value="">Vincule uma Base</option>
                  {bot.bot_base && (
                    <option value="" style={{ color: 'var(--error-color)' }}>Desvincular Base</option>
                  )}
                  {bases.map((base) => (
                    <option key={base.uid} value={base.nome || ''}>
                      {base.nome || 'Base sem nome'}
                    </option>
                  ))}
                </select>
              ) : (
                <select
                  disabled
                  className="w-full p-2 rounded-lg opacity-50"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <option value="">Crie uma Base</option>
                </select>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-2">
              {bot.bot_status === 'open' && (
                <>
                  <button
                    onClick={() => onPause(bot)}
                    className="p-2 rounded-lg transition-all hover:shadow-md"
                    style={{ 
                      backgroundColor: 'var(--bg-secondary)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-color)',
                      boxShadow: 'var(--shadow-elevation-low)'
                    }}
                  >
                    <Pause size={20} />
                  </button>
                  <button
                    onClick={() => onCustomize(bot)}
                    className="p-2 rounded-lg transition-all hover:shadow-md"
                    style={{ 
                      backgroundColor: 'var(--status-success-bg)',
                      color: 'var(--status-success-color)',
                      border: '1px solid var(--border-color)',
                      boxShadow: 'var(--shadow-elevation-low)'
                    }}
                  >
                    <Bot size={20} />
                  </button>
                </>
              )}
              <button
                onClick={() => onDelete(bot)}
                className="p-2 rounded-lg transition-all hover:shadow-md"
                style={{ 
                  backgroundColor: 'var(--status-error-bg)',
                  color: 'var(--status-error-color)',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-elevation-low)'
                }}
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AssistantCards; 