import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

/**
 * Simple, localStorage-backed “CMS” so Admin can edit texts on user pages.
 * This project currently uses localStorage for auth + data persistence, so we keep the same approach.
 */

export type HomePageContent = {
  welcomeTitle: string;
  welcomeSubtitle: string;
  walletTitle: string;
  walletSubtitle: string;
  depositButtonText: string;
  servicesTitle: string;
  infoTitle: string;
  infoItems: string[];
};

export type ContactPageContent = {
  pageTitle: string;
  pageSubtitle: string;

  zaloTitle: string;
  zaloSubtitle: string;
  zaloUrl: string;
  zaloButtonText: string;
  zaloPhoneText: string;

  telegramTitle: string;
  telegramSubtitle: string;
  telegramUrl: string;
  telegramButtonText: string;
  telegramHandleText: string;

  hotlineLabel: string;
  hotlineValue: string;
  emailLabel: string;
  emailValue: string;
  supportTimeLabel: string;
  supportTimeValue: string;

  faqTitle: string;
  faqs: { q: string; a: string }[];

  tipsTitle: string;
  tips: string[];

  companyTitle: string;
  companyNameLabel: string;
  companyNameValue: string;
  companyFieldLabel: string;
  companyFieldValue: string;
  companyWebsiteLabel: string;
  companyWebsiteValue: string;
  companyDescription: string;
};

export type SiteContent = {
  home: HomePageContent;
  contact: ContactPageContent;
};

type SiteContentContextValue = {
  content: SiteContent;
  updateContent: (next: SiteContent) => void;
  updateHome: (patch: Partial<HomePageContent>) => void;
  updateContact: (patch: Partial<ContactPageContent>) => void;
  resetContent: () => void;
};

const STORAGE_KEY = 'site_content_v1';

const DEFAULT_CONTENT: SiteContent = {
  home: {
    welcomeTitle: 'Chào mừng đến với LIKESALE69',
    welcomeSubtitle: 'Dịch vụ tăng tương tác mạng xã hội uy tín, chất lượng',
    walletTitle: 'Số dư ví',
    walletSubtitle: 'Nạp tiền để sử dụng dịch vụ',
    depositButtonText: 'Nạp tiền',
    servicesTitle: 'Dịch vụ của chúng tôi',
    infoTitle: 'Thông báo quan trọng',
    infoItems: [
      'Vui lòng nạp tiền vào ví trước khi sử dụng dịch vụ',
      'Đơn hàng sẽ được xử lý tự động trong vòng 5-30 phút',
      'Liên hệ admin nếu cần hỗ trợ hoặc có vấn đề với đơn hàng',
      'Chúng tôi cam kết hoàn tiền 100% nu không hoàn thành đơn',
    ],
  },
  contact: {
    pageTitle: 'Liên hệ Admin',
    pageSubtitle: 'Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7',

    zaloTitle: 'Zalo',
    zaloSubtitle: 'Chat trực tiếp qua Zalo',
    zaloUrl: 'https://zalo.me/0123456789',
    zaloButtonText: 'Chat ngay trên Zalo',
    zaloPhoneText: 'SĐT: 0123 456 789',

    telegramTitle: 'Telegram',
    telegramSubtitle: 'Liên hệ qua Telegram',
    telegramUrl: 'https://t.me/likesale69_admin',
    telegramButtonText: 'Chat trên Telegram',
    telegramHandleText: '@likesale69_admin',

    hotlineLabel: 'Hotline',
    hotlineValue: '0123 456 789',
    emailLabel: 'Email',
    emailValue: 'support@likesale69.com',
    supportTimeLabel: 'Thời gian hỗ trợ',
    supportTimeValue: '24/7 - Luôn sẵn sàng',

    faqTitle: 'Câu hỏi thường gặp',
    faqs: [
      {
        q: '❓ Tôi cần hỗ trợ gì?',
        a: 'Chúng tôi hỗ trợ mọi vấn đề liên quan đến đơn hàng, nạp tiền, và các dịch vụ khác.',
      },
      {
        q: '❓ Thời gian phản hồi là bao lâu?',
        a: 'Chúng tôi phản hồi trong vòng 5-15 phút trong giờ làm việc và tối đa 30 phút ngoài giờ.',
      },
      {
        q: '❓ Đơn hàng bị lỗi phải làm sao?',
        a: 'Vui lòng liên hệ qua Zalo hoặc Telegram với mã đơn hàng, chúng tôi sẽ kiểm tra và xử lý ngay.',
      },
      {
        q: '❓ Có được hoàn tiền không?',
        a: 'Chúng tôi hoàn tiền 100% nếu đơn hàng không thể hoàn thành sau 24h xử lý.',
      },
    ],

    tipsTitle: '💡 Tips liên hệ hiệu quả',
    tips: [
      'Cung cấp mã đơn hàng khi liên hệ',
      'Mô tả vấn đề cụ thể và rõ ràng',
      'Gửi kèm ảnh chụp màn hình nếu có',
      'Kiểm tra thông báo từ admin thường xuyên',
    ],

    companyTitle: '📍 Thông tin công ty',
    companyNameLabel: 'Tên:',
    companyNameValue: 'LIKESALE69',
    companyFieldLabel: 'Lĩnh vực:',
    companyFieldValue: 'Dịch vụ mạng xã hội',
    companyWebsiteLabel: 'Website:',
    companyWebsiteValue: 'likesale69.vn',
    companyDescription: 'Chúng tôi cam kết cung cấp dịch vụ chất lượng cao với giá cả hợp lý nhất thị trường.',
  },
};

function safeParse(json: string | null): SiteContent | null {
  if (!json) return null;
  try {
    const parsed = JSON.parse(json);
    // very light shape check
    if (!parsed?.home || !parsed?.contact) return null;
    return parsed as SiteContent;
  } catch {
    return null;
  }
}

const SiteContentContext = createContext<SiteContentContextValue | null>(null);

export function SiteContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<SiteContent>(() => {
    const existing = safeParse(localStorage.getItem(STORAGE_KEY));
    return existing ?? DEFAULT_CONTENT;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  }, [content]);

  const value = useMemo<SiteContentContextValue>(() => {
    return {
      content,
      updateContent: (next) => setContent(next),
      updateHome: (patch) => setContent((prev) => ({ ...prev, home: { ...prev.home, ...patch } })),
      updateContact: (patch) => setContent((prev) => ({ ...prev, contact: { ...prev.contact, ...patch } })),
      resetContent: () => setContent(DEFAULT_CONTENT),
    };
  }, [content]);

  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>;
}

export function useSiteContent() {
  const ctx = useContext(SiteContentContext);
  if (!ctx) {
    throw new Error('useSiteContent must be used within SiteContentProvider');
  }
  return ctx;
}
