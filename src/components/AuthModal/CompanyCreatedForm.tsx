import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserCheck } from 'lucide-react';
import useAuthModal from '../../hooks/useAuthModal';

const CompanyCreatedForm = () => {
  const { companyData, closeModal } = useAuthModal();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!companyData) return null;

  const handleSubmit = async (e: React.FormEvent) => {
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
          acao: 'loginUser',
          uidEmpresa: companyData.empresaUid,
          uidUser: companyData.userUid,
          email: companyData.email,
          senha: password,
        }),
      });

      const data = await response.json();

      if (data.status === 'logado') {
        closeModal();
        // Additional login success handling can be added here
      } else {
        setError('Senha incorreta. Por favor, tente novamente.');
      }
    } catch (err) {
      setError('Erro ao fazer login. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full flex flex-col items-center justify-center space-y-8 py-8"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center"
      >
        <UserCheck className="w-10 h-10 text-emerald-500" />
      </motion.div>

      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Empresa Criada com Sucesso!</h2>
        <p className="text-gray-600">Digite sua senha para acessar sua conta</p>
      </div>

      <div className="w-full max-w-sm space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Usuário:</span> {companyData.userNome}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">E-mail:</span> {companyData.email}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Senha
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg 
                       focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
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
            disabled={isLoading || !password}
            className="w-full py-3 px-4 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 
                     transition-all font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 
                     focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Entrando...' : 'Entrar na Conta'}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default CompanyCreatedForm;