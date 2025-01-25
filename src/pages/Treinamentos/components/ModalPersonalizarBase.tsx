import React, { useState, useEffect } from 'react';
import { Database, CheckCircle2 } from 'lucide-react';
import { Dialog } from '@headlessui/react';
import { KnowledgeBase } from '../../../hooks/useKnowledgeBases';

interface ModalPersonalizarBaseProps {
  isOpen: boolean;
  onClose: () => void;
  base: KnowledgeBase | null;
  onConfirm?: (base: KnowledgeBase, text: string) => Promise<void>;
}

const ModalPersonalizarBase: React.FC<ModalPersonalizarBaseProps> = ({
  isOpen,
  onClose,
  base,
  onConfirm
}) => {
  const [text, setText] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Carrega o valor inicial do prompt quando o modal abrir ou a base mudar
  useEffect(() => {
    if (base?.prompt) {
      setText(base.prompt);
    } else {
      setText('');
    }
  }, [base]);

  const handleConfirm = async () => {
    if (base && onConfirm) {
      try {
        await onConfirm(base, text);
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          onClose();
        }, 2000);
      } catch (error) {
        console.error('Erro ao salvar:', error);
      }
    }
  };

  if (!base) return null;

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center">
        <Dialog 
          as="div" 
          className="relative z-10"
          onClose={onClose}
          open={isOpen}
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-2xl overflow-hidden rounded-lg" style={{ backgroundColor: 'var(--bg-primary)' }}>
              {/* Header */}
              <div className="border-b border-gray-700/50 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-lg"
                      style={{ backgroundColor: 'var(--status-success-bg)' }}
                    >
                      <Database className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div>
                      <Dialog.Title
                        className="text-lg font-medium"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {base.nome ? base.nome.split('_')[0] : '-'}
                      </Dialog.Title>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="rounded-lg p-2 transition-colors hover:bg-gray-100/10"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <span className="sr-only">Fechar</span>
                    ×
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex flex-col">
                  <div className="mb-6 rounded-lg p-6">
                    <h3 className="mb-4 text-lg font-medium" style={{ color: 'var(--text-primary)' }}>
                      Personalizar
                    </h3>
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      className="w-full min-h-[200px] rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      style={{ 
                        backgroundColor: 'rgba(20, 25, 40, 0.3)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-color)'
                      }}
                      placeholder="Personalize a forma de se expressar do Agente em relação a esta Base de Conhecimento"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      {showSuccess && (
                        <div 
                          className="flex items-center gap-2 px-4 py-2 rounded-lg" 
                          style={{ 
                            backgroundColor: 'rgba(0, 209, 157, 0.1)',
                            border: '1px solid rgba(0, 209, 157, 0.2)'
                          }}
                        >
                          <CheckCircle2 className="w-5 h-5" style={{ color: '#00D19D' }} />
                          <span style={{ color: '#00D19D' }}>Atualizado com sucesso!</span>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg transition-colors"
                        style={{ 
                          backgroundColor: 'var(--bg-primary)',
                          color: 'var(--text-secondary)',
                          border: '1px solid var(--border-color)'
                        }}
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleConfirm}
                        className="px-4 py-2 rounded-lg transition-colors"
                        style={{ 
                          backgroundColor: '#00D19D',
                          color: 'white'
                        }}
                      >
                        Confirmar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default ModalPersonalizarBase;
