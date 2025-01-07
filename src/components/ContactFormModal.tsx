import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send } from 'lucide-react';
import { IMaskInput } from 'react-imask';

interface ContactFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactFormModal = ({ isOpen, onClose }: ContactFormModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    email: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simula envio do formulário
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Limpa o formulário
      setFormData({
        name: '',
        whatsapp: '',
        email: '',
        message: ''
      });

      // Fecha o modal
      onClose();
    } catch (error) {
      alert('Erro ao enviar mensagem. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50"
          >
            <div className="relative mx-4">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gray-800 text-gray-400 hover:text-white flex items-center justify-center transition-colors z-10"
              >
                <X size={20} />
              </button>

              {/* Content */}
              <div className="bg-[#1F2937] rounded-xl shadow-xl overflow-hidden p-8">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Entre em Contato
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="modal-name" className="block text-sm font-medium text-gray-300 mb-1">
                      Nome <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="modal-name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Digite seu nome"
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="modal-whatsapp" className="block text-sm font-medium text-gray-300 mb-1">
                      WhatsApp
                    </label>
                    <IMaskInput
                      id="modal-whatsapp"
                      name="whatsapp"
                      mask="(00) 00000-0000"
                      value={formData.whatsapp}
                      onAccept={(value: string) => setFormData(prev => ({ ...prev, whatsapp: value }))}
                      placeholder="Digite seu WhatsApp"
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="modal-email" className="block text-sm font-medium text-gray-300 mb-1">
                      E-mail <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      id="modal-email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Insira seu melhor e-mail"
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="modal-message" className="block text-sm font-medium text-gray-300 mb-1">
                      Mensagem <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      id="modal-message"
                      name="message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Digite sua mensagem"
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <p className="text-sm text-gray-400 text-center">
                    Campos marcados com <span className="text-red-400">*</span> são obrigatórios
                  </p>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-8 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 
                             transition-colors duration-200 font-semibold flex items-center justify-center gap-2
                             disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={20} />
                    {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
                  </motion.button>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ContactFormModal;