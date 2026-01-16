import React, { useState } from 'react';
import { Heart, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface TikTokLikeProps {
  userBalance: number;
  onOrderCreated: () => void;
}

export default function TikTokLike({ userBalance, onOrderCreated }: TikTokLikeProps) {
  const [url, setUrl] = useState('');
  const [quantity, setQuantity] = useState('');
  const [server, setServer] = useState('server1');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'create' | 'history'>('create');

  const servers = [
    { 
      id: 'server1', 
      name: 'Like TikTok Server 1', 
      price: 25,
      min: 100, 
      max: 100000,
      speed: 'Trung bình ~500-2000 like / ngày',
      warranty: 'Không',
      refund: '10-20%',
      cancel: 'Có thể hủy (ghi 1000)',
      description: 'Đô giá 1-4h, Like sẽ tài khoản TikTok thật\nCó thể tuột 10-20% trong quá trình tăng'
    },
  ];

  const selectedServer = servers.find(s => s.id === server) || servers[0];
  const totalPrice = Math.ceil((parseInt(quantity) || 0) * selectedServer.price );

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
      // Lấy danh sách đơn hàng hiện tại
      const allOrdersStr = localStorage.getItem('allOrders') || '[]';
      const allOrders = JSON.parse(allOrdersStr);

      // Tạo đơn hàng mới
      const newOrder = {
        id: `ORD${Date.now()}`,
        service: 'TikTok - Tăng Tym Video',
        server: selectedServer.name,
        url: url.trim(),
        quantity: qty,
        price: selectedServer.price,
        totalPrice: totalPrice,
        status: 'processing',
        createdAt: new Date().toISOString(),
        userEmail: localStorage.getItem('userEmail') || 'unknown',
      };

      // Thêm đơn hàng mới
      allOrders.push(newOrder);
      localStorage.setItem('allOrders', JSON.stringify(allOrders));

      // Cập nhật số dư
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      currentUser.balance = (currentUser.balance || 0) - totalPrice;
      localStorage.setItem('currentUser', JSON.stringify(currentUser));

      // Cập nhật trong allUsers
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
    <div className="bg-slate-800 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 p-6">
        <div className="flex items-center gap-3 mb-2">
          <Heart className="size-6 text-white" />
          <h2 className="text-xl text-white">Tăng Tym Video TikTok</h2>
        </div>
        <p className="text-sm text-white/80">Tăng tym cho video TikTok. Tăng tương tác nhanh chóng.</p>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 border-b border-slate-700">
        <button
          onClick={() => setActiveTab('create')}
          className={`py-4 text-center transition-colors ${
            activeTab === 'create'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          Tạo đơn hàng
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`py-4 text-center transition-colors ${
            activeTab === 'history'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          Lịch sử đơn hàng
        </button>
      </div>

      {/* Content */}
      {activeTab === 'create' ? (
        <div className="grid lg:grid-cols-3 gap-6 p-6">
          {/* Left - Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Server Selection */}
              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  Chọn gói <span className="text-red-500">*</span>
                </label>
                <select
                  value={server}
                  onChange={(e) => setServer(e.target.value)}
                  className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                >
                  {servers.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} - Giá {s.price}đ / 1 - Min {s.min} - Max {s.max.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              {/* URL Input */}
              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  Link TikTok <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.tiktok.com/..."
                  className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Quantity Input */}
              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  Số lượng <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder={`Min ${selectedServer.min} - Max ${selectedServer.max.toLocaleString()}`}
                  min={selectedServer.min}
                  max={selectedServer.max}
                  className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                />
                <p className="text-xs text-slate-400 mt-1">
                  Số lượng từ {selectedServer.min.toLocaleString()} đến {selectedServer.max.toLocaleString()}
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !url || !quantity || totalPrice > userBalance}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white py-4 rounded-lg transition-all flex items-center justify-center gap-2 text-lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <span>TẠO ĐƠN HÀNG</span>
                )}
              </button>

              {/* Note */}
              <p className="text-xs text-center text-slate-400">
                Số dư sẽ tự động trừ khi bạn tạo đơn hàng (Số dư sẽ không hoàn nếu đơn hàng thành công)
              </p>
            </form>
          </div>

          {/* Right - Package Info */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900 rounded-lg p-5 border border-slate-700">
              <h3 className="text-white text-lg mb-4">THÔNG TIN GÓI</h3>
              
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-teal-400 mb-1">Tên gói:</p>
                  <p className="text-white">{selectedServer.name}</p>
                </div>

                <div>
                  <p className="text-teal-400 mb-1">Giá:</p>
                  <p className="text-white">{selectedServer.price}đ / 1</p>
                </div>

                <div>
                  <p className="text-teal-400 mb-1">Min - Max:</p>
                  <p className="text-white">{selectedServer.min.toLocaleString()} - {selectedServer.max.toLocaleString()}</p>
                </div>

                <div>
                  <p className="text-teal-400 mb-1">Tốc độ:</p>
                  <p className="text-white">{selectedServer.speed}</p>
                </div>

                <div>
                  <p className="text-teal-400 mb-1">Bảo hành:</p>
                  <p className="text-white">{selectedServer.warranty}</p>
                </div>

                <div>
                  <p className="text-teal-400 mb-1">Tỷ lệ tuột:</p>
                  <p className="text-white">{selectedServer.refund}</p>
                </div>

                <div>
                  <p className="text-teal-400 mb-1">Hủy đơn:</p>
                  <p className="text-white">{selectedServer.cancel}</p>
                </div>

                <div>
                  <p className="text-teal-400 mb-1">Mô tả:</p>
                  <p className="text-white whitespace-pre-line text-xs leading-relaxed">{selectedServer.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6">
          <div className="bg-slate-700 rounded-lg p-8 text-center">
            <AlertCircle className="size-12 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-400">Xem lịch sử đơn hàng tại mục "Lịch sử đơn hàng" trong menu</p>
          </div>
        </div>
      )}
    </div>
  );
}
