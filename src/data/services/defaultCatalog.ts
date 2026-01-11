import { serviceDetails as facebook } from './facebook';
import { serviceDetails as tiktok } from './tiktok';
import { serviceDetails as instagram } from './instagram';
import { serviceDetails as telegram } from './telegram';

export type PlatformKey = 'facebook' | 'tiktok' | 'instagram' | 'telegram';

export type ServicePackage = {
  id: number | string;
  name: string;
  price: number;
  min: number;
  max: number;
  description?: string;
  speed?: string;
  warranty?: string;
  canCancel?: boolean;
  cancelFee?: number;
  dropRate?: string;
};

export type ServiceItem = {
  title: string;
  description?: string;
  category?: string;
  // icon is a React component in code; we keep it in defaults and don't persist it.
  icon?: any;
  packages: ServicePackage[];
};

export type ServiceCatalog = Record<PlatformKey, Record<string, ServiceItem>>;

/**
 * Default catalog shipped with the app.
 * This object should be used to seed localStorage on first run.
 */
export const defaultServiceCatalog: ServiceCatalog = {
  facebook: facebook as any,
  tiktok: tiktok as any,
  instagram: instagram as any,
  telegram: telegram as any,
};

export const SERVICE_CATALOG_STORAGE_KEY = 'serviceCatalog';

export function safeReadCatalog(): ServiceCatalog {
  try {
    const raw = localStorage.getItem(SERVICE_CATALOG_STORAGE_KEY);
    if (!raw) return defaultServiceCatalog;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return defaultServiceCatalog;

    // Deep-merge per platform so old/partial saved catalogs don't wipe defaults and cause blank pages.
    const merged: ServiceCatalog = {
      facebook: { ...(defaultServiceCatalog.facebook as any), ...((parsed as any).facebook || {}) } as any,
      tiktok: { ...(defaultServiceCatalog.tiktok as any), ...((parsed as any).tiktok || {}) } as any,
      instagram: { ...(defaultServiceCatalog.instagram as any), ...((parsed as any).instagram || {}) } as any,
      telegram: { ...(defaultServiceCatalog.telegram as any), ...((parsed as any).telegram || {}) } as any,
    };
    return merged;
  } catch {
    return defaultServiceCatalog;
  }
}


export function safeWriteCatalog(catalog: ServiceCatalog) {
  localStorage.setItem(SERVICE_CATALOG_STORAGE_KEY, JSON.stringify(catalog));
  window.dispatchEvent(new CustomEvent('serviceCatalogUpdated'));
}
