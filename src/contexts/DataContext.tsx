import React, { createContext, useContext, useState, useEffect } from 'react';
import { sendTelegramNotification } from '../config/telegram';
import {
  defaultServiceCatalog,
  safeReadCatalog,
  safeWriteCatalog,
  ServiceCatalog,
  PlatformKey,
} from '../data/services/defaultCatalog';

export type DepositSettings = {
  bankName: string;
  accountNumber: string;
  accountName: string;
  branch?: string;
  minDeposit: number;
  transferTemplate: string; // e.g. "NAP {username} {amount}"
  notes: string[];
};

const DEPOSIT_SETTINGS_STORAGE_KEY = 'depositSettings';

export const defaultDepositSettings: DepositSettings = {
  bankName: 'MB Bank',
  accountNumber: '0123456789',
  accountName: 'NGUYEN VAN A',
  branch: 'Chi nhánh Hà Nội',
  minDeposit: 10000,
  transferTemplate: 'NAP {username} {amount}',
  notes: [
    'Chuyển khoản đúng nội dung để được cộng tiền tự động',
    'Thời gian xử lý: 1-5 phút',
    'Nếu sau 15 phút chưa được cộng tiền, liên hệ admin',
    'Không chuyển khoản dưới {minDeposit}đ',
  ],
  qrImageDataUrl: '' ,
};

function safeReadDepositSettings(): DepositSettings {
  try {
    const raw = localStorage.getItem(DEPOSIT_SETTINGS_STORAGE_KEY);
    if (!raw) return defaultDepositSettings;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return defaultDepositSettings;
    return { ...defaultDepositSettings, ...parsed } as DepositSettings;
  } catch {
    return defaultDepositSettings;
  }
}

function safeWriteDepositSettings(next: DepositSettings) {
  localStorage.setItem(DEPOSIT_SETTINGS_STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent('depositSettingsUpdated'));
}


export interface User {
  id: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  balance: number;
  totalSpent: number;
  totalOrders: number;
  createdAt: string;
  status: 'active' | 'blocked';
}

export interface Order {
  id: string;
  userId: string;
  username: string;
  service: string;
  platform: string;
  link: string;
  quantity: number;
  price: number;
  /**
   * Facebook reactions for dịch vụ "tăng like bài viết".
   * Đơn cũ có thể không có trường này.
   */
  reactionType?: 'like' | 'love' | 'care' | 'haha' | 'wow';
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
  completedAt?: string;
}

export interface Deposit {
  id: string;
  userId: string;
  username: string;
  amount: number;
  method: string;
  // pending: đã tạo lệnh nạp
  // transferred: người dùng bấm "Đã thanh toán"
  // completed: admin duyệt và cộng tiền
  status: 'pending' | 'transferred' | 'completed' | 'cancelled';
  createdAt: string;
  transferredAt?: string;
  completedAt?: string;
  note?: string;
}

