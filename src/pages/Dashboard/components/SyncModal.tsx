import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Lottie from 'lottie-react';
import useAuth from '../../../stores/useAuth';
import { supabase } from '../../../lib/supabase';

interface SyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  assistantName: string;
  assistantImage: string | null;
  status: 'close' | 'sincronizando' | 'open';
  assistantId: string;
}

const SyncModal = ({
  isOpen,
  onClose,
  assistantName,
  assistantImage,
  status: initialStatus,
  assistantId
}: SyncModalProps) => {
  const { userUid } = useAuth();
  const [status, setStatus] = useState(initialStatus);
  const [noSignalAnimation, setNoSignalAnimation] = useState(null);
  const [syncAnimation, setSyncAnimation] = useState(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStatus(initialStatus);
      setQrCode(null);
      setError(null);
    }
  }, [isOpen, initialStatus]);

  // Fetch animations
  useEffect(() => {
    fetch('https://5e45ddc988d620559d5e3fc3d82f7999.cdn.bubble.io/f1723386605722x785057971564719500/no-signal.json')
      .then(response => response.json())
      .then(data => setNoSignalAnimation(data))
      .catch(console.error);

    fetch('https://98294c7606508c9876a513c17d9dd2ca.cdn.bubble.io/f1711772944223x451883758661146800/bot-sincronizando.json')
      .then(response => response.json())
      .then(data => setSyncAnimation(data))
      .catch(console.error);
  }, []);

  // Subscribe to bot status changes
  useEffect(() => {
    if (!isOpen || !assistantId) return;

    const channel = supabase.channel('custom-bot-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conex-bots',
          filter: `uid=eq.${assistantId}`
        },
        (payload) => {
          const bot = payload.new;
          if (bot) {
            setStatus(bot.bot_status as any);
            setQrCode(bot.bot_qrcode || null);
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [isOpen, assistantId]);

  const handleSync = async () => {
    setError(null);
    setStatus('sincronizando');
    setQrCode(null);

    try {
      const response = await fetch('https://webhook.conexcondo.com.br/webhook/gerenciar-assistente', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          acao: 'sincronizar',
          assistenteId: assistantId,
          userId: userUid,
        }),
      });

      const data = await response.json();

      if (data.status === 'erro') {
        setError('Erro ao sincronizar. Por favor, tente novamente.');
        setStatus('close');
      }
    } catch (error) {
      setError('Erro ao sincronizar. Por favor, tente novamente.');
      setStatus('close');
    }
  };

  const renderRightContent = () => {
    if (error) {
      return noSignalAnimation && (
        <Lottie
          animationData={noSignalAnimation}
          loop={true}
          className="w-full h-full"
        />
      );
    }

    if (status === 'sincronizando') {
      if (qrCode) {
        return (
          <div className="flex items-center justify-center w-[180px] h-[180px]">
            <img 
              src={`data:image/png;base64,${qrCode}`}
              alt="QR Code"
              className="w-full h-full object-contain"
            />
          </div>
        );
      }
      return syncAnimation && (
        <Lottie
          animationData={syncAnimation}
          loop={true}
          className="w-full h-full"
        />
      );
    }

    return noSignalAnimation && (
      <Lottie
        animationData={noSignalAnimation}
        loop={true}
        className="w-full h-full"
      />
    );
  };

  const getStatusMessage = () => {
    if (error) {
      return error;
    }
    if (status === 'sincronizando') {
      return qrCode ? 'Aguardando a leitura do QR Code' : 'Aguarde...';
    }
    return 'Clique no botão SINCRONIZAR e aguarde o QrCode';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />
          
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-4xl bg-gray-800 rounded-xl shadow-xl overflow-hidden"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/20 text-white hover:bg-black/30 transition-colors z-10"
              >
                <X size={20} />
              </motion.button>

              <div className="flex flex-col md:flex-row h-[500px]">
                {/* Left Side - Content */}
                <div className="flex-1 flex items-center justify-center p-8">
                  <div className="flex flex-col items-center text-center max-w-sm">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-700 mb-4">
                      {assistantImage ? (
                        <img
                          src={assistantImage}
                          alt={assistantName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-700" />
                      )}
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-4">{assistantName}</h3>
                    
                    <p className={`text-gray-300 mb-8 ${error ? 'text-red-400' : ''}`}>
                      {getStatusMessage()}
                    </p>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSync}
                      disabled={status === 'sincronizando' && !error}
                      className="px-8 py-3 bg-emerald-500 text-white rounded-lg 
                               hover:bg-emerald-600 transition-colors font-medium disabled:opacity-50 
                               disabled:cursor-not-allowed w-full max-w-[200px]"
                    >
                      {qrCode ? 'Leia o QR Code' : status === 'sincronizando' && !error ? 'Aguarde...' : 'Sincronizar'}
                    </motion.button>
                  </div>
                </div>

                {/* Right Side - Animation */}
                <div 
                  className="flex-1 p-8 flex items-center justify-center"
                  style={{ backgroundColor: '#05311D' }}
                >
                  <div className="relative w-64 h-64">
                    {renderRightContent()}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SyncModal;