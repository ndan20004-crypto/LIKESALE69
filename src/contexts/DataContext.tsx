import React, { createContext, useContext, useState, useEffect } from 'react';
import { sendTelegramNotification } from '../config/telegram';
import {
  defaultServiceCatalog,
  safeReadCatalog,
  safeWriteCatalog,
  ServiceCatalog,
  PlatformKey,
} from '../data/services/defaultCatalog';

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || '';

async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  const data = await res.json().catch(() => ({}));
  return data as T;
}

async function apiPost<T>(path: string, body: any): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return data as T;
}

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
   * Danh sách nội dung bình luận (mỗi dòng 1 comment).
   * Chỉ có ở các dịch vụ tăng comment.
   */
  comments?: string[];
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
  addDeposit: (deposit: Omit<Deposit, 'id' | 'createdAt'>) => Promise<Deposit>;
  updateDeposit: (id: string, updates: Partial<Deposit>) => Promise<void>;
  markDepositTransferred: (id: string) => Promise<void>;
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

  // Load data on mount.
  // Priority:
  // 1) Supabase DB through /api endpoints (works across browsers/devices)
  // 2) localStorage fallback (legacy/demo)
  useEffect(() => {
    let cancelled = false;

    const loadFromLocal = () => {
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
    };

    const loadFromApi = async () => {
      try {
        const u = await apiGet<{ ok: boolean; users?: any[] }>('/api/users');
        const o = await apiGet<{ ok: boolean; orders?: any[] }>('/api/orders');
        const d = await apiGet<{ ok: boolean; deposits?: any[] }>('/api/deposits');

        if (!cancelled) {
          if (u && u.ok && Array.isArray(u.users)) {
            // Map DB fields -> UI fields
            setUsers(
              u.users.map((x: any) => ({
                id: String(x.id ?? ''),
                username: String(x.username ?? ''),
                email: String(x.email ?? ''),
                phone: String(x.phone ?? ''),
                password: '',
                balance: Number(x.balance ?? 0),
                totalSpent: Number(x.total_spent ?? x.totalSpent ?? 0),
                totalOrders: Number(x.total_orders ?? x.totalOrders ?? 0),
                createdAt: String(x.created_at ?? x.createdAt ?? new Date().toISOString()),
                status: (String(x.status ?? 'active') as any) || 'active',
              }))
            );
          }



          if (o && o.ok && Array.isArray(o.orders)) {
            setOrders(
              o.orders.map((x: any) => ({
                id: String(x.id),
                userId: String(x.user_id ?? x.userId ?? ''),
                username: String(x.username ?? ''),
                service: String(x.service ?? ''),
                platform: String(x.platform ?? ''),
                link: String(x.link ?? ''),
                quantity: Number(x.quantity ?? 0),
                price: Number(x.price ?? 0),
                comments: Array.isArray(x.comments) ? x.comments.map(String) : undefined,
                reactionType: x.reaction_type ? String(x.reaction_type) : (x.reactionType ? String(x.reactionType) : undefined),
                status: String(x.status ?? 'pending') as any,
                createdAt: String(x.created_at ?? x.createdAt ?? new Date().toISOString()),
                completedAt: x.completed_at ? String(x.completed_at) : (x.completedAt ? String(x.completedAt) : undefined),
              }))
            );
          }
          if (d && d.ok && Array.isArray(d.deposits)) {
            setDeposits(
              d.deposits.map((x: any) => ({
                id: String(x.id),
                userId: String(x.user_id ?? x.userId ?? ''),
                username: String(x.username ?? ''),
                amount: Number(x.amount ?? 0),
                method: String(x.method ?? ''),
                status: String(x.status ?? 'pending') as any,
                createdAt: String(x.created_at ?? x.createdAt ?? new Date().toISOString()),
                transferredAt: x.transferred_at ? String(x.transferred_at) : undefined,
                completedAt: x.completed_at ? String(x.completed_at) : undefined,
                note: x.note ? String(x.note) : undefined,
              }))
            );
          }
        }
      } catch (e) {
        console.warn('API load failed, fallback to localStorage.', e);
        if (!cancelled) loadFromLocal();
      }
    };

    // Try API first; fallback to local
    loadFromApi();

    return () => {
      cancelled = true;
    };
  }, []);



  // Load admin editable configs from DB (Supabase) so it works across browsers/devices
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const sc = await apiGet<{ ok: boolean; config?: any }>('/api/config?key=serviceCatalog');
        if (!cancelled && sc?.ok && sc.config?.value) {
          setServiceCatalog(sc.config.value as any);
          safeWriteCatalog(sc.config.value as any);
        }
      } catch {}

      try {
        const ds = await apiGet<{ ok: boolean; config?: any }>('/api/config?key=depositSettings');
        if (!cancelled && ds?.ok && ds.config?.value) {
          const next = { ...defaultDepositSettings, ...(ds.config.value as any) } as any;
          setDepositSettings(next);
          safeWriteDepositSettings(next);
        }
      } catch {}
    })();
    return () => {
      cancelled = true;
    };
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
    // Optimistic update UI
    setUsers(prev => prev.map(u => (u.id === id ? { ...u, ...updates } : u)));

    // Persist to DB (best-effort)
    const target = users.find(u => u.id === id);
    const username = target?.username || updates.username;
    if (!username) return;

    void (async () => {
      try {
        const resp = await apiPost<{ ok: boolean; user?: any }>('/api/users', {
          username,
          updates: {
            phone: updates.phone,
            balance: updates.balance,
            totalSpent: updates.totalSpent,
            totalOrders: updates.totalOrders,
            status: updates.status,
          },
        });

        if (resp?.ok && resp.user) {
          setUsers(prev =>
            prev.map(u =>
              u.id === id
                ? {
                    ...u,
                    ...{
                      phone: resp.user.phone ?? u.phone,
                      balance: Number(resp.user.balance ?? u.balance),
                      totalSpent: Number(resp.user.total_spent ?? resp.user.totalSpent ?? u.totalSpent),
                      totalOrders: Number(resp.user.total_orders ?? resp.user.totalOrders ?? u.totalOrders),
                      status: (resp.user.status ?? u.status) as any,
                    },
                  }
                : u
            )
          );
        }
      } catch (e) {
        console.warn('updateUser DB failed (fallback localStorage only).', e);
      }
    })();
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  const addOrder = (order: Omit<Order, 'id' | 'createdAt'>) => {
    // Optimistic UI
    const localId = Date.now().toString();
    const createdAt = new Date().toISOString();
    const optimistic: Order = { ...order, id: localId, createdAt };
    setOrders(prev => [optimistic, ...prev]);

    // Update user's totals/balance locally (optimistic)
    const user = users.find(u => u.username === order.username);
    if (user) {
      updateUser(user.id, {
        totalOrders: user.totalOrders + 1,
        totalSpent: user.totalSpent + order.price,
        balance: user.balance - order.price,
      });
    }

    // Persist to DB (best-effort)
    void (async () => {
      try {
        const resp = await apiPost<{ ok: boolean; order?: any; message?: string }>('/api/orders', {
          userId: order.userId,
          username: order.username,
          service: order.service,
          platform: order.platform,
          link: order.link,
          quantity: order.quantity,
          price: order.price,
          comments: order.comments,
          reactionType: order.reactionType,
          status: order.status,
          completedAt: order.completedAt,
        });

        if (resp?.ok && resp.order) {
          const saved: Order = {
            id: String(resp.order.id),
            userId: String(resp.order.user_id ?? order.userId ?? ''),
            username: String(resp.order.username ?? order.username),
            service: String(resp.order.service ?? order.service),
            platform: String(resp.order.platform ?? order.platform),
            link: String(resp.order.link ?? order.link),
            quantity: Number(resp.order.quantity ?? order.quantity),
            price: Number(resp.order.price ?? order.price),
            comments: Array.isArray(resp.order.comments) ? resp.order.comments.map(String) : order.comments,
            reactionType: resp.order.reaction_type ? String(resp.order.reaction_type) : order.reactionType,
            status: String(resp.order.status ?? order.status) as any,
            createdAt: String(resp.order.created_at ?? createdAt),
            completedAt: resp.order.completed_at ? String(resp.order.completed_at) : order.completedAt,
          };

          setOrders(prev => [saved, ...prev.filter(x => x.id !== localId)]);
        }
      } catch (e) {
        console.warn('addOrder DB failed, fallback localStorage only.', e);
      }
    })();

    // Telegram notify
    sendTelegramNotification('order', optimistic);
  };

  const updateOrder = (id: string, updates: Partial<Order>) => {
    // Optimistic UI
    setOrders(prev => prev.map(order => (order.id === id ? { ...order, ...updates } : order)));

    // Persist to DB (best-effort)
    void (async () => {
      try {
        const resp = await apiPost<{ ok: boolean; order?: any }>('/api/orders_update', {
          id,
          updates: {
            status: updates.status,
            completedAt: updates.completedAt,
          },
        });

        if (resp?.ok && resp.order) {
          const updated: Order = {
            id: String(resp.order.id),
            userId: String(resp.order.user_id ?? ''),
            username: String(resp.order.username ?? ''),
            service: String(resp.order.service ?? ''),
            platform: String(resp.order.platform ?? ''),
            link: String(resp.order.link ?? ''),
            quantity: Number(resp.order.quantity ?? 0),
            price: Number(resp.order.price ?? 0),
            comments: Array.isArray(resp.order.comments) ? resp.order.comments.map(String) : undefined,
            reactionType: resp.order.reaction_type ? String(resp.order.reaction_type) : undefined,
            status: String(resp.order.status ?? 'pending') as any,
            createdAt: String(resp.order.created_at ?? new Date().toISOString()),
            completedAt: resp.order.completed_at ? String(resp.order.completed_at) : undefined,
          };
          setOrders(prev => prev.map(o => (o.id === id ? updated : o)));
        }
      } catch (e) {
        console.warn('updateOrder DB failed.', e);
      }
    })();
  };

  const addDeposit = async (deposit: Omit<Deposit, 'id' | 'createdAt'>): Promise<Deposit> => {
    // Create in DB so admin can see across browsers
    try {
      const resp = await apiPost<{ ok: boolean; deposit?: any; message?: string }>('/api/deposits', {
        userId: deposit.userId,
        username: deposit.username,
        amount: deposit.amount,
        method: deposit.method,
        status: deposit.status,
        note: deposit.note,
        transferredAt: deposit.transferredAt,
        completedAt: deposit.completedAt,
      });

      if (resp?.ok && resp.deposit) {
        const created: Deposit = {
          id: String(resp.deposit.id),
          userId: String(resp.deposit.user_id ?? deposit.userId),
          username: String(resp.deposit.username ?? deposit.username),
          amount: Number(resp.deposit.amount ?? deposit.amount),
          method: String(resp.deposit.method ?? deposit.method),
          status: String(resp.deposit.status ?? deposit.status) as any,
          createdAt: String(resp.deposit.created_at ?? new Date().toISOString()),
          transferredAt: resp.deposit.transferred_at ? String(resp.deposit.transferred_at) : undefined,
          completedAt: resp.deposit.completed_at ? String(resp.deposit.completed_at) : undefined,
          note: resp.deposit.note ? String(resp.deposit.note) : undefined,
        };

        setDeposits(prev => [created, ...prev.filter(d => d.id !== created.id)]);

        // Telegram notify on PENDING
        if (created.status === 'pending') sendTelegramNotification('deposit', created);

        return created;
      }
    } catch (e) {
      console.warn('addDeposit DB failed, fallback to localStorage only.', e);
    }

    // Fallback: local only (still works, but not cross-browser)
    const localDeposit: Deposit = {
      ...deposit,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setDeposits(prev => [...prev, localDeposit]);
    if (localDeposit.status === 'pending') sendTelegramNotification('deposit', localDeposit);
    return localDeposit;
  };


  const updateDeposit = async (id: string, updates: Partial<Deposit>): Promise<void> => {
    const deposit = deposits.find(d => d.id === id);

    // Optimistic UI
    setDeposits(prev => prev.map(d => (d.id === id ? { ...d, ...updates } : d)));

    // Telegram notify on status transferred
    if (deposit && updates.status === 'transferred' && deposit.status !== 'transferred') {
      const transferredDeposit: Deposit = {
        ...deposit,
        ...updates,
        transferredAt: updates.transferredAt || new Date().toISOString(),
      };
      sendTelegramNotification('deposit', transferredDeposit);
    }

    // Persist to DB (best-effort)
    try {
      const resp = await apiPost<{ ok: boolean; deposit?: any }>('/api/deposits_update', {
        id,
        updates: {
          status: updates.status,
          note: updates.note,
          transferredAt: updates.transferredAt,
          completedAt: updates.completedAt,
        },
      });

      if (resp?.ok && resp.deposit) {
        const updated: Deposit = {
          id: String(resp.deposit.id),
          userId: String(resp.deposit.user_id ?? deposit?.userId ?? ''),
          username: String(resp.deposit.username ?? deposit?.username ?? ''),
          amount: Number(resp.deposit.amount ?? deposit?.amount ?? 0),
          method: String(resp.deposit.method ?? deposit?.method ?? ''),
          status: String(resp.deposit.status ?? updates.status ?? deposit?.status ?? 'pending') as any,
          createdAt: String(resp.deposit.created_at ?? deposit?.createdAt ?? new Date().toISOString()),
          transferredAt: resp.deposit.transferred_at ? String(resp.deposit.transferred_at) : undefined,
          completedAt: resp.deposit.completed_at ? String(resp.deposit.completed_at) : undefined,
          note: resp.deposit.note ? String(resp.deposit.note) : undefined,
        };

        setDeposits(prev => prev.map(d => (d.id === id ? updated : d)));

        // If completed -> refresh that user's balance from DB so all browsers see the same
        if (deposit && updates.status === 'completed' && deposit.status !== 'completed') {
          const u = await apiGet<{ ok: boolean; user?: any }>(`/api/users?username=${encodeURIComponent(deposit.username)}`);
          if (u?.ok && u.user) {
            setUsers(prev =>
              prev.map(x =>
                x.username === deposit.username
                  ? {
                      ...x,
                      balance: Number(u.user.balance ?? x.balance),
                      totalSpent: Number(u.user.total_spent ?? u.user.totalSpent ?? x.totalSpent),
                      totalOrders: Number(u.user.total_orders ?? u.user.totalOrders ?? x.totalOrders),
                    }
                  : x
              )
            );
            window.dispatchEvent(new Event('balanceUpdated'));
          }
        }
      }
    } catch (e) {
      console.warn('updateDeposit DB failed (fallback localStorage only).', e);
    }
  };

  const markDepositTransferred = async (id: string): Promise<void> => {
    await updateDeposit(id, {
      status: 'transferred',
      transferredAt: new Date().toISOString(),
    });
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

    // Persist to DB (best-effort)
    void (async () => {
      try {
        await apiPost('/api/config', { key: 'serviceCatalog', value: next });
      } catch (e) {
        console.warn('updateServiceCatalog DB failed.', e);
      }
    })();
  };

  const updateServiceItem = (platform: PlatformKey, serviceKey: string, updates: Partial<any>) => {
    setServiceCatalog(prev => {
      const next = { ...prev } as any;
      next[platform] = { ...(next[platform] || {}) };
      next[platform][serviceKey] = { ...(next[platform][serviceKey] || {}), ...updates };
      safeWriteCatalog(next);
      void (async () => {
        try { await apiPost('/api/config', { key: 'serviceCatalog', value: next }); }
        catch (e) { console.warn('serviceCatalog DB save failed.', e); }
      })();
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
      void (async () => {
        try { await apiPost('/api/config', { key: 'serviceCatalog', value: next }); }
        catch (e) { console.warn('serviceCatalog DB save failed.', e); }
      })();
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
      void (async () => {
        try { await apiPost('/api/config', { key: 'serviceCatalog', value: next }); }
        catch (e) { console.warn('serviceCatalog DB save failed.', e); }
      })();
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
      void (async () => {
        try { await apiPost('/api/config', { key: 'serviceCatalog', value: next }); }
        catch (e) { console.warn('serviceCatalog DB save failed.', e); }
      })();
      return next;
    });
  };

  const updateDepositSettings = (next: DepositSettings) => {
    setDepositSettings(next);
    safeWriteDepositSettings(next);

    // Persist to DB (best-effort)
    void (async () => {
      try {
        await apiPost('/api/config', { key: 'depositSettings', value: next });
      } catch (e) {
        console.warn('updateDepositSettings DB failed.', e);
      }
    })();
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
        markDepositTransferred,
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