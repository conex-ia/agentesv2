import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import ValidateCnpjForm from './ValidateCnpjForm';
import CompanyCreatedForm from './CompanyCreatedForm';
import useAuthModal from '../../hooks/useAuthModal';

const AuthModal = () => {
  const { isOpen, view, closeModal } = useAuthModal();

  const getForm = () => {
    switch (view) {
      case 'login':
        return <LoginForm />;
      case 'signup':
        return <ValidateCnpjForm />;
      case 'complete-signup':
        return <SignupForm />;
      case 'company-created':
        return <CompanyCreatedForm />;
      default:
        return null;
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
            onClick={closeModal}
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
                onClick={closeModal}
                className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gray-800 text-gray-400 hover:text-white flex items-center justify-center transition-colors z-10"
              >
                <X size={20} />
              </button>

              {/* Content */}
              <div className="bg-[#1F2937] rounded-xl shadow-xl overflow-hidden p-8">
                {getForm()}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;