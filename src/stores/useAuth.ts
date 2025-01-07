import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserData {
  user_nome?: string;
  user_perfil?: string;
  user_whatsApp?: string;
}

interface AuthState {
  userUid: string | null;
  empresaUid: string | null;
  userData: UserData | null;
  setAuth: (userUid: string, empresaUid: string, userData: UserData) => void;
  clearAuth: () => void;
}

const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      userUid: null,
      empresaUid: null,
      userData: null,
      setAuth: (userUid, empresaUid, userData) => set({ userUid, empresaUid, userData }),
      clearAuth: () => set({ userUid: null, empresaUid: null, userData: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuth;
