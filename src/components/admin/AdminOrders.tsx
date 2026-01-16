import React, { useState } from 'react';
import { Search, Filter, Eye, CheckCircle, XCircle, RefreshCw, Clock } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

export default function AdminOrders() {
  const { orders, updateOrder } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

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

  const handleUpdateStatus = (orderId: string, newStatus: string) => {
    const confirmed = confirm(`Xác nhận chuyển đơn hàng sang trạng thái: ${newStatus}?`);
    if (confirmed) {
      updateOrder(orderId, {
        status: newStatus as any,
        ...(newStatus === 'completed' && { completedAt: new Date().toISOString() }),
      });
      alert(`✅ Đã cập nhật trạng thái đơn hàng!`);
      setSelectedOrder(null);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const processingOrders = orders.filter(o => o.status === 'processing').length;
  const completedOrders = orders.filter(o => o.status === 'completed').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-white mb-2">Quản lý đơn hàng</h1>
        <p className="text-slate-300">Theo dõi và xử lý tất cả đơn hàng của khách hàng</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="text-slate-400 mb-2">Tổng đơn hàng</div>
          <div className="text-2xl text-white">{totalOrders}</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="text-slate-400 mb-2">Chờ xử lý</div>
          <div className="text-2xl text-yellow-400">{pendingOrders}</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="text-slate-400 mb-2">Đang xử lý</div>
          <div className="text-2xl text-cyan-400">{processingOrders}</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="text-slate-400 mb-2">Hoàn thành</div>
          <div className="text-2xl text-green-400">{completedOrders}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm theo mã đơn, user, dịch vụ..."
            className="w-full bg-slate-800 text-white rounded-lg pl-11 pr-4 py-3 border border-slate-700 focus:border-blue-500 focus:outline-none"
          />
        </div>
        
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-slate-800 text-white rounded-lg px-4 py-3 border border-slate-700 focus:border-blue-500 focus:outline-none"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="pending">Chờ xử lý</option>
          <option value="processing">Đang xử lý</option>
          <option value="completed">Hoàn thành</option>
          <option value="cancelled">Đã hủy</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm text-slate-300">Mã đơn</th>
                <th className="px-6 py-4 text-left text-sm text-slate-300">Khách hàng</th>
                <th className="px-6 py-4 text-left text-sm text-slate-300">Dịch vụ</th>
                <th className="px-6 py-4 text-left text-sm text-slate-300">Số lượng</th>
                <th className="px-6 py-4 text-left text-sm text-slate-300">Giá tiền</th>
                <th className="px-6 py-4 text-left text-sm text-slate-300">Trạng thái</th>
                <th className="px-6 py-4 text-left text-sm text-slate-300">Thời gian</th>
                <th className="px-6 py-4 text-left text-sm text-slate-300">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-3">
                      <Filter className="size-12 text-slate-600" />
                      <p className="text-lg">
                        {orders.length === 0 
                          ? 'Chưa có đơn hàng nào' 
                          : 'Không tìm thấy đơn hàng phù hợp'}
                      </p>
                      {orders.length === 0 && (
                        <p className="text-sm text-slate-500">
                          Đơn hàng sẽ tự động hiện ở đây khi khách tạo đơn
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((order) => (
                    <tr key={order.id} className="border-t border-slate-700 hover:bg-slate-700/50">
                      <td className="px-6 py-4 text-white">{order.id}</td>
                      <td className="px-6 py-4 text-slate-300">{order.username}</td>
                      <td className="px-6 py-4 text-slate-300">
                        <div>
                          <div className="text-white">{order.service}</div>
                          {order.reactionType && (
                            <div className="text-sm text-slate-300">Biểu tượng: <span className="text-white">{order.reactionType}</span></div>
                          )}
                          <div className="text-sm text-slate-400">{order.platform}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-300">{order.quantity.toLocaleString('vi-VN')}</td>
                      <td className="px-6 py-4 text-green-400 font-semibold">
                        {order.price.toLocaleString('vi-VN')}đ
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-sm">
                        {new Date(order.createdAt).toLocaleString('vi-VN')}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          <Eye className="size-4" />
                          Chi tiết
                        </button>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700">
            <div className="p-6 border-b border-slate-700 flex items-center justify-between">
              <h2 className="text-2xl text-white">Chi tiết đơn hàng #{selectedOrder.id}</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-white"
              >
                <XCircle className="size-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 text-sm">Khách hàng</label>
                  <p className="text-white">{selectedOrder.username}</p>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Trạng thái</label>
                  <div className="mt-1">
                    {getStatusBadge(selectedOrder.status)}
                  </div>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Dịch vụ</label>
                  <p className="text-white">{selectedOrder.service}</p>
                </div>
                {selectedOrder.reactionType && (
                  <div>
                    <label className="text-slate-400 text-sm">Biểu tượng</label>
                    <p className="text-white">{selectedOrder.reactionType}</p>
                  </div>
                )}
                <div>
                  <label className="text-slate-400 text-sm">Nền tảng</label>
                  <p className="text-white">{selectedOrder.platform}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-slate-400 text-sm">Link</label>
                  <p className="text-blue-400 break-all">{selectedOrder.link}</p>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Số lượng</label>
                  <p className="text-white">{selectedOrder.quantity.toLocaleString('vi-VN')}</p>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Giá tiền</label>
                  <p className="text-green-400 font-semibold">{selectedOrder.price.toLocaleString('vi-VN')}đ</p>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Thời gian tạo</label>
                  <p className="text-white">{new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}</p>
                </div>
                {selectedOrder.completedAt && (
                  <div>
                    <label className="text-slate-400 text-sm">Thời gian hoàn thành</label>
                    <p className="text-white">{new Date(selectedOrder.completedAt).toLocaleString('vi-VN')}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="border-t border-slate-700 pt-4 mt-6">
                <label className="text-slate-400 text-sm block mb-3">Cập nhật trạng thái</label>
                <div className="grid grid-cols-2 gap-3">
                  {selectedOrder.status === 'pending' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder.id, 'processing')}
                      className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      ▶️ Bắt đầu xử lý
                    </button>
                  )}
                  {(selectedOrder.status === 'pending' || selectedOrder.status === 'processing') && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(selectedOrder.id, 'completed')}
                        className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        ✅ Hoàn thành
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(selectedOrder.id, 'cancelled')}
                        className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        ❌ Hủy đơn
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}