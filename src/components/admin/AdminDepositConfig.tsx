import React, { useMemo, useState } from 'react';
import { Save, Image as ImageIcon, Trash2 } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

/**
 * Admin cấu hình nạp tiền (auto-save vào localStorage thông qua DataContext)
 * - Sửa ngân hàng/STK/tên chủ tài khoản/chi nhánh
 * - Số tiền tối thiểu
 * - Mẫu nội dung chuyển khoản
 * - Upload ảnh QR ngân hàng (lưu dạng dataURL)
 */
export default function AdminDepositConfig() {
  const { depositSettings, updateDepositSettings } = useData();
  const [uploadError, setUploadError] = useState<string | null>(null);

  const setField = (field: string, value: any) => {
    updateDepositSettings({ ...depositSettings, [field]: value });
  };

  const notes = useMemo(() => depositSettings.notes || [], [depositSettings.notes]);

  const updateNote = (idx: number, value: string) => {
    const next = [...notes];
    next[idx] = value;
    setField('notes', next);
  };

  const addNote = () => {
    setField('notes', [...notes, '']);
  };

  const removeNote = (idx: number) => {
    const next = notes.filter((_, i) => i !== idx);
    setField('notes', next);
  };

  const onPickQrFile: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic validation
    const maxMB = 2;
    if (!file.type.startsWith('image/')) {
      setUploadError('Vui lòng chọn file hình ảnh (PNG/JPG/WebP).');
      return;
    }
    if (file.size > maxMB * 1024 * 1024) {
      setUploadError(`Ảnh quá lớn. Tối đa ${maxMB}MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || '');
      if (!dataUrl.startsWith('data:image/')) {
        setUploadError('Không đọc được ảnh. Vui lòng thử ảnh khác.');
        return;
      }
      setField('qrImageDataUrl', dataUrl);
    };
    reader.onerror = () => setUploadError('Đọc file thất bại. Vui lòng thử lại.');
    reader.readAsDataURL(file);
  };

  const removeQr = () => {
    setField('qrImageDataUrl', '');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-white mb-2">Cấu hình nạp tiền</h1>
        <p className="text-slate-300">Chỉnh thông tin chuyển khoản & mã QR hiển thị cho người dùng</p>
      </div>

      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 space-y-6">
        {/* Thông tin ngân hàng */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 text-sm mb-1">Ngân hàng</label>
            <input
              value={depositSettings.bankName}
              onChange={(e) => setField('bankName', e.target.value)}
              className="w-full bg-slate-900 text-white border border-slate-600 rounded-lg px-3 py-2"
              placeholder="MB Bank"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm mb-1">Chi nhánh (tuỳ chọn)</label>
            <input
              value={depositSettings.branch || ''}
              onChange={(e) => setField('branch', e.target.value)}
              className="w-full bg-slate-900 text-white border border-slate-600 rounded-lg px-3 py-2"
              placeholder="Chi nhánh Hà Nội"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm mb-1">Số tài khoản</label>
            <input
              value={depositSettings.accountNumber}
              onChange={(e) => setField('accountNumber', e.target.value)}
              className="w-full bg-slate-900 text-white border border-slate-600 rounded-lg px-3 py-2"
              placeholder="0123456789"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm mb-1">Chủ tài khoản</label>
            <input
              value={depositSettings.accountName}
              onChange={(e) => setField('accountName', e.target.value)}
              className="w-full bg-slate-900 text-white border border-slate-600 rounded-lg px-3 py-2"
              placeholder="NGO DUC AN"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm mb-1">Số tiền tối thiểu</label>
            <input
              type="number"
              value={depositSettings.minDeposit}
              onChange={(e) => setField('minDeposit', Number(e.target.value || 0))}
              className="w-full bg-slate-900 text-white border border-slate-600 rounded-lg px-3 py-2"
              placeholder="10000"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm mb-1">Mẫu nội dung chuyển khoản</label>
            <input
              value={depositSettings.transferTemplate}
              onChange={(e) => setField('transferTemplate', e.target.value)}
              className="w-full bg-slate-900 text-white border border-slate-600 rounded-lg px-3 py-2"
              placeholder="NAP {username} {amount}"
            />
            <p className="text-slate-400 text-xs mt-1">
              Hỗ trợ biến: <code>{'{username}'}</code>, <code>{'{amount}'}</code>, <code>{'{minDeposit}'}</code>
            </p>
          </div>
        </div>

        {/* QR image upload */}
        <div className="border-t border-slate-700 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-white text-xl flex items-center gap-2">
              <ImageIcon className="size-5 text-blue-400" />
              Ảnh QR ngân hàng (tuỳ chọn)
            </h2>

            <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
              <input type="file" accept="image/*" className="hidden" onChange={onPickQrFile} />
              Chọn ảnh QR
            </label>
          </div>

          {uploadError && <div className="mt-3 text-red-400 text-sm">{uploadError}</div>}

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
              <div className="text-slate-300 text-sm mb-2">Xem trước</div>
              {depositSettings.qrImageDataUrl ? (
                <img
                  src={depositSettings.qrImageDataUrl}
                  alt="QR Preview"
                  className="w-full max-w-sm rounded bg-white p-2"
                />
              ) : (
                <div className="text-slate-500 text-sm">
                  Chưa có ảnh QR. Nếu không upload, hệ thống sẽ dùng QR VietQR tự tạo theo số tiền.
                </div>
              )}
            </div>

            <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
              <div className="text-slate-300 text-sm mb-2">Hành động</div>
              <button
                disabled={!depositSettings.qrImageDataUrl}
                onClick={removeQr}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${
                  depositSettings.qrImageDataUrl
                    ? 'border-red-600 text-red-300 hover:bg-red-600/20'
                    : 'border-slate-700 text-slate-600 cursor-not-allowed'
                }`}
              >
                <Trash2 className="size-4" /> Xoá ảnh QR
              </button>

              <div className="mt-3 text-slate-400 text-sm">
                <Save className="inline size-4 mr-1" />
                Mọi thay đổi được lưu ngay (auto-save).
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="border-t border-slate-700 pt-6">
          <h2 className="text-white text-xl mb-3">Ghi chú hiển thị</h2>

          <div className="space-y-3">
            {notes.map((note, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  value={note}
                  onChange={(e) => updateNote(idx, e.target.value)}
                  className="flex-1 bg-slate-900 text-white border border-slate-600 rounded-lg px-3 py-2"
                  placeholder="Nhập ghi chú..."
                />
                <button
                  onClick={() => removeNote(idx)}
                  className="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
                  title="Xoá"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}

            <button
              onClick={addNote}
              className="px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white"
            >
              + Thêm ghi chú
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
