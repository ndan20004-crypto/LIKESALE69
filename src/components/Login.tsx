import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import FloatingIcons from './FloatingIcons';

interface LoginProps {
  onLogin: (asAdmin?: boolean) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const { login } = useAuth();
  const location = useLocation();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Show success message when redirected from Register
  useEffect(() => {
    const st: any = (location as any).state;
    if (st?.registered) {
      setSuccess('Đăng ký tài khoản thành công! Vui lòng đăng nhập để tiếp tục.');
      if (st.username) {
        setFormData(prev => ({ ...prev, username: st.username }));
      }
      // Clear history state so it doesn't persist on refresh/navigation
      try {
        window.history.replaceState({}, document.title);
      } catch {
        // ignore
      }
    }
  }, [location]);

  // Load remembered login preference on mount
  useEffect(() => {
    const rememberedLogin = localStorage.getItem('rememberMe');
    const rememberedUsername = localStorage.getItem('rememberedUsername');
    
    if (rememberedLogin === 'true') {
      setFormData(prev => ({
        ...prev,
        rememberMe: true,
        username: rememberedUsername || '',
      }));
    }
  }, []);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    console.log('🔐 [Login] Login attempt:', formData.username);

    if (!formData.username || !formData.password) {
      console.log('❌ [Login] Empty username or password');
      setError('Tên đăng nhập hoặc mật khẩu không được để trống');
      return;
    }

    const resp = await login(formData.username, formData.password);

    console.log('🔍 [Login] Login result:', resp);

    if (resp.ok) {
      // Save remember me preference
      if (formData.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('rememberedUsername', formData.username);
      } else {
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('rememberedUsername');
      }

      const asAdmin = String(resp.role || '').toLowerCase() === 'admin';
      console.log('✅ [Login] Login successful. asAdmin=', asAdmin);
      onLogin(asAdmin);
      return;
    }

    console.log('❌ [Login] Login failed');
    setError(resp.message || 'Tên đăng nhập hoặc mật khẩu không đúng!');
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-red-500 p-4 relative">
      <FloatingIcons />
      
      {/* Hero Banner */}
      <div className="max-w-5xl mx-auto pt-8 pb-6 relative z-10">
        <div className="rounded-xl p-8 text-white text-center">
          <h1 className="text-4xl mb-3">LIKESALE69.SHOP</h1>
          <p className="text-xl text-blue-100">likesale69 | Nền Tảng Được Tin Cậy Và Phổ Biến Nhất Cho Các Dịch Vụ Truyền Thông Xã Hội</p>
        </div>
      </div>

      {/* Login Form */}
      <div className="max-w-md mx-auto relative z-10">
        <div className="bg-slate-800 rounded-lg shadow-2xl p-8 w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl text-white mb-2">LIKESALE69</h1>
            <p className="text-slate-300">Dịch vụ tăng tương tác mạng xã hội</p>
            <Link to="/" className="text-blue-400 hover:text-blue-300 text-sm mt-2 inline-block">
              ← Quay về trang chủ
            </Link>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/20 border border-green-500 text-green-400 px-4 py-3 rounded-lg mb-4">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-slate-300 mb-2">Tên đăng nhập hoặc Email</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập tên đăng nhập hoặc email"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-2">Mật khẩu</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập mật khẩu"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center text-slate-300">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                  className="mr-2"
                />
                Ghi nhớ đăng nhập
              </label>
              <Link to="/forgot-password" className="text-blue-400 hover:text-blue-300 text-sm">
                Quên mật khẩu?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white rounded-lg py-3 hover:bg-blue-700 transition-colors"
            >
              Đăng nhập
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-slate-400">Chưa có tài khoản? </span>
            <Link to="/register" className="text-blue-400 hover:text-blue-300">
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
