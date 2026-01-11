import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard,
  ShoppingCart,
  Wallet,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  TrendingUp
} from 'lucide-react';
import AdminOverview from './AdminOverview';
import AdminOrders from './AdminOrders';
import AdminDeposits from './AdminDeposits';
import AdminUsers from './AdminUsers';
import AdminSettings from './AdminSettings';
import AdminServices from './AdminServices';
import AdminDepositConfig from './AdminDepositConfig';

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Tổng quan', exact: true },
    { path: '/admin/orders', icon: ShoppingCart, label: 'Quản lý đơn hàng' },
    { path: '/admin/deposits', icon: Wallet, label: 'Quản lý nạp tiền' },
    { path: '/admin/deposit-config', icon: Wallet, label: 'Cấu hình nạp tiền' },
    { path: '/admin/services', icon: Settings, label: 'Quản lý dịch vụ' },
    { path: '/admin/users', icon: Users, label: 'Quản lý người dùng' },
    { path: '/admin/settings', icon: Settings, label: 'Cài đặt' },
  ];

  const isActiveMenu = (item: any) => {
    if (item.exact) {
      return location.pathname === item.path;
    }
    return location.pathname.startsWith(item.path);
  };

  const Sidebar = () => (
    <div className="h-full bg-slate-800 border-r border-slate-700 overflow-y-auto">
      <div className="p-4 border-b border-slate-700">
        <h1 className="text-2xl text-white">🔧 ADMIN PANEL</h1>
        <p className="text-slate-400 text-sm mt-1">LIKESALE69 Management</p>
      </div>

      <nav className="p-2">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            onClick={() => setIsSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors mb-1 ${
              isActiveMenu(item) ? 'bg-slate-700 text-white' : ''
            }`}
          >
            <item.icon className="size-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700 mt-auto">
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="size-5 text-white" />
            <span className="text-white">Doanh thu hôm nay</span>
          </div>
          <div className="text-2xl text-white">2,500,000đ</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden text-white"
        >
          {isSidebarOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>

        <div className="flex-1 lg:flex-none">
          <h2 className="text-white text-lg text-center lg:text-left">Admin Dashboard</h2>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-right">
            <div className="text-white">Admin</div>
            <div className="text-slate-400 text-sm">admin@likesale69.com</div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 rounded-lg text-white hover:bg-red-700 transition-colors"
          >
            <LogOut className="size-4" />
            <span className="hidden sm:inline">Đăng xuất</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar for desktop */}
        <aside className="hidden lg:block w-64 shrink-0">
          <Sidebar />
        </aside>

        {/* Mobile sidebar */}
        {isSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setIsSidebarOpen(false)}>
            <div className="w-64 h-full" onClick={(e) => e.stopPropagation()}>
              <Sidebar />
            </div>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<AdminOverview />} />
              <Route path="/orders" element={<AdminOrders />} />
              <Route path="/deposits" element={<AdminDeposits />} />
              <Route path="/deposit-config" element={<AdminDepositConfig />} />
              <Route path="/services" element={<AdminServices />} />
              <Route path="/users" element={<AdminUsers />} />
              <Route path="/settings" element={<AdminSettings />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}
