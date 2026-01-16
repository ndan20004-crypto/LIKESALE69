import React, { useMemo, useState } from 'react';
import { Wallet, Copy, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

export default function Deposit() {
  const { user } = useAuth();
  const { depositSettings, addDeposit, deposits, updateDeposit, markDepositTransferred } = useData();

  const [amount, setAmount] = useState('');
  const [displayAmount, setDisplayAmount] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [activeDepositId, setActiveDepositId] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: 'info' | 'error'; message: string } | null>(null);


  const activeDeposit = useMemo(() => {
    if (!activeDepositId) return null;
    return deposits.find(d => d.id === activeDepositId) || null;
  }, [activeDepositId, deposits]);

  const bankInfo = {
    bankName: depositSettings.bankName,
    accountNumber: depositSettings.accountNumber,
    accountName: depositSettings.accountName,
    branch: depositSettings.branch || '',
  };

  const minDeposit = Number(depositSettings.minDeposit || 0);

  const transferContent = useMemo(() => {
    const tpl = depositSettings.transferTemplate || 'NAP {username} {amount}';
    return tpl
      .replaceAll('{username}', user?.username || 'USER')
      .replaceAll('{amount}', amount || '0')
      .replaceAll('{minDeposit}', String(minDeposit));
  }, [depositSettings.transferTemplate, minDeposit, user?.username, amount]);

  const quickAmounts = [
    { label: '50.000đ', value: 50000 },
    { label: '100.000đ', value: 100000 },
    { label: '200.000đ', value: 200000 },
    { label: '500.000đ', value: 500000 },
    { label: '1.000.000đ', value: 1000000 },
    { label: '2.000.000đ', value: 2000000 },
  ];

  const showNotice = (message: string, type: 'info' | 'error' = 'error') => {
    setNotice({ type, message });
  };


  const handleQuickAmount = (value: number) => {
    setAmount(String(value));
    setDisplayAmount(value.toLocaleString('vi-VN'));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\./g, '').replace(/,/g, '').replace(/\s/g, '');
    const numeric = raw.replace(/\D/g, '');
    setAmount(numeric);

    if (!numeric) {
      setDisplayAmount('');
      return;
    }
    setDisplayAmount(Number(numeric).toLocaleString('vi-VN'));
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const ensureValidAmount = (): number | null => {
    const n = Number(amount || 0);
    if (!n || !Number.isFinite(n)) return null;
    if (n < minDeposit) return null;
    return n;
  };

  // TẠO YÊU CẦU NẠP (TẠO LỆNH) -> GỬI TELEGRAM -> ADMIN DUYỆT CỘNG TIỀN
  const handleCreateDepositOrder = async () => {
    const n = ensureValidAmount();
    if (n === null) {
      showNotice(`Số tiền tối thiểu là ${minDeposit.toLocaleString('vi-VN')}đ`);
      return;
    }
    if (!user) {
      showNotice('Vui lòng đăng nhập');
      return;
    }

    setIsCreating(true);
    try {
      const created = await addDeposit({
        userId: user.id,
        username: user.username,
        amount: n,
        method: 'Chuyển khoản ngân hàng',
        status: 'pending',
        note: transferContent,
      });

      setActiveDepositId(created.id);

      setNotice(null);
      setShowQR(true);
      // Bỏ bước popup xác nhận để tự động chuyển sang màn hình thanh toán (QR / chuyển khoản)
    } finally {
      setIsCreating(false);
    }
  };

  // Người dùng xác nhận đã chuyển khoản (bước 2)
  const handleMarkTransferred = async () => {
    if (!activeDepositId) {
      showNotice('Vui lòng tạo lệnh nạp tiền trước.');
      return;
    }
    const dep = deposits.find(d => d.id === activeDepositId);
    if (!dep) {
      showNotice('Không tìm thấy lệnh nạp. Vui lòng tạo lại.');
      return;
    }
    if (dep.status === 'completed') {
      showNotice('Lệnh này đã được duyệt.', 'info');
      return;
    }
    if (dep.status === 'cancelled') {
      showNotice('Lệnh này đã bị từ chối. Vui lòng tạo lệnh mới.');
      return;
    }
    if (dep.status === 'transferred') {
      return; // đã xác nhận rồi, không cần popup
      return;
    }

    await markDepositTransferred(activeDepositId);
    // không hiện popup; trạng thái sẽ hiển thị ngay trên giao diện
    // Hiển thị thông báo đã ghi nhận thanh toán (không nhắc admin)
    showNotice('Đã ghi nhận: Bạn đã thanh toán', 'info');
  };

  // QR code URL (VietQR) - hiển thị để người dùng quét nhanh
  const qrCodeUrl = `https://img.vietqr.io/image/${encodeURIComponent(
    bankInfo.bankName
  )}-${encodeURIComponent(bankInfo.accountNumber)}-compact2.png?amount=${encodeURIComponent(
    amount || '0'
  )}&addInfo=${encodeURIComponent(transferContent)}&accountName=${encodeURIComponent(bankInfo.accountName)}`;

  const userDeposits = useMemo(() => {
    const username = user?.username;
    if (!username) return [];
    return deposits
      .filter(d => d.username === username)
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
      .slice(0, 5);
  }, [deposits, user?.username]);


  const latestCompletedDeposit = useMemo(() => {
    const username = user?.username;
    if (!username) return null;
    const completed = deposits
      .filter(d => d.username === username && d.status === 'completed')
      .sort((a, b) => ((a.completedAt || a.createdAt) < (b.completedAt || b.createdAt) ? 1 : -1));
    return completed[0] || null;
  }, [deposits, user?.username]);

  const showSuccessBanner = useMemo(() => {
    if (!latestCompletedDeposit) return false;
    const t = latestCompletedDeposit.completedAt || latestCompletedDeposit.createdAt;
    const ms = Date.now() - new Date(t).getTime();
    // Hiện thông báo trong ~7 ngày kể từ khi admin duyệt
    return ms >= 0 && ms <= 7 * 24 * 60 * 60 * 1000;
  }, [latestCompletedDeposit]);


  const statusBadge = (status: string) => {
    if (status === 'completed') return <span className="text-green-400">Hoàn thành</span>;
    if (status === 'pending') return <span className="text-yellow-400">Đã tạo lệnh</span>;
    if (status === 'transferred') return <span className="text-blue-400">Đã thanh toán</span>;
    if (status === 'cancelled') return <span className="text-red-400">Từ chối</span>;
    return <span className="text-slate-400">{status}</span>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-white mb-2">Nạp tiền vào ví</h1>
        <p className="text-slate-300">Tạo lệnh nạp tiền → thanh toán</p>
      </div>

      {notice && (
        <div
          className={`rounded-lg border px-4 py-3 ${
            notice.type === 'error'
              ? 'bg-red-500/10 border-red-500/30 text-red-200'
              : 'bg-yellow-500 border-yellow-400 text-white'
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <span className={`${notice.type === 'error' ? 'text-sm' : 'text-lg font-semibold'}`}>{notice.message}</span>
            <button
              type="button"
              onClick={() => setNotice(null)}
              className={`rounded px-3 py-2 font-semibold transition-colors ${
                notice.type === 'error'
                  ? 'text-xs bg-slate-900/40 hover:bg-slate-900/60'
                  : 'text-sm bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {showSuccessBanner && latestCompletedDeposit && (
        <div className="bg-green-900/20 border border-green-600 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-300 font-semibold">
            <CheckCircle className="size-5" />
            <span>
              Đã thanh toán thành công số tiền{' '}
              <span className="text-white font-bold">{latestCompletedDeposit.amount.toLocaleString('vi-VN')}đ</span> bạn đã nạp.
            </span>
          </div>
        </div>
      )}

      {!showQR ? (
        <>
          {/* Màn hình chính: form nạp tiền (full width) */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h2 className="text-2xl text-white mb-6 flex items-center gap-3">
              <Wallet className="size-8 text-blue-400" />
              Thông tin nạp tiền
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-slate-300 mb-2">Số tiền muốn nạp</label>
                <input
                  type="text"
                  value={displayAmount}
                  onChange={handleAmountChange}
                  placeholder="Nhập số tiền..."
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-3">
                  {quickAmounts.map(qa => (
                    <button
                      key={qa.value}
                      onClick={() => handleQuickAmount(qa.value)}
                      className={`px-2 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        amount === String(qa.value)
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                      }`}
                    >
                      {qa.label}
                    </button>
                  ))}
                </div>

                {minDeposit > 0 && (
                  <p className="text-slate-400 text-sm mt-2">
                    Số tiền tối thiểu: <span className="text-white font-semibold">{minDeposit.toLocaleString('vi-VN')}đ</span>
                  </p>
                )}
              </div>

              <button
                onClick={handleCreateDepositOrder}
                disabled={isCreating}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/60 disabled:cursor-not-allowed text-white py-3 rounded-lg transition-colors font-semibold"
              >
                {isCreating ? 'Đang tạo lệnh...' : 'Tạo lệnh nạp tiền'}
              </button>

              <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="size-5 text-yellow-400" />
                  <span className="text-yellow-400 font-semibold">Lưu ý quan trọng:</span>
                </div>
                <ul className="text-slate-300 text-sm space-y-1">
                  {(depositSettings.notes || []).map((n, i) => (
                    <li key={i}>• {n}</li>
                  ))}
                  {(!depositSettings.notes || depositSettings.notes.length === 0) && (
                    <>
                      <li>• Vui lòng chuyển khoản đúng nội dung để được duyệt nhanh</li>
                      <li>• Sau khi thanh toán, bấm “Đã thanh toán” để admin kiểm tra</li>
                      <li>• Thời gian duyệt tuỳ vào hệ thống / admin</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Recent deposits */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-xl text-white mb-4">Lịch sử nạp tiền gần đây</h3>
            {userDeposits.length === 0 ? (
              <div className="text-center text-slate-400 py-8">Chưa có giao dịch nạp tiền nào</div>
            ) : (
              <div className="space-y-3">
                {userDeposits.map(d => (
                  <div key={d.id} className="bg-slate-700/40 border border-slate-600 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-white font-semibold">{d.amount.toLocaleString('vi-VN')}đ</div>
                      <div className="text-sm">{statusBadge(d.status)}</div>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {new Date(d.createdAt).toLocaleString('vi-VN')}
                    </div>
                    {d.note && <div className="text-xs text-slate-300 mt-2">Nội dung: {d.note}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          {/* Màn hình thanh toán: QR / chuyển khoản thủ công */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-2xl text-white">Thanh toán nạp tiền</h2>
                <p className="text-slate-300 text-sm mt-1">
                  Quét QR hoặc chuyển khoản thủ công theo thông tin bên dưới.
                </p>
              </div>
              <button
                onClick={() => setShowQR(false)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Quay lại
              </button>
            </div>

            {activeDeposit && (
              <div className="bg-slate-700/40 border border-slate-600 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="text-slate-300">Số tiền</div>
                  <div className="text-white font-bold">{activeDeposit.amount.toLocaleString('vi-VN')}đ</div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="text-slate-300">Trạng thái</div>
                  <div className="text-sm">{statusBadge(activeDeposit.status)}</div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* QR */}
              <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl text-white">Mã QR thanh toán</h3>
                </div>

                <div className="text-center">
                  <div className="bg-white rounded-lg p-4 inline-block">
                    <img
                      src={depositSettings.qrImageDataUrl ? depositSettings.qrImageDataUrl : qrCodeUrl}
                      alt="QR Code"
                      className="w-64 h-64 mx-auto object-contain"
                    />
                  </div>
                  <p className="text-slate-300 mt-3 text-sm">Quét mã QR bằng ứng dụng ngân hàng để chuyển khoản</p>
                </div>
              </div>

              {/* Manual transfer */}
              <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-5">
                <h3 className="text-xl text-white mb-4">Chuyển khoản thủ công</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-slate-300 mb-2">Ngân hàng</label>
                    <div className="flex items-center justify-between bg-slate-700 px-4 py-3 rounded-lg">
                      <span className="text-white">{bankInfo.bankName}</span>
                      <button onClick={() => copyToClipboard(bankInfo.bankName, 'bank')} className="text-blue-400 hover:text-blue-300">
                        {copiedField === 'bank' ? <CheckCircle className="size-5" /> : <Copy className="size-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-2">Số tài khoản</label>
                    <div className="flex items-center justify-between bg-slate-700 px-4 py-3 rounded-lg">
                      <span className="text-white">{bankInfo.accountNumber}</span>
                      <button
                        onClick={() => copyToClipboard(bankInfo.accountNumber, 'account')}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        {copiedField === 'account' ? <CheckCircle className="size-5" /> : <Copy className="size-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-2">Chủ tài khoản</label>
                    <div className="flex items-center justify-between bg-slate-700 px-4 py-3 rounded-lg">
                      <span className="text-white">{bankInfo.accountName}</span>
                      <button onClick={() => copyToClipboard(bankInfo.accountName, 'name')} className="text-blue-400 hover:text-blue-300">
                        {copiedField === 'name' ? <CheckCircle className="size-5" /> : <Copy className="size-5" />}
                      </button>
                    </div>
                  </div>

                  {!!bankInfo.branch && (
                    <div>
                      <label className="block text-slate-300 mb-2">Chi nhánh</label>
                      <div className="bg-slate-700 px-4 py-3 rounded-lg text-white">{bankInfo.branch}</div>
                    </div>
                  )}

                  <div>
                    <label className="block text-slate-300 mb-2">Nội dung chuyển khoản</label>
                    <div className="flex items-center justify-between bg-slate-700 px-4 py-3 rounded-lg">
                      <span className="text-white">{transferContent}</span>
                      <button onClick={() => copyToClipboard(transferContent, 'content')} className="text-white hover:text-slate-200">
                        {copiedField === 'content' ? <CheckCircle className="size-5" /> : <Copy className="size-5" />}
                      </button>
                    </div>
                    <p className="text-yellow-400 text-sm mt-2 flex items-center gap-2">
                      <AlertCircle className="size-4" />
                      Vui lòng chuyển khoản ĐÚNG nội dung này để được cộng tiền tự động
                    </p>
                  </div>

                  <div className="mt-2 bg-slate-900/30 border border-slate-600 rounded-lg p-4">
                    <p className="text-slate-200 mb-3">
                      (Sau khi đã thanh toán vui lòng bấm) <span className="text-white font-semibold">Đã thanh toán</span>
                    </p>
                    <button
                      onClick={handleMarkTransferred}
                      disabled={
                        !activeDepositId ||
                        !activeDeposit ||
                        (activeDeposit.status !== 'pending' && activeDeposit.status !== 'transferred')
                      }
                      className={`w-full px-4 py-3 rounded-lg font-semibold transition-colors ${
                        !activeDepositId || !activeDeposit
                          ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                          : activeDeposit.status === 'pending'
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : activeDeposit.status === 'transferred'
                              ? 'bg-slate-700 text-slate-300 cursor-not-allowed'
                              : 'bg-slate-700 text-slate-300 cursor-not-allowed'
                      }`}
                      title={!activeDepositId ? 'Hãy tạo lệnh nạp tiền trước' : 'Xác nhận bạn đã thanh toán'}
                    >
                      Đã thanh toán
                    </button>
                    {/* Không hiển thị thông báo phụ sau khi bấm "Đã thanh toán" */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
