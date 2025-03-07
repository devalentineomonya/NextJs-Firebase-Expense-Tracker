import { create } from "zustand";
type AuthState = {
  isAuthenticating: boolean;
  setAuthState: (state: boolean) => void;
};
const useAuthStore = create<AuthState>((set) => ({
  isAuthenticating: false,
  setAuthState: (state) => set({ isAuthenticating: state }),
}));

export default useAuthStore;
