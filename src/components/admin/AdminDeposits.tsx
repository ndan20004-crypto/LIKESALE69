import React, { useState } from 'react';
import { Search, CheckCircle, XCircle, Clock, DollarSign } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

export default function AdminDeposits() {
  const { deposits, users, addDeposit, updateDeposit, updateUser } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [addMoneyUserId, setAddMoneyUserId] = useState('');
  const [addMoneyAmount, setAddMoneyAmount] = useState('');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-full text-sm">
            <CheckCircle className="size-4" />
            Hoàn thành
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-600 text-white rounded-full text-sm">
            <Clock className="size-4" />
            Đã tạo lệnh
          </span>
        );
      case 'transferred':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-full text-sm">
            <CheckCircle className="size-4" />
            Đã thanh toán
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-full text-sm">
            <XCircle className="size-4" />
            Từ chối
          </span>
        );
      default:
        return null;
    }
  };

  const handleApprove = async (deposit: any) => {
    const confirmed = confirm(`Xác nhận cộng ${deposit.amount.toLocaleString('vi-VN')}đ cho user ${deposit.username}?`);
    if (confirmed) {
      // Update deposit status
      await updateDeposit(deposit.id, {
        status: 'completed',
        completedAt: new Date().toISOString(),
      });
      
      alert(`✅ Đã duyệt và cộng ${deposit.amount.toLocaleString('vi-VN')}đ cho ${deposit.username}!`);
    }
  };

  const handleReject = async (depositId: string) => {
    const reason = prompt('Lý do từ chối:');
    if (reason) {
      await updateDeposit(depositId, {
        status: 'cancelled',
        note: reason,
      });
      alert(`Đã từ chối yêu cầu nạp tiền.`);
    }
  };

  const handleManualAdd = async () => {
    if (!addMoneyUserId || !addMoneyAmount) {
      alert('❌ Vui lòng nhập đầy đủ thông tin');
      return;
    }

    const amount = Number(addMoneyAmount);
    if (amount <= 0) {
      alert('❌ Số tiền phải lớn hơn 0');
      return;
    }

    // Tìm user theo username hoặc ID
    const user = users.find(u => 
      u.username === addMoneyUserId || 
      u.id === addMoneyUserId ||
      u.email === addMoneyUserId
    );

    if (!user) {
      alert(`❌ Không tìm thấy user: ${addMoneyUserId}`);
      return;
    }

    const confirmed = confirm(
      `XÁC NHẬN CỘNG TIỀN:\n` +
      `• User: ${user.username}\n` +
      `• Email: ${user.email}\n` +
      `• Số dư hiện tại: ${user.balance.toLocaleString('vi-VN')}đ\n` +
      `• Số tiền cộng: ${amount.toLocaleString('vi-VN')}đ\n` +
      `• Số dư sau khi cộng: ${(user.balance + amount).toLocaleString('vi-VN')}đ`
    );

    if (confirmed) {
      // Tạo deposit record để lưu lịch sử
      await addDeposit({
        userId: user.id,
        username: user.username,
        amount: amount,
        method: 'Chuyển Khoản Ngân Hàng',
        status: 'completed',
        completedAt: new Date().toISOString(),
        note: 'Chuyển Khoản Ngân Hàng',
      });

      alert(
        `✅ CỘNG TIỀN THÀNH CÔNG!\n\n` +
        `User ${user.username} đã nhận ${amount.toLocaleString('vi-VN')}đ\n` +
        `Số dư mới: ${(user.balance + amount).toLocaleString('vi-VN')}đ\n\n` +
        `User sẽ thấy số dư mới trong vòng 1-2 giây!`
      );

      setAddMoneyUserId('');
      setAddMoneyAmount('');
    }
  };

  // Normalize and guard deposits to avoid white-screen crashes when localStorage has bad records
  const safeDeposits = (Array.isArray(deposits) ? deposits : [])
    .filter((d: any) => d && d.id && (d.username || d.user?.username))
    .map((d: any) => ({
      id: String(d.id),
      userId: String(d.userId ?? d.user?.id ?? ''),
      username: String(d.username ?? d.user?.username ?? ''),
      amount: Number(d.amount ?? 0),
      status: String(d.status ?? 'pending'),
      method: String(d.method ?? 'bank'),
      note: String(d.note ?? ''),
      createdAt: String(d.createdAt ?? new Date().toISOString()),
      completedAt: d.completedAt ? String(d.completedAt) : undefined,
    }));

  const filteredDeposits = safeDeposits.filter((deposit: any) => {
    const idText = String(deposit.id || '').toLowerCase();
    const userText = String(deposit.username || '').toLowerCase();
    const q = String(searchTerm || '').toLowerCase();

    const matchesSearch = idText.includes(q) || userText.includes(q);
    const matchesFilter = filterStatus === 'all' || deposit.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

    const totalPending = safeDeposits
    .filter((d: any) => d.status === 'pending')
    .reduce((sum: number, d: any) => sum + (Number.isFinite(d.amount) ? d.amount : 0), 0);
  const totalTransferred = safeDeposits.filter(d => d.status === 'transferred').reduce((sum, d) => sum + d.amount, 0);
    const totalCompleted = safeDeposits
    .filter((d: any) => d.status === 'completed')
    .reduce((sum: number, d: any) => sum + (Number.isFinite(d.amount) ? d.amount : 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-white mb-2">Quản lý nạp tiền</h1>
        <p className="text-slate-300">Xử lý yêu cầu nạp tiền của khách hàng</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="text-slate-400 mb-2">Chờ duyệt</div>
          <div className="text-2xl text-yellow-400">
            {safeDeposits.filter(d => d.status === 'pending').length} yêu cầu
          </div>
          <div className="text-slate-500 text-sm mt-1">
            Tổng: {totalPending.toLocaleString('vi-VN')}đ
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="text-slate-400 mb-2">Đã duyệt</div>
          <div className="text-2xl text-green-400">
            {safeDeposits.filter(d => d.status === 'completed').length} yêu cầu
          </div>
          <div className="text-slate-500 text-sm mt-1">
            Tổng: {totalCompleted.toLocaleString('vi-VN')}đ
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="text-slate-400 mb-2">Tỷ lệ thành công</div>
          <div className="text-2xl text-blue-400">
            {safeDeposits.length > 0 
              ? Math.round((safeDeposits.filter(d => d.status === 'completed').length / safeDeposits.length) * 100)
              : 0}%
          </div>
          <div className="text-slate-500 text-sm mt-1">
            Từ chối: {safeDeposits.filter(d => d.status === 'cancelled').length}
          </div>
        </div>
      </div>

      {/* Manual Add Money */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 border border-blue-500">
        <h3 className="text-xl text-white mb-4 flex items-center gap-2">
          <DollarSign className="size-6" />
          Cộng tiền thủ công
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            value={addMoneyUserId}
            onChange={(e) => setAddMoneyUserId(e.target.value)}
            placeholder="Username, Email hoặc User ID"
            className="bg-white/20 text-white placeholder-slate-300 rounded-lg px-4 py-3 border border-white/30 focus:border-white focus:outline-none"
          />
          <input
            type="number"
            value={addMoneyAmount}
            onChange={(e) => setAddMoneyAmount(e.target.value)}
            placeholder="Số tiền"
            className="bg-white/20 text-white placeholder-slate-300 rounded-lg px-4 py-3 border border-white/30 focus:border-white focus:outline-none"
          />
          <button
            onClick={handleManualAdd}
            className="bg-white text-blue-600 rounded-lg px-6 py-3 hover:bg-slate-100 transition-colors font-semibold"
          >
            Cộng tiền
          </button>
        </div>
        <p className="text-slate-200 text-sm mt-3">
          💡 Nhập username (VD: "123"), email hoặc user ID để tìm user
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm theo mã giao dịch hoặc username..."
            className="w-full bg-slate-800 text-white rounded-lg pl-11 pr-4 py-3 border border-slate-700 focus:border-blue-500 focus:outline-none"
          />
        </div>
        
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-slate-800 text-white rounded-lg px-4 py-3 border border-slate-700 focus:border-blue-500 focus:outline-none"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="pending">Đã tạo lệnh</option>
          <option value="transferred">Đã thanh toán</option>
          <option value="completed">Đã duyệt</option>
          <option value="cancelled">Từ chối</option>
        </select>
      </div>

      {/* Deposits List */}
      <div className="space-y-4">
        {filteredDeposits.length === 0 ? (
          <div className="bg-slate-800 rounded-lg p-12 text-center border border-slate-700">
            <p className="text-slate-400 text-lg mb-2">
              {safeDeposits.length === 0 
                ? 'Chưa có giao dịch nạp tiền nào' 
                : 'Không tìm thấy giao dịch phù hợp'}
            </p>
            <p className="text-slate-500 text-sm">
              Sử dụng form "Cộng tiền thủ công" để cộng tiền cho user
            </p>
          </div>
        ) : (
          filteredDeposits
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((deposit) => (
              <div key={deposit.id} className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl text-white">Mã GD: {deposit.id}</h3>
                      {getStatusBadge(deposit.status)}
                    </div>
                    <div className="space-y-2 text-slate-300">
                      <p><strong>Khách hàng:</strong> {deposit.username} (user{deposit.userId.slice(-3)}...)</p>
                      <p><strong>Số tiền:</strong> <span className="text-2xl text-green-400">{deposit.amount.toLocaleString('vi-VN')}đ</span></p>
                      <p><strong>Nội dung CK:</strong> <span className="text-blue-400">{deposit.method}</span></p>
                      <p><strong>Thời gian:</strong> {new Date(deposit.createdAt).toLocaleString('vi-VN')}</p>
                      {deposit.completedAt && (
                        <p><strong>Hoàn thành:</strong> {new Date(deposit.completedAt).toLocaleString('vi-VN')}</p>
                      )}
                      {deposit.note && (
                        <p className="text-yellow-400"><strong>Ghi chú:</strong> {deposit.note}</p>
                      )}
                    </div>
                  </div>
                  
                  {deposit.status === 'transferred' && (
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleApprove(deposit)}
                        className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <CheckCircle className="size-5" />
                        Duyệt & Cộng tiền
                      </button>
                      <button
                        onClick={() => handleReject(deposit.id)}
                        className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <XCircle className="size-5" />
                        Từ chối
                      </button>
                    </div>
                  )}

                  {deposit.status === 'pending' && (
                    <div className="text-slate-400 text-sm">
                      Chưa xác nhận chuyển khoản (khách hàng chưa bấm "Đã thanh toán").
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