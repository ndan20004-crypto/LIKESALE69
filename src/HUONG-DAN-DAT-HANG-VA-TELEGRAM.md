# 📦 HƯỚNG DẪN ĐẶT HÀNG & THÔNG BÁO TELEGRAM

## ✅ ĐÃ SỬA XONG - PHIÊN BẢN MỚI

### **Những thay đổi:**

1. **FacebookServices.tsx** - TẠO ĐƠN THẬT
   - ✅ Kết nối DataContext.addOrder()
   - ✅ Kiểm tra số dư trước khi tạo đơn
   - ✅ Tự động trừ tiền khi tạo đơn
   - ✅ Alert chi tiết với số dư còn lại
   - ✅ Reset form sau khi tạo đơn thành công

2. **AdminOrders.tsx** - HIỂN THỊ ĐƠN THẬT
   - ✅ Kết nối DataContext để lấy orders
   - ✅ Hiển thị tất cả đơn hàng real-time
   - ✅ Admin có thể cập nhật trạng thái đơn
   - ✅ Modal chi tiết đơn hàng

3. **Telegram Notification** - THÔNG BÁO TỰ ĐỘNG
   - ✅ File config: `/config/telegram.ts`
   - ✅ Gửi thông báo khi có đơn mới
   - ✅ Format message đẹp với emoji
   - ✅ Dễ dàng bật/tắt

---

## 🧪 TEST ĐẶT HÀNG

### **BƯỚC 1: ChuẨN BỊ**

1. **Login user "123"** (đã cộng tiền 500,000đ)
2. Kiểm tra số dư: **500,000đ** ✅

---

### **BƯỚC 2: TẠO ĐƠN HÀNG**

1. Vào menu **"Dịch vụ Facebook"** → **"Tăng like bài viết"**

2. Điền form:
   - **Chọn gói:** Like post Facebook Server 1 (1.4đ/1000)
   - **Link Facebook:** `https://www.facebook.com/test/posts/123456`
   - **Số lượng:** `50000`

3. Xem tổng tiền tự động tính:
   ```
   Tổng tiền: 70,000đ
   Số dư hiện tại: 500,000đ
   Số dư sau khi trừ: 430,000đ
   ```

4. Click **"TẠO ĐƠN HÀNG"**

5. Popup xác nhận:
   ```
   XÁC NHẬN TẠO ĐƠN HÀNG:
   
   📦 Dịch vụ: Like post Facebook Server 1
   🔗 Link: https://www.facebook.com/test/posts/123456
   📊 Số lượng: 50,000
   💰 Giá: 1.4đ / 1000
   💵 Tổng tiền: 70,000đ
   💳 Số dư sau khi trừ: 430,000đ
   
   Bạn có chắc chắn muốn tạo đơn hàng này?
   ```

6. Click **OK**

7. Alert thành công:
   ```
   ✅ TẠO ĐƠN HÀNG THÀNH CÔNG!
   
   Đơn hàng của bạn đang được xử lý.
   Số dư còn lại: 430,000đ
   
   Vào "Lịch sử đơn hàng" để theo dõi!
   ```

---

### **BƯỚC 3: KIỂM TRA SỐ DƯ BỊ TRỪ**

✅ **Header:** Số dư tự động giảm từ 500,000đ → **430,000đ** (trong 1-2 giây)

✅ **Trang chủ:** Card "Số dư ví" hiển thị **430,000đ**

✅ **Profile:** Stats "Số dư ví" hiển thị **430,000đ**

---

### **BƯỚC 4: KIỂM TRA LỊCH SỬ ĐƠN HÀNG (USER)**

1. Vào menu **"Lịch sử đơn hàng"**

2. Thấy đơn vừa tạo:
   ```
   Mã đơn: ORD1736...
   Dịch vụ: Like post Facebook Server 1
   Platform: Facebook
   Link: https://www.facebook.com/test/posts/123456
   Số lượng: 50,000
   Giá tiền: 70,000đ
   Trạng thái: 🟡 Chờ xử lý
   Thời gian: 01/01/2026 10:30:45
   ```

---

### **BƯỚC 5: ADMIN THẤY ĐƠN MỚI**

1. **Logout** user "123"
2. **Login** admin (`admin` / `admin123`)
3. Vào menu **"Quản lý đơn hàng"**

4. ✅ Thấy đơn mới nhất ở đầu bảng:
   ```
   Mã đơn: ORD1736...
   Khách hàng: 123
   Dịch vụ: Like post Facebook Server 1
   Platform: Facebook
   Số lượng: 50,000
   Giá tiền: 70,000đ
   Trạng thái: 🟡 Chờ xử lý
   ```

5. Click **"Chi tiết"** để xem đầy đủ thông tin

6. Cập nhật trạng thái:
   - **Bắt đầu xử lý** → Chuyển sang "Đang xử lý"
   - **Hoàn thành** → Chuyển sang "Hoàn thành"
   - **Hủy đơn** → Chuyển sang "Đã hủy"

---

## 📱 CẤU HÌNH TELEGRAM BOT

### **Bước 1: Tạo Bot**

1. Mở Telegram, tìm **@BotFather**

