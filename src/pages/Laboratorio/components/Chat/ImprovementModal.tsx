import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bot, Loader2, CheckCircle2 } from 'lucide-react';
import useAuth from '../../../../stores/useAuth';

interface ImprovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  baseName: string;
  baseUid: string;
  selectedResponse: string;
  initialQuestion: string;
}

const ImprovementModal: React.FC<ImprovementModalProps> = ({
  isOpen,
  onClose,
  baseName,
  baseUid,
  selectedResponse,
  initialQuestion
}) => {
  const { empresaUid, userUid } = useAuth();
  const [relatedQuestion, setRelatedQuestion] = useState(initialQuestion);
  const [improvedResponse, setImprovedResponse] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsSaved(false);
    }
    setRelatedQuestion(initialQuestion);
  }, [initialQuestion, isOpen]);

  const handleClose = () => {
    setRelatedQuestion('');
    setImprovedResponse('');
    setIsSaved(false);
    onClose();
  };

  // Função para formatar o nome da base
  const formatBaseName = (nome: string) => {
    if (!nome) return nome;
    return nome.split('_')[0];
  };

  const handleSave = async () => {
    if (!relatedQuestion.trim() || !improvedResponse.trim()) return;

    setIsSaving(true);
    try {
      const response = await fetch('https://webhook.conexcondo.com.br/webhook/melhoria_resposta', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          empresaUid: empresaUid,
          userUid: userUid,
          baseUid: baseUid,
          pergunta: relatedQuestion.trim(),
          resposta: improvedResponse.trim()
        })
      });

      if (response.ok) {
        setIsSaved(true);
      } else {
        console.error('Erro ao salvar melhoria');
      }
    } catch (error) {
      console.error('Erro ao salvar melhoria:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

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
              className="relative w-full max-w-2xl bg-[var(--bg-primary)] rounded-xl shadow-xl overflow-hidden"
            >
              {/* Cabeçalho */}
              <div className="flex items-center justify-between p-6 border-b border-[var(--border-color)]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    {isSaved ? (
                      <CheckCircle2 size={24} className="text-emerald-500" />
                    ) : (
                      <Bot size={24} className="text-emerald-500" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[var(--text-primary)]">
                      {isSaved ? 'Melhoria Salva' : 'Melhorar Resposta'}
                    </h3>
                    <p className="text-[var(--text-secondary)] text-sm">
                      {formatBaseName(baseName)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-full hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Conteúdo */}
              <div className="p-6 space-y-6">
                {isSaved ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <CheckCircle2 size={48} className="text-emerald-500 mb-4" />
                    <p className="text-[var(--text-primary)] text-lg font-medium mb-2">
                      Melhoria salva com sucesso!
                    </p>
                    <p className="text-[var(--text-secondary)] text-center">
                      Sua contribuição ajudará a melhorar as respostas do assistente.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Pergunta Relacionada */}
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                        Digite a pergunta relacionada:
                      </label>
                      <textarea
                        value={relatedQuestion}
                        onChange={(e) => setRelatedQuestion(e.target.value)}
                        className="w-full p-3 rounded-lg text-[var(--text-primary)] bg-[var(--bg-secondary)] border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 min-h-[80px] resize-none"
                        placeholder="Digite a pergunta..."
                      />
                    </div>

                    {/* Resposta Obtida */}
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                        Resposta obtida:
                      </label>
                      <div className="p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                        <p className="text-[var(--text-primary)]">{selectedResponse}</p>
                      </div>
                    </div>

                    {/* Resposta Melhorada */}
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                        Resposta melhorada:
                      </label>
                      <textarea
                        value={improvedResponse}
                        onChange={(e) => setImprovedResponse(e.target.value)}
                        className="w-full p-3 rounded-lg text-[var(--text-primary)] bg-[var(--bg-secondary)] border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 min-h-[120px] resize-none"
                        placeholder="Digite a resposta melhorada..."
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Rodapé com Botões */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-[var(--border-color)]">
                {isSaved ? (
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
                  >
                    Fechar
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleClose}
                      disabled={isSaving}
                      className="px-4 py-2 rounded-lg border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={!relatedQuestion.trim() || !improvedResponse.trim() || isSaving}
                      className="px-4 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        'Salvar'
                      )}
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ImprovementModal;
