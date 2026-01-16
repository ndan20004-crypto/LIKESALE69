// Auto-generated shared service config (moved from components/services).
import { UserPlus, Heart, MessageCircle, Eye, Video, AlertCircle } from 'lucide-react';

export const serviceDetails: Record<string, any> = {
  like: {
    icon: Heart,
    title: 'Tăng Tym Bài viết Instagram',
    description: 'Tăng tym cho bài viết Instagram. Tăng tương tác nhanh.',
    category: 'Instagram',
    packages: [
      { 
        id: 1, 
        name: 'Like Instagram Server 1', 
        price: 28, 
        min: 100, 
        max: 100000,
        description: 'Bắt đầu: 1-4h, Like từ tài khoản Instagram thật\nCó thể tuột 10-20% trong quá trình tăng',
        speed: 'Trung bình ~500-2000 like / ngày',
        warranty: 'Không',
        canCancel: true,
        cancelFee: 100,
        dropRate: '10-20%'
      },
      { 
        id: 2, 
        name: 'Like Instagram Server 2 - Nhanh', 
        price: 35, 
        min: 500, 
        max: 500000,
        description: 'Bắt đầu: 30 phút - 2h, Like từ tài khoản Instagram thật\nTốc độ nhanh, ổn định',
        speed: 'Nhanh ~2000-10000 like / ngày',
        warranty: 'Không',
        canCancel: true,
        cancelFee: 100,
        dropRate: '5-15%'
      },
    ]
  },
  follow: {
    icon: UserPlus,
    title: 'Tăng Follow / Người theo dõi Instagram',
    description: 'Tăng follow cho tài khoản Instagram. Follow thật 100%.',
    category: 'Instagram',
    packages: [
      { 
        id: 1, 
        name: 'Follow Instagram Server 1', 
        price: 50, 
        min: 100, 
        max: 50000,
        description: 'Bắt đầu: 2-6h, Follow từ tài khoản Instagram Việt Nam thật, có avatar\nCó thể tuột 10-30% sau 30 ngày',
        speed: 'Trung bình ~100-500 follow / ngày',
        warranty: '30 ngày',
        canCancel: true,
        cancelFee: 100,
        dropRate: '10-30%'
      },
      { 
        id: 2, 
        name: 'Follow Instagram Server 2 - Nhanh', 
        price: 65, 
        min: 100, 
        max: 100000,
        description: 'Bắt đầu: 1-3h, Follow từ tài khoản Instagram thật\nTốc độ nhanh hơn Server 1',
        speed: 'Nhanh ~500-2000 follow / ngày',
        warranty: '30 ngày',
        canCancel: true,
        cancelFee: 100,
        dropRate: '5-20%'
      },
      { 
        id: 3, 
        name: 'Follow Instagram Server 3 - VIP', 
        price: 80, 
        min: 500, 
        max: 200000,
        description: 'Bắt đầu: 30 phút - 2h, Follow từ tài khoản Instagram thật, chất lượng cao\nÍt tuột nhất',
        speed: 'Rất nhanh ~1000-5000 follow / ngày',
        warranty: '60 ngày',
        canCancel: true,
        cancelFee: 100,
        dropRate: '3-15%'
      },
    ]
  },
  comment: {
    icon: MessageCircle,
    title: 'Tăng Comment / Bình luận Instagram',
    description: 'Tăng comment cho bài viết Instagram. Comment tự nhiên.',
    category: 'Instagram',
    packages: [
      { 
        id: 1, 
        name: 'Comment Instagram Server 1', 
        price: 300, 
        min: 10, 
        max: 1000,
        description: 'Bắt đầu: 1-6h, Comment từ tài khoản Instagram Việt Nam thật\nComment tự động từ danh sách có sẵn',
        speed: 'Trung bình ~10-50 comment / ngày',
        warranty: 'Không',
        canCancel: false,
        dropRate: '5-10%'
      },
      { 
        id: 2, 
        name: 'Comment Instagram Server 2 - Custom', 
        price: 400, 
        min: 10, 
        max: 500,
        description: 'Bắt đầu: 30 phút - 2h, Comment từ tài khoản thật\nCó thể custom nội dung comment',
        speed: 'Nhanh ~20-100 comment / ngày',
        warranty: 'Không',
        canCancel: false,
        dropRate: '5-15%'
      },
    ]
  },
  view: {
    icon: Eye,
    title: 'Tăng View / Mắt xem Instagram',
    description: 'Tăng lượt xem video/Reels Instagram.',
    category: 'Instagram',
    packages: [
      { 
        id: 1, 
        name: 'View Instagram Reels Server 1', 
        price: 20, 
        min: 1000, 
        max: 1000000,
        description: 'Bắt đầu: 1-6h, View từ user thật\nView tự nhiên, an toàn cho Reels',
        speed: 'Trung bình ~5000-20000 view / ngày',
        warranty: 'Không',
        canCancel: true,
        cancelFee: 100,
        dropRate: '5-10%'
      },
      { 
        id: 2, 
        name: 'View Instagram Video Server 2', 
        price: 22, 
        min: 1000, 
        max: 500000,
        description: 'Bắt đầu: 30 phút - 2h, View từ user thật\nTốc độ nhanh cho video thường',
        speed: 'Nhanh ~10000-50000 view / ngày',
        warranty: 'Không',
        canCancel: true,
        cancelFee: 100,
        dropRate: '3-8%'
      },
    ]
  },
  livestream: {
    icon: Video,
    title: 'Tăng Mắt Livestream Instagram',
    description: 'Tăng mắt xem livestream Instagram. View thật trong lúc live.',
    category: 'Instagram',
    packages: [
      { 
        id: 1, 
        name: 'Mắt Livestream Instagram Server 1', 
        price: 85, 
        min: 100, 
        max: 10000,
        description: 'Bắt đầu: 5-15 phút, View từ người dùng thật\nXem trong lúc bạn đang livestream, tăng tương tác',
        speed: 'Nhanh ~100-500 view / phiên live',
        warranty: 'Không',
        canCancel: false,
        dropRate: 'Không'
      },
      { 
        id: 2, 
        name: 'Mắt Livestream Instagram Server 2 - VIP', 
        price: 125, 
        min: 200, 
        max: 50000,
        description: 'Bắt đầu: 2-10 phút, View từ người dùng thật, tốc độ cao\nChất lượng tốt, ổn định',
        speed: 'Rất nhanh ~500-2000 view / phiên live',
        warranty: 'Không',
        canCancel: false,
        dropRate: 'Không'
      },
    ]
  },
};
