import React, { useState } from 'react';
import { Search, Edit, Trash2, Eye, Plus, DollarSign } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

export default function AdminUsers() {
  const { users, updateUser, deleteUser } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [editBalance, setEditBalance] = useState<any>(null);
  const [balanceAmount, setBalanceAmount] = useState('');

  const handleEditBalance = (user: any) => {
    setEditBalance(user);
    setBalanceAmount(user.balance.toString());
  };

  const handleSaveBalance = () => {
    if (!editBalance || !balanceAmount) return;
    
    const newBalance = Number(balanceAmount);
    const confirmed = confirm(`Xác nhận đổi số dư của ${editBalance.username} thành ${newBalance.toLocaleString('vi-VN')}đ?`);
    
    if (confirmed) {
      updateUser(editBalance.id, { balance: newBalance });
      alert('Đã cập nhật số dư thành công! User sẽ thấy số dư mới trong vài giây.');
      setEditBalance(null);
      setBalanceAmount('');
    }
  };

  const handleDeleteUser = (user: any) => {
    const confirmed = confirm(`CẢNH BÁO: Bạn có chắc muốn xóa user ${user.username}? Hành động này không thể hoàn tác!`);
    if (confirmed) {
      deleteUser(user.id);
      alert('Đã xóa user!');
    }
  };

  const handleBlockUser = (user: any) => {
    const newStatus = user.status === 'active' ? 'blocked' : 'active';
    const action = newStatus === 'blocked' ? 'khóa' : 'mở khóa';
    const confirmed = confirm(`Xác nhận ${action} tài khoản ${user.username}?`);
    if (confirmed) {
      updateUser(user.id, { status: newStatus });
      alert(`Đã ${action} tài khoản thành công!`);
    }
  };

  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return user.id.toLowerCase().includes(searchLower) ||
           user.username.toLowerCase().includes(searchLower) ||
           user.email.toLowerCase().includes(searchLower);
  });

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const totalBalance = users.reduce((sum, u) => sum + u.balance, 0);
  const totalRevenue = users.reduce((sum, u) => sum + u.totalSpent, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-white mb-2">Quản lý người dùng</h1>
        <p className="text-slate-300">Xem và quản lý tất cả người dùng trong hệ thống</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="text-slate-400 mb-2">Tổng người dùng</div>
          <div className="text-3xl text-white">{totalUsers}</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="text-slate-400 mb-2">Đang hoạt động</div>
          <div className="text-3xl text-green-400">{activeUsers}</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="text-slate-400 mb-2">Tổng số dư</div>
          <div className="text-xl text-blue-400">{totalBalance.toLocaleString('vi-VN')}đ</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="text-slate-400 mb-2">Tổng doanh thu</div>
          <div className="text-xl text-purple-400">{totalRevenue.toLocaleString('vi-VN')}đ</div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-5" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Tìm kiếm theo ID, username, email..."
          className="w-full bg-slate-800 text-white rounded-lg pl-11 pr-4 py-3 border border-slate-700 focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* Users Table */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-slate-400 mb-2">Chưa có người dùng nào</div>
            <p className="text-slate-500 text-sm">Người dùng mới đăng ký sẽ hiển thị tại đây</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left text-slate-300">User ID</th>
                  <th className="px-4 py-3 text-left text-slate-300">Username</th>
                  <th className="px-4 py-3 text-left text-slate-300">Email</th>
                  <th className="px-4 py-3 text-left text-slate-300">Số dư</th>
                  <th className="px-4 py-3 text-left text-slate-300">Tổng chi</th>
                  <th className="px-4 py-3 text-left text-slate-300">Đơn hàng</th>
                  <th className="px-4 py-3 text-left text-slate-300">Trạng thái</th>
                  <th className="px-4 py-3 text-left text-slate-300">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-t border-slate-700 hover:bg-slate-700/50">
                    <td className="px-4 py-3 text-white">{user.id}</td>
                    <td className="px-4 py-3 text-white">{user.username}</td>
                    <td className="px-4 py-3 text-slate-300">{user.email}</td>
                    <td className="px-4 py-3 text-green-400">{user.balance.toLocaleString('vi-VN')}đ</td>
                    <td className="px-4 py-3 text-purple-400">{user.totalSpent.toLocaleString('vi-VN')}đ</td>
                    <td className="px-4 py-3 text-white">{user.totalOrders}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        user.status === 'active' 
                          ? 'bg-green-600 text-white' 
                          : 'bg-red-600 text-white'
                      }`}>
                        {user.status === 'active' ? 'Hoạt động' : 'Đã khóa'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                          title="Xem chi tiết"
                        >
                          <Eye className="size-4" />
                        </button>
                        <button
                          onClick={() => handleEditBalance(user)}
                          className="p-2 bg-green-600 text-white rounded hover:bg-green-700"
                          title="Chỉnh sửa số dư"
                        >
                          <DollarSign className="size-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
                          title="Xóa user"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedUser(null)}>
          <div className="bg-slate-800 rounded-lg p-6 max-w-2xl w-full border border-slate-700" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl text-white mb-4">Chi tiết người dùng: {selectedUser.username}</h2>
            <div className="space-y-3 text-slate-300">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong className="text-white">User ID:</strong> {selectedUser.id}
                </div>
                <div>
                  <strong className="text-white">Username:</strong> {selectedUser.username}
                </div>
                <div className="col-span-2">
                  <strong className="text-white">Email:</strong> {selectedUser.email}
                </div>
                <div>
                  <strong className="text-white">Số điện thoại:</strong> {selectedUser.phone || 'Chưa cập nhật'}
                </div>
                <div>
                  <strong className="text-white">Trạng thái:</strong>{' '}
                  <span className={selectedUser.status === 'active' ? 'text-green-400' : 'text-red-400'}>
                    {selectedUser.status === 'active' ? 'Hoạt động' : 'Đã khóa'}
                  </span>
                </div>
                <div>
                  <strong className="text-white">Số dư hiện tại:</strong>{' '}
                  <span className="text-green-400">{selectedUser.balance.toLocaleString('vi-VN')}đ</span>
                </div>
                <div>
                  <strong className="text-white">Tổng chi tiêu:</strong>{' '}
                  <span className="text-purple-400">{selectedUser.totalSpent.toLocaleString('vi-VN')}đ</span>
                </div>
                <div>
                  <strong className="text-white">Tổng đơn hàng:</strong> {selectedUser.totalOrders}
                </div>
                <div className="col-span-2">
                  <strong className="text-white">Ngày đăng ký:</strong> {new Date(selectedUser.createdAt).toLocaleString('vi-VN')}
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  handleBlockUser(selectedUser);
                  setSelectedUser(null);
                }}
                className={`flex-1 px-4 py-2 ${selectedUser.status === 'active' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white rounded-lg transition-colors`}
              >
                {selectedUser.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
              </button>
              <button
                onClick={() => {
                  setSelectedUser(null);
                  handleEditBalance(selectedUser);
                }}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Chỉnh sửa số dư
              </button>
              <button
                onClick={() => setSelectedUser(null)}
                className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Balance Modal */}
      {editBalance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setEditBalance(null)}>
          <div className="bg-slate-800 rounded-lg p-6 max-w-md w-full border border-slate-700" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl text-white mb-4">Chỉnh sửa số dư</h2>
            <p className="text-slate-300 mb-4">
              User: <strong className="text-white">{editBalance.username}</strong>
            </p>
            <p className="text-slate-300 mb-4">
              Số dư hiện tại: <strong className="text-green-400">{editBalance.balance.toLocaleString('vi-VN')}đ</strong>
            </p>

            <div className="mb-4">
              <label className="block text-slate-300 mb-2">Số dư mới</label>
              <input
                type="number"
                value={balanceAmount}
                onChange={(e) => setBalanceAmount(e.target.value)}
                className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
                placeholder="Nhập số dư mới"
              />
            </div>

            <div className="mb-6">
              <p className="text-slate-400 text-sm mb-2">Hoặc cộng/trừ nhanh:</p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setBalanceAmount((Number(balanceAmount) + 50000).toString())}
                  className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                >
                  +50K
                </button>
                <button
                  onClick={() => setBalanceAmount((Number(balanceAmount) + 100000).toString())}
                  className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                >
                  +100K
                </button>
                <button
                  onClick={() => setBalanceAmount((Number(balanceAmount) + 500000).toString())}
                  className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                >
                  +500K
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSaveBalance}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Lưu thay đổi
              </button>
              <button
                onClick={() => {
                  setEditBalance(null);
                  setBalanceAmount('');
                }}
                className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
