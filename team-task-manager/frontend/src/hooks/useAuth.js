import { useAuthStore } from '../store/authStore.js';

export const useAuth = () => {
  const { token, user, setAuth, clearAuth } = useAuthStore();
  return { token, user, setAuth, clearAuth, isAuthenticated: !!token };
};
