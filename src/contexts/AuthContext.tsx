import React, { createContext, useContext, useState, useEffect } from 'react';

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || '';

async function apiPost<T>(path: string, body: any): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return data as T;
}

async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  const data = await res.json().catch(() => ({}));
  return data as T;
}


interface UserInfo {
  username: string;
  email: string;
  phone: string;
  password: string;
  balance: number;
  totalSpent: number;
  totalOrders: number;
  role?: string;
}

interface AuthContextType {
  user: UserInfo | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<{ ok: boolean; message?: string; role?: string }>;
  logout: () => void;
  register: (username: string, email: string, phone: string, password: string) => Promise<{ ok: boolean; message?: string }>;
  updateUserInfo: (updates: Partial<UserInfo>) => void;
  syncUserData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Sync user data from DB so it works across browsers/devices
  const syncUserData = () => {
    if (!user?.username) return;
    void (async () => {
      try {
        const resp = await apiGet<{ ok: boolean; user?: any }>(
          `/api/users?username=${encodeURIComponent(user.username)}`
        );
        if (resp?.ok && resp.user) {
          const syncedUser: UserInfo = {
            username: String(resp.user.username ?? user.username),
            email: String(resp.user.email ?? user.email),
            phone: String(resp.user.phone ?? user.phone ?? ''),
            // keep local password only for legacy UI parts
            password: user.password,
            balance: Number(resp.user.balance ?? user.balance ?? 0),
            totalSpent: Number(resp.user.total_spent ?? resp.user.totalSpent ?? user.totalSpent ?? 0),
            totalOrders: Number(resp.user.total_orders ?? resp.user.totalOrders ?? user.totalOrders ?? 0),
          };
          setUser(syncedUser);
          localStorage.setItem('userData', JSON.stringify(syncedUser));
        }
      } catch (e) {
        // Ignore transient network errors
      }
    })();
  };

  // Load user data from localStorage on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem('isAuthenticated');
    const savedUser = localStorage.getItem('userData');
    
    if (savedAuth === 'true' && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('userData');
        localStorage.removeItem('isAuthenticated');
      }
    }
  }, []);

  // Auto sync user data from DB
  useEffect(() => {
    if (isAuthenticated && user) {
      const interval = setInterval(() => {
        syncUserData();
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [isAuthenticated, user?.username]);

  // Sync immediately when DataContext reports balance changes (e.g. admin approve deposit)
  useEffect(() => {
    const onBal = () => syncUserData();
    window.addEventListener('balanceUpdated', onBal);
    return () => window.removeEventListener('balanceUpdated', onBal);
  }, [user?.username, isAuthenticated]);

  // Listen for custom userDataUpdated event from DataContext
  useEffect(() => {
    const handleUserDataUpdated = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && user && customEvent.detail.username === user.username) {
        setUser(customEvent.detail);
      }
    };

    window.addEventListener('userDataUpdated', handleUserDataUpdated);
    
    return () => {
      window.removeEventListener('userDataUpdated', handleUserDataUpdated);
    };
  }, [user?.username]);

  const register = async (username: string, email: string, phone: string, password: string) => {
    // Register should NOT auto-login.
    // This avoids confusing UX on production (user expects to be redirected to the login screen).
    // The user list is still managed by DataContext/localStorage for legacy/demo parts of the UI.

    try {
      const resp = await apiPost<{ ok: boolean; message?: string }>('/api/register', {
        username,
        email,
        phone,
        password,
      });

      if (!resp.ok) {
        return { ok: false, message: resp.message || 'Đăng ký thất bại' };
      }

      return { ok: true };
    } catch (e) {
      console.warn('Server register failed.', e);
      return { ok: false, message: 'Không thể kết nối máy chủ để đăng ký' };
    }
  };

  const login = async (username: string, password: string) => {
    // Prefer server auth so the same account works across browsers/devices
    try {
      const resp = await apiPost<{ ok: boolean; message?: string; user?: any }>('/api/login', {
        username,
        password,
      });

      if (resp.ok && resp.user) {
        const userData: UserInfo = {
          username: resp.user.username,
          email: resp.user.email,
          phone: resp.user.phone || '',
          // Keep password locally only for legacy/demo parts of the UI
          password,
          balance: resp.user.balance ?? 0,
          totalSpent: resp.user.totalSpent ?? resp.user.total_spent ?? 0,
          totalOrders: resp.user.totalOrders ?? resp.user.total_orders ?? 0,
          role: resp.user.role || resp.user.user_role || resp.user.is_admin ? 'admin' : 'user',
        };

        setUser(userData);
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('isAuthenticated', 'true');
        setIsAuthenticated(true);
        return { ok: true, role: userData.role };
      }

      return { ok: false, message: resp?.message || 'Đăng nhập thất bại' };
    } catch (e) {
      console.warn('Server login failed.', e);
      return { ok: false, message: 'Không thể kết nối máy chủ để đăng nhập' };
    }
  };

  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
    setUser(null);
  };

  const updateUserInfo = (updates: Partial<UserInfo>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('userData', JSON.stringify(updatedUser));
      
      // Also update in allUsers
      const allUsersData = localStorage.getItem('allUsers');
      if (allUsersData) {
        try {
          const allUsers = JSON.parse(allUsersData);
          const userIndex = allUsers.findIndex((u: any) => u.username === user.username);
          
          if (userIndex !== -1) {
            allUsers[userIndex] = {
              ...allUsers[userIndex],
              ...updates,
            };
            localStorage.setItem('allUsers', JSON.stringify(allUsers));
          }
        } catch (error) {
          console.error('Error updating allUsers:', error);
        }
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        register,
        updateUserInfo,
        syncUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
