import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Send, CheckCircle2, ShoppingCart, DollarSign, Clock, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useBalance } from '../contexts/DataContext';
import { useData } from '../contexts/DataContext';
import TikTokIcon from './icons/TikTokIcon';
import { useSiteContent } from '../contexts/SiteContentContext';

export default function Overview() {
  const { user } = useAuth();
  const balance = useBalance(user?.username);
  const { orders } = useData();
  const { content } = useSiteContent();

  // Filter orders by current user and calculate counts
  const userOrders = orders.filter(order => order.username === user?.username);
  const pendingCount = userOrders.filter(order => order.status === 'pending').length;
  const processingCount = userOrders.filter(order => order.status === 'processing').length;
  const completedCount = userOrders.filter(order => order.status === 'completed').length;

  const stats = [
    { icon: ShoppingCart, label: 'Tổng đơn hàng', value: user?.totalOrders.toString() || '0', color: 'from-blue-500 to-blue-600' },
    { icon: Clock, label: 'Chờ xử lý', value: pendingCount.toString(), color: 'from-yellow-500 to-yellow-600' },
    { icon: RefreshCw, label: 'Đang xử lý', value: processingCount.toString(), color: 'from-cyan-500 to-cyan-600' },
    { icon: CheckCircle2, label: 'Đơn hoàn thành', value: completedCount.toString(), color: 'from-green-500 to-green-600' },
  ];

  const services = [
    { icon: Facebook, label: 'Facebook', path: '/dashboard/facebook/like', color: 'from-blue-600 to-blue-700', count: '15+ dịch vụ' },
    { icon: TikTokIcon, label: 'TikTok', path: '/dashboard/tiktok/follow', color: 'from-slate-700 to-slate-800', count: '10+ dịch vụ' },
    { icon: Instagram, label: 'Instagram', path: '/dashboard/instagram/follow', color: 'from-pink-600 to-purple-600', count: '12+ dịch vụ' },
    { icon: Send, label: 'Telegram', path: '/dashboard/telegram/member', color: 'from-sky-500 to-sky-600', count: '2 dịch vụ' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-white mb-2">{content.home.welcomeTitle}</h1>
        <p className="text-slate-300">{content.home.welcomeSubtitle}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${stat.color} mb-4`}>
              <stat.icon className="size-6 text-white" />
            </div>
            <div className="text-2xl text-white mb-1">{stat.value}</div>
            <div className="text-slate-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Wallet Balance - Highlighted */}
      <div className="bg-gradient-to-r from-amber-400 to-orange-400 rounded-lg p-6 border border-amber-300 shadow-lg shadow-amber-400/20">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="inline-flex p-3 rounded-lg bg-white/30">
                <DollarSign className="size-6 text-white" />
              </div>
              <h3 className="text-xl text-white drop-shadow-md">{content.home.walletTitle}</h3>
            </div>
            <div className="text-4xl text-white mb-1 drop-shadow-md font-bold">{balance.toLocaleString('vi-VN')}đ</div>
            <p className="text-white/90 drop-shadow">{content.home.walletSubtitle}</p>
          </div>
          <Link
            to="/dashboard/deposit"
            className="px-6 py-3 bg-white text-orange-600 rounded-lg hover:bg-orange-50 transition-colors font-bold shadow-lg hover:shadow-xl hover:scale-105"
          >
            {content.home.depositButtonText}
          </Link>
        </div>
      </div>

      {/* Services */}
      <div>
        <h2 className="text-2xl text-white mb-4">{content.home.servicesTitle}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((service, index) => (
            <Link
              key={index}
              to={service.path}
              className="group bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-blue-500 transition-all hover:scale-105"
            >
              <div className={`inline-flex p-4 rounded-lg bg-gradient-to-r ${service.color} mb-4 group-hover:scale-110 transition-transform`}>
                <service.icon className="size-8 text-white" />
              </div>
              <h3 className="text-xl text-white mb-2">{service.label}</h3>
              <p className="text-slate-400">{service.count}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 border border-blue-500">
        <h3 className="text-xl text-white mb-3">{content.home.infoTitle}</h3>
        <ul className="space-y-2 text-slate-100">
          {content.home.infoItems.map((item, idx) => (
            <li key={idx}>• {item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}