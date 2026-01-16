import React, { useState } from 'react';
import { Save, Bell, Mail, MessageCircle, DollarSign, Shield, Trash2 } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useSiteContent } from '../../contexts/SiteContentContext';

export default function AdminSettings() {
  const { resetAllData } = useData();
  const { content, updateHome, updateContact, resetContent } = useSiteContent();

  const [homeForm, setHomeForm] = useState(() => ({
    welcomeTitle: content.home.welcomeTitle,
    welcomeSubtitle: content.home.welcomeSubtitle,
    walletTitle: content.home.walletTitle,
    walletSubtitle: content.home.walletSubtitle,
    depositButtonText: content.home.depositButtonText,
    servicesTitle: content.home.servicesTitle,
    infoTitle: content.home.infoTitle,
    infoItemsText: content.home.infoItems.join('\n'),
  }));

  const [contactForm, setContactForm] = useState(() => ({
    pageTitle: content.contact.pageTitle,
    pageSubtitle: content.contact.pageSubtitle,

    zaloTitle: content.contact.zaloTitle,
    zaloSubtitle: content.contact.zaloSubtitle,
    zaloUrl: content.contact.zaloUrl,
    zaloButtonText: content.contact.zaloButtonText,
    zaloPhoneText: content.contact.zaloPhoneText,

    telegramTitle: content.contact.telegramTitle,
    telegramSubtitle: content.contact.telegramSubtitle,
    telegramUrl: content.contact.telegramUrl,
    telegramButtonText: content.contact.telegramButtonText,
    telegramHandleText: content.contact.telegramHandleText,

    hotlineLabel: content.contact.hotlineLabel,
    hotlineValue: content.contact.hotlineValue,
    emailLabel: content.contact.emailLabel,
    emailValue: content.contact.emailValue,
    supportTimeLabel: content.contact.supportTimeLabel,
    supportTimeValue: content.contact.supportTimeValue,

    faqTitle: content.contact.faqTitle,
    faqsText: content.contact.faqs.map(f => `${f.q}|||${f.a}`).join('\n'),

    tipsTitle: content.contact.tipsTitle,
    tipsText: content.contact.tips.join('\n'),

    companyTitle: content.contact.companyTitle,
    companyNameLabel: content.contact.companyNameLabel,
    companyNameValue: content.contact.companyNameValue,
    companyFieldLabel: content.contact.companyFieldLabel,
    companyFieldValue: content.contact.companyFieldValue,
    companyWebsiteLabel: content.contact.companyWebsiteLabel,
    companyWebsiteValue: content.contact.companyWebsiteValue,
    companyDescription: content.contact.companyDescription,
  }));
  const [settings, setSettings] = useState({
    // Telegram Settings
    telegramBotToken: '',
    telegramChatId: '',
    telegramNotifyOrder: true,
    telegramNotifyDeposit: true,
    
    // Email Settings
    emailService: 'smtp',
    smtpHost: '',
    smtpPort: '',
    smtpUser: '',
    smtpPass: '',
    emailNotifyOrder: true,
    emailNotifyDeposit: true,
    
    // Bank Settings
    bankName: 'MB Bank',
    bankAccountNumber: '0123456789',
    bankAccountName: 'NGUYEN VAN A',
    bankBranch: 'Chi nhánh Hà Nội',
    
    // System Settings
    minDeposit: '10000',
    orderProcessingTime: '5-30',
    systemMaintenance: false,
  });

  const handleSave = () => {
    alert('Đã lưu cài đặt thành công!');
    // Trong thực tế sẽ lưu vào database hoặc environment variables
  };

  const parseLines = (text: string) =>
    text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

  const handleSaveHomeContent = () => {
    updateHome({
      welcomeTitle: homeForm.welcomeTitle,
      welcomeSubtitle: homeForm.welcomeSubtitle,
      walletTitle: homeForm.walletTitle,
      walletSubtitle: homeForm.walletSubtitle,
      depositButtonText: homeForm.depositButtonText,
      servicesTitle: homeForm.servicesTitle,
      infoTitle: homeForm.infoTitle,
      infoItems: parseLines(homeForm.infoItemsText),
    });
    alert('✅ Đã lưu nội dung Trang chủ!');
  };

  const handleSaveContactContent = () => {
    const faqs = parseLines(contactForm.faqsText).map((line) => {
      const [q, ...rest] = line.split('|||');
      const a = rest.join('|||');
      return { q: (q ?? '').trim(), a: (a ?? '').trim() };
    }).filter((x) => x.q);

    updateContact({
      pageTitle: contactForm.pageTitle,
      pageSubtitle: contactForm.pageSubtitle,

      zaloTitle: contactForm.zaloTitle,
      zaloSubtitle: contactForm.zaloSubtitle,
      zaloUrl: contactForm.zaloUrl,
      zaloButtonText: contactForm.zaloButtonText,
      zaloPhoneText: contactForm.zaloPhoneText,

      telegramTitle: contactForm.telegramTitle,
      telegramSubtitle: contactForm.telegramSubtitle,
      telegramUrl: contactForm.telegramUrl,
      telegramButtonText: contactForm.telegramButtonText,
      telegramHandleText: contactForm.telegramHandleText,

      hotlineLabel: contactForm.hotlineLabel,
      hotlineValue: contactForm.hotlineValue,
      emailLabel: contactForm.emailLabel,
      emailValue: contactForm.emailValue,
      supportTimeLabel: contactForm.supportTimeLabel,
      supportTimeValue: contactForm.supportTimeValue,

      faqTitle: contactForm.faqTitle,
      faqs,

      tipsTitle: contactForm.tipsTitle,
      tips: parseLines(contactForm.tipsText),

      companyTitle: contactForm.companyTitle,
      companyNameLabel: contactForm.companyNameLabel,
      companyNameValue: contactForm.companyNameValue,
      companyFieldLabel: contactForm.companyFieldLabel,
      companyFieldValue: contactForm.companyFieldValue,
      companyWebsiteLabel: contactForm.companyWebsiteLabel,
      companyWebsiteValue: contactForm.companyWebsiteValue,
      companyDescription: contactForm.companyDescription,
    });

    alert('✅ Đã lưu nội dung Liên hệ Admin!');
  };

  const handleResetSiteContent = () => {
    const ok = confirm('Bạn muốn reset nội dung Trang chủ + Liên hệ về mặc định?');
    if (!ok) return;
    resetContent();
    alert('✅ Đã reset nội dung về mặc định!');
    // Reload to re-initialize local form states from defaults.
    window.location.reload();
  };

  const handleChange = (field: string, value: any) => {
    setSettings({ ...settings, [field]: value });
  };

  const handleResetAllData = () => {
    const confirmed = confirm(
      '⚠️ CẢNH BÁO: Bạn có chắc chắn muốn RESET TOÀN BỘ DỮ LIỆU?\n\n' +
      'Hành động này sẽ XÓA:\n' +
      '• Tất cả người dùng\n' +
      '• Tất cả đơn hàng\n' +
      '• Tất cả giao dịch nạp tiền\n' +
      '• Tất cả dữ liệu đăng nhập\n\n' +
      'HÀNH ĐỘNG NÀY KHÔNG THỂ HOÀN TÁC!'
    );
    
    if (confirmed) {
      const doubleConfirm = confirm(
        '🚨 LẦN XÁC NHẬN CUỐI CÙNG!\n\n' +
        'Nhấn OK để XÓA TOÀN BỘ DỮ LIỆU và BẮT ĐẦU LẠI TỪ ĐẦU.'
      );
      
      if (doubleConfirm) {
        resetAllData();
        alert('✅ Đã reset toàn bộ dữ liệu! Hệ thống đã trở về trạng thái ban đầu.');
        window.location.reload();
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-white mb-2">Cài đặt hệ thống</h1>
        <p className="text-slate-300">Cấu hình thông báo, thanh toán và các tính năng khác</p>
      </div>

      {/* Site Content (Admin can edit text shown to users) */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl text-white mb-1">Nội dung Trang chủ (User)</h2>
            <p className="text-slate-400 text-sm">Chỉ Admin mới thấy phần này. Lưu xong, User sẽ thấy nội dung mới ngay.</p>
          </div>
          <button
            onClick={handleSaveHomeContent}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            <Save className="size-4" />
            Lưu Trang chủ
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
          <div>
            <label className="block text-slate-300 mb-2">Tiêu đề chào mừng</label>
            <input
              value={homeForm.welcomeTitle}
              onChange={(e) => setHomeForm({ ...homeForm, welcomeTitle: e.target.value })}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-300 mb-2">Mô tả ngắn</label>
            <input
              value={homeForm.welcomeSubtitle}
              onChange={(e) => setHomeForm({ ...homeForm, welcomeSubtitle: e.target.value })}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-300 mb-2">Tiêu đề "Số dư ví"</label>
            <input
              value={homeForm.walletTitle}
              onChange={(e) => setHomeForm({ ...homeForm, walletTitle: e.target.value })}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-300 mb-2">Mô tả "Số dư ví"</label>
            <input
              value={homeForm.walletSubtitle}
              onChange={(e) => setHomeForm({ ...homeForm, walletSubtitle: e.target.value })}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-300 mb-2">Text nút nạp tiền</label>
            <input
              value={homeForm.depositButtonText}
              onChange={(e) => setHomeForm({ ...homeForm, depositButtonText: e.target.value })}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-300 mb-2">Tiêu đề dịch vụ</label>
            <input
              value={homeForm.servicesTitle}
              onChange={(e) => setHomeForm({ ...homeForm, servicesTitle: e.target.value })}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div className="lg:col-span-2">
            <label className="block text-slate-300 mb-2">Tiêu đề thông báo</label>
            <input
              value={homeForm.infoTitle}
              onChange={(e) => setHomeForm({ ...homeForm, infoTitle: e.target.value })}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div className="lg:col-span-2">
            <label className="block text-slate-300 mb-2">Danh sách thông báo (mỗi dòng 1 ý)</label>
            <textarea
              value={homeForm.infoItemsText}
              onChange={(e) => setHomeForm({ ...homeForm, infoItemsText: e.target.value })}
              rows={5}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl text-white mb-1">Nội dung Liên hệ Admin (User)</h2>
            <p className="text-slate-400 text-sm">
              FAQ format: mỗi dòng <span className="text-slate-200">Câu hỏi|||Trả lời</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveContactContent}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              <Save className="size-4" />
              Lưu Liên hệ
            </button>
            <button
              onClick={handleResetSiteContent}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg"
            >
              Reset nội dung
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
          <div>
            <label className="block text-slate-300 mb-2">Tiêu đề trang</label>
            <input
              value={contactForm.pageTitle}
              onChange={(e) => setContactForm({ ...contactForm, pageTitle: e.target.value })}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-300 mb-2">Mô tả trang</label>
            <input
              value={contactForm.pageSubtitle}
              onChange={(e) => setContactForm({ ...contactForm, pageSubtitle: e.target.value })}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-2">Zalo - tiêu đề</label>
            <input
              value={contactForm.zaloTitle}
              onChange={(e) => setContactForm({ ...contactForm, zaloTitle: e.target.value })}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-300 mb-2">Zalo - mô tả</label>
            <input
              value={contactForm.zaloSubtitle}
              onChange={(e) => setContactForm({ ...contactForm, zaloSubtitle: e.target.value })}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-300 mb-2">Zalo - link</label>
            <input
              value={contactForm.zaloUrl}
              onChange={(e) => setContactForm({ ...contactForm, zaloUrl: e.target.value })}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-300 mb-2">Zalo - text nút</label>
            <input
              value={contactForm.zaloButtonText}
              onChange={(e) => setContactForm({ ...contactForm, zaloButtonText: e.target.value })}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div className="lg:col-span-2">
            <label className="block text-slate-300 mb-2">Zalo - dòng SĐT</label>
            <input
              value={contactForm.zaloPhoneText}
              onChange={(e) => setContactForm({ ...contactForm, zaloPhoneText: e.target.value })}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-2">Telegram - tiêu đề</label>
            <input
              value={contactForm.telegramTitle}
              onChange={(e) => setContactForm({ ...contactForm, telegramTitle: e.target.value })}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-300 mb-2">Telegram - mô tả</label>
            <input
              value={contactForm.telegramSubtitle}
              onChange={(e) => setContactForm({ ...contactForm, telegramSubtitle: e.target.value })}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-300 mb-2">Telegram - link</label>
            <input
              value={contactForm.telegramUrl}
              onChange={(e) => setContactForm({ ...contactForm, telegramUrl: e.target.value })}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-300 mb-2">Telegram - text nút</label>
            <input
              value={contactForm.telegramButtonText}
              onChange={(e) => setContactForm({ ...contactForm, telegramButtonText: e.target.value })}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div className="lg:col-span-2">
            <label className="block text-slate-300 mb-2">Telegram - username</label>
            <input
              value={contactForm.telegramHandleText}
              onChange={(e) => setContactForm({ ...contactForm, telegramHandleText: e.target.value })}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-2">Hotline label</label>
            <input
              value={contactForm.hotlineLabel}
              onChange={(e) => setContactForm({ ...contactForm, hotlineLabel: e.target.value })}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-300 mb-2">Hotline value</label>
            <input
              value={contactForm.hotlineValue}
              onChange={(e) => setContactForm({ ...contactForm, hotlineValue: e.target.value })}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-300 mb-2">Email label</label>
            <input
              value={contactForm.emailLabel}
              onChange={(e) => setContactForm({ ...contactForm, emailLabel: e.target.value })}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-300 mb-2">Email value</label>
            <input
              value={contactForm.emailValue}
              onChange={(e) => setContactForm({ ...contactForm, emailValue: e.target.value })}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-300 mb-2">Thời gian hỗ trợ label</label>
            <input
              value={contactForm.supportTimeLabel}
              onChange={(e) => setContactForm({ ...contactForm, supportTimeLabel: e.target.value })}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-300 mb-2">Thời gian hỗ trợ value</label>
            <input
              value={contactForm.supportTimeValue}
              onChange={(e) => setContactForm({ ...contactForm, supportTimeValue: e.target.value })}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-slate-300 mb-2">Tiêu đề FAQ</label>
            <input
              value={contactForm.faqTitle}
              onChange={(e) => setContactForm({ ...contactForm, faqTitle: e.target.value })}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div className="lg:col-span-2">
            <label className="block text-slate-300 mb-2">FAQ (mỗi dòng: Câu hỏi|||Trả lời)</label>
            <textarea
              value={contactForm.faqsText}
              onChange={(e) => setContactForm({ ...contactForm, faqsText: e.target.value })}
              rows={6}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-2">Tiêu đề Tips</label>
            <input
              value={contactForm.tipsTitle}
              onChange={(e) => setContactForm({ ...contactForm, tipsTitle: e.target.value })}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-300 mb-2">Tips (mỗi dòng 1 ý)</label>
            <textarea
              value={contactForm.tipsText}
              onChange={(e) => setContactForm({ ...contactForm, tipsText: e.target.value })}
              rows={4}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-2">Tiêu đề thông tin công ty</label>
            <input
              value={contactForm.companyTitle}
              onChange={(e) => setContactForm({ ...contactForm, companyTitle: e.target.value })}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-300 mb-2">Tên label</label>
            <input
              value={contactForm.companyNameLabel}
              onChange={(e) => setContactForm({ ...contactForm, companyNameLabel: e.target.value })}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-300 mb-2">Tên value</label>
            <input
              value={contactForm.companyNameValue}
              onChange={(e) => setContactForm({ ...contactForm, companyNameValue: e.target.value })}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-300 mb-2">Lĩnh vực label</label>
            <input
              value={contactForm.companyFieldLabel}
              onChange={(e) => setContactForm({ ...contactForm, companyFieldLabel: e.target.value })}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-300 mb-2">Lĩnh vực value</label>
            <input
              value={contactForm.companyFieldValue}
              onChange={(e) => setContactForm({ ...contactForm, companyFieldValue: e.target.value })}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-300 mb-2">Website label</label>
            <input
              value={contactForm.companyWebsiteLabel}
              onChange={(e) => setContactForm({ ...contactForm, companyWebsiteLabel: e.target.value })}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-300 mb-2">Website value</label>
            <input
              value={contactForm.companyWebsiteValue}
              onChange={(e) => setContactForm({ ...contactForm, companyWebsiteValue: e.target.value })}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div className="lg:col-span-2">
            <label className="block text-slate-300 mb-2">Mô tả công ty</label>
            <textarea
              value={contactForm.companyDescription}
              onChange={(e) => setContactForm({ ...contactForm, companyDescription: e.target.value })}
              rows={3}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Telegram Settings */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-2xl text-white mb-4 flex items-center gap-3">
          <MessageCircle className="size-6 text-blue-400" />
          Cài đặt Telegram Bot
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-slate-300 mb-2">Bot Token</label>
            <input
              type="text"
              value={settings.telegramBotToken}
              onChange={(e) => handleChange('telegramBotToken', e.target.value)}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
              placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
            />
            <p className="text-slate-400 text-sm mt-1">
              Lấy token từ @BotFather trên Telegram
            </p>
          </div>

          <div>
            <label className="block text-slate-300 mb-2">Chat ID (Admin)</label>
            <input
              type="text"
              value={settings.telegramChatId}
              onChange={(e) => handleChange('telegramChatId', e.target.value)}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
              placeholder="123456789"
            />
            <p className="text-slate-400 text-sm mt-1">
              Chat ID của bạn để nhận thông báo (dùng @userinfobot để lấy)
            </p>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-slate-300">
              <input
                type="checkbox"
                checked={settings.telegramNotifyOrder}
                onChange={(e) => handleChange('telegramNotifyOrder', e.target.checked)}
                className="w-4 h-4"
              />
              Thông báo khi có đơn hàng mới
            </label>
            <label className="flex items-center gap-2 text-slate-300">
              <input
                type="checkbox"
                checked={settings.telegramNotifyDeposit}
                onChange={(e) => handleChange('telegramNotifyDeposit', e.target.checked)}
                className="w-4 h-4"
              />
              Thông báo khi có yêu cầu nạp tiền
            </label>
          </div>
        </div>
      </div>

      {/* Email Settings */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-2xl text-white mb-4 flex items-center gap-3">
          <Mail className="size-6 text-green-400" />
          Cài đặt Email
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-slate-300 mb-2">Dịch vụ Email</label>
            <select
              value={settings.emailService}
              onChange={(e) => handleChange('emailService', e.target.value)}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
            >
              <option value="smtp">SMTP (Gmail, Outlook...)</option>
              <option value="sendgrid">SendGrid</option>
              <option value="resend">Resend</option>
            </select>
          </div>

          {settings.emailService === 'smtp' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-2">SMTP Host</label>
                  <input
                    type="text"
                    value={settings.smtpHost}
                    onChange={(e) => handleChange('smtpHost', e.target.value)}
                    className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-2">SMTP Port</label>
                  <input
                    type="text"
                    value={settings.smtpPort}
                    onChange={(e) => handleChange('smtpPort', e.target.value)}
                    className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
                    placeholder="587"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-2">Email</label>
                <input
                  type="email"
                  value={settings.smtpUser}
                  onChange={(e) => handleChange('smtpUser', e.target.value)}
                  className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
                  placeholder="your-email@gmail.com"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-2">Mật khẩu ứng dụng</label>
                <input
                  type="password"
                  value={settings.smtpPass}
                  onChange={(e) => handleChange('smtpPass', e.target.value)}
                  className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
                  placeholder="••••••••••••••••"
                />
                <p className="text-slate-400 text-sm mt-1">
                  Với Gmail, tạo App Password tại: myaccount.google.com/apppasswords
                </p>
              </div>
            </>
          )}

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-slate-300">
              <input
                type="checkbox"
                checked={settings.emailNotifyOrder}
                onChange={(e) => handleChange('emailNotifyOrder', e.target.checked)}
                className="w-4 h-4"
              />
              Gửi email khi có đơn hàng mới
            </label>
            <label className="flex items-center gap-2 text-slate-300">
              <input
                type="checkbox"
                checked={settings.emailNotifyDeposit}
                onChange={(e) => handleChange('emailNotifyDeposit', e.target.checked)}
                className="w-4 h-4"
              />
              Gửi email khi có yêu cầu nạp tiền
            </label>
          </div>
        </div>
      </div>

      {/* Bank Settings */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-2xl text-white mb-4 flex items-center gap-3">
          <DollarSign className="size-6 text-yellow-400" />
          Thông tin ngân hàng
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-slate-300 mb-2">Tên ngân hàng</label>
            <input
              type="text"
              value={settings.bankName}
              onChange={(e) => handleChange('bankName', e.target.value)}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-2">Số tài khoản</label>
            <input
              type="text"
              value={settings.bankAccountNumber}
              onChange={(e) => handleChange('bankAccountNumber', e.target.value)}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-2">Chủ tài khoản</label>
            <input
              type="text"
              value={settings.bankAccountName}
              onChange={(e) => handleChange('bankAccountName', e.target.value)}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-2">Chi nhánh</label>
            <input
              type="text"
              value={settings.bankBranch}
              onChange={(e) => handleChange('bankBranch', e.target.value)}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* System Settings */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-2xl text-white mb-4 flex items-center gap-3">
          <Shield className="size-6 text-purple-400" />
          Cài đặt hệ thống
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-slate-300 mb-2">Số tiền nạp tối thiểu (VNĐ)</label>
            <input
              type="number"
              value={settings.minDeposit}
              onChange={(e) => handleChange('minDeposit', e.target.value)}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-2">Thời gian xử lý đơn (phút)</label>
            <input
              type="text"
              value={settings.orderProcessingTime}
              onChange={(e) => handleChange('orderProcessingTime', e.target.value)}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
              placeholder="5-30"
            />
          </div>

          <label className="flex items-center gap-2 text-slate-300">
            <input
              type="checkbox"
              checked={settings.systemMaintenance}
              onChange={(e) => handleChange('systemMaintenance', e.target.checked)}
              className="w-4 h-4"
            />
            Chế độ bảo trì (người dùng không thể tạo đơn)
          </label>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all text-lg"
      >
        <Save className="size-6" />
        Lưu tất cả cài đặt
      </button>

      {/* Reset All Data Button */}
      <button
        onClick={handleResetAllData}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg hover:from-red-700 hover:to-red-600 transition-all text-lg"
      >
        <Trash2 className="size-6" />
        RESET TOÀN BỘ DỮ LIỆU
      </button>

      <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4">
        <h4 className="text-yellow-400 mb-2">⚠️ Lưu ý bảo mật:</h4>
        <ul className="text-slate-300 text-sm space-y-1">
          <li>• Không chia sẻ Bot Token và mật khẩu email cho bất kỳ ai</li>
          <li>• Nên sử dụng App Password thay vì mật khẩu chính của email</li>
          <li>• Thường xuyên kiểm tra và cập nhật thông tin bảo mật</li>
          <li>• Các thông tin này sẽ được lưu an toàn trong hệ thống</li>
        </ul>
      </div>
    </div>
  );
}