import { create } from 'zustand';

type AuthView = 'login' | 'signup' | 'complete-signup' | 'company-created';

interface CompanyCreatedData {
  empresaUid: string;
  userUid: string;
  userNome: string;
  email: string;
}

interface AuthModalStore {
  isOpen: boolean;
  view: AuthView;
  companyData: CompanyCreatedData | null;
  openModal: (view: AuthView) => void;
  closeModal: () => void;
  setView: (view: AuthView) => void;
  setCompanyData: (data: CompanyCreatedData | null) => void;
}

const useAuthModal = create<AuthModalStore>((set) => ({
  isOpen: false,
  view: 'login',
  companyData: null,
  openModal: (view) => set({ isOpen: true, view }),
  closeModal: () => set({ isOpen: false, companyData: null, view: 'login' }),
  setView: (view) => set({ view }),
  setCompanyData: (data) => set({ companyData: data, view: 'company-created' }),
}));

export default useAuthModal;