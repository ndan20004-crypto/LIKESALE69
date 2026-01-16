import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  Facebook,
  Instagram,
  Send,
  Home,
  History,
  Wallet,
  User,
  MessageCircle,
  ChevronDown,  Menu,
  X,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useBalance, useData } from '../contexts/DataContext';
import TikTokIcon from './icons/TikTokIcon';
import FacebookServices from './services/FacebookServices';
import TikTokServices from './services/TikTokServices';
import InstagramServices from './services/InstagramServices';
import TelegramServices from './services/TelegramServices';
import OrderHistory from './OrderHistory';
import UserProfile from './UserProfile';
import Contact from './Contact';
import Overview from './Overview';
import Deposit from './Deposit';
import DepositHistory from './DepositHistory';

// prices now read from admin-editable catalog in DataContext

interface DashboardProps {
  onLogout: () => void;
}

type ServiceDetailsMap = Record<string, any>;

const formatMinPrice = (details: ServiceDetailsMap, serviceKey: string): string | undefined => {
  const pkgs = details?.[serviceKey]?.packages;
  if (!Array.isArray(pkgs) || pkgs.length === 0) return undefined;

  const nums = pkgs
    .map((p: any) => Number(p?.price))
    .filter((n: any) => Number.isFinite(n));
  if (nums.length === 0) return undefined;

  const min = Math.min(...nums);
  if (!Number.isFinite(min)) return undefined;
  return `${min}đ`;
};

type DashboardSidebarProps = {
  locationPath: string;
  menuItems: Array<{
    label: string;
    icon: any;
    submenu?: Array<{ path: string; label: string; price?: string; note?: string; category?: string }>;
    path?: string;
    exact?: boolean;
  }>;
  expandedMenu: string | null;
  onToggleSubmenu: (label: string) => void;
  onClose: () => void;
};

/**
 * IMPORTANT:
 * Tách Sidebar ra khỏi component Dashboard để React không remount lại Sidebar mỗi lần Dashboard re-render.
 * Nếu Sidebar được khai báo bên trong Dashboard (const Sidebar = () => ...), mỗi lần setState sẽ tạo
 * ra "component type" mới -> Sidebar bị unmount/mount lại -> scrollTop bị reset về 0.
 */