interface DataContextType {
  users: User[];
  orders: Order[];
  deposits: Deposit[];
  addUser: (user: Omit<User, 'id' | 'createdAt' | 'status'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  addOrder: (order: Omit<Order, 'id' | 'createdAt'>) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  addDeposit: (deposit: Omit<Deposit, 'id' | 'createdAt'>) => Deposit;
  updateDeposit: (id: string, updates: Partial<Deposit>) => void;
  markDepositTransferred: (id: string) => void;
  resetAllData: () => void;
  getUserById: (id: string) => User | undefined;
  getUserByUsername: (username: string) => User | undefined;

  // Admin editable configs
  serviceCatalog: ServiceCatalog;
  updateServiceCatalog: (next: ServiceCatalog) => void;
  updateServiceItem: (platform: PlatformKey, serviceKey: string, updates: Partial<any>) => void;
  updateServicePackage: (
    platform: PlatformKey,
    serviceKey: string,
    pkgId: number | string,
    updates: Partial<any>
  ) => void;
  addServicePackage: (platform: PlatformKey, serviceKey: string, pkg: any) => void;
  deleteServicePackage: (platform: PlatformKey, serviceKey: string, pkgId: number | string) => void;

  depositSettings: DepositSettings;
  updateDepositSettings: (next: DepositSettings) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [deposits, setDeposits] = useState<Deposit[]>([]);

  const [serviceCatalog, setServiceCatalog] = useState<ServiceCatalog>(() => {
    // Seed localStorage on first run
    const existing = localStorage.getItem('serviceCatalog');
    if (!existing) {
      safeWriteCatalog(defaultServiceCatalog);
      return defaultServiceCatalog;
    }
    const catalog = safeReadCatalog();
    // Persist merged catalog so subsequent loads are stable.
    safeWriteCatalog(catalog);
    return catalog;
  });

  const [depositSettings, setDepositSettings] = useState<DepositSettings>(() => {
    const existing = localStorage.getItem('depositSettings');
    if (!existing) {
      safeWriteDepositSettings(defaultDepositSettings);
      return defaultDepositSettings;
    }
    return safeReadDepositSettings();
  });

  // Auto-update order status from "pending" to "processing" after 3 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      setOrders(prev => {
        let hasChanges = false;
        const updatedOrders = prev.map(order => {
          if (order.status === 'pending') {
            const orderTime = new Date(order.createdAt).getTime();
            const timeDiff = (now - orderTime) / 60; // minutes
            
            if (timeDiff >= 3) {
              hasChanges = true;
              return { ...order, status: 'processing' as const };
            }
          }
          return order;
        });
        
        return hasChanges ? updatedOrders : prev;
      });
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, []);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedUsers = localStorage.getItem('allUsers');
    const savedOrders = localStorage.getItem('allOrders');
    const savedDeposits = localStorage.getItem('allDeposits');

    if (savedUsers) {
      try {
        setUsers(JSON.parse(savedUsers));
      } catch (error) {
        console.error('Error loading users:', error);
      }
    }

    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (error) {
        console.error('Error loading orders:', error);
      }
    }

    if (savedDeposits) {
      try {
        setDeposits(JSON.parse(savedDeposits));
      } catch (error) {
        console.error('Error loading deposits:', error);
      }
    }
  }, []);

  // Save users to localStorage whenever it changes
  useEffect(() => {
    if (users.length > 0 || localStorage.getItem('allUsers')) {
      localStorage.setItem('allUsers', JSON.stringify(users));
      // Dispatch custom event để notify tất cả components
      window.dispatchEvent(new Event('balanceUpdated'));
    }
  }, [users]);

  // Save orders to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('allOrders', JSON.stringify(orders));
  }, [orders]);

  // Save deposits to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('allDeposits', JSON.stringify(deposits));
  }, [deposits]);

  const addUser = (user: Omit<User, 'id' | 'createdAt' | 'status'>) => {
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'active',
    };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => {
      const newUsers = prev.map(user => 
        user.id === id ? { ...user, ...updates } : user
      );
      return newUsers;
    });
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  const addOrder = (order: Omit<Order, 'id' | 'createdAt'>) => {
    const newOrder: Order = {
      ...order,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setOrders(prev => [...prev, newOrder]);

    // Update user's totalOrders and totalSpent
    const user = users.find(u => u.username === order.username);
    if (user) {
      updateUser(user.id, {
        totalOrders: user.totalOrders + 1,
        totalSpent: user.totalSpent + order.price,
        balance: user.balance - order.price,
      });
    }

    // GỬI THÔNG BÁO TELEGRAM KHI CÓ ĐƠN MỚI
    sendTelegramNotification('order', newOrder);
  };

  const updateOrder = (id: string, updates: Partial<Order>) => {
    setOrders(prev =>
      prev.map(order => (order.id === id ? { ...order, ...updates } : order))
    );
  };

  const addDeposit = (deposit: Omit<Deposit, 'id' | 'createdAt'>): Deposit => {
    const newDeposit: Deposit = {
      ...deposit,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setDeposits(prev => [...prev, newDeposit]);

    // GỬI THÔNG BÁO TELEGRAM KHI CÓ YÊU CẦU NẠP TIỀN (PENDING)
    if (newDeposit.status === 'pending') {
      sendTelegramNotification('deposit', newDeposit);
    }

    // If deposit is completed, update user's balance
    if (newDeposit.status === 'completed') {
      const user = users.find(u => u.username === newDeposit.username);
      if (user) {
        updateUser(user.id, {
          balance: user.balance + newDeposit.amount,
        });
      }
    }

    return newDeposit;
  };


  const updateDeposit = (id: string, updates: Partial<Deposit>) => {
    const deposit = deposits.find(d => d.id === id);

    // Nếu người dùng bấm "Đã thanh toán" -> gửi Telegram để admin biết.
    if (deposit && updates.status === 'transferred' && deposit.status !== 'transferred') {
      const transferredDeposit: Deposit = {
        ...deposit,
        ...updates,
        transferredAt: updates.transferredAt || new Date().toISOString(),
      };
      sendTelegramNotification('deposit', transferredDeposit);
    }
    if (deposit && updates.status === 'completed' && deposit.status !== 'completed') {
      // Deposit just got completed, update user balance
      const user = users.find(u => u.username === deposit.username);
      if (user) {
        updateUser(user.id, {
          balance: user.balance + deposit.amount,
        });
      }
    }

    setDeposits(prev =>
      prev.map(deposit => (deposit.id === id ? { ...deposit, ...updates } : deposit))
    );
  };

  const resetAllData = () => {
    setUsers([]);
    setOrders([]);
    setDeposits([]);
    localStorage.removeItem('allUsers');
    localStorage.removeItem('allOrders');
    localStorage.removeItem('allDeposits');
    localStorage.removeItem('userData');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('rememberMe');
    localStorage.removeItem('rememberedUsername');
  };

  const getUserById = (id: string) => {
    return users.find(user => user.id === id);
  };

  const getUserByUsername = (username: string) => {
    return users.find(user => user.username === username);
  };

  // --- Service catalog helpers (admin editable) ---
  const updateServiceCatalog = (next: ServiceCatalog) => {
    setServiceCatalog(next);
    safeWriteCatalog(next);
  };

  const updateServiceItem = (platform: PlatformKey, serviceKey: string, updates: Partial<any>) => {
    setServiceCatalog(prev => {
      const next = { ...prev } as any;
      next[platform] = { ...(next[platform] || {}) };
      next[platform][serviceKey] = { ...(next[platform][serviceKey] || {}), ...updates };
      safeWriteCatalog(next);
      return next;
    });
  };

  const updateServicePackage = (
    platform: PlatformKey,
    serviceKey: string,
    pkgId: number | string,
    updates: Partial<any>
  ) => {
    setServiceCatalog(prev => {
      const next = { ...prev } as any;
      const svc = next?.[platform]?.[serviceKey];
      if (!svc) return prev;
      const pkgs = Array.isArray(svc.packages) ? svc.packages : [];
      svc.packages = pkgs.map((p: any) => (p.id === pkgId ? { ...p, ...updates } : p));
      safeWriteCatalog(next);
      return next;
    });
  };

  const addServicePackage = (platform: PlatformKey, serviceKey: string, pkg: any) => {
    setServiceCatalog(prev => {
      const next = { ...prev } as any;
      const svc = next?.[platform]?.[serviceKey];
      if (!svc) return prev;
      const pkgs = Array.isArray(svc.packages) ? svc.packages : [];
      svc.packages = [...pkgs, pkg];
      safeWriteCatalog(next);
      return next;
    });
  };

  const deleteServicePackage = (platform: PlatformKey, serviceKey: string, pkgId: number | string) => {
    setServiceCatalog(prev => {
      const next = { ...prev } as any;
      const svc = next?.[platform]?.[serviceKey];
      if (!svc) return prev;
      const pkgs = Array.isArray(svc.packages) ? svc.packages : [];
      svc.packages = pkgs.filter((p: any) => p.id !== pkgId);
      safeWriteCatalog(next);
      return next;
    });
  };

  const updateDepositSettings = (next: DepositSettings) => {
    setDepositSettings(next);
    safeWriteDepositSettings(next);
  };

  // Sync across tabs
  useEffect(() => {
    const onCatalog = () => setServiceCatalog(safeReadCatalog());
    const onDeposit = () => setDepositSettings(safeReadDepositSettings());
    window.addEventListener('serviceCatalogUpdated', onCatalog as any);
    window.addEventListener('depositSettingsUpdated', onDeposit as any);
    return () => {
      window.removeEventListener('serviceCatalogUpdated', onCatalog as any);
      window.removeEventListener('depositSettingsUpdated', onDeposit as any);
    };
  }, []);

  return (
    <DataContext.Provider
      value={{
        users,
        orders,
        deposits,
        addUser,
        updateUser,
        deleteUser,
        addOrder,
        updateOrder,
        addDeposit,
        updateDeposit,
        resetAllData,
        getUserById,
        getUserByUsername,

        serviceCatalog,
        updateServiceCatalog,
        updateServiceItem,
        updateServicePackage,
        addServicePackage,
        deleteServicePackage,

        depositSettings,
        updateDepositSettings,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

// Custom hook to get LIVE balance directly from localStorage
export function useBalance(username: string | undefined): number {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (!username) {
      setBalance(0);
      return;
    }

    const updateBalance = () => {
      const allUsersData = localStorage.getItem('allUsers');
      if (allUsersData) {
        try {
          const allUsers = JSON.parse(allUsersData);
          const user = allUsers.find((u: User) => u.username === username);
          if (user) {
            setBalance(user.balance);
          }
        } catch (error) {
          console.error('Error reading balance:', error);
        }
      }
    };

    // Update immediately
    updateBalance();

    // Update every second for real-time sync
    const interval = setInterval(updateBalance, 1000);

    // Listen to custom event
    window.addEventListener('balanceUpdated', updateBalance);

    return () => {
      clearInterval(interval);
      window.removeEventListener('balanceUpdated', updateBalance);
    };
  }, [username]);

  return balance;
}