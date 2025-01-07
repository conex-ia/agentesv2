import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { IMaskInput } from 'react-imask';
import useAuthModal from '../../hooks/useAuthModal';

interface FormData {
  empresa: string;
  usuario: string;
  email: string;
  senha: string;
  whatsapp: string;
}

const SignupForm = () => {
  const { setCompanyData } = useAuthModal();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<FormData>({
    empresa: 'F M Guardia Solucoes em Tecnologia',
    usuario: '',
    email: '',
    senha: '',
    whatsapp: '',
  });

  const handleSubmitComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('https://webhook.conexcondo.com.br/webhook/login-challenge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          acao: 'criarEmpresa',
          cnpj: '44.136.932/0001-31',
          user: formData.usuario.trim(),
          email: formData.email.trim(),
          senha: formData.senha,
          whatsapp: formData.whatsapp.trim() || '',
        }),
      });

      const data = await response.json();

      if (data.status === 'empresaCriada') {
        setCompanyData({
          empresaUid: data.empresaUid,
          userUid: data.userUid,
          userNome: data.userNome,
          email: formData.email.trim()
        });
      } else {
        setError('Erro ao criar empresa. Por favor, tente novamente.');
      }
    } catch (err) {
      setError('Erro ao processar sua solicitação. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 h-[calc(100vh-4rem)] md:h-[500px] overflow-y-auto custom-scrollbar px-1"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Complete seu Cadastro</h2>
        <p className="mt-2 text-gray-600">Preencha os dados abaixo para finalizar</p>
      </div>

      <form onSubmit={handleSubmitComplete} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nome da Empresa
          </label>
          <input
            type="text"
            value={formData.empresa}
            disabled
            className="mt-1 block w-[98%] px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
          />
        </div>

        <div>
          <label htmlFor="usuario" className="block text-sm font-medium text-gray-700">
            Nome do Usuário
          </label>
          <input
            type="text"
            id="usuario"
            value={formData.usuario}
            onChange={(e) => setFormData(prev => ({ ...prev, usuario: e.target.value }))}
            className="mt-1 block w-[98%] px-3 py-2 border border-gray-300 rounded-lg 
                     focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            E-mail
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="mt-1 block w-[98%] px-3 py-2 border border-gray-300 rounded-lg 
                     focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>

        <div>
          <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
            Senha
          </label>
          <input
            type="password"
            id="senha"
            value={formData.senha}
            onChange={(e) => setFormData(prev => ({ ...prev, senha: e.target.value }))}
            className="mt-1 block w-[98%] px-3 py-2 border border-gray-300 rounded-lg 
                     focus:ring-emerald-500 focus:border-emerald-500"
            minLength={6}
            required
          />
          <p className="mt-1 text-sm text-gray-500">Mínimo de 6 caracteres</p>
        </div>

        <div>
          <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700">
            WhatsApp (opcional)
          </label>
          <IMaskInput
            id="whatsapp"
            mask="(00) 00000-0000"
            value={formData.whatsapp}
            onAccept={(value: string) => setFormData(prev => ({ ...prev, whatsapp: value }))}
            className="mt-1 block w-[98%] px-3 py-2 border border-gray-300 rounded-lg 
                     focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="(00) 00000-0000"
          />
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-center text-red-600"
          >
            {error}
          </motion.p>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading}
          className="w-[98%] py-3 px-4 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 
                   transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 
                   focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Enviando...' : 'Enviar Informações'}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default SignupForm;