const DashboardSidebar = React.memo(function DashboardSidebar({
  locationPath,
  menuItems,
  expandedMenu,
  onToggleSubmenu,
  onClose,
}: DashboardSidebarProps) {
  const isActiveMenu = (item: any) => {
    if (item.exact) {
      return locationPath === item.path;
    }
    if (item.submenu) {
      return item.submenu.some((sub: any) => locationPath === sub.path);
    }
    return locationPath === item.path;
  };

  return (
    <div className="h-full bg-slate-900 border-r border-slate-700 overflow-y-auto">
      <div className="p-4 border-b border-slate-700">
        <h1 className="text-2xl text-white">LIKESALE69</h1>
        <p className="text-slate-400 text-sm mt-1">Dịch vụ mạng xã hội</p>
      </div>

      <nav className="p-2">
        <Link
          to="/dashboard"
          onClick={onClose}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-blue-600 hover:text-white transition-colors mb-1 ${
            locationPath === '/dashboard' ? 'bg-blue-600 text-white' : ''
          }`}
        >
          <Home className="size-5" />
          <span>Trang chủ</span>
        </Link>

        <Link
          to="/dashboard/deposit"
          onClick={onClose}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-blue-600 hover:text-white transition-colors mb-1 ${
            locationPath === '/dashboard/deposit' ? 'bg-blue-600 text-white' : ''
          }`}
        >
          <Wallet className="size-5" />
          <span>Nạp tiền</span>
        </Link>

        {menuItems.map((item, index) => (
          <div key={index}>
            {item.submenu ? (
              <div className="mb-2">
                <button
                  onClick={() => onToggleSubmenu(item.label)}
                  className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-blue-600 hover:text-white transition-colors ${
                    isActiveMenu(item) ? 'bg-blue-600 text-white' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="size-5" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronDown
                    className={`size-4 transition-transform ${expandedMenu === item.label ? 'rotate-180' : ''}`}
                  />
                </button>

                {(expandedMenu === item.label || isActiveMenu(item)) && (
                  <div className="mt-1 space-y-1">
                    {item.submenu.map((sub, subIndex) => (
                      <React.Fragment key={subIndex}>
                        {sub.category === 'header' && subIndex > 0 && <div className="h-2"></div>}
                        <Link
                          to={sub.path}
                          onClick={onClose}
                          className={`flex items-center justify-between pl-12 pr-4 py-2 rounded-lg text-xs text-slate-400 hover:bg-blue-600 hover:text-white transition-colors ${
                            locationPath === sub.path ? 'bg-blue-600 text-white' : ''
                          }`}
                        >
                          <span className="truncate">{sub.label}</span>
                          <div className="flex items-center gap-2 shrink-0">
                            {sub.note && <span className="text-[10px] text-orange-400">{sub.note}</span>}
                            {sub.price && <span className="text-green-400">{sub.price}</span>}
                          </div>
                        </Link>
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                to={item.path || '/dashboard'}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-blue-600 hover:text-white transition-colors mb-1 ${
                  isActiveMenu(item) ? 'bg-blue-600 text-white' : ''
                }`}
              >
                <item.icon className="size-5" />
                <span>{item.label}</span>
              </Link>
            )}
          </div>
        ))}

        <Link
          to="/dashboard/deposit-history"
          onClick={onClose}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-blue-600 hover:text-white transition-colors mb-1 ${
            locationPath === '/dashboard/deposit-history' ? 'bg-blue-600 text-white' : ''
          }`}
        >
          <History className="size-5" />
          <span>Lịch sử nạp tiền</span>
        </Link>

        <Link
          to="/dashboard/history"
          onClick={onClose}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-blue-600 hover:text-white transition-colors mb-1 ${
            locationPath === '/dashboard/history' ? 'bg-blue-600 text-white' : ''
          }`}
        >
          <History className="size-5" />
          <span>Lịch sử đơn hàng</span>
        </Link>

        <Link
          to="/dashboard/contact"
          onClick={onClose}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-blue-600 hover:text-white transition-colors mb-1 ${
            locationPath === '/dashboard/contact' ? 'bg-blue-600 text-white' : ''
          }`}
        >
          <MessageCircle className="size-5" />
          <span>Liên hệ admin</span>
        </Link>
      </nav>
    </div>
  );
});

export default function Dashboard({ onLogout }: DashboardProps) {
  const location = useLocation();
  const { user } = useAuth();
  const { serviceCatalog } = useData();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  // LẤY BALANCE TRỰC TIẾP TỪ localStorage.allUsers - REAL-TIME!
  const balance = useBalance(user?.username);

  const menuItems: Array<{
    label: string;
    icon: any;
    submenu?: Array<{ path: string; label: string; price?: string; note?: string; category?: string }>;
    path?: string;
    exact?: boolean;
  }> = [
    {
      label: 'Dịch vụ Facebook',
      icon: Facebook,
      submenu: [
        { path: '/dashboard/facebook/like', label: 'Tăng like bài viết', price: '22đ' },
        { path: '/dashboard/facebook/follow', label: 'Tăng follow', price: '27đ' },
        { path: '/dashboard/facebook/comment', label: 'Tăng comment', price: '150đ' },
        { path: '/dashboard/facebook/comment-like', label: 'Tăng like comment', price: '60đ' },
        { path: '/dashboard/facebook/share', label: 'Tăng share', price: '200đ' },
        { path: '/dashboard/facebook/page-like', label: 'Tăng like/follow page', price: '45đ' },
        { path: '/dashboard/facebook/page-review', label: 'Tăng đánh giá page', price: '200đ' },
        { path: '/dashboard/facebook/group-member', label: 'Tăng member group', price: '70đ' },
        { path: '/dashboard/facebook/story-view', label: 'Tăng view story', price: '15đ' },
      ],
    },
    {
      label: 'Dịch vụ TikTok',
      icon: TikTokIcon,
      submenu: [
        { path: '/dashboard/tiktok/like', label: 'Tăng tym video', price: formatMinPrice(serviceCatalog.tiktok as any, 'like') },
        { path: '/dashboard/tiktok/follow', label: 'Tăng follow', price: formatMinPrice(serviceCatalog.tiktok as any, 'follow') },
        { path: '/dashboard/tiktok/comment', label: 'Tăng comment', price: formatMinPrice(serviceCatalog.tiktok as any, 'comment') },
        { path: '/dashboard/tiktok/view', label: 'Tăng view', price: formatMinPrice(serviceCatalog.tiktok as any, 'view') },
        { path: '/dashboard/tiktok/share-video', label: 'Tăng share video', price: formatMinPrice(serviceCatalog.tiktok as any, 'share-video') },
        { path: '/dashboard/tiktok/share-live', label: 'Tăng share live', price: formatMinPrice(serviceCatalog.tiktok as any, 'share-live') },
        { path: '/dashboard/tiktok/livestream', label: 'Tăng mắt live', price: formatMinPrice(serviceCatalog.tiktok as any, 'livestream') },
      ],
    },
    {
      label: 'Dịch vụ Instagram',
      icon: Instagram,
      submenu: [
        { path: '/dashboard/instagram/like', label: 'Tăng tym bài viết', price: formatMinPrice(serviceCatalog.instagram as any, 'like') },
        { path: '/dashboard/instagram/follow', label: 'Tăng follow / người theo dõi', price: formatMinPrice(serviceCatalog.instagram as any, 'follow') },
        { path: '/dashboard/instagram/comment', label: 'Tăng comment / bình luận', price: formatMinPrice(serviceCatalog.instagram as any, 'comment') },
        { path: '/dashboard/instagram/view', label: 'Tăng view / mắt xem', price: formatMinPrice(serviceCatalog.instagram as any, 'view') },
        { path: '/dashboard/instagram/livestream', label: 'Tăng mắt livestream', price: formatMinPrice(serviceCatalog.instagram as any, 'livestream') },
      ],
    },
    {
      label: 'Dịch vụ Telegram',
      icon: Send,
      submenu: [
        { path: '/dashboard/telegram/member', label: 'Tăng thành viên nhóm', price: formatMinPrice(serviceCatalog.telegram as any, 'member') },
        { path: '/dashboard/telegram/star', label: 'Tăng sao Telegram VIP', price: formatMinPrice(serviceCatalog.telegram as any, 'star') },
      ],
    },
  ];

  const toggleSubmenu = (label: string) => {
    setExpandedMenu(expandedMenu === label ? null : label);
  };

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex h-screen min-h-0 bg-slate-800">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 shrink-0 min-h-0">
        <DashboardSidebar
          locationPath={location.pathname}
          menuItems={menuItems}
          expandedMenu={expandedMenu}
          onToggleSubmenu={toggleSubmenu}
          onClose={closeSidebar}
        />
      </div>

      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed top-4 left-4 z-50 p-2 bg-slate-900 rounded-lg text-white"
        >
          <Menu className="size-6" />
        </button>

        {isSidebarOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsSidebarOpen(false)}
            />
            <div className="fixed left-0 top-0 h-full w-64 z-50">
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="absolute top-4 right-4 z-10 p-2 text-white"
              >
                <X className="size-6" />
              </button>
              <DashboardSidebar
                locationPath={location.pathname}
                menuItems={menuItems}
                expandedMenu={expandedMenu}
                onToggleSubmenu={toggleSubmenu}
                onClose={closeSidebar}
              />
            </div>
          </>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {/* Top Bar */}
        <div className="bg-slate-900 border-b border-slate-700 p-4 flex justify-between items-center">
          <div className="text-white text-lg">Chào bạn {user?.username}</div>

          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <Wallet className="size-4" />
              <span className="text-sm">Số dư ví</span>
              <span className="font-semibold">{balance?.toLocaleString('vi-VN') || 0} đ</span>
            </div>

            <Link
              to="/dashboard/profile"
              className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <User className="size-4" />
              <span className="text-sm">Tài khoản</span>
            </Link>

            <button
              onClick={onLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <LogOut className="size-4" />
              <span className="text-sm">Đăng xuất</span>
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto h-[calc(100vh-73px)]">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/deposit" element={<Deposit />} />
            <Route path="/deposit-history" element={<DepositHistory />} />

            {/* Services */}
            <Route path="/facebook/:serviceType" element={<FacebookServices />} />
            <Route path="/tiktok/:serviceType" element={<TikTokServices />} />
            <Route path="/instagram/:serviceType" element={<InstagramServices />} />
            <Route path="/telegram/:serviceType" element={<TelegramServices />} />

            {/* Others */}
            <Route path="/history" element={<OrderHistory />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
