import React, { useState, useEffect } from 'react';
import { Eye, Radio, AlertCircle, Loader2, Clock } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface TikTokLiveViewProps {
  userBalance: number;
  onOrderCreated: () => void;
}

export default function TikTokLiveView({ userBalance, onOrderCreated }: TikTokLiveViewProps) {
  const [url, setUrl] = useState('');
  const [eyes, setEyes] = useState('');
  const [minutes, setMinutes] = useState(15);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timeOptions = [
    { value: 15, label: '15 phút' },
    { value: 30, label: '30 phút' },
    { value: 60, label: '60 phút' },
    { value: 90, label: '90 phút' },
    { value: 120, label: '120 phút' },
    { value: 180, label: '180 phút' },
    { value: 360, label: '360 phút' },
  ];

  const MIN_EYES = 100;
  const MAX_EYES = 100000;

  // CÔNG THỨC TÍNH GIÁ
  // marketVND = 15000
  // marketXu = 1000000
  // profitX = 3
  // xuPer100EyesPerStep = 150
  // stepMinutes = 15
  // 
  // vndPerXu = marketVND / marketXu = 15000 = 0.015
  // steps = minutes / stepMinutes
  // costXu = (eyes / 100) * xuPer100EyesPerStep * steps
  // costVND = costXu * vndPerXu
  // sellVND = costVND * profitX
  // 
  // Kết quả rút gọn: sellVND = eyes × minutes × 9
  
  const calculatePrice = (eyesCount: number, mins: number): number => {
    return eyesCount * mins * 9;
  };

  const totalPrice = eyes ? calculatePrice(parseInt(eyes), minutes) : 0;
  const pricePerEye = minutes * 9; // Giá 1 mắt cho thời gian đã chọn

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim()) {
      toast.error('Vui lòng nhập link live TikTok!');
      return;
    }

    const eyesCount = parseInt(eyes);
    if (!eyesCount || eyesCount < MIN_EYES) {
      toast.error(`Số lượng mắt tối thiểu là ${MIN_EYES}!`);
      return;
    }

    if (eyesCount > MAX_EYES) {
      toast.error(`Số lượng mắt tối đa là ${MAX_EYES.toLocaleString()}!`);
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
        service: 'TikTok - Tăng Mắt Xem Live',
        server: `Beta Server 1 (${minutes} phút)`,
        url: url.trim(),
        quantity: eyesCount,
        duration: minutes,
        price: pricePerEye,
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
      setEyes('');
      setMinutes(15);
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
        <Radio className="size-6 text-red-500 animate-pulse" />
        <h2 className="text-xl text-white">Tăng Mắt Xem Live TikTok</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* URL Input */}
        <div>
          <label className="block text-sm text-slate-300 mb-2">Link Live TikTok</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.tiktok.com/@username/live"
            className="w-full bg-slate-700 text-white px-4 py-2.5 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Eyes Input */}
        <div>
          <label className="block text-sm text-slate-300 mb-2">Số Lượng Mắt</label>
          <input
            type="number"
            value={eyes}
            onChange={(e) => setEyes(e.target.value)}
            placeholder={`Tối thiểu ${MIN_EYES}`}
            min={MIN_EYES}
            max={MAX_EYES}
            className="w-full bg-slate-700 text-white px-4 py-2.5 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
          />
          <p className="text-xs text-slate-400 mt-1">
            Min: {MIN_EYES} - Max: {MAX_EYES.toLocaleString()}
          </p>
        </div>

        {/* Time Selection */}
        <div>
          <label className="block text-sm text-slate-300 mb-2">Thời Gian Duy Trì</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {timeOptions.map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => setMinutes(option.value)}
                className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border transition-all ${
                  minutes === option.value
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-slate-700 border-slate-600 text-slate-300 hover:border-blue-500'
                }`}
              >
                <Clock className="size-4" />
                <span className="text-sm">{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-300">Giá 1 mắt / 1 phút:</span>
            <span className="text-white">9đ</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-300">Giá 1 mắt / {minutes} phút:</span>
            <span className="text-white">{pricePerEye.toLocaleString()}đ</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-300">Số lượng mắt:</span>
            <span className="text-white">{parseInt(eyes) || 0}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-300">Thời gian:</span>
            <span className="text-white">{minutes} phút</span>
          </div>
          <div className="border-t border-slate-600 pt-2 mt-2">
            <div className="flex justify-between items-center">
              <span className="text-white">Tổng tiền:</span>
              <span className="text-2xl text-green-400">{totalPrice.toLocaleString()}đ</span>
            </div>
          </div>
        </div>

        {/* Formula Info */}
        <div className="flex items-start gap-2 bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
          <AlertCircle className="size-5 text-blue-500 shrink-0 mt-0.5" />
          <div className="text-sm text-blue-300">
            <p className="mb-1">Công thức tính giá:</p>
            <p className="text-xs">
              Tổng tiền = Số mắt × Thời gian (phút) × 9đ
            </p>
            <p className="text-xs mt-1 text-blue-400">
              Ví dụ: {MIN_EYES} mắt × 15 phút = {MIN_EYES * 15 * 9}đ
            </p>
          </div>
        </div>

        {/* Warning */}
        <div className="flex items-start gap-2 bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
          <AlertCircle className="size-5 text-orange-500 shrink-0 mt-0.5" />
          <div className="text-sm text-orange-300">
            <p className="mb-1">Lưu ý:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Live phải đang phát trực tiếp</li>
              <li>Số lượng tối thiểu: {MIN_EYES} mắt</li>
              <li>Mắt sẽ duy trì trong thời gian đã chọn</li>
              <li>Thời gian xử lý: Ngay lập tức</li>
            </ul>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !url || !eyes || totalPrice > userBalance}
          className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 disabled:from-slate-600 disabled:to-slate-600 text-white py-3 rounded-lg transition-all flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              <span>Đang xử lý...</span>
            </>
          ) : (
            <>
              <Eye className="size-5" />
              <span>Tạo Đơn Hàng - {totalPrice.toLocaleString()}đ</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
