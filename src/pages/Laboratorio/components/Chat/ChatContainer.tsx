import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Send, Loader2, Bot } from 'lucide-react';
import { useKnowledgeBase } from '../../../../contexts/KnowledgeBaseContext';
import { useKnowledgeBases } from '../../../../hooks/useKnowledgeBases';
import { useLaboratorioChat } from '../../../../hooks/useLaboratorioChat';
import * as Tooltip from '@radix-ui/react-tooltip';
import FormattedText from '../../../../components/FormattedText';
import AssistantMessage from './AssistantMessage';
import ImprovementModal from './ImprovementModal';

// Componente para formatar o texto com quebras de linha
const TypingAnimation: React.FC = () => {
  return (
    <div className="flex items-start">
      <div className="mr-3 mt-1 p-2 rounded-full bg-emerald-500/10">
        <Bot className="w-5 h-5 text-emerald-500" />
      </div>
      <div 
        className="rounded-lg p-3 max-w-[80%] relative flex items-center gap-1"
        style={{ 
          backgroundColor: 'var(--bg-secondary)',
          color: 'var(--text-secondary)'
        }}
      >
        <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
};

const ChatContainer: React.FC = () => {
  const [inputMessage, setInputMessage] = useState('');
  const { selectedKnowledgeBase } = useKnowledgeBase();
  const { bases, loading: loadingBases } = useKnowledgeBases();
  const { messages, loading, sending, sendMessage } = useLaboratorioChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState('');
  const [relatedQuestion, setRelatedQuestion] = useState('');

  // Encontra o nome da base selecionada
  const selectedBaseName = useMemo(() => {
    if (!selectedKnowledgeBase || selectedKnowledgeBase === 'all') return '';
    return bases.find(base => base.uid === selectedKnowledgeBase)?.nome || '';
  }, [selectedKnowledgeBase, bases]);

  const handleImprove = (message: string, index: number) => {
    // Procura a mensagem anterior que seja do usuário
    let previousQuestion = '';
    if (index > 0 && 
        messages[index - 1].remetente === 'User' && 
        messages[index - 1].chat_uid === messages[index].chat_uid) { 
      previousQuestion = messages[index - 1].mensagem || '';
    }
    
    setSelectedMessage(message);
    setRelatedQuestion(previousQuestion);
    setIsModalOpen(true);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, sending]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    try {
      await sendMessage(inputMessage.trim(), 'User');
      setInputMessage('');
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  // Formata o nome da base removendo o ID
  const formatBaseName = (name?: string) => {
    if (!name) return '';
    return name.split('_')[0];
  };

  const getWelcomeMessage = () => {
    if (!selectedKnowledgeBase || selectedKnowledgeBase === 'all' || !bases) {
      return 'Olá! Como posso ajudar?';
    }
    return `Olá! Estou aqui para ajudar. Como posso auxiliá-lo hoje?`;
  };

  const getSelectedBaseName = () => {
    if (!selectedKnowledgeBase || selectedKnowledgeBase === 'all' || !bases) {
      return "Escolha uma base para interagir";
    }
    const selectedBase = bases.find(b => b.uid === selectedKnowledgeBase);
    const baseName = formatBaseName(selectedBase?.nome);
    return (
      <span>
        Você está interagindo com a Base de Conhecimento:{' '}
        <span className="font-bold">
          {baseName}
        </span>
      </span>
    );
  };

  return (
    <Tooltip.Provider delayDuration={200}>
      <div 
        className="rounded-lg overflow-hidden mb-6 flex flex-col" 
        style={{ 
          backgroundColor: 'var(--sidebar-bg)',
          height: 'calc(100vh - 160px)'
        }}
      >
        {/* Header do Chat */}
        <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Chat Laboratório
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {loadingBases ? "Carregando bases..." : (
              !selectedKnowledgeBase || selectedKnowledgeBase === 'all' || !bases
                ? "Escolha uma base para interagir"
                : <>{getSelectedBaseName()}</>
            )}
          </p>
        </div>

        {/* Área de Mensagens */}
        <div 
          className="flex-1 overflow-y-auto p-4"
          style={{ backgroundColor: 'var(--bg-primary)' }}
        >
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--text-primary)' }} />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Mensagem de boas-vindas */}
              <AssistantMessage 
                content={getWelcomeMessage()}
                timestamp={new Date().toISOString()}
              />

              {/* Mensagens do chat */}
              {messages.map((message, index) => (
                <div 
                  key={message.uid}
                  className={`flex items-start gap-2 ${message.remetente === 'User' ? 'justify-end' : ''}`}
                >
                  {message.remetente === 'User' ? (
                    <div 
                      className="rounded-lg p-3 max-w-[80%] bg-emerald-500 text-white"
                    >
                      <FormattedText text={message.mensagem || ''} />
                      <span className="text-xs mt-1 block text-white/80">
                        {new Date(message.created_at).toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  ) : (
                    <AssistantMessage 
                      content={message.mensagem || ''}
                      timestamp={message.created_at}
                      onImprove={() => handleImprove(message.mensagem || '', index)}
                    />
                  )}
                </div>
              ))}

              {/* Animação de digitando */}
              {sending && (
                <TypingAnimation />
              )}
              
              {/* Elemento invisível para referência do scroll */}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Área de Input */}
        <div className="px-6 py-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={
                !selectedKnowledgeBase || selectedKnowledgeBase === 'all'
                  ? 'Selecione uma base de conhecimento...'
                  : 'Digite sua mensagem...'
              }
              className="flex-1 bg-transparent border border-[var(--border-color)] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed text-[var(--text-primary)]"
              disabled={!selectedKnowledgeBase || selectedKnowledgeBase === 'all' || sending}
            />
            <button
              type="submit"
              disabled={!selectedKnowledgeBase || selectedKnowledgeBase === 'all' || !inputMessage.trim() || sending}
              className="p-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-emerald-500"
            >
              {sending ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <Send className="w-6 h-6" />
              )}
            </button>
          </form>
        </div>

        {/* Modal de Melhoria */}
        <ImprovementModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setRelatedQuestion('');
          }}
          baseName={selectedBaseName}
          baseUid={selectedKnowledgeBase}
          selectedResponse={selectedMessage}
          initialQuestion={relatedQuestion}
        />
      </div>
    </Tooltip.Provider>
  );
};

export default ChatContainer;
