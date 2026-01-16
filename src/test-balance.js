/*
 * TEST SCRIPT - Mở Console (F12) và chạy script này để test
 * 
 * HƯỚNG DẪN:
 * 1. Đăng ký user mới hoặc login với user: testuser / 123456
 * 2. Mở Console (F12)
 * 3. Copy toàn bộ script này và paste vào Console
 * 4. Enter để chạy
 * 5. Kiểm tra kết quả
 */

console.log('========================================');
console.log('🧪 BALANCE UPDATE TEST SCRIPT');
console.log('========================================\n');

// 1. Đọc thông tin user hiện tại từ userData
const userData = localStorage.getItem('userData');
if (!userData) {
  console.error('❌ Không tìm thấy userData. Vui lòng đăng nhập trước!');
} else {
  const user = JSON.parse(userData);
  console.log('✅ User hiện tại:', user.username);
  console.log('💰 Số dư trong userData:', user.balance, 'đ');
}

// 2. Đọc thông tin user từ allUsers
const allUsersData = localStorage.getItem('allUsers');
if (!allUsersData) {
  console.error('❌ Không tìm thấy allUsers. Database trống!');
} else {
  const allUsers = JSON.parse(allUsersData);
  console.log('\n📊 Tổng số users trong database:', allUsers.length);
  
  if (userData) {
    const user = JSON.parse(userData);
    const userInAllUsers = allUsers.find(u => u.username === user.username);
    
    if (userInAllUsers) {
      console.log('✅ Tìm thấy user trong allUsers');
      console.log('💰 Số dư trong allUsers:', userInAllUsers.balance, 'đ');
      
      // So sánh
      if (user.balance === userInAllUsers.balance) {
        console.log('✅ SYNC OK: Số dư khớp nhau!');
      } else {
        console.log('⚠️ SYNC ISSUE: Số dư KHÔNG khớp!');
        console.log('   userData:', user.balance, 'đ');
        console.log('   allUsers:', userInAllUsers.balance, 'đ');
        console.log('\n🔧 Đang tự động sync...');
        
        // Auto-fix
        user.balance = userInAllUsers.balance;
        localStorage.setItem('userData', JSON.stringify(user));
        console.log('✅ Đã sync thành công! Refresh trang để thấy kết quả.');
      }
    } else {
      console.error('❌ KHÔNG tìm thấy user trong allUsers!');
    }
  }
}

console.log('\n========================================');
console.log('📝 CÁCH TEST ADMIN CỘNG TIỀN:');
console.log('========================================');
console.log('1. Logout user hiện tại');
console.log('2. Login admin: admin / admin123');
console.log('3. Vào "Quản lý người dùng"');
console.log('4. Click nút $ (màu xanh) cạnh user của bạn');
console.log('5. Nhập số tiền (VD: 500000)');
console.log('6. Click "Lưu thay đổi"');
console.log('7. Logout admin');
console.log('8. Login lại user của bạn');
console.log('9. Số dư sẽ tự động cập nhật trong 1 giây!');
console.log('========================================\n');
