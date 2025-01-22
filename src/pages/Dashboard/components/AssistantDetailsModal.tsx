import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bot, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface Bot {
  uid: string;
  bot_nome: string;
  bot_numero: string;
  bot_perfil?: string;
  bot_status: string;
  bot_ligado: boolean;
  bot_ativo: boolean;
  lgpd: boolean;
  bot_agente_nome: string;
  saudacao?: string;
  bot_base?: string;
  prompt?: string;
}

interface AssistantDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bot: any;
}

const AssistantDetailsModal: React.FC<AssistantDetailsModalProps> = ({
  isOpen,
  onClose,
  bot
}) => {
  const [agentName, setAgentName] = useState(bot?.bot_agente_nome || '');
  const [lgpdEnabled, setLgpdEnabled] = useState(bot?.lgpd || false);
  const [greeting, setGreeting] = useState(bot?.saudacao || '');
  const [prompt, setPrompt] = useState(bot?.prompt || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const statusTimeoutRef = useRef<NodeJS.Timeout>();

  // Atualiza os valores quando o bot mudar
  useEffect(() => {
    if (bot) {
      setAgentName(bot.bot_agente_nome || '');
      setLgpdEnabled(bot.lgpd || false);
      setGreeting(bot.saudacao || '');
      setPrompt(bot.prompt || '');
    }
  }, [bot]);

  // Limpa o status após 8 segundos
  useEffect(() => {
    if (saveStatus.type) {
      if (statusTimeoutRef.current) {
        clearTimeout(statusTimeoutRef.current);
      }
      
      statusTimeoutRef.current = setTimeout(() => {
        setSaveStatus({ type: null, message: '' });
      }, 8000);
    }

    return () => {
      if (statusTimeoutRef.current) {
        clearTimeout(statusTimeoutRef.current);
      }
    };
  }, [saveStatus.type]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAgentName(e.target.value);
  };

  const handleGreetingChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setGreeting(e.target.value);
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const handleLgpdToggle = () => {
    setLgpdEnabled(!lgpdEnabled);
  };

  const handleClose = () => {
    setSaveStatus({ type: null, message: '' });
    onClose();
  };

  const handleSave = async () => {
    if (isSaving) return;

    setIsSaving(true);
    setSaveStatus({ type: null, message: '' });

    try {
      const { error } = await supabase
        .from('conex-bots')
        .update({ 
          bot_agente_nome: agentName,
          lgpd: lgpdEnabled,
          saudacao: greeting,
          prompt: prompt
        })
        .eq('uid', bot.uid);

      if (error) throw error;
      setSaveStatus({ 
        type: 'success', 
        message: 'Configurações salvas com sucesso!' 
      });
    } catch (error) {
      console.error('Erro ao salvar:', error);
      setSaveStatus({ 
        type: 'error', 
        message: 'Erro ao salvar as configurações. Tente novamente.' 
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!bot) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />
          
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-gray-800 rounded-xl shadow-xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <Bot size={24} className="text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      Configurações do Assistente
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {bot.bot_nome.split('.')[0]}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6">
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-white mb-4">
                    Informações Personalizáveis
                  </h4>
                  <div className="space-y-6">
                    {/* Nome do Assistente */}
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Nome Personalizado do Assistente
                      </label>
                      <input
                        type="text"
                        value={agentName}
                        onChange={handleNameChange}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="Digite o nome do assistente..."
                      />
                    </div>

                    {/* Toggle LGPD */}
                    <div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={lgpdEnabled}
                          onChange={handleLgpdToggle}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-500"></div>
                        <span className="ml-3 text-sm font-medium text-white">
                          LGPD {lgpdEnabled ? 'Ativada' : 'Desativada'}
                        </span>
                      </label>
                    </div>

                    {/* Saudação */}
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Saudação
                      </label>
                      <textarea
                        value={greeting}
                        onChange={handleGreetingChange}
                        rows={2}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                        placeholder="Adicione uma saudação personalizada. Se deixar em branco a saudação será gerada pela IA."
                      />
                    </div>

                    {/* Prompt */}
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Prompt
                      </label>
                      <textarea
                        value={prompt}
                        onChange={handlePromptChange}
                        rows={2}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                        placeholder="Adicione um prompt personalizado..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative flex items-center justify-end p-6 border-t border-gray-700">
                {/* Status Message */}
                <AnimatePresence>
                  {saveStatus.type && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className={`absolute left-6 flex items-center gap-2 ${
                        saveStatus.type === 'success' ? 'text-emerald-500' : 'text-red-500'
                      }`}
                    >
                      {saveStatus.type === 'success' ? (
                        <CheckCircle size={16} />
                      ) : (
                        <AlertCircle size={16} />
                      )}
                      {saveStatus.message}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleClose}
                    className="px-4 py-2 text-sm font-medium text-white bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    Fechar
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-4 py-2 text-sm font-medium bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      'Salvar'
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AssistantDetailsModal;