2. Gửi lệnh: `/newbot`

3. Đặt tên bot: `LIKESALE69 Notification Bot`

4. Đặt username: `likesale69_notif_bot`

5. Copy **Bot Token** (VD: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

---

### **Bước 2: Lấy Chat ID**

1. Tìm bot vừa tạo và gửi: `/start`

2. Mở trình duyệt, vào link:
   ```
   https://api.telegram.org/bot<BOT_TOKEN>/getUpdates
   ```
   (Thay `<BOT_TOKEN>` bằng token vừa copy)

3. Tìm trong JSON:
   ```json
   "chat": {
     "id": 123456789,
     ...
   }
   ```

4. Copy số `123456789` - đó là **Chat ID**

---

### **Bước 3: Cấu hình trong code**

Mở file `/config/telegram.ts`:

```typescript
export const TELEGRAM_CONFIG = {
  BOT_TOKEN: '123456789:ABCdefGHIjklMNOpqrsTUVwxyz',  // ← Dán token
  CHAT_ID: '123456789',  // ← Dán chat ID
  ENABLED: true,  // ← Đổi thành true để bật
};
```

---

### **Bước 4: Test thông báo**

1. User tạo đơn hàng mới

2. Telegram của admin nhận tin nhắn:
   ```
   🔔 ĐƠN HÀNG MỚI - LIKESALE69

   👤 Khách hàng: 123
   📦 Dịch vụ: Like post Facebook Server 1
   🌐 Platform: Facebook
   🔗 Link: https://www.facebook.com/test/posts/123456
   📊 Số lượng: 50,000
   💰 Giá trị: 70,000đ
   📅 Thời gian: 01/01/2026 10:30:45
   ⏱ Trạng thái: Chờ xử lý

   🆔 Order ID: ORD1736...
   ```

---

## 🎯 KẾT QUẢ MONG ĐỢI

| Hành động | Kết quả |
|-----------|---------|
| User tạo đơn 70,000đ | ✅ Alert thành công |
| Số dư 500,000đ | ✅ Tự động trừ → 430,000đ |
| Lịch sử đơn hàng (user) | ✅ Hiển thị đơn mới |
| Admin vào "Quản lý đơn hàng" | ✅ Thấy đơn mới ở đầu bảng |
| Telegram (nếu đã config) | ✅ Nhận thông báo ngay lập tức |

---

## 🐛 XỬ LÝ LỖI

### **Lỗi: "Số dư không đủ"**

✅ **Nguyên nhân:** User chưa có đủ tiền

✅ **Giải pháp:** 
1. Admin vào "Quản lý nạp tiền"
2. Cộng tiền cho user
3. User tạo đơn lại

---

### **Lỗi: "Telegram không gửi được"**

✅ **Kiểm tra:**
1. Mở `/config/telegram.ts`
2. Xem `ENABLED: true` chưa?
3. `BOT_TOKEN` đúng chưa?
4. `CHAT_ID` đúng chưa?
5. Đã gửi `/start` cho bot chưa?

✅ **Mở Console (F12):**
```javascript
// Xem log
console.log('Telegram config:', TELEGRAM_CONFIG);

// Test manual
fetch('https://api.telegram.org/bot<TOKEN>/sendMessage', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    chat_id: '<CHAT_ID>',
    text: 'Test message'
  })
}).then(r => r.json()).then(console.log);
```

---

### **Lỗi: "Admin không thấy đơn"**

✅ **Debug:**
```javascript
// Mở Console (F12)
const orders = JSON.parse(localStorage.getItem('allOrders'));
console.log('Tổng đơn hàng:', orders.length);
console.log('Đơn mới nhất:', orders[orders.length - 1]);
```

✅ **Nếu `orders = []`:**
- User chưa tạo đơn thành công
- Kiểm tra lại số dư
- Xem Console có lỗi không

---

## 📝 LƯU Ý

1. ✅ **Telegram chỉ hoạt động khi `ENABLED: true`**
2. ✅ **Mỗi đơn mới = 1 thông báo Telegram**
3. ✅ **Số dư tự động trừ khi tạo đơn thành công**
4. ✅ **Admin có thể cập nhật trạng thái đơn**
5. ✅ **User xem được lịch sử đơn hàng của mình**

---

## 🚀 LUỒNG HOẠT ĐỘNG

```
USER TẠO ĐƠN:
1. Chọn dịch vụ + Nhập link + Nhập số lượng
2. Hệ thống tính tổng tiền
3. Kiểm tra số dư
4. Click "TẠO ĐƠN HÀNG"
5. addOrder() → Tạo order trong DataContext
6. updateUser() → Trừ balance
7. sendTelegramNotification() → Gửi thông báo
8. Alert thành công

ADMIN NHẬN ĐƠN:
9. Telegram nhận thông báo
10. Admin vào "Quản lý đơn hàng"
11. Thấy đơn mới ở đầu bảng
12. Click "Chi tiết" → Xem đầy đủ
13. Cập nhật trạng thái

USER THEO DÕI:
14. Vào "Lịch sử đơn hàng"
15. Thấy trạng thái đã được cập nhật
```

---

**Chúc bạn test thành công! 🎉**