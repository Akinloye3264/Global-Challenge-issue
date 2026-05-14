import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    const token = localStorage.getItem('afya_token');
    const userStr = localStorage.getItem('afya_user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setState({ user, token, isAuthenticated: true, isLoading: false });
      } catch {
        localStorage.removeItem('afya_token');
        localStorage.removeItem('afya_user');
        setState(s => ({ ...s, isLoading: false }));
      }
    } else {
      setState(s => ({ ...s, isLoading: false }));
    }
  }, []);

  function login(token: string, user: User) {
    localStorage.setItem('afya_token', token);
    localStorage.setItem('afya_user', JSON.stringify(user));
    setState({ user, token, isAuthenticated: true, isLoading: false });
  }

  function updateUser(user: User) {
    localStorage.setItem('afya_user', JSON.stringify(user));
    setState(s => ({ ...s, user }));
  }

  function logout() {
    localStorage.removeItem('afya_token');
    localStorage.removeItem('afya_user');
    setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
  }

  return (
    <AuthContext.Provider value={{ ...state, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
