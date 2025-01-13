import { BotData } from '../../../hooks/useBots';
import { KnowledgeBase } from '../../../hooks/useKnowledgeBases';
import { Bot, Wifi, QrCode, Power, RefreshCw, Pause, Trash2 } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface AssistantTableProps {
  bots: BotData[];
  bases: KnowledgeBase[];
  onBaseChange: (botUid: string, baseUid: string) => void;
  onSync: (bot: BotData) => void;
  onPause: (bot: BotData) => void;
  onDelete: (bot: BotData) => void;
  onCustomize: (bot: BotData) => void;
}

const AssistantTable = ({
  bots,
  bases,
  onBaseChange,
  onSync,
  onPause,
  onDelete,
  onCustomize,
}: AssistantTableProps) => {
  const getBotName = (fullName: string) => {
    return fullName.split('.')[0];
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

  const handleToggleActive = async (bot: BotData) => {
    // Se não tem base vinculada ou é "Escolha uma base", não permite ativar
    if (!bot.bot_base || bot.bot_base === 'Escolha uma base') {
      console.error('Não é possível ativar um assistente sem base de conhecimento vinculada');
      return;
    }

    try {
      const { error } = await supabase
        .from('conex-bots')
        .update({ bot_ativo: !bot.bot_ativo })
        .eq('uid', bot.uid);

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao alterar status do assistente:', error);
    }
  };

  return (
    <div 
      className="overflow-x-auto rounded-lg custom-scrollbar" 
      style={{ 
        backgroundColor: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-elevation-low)'
      }}
    >
      <table className="w-full min-w-[800px]">
        <thead>
          <tr style={{ 
            borderBottom: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-secondary)'
          }}>
            <th className="text-left p-4 font-medium text-sm" style={{ color: 'var(--text-secondary)' }}>Perfil</th>
            <th className="text-left p-4 font-medium text-sm" style={{ color: 'var(--text-secondary)' }}>Nome</th>
            <th className="text-center p-4 font-medium text-sm" style={{ color: 'var(--text-secondary)' }}>Status da Conexão</th>
            <th className="text-left p-4 font-medium text-sm" style={{ color: 'var(--text-secondary)' }}>Número</th>
            <th className="text-center p-4 font-medium text-sm" style={{ color: 'var(--text-secondary)' }}>Status do Assistente</th>
            <th className="text-left p-4 font-medium text-sm" style={{ color: 'var(--text-secondary)' }}>Base de Conhecimento</th>
            <th className="text-center p-4 font-medium text-sm" style={{ color: 'var(--text-secondary)' }}>Gerenciar</th>
          </tr>
        </thead>
        <tbody>
          {bots.map(bot => (
            <tr 
              key={bot.uid} 
              className="hover:bg-opacity-50 transition-colors hover:bg-[var(--bg-secondary)]"
              style={{ 
                borderBottom: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-primary)'
              }}
            >
              <td className="p-4">
                <img 
                  src={bot.bot_perfil || 'https://tfmzozvazfbrapkzxrcz.supabase.co/storage/v1/object/public/conexia/bot-perfil.png'} 
                  alt="Perfil" 
                  className="w-10 h-10 rounded-full border-2"
                  style={{ borderColor: 'var(--border-color)' }}
                />
              </td>
              <td className="p-4">
                <span style={{ color: 'var(--text-primary)' }} className="font-medium">{getBotName(bot.bot_nome)}</span>
              </td>
              <td className="p-4">
                <div className="flex items-center justify-center">
                  {bot.bot_status === 'open' ? (
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg shadow-sm transition-all hover:shadow-md"
                         style={{ 
                           backgroundColor: 'var(--success-color)15',
                           border: '1px solid var(--success-color)30'
                         }}>
                      <Wifi size={20} style={{ color: 'var(--success-color)' }} />
                    </div>
                  ) : (
                    <div 
                      className="flex items-center justify-center w-10 h-10 rounded-lg shadow-sm transition-all hover:shadow-md cursor-pointer"
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
              </td>
              <td className="p-4">
                <span style={{ color: 'var(--text-secondary)' }}>{bot.bot_numero || ' - '}</span>
              </td>
              <td className="p-4">
                <div className="flex items-center justify-center">
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
              </td>
              <td className="p-4">
                {bases.length > 0 ? (
                  <select
                    value={bot.bot_base || ''}
                    onChange={(e) => handleBaseChange(bot.uid, e.target.value)}
                    className="bg-[var(--bg-primary)] text-[var(--text-primary)] rounded-lg p-2 w-full transition-colors hover:border-[var(--accent-color)] focus:border-[var(--accent-color)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:ring-opacity-15"
                    style={{
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
                    className="bg-[var(--bg-primary)] text-[var(--text-secondary)] rounded-lg p-2 w-full opacity-50"
                    style={{ border: '1px solid var(--border-color)' }}
                  >
                    <option value="">Crie uma Base</option>
                  </select>
                )}
              </td>
              <td className="p-4">
                <div className="flex items-center justify-center gap-2">
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
                        <Pause className="w-5 h-5" />
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
                        <Bot className="w-5 h-5" />
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
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssistantTable; 