import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ThumbsUp, 
  MessageCircle, 
  Share2, 
  UserPlus, 
  Eye, 
  Heart,
  Users,
  Star,
  ChevronDown,
  Menu,
  X,
  LogIn,
  Facebook,
  Instagram,
  Send,
  UserCircle,
  Home,
  History,
} from 'lucide-react';
import FloatingIcons from './FloatingIcons';
import TikTokIcon from './icons/TikTokIcon';
import { useData } from '../contexts/DataContext';

interface LandingPageProps {
  onNavigateToLogin: () => void;
  onNavigateToRegister: () => void;
}

export default function LandingPage({ onNavigateToLogin, onNavigateToRegister }: LandingPageProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>('Facebook');
  const { serviceCatalog } = useData();

  const formatMinPrice = (details: any, serviceKey: string): string | undefined => {
    const pkgs = details?.[serviceKey]?.packages;
    if (!Array.isArray(pkgs) || pkgs.length === 0) return undefined;
    const nums = pkgs.map((p: any) => Number(p?.price)).filter((n: any) => Number.isFinite(n));
    if (nums.length === 0) return undefined;
    const min = Math.min(...nums);
    if (!Number.isFinite(min)) return undefined;
    return `${min}đ`;
  };
  
  // LẤY SỐ LIỆU THỰC TỪ DATABASE
  const [stats, setStats] = useState({
    totalOrders: 0,
    processingOrders: 0,
    completedOrders: 0,
    totalCustomers: 0,
  });

  useEffect(() => {
    // Đọc dữ liệu từ localStorage
    const allOrdersStr = localStorage.getItem('allOrders');
    const allUsersStr = localStorage.getItem('allUsers');
    
    if (allOrdersStr) {
      const allOrders = JSON.parse(allOrdersStr);
      const totalOrders = allOrders.length;
      const processingOrders = allOrders.filter((order: any) => 
        order.status === 'processing' || order.status === 'pending'
      ).length;
      const completedOrders = allOrders.filter((order: any) => 
        order.status === 'completed'
      ).length;
      
      setStats(prev => ({
        ...prev,
        totalOrders,
        processingOrders,
        completedOrders,
      }));
    }
    
    if (allUsersStr) {
      const allUsers = JSON.parse(allUsersStr);
      // Đếm số user (trừ admin)
      const totalCustomers = allUsers.filter((user: any) => user.role !== 'admin').length;
      setStats(prev => ({
        ...prev,
        totalCustomers,
      }));
    }
  }, []);

  const toggleSubmenu = (label: string) => {
    setExpandedMenu(expandedMenu === label ? null : label);
  };

  const menuItems = [
    {
      label: 'Dịch vụ Facebook',
      icon: Facebook,
      submenu: [
        { label: 'Tăng like bài viết', path: '/login', price: '22đ' },
        { label: 'Tăng follow', path: '/login', price: '27đ' },
        { label: 'Tăng comment', path: '/login', price: '150đ' },
        { label: 'Tăng like comment', path: '/login', price: '60đ' },
        { label: 'Tăng share', path: '/login', price: '200đ' },
        { label: 'Tăng like/follow page', path: '/login', price: '45đ' },
        { label: 'Tăng đánh giá page', path: '/login', price: '200đ' },
        { label: 'Tăng member group', path: '/login', price: '70đ' },
        { label: 'Tăng view story', path: '/login', price: '15đ' },
      ]
    },
    {
      label: 'Dịch vụ TikTok',
      icon: TikTokIcon,
      submenu: [
        { label: 'Tăng tym video', path: '/login', price: formatMinPrice(serviceCatalog.tiktok as any, 'like') },
        { label: 'Tăng follow / người theo dõi', path: '/login', price: formatMinPrice(serviceCatalog.tiktok as any, 'follow') },
        { label: 'Tăng comment / bình luận', path: '/login', price: formatMinPrice(serviceCatalog.tiktok as any, 'comment') },
        { label: 'Tăng view / mắt xem', path: '/login', price: formatMinPrice(serviceCatalog.tiktok as any, 'view') },
        { label: 'Tăng share video', path: '/login', price: formatMinPrice(serviceCatalog.tiktok as any, 'share-video') },
        { label: 'Tăng share live', path: '/login', price: formatMinPrice(serviceCatalog.tiktok as any, 'share-live') },
        { label: 'Tăng mắt xem live', path: '/login', price: formatMinPrice(serviceCatalog.tiktok as any, 'livestream') },
      ]
    },
    {
      label: 'Dịch vụ Instagram',
      icon: Instagram,
      submenu: [
        { label: 'Tăng tym bài viết', path: '/login', price: formatMinPrice(serviceCatalog.instagram as any, 'like') },
        { label: 'Tăng follow / người theo dõi', path: '/login', price: formatMinPrice(serviceCatalog.instagram as any, 'follow') },
        { label: 'Tăng comment / bình luận', path: '/login', price: formatMinPrice(serviceCatalog.instagram as any, 'comment') },
        { label: 'Tăng view / mắt xem', path: '/login', price: formatMinPrice(serviceCatalog.instagram as any, 'view') },
        { label: 'Tăng mắt livestream', path: '/login', price: formatMinPrice(serviceCatalog.instagram as any, 'livestream') },
      ]
    },
    {
      label: 'Dịch vụ Telegram',
      icon: Send,
      submenu: [
        { label: 'Tăng thành viên nhóm', path: '/login', price: formatMinPrice(serviceCatalog.telegram as any, 'member') },
        { label: 'Tăng sao Telegram VIP', path: '/login', price: formatMinPrice(serviceCatalog.telegram as any, 'star') },
      ]
    },
  ];

  const services = [
    {
      category: '📘 DỊCH VỤ FACEBOOK',
      items: [
        { title: 'TĂNG LIKE BÀI VIẾT FB', desc: 'Tăng like cho bài viết Facebook', color: 'bg-teal-600', icon: ThumbsUp },
        { title: 'TĂNG SHARE BÀI VIẾT FB', desc: 'Tăng share cho bài viết Facebook', color: 'bg-teal-600', icon: Share2 },
        { title: 'TĂNG COMMENT FB', desc: 'Tăng comment cho bài viết Facebook', color: 'bg-teal-600', icon: MessageCircle },
        { title: 'TĂNG LIKE CHO BÌNH LUẬN', desc: 'Tăng like cho comment Facebook', color: 'bg-teal-600', icon: ThumbsUp },
        { title: 'TĂNG MẮT LIVESTREAM', desc: 'Tăng người xem livestream Facebook', color: 'bg-teal-600', icon: Eye },
        { title: 'TĂNG FOLLOW FB CÁ NHÂN', desc: 'Tăng follow cho tài khoản Facebook', color: 'bg-teal-600', icon: UserPlus },
        { title: 'TĂNG LIKE, FOLLOW FANPAGE', desc: 'Tăng like cho fanpage Facebook', color: 'bg-teal-600', icon: Heart },
        { title: 'TĂNG MEMBER GROUP', desc: 'Tăng thành viên cho nhóm Facebook', color: 'bg-teal-600', icon: Users },
        { title: 'TĂNG VIEW VIDEO FB', desc: 'Tăng lượt xem video Facebook', color: 'bg-teal-600', icon: Eye },
        { title: 'TĂNG ĐÁNH GIÁ FANPAGE', desc: 'Tăng đánh giá sao fanpage', color: 'bg-teal-600', icon: Star },
        { title: 'VIPLIKE - LIKE TRẮNG', desc: 'Like chất lượng cao', color: 'bg-teal-600', icon: ThumbsUp },
        { title: 'TĂNG VIEW STORY', desc: 'Tăng lượt xem story Facebook', color: 'bg-teal-600', icon: Eye },
      ]
    },
    {
      category: '🎵 DỊCH VỤ TIKTOK',
      items: [
        { title: 'TĂNG LIKE VIDEO TIKTOK', desc: 'Tăng like cho video TikTok', color: 'bg-teal-600', icon: Heart },
        { title: 'TĂNG FOLLOW TIKTOK', desc: 'Tăng follow cho tài khoản TikTok', color: 'bg-teal-600', icon: UserPlus },
        { title: 'TĂNG VIEW VIDEO TIKTOK', desc: 'Tăng view cho video TikTok', color: 'bg-teal-600', icon: Eye },
        { title: 'TĂNG COMMENT TIKTOK', desc: 'Tăng comment cho video TikTok', color: 'bg-teal-600', icon: MessageCircle },
      ]
    },
    {
      category: '📷 DỊCH VỤ INSTAGRAM',
      items: [
        { title: 'TĂNG LIKE INSTAGRAM', desc: 'Tăng like cho bài viết Instagram', color: 'bg-teal-600', icon: Heart },
        { title: 'TĂNG FOLLOW INSTAGRAM', desc: 'Tăng follow cho tài khoản Instagram', color: 'bg-teal-600', icon: UserPlus },
        { title: 'TĂNG VIEW INSTAGRAM', desc: 'Tăng view cho video Instagram', color: 'bg-teal-600', icon: Eye },
        { title: 'TĂNG COMMENT INSTAGRAM', desc: 'Tăng comment cho bài viết Instagram', color: 'bg-teal-600', icon: MessageCircle },
      ]
    },
    {
      category: '✈️ DỊCH VỤ TELEGRAM',
      items: [
        { title: 'TĂNG MEMBER TELEGRAM', desc: 'Tăng thành viên cho nhóm Telegram', color: 'bg-teal-600', icon: Users },
        { title: 'TĂNG SAO TELEGRAM VIP', desc: 'Tăng sao Telegram VIP (1/3/6 tháng)', color: 'bg-teal-600', icon: Star },
      ]
    },
  ];

  const isActiveMenu = (item: any) => {
    return false; // Guest mode, nothing is active
  };

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-slate-900 border-r border-slate-700 overflow-y-auto
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-4 border-b border-slate-700 text-center">
          <h1 className="text-2xl text-white">LIKESALE69</h1>
          <p className="text-slate-400 text-sm mt-1">Like Tăng - Người Tăng</p>
        </div>

        <nav className="p-2">
          <Link
            to="/login"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-blue-600 hover:text-white transition-colors mb-1"
          >
            <Home className="size-5" />
            <span>Trang chủ</span>
          </Link>

          {menuItems.map((item, index) => (
            <div key={index}>
              {item.submenu ? (
                <div className="mb-2">
                  <button
                    onClick={() => toggleSubmenu(item.label)}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-blue-600 hover:text-white transition-colors ${
                      isActiveMenu(item) ? 'bg-blue-600 text-white' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="size-5" />
                      <span>{item.label}</span>
                    </div>
                    <ChevronDown
                      className={`size-4 transition-transform ${
                        expandedMenu === item.label ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {expandedMenu === item.label && (
                    <div className="mt-1 space-y-1">
                      {item.submenu.map((sub, subIndex) => (
                        <React.Fragment key={subIndex}>
                          {/* Category Header - TikTok only */}
                          {sub.category === 'header' && subIndex > 0 && (
                            <div className="h-2"></div>
                          )}
                          <Link
                            to={sub.path}
                            onClick={() => setIsSidebarOpen(false)}
                            className="flex items-center justify-between pl-12 pr-4 py-2 rounded-lg text-xs text-slate-400 hover:bg-blue-600 hover:text-white transition-colors"
                          >
                            <span className="truncate">{sub.label}</span>
                            <div className="flex items-center gap-2 shrink-0">
                              {sub.note && (
                                <span className="text-[10px] text-orange-400">{sub.note}</span>
                              )}
                              {sub.price && (
                                <span className="text-green-400">{sub.price}</span>
                              )}
                            </div>
                          </Link>
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
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
            to="/login"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-blue-600 hover:text-white transition-colors mb-1"
          >
            <History className="size-5" />
            <span>Lịch sử đơn hàng</span>
          </Link>

          <Link
            to="/login"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-blue-600 hover:text-white transition-colors mb-1"
          >
            <MessageCircle className="size-5" />
            <span>Liên hệ admin</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-slate-800 border-b border-slate-700 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden text-white"
          >
            {isSidebarOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>

          <div className="flex-1 lg:flex-none">
            <h2 className="text-white text-lg text-center lg:text-left">LIKESALE69</h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateToRegister}
              className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg transition-colors text-sm flex items-center gap-2"
            >
              <UserCircle className="size-4" />
              <span className="hidden sm:inline">Đăng ký</span>
            </button>
            <button
              onClick={onNavigateToLogin}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-colors text-sm flex items-center gap-2"
            >
              <LogIn className="size-4" />
              <span className="hidden sm:inline">Đăng nhập</span>
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto bg-slate-900">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Hero Banner */}
            <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 rounded-2xl p-12 text-center overflow-hidden">
              <div className="relative z-10">
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                  LIKESALE69.SHOP
                </h1>
                <p className="text-xl text-white/90 mb-6">
                  Dịch vụ tăng tương tác mạng xã hội uy tín - Giá rẻ - Chất lượng cao
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={onNavigateToRegister}
                    className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg"
                  >
                    Đăng ký ngay
                  </button>
                  <button
                    onClick={onNavigateToLogin}
                    className="bg-blue-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-800 transition-all transform hover:scale-105 shadow-lg"
                  >
                    Đăng nhập
                  </button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 text-center">
                <div className="text-3xl font-bold text-blue-500 mb-2">{stats.totalOrders}</div>
                <div className="text-slate-400">Tổng đơn hàng</div>
              </div>
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 text-center">
                <div className="text-3xl font-bold text-yellow-500 mb-2">{stats.processingOrders}</div>
                <div className="text-slate-400">Đang xử lý</div>
              </div>
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 text-center">
                <div className="text-3xl font-bold text-green-500 mb-2">{stats.completedOrders}</div>
                <div className="text-slate-400">Hoàn thành</div>
              </div>
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 text-center">
                <div className="text-3xl font-bold text-purple-500 mb-2">{stats.totalCustomers}</div>
                <div className="text-slate-400">Tổng khách hàng</div>
              </div>
            </div>

            {/* Services */}
            {services.map((serviceGroup, groupIndex) => (
              <div key={groupIndex}>
                <h2 className="text-2xl font-bold text-white mb-4">{serviceGroup.category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {serviceGroup.items.map((service, index) => (
                    <button
                      key={index}
                      onClick={onNavigateToLogin}
                      className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-blue-500 transition-all text-left group hover:scale-105"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`${service.color} rounded-lg p-3 shrink-0`}>
                          <service.icon className="size-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-bold mb-1 group-hover:text-blue-400 transition-colors">
                            {service.title}
                          </h3>
                          <p className="text-slate-400 text-sm">{service.desc}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Why Choose Us */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                Tại sao chọn LIKESALE69.SHOP?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-white/20 rounded-full size-16 flex items-center justify-center mx-auto mb-4">
                    <ThumbsUp className="size-8 text-white" />
                  </div>
                  <h3 className="text-white font-bold mb-2">Uy tín hàng đầu</h3>
                  <p className="text-white/80">Phục vụ hàng nghìn khách hàng mỗi ngày</p>
                </div>
                <div className="text-center">
                  <div className="bg-white/20 rounded-full size-16 flex items-center justify-center mx-auto mb-4">
                    <Star className="size-8 text-white" />
                  </div>
                  <h3 className="text-white font-bold mb-2">Giá cả cạnh tranh</h3>
                  <p className="text-white/80">Cam kết giá tốt nhất thị trường</p>
                </div>
                <div className="text-center">
                  <div className="bg-white/20 rounded-full size-16 flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="size-8 text-white" />
                  </div>
                  <h3 className="text-white font-bold mb-2">Hỗ trợ 24/7</h3>
                  <p className="text-white/80">Đội ngũ support nhiệt tình, chuyên nghiệp</p>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-slate-800 rounded-lg p-8 border border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">Liên hệ hỗ trợ</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <a
                  href="https://zalo.me/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-6 text-center transition-all transform hover:scale-105"
                >
                  <MessageCircle className="size-12 mx-auto mb-3" />
                  <div className="font-bold text-lg">Zalo</div>
                  <div className="text-sm text-blue-100">Nhấn để liên hệ</div>
                </a>
                <a
                  href="https://t.me/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-sky-500 hover:bg-sky-600 text-white rounded-lg p-6 text-center transition-all transform hover:scale-105"
                >
                  <Send className="size-12 mx-auto mb-3" />
                  <div className="font-bold text-lg">Telegram</div>
                  <div className="text-sm text-sky-100">Nhấn để liên hệ</div>
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
      <FloatingIcons />
    </div>
  );
}