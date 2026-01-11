// CẤU HÌNH TELEGRAM BOT

export const TELEGRAM_CONFIG = {
  // Bot Token từ @BotFather
  BOT_TOKEN: '8523542270:AAF7rkjSzuSxJU27kP5zyeP4QNBJkEkwWBQ',
  
  // Chat ID của admin
  CHAT_ID: '7394714849',
  
  // Bật/tắt thông báo
  ENABLED: true,  // ĐÃ BẬT - Sẽ gửi thông báo khi có đơn hàng mới
};

// Function gửi thông báo Telegram
export async function sendTelegramNotification(
  type: 'order' | 'deposit',
  data: any
): Promise<void> {
  // Kiểm tra xem có bật thông báo không
  if (!TELEGRAM_CONFIG.ENABLED || !TELEGRAM_CONFIG.BOT_TOKEN || !TELEGRAM_CONFIG.CHAT_ID) {
    console.log('⚠️ Telegram notification disabled or not configured');
    return;
  }

  let message = '';

  if (type === 'order') {
    message = `
🔔 <b>ĐƠN HÀNG MỚI - LIKESALE69</b>

👤 <b>Khách hàng:</b> ${data.username}
📦 <b>Dịch vụ:</b> ${data.service}
🌐 <b>Platform:</b> ${data.platform}
🔗 <b>Link:</b> ${data.link}
📊 <b>Số lượng:</b> ${data.quantity.toLocaleString('vi-VN')}
💰 <b>Giá trị:</b> ${data.price.toLocaleString('vi-VN')}đ
📅 <b>Thời gian:</b> ${new Date(data.createdAt).toLocaleString('vi-VN')}
⏱ <b>Trạng thái:</b> ${data.status === 'pending' ? 'Chờ xử lý' : data.status}

🆔 <b>Order ID:</b> ${data.id}
    `.trim();
  } else if (type === 'deposit') {
    const statusLabel =
      data.status === 'pending'
        ? 'Đã tạo lệnh'
        : data.status === 'transferred'
          ? 'Đã thanh toán (chờ duyệt)'
          : data.status === 'completed'
            ? 'Hoàn thành'
            : data.status === 'cancelled'
              ? 'Từ chối'
              : String(data.status || '');
    message = `
💳 <b>YÊU CẦU NẠP TIỀN - LIKESALE69</b>

👤 <b>Khách hàng:</b> ${data.username}
💵 <b>Số tiền:</b> ${data.amount.toLocaleString('vi-VN')}đ
🏦 <b>Phương thức:</b> ${data.method}
📅 <b>Thời gian:</b> ${new Date(data.createdAt).toLocaleString('vi-VN')}
⏱ <b>Trạng thái:</b> ${statusLabel}

📝 <b>Nội dung CK:</b> ${data.note || ''}

🆔 <b>Deposit ID:</b> ${data.id}
    `.trim();
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_CONFIG.BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CONFIG.CHAT_ID,
          text: message,
          parse_mode: 'HTML',
        }),
      }
    );

    const result = await response.json();
    
    if (result.ok) {
      console.log('✅ Telegram notification sent successfully!');
    } else {
      console.error('❌ Telegram notification failed:', result);
    }
  } catch (error) {
    console.error('❌ Error sending Telegram notification:', error);
  }
}