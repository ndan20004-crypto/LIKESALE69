import React, { useState } from 'react';
import { User, Mail, Phone, Wallet, Lock, Save } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useBalance } from '../contexts/DataContext';

export default function UserProfile() {
  const { user, updateUserInfo } = useAuth();
  const balance = useBalance(user?.username);
  const [activeTab, setActiveTab] = useState<'info' | 'password'>('info');
  const [userInfo, setUserInfo] = useState({
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const totalSpent = user?.totalSpent || 0;
  const totalOrders = user?.totalOrders || 0;

  const handleUpdateInfo = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserInfo({
      username: userInfo.username,
      email: userInfo.email,
      phone: userInfo.phone,
    });
    alert('Cập nhật thông tin thành công!');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate current password
    if (!user) {
      alert('Không tìm thấy thông tin người dùng!');
      return;
    }
    
    if (passwordData.currentPassword !== user.password) {
      alert('Mật khẩu hiện tại không đúng!');
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Mật khẩu mới không khớp!');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      alert('Mật khẩu mới phải có ít nhất 6 ký tự!');
      return;
    }
    
    // Update password
    updateUserInfo({ password: passwordData.newPassword });
    
    alert('Đổi mật khẩu thành công! Mật khẩu cũ đã được xóa.');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-white mb-2">Thông tin tài khoản</h1>
        <p className="text-slate-300">Quản lý thông tin cá nhân và bảo mật</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 border border-blue-500">
          <div className="flex items-center gap-3 mb-2">
            <Wallet className="size-8 text-white" />
            <span className="text-slate-100">Số dư ví</span>
          </div>
          <div className="text-3xl text-white">{balance.toLocaleString('vi-VN')}đ</div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-slate-300">Tổng chi tiêu</span>
          </div>
          <div className="text-3xl text-white">{totalSpent.toLocaleString('vi-VN')}đ</div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-slate-300">Tổng đơn hàng</span>
          </div>
          <div className="text-3xl text-white">{totalOrders}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-700">
        <button
          onClick={() => setActiveTab('info')}
          className={`px-6 py-3 transition-colors ${
            activeTab === 'info'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Thông tin cá nhân
        </button>
        <button
          onClick={() => setActiveTab('password')}
          className={`px-6 py-3 transition-colors ${
            activeTab === 'password'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Đổi mật khẩu
        </button>
      </div>

      {/* Content */}
      {activeTab === 'info' ? (
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h2 className="text-2xl text-white mb-6">Thông tin cá nhân</h2>
          
          <form onSubmit={handleUpdateInfo} className="space-y-6">
            <div>
              <label className="block text-slate-300 mb-2">Tên đăng nhập</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-5" />
                <input
                  type="text"
                  value={userInfo.username}
                  onChange={(e) => setUserInfo({ ...userInfo, username: e.target.value })}
                  className="w-full bg-slate-700 text-white rounded-lg pl-11 pr-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-5" />
                <input
                  type="email"
                  value={userInfo.email}
                  onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                  className="w-full bg-slate-700 text-white rounded-lg pl-11 pr-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 mb-2">Số điện thoại</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-5" />
                <input
                  type="tel"
                  value={userInfo.phone}
                  onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                  className="w-full bg-slate-700 text-white rounded-lg pl-11 pr-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all"
            >
              <Save className="size-5" />
              Lưu thay đổi
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h2 className="text-2xl text-white mb-6">Đổi mật khẩu</h2>
          
          <form onSubmit={handleChangePassword} className="space-y-6">
            <div>
              <label className="block text-slate-300 mb-2">Mật khẩu hiện tại</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-5" />
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full bg-slate-700 text-white rounded-lg pl-11 pr-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 mb-2">Mật khẩu mới</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-5" />
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full bg-slate-700 text-white rounded-lg pl-11 pr-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 mb-2">Xác nhận mật khẩu mới</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-5" />
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full bg-slate-700 text-white rounded-lg pl-11 pr-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4">
              <h4 className="text-yellow-400 mb-2">Lưu ý:</h4>
              <ul className="text-slate-300 text-sm space-y-1">
                <li>• Mật khẩu phải có ít nhất 8 ký tự</li>
                <li>• Nên sử dụng kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt</li>
                <li>• Không chia sẻ mật khẩu với người khác</li>
              </ul>
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all"
            >
              <Save className="size-5" />
              Đổi mật khẩu
            </button>
          </form>
        </div>
      )}
    </div>
  );
}