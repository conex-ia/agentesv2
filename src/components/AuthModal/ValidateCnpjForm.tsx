import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2 } from 'lucide-react';
import { IMaskInput } from 'react-imask';
import useAuthModal from '../../hooks/useAuthModal';

const ValidateCnpjForm = () => {
  const { setView } = useAuthModal();
  const [cnpj, setCnpj] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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
          acao: 'validarCnpj',
          cnpj: cnpj.replace(/\D/g, ''),
        }),
      });

      const data = await response.json();

      if (data.resultado === 'valido') {
        // Store company data in localStorage for the next step
        localStorage.setItem('companyData', JSON.stringify({
          cnpj: cnpj.replace(/\D/g, ''),
          nome: data.nome
        }));
        setView('complete-signup');
      } else {
        setError('CNPJ não encontrado');
      }
    } catch (err) {
      setError('Erro ao validar CNPJ. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full flex flex-col items-center justify-center space-y-8"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center"
      >
        <Building2 className="w-10 h-10 text-emerald-500" />
      </motion.div>

      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Confirmar Empresa</h2>
        <p className="mt-2 text-gray-600">Digite o CNPJ da sua empresa para continuar</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <div>
          <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700">
            CNPJ
          </label>
          <IMaskInput
            id="cnpj"
            mask="00.000.000/0000-00"
            value={cnpj}
            onAccept={(value: string) => setCnpj(value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg 
                     focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="00.000.000/0000-00"
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
          disabled={isLoading || cnpj.length < 18}
          className="w-full py-3 px-4 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 
                   transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 
                   focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Validando...' : 'Confirmar'}
        </motion.button>
      </form>

      <p className="text-center text-sm text-gray-600">
        Já tem uma conta?{' '}
        <button
          onClick={() => setView('login')}
          className="text-emerald-500 hover:text-emerald-600 font-medium"
        >
          Faça login!
        </button>
      </p>
    </motion.div>
  );
};

export default ValidateCnpjForm;