import React, { useState } from 'react';
import { useBots } from '../../../hooks/useBots';
import { Calendar, Info, Bot, Users } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import AssistantDetailsModal from './AssistantDetailsModal';
import { EmptyState } from '../../../components/EmptyState';
import { supabase } from '../../../lib/supabase';
import useAuth from '../../../stores/useAuth';

interface AssistantSettingsProps {
  userName: string;
}

const DEFAULT_PROFILE_IMAGE = 'https://tfmzozvazfbrapkzxrcz.supabase.co/storage/v1/object/public/conexia/bot-perfil.png';

const AssistantSettings: React.FC<AssistantSettingsProps> = ({ userName }) => {
  const { bots, loading, error } = useBots();
  const { empresaUid } = useAuth();
  const [selectedBot, setSelectedBot] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const getBotNameWithoutExtension = (fullName: string | null) => {
    if (!fullName) return '';
    return fullName.split('.')[0].split('_')[0];
  };

  const filteredBots = bots?.filter(bot => 
    bot.bot_status === 'open' && 
    bot.bot_titular === empresaUid
  ) || [];

  const activeBotsCount = filteredBots.filter(bot => bot.bot_ativo).length;

  const handleBotClick = (bot: any) => {
    setSelectedBot(bot);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBot(null);
  };

  const handleToggleActive = async (botId: string, currentStatus: boolean, botBase: string) => {
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

  return (
    <div className="p-6 min-h-screen" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card de Status */}
          <div 
            className="col-span-1 md:col-span-2 lg:col-span-3 p-6 rounded-lg border"
            style={{ 
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--card-border)'
            }}
          >
            <div className="flex items-center gap-4">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: 'var(--accent-color)' }}
              >
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Assistentes Ativos
                </h2>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {activeBotsCount} assistente{activeBotsCount !== 1 ? 's' : ''} ativo{activeBotsCount !== 1 ? 's' : ''} no momento
                </p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2" style={{ borderColor: 'var(--accent-color)' }} />
            </div>
          ) : error ? (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-red-500">
              Erro ao carregar assistentes
            </div>
          ) : filteredBots.length === 0 ? (
            <div className="col-span-1 md:col-span-2 lg:col-span-3">
              <EmptyState
                icon={Bot}
                title="Nenhum assistente encontrado"
                description="Você ainda não possui nenhum assistente configurado."
              />
            </div>
          ) : (
            <>
              {filteredBots.map((bot: any) => (
                <div
                  key={bot.uid}
                  className="p-6 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-lg"
                  style={{
                    backgroundColor: 'var(--card-bg)',
                    borderColor: 'var(--card-border)',
                  }}
                  onClick={() => handleBotClick(bot)}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={bot.bot_perfil || DEFAULT_PROFILE_IMAGE}
                      alt={bot.bot_nome}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h3 className="font-medium" style={{ color: 'var(--text-primary)' }}>
                        {getBotNameWithoutExtension(bot.bot_nome)}
                      </h3>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {bot.bot_numero || 'Sem telefone'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} style={{ color: 'var(--text-secondary)' }} />
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {bot.bot_criado ? 
                          `Criado em ${format(new Date(bot.bot_criado), 'dd/MM/yyyy', { locale: ptBR })}` :
                          'Data não disponível'
                        }
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Info size={16} style={{ color: 'var(--text-secondary)' }} />
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        Base: {bot.bot_base || 'Nenhuma'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div
                      className={`px-3 py-1 rounded-full text-sm inline-flex items-center ${
                        bot.bot_ativo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {bot.bot_ativo ? 'Ativo' : 'Inativo'}
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {errorMessage && (
          <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {successMessage}
          </div>
        )}

        {selectedBot && (
          <AssistantDetailsModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            bot={selectedBot}
          />
        )}
      </div>
    </div>
  );
};

export default AssistantSettings;
