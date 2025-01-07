import React from 'react';
import { Database, X, Eye } from 'lucide-react';
import { KnowledgeBase } from '../../../../../hooks/useKnowledgeBases';
import { Modal } from '../../../../../components/Modal';
import { formatDate } from '../../../../../utils/formatDate';
import { useProjetos } from '../../../../../hooks/useProjetos';
import useAuth from '../../../../../stores/useAuth';

const S3_BASE_URL = 'https://s3.conexcondo.com.br/conexia-v2/';

interface ViewKnowledgeBaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  base: KnowledgeBase | null;
}

export const ViewKnowledgeBaseModal: React.FC<ViewKnowledgeBaseModalProps> = ({
  isOpen,
  onClose,
  base
}) => {
  const { empresaUid } = useAuth();
  const { projetos, loading: projetosLoading } = useProjetos(empresaUid);

  // Criar um mapa de projetos para acesso rápido
  const projetosMap = React.useMemo(() => {
    return projetos.reduce((acc, projeto) => {
      acc[projeto.uid] = projeto;
      return acc;
    }, {} as Record<string, typeof projetos[0]>);
  }, [projetos]);

  const handleViewContent = (content: string) => {
    const url = `${S3_BASE_URL}${content}`;
    window.open(url, '_blank');
  };

  if (!base) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-full max-w-2xl bg-[#1A1D24] rounded-xl shadow-xl overflow-hidden z-[1002]">
        {/* Header */}
        <div className="relative bg-[#1F232B] px-6 py-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
              <Database size={24} className="text-emerald-500" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white">
                Detalhes da Base
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex flex-col">
            <div className="w-full bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 mb-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <span className="text-sm text-gray-400">Nome</span>
                  <p className="text-white text-lg">{base.nome}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-400">Projeto</span>
                  <p className="text-white text-lg">
                    {projetosLoading ? (
                      <div className="animate-pulse bg-gray-700/50 h-6 w-32 rounded"></div>
                    ) : (
                      base.projeto ? projetosMap[base.projeto]?.nome || 'Projeto não encontrado' : '-'
                    )}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-400">Treinamentos</span>
                  <p className="text-white text-lg">{base.treinamentos_qtd || 0}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-400">Criada em</span>
                  <p className="text-white text-lg">{formatDate(base.created_at)}</p>
                </div>
              </div>

              <div className="mt-6">
                <span className="text-sm text-gray-400">Conteúdos</span>
                {(!base.treinamentos || base.treinamentos.length === 0) ? (
                  <p className="mt-2 text-gray-500 text-sm">Nenhum conteúdo adicionado</p>
                ) : (
                  <div className="mt-3 max-h-48 overflow-y-auto custom-scrollbar space-y-2">
                    {base.treinamentos.map((treinamento, index) => (
                      <div 
                        key={index}
                        className="bg-gray-700/50 p-3 rounded-lg text-white text-sm flex items-center justify-between group"
                      >
                        <span className="flex-1 mr-4">{treinamento}</span>
                        <button
                          onClick={() => handleViewContent(treinamento)}
                          className="w-8 h-8 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 flex items-center justify-center transition-colors shadow-lg shadow-emerald-900/20"
                          title="Visualizar conteúdo"
                        >
                          <Eye size={16} className="text-emerald-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};