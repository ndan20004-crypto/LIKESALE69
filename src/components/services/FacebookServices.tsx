import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ThumbsUp, MessageCircle, Share2, UserPlus, Eye, Video, AlertCircle, Info, Loader2, Heart, Star, Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData, useBalance } from '../../contexts/DataContext';
import SuccessModal from '../common/SuccessModal';
import ErrorModal from '../common/ErrorModal';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

// Import reaction images
import likeImg from 'figma:asset/a3785be044fa2a469b38a5325ddfe750a459ed86.png';
import careImg from 'figma:asset/2f99866e7f9d64319e2ac6b05b513fc2e5fb9c81.png';
import loveImg from 'figma:asset/aa256cf9cd7fe1b4101e6cfce6e195c78871691c.png';
import hahaImg from 'figma:asset/72d5637bde15831d9eed0de54d7ee09a957cd568.png';
import wowImg from 'figma:asset/b72c3e23509e139d2ee53fc66cc2220d871a11de.png';

export default function FacebookServices() {
  const { serviceType } = useParams();
  const { user } = useAuth();
  const { addOrder, orders, serviceCatalog } = useData();
  const balance = useBalance(user?.username);
  
  const service = (serviceCatalog.facebook as any)[serviceType || 'like'];

  // Guard: old/partial serviceCatalog in localStorage can make service undefined -> blank page.
  if (!service) {
    return (
      <div className="p-6 text-slate-200">
        <div className="text-xl font-semibold mb-2">Dịch vụ không tồn tại</div>
        <div className="text-slate-400">Vui lòng chọn lại dịch vụ ở menu bên trái.</div>
      </div>
    );
  }
  const [activeTab, setActiveTab] = useState<'create' | 'history'>('create');
  const [formData, setFormData] = useState({
    packageId: '',
    link: '',
    quantity: '',
  });
  const [selectedReaction, setSelectedReaction] = useState<'like' | 'love' | 'care' | 'haha' | 'wow'>('like'); // Chọn 1 reaction duy nhất
  const [displayQuantity, setDisplayQuantity] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedId, setExtractedId] = useState('');

  // Modal states
  const [successModal, setSuccessModal] = useState({ isOpen: false, message: '', balance: 0 });
  const [errorModal, setErrorModal] = useState({ isOpen: false, message: '' });

  // Handle link change and extract ID
  const handleLinkChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setFormData({ ...formData, link: url });
    
    // Auto extract ID
    if (url && url.includes('facebook.com')) {
      setIsExtracting(true);
      setExtractedId('');
      
      try {
        const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-bc9725da/extract-facebook-id`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({ url })
        });

        const data = await response.json();
        console.log('🔍 Extract ID response:', data);

        if (data.id) {
          setExtractedId(data.id);
          // Tự động thay thế URL bằng ID
          setFormData({ ...formData, link: data.id });
        } else if (data.error) {
          console.error('❌ Error:', data.error);
          // Hiển thị modal lỗi
          setErrorModal({
            isOpen: true,
            message: data.error
          });
          // Reset link về rỗng
          setFormData({ ...formData, link: '' });
        }
      } catch (error) {
        console.error('❌ Error calling extract API:', error);
        setErrorModal({
          isOpen: true,
          message: 'Không thể kết nối đến server. Vui lòng thử lại sau.'
        });
        // Reset link về rỗng
        setFormData({ ...formData, link: '' });
      } finally {
        setIsExtracting(false);
      }
    } else {
      setExtractedId('');
    }
  };

  // Format số lượng
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\./g, ''); // Xóa dấu chấm cũ
    if (value === '' || /^\d+$/.test(value)) {
      setFormData({ ...formData, quantity: value });
      setDisplayQuantity(value ? Number(value).toLocaleString('vi-VN') : '');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.packageId || !formData.link || !formData.quantity) {
      setErrorModal({
        isOpen: true,
        message: 'Vui lòng điền đầy đủ thông tin'
      });
      return;
    }

    const selectedPackage = service.packages.find((p: any) => p.id === Number(formData.packageId));
    if (!selectedPackage) {
      setErrorModal({
        isOpen: true,
        message: 'Vui lòng chọn gói dịch vụ'
      });
      return;
    }

    const quantity = Number(formData.quantity);
    if (quantity < selectedPackage.min || quantity > selectedPackage.max) {
      setErrorModal({
        isOpen: true,
        message: `Số lượng phải từ ${selectedPackage.min.toLocaleString('vi-VN')} đến ${selectedPackage.max.toLocaleString('vi-VN')}`
      });
      return;
    }

    const totalPrice = (selectedPackage.price * quantity);

    // Kiểm tra số dư
    if (balance < totalPrice) {
      setErrorModal({
        isOpen: true,
        message: 
          `Số dư hiện tại: ${balance.toLocaleString('vi-VN')}đ\n` +
          `Số tiền cần: ${totalPrice.toLocaleString('vi-VN')}đ\n` +
          `Còn thiếu: ${(totalPrice - balance).toLocaleString('vi-VN')}đ\n\n` +
          `Vui lòng nạp thêm tiền để tiếp tục`
      });
      return;
    }

    // Tạo đơn hàng
    addOrder({
      userId: user!.id,
      username: user!.username,
      service: selectedPackage.name,
      platform: 'Facebook',
      link: formData.link,
      quantity: quantity,
      price: totalPrice,
      // Chỉ áp dụng cho dịch vụ tăng like bài viết (Facebook Like post)
      ...(serviceType === 'like' ? { reactionType: selectedReaction } : {}),
      status: 'pending',
    });

    // Hiện modal thành công
    setSuccessModal({
      isOpen: true,
      message: `Đơn hàng của bạn đang được xử lý\nVào "Lịch sử đơn hng" để theo dõi`,
      balance: balance - totalPrice
    });

    // Reset form
    setFormData({
      packageId: '',
      link: '',
      quantity: '',
    });
    setDisplayQuantity('');
    setExtractedId('');
  };

  const selectedPackage = service.packages.find((p: any) => p.id === Number(formData.packageId));
  const totalPrice = selectedPackage ? (selectedPackage.price * Number(formData.quantity)) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl text-white mb-2 flex items-center gap-3">
          {service.icon && <service.icon className="size-8 text-blue-400" />}
          {service.title}
        </h1>
        <p className="text-slate-300">{service.description}</p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Form */}
        <div className="lg:col-span-2">
          <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-slate-700">
              <button
                onClick={() => setActiveTab('create')}
                className={`flex-1 px-6 py-4 transition-colors ${
                  activeTab === 'create'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                Tạo đơn hàng
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex-1 px-6 py-4 transition-colors ${
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
              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Package Selection */}
                  <div>
                    <label className="block text-white mb-2">
                      Chọn gói *
                    </label>
                    <select
                      value={formData.packageId}
                      onChange={(e) => setFormData({ ...formData, packageId: e.target.value })}
                      className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
                      required
                    >
                      <option value="">-- Chọn gói dịch vụ --</option>
                      {service.packages.map((pkg: any) => (
                        <option key={pkg.id} value={pkg.id}>
                          {pkg.name} - Giá {pkg.price}đ - Min {pkg.min} - Max {pkg.max.toLocaleString('vi-VN')}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Link Input */}
                  <div>
                    <label className="block text-white mb-2">
                      Link Facebook *
                    </label>
                    <input
                      type="text"
                      value={formData.link}
                      onChange={handleLinkChange}
                      placeholder="https://www.facebook.com/..."
                      className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
                      required
                    />
                    {isExtracting ? (
                      <div className="mt-2 p-3 bg-blue-900/30 border border-blue-700 rounded-lg">
                        <p className="text-blue-400 text-sm flex items-center gap-2">
                          <Loader2 className="size-4 animate-spin" />
                          <span>
                            Đang trích xuất ID...
                          </span>
                        </p>
                      </div>
                    ) : extractedId && extractedId !== formData.link && (
                      <div className="mt-2 p-3 bg-green-900/30 border border-green-700 rounded-lg">
                        <p className="text-green-400 text-sm flex items-center gap-2">
                          <Info className="size-4" />
                          <span>
                            <strong>ID đã trích xuất:</strong> {extractedId}
                          </span>
                        </p>
                      </div>
                    )}
                    
                    {/* Reactions (chỉ hiển thị cho service "like") */}
                    {serviceType === 'like' && (
                      <div className="mt-3">
                        <label className="block text-white mb-2 text-sm">
                          Biểu tượng cảm xúc
                        </label>
                        <div className="flex flex-wrap gap-5">
                          {/* Like */}
                          <label className="cursor-pointer">
                            <input
                              type="radio"
                              name="reaction"
                              checked={selectedReaction === 'like'}
                              onChange={() => setSelectedReaction('like')}
                              className="sr-only"
                            />
                            <img 
                              src={likeImg} 
                              alt="Like" 
                              className={`w-[30px] h-[30px] transition-all duration-200 ${
                                selectedReaction === 'like' 
                                  ? 'scale-125 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]' 
                                  : 'opacity-60 hover:opacity-100 hover:scale-110'
                              }`}
                            />
                          </label>

                          {/* Care */}
                          <label className="cursor-pointer">
                            <input
                              type="radio"
                              name="reaction"
                              checked={selectedReaction === 'care'}
                              onChange={() => setSelectedReaction('care')}
                              className="sr-only"
                            />
                            <img 
                              src={careImg} 
                              alt="Care" 
                              className={`w-[30px] h-[30px] transition-all duration-200 ${
                                selectedReaction === 'care' 
                                  ? 'scale-125 drop-shadow-[0_0_8px_rgba(255,193,7,0.8)]' 
                                  : 'opacity-60 hover:opacity-100 hover:scale-110'
                              }`}
                            />
                          </label>

                          {/* Love */}
                          <label className="cursor-pointer">
                            <input
                              type="radio"
                              name="reaction"
                              checked={selectedReaction === 'love'}
                              onChange={() => setSelectedReaction('love')}
                              className="sr-only"
                            />
                            <img 
                              src={loveImg} 
                              alt="Love" 
                              className={`w-[30px] h-[30px] transition-all duration-200 ${
                                selectedReaction === 'love' 
                                  ? 'scale-125 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]' 
                                  : 'opacity-60 hover:opacity-100 hover:scale-110'
                              }`}
                            />
                          </label>

                          {/* Haha */}
                          <label className="cursor-pointer">
                            <input
                              type="radio"
                              name="reaction"
                              checked={selectedReaction === 'haha'}
                              onChange={() => setSelectedReaction('haha')}
                              className="sr-only"
                            />
                            <img 
                              src={hahaImg} 
                              alt="Haha" 
                              className={`w-[30px] h-[30px] transition-all duration-200 ${
                                selectedReaction === 'haha' 
                                  ? 'scale-125 drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]' 
                                  : 'opacity-60 hover:opacity-100 hover:scale-110'
                              }`}
                            />
                          </label>

                          {/* Wow */}
                          <label className="cursor-pointer">
                            <input
                              type="radio"
                              name="reaction"
                              checked={selectedReaction === 'wow'}
                              onChange={() => setSelectedReaction('wow')}
                              className="sr-only"
                            />
                            <img 
                              src={wowImg} 
                              alt="Wow" 
                              className={`w-[30px] h-[30px] transition-all duration-200 ${
                                selectedReaction === 'wow' 
                                  ? 'scale-125 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]' 
                                  : 'opacity-60 hover:opacity-100 hover:scale-110'
                              }`}
                            />
                          </label>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Quantity Input */}
                  <div>
                    <label className="block text-white mb-2">
                      Số lượng *
                    </label>
                    <input
                      type="text"
                      value={displayQuantity}
                      onChange={handleQuantityChange}
                      placeholder={selectedPackage ? `Min: ${selectedPackage.min} - Max: ${selectedPackage.max.toLocaleString('vi-VN')}` : 'Chọn gói trước'}
                      className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
                      required
                    />
                    {selectedPackage && (
                      <p className="text-slate-400 text-sm mt-1">
                        Số lưng từ {selectedPackage.min.toLocaleString('vi-VN')} đến {selectedPackage.max.toLocaleString('vi-VN')}
                      </p>
                    )}
                  </div>

                  {/* Total Price */}
                  {totalPrice > 0 && (
                    <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
                      <div className="flex justify-between items-center text-white">
                        <span>Tổng tiền:</span>
                        <span className="text-2xl">{totalPrice.toLocaleString('vi-VN')}đ</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-300 text-sm mt-2">
                        <span>Số dư hiện tại:</span>
                        <span>{balance.toLocaleString('vi-VN')}đ</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-300 text-sm mt-1">
                        <span>Số dư sau khi trừ:</span>
                        <span className={balance >= totalPrice ? 'text-green-400' : 'text-red-400'}>
                          {(balance - totalPrice).toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-colors text-lg"
                  >
                    TẠO ĐƠN HÀNG
                  </button>

                  <p className="text-slate-400 text-sm text-center">
                    Số dư sẽ tự động bị trừ khi bạn tạo đơn hàng (Số dư sẽ không hoàn nếu đơn hàng thành công)
                  </p>
                </form>
              </div>
            ) : (
              <div className="p-6">
                {orders.filter(order => 
                  order.username === user?.username && 
                  order.platform === 'Facebook' &&
                  // Lọc theo service type hiện tại
                  (
                    (serviceType === 'like' && order.service.includes('Like post')) ||
                    (serviceType === 'comment' && order.service.includes('comment bài viết')) ||
                    (serviceType === 'comment-like' && order.service.includes('Like Comment')) ||
                    (serviceType === 'share' && order.service.includes('Share')) ||
                    (serviceType === 'follow' && order.service.includes('follow facebook')) ||
                    (serviceType === 'page-like' && (order.service.includes('like / follow') || order.service.includes('like việt') || order.service.includes('follow việt'))) ||
                    (serviceType === 'page-review' && order.service.includes('đánh giá')) ||
                    (serviceType === 'group-member' && order.service.includes('Thành Viên Group')) ||
                    (serviceType === 'story-view' && order.service.includes('view story'))
                  )
                ).length > 0 ? (
                  <div className="space-y-4">
                    {orders
                      .filter(order => 
                        order.username === user?.username && 
                        order.platform === 'Facebook' &&
                        (
                          (serviceType === 'like' && order.service.includes('Like post')) ||
                          (serviceType === 'comment' && order.service.includes('comment bài viết')) ||
                          (serviceType === 'comment-like' && order.service.includes('Like Comment')) ||
                          (serviceType === 'share' && order.service.includes('Share')) ||
                          (serviceType === 'follow' && order.service.includes('follow facebook')) ||
                          (serviceType === 'page-like' && (order.service.includes('like / follow') || order.service.includes('like việt') || order.service.includes('follow việt'))) ||
                          (serviceType === 'page-review' && order.service.includes('đánh giá')) ||
                          (serviceType === 'group-member' && order.service.includes('Thành Viên Group')) ||
                          (serviceType === 'story-view' && order.service.includes('view story'))
                        )
                      )
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .map((order) => (
                        <div key={order.id} className="bg-slate-700 rounded-lg p-4 border border-slate-600 hover:border-yellow-500 transition-all duration-200">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="text-white">{order.service}</h4>
                              <p className="text-slate-400 text-sm">Mã đơn: {order.id}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm ${
                              order.status === 'completed' ? 'bg-green-600 text-white' :
                              order.status === 'processing' ? 'bg-blue-600 text-white' :
                              order.status === 'pending' ? 'bg-yellow-600 text-white' :
                              'bg-red-600 text-white'
                            }`}>
                              {order.status === 'completed' ? 'Hoàn thành' :
                               order.status === 'processing' ? 'Đang xử lý' :
                               order.status === 'pending' ? 'Đang chờ' :
                               'Đã hủy'}
                            </span>
                          </div>
                          <div className="text-slate-300 text-sm space-y-1">
                            <p>Link: <span className="text-blue-400 break-all">{order.link}</span></p>
                            {order.reactionType && (
                              <p>Biểu tượng: <span className="text-white">{order.reactionType}</span></p>
                            )}
                            <p>Số lượng: {order.quantity.toLocaleString('vi-VN')}</p>
                            <p>Giá: <span className="text-green-400">{order.price.toLocaleString('vi-VN')}đ</span></p>
                            <p className="text-slate-500">Tạo lúc: {new Date(order.createdAt).toLocaleString('vi-VN')}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center text-slate-400 py-12">
                    <AlertCircle className="size-12 mx-auto mb-3 text-slate-600" />
                    <p>Chưa có đơn hàng nào</p>
                    <p className="text-sm mt-2">Vào menu "Lịch sử đơn hàng" để xem tất cả đơn hàng của bạn</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Package Details */}
        <div className="lg:col-span-1">
          {selectedPackage && (
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 sticky top-6">
              <h3 className="text-xl text-white mb-4">THÔNG TIN GÓI</h3>
              <div className="space-y-3 text-slate-300">
                <div>
                  <strong className="text-blue-400">Tên gói:</strong>
                  <p className="mt-1">{selectedPackage.name}</p>
                </div>
                <div>
                  <strong className="text-blue-400">Giá:</strong>
                  <p className="mt-1 text-green-400">{selectedPackage.price}đ</p>
                </div>
                <div>
                  <strong className="text-blue-400">Min - Max:</strong>
                  <p className="mt-1">{selectedPackage.min.toLocaleString('vi-VN')} - {selectedPackage.max.toLocaleString('vi-VN')}</p>
                </div>
                <div>
                  <strong className="text-blue-400">Tốc độ:</strong>
                  <p className="mt-1">{selectedPackage.speed}</p>
                </div>
                <div>
                  <strong className="text-blue-400">Bảo hành:</strong>
                  <p className="mt-1">{selectedPackage.warranty}</p>
                </div>
                {selectedPackage.dropRate && (
                  <div>
                    <strong className="text-blue-400">Tỷ lệ tuột:</strong>
                    <p className="mt-1 text-yellow-400">{selectedPackage.dropRate}</p>
                  </div>
                )}
                {selectedPackage.canCancel && (
                  <div>
                    <strong className="text-blue-400">Hủy đơn:</strong>
                    <p className="mt-1">Có thể hủy (phí {selectedPackage.cancelFee}đ)</p>
                  </div>
                )}
                <div>
                  <strong className="text-blue-400">Mô tả:</strong>
                  <p className="mt-1 text-sm whitespace-pre-line">{selectedPackage.description}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <SuccessModal
        isOpen={successModal.isOpen}
        title="TẠO ĐƠN HÀNG THÀNH CÔNG"
        message={successModal.message}
        balance={successModal.balance}
        onClose={() => setSuccessModal({ isOpen: false, message: '', balance: 0 })}
      />
      <ErrorModal
        isOpen={errorModal.isOpen}
        title="LỖI"
        message={errorModal.message}
        onClose={() => setErrorModal({ isOpen: false, message: '' })}
      />
    </div>
  );
}