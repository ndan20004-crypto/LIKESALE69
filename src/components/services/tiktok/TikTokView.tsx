import React, { useState } from 'react';
import { Eye, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface TikTokViewProps {
  userBalance: number;
  onOrderCreated: () => void;
}

export default function TikTokView({ userBalance, onOrderCreated }: TikTokViewProps) {
  const [url, setUrl] = useState('');
  const [quantity, setQuantity] = useState('');
  const [server, setServer] = useState('server1');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const servers = [
    { id: 'server1', name: 'Tăng View Video Beta Server 1', price: 7, min: 1000, max: 1000000 },
  ];

  const selectedServer = servers.find(s => s.id === server) || servers[0];
  const totalPrice = parseInt(quantity) * selectedServer.price || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim()) {
      toast.error('Vui lòng nhập link video TikTok!');
      return;
    }

    const qty = parseInt(quantity);
    if (!qty || qty < selectedServer.min) {
      toast.error(`Số lượng tối thiểu là ${selectedServer.min}!`);
      return;
    }

    if (qty > selectedServer.max) {
      toast.error(`Số lượng tối đa là ${selectedServer.max.toLocaleString()}!`);
      return;
    }

    if (totalPrice > userBalance) {
      toast.error('Số dư không đủ! Vui lòng nạp thêm tiền.');
      return;
    }

    setIsSubmitting(true);

    try {
      const allOrdersStr = localStorage.getItem('allOrders') || '[]';
      const allOrders = JSON.parse(allOrdersStr);

      const newOrder = {
        id: `ORD${Date.now()}`,
        service: 'TikTok - Tăng View Video',
        server: selectedServer.name,
        url: url.trim(),
        quantity: qty,
        price: selectedServer.price,
        totalPrice: totalPrice,
        status: 'processing',
        createdAt: new Date().toISOString(),
        userEmail: localStorage.getItem('userEmail') || 'unknown',
      };

      allOrders.push(newOrder);
      localStorage.setItem('allOrders', JSON.stringify(allOrders));

      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      currentUser.balance = (currentUser.balance || 0) - totalPrice;
      localStorage.setItem('currentUser', JSON.stringify(currentUser));

      const allUsersStr = localStorage.getItem('allUsers') || '[]';
      const allUsers = JSON.parse(allUsersStr);
      const userIndex = allUsers.findIndex((u: any) => u.email === currentUser.email);
      if (userIndex !== -1) {
        allUsers[userIndex].balance = currentUser.balance;
        localStorage.setItem('allUsers', JSON.stringify(allUsers));
      }

      toast.success('Tạo đơn hàng thành công!');
      setUrl('');
      setQuantity('');
      onOrderCreated();
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Có lỗi xảy ra! Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Eye className="size-6 text-purple-500" />
        <h2 className="text-xl text-white">Tăng View Video TikTok</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-slate-300 mb-2">Chọn Server</label>
          <select
            value={server}
            onChange={(e) => setServer(e.target.value)}
            className="w-full bg-slate-700 text-white px-4 py-2.5 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
          >
            {servers.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} - {s.price}đ/view (Min: {s.min.toLocaleString()})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-2">Link Video TikTok</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.tiktok.com/@username/video/..."
            className="w-full bg-slate-700 text-white px-4 py-2.5 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-2">Số Lượng</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder={`Tối thiểu ${selectedServer.min.toLocaleString()}`}
            min={selectedServer.min}
            max={selectedServer.max}
            className="w-full bg-slate-700 text-white px-4 py-2.5 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
          />
          <p className="text-xs text-slate-400 mt-1">
            Min: {selectedServer.min.toLocaleString()} - Max: {selectedServer.max.toLocaleString()}
          </p>
        </div>

        <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-300">Đơn giá:</span>
            <span className="text-white">{selectedServer.price.toLocaleString()}đ</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-300">Số lượng:</span>
            <span className="text-white">{parseInt(quantity) || 0}</span>
          </div>
          <div className="border-t border-slate-600 pt-2 mt-2">
            <div className="flex justify-between items-center">
              <span className="text-white">Tổng tiền:</span>
              <span className="text-2xl text-green-400">{totalPrice.toLocaleString()}đ</span>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2 bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
          <AlertCircle className="size-5 text-orange-500 shrink-0 mt-0.5" />
          <div className="text-sm text-orange-300">
            <p className="mb-1">Lưu ý:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Video phải ở chế độ công khai</li>
              <li>Số lượng tối thiểu: 1,000 view</li>
              <li>Thời gian xử lý: 1-24 giờ</li>
            </ul>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !url || !quantity || totalPrice > userBalance}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-slate-600 disabled:to-slate-600 text-white py-3 rounded-lg transition-all flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              <span>Đang xử lý...</span>
            </>
          ) : (
            <>
              <Eye className="size-5" />
              <span>Tạo Đơn Hàng</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
