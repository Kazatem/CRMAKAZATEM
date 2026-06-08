import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api';
import type { User } from '../types';

type AuthContextValue = {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('crm_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('crm_token'));
  const [loading, setLoading] = useState<boolean>(Boolean(token));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get('/auth/me')
      .then((response) => {
        setUser(response.data.user);
        setError(null);
      })
      .catch(() => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('crm_token');
        localStorage.removeItem('crm_user');
      })
      .finally(() => setLoading(false));
  }, [token]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/auth/login', {
        email,
        senha: password,
      });

      setUser(response.data.user);
      setToken(response.data.token);
      localStorage.setItem('crm_token', response.data.token);
      localStorage.setItem('crm_user', JSON.stringify(response.data.user));
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Não foi possível fazer login.');
      setUser(null);
      setToken(null);
      localStorage.removeItem('crm_token');
      localStorage.removeItem('crm_user');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('crm_token');
    localStorage.removeItem('crm_user');
  };

  const value = useMemo(
    () => ({ user, token, loading, error, login, logout }),
    [user, token, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
