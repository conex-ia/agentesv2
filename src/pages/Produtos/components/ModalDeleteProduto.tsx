import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Package, Image as ImageIcon, ChevronLeft, ChevronRight, Loader2, CheckCircle2 } from 'lucide-react';
import type { TrainingData } from '../../../types/training';
import { useProjectNames } from '../../../hooks/useProjectNames';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { supabase } from '../../../lib/supabase';
import useAuth from '../../../stores/useAuth';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../../../styles/swiper-custom.css';

interface ModalDeleteProdutoProps {
  isOpen: boolean;
  onClose: () => void;
  training: TrainingData | null;
  onConfirmDelete: (training: TrainingData) => void;
}

interface ProdutoImage {
  url: string;
  nome: string;
}

const ModalDeleteProduto: React.FC<ModalDeleteProdutoProps> = ({
  isOpen,
  onClose,
  training,
  onConfirmDelete
}) => {
  const [images, setImages] = useState<ProdutoImage[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [hasResponse, setHasResponse] = useState(false);
  const { userUid, empresaUid } = useAuth();
  
  // Memoizar o array de projectIds para evitar recriação a cada renderização
  const projectIds = useMemo(() => (training?.projeto ? [training.projeto] : []), [training?.projeto]);
  const { projectNames } = useProjectNames(projectIds);

  // Reset dos estados quando o modal abre/fecha
  useEffect(() => {
    if (isOpen && training && training.url) {
      console.log('[ModalDeleteProduto] Modal aberto:', {
        trainingId: training.uid,
        isDeleting,
        isCompleted,
        hasResponse
      });
      const imageObjects = training.url.map((url: string) => ({
        url,
        nome: url.split('/').pop() || ''
      }));
      setImages(imageObjects);
    } else {
      console.log('[ModalDeleteProduto] Modal fechado ou sem training');
      setImages([]);
      setIsDeleting(false);
      setIsCompleted(false);
      setHasResponse(false);
    }
  }, [isOpen, training]);

  // Monitorar mudanças no estado 'ativa' do produto
  useEffect(() => {
    if (!training?.uid || !isDeleting) {
      console.log('[ModalDeleteProduto] Não configurando realtime:', {
        trainingId: training?.uid,
        isDeleting
      });
      return;
    }

    const channelName = `conex-treinamentos-delete-${Date.now()}`;
    console.log('[ModalDeleteProduto] Configurando realtime:', {
      channelName,
      productId: training.uid,
      isDeleting,
      isCompleted,
      hasResponse
    });

    const subscription = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'conex-treinamentos',
          filter: `uid=eq.${training.uid}`
        },
        (payload) => {
          console.log('[ModalDeleteProduto] Evento recebido:', {
            channelName,
            payload,
            hasResponse,
            isDeleting,
            isCompleted
          });

          // Só processa se ainda não recebeu resposta e está deletando
          if (payload.new && !hasResponse && isDeleting) {
            setHasResponse(true);
            console.log('[ModalDeleteProduto] Estado do produto atualizado:', {
              ativa: payload.new.ativa,
              id: payload.new.uid
            });

            if (payload.new.ativa === false) {
              console.log('[ModalDeleteProduto] Produto inativado, atualizando estado');
              setIsCompleted(true);
              setIsDeleting(false);
            }
          }
        }
      )
      .subscribe((status) => {
        console.log('[ModalDeleteProduto] Status da subscription:', {
          channelName,
          status,
          isDeleting,
          isCompleted,
          hasResponse
        });
      });

    return () => {
      console.log('[ModalDeleteProduto] Limpando subscription:', {
        channelName,
        isDeleting,
        isCompleted,
        hasResponse
      });
      subscription.unsubscribe();
    };
  }, [training?.uid, isDeleting]);

  const handleDelete = async () => {
    if (!training || !empresaUid || !userUid) return;
    setIsDeleting(true);

    // Se não tiver projeto, usar ação excluirVazio
    if (!training.projeto) {
      try {
        const response = await fetch('https://webhook.conexcondo.com.br/webhook/conex-midias', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            acao: 'excluirVazio',
            empresaUid,
            userUid,
            produtoUid: training.uid
          }),
        });

        if (!response.ok) {
          throw new Error('Erro ao excluir produto vazio');
        }

        // Aguardar o realtime atualizar o estado
        // O useEffect que monitora ativa=false vai mostrar a tela de sucesso
      } catch (error) {
        console.error('Erro ao excluir produto vazio:', error);
        setIsDeleting(false);
      }
      return;
    }

    // Se tiver projeto, usar o fluxo normal
    await onConfirmDelete(training);
  };

  const handleClose = () => {
    onClose();
    // Resetar estados ao fechar
    setIsDeleting(false);
    setIsCompleted(false);
  };

  const formatBaseName = (nome: string | null | undefined) => {
    if (!nome || nome === 'Aguardando') return nome || 'Aguardando';
    return nome.split('_')[0];
  };

  if (!training) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        >
          <div className="w-full max-w-2xl bg-gray-900 rounded-lg shadow-lg flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  {isCompleted ? (
                    <CheckCircle2 className="text-emerald-500" size={24} />
                  ) : (
                    <AlertTriangle className="text-red-500" size={24} />
                  )}
                  {isCompleted ? 'Produto Excluído' : isDeleting ? 'Excluindo Produto' : 'Excluir Produto'}
                </h2>
                <button 
                  onClick={handleClose}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {(isDeleting || isCompleted) ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center">
                    {isDeleting ? (
                      <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    {isDeleting ? 'Excluindo Itens' : 'Exclusão Concluída'}
                  </h3>
                  <p className="text-gray-400 text-center max-w-sm">
                    {isDeleting 
                      ? 'Aguarde enquanto excluímos o produto e suas imagens...'
                      : 'O produto e todas as suas imagens foram excluídos com sucesso.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Alerta */}
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                    <p className="text-red-500 text-sm">
                      Esta ação é irreversível e irá excluir este Produto e todas as imagens relacionadas
                    </p>
                  </div>

                  {/* Informações do Produto */}
                  <div className="space-y-6">
                    {/* Projeto */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Projeto</h4>
                      <p className="text-white">
                        {training.projeto ? projectNames[training.projeto] || '-' : '-'}
                      </p>
                    </div>

                    {/* Base */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Base</h4>
                      <p className="text-white">
                        {formatBaseName(training.base)}
                      </p>
                    </div>

                    {/* Resumo */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Resumo</h4>
                      <p className="text-white">{training.resumo || 'Não informado'}</p>
                    </div>

                    {/* Miniaturas das Imagens */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Imagens ({images.length})</h4>
                      <div className="relative">
                        <Swiper
                          modules={[Navigation, Pagination]}
                          spaceBetween={16}
                          slidesPerView={3.5}
                          navigation={{
                            prevEl: '.swiper-button-prev',
                            nextEl: '.swiper-button-next',
                          }}
                          pagination={{ clickable: true }}
                          className="w-full px-1"
                        >
                          {images.map((image, index) => (
                            <SwiperSlide key={index}>
                              <div className="aspect-square rounded-lg bg-gray-800 overflow-hidden flex items-center justify-center relative group">
                                <img
                                  src={image.url}
                                  alt={image.nome}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    const parent = target.parentElement;
                                    if (parent) {
                                      const fallback = document.createElement('div');
                                      fallback.className = 'w-full h-full flex items-center justify-center';
                                      fallback.innerHTML = `<div class="text-gray-500"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>`;
                                      parent.appendChild(fallback);
                                    }
                                  }}
                                />
                                {/* Nome da imagem no hover */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                                  <span className="text-xs text-white text-center break-words">
                                    {image.nome}
                                  </span>
                                </div>
                              </div>
                            </SwiperSlide>
                          ))}
                        </Swiper>
                        {/* Botões de navegação customizados */}
                        <button className="swiper-button-prev absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-black/50 rounded-full z-10 text-white hover:bg-black/70 transition-colors">
                          <ChevronLeft size={20} />
                        </button>
                        <button className="swiper-button-next absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-black/50 rounded-full z-10 text-white hover:bg-black/70 transition-colors">
                          <ChevronRight size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer com borda suave e padding */}
            <div className="border-t border-gray-700/50">
              <div className="px-6 py-4 flex justify-end gap-3">
                {!isDeleting && !isCompleted && (
                  <>
                    <button
                      onClick={handleClose}
                      className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleDelete}
                      className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <AlertTriangle size={16} />
                      Confirmar Exclusão
                    </button>
                  </>
                )}
                {isCompleted && (
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 text-sm font-medium text-white bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    Fechar
                  </button>
                )}
              </div>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalDeleteProduto;
