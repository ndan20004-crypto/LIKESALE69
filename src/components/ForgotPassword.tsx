import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock password reset
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-red-600 p-4">
        <div className="bg-slate-800 rounded-lg shadow-2xl p-8 w-full max-w-md border border-slate-700 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="size-8 text-white" />
            </div>
            <h2 className="text-2xl text-white mb-3">Kiểm tra email của bạn</h2>
            <p className="text-slate-400">
              Chúng tôi đã gửi link đặt lại mật khẩu đến email <strong className="text-white">{email}</strong>
            </p>
          </div>
          
          <Link
            to="/login"
            className="inline-flex items-center text-blue-400 hover:text-blue-300"
          >
            <ArrowLeft className="size-4 mr-2" />
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-red-600 p-4">
      <div className="bg-slate-800 rounded-lg shadow-2xl p-8 w-full max-w-md border border-slate-700">
        <div className="text-center mb-8">
          <h1 className="text-3xl text-white mb-2">Quên mật khẩu</h1>
          <p className="text-slate-400">Nhập email để lấy lại mật khẩu</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-slate-300 mb-2">Email đăng ký</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-700 text-white rounded-lg pl-11 pr-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
                placeholder="Nhập email của bạn"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg py-3 hover:from-blue-700 hover:to-blue-600 transition-all"
          >
            Gửi link đặt lại mật khẩu
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="inline-flex items-center text-blue-400 hover:text-blue-300">
            <ArrowLeft className="size-4 mr-2" />
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}
