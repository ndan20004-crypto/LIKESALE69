import React from 'react';
import { Users, ShoppingCart, Wallet, TrendingUp, Clock, CheckCircle, XCircle, DollarSign } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

export default function AdminOverview() {
  const { users, orders, deposits } = useData();

  // Calculate real stats
  const totalUsers = users.length;
  const totalOrders = orders.length;
  const totalRevenue = users.reduce((sum, u) => sum + u.totalSpent, 0);
  const totalDeposits = deposits.filter(d => d.status === 'completed').reduce((sum, d) => sum + d.amount, 0);

  // Order stats
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const processingOrders = orders.filter(o => o.status === 'processing').length;
  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;

  // Recent orders (latest 5)
  const recentOrders = [...orders].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 5);

  // Recent deposits (latest 5)
  const recentDeposits = [...deposits].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 5);

  const stats = [
    { icon: Users, label: 'Tổng người dùng', value: totalUsers.toString(), color: 'from-blue-500 to-blue-600' },
    { icon: ShoppingCart, label: 'Tổng đơn hàng', value: totalOrders.toString(), color: 'from-purple-500 to-purple-600' },
    { icon: Wallet, label: 'Tổng doanh thu', value: totalRevenue.toLocaleString('vi-VN') + 'đ', color: 'from-green-500 to-green-600' },
    { icon: DollarSign, label: 'Tổng nạp tiền', value: totalDeposits.toLocaleString('vi-VN') + 'đ', color: 'from-yellow-500 to-yellow-600' },
  ];

  const orderStats = [
    { icon: Clock, label: 'Chờ xử lý', value: pendingOrders, color: 'bg-yellow-600' },
    { icon: TrendingUp, label: 'Đang xử lý', value: processingOrders, color: 'bg-blue-600' },
    { icon: CheckCircle, label: 'Hoàn thành', value: completedOrders, color: 'bg-green-600' },
    { icon: XCircle, label: 'Đã hủy', value: cancelledOrders, color: 'bg-red-600' },
  ];

  const getStatusBadge = (status: string) => {
    const badges: Record<string, JSX.Element> = {
      pending: <span className="px-2 py-1 bg-yellow-600 text-white rounded text-xs">Chờ xử lý</span>,
      processing: <span className="px-2 py-1 bg-blue-600 text-white rounded text-xs">Đang xử lý</span>,
      completed: <span className="px-2 py-1 bg-green-600 text-white rounded text-xs">Hoàn thành</span>,
      cancelled: <span className="px-2 py-1 bg-red-600 text-white rounded text-xs">Đã hủy</span>,
    };
    return badges[status] || null;
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1);

    if (seconds < 60) return `${seconds} giây trước`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} phút trước`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} giờ trước`;
    return `${Math.floor(seconds / 86400)} ngày trước`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-white mb-2">Tổng quan hệ thống</h1>
        <p className="text-slate-300">Dashboard quản trị LIKESALE69</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`bg-gradient-to-br ${stat.color} rounded-lg p-6 shadow-lg`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm mb-1">{stat.label}</p>
                  <p className="text-white text-2xl">{stat.value}</p>
                </div>
                <Icon className="text-white/80 size-10" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Order Stats */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-xl text-white mb-4">Thống kê đơn hàng</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {orderStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-slate-700 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="text-white size-5" />
                  </div>
                  <div>
                    <p className="text-slate-300 text-sm">{stat.label}</p>
                    <p className="text-white text-xl">{stat.value}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-slate-800 rounded-lg border border-slate-700">
          <div className="p-6 border-b border-slate-700">
            <h2 className="text-xl text-white">Đơn hàng gần đây</h2>
          </div>
          <div className="p-6">
            {recentOrders.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                Chưa có đơn hàng nào
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white">{order.id}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-300">{order.username}</span>
                      </div>
                      <div className="text-sm text-slate-400">{order.service}</div>
                      <div className="text-xs text-slate-500 mt-1">{getTimeAgo(order.createdAt)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 mb-2">{order.price.toLocaleString('vi-VN')}đ</div>
                      {getStatusBadge(order.status)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Deposits */}
        <div className="bg-slate-800 rounded-lg border border-slate-700">
          <div className="p-6 border-b border-slate-700">
            <h2 className="text-xl text-white">Nạp tiền gần đây</h2>
          </div>
          <div className="p-6">
            {recentDeposits.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                Chưa có giao dịch nạp tiền nào
              </div>
            ) : (
              <div className="space-y-4">
                {recentDeposits.map((deposit) => (
                  <div key={deposit.id} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white">{deposit.id}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-300">{deposit.username}</span>
                      </div>
                      <div className="text-sm text-slate-400">{deposit.method}</div>
                      <div className="text-xs text-slate-500 mt-1">{getTimeAgo(deposit.createdAt)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-blue-400 mb-2">{deposit.amount.toLocaleString('vi-VN')}đ</div>
                      {getStatusBadge(deposit.status)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
