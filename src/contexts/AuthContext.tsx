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


interface UserInfo {
  username: string;
  email: string;
  phone: string;
  password: string;
  balance: number;
  totalSpent: number;
  totalOrders: number;
}

interface AuthContextType {
  user: UserInfo | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (username: string, email: string, phone: string, password: string) => Promise<{ ok: boolean; message?: string }>;
  updateUserInfo: (updates: Partial<UserInfo>) => void;
  syncUserData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Sync user data from allUsers (called by interval and events)
  const syncUserData = () => {
    if (!user) return;
    
    const allUsersData = localStorage.getItem('allUsers');
    if (allUsersData) {
      try {
        const allUsers = JSON.parse(allUsersData);
        const currentUser = allUsers.find((u: any) => u.username === user.username);
        
        if (currentUser) {
          const syncedUser: UserInfo = {
            username: currentUser.username,
            email: currentUser.email,
            phone: currentUser.phone,
            password: currentUser.password,
            balance: currentUser.balance,
            totalSpent: currentUser.totalSpent,
            totalOrders: currentUser.totalOrders,
          };
          
          setUser(syncedUser);
          localStorage.setItem('userData', JSON.stringify(syncedUser));
        }
      } catch (error) {
        console.error('Error syncing user data:', error);
      }
    }
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

  // Auto sync user data every 500ms for real-time updates
  useEffect(() => {
    if (isAuthenticated && user) {
      const interval = setInterval(() => {
        syncUserData();
      }, 500);

      return () => clearInterval(interval);
    }
  }, [isAuthenticated, user?.username]);

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
          totalSpent: resp.user.totalSpent ?? 0,
          totalOrders: resp.user.totalOrders ?? 0,
        };

        setUser(userData);
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('isAuthenticated', 'true');
        setIsAuthenticated(true);
        return true;
      }
    } catch (e) {
      console.warn('Server login failed.', e);
    }

    return false;
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
