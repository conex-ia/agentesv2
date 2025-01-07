import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { IMaskInput } from 'react-imask';

const ContactForm = () => {
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

      // Mostra mensagem de sucesso
      alert('Mensagem enviada com sucesso!');
    } catch (error) {
      alert('Erro ao enviar mensagem. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h2 className="text-2xl font-bold text-white mb-4">Entre em Contato</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="footer-name" className="block text-sm font-medium text-gray-300 mb-1">
            Nome <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            id="footer-name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Digite seu nome"
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="footer-whatsapp" className="block text-sm font-medium text-gray-300 mb-1">
            WhatsApp
          </label>
          <IMaskInput
            id="footer-whatsapp"
            name="whatsapp"
            mask="(00) 00000-0000"
            value={formData.whatsapp}
            onAccept={(value: string) => setFormData(prev => ({ ...prev, whatsapp: value }))}
            placeholder="Digite seu WhatsApp"
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="footer-email" className="block text-sm font-medium text-gray-300 mb-1">
            E-mail <span className="text-red-400">*</span>
          </label>
          <input
            type="email"
            id="footer-email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="Insira seu melhor e-mail"
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="footer-message" className="block text-sm font-medium text-gray-300 mb-1">
            Mensagem <span className="text-red-400">*</span>
          </label>
          <textarea
            id="footer-message"
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
    </motion.div>
  );
};

export default ContactForm;