import React, { useState } from 'react';
import { Search, Filter, CheckCircle, Clock, XCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

export default function OrderHistory() {
  const { user } = useAuth();
  const { orders } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-full text-sm">
            <CheckCircle className="size-4" />
            Hoàn thành
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-cyan-600 text-white rounded-full text-sm">
            <RefreshCw className="size-4 animate-spin" />
            Đang xử lý
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-600 text-white rounded-full text-sm">
            <Clock className="size-4" />
            Chờ xử lý
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-full text-sm">
            <XCircle className="size-4" />
            Đã hủy
          </span>
        );
      default:
        return null;
    }
  };

  const filteredOrders = orders
    .filter(order => order.username === user?.username) // Chỉ lấy đơn của user hiện tại
    .filter(order => {
      const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           order.service.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'all' || order.status === filterStatus;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // Mới nhất trước

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-white mb-2">Lịch sử đơn hàng</h1>
        <p className="text-slate-300">Theo dõi tất cả đơn hàng của bạn</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm theo mã đơn hoặc dịch vụ..."
            className="w-full bg-slate-800 text-white rounded-lg pl-11 pr-4 py-3 border border-slate-700 focus:border-blue-500 focus:outline-none"
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-5" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-800 text-white rounded-lg pl-11 pr-8 py-3 border border-slate-700 focus:border-blue-500 focus:outline-none appearance-none"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="completed">Hoàn thành</option>
            <option value="processing">Đang xử lý</option>
            <option value="pending">Chờ xử lý</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-slate-800 rounded-lg p-12 text-center border border-slate-700">
            <p className="text-slate-400 text-lg">Không tìm thấy đơn hàng nào</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl text-white">Mã đơn: {order.id}</h3>
                    {getStatusBadge(order.status)}
                  </div>
                  <p className="text-slate-400">{order.platform} - {order.service}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl text-white">{order.price.toLocaleString('vi-VN')}đ</div>
                  <div className="text-slate-400 text-sm">Tạo: {new Date(order.createdAt).toLocaleString('vi-VN')}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400">Link:</span>
                  <p className="text-white break-all">{order.link}</p>
                </div>
                {order.reactionType && (
                  <div>
                    <span className="text-slate-400">Biểu tượng:</span>
                    <p className="text-white">{order.reactionType}</p>
                  </div>
                )}
                <div>
                  <span className="text-slate-400">Số lượng:</span>
                  <p className="text-white">{order.quantity.toLocaleString('vi-VN')}</p>
                </div>

                {Array.isArray((order as any).comments) && (order as any).comments.length > 0 && (
                  <div className="md:col-span-2">
                    <span className="text-slate-400">Nội dung bình luận ({(order as any).comments.length}):</span>
                    <div className="mt-1 bg-slate-900/40 border border-slate-700 rounded-lg p-3">
                      <ul className="list-disc list-inside space-y-1 text-white text-sm">
                        {(order as any).comments.slice(0, 10).map((c: string, idx: number) => (
                          <li key={idx} className="break-words">{c}</li>
                        ))}
                      </ul>
                      {(order as any).comments.length > 10 && (
                        <p className="text-slate-400 text-xs mt-2">... và {(order as any).comments.length - 10} bình luận nữa</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}