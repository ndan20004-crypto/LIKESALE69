import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { UserPlus, Heart, MessageCircle, Eye, Video, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData, useBalance } from '../../contexts/DataContext';
import SuccessModal from '../common/SuccessModal';
import ErrorModal from '../common/ErrorModal';

export default function InstagramServices() {
  const { serviceType } = useParams();
  const { user } = useAuth();
  const { addOrder, orders, serviceCatalog } = useData();
  const balance = useBalance(user?.username);

  // Be resilient to old/partial serviceCatalog objects in localStorage.
  const instagramCatalog: any = (serviceCatalog as any)?.instagram || {};
  const service = instagramCatalog?.[serviceType || 'like'];

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
    comments: '', // cho dịch vụ tăng comment
  });
  const [displayQuantity, setDisplayQuantity] = useState('');
  // Auto-calc quantity from comment list (only for comment service)
  const autoCommentList = useMemo(() => {
    return formData.comments
      .split(/\r?\n/)
      .map((x) => x.trim())
      .filter(Boolean);
  }, [formData.comments]);

  useEffect(() => {
    if (serviceType === 'comment') {
      const q = autoCommentList.length;
      // Keep formData.quantity + displayQuantity in sync (read-only input)
      setFormData((prev) => {
        const next = String(q || '');
        return prev.quantity === next ? prev : { ...prev, quantity: next };
      });
      setDisplayQuantity(q ? q.toLocaleString('vi-VN') : '');
    }
  }, [serviceType, autoCommentList]);


  // Modal states
  const [successModal, setSuccessModal] = useState({ isOpen: false, message: '', balance: 0 });
  const [errorModal, setErrorModal] = useState({ isOpen: false, message: '' });

  // Format số lượng
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (serviceType === 'comment') return; // auto-calculated
    const value = e.target.value.replace(/\./g, ''); // Xóa dấu chấm cũ
    if (value === '' || /^\d+$/.test(value)) {
      setFormData({ ...formData, quantity: value });
      setDisplayQuantity(value ? Number(value).toLocaleString('vi-VN') : '');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.packageId || !formData.link || (serviceType !== 'comment' && !formData.quantity) || (serviceType === 'comment' && !formData.comments)) {
      setErrorModal({
        isOpen: true,
        message: 'Vui lòng điền đầy đủ thông tin'
      });
      return;
    }

    // Validate comments list for "comment" service and auto-calc quantity
    let autoQuantityFromComments: number | null = null;
    if (serviceType === 'comment') {
      const list = formData.comments
        .split(/\r?\n/)
        .map((x) => x.trim())
        .filter(Boolean);

      if (list.length < 5) {
        setErrorModal({
          isOpen: true,
          message: 'Vui lòng nhập danh sách nội dung bình luận (tối thiểu 5 bình luận, mỗi dòng 1 bình luận)'
        });
        return;
      }
      autoQuantityFromComments = list.length;
    }

    const selectedPackage = service.packages.find((p: any) => p.id === Number(formData.packageId));
    if (!selectedPackage) {
      setErrorModal({
        isOpen: true,
        message: 'Vui lòng chọn gói dịch vụ'
      });
      return;
    }

    const quantity = serviceType === 'comment' && autoQuantityFromComments !== null
      ? autoQuantityFromComments
      : Number(formData.quantity);
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
      platform: 'Instagram',
      link: formData.link,
      quantity: quantity,
      price: totalPrice,
      ...(serviceType === 'comment'
        ? {
            comments: formData.comments
              .split(/\r?\n/)
              .map((s) => s.trim())
              .filter(Boolean),
          }
        : {}),
      status: 'pending',
    });

    // Hiện modal thành công
    setSuccessModal({
      isOpen: true,
      message: `Đơn hàng của bạn đang được xử lý\nVào "Lịch sử đơn hàng" để theo dõi`,
      balance: balance - totalPrice
    });

    // Reset form
    setFormData({
      packageId: '',
      link: '',
      quantity: '',
      comments: '',
    });
    setDisplayQuantity('');
  };

  const selectedPackage = service.packages.find((p: any) => p.id === Number(formData.packageId));
  const effectiveQuantity = serviceType === 'comment' ? autoCommentList.length : Number(formData.quantity);
  const totalPrice = selectedPackage ? (selectedPackage.price * effectiveQuantity) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl text-white mb-2 flex items-center gap-3">
          {(() => {
            const Icon = (service as any)?.icon;
            return typeof Icon === 'function' ? <Icon className="size-8 text-purple-400" /> : null;
          })()}
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
                      Link Instagram *
                    </label>
                    <input
                      type="url"
                      value={formData.link}
                      onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                      placeholder="https://www.instagram.com/..."
                      className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
                      required={serviceType !== 'comment'}
                    />
                  </div>

                  {/* Comment List (only for comment service) */}
                  {serviceType === 'comment' && (
                    <div>
                      <label className="block text-white mb-2">
                        Danh sách nội dung bình luận <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        value={formData.comments}
                        onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                        placeholder={`Bình luận 1\nBình luận 2\nBình luận 3\nBình luận 4\nBình luận 5`}
                        rows={5}
                        className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none resize-none"
                        required
                      />
                      <p className="text-slate-400 text-sm mt-1">
                        Mỗi dòng là 1 bình luận. Tối thiểu 5 bình luận.
                      </p>
                    </div>
                  )}

                  {/* Quantity Input */}
                  <div>
                    <label className="block text-white mb-2">
                      Số lượng *
                    </label>
                    <input
                      type="text"
                      value={displayQuantity}
                      onChange={handleQuantityChange}
                      disabled={serviceType === 'comment'}
                      readOnly={serviceType === 'comment'}
                      placeholder={selectedPackage ? `Min: ${selectedPackage.min} - Max: ${selectedPackage.max.toLocaleString('vi-VN')}` : 'Chọn gói trước'}
                      className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none"
                      min={selectedPackage?.min || 0}
                      max={selectedPackage?.max || 0}
                      required
                    />
                    {selectedPackage && (
                      <p className="text-slate-400 text-sm mt-1">
                        Số lượng từ {selectedPackage.min.toLocaleString('vi-VN')} đến {selectedPackage.max.toLocaleString('vi-VN')}
                      </p>
                    )}
                    {serviceType === 'comment' && (
                      <p className="text-slate-400 text-sm mt-1">
                        Số lượng được tự động tính theo số dòng bình luận.
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
                  order.platform === 'Instagram' &&
                  (
                    (serviceType === 'like' && order.service.includes('Like')) ||
                    (serviceType === 'follow' && order.service.includes('Follow')) ||
                    (serviceType === 'comment' && order.service.includes('Comment')) ||
                    (serviceType === 'view' && order.service.includes('View')) ||
                    (serviceType === 'livestream' && order.service.includes('Livestream'))
                  )
                ).length > 0 ? (
                  <div className="space-y-4">
                    {orders
                      .filter(order => 
                        order.username === user?.username && 
                        order.platform === 'Instagram' &&
                        (
                          (serviceType === 'like' && order.service.includes('Like')) ||
                          (serviceType === 'follow' && order.service.includes('Follow')) ||
                          (serviceType === 'comment' && order.service.includes('Comment')) ||
                          (serviceType === 'view' && order.service.includes('View')) ||
                          (serviceType === 'livestream' && order.service.includes('Livestream'))
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