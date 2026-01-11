import React from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';

export default function DepositHistory() {
  const { deposits } = useData();
  const { user } = useAuth();

  // Filter deposits for current user
  const userDeposits = deposits.filter(d => d.username === user?.username);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="size-5 text-green-500" />;
      case 'pending':
        return <Clock className="size-5 text-yellow-500" />;
      case 'transferred':
        return <AlertCircle className="size-5 text-blue-500" />;
      case 'cancelled':
        return <XCircle className="size-5 text-red-500" />;
      default:
        return <AlertCircle className="size-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="text-green-500">Hoàn thành</span>;
      case 'pending':
        return <span className="text-yellow-500">Đang chờ</span>;
      case 'transferred':
        return <span className="text-blue-500">Đã thanh toán</span>;
      case 'cancelled':
        return <span className="text-red-500">Từ chối</span>;
      default:
        return <span className="text-gray-500">Không xác định</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl text-white mb-2">Lịch sử nạp tiền</h1>
        <p className="text-slate-300">Theo dõi tất cả giao dịch nạp tiền của bạn</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="text-slate-400 mb-2">Tổng nạp</div>
          <div className="text-2xl text-white">
            {userDeposits.filter(d => d.status === 'completed').reduce((sum, d) => sum + d.amount, 0).toLocaleString('vi-VN')}đ
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="text-slate-400 mb-2">Đang chờ</div>
          <div className="text-2xl text-yellow-400">
            {userDeposits.filter(d => d.status === 'pending').length} giao dịch
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="text-slate-400 mb-2">Đã duyệt</div>
          <div className="text-2xl text-green-400">
            {userDeposits.filter(d => d.status === 'completed').length} giao dịch
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm text-slate-300">Mã giao dịch</th>
                <th className="px-6 py-4 text-left text-sm text-slate-300">Số tiền</th>
                <th className="px-6 py-4 text-left text-sm text-slate-300">Phương thức</th>
                <th className="px-6 py-4 text-left text-sm text-slate-300">Thời gian</th>
                <th className="px-6 py-4 text-left text-sm text-slate-300">Trạng thái</th>
                <th className="px-6 py-4 text-left text-sm text-slate-300">Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {userDeposits.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-3">
                      <AlertCircle className="size-12 text-slate-600" />
                      <p className="text-lg">Chưa có giao dịch nạp tiền nào</p>
                      <p className="text-sm text-slate-500">Vui lòng nạp tiền để sử dụng dịch vụ</p>
                    </div>
                  </td>
                </tr>
              ) : (
                userDeposits
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((deposit) => (
                    <tr key={deposit.id} className="border-t border-slate-700 hover:bg-slate-700/50">
                      <td className="px-6 py-4 text-white">{deposit.id}</td>
                      <td className="px-6 py-4 text-green-400 font-semibold">
                        {deposit.amount.toLocaleString('vi-VN')}đ
                      </td>
                      <td className="px-6 py-4 text-slate-300">{deposit.method}</td>
                      <td className="px-6 py-4 text-slate-400 text-sm">
                        {new Date(deposit.createdAt).toLocaleString('vi-VN')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(deposit.status)}
                          {getStatusText(deposit.status)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-sm">
                        {deposit.note || '-'}
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-6">
        <h4 className="text-blue-400 mb-3 flex items-center gap-2">
          <span>ℹ️</span>
          Lưu ý về nạp tiền
        </h4>
        <ul className="space-y-2 text-slate-300">
          <li>• Giao dịch nạp tiền qua QR Code sẽ được duyệt tự động trong vòng 5-10 phút</li>
          <li>• Giao dịch nạp tiền qua chuyển khoản ngân hàng sẽ được admin duyệt trong vòng 30 phút - 2 giờ</li>
          <li>• Vui lòng chuyển khoản đúng nội dung để hệ thống tự động cộng tiền</li>
          <li>• Liên hệ admin nếu sau 2 giờ giao dịch vẫn chưa được duyệt</li>
        </ul>
      </div>
    </div>
  );
}