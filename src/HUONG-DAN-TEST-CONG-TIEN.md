# 🧪 HƯỚNG DẪN TEST CHỨC NĂNG CỘNG TIỀN

## ✅ PHƯƠNG ÁN MỚI - ĐÃ SỬA

### Những thay đổi quan trọng:

1. **AdminDeposits.tsx** - Đã kết nối DataContext
   - Không còn dùng mock data
   - `handleManualAdd()` giờ tạo deposit record THỰC với status 'completed'
   - Tự động cộng tiền vào balance của user

2. **DepositHistory.tsx** - Lịch sử nạp tiền THẬT
   - Hiển thị tất cả giao dịch nạp tiền của user
   - Có stats: Tổng nạp, Đang chờ, Đã duyệt
   - User có thể xem lịch sử admin đã cộng tiền

3. **useBalance() Hook** - Real-time sync
   - Đọc trực tiếp từ localStorage.allUsers
   - Auto-update mỗi 1 giây
   - Không cache, luôn mới nhất

---

## 📋 HƯỚNG DẪN TEST CHI TIẾT

### **BƯỚC 1: RESET TẤT CẢ (QUAN TRỌNG!)**

```javascript
// Mở Console (F12) và chạy:
localStorage.clear();
location.reload();
```

---

### **BƯỚC 2: ĐĂNG KÝ USER MỚI**

1. Vào trang `/register`
2. Điền thông tin:
   - **Username:** `123`
   - **Email:** `test@email.com`
   - **Phone:** `0123456789`
   - **Password:** `123456`
3. Click **"Đăng ký"**
4. ✅ Tự động chuyển đến Dashboard

---

### **BƯỚC 3: KIỂM TRA SỐ DƯ BAN ĐẦU**

User mới đăng ký phải có số dư = **0đ**

Kiểm tra 4 nơi:
- ✅ Header (góc phải): **"Số dư ví: 0 đ"**
- ✅ Trang chủ - Card "Số dư ví": **0đ**
- ✅ Profile - Stats card: **0đ**
- ✅ Lịch sử nạp tiền: **Chưa có giao dịch nào**

---

### **BƯỚC 4: ADMIN CỘNG TIỀN**

1. **Logout** user "123"
2. **Login admin:**
   - Username: `admin`
   - Password: `admin123`
3. Vào menu **"Quản lý nạp tiền"**
4. Tìm form **"Cộng tiền thủ công"** (màu xanh dương):
   - Input 1: Nhập `123` (username)
   - Input 2: Nhập `500000` (số tiền)
5. Click nút **"Cộng tiền"**
6. Popup xác nhận hiện lên:
   ```
   XÁC NHẬN CỘNG TIỀN:
   • User: 123
   • Email: test@email.com
   • Số dư hiện tại: 0đ
   • Số tiền cộng: 500,000đ
   • Số dư sau khi cộng: 500,000đ
   ```
7. Click **OK**
8. Alert thành công:
   ```
   ✅ CỘNG TIỀN THÀNH CÔNG!
   User 123 đã nhận 500,000đ
   Số dư mới: 500,000đ
   User sẽ thấy số dư mới trong vòng 1-2 giây!
   ```

---

### **BƯỚC 5: KIỂM TRA LỊCH SỬ NẠP TIỀN (ADMIN)**

Ngay sau khi cộng tiền, scroll xuống dưới:

✅ Thấy 1 giao dịch mới:
- **Mã GD:** DEP001 (hoặc số khác)
- **Khách hàng:** 123
- **Số tiền:** 500,000đ (màu xanh lá)
- **Nội dung CK:** "Cộng tiền thủ công bởi Admin"
- **Thời gian:** Hiện tại
- **Trạng thái:** ✅ Đã duyệt (màu xanh)
- **Ghi chú:** "Admin cộng tiền trực tiếp"

---

### **BƯỚC 6: USER KIỂM TRA SỐ DƯ**

1. **Logout** admin
2. **Login** user `123` / `123456`
3. ⏰ **CHỜ 1-2 GIÂY** (auto-sync)
4. ✅ Kiểm tra 4 nơi:

   **a) Header (góc phải):**
   ```
   Số dư ví: 500,000 đ
   ```

   **b) Trang chủ - Card "Số dư ví":**
   ```
   500,000đ
   ```

   **c) Profile - Stats card:**
   ```
   Số dư ví
   500,000đ
   ```

   **d) Lịch sử nạp tiền (menu bên trái):**
   ```
   Tổng nạp: 500,000đ
   Đã duyệt: 1 giao dịch
   
   Bảng lịch sử:
   Mã GD: DEP001
   Số tiền: 500,000đ
   Trạng thái: ✅ Đã duyệt
   ```

