import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import FloatingIcons from './FloatingIcons';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { addUser, users } = useData();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    // Validate tên đăng nhập: phải có ít nhất 5 ký tự và 1 số
    if (formData.username.length < 5) {
      setError('Tên đăng nhập phải có ít nhất 5 ký tự!');
      setIsSubmitting(false);
      return;
    }
    
    if (!/\d/.test(formData.username)) {
      setError('Tên đăng nhập phải chứa ít nhất 1 số!');
      setIsSubmitting(false);
      return;
    }
    
    // Lưu ý: danh sách users (localStorage) có thể không đầy đủ trên production.
    // Việc kiểm tra trùng username/email sẽ được xác thực ở server (DB) để đảm bảo chính xác.
    
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu không khớp!');
      setIsSubmitting(false);
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự!');
      setIsSubmitting(false);
      return;
    }
    
    console.log('📝 [Register] Starting registration for:', formData.username);

    // Register in AuthContext (server-first). Only after server confirms success,
    // we mirror the user to localStorage (legacy/demo parts of the UI rely on it).
    const regResult = await register(
      formData.username,
      formData.email,
      formData.phone,
      formData.password
    );
    
    if (!regResult.ok) {
      setError(regResult.message || 'Đăng ký thất bại!');
      setIsSubmitting(false);
      return;
    }

    // Mirror to local storage only after server ok
    addUser({
      username: formData.username,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      balance: 0,
      totalSpent: 0,
      totalOrders: 0,
    });
    
    console.log('✅ [Register] User registered in AuthContext');
    
    setSuccess('Đăng ký tài khoản thành công! Đang chuyển đến trang đăng nhập...');
    setTimeout(() => {
      console.log('🚀 [Register] Navigating to login');
      navigate('/login', { state: { registered: true, username: formData.username } });
    }, 1500);
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-red-500 flex items-center justify-center p-4 relative">
      <FloatingIcons />
      
      <div className="bg-slate-800 rounded-lg shadow-2xl p-8 w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl text-white mb-2">LIKESALE69</h1>
          <p className="text-slate-300">Đăng ký tài khoản mới</p>
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

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-slate-300 mb-2">
              Tên đăng nhập <span className="text-slate-400 text-sm">(5 ký tự và 1 số)</span>
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập tên đăng nhập"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập email để lấy lại mật khẩu"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-2">Số điện thoại (không bắt buộc)</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập số điện thoại (tùy chọn)"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-2">Mật khẩu</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-2">Xác nhận mật khẩu</label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập lại mật khẩu"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full text-white rounded-lg py-3 transition-colors ${isSubmitting ? 'bg-orange-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'}`}
          >
            {isSubmitting ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <span className="text-slate-400">Đã có tài khoản? </span>
          <Link to="/login" className="text-blue-400 hover:text-blue-300">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  );
}