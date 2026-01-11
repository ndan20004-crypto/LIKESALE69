// Auto-generated shared service config (moved from components/services).
import { Users, Star, AlertCircle } from 'lucide-react';

export const serviceDetails: Record<string, any> = {
  member: {
    icon: Users,
    title: 'Tăng Thành Viên Telegram Group',
    description: 'Tăng thành viên thật cho nhóm Telegram. Member hoạt động lâu dài.',
    category: 'Telegram',
    packages: [
      { 
        id: 1, 
        name: 'Tăng member Telegram Server 1', 
        price: 150, 
        min: 50, 
        max: 10000,
        description: 'Bắt đầu: 10-60 phút, Member từ tài khoản Telegram thật\nMember sẽ ở lại lâu dài, bảo hành refill 30 ngày',
        speed: 'Trung bình ~50-200 member / ngày',
        warranty: '30 ngày',
        canCancel: true,
        cancelFee: 100,
        dropRate: '10-20%'
      },
      { 
        id: 2, 
        name: 'Tăng member Telegram Server 2 - Nhanh', 
        price: 200, 
        min: 100, 
        max: 50000,
        description: 'Bắt đầu: 5-30 phút, Member từ tài khoản Telegram thật\nTốc độ nhanh hơn Server 1',
        speed: 'Nhanh ~200-1000 member / ngày',
        warranty: '30 ngày',
        canCancel: true,
        cancelFee: 100,
        dropRate: '5-15%'
      },
      { 
        id: 3, 
        name: 'Tăng member Telegram Server 3 - VIP', 
        price: 250, 
        min: 500, 
        max: 100000,
        description: 'Bắt đầu: 5-20 phút, Member từ tài khoản Telegram thật, chất lượng cao\nÍt tuột nhất',
        speed: 'Rất nhanh ~500-2000 member / ngày',
        warranty: '60 ngày',
        canCancel: true,
        cancelFee: 100,
        dropRate: '3-10%'
      },
    ]
  },
  star: {
    icon: Star,
    title: 'Tăng Sao Telegram VIP',
    description: 'Tăng sao Telegram cho kênh. Có thời hạn theo gói đã chọn.',
    category: 'Telegram',
    packages: [
      { 
        id: 1, 
        name: 'Tăng sao Telegram VIP - 1 tháng', 
        price: 5000, 
        duration: '1 tháng',
        min: 1, 
        max: 100,
        description: 'Bắt đầu: 1-6 giờ, Sao Telegram VIP\nThời hạn: 1 tháng\nCó thể gia hạn trước khi hết hạn',
        speed: 'Xử lý trong 1-6 giờ',
        warranty: 'Theo thời hạn gói',
        canCancel: false,
        dropRate: 'Hết hạn sau 1 tháng'
      },
      { 
        id: 2, 
        name: 'Tăng sao Telegram VIP - 3 tháng', 
        price: 14000, 
        duration: '3 tháng',
        min: 1, 
        max: 100,
        description: 'Bắt đầu: 1-6 giờ, Sao Telegram VIP\nThời hạn: 3 tháng\nTiết kiệm hơn gói 1 tháng',
        speed: 'Xử lý trong 1-6 giờ',
        warranty: 'Theo thời hạn gói',
        canCancel: false,
        dropRate: 'Hết hạn sau 3 tháng'
      },
      { 
        id: 3, 
        name: 'Tăng sao Telegram VIP - 6 tháng', 
        price: 26000, 
        duration: '6 tháng',
        min: 1, 
        max: 100,
        description: 'Bắt đầu: 1-6 giờ, Sao Telegram VIP\nThời hạn: 6 tháng\nGiá tốt nhất, tiết kiệm nhất',
        speed: 'Xử lý trong 1-6 giờ',
        warranty: 'Theo thời hạn gói',
        canCancel: false,
        dropRate: 'Hết hạn sau 6 tháng'
      },
    ]
  },
};