---

### **BƯỚC 7: TEST CỘNG THÊM TIỀN**

1. Logout user, login lại admin
2. Vào "Quản lý nạp tiền"
3. Cộng thêm `100,000đ` cho user `123`
4. Logout admin, login user `123`
5. ✅ Số dư mới: **600,000đ** (500,000 + 100,000)
6. ✅ Lịch sử nạp tiền có **2 giao dịch**

---

### **BƯỚC 8: TEST REAL-TIME (BONUS)**

**Cách 1: Mở 2 tabs**
1. Tab 1: Login admin
2. Tab 2: Login user "123"
3. Tab 1 (admin): Cộng 50,000đ cho "123"
4. Tab 2 (user): Trong vòng 1-2 giây, số dư tự động tăng lên!

**Cách 2: Inspect localStorage**
```javascript
// Mở Console (F12) khi đang login user "123"
const allUsers = JSON.parse(localStorage.getItem('allUsers'));
const me = allUsers.find(u => u.username === '123');
console.log('Số dư trong database:', me.balance);
```

---

## 🐛 NẾU VẪN KHÔNG HOẠT ĐỘNG

### Debug Script:

```javascript
// Mở Console (F12) và chạy:
console.log('=== DEBUG BALANCE ===');

// 1. Check userData
const userData = JSON.parse(localStorage.getItem('userData'));
console.log('User hiện tại:', userData.username);
console.log('Balance trong userData:', userData.balance);

// 2. Check allUsers
const allUsers = JSON.parse(localStorage.getItem('allUsers'));
const userInDB = allUsers.find(u => u.username === userData.username);
console.log('Balance trong allUsers:', userInDB.balance);

// 3. Check deposits
const deposits = JSON.parse(localStorage.getItem('allDeposits'));
const myDeposits = deposits.filter(d => d.username === userData.username);
console.log('Số giao dịch nạp tiền:', myDeposits.length);
console.log('Tổng nạp:', myDeposits.reduce((sum, d) => sum + d.amount, 0));

// 4. Force sync
if (userData.balance !== userInDB.balance) {
  console.log('⚠️ KHÔNG ĐỒNG BỘ! Đang fix...');
  userData.balance = userInDB.balance;
  localStorage.setItem('userData', JSON.stringify(userData));
  console.log('✅ Đã sync! Reload trang...');
  location.reload();
}
```

---

## 📊 KẾT QUẢ MONG ĐỢI

| Hành động | Kết quả |
|-----------|---------|
| Admin cộng 500,000đ | ✅ Alert thành công |
| User login lại | ✅ Header hiện 500,000đ |
| Vào trang chủ | ✅ Card hiện 500,000đ |
| Vào Profile | ✅ Stats hiện 500,000đ |
| Vào Lịch sử nạp tiền | ✅ Có 1 giao dịch 500,000đ |
| Admin cộng thêm 100,000đ | ✅ Tổng 600,000đ |
| Real-time (2 tabs) | ✅ Auto-update trong 1-2s |

---

## 💡 LƯU Ý

1. ✅ **Luôn logout và login lại** sau khi admin cộng tiền
2. ✅ **Chờ 1-2 giây** để auto-sync hoạt động
3. ✅ **Kiểm tra lịch sử nạp tiền** để xác nhận admin đã cộng
4. ✅ **Refresh trang** nếu số dư vẫn không cập nhật sau 5 giây
5. ✅ **Chạy debug script** nếu vẫn gặp vấn đề

---

## 🎯 NGUYÊN LÝ HOẠT ĐỘNG

```
ADMIN CỘNG TIỀN:
1. AdminDeposits.handleManualAdd()
2. → addDeposit({ status: 'completed', amount: 500000 })
3. → DataContext.addDeposit()
4. → updateUser(userId, { balance: balance + 500000 })
5. → localStorage.allUsers updated
6. → window.dispatchEvent('balanceUpdated')

USER NHẬN TIỀN:
7. → useBalance() hook listen event
8. → Đọc từ localStorage.allUsers
9. → setBalance(newBalance)
10. → Dashboard/Header/Profile auto re-render
11. → Hiển thị số dư mới!
```

---

**Chúc bạn test thành công! 🚀**
