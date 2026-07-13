'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import api from '../lib/axios';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roleId: number;
  phone?: string;
  avatarUrl?: string;
  isActive: boolean;
  role?: {
    id: number;
    name: string;
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to decode JWT payload safely in browser
const decodeTokenPayload = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  // Load token and user details on startup
  useEffect(() => {
    const initAuth = async () => {
      if (typeof window !== 'undefined') {
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
          setToken(savedToken);
          const decoded = decodeTokenPayload(savedToken);
          if (decoded && decoded.id) {
            setUser({
              id: decoded.id,
              email: decoded.email,
              firstName: decoded.firstName || '',
              lastName: decoded.lastName || '',
              isActive: true,
              role: {
                id: decoded.roleId || 0,
                name: decoded.role || '',
                permissions: decoded.permissions || {}
              }
            } as any);
          } else {
            localStorage.removeItem('token');
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const res = await api.post('/users/login', { email, password: pass });
      // NestJS wraps response inside `data` property because of TransformInterceptor
      const responseData = res.data.data;
      const { accessToken } = responseData;
      
      localStorage.setItem('token', accessToken);
      setToken(accessToken);
      
      const decoded = decodeTokenPayload(accessToken);
      const userFromToken = decoded ? {
        id: decoded.id,
        email: decoded.email,
        firstName: decoded.firstName || '',
        lastName: decoded.lastName || '',
        isActive: true,
        role: {
          id: decoded.roleId || 0,
          name: decoded.role || '',
          permissions: decoded.permissions || {}
        }
      } : null;
      
      setUser(userFromToken as any);
      
      if (decoded?.role === 'ADMIN') {
        router.push('/admin');
      } else if (decoded?.role === 'STUDENT') {
        router.push('/profile/academic');
      } else {
        router.push('/profile');
      }
    } catch (error) {
      setLoading(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any) => {
    setLoading(true);
    try {
      // Direct call to user registration endpoint
      await api.post('/users/register', userData);
      router.push('/login');
    } catch (error) {
      setLoading(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    router.push('/login');
  };

  const refreshUser = async () => {
    if (token) {
      const decoded = decodeTokenPayload(token);
      if (decoded && decoded.id) {
        try {
          const res = await api.get(`/users/${decoded.id}`);
          setUser(res.data.data);
        } catch (err) {
          console.error('Error refreshing user details:', err);
        }
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
