// Auto-generated shared service config (moved from components/services).
import { ThumbsUp, MessageCircle, Share2, UserPlus, Eye, Video, AlertCircle, Info, Loader2, Heart, Star, Users } from 'lucide-react';

export const serviceDetails: Record<string, any> = {
  like: {
    icon: ThumbsUp,
    title: 'Tăng Like bài viết Facebook',
    description: 'Tăng like cho bài viết Facebook của bạn. Tốc độ nhanh, an toàn.',
    category: 'Facebook',
    packages: [
      { 
        id: 1, 
        name: 'Like post việt sever 1', 
        price: 56, 
        min: 100, 
        max: 100000,
        description: 'Bắt đầu: 1-6h\nLike từ tài khoản Việt Nam thật, có avatar\nChất lượng cao, ổn định',
        speed: 'Trung bình ~200-1000 like / ngày',
        warranty: 'Không',
        canCancel: true,
        cancelFee: 100,
        dropRate: '10-20%'
      },
      { 
        id: 2, 
        name: 'Like post việt rẻ sever 2', 
        price: 31, 
        min: 100, 
        max: 100000,
        description: 'Bắt đầu: 2-12h\nLike từ tài khoản Việt Nam, giá rẻ\nTốc độ chậm hơn Server 1',
        speed: 'Chậm ~100-500 like / ngày',
        warranty: 'Không',
        canCancel: true,
        cancelFee: 100,
        dropRate: '20-30%'
      },
      { 
        id: 3, 
        name: 'Like Post tây sever 3', 
        price: 22, 
        min: 100, 
        max: 50000,
        description: 'Bắt đầu: 1-6h\nLike từ tài khoản nước ngoài\nGiá rẻ nhất',
        speed: 'Trung bình ~200-800 like / ngày',
        warranty: 'Không',
        canCancel: true,
        cancelFee: 100,
        dropRate: '15-25%'
      },
    ]
  },
  follow: {
    icon: UserPlus,
    title: 'Tăng Follow / Người theo dõi Facebook',
    description: 'Tăng người theo dõi Facebook profile. Follow từ tài khoản thật.',
    category: 'Facebook',
    packages: [
      { 
        id: 1, 
        name: 'Tăng follow facebook việt thật sever 1', 
        price: 77, 
        min: 100, 
        max: 50000,
        description: 'Bắt đầu: 1-6h\nFollow từ tài khoản Việt Nam thật, có avatar\nChất lượng cao',
        speed: 'Trung bình ~100-500 follow / ngày',
        warranty: 'Không',
        canCancel: true,
        cancelFee: 100,
        dropRate: '10-20%'
      },
      { 
        id: 2, 
        name: 'Tăng follow facebook việt rẻ sever 2', 
        price: 27, 
        min: 100, 
        max: 50000,
        description: 'Bắt đầu: 2-12h\nFollow từ tài khoản Việt Nam, giá rẻ\nTốc độ chậm hơn',
        speed: 'Chậm ~50-300 follow / ngày',
        warranty: 'Không',
        canCancel: true,
        cancelFee: 100,
        dropRate: '20-30%'
      },
    ]
  },
  comment: {
    icon: MessageCircle,
    title: 'Tăng Comment / Bình luận Facebook',
    description: 'Tăng comment cho bài viết Facebook. Comment thật từ user Việt Nam.',
    category: 'Facebook',
    packages: [
      { 
        id: 1, 
        name: 'Tăng comment bài viết sever 1', 
        price: 150, 
        min: 10, 
        max: 1000,
        description: 'Bắt đầu: 1-6h\nComment từ tài khoản Việt Nam thật, có avatar\nComment tự động từ danh sách có sẵn',
        speed: 'Trung bình ~10-50 comment / ngày',
        warranty: 'Không',
        canCancel: false,
        dropRate: '5-10%'
      },
    ]
  },
  'comment-like': {
    icon: Heart,
    title: 'Tăng Like Comment Facebook',
    description: 'Tăng like cho comment trên Facebook. Like từ tài khoản thật.',
    category: 'Facebook',
    packages: [
      { 
        id: 1, 
        name: 'Tăng Like Comment Facebook sever 1', 
        price: 60, 
        min: 50, 
        max: 50000,
        description: 'Bắt đầu: 1-6h\nLike comment từ tài khoản Việt Nam thật\nChất lượng tốt',
        speed: 'Trung bình ~100-500 like / ngày',
        warranty: 'Không',
        canCancel: true,
        cancelFee: 100,
        dropRate: '10-20%'
      },
    ]
  },
  share: {
    icon: Share2,
    title: 'Tăng Share / Chia sẻ Facebook',
    description: 'Tăng share cho bài viết Facebook. Share từ tài khoản thật.',
    category: 'Facebook',
    packages: [
      { 
        id: 1, 
        name: 'Tăng Share Facebook sever 1', 
        price: 200, 
        min: 50, 
        max: 10000,
        description: 'Bắt đầu: 2-6h\nShare từ tài khoản Việt Nam thật\nShare về wall cá nhân',
        speed: 'Trung bình ~50-200 share / ngày',
        warranty: 'Không',
        canCancel: true,
        cancelFee: 100,
        dropRate: '10-20%'
      },
    ]
  },
  'page-like': {
    icon: ThumbsUp,
    title: 'Tăng Like / Follow Page Facebook',
    description: 'Tăng like/follow cho Fanpage Facebook. Từ tài khoản thật.',
    category: 'Facebook',
    packages: [
      { 
        id: 1, 
        name: 'Tăng like / follow việt sever 1', 
        price: 105, 
        min: 100, 
        max: 50000,
        description: 'Bắt đầu: 1-6h\nLike/Follow page từ tài khoản Việt Nam thật\nChất lượng cao nhất',
        speed: 'Trung bình ~100-500 like / ngày',
        warranty: 'Không',
        canCancel: true,
        cancelFee: 100,
        dropRate: '10-20%'
      },
      { 
        id: 2, 
        name: 'Tăng like việt rẻ sever 2', 
        price: 45, 
        min: 100, 
        max: 50000,
        description: 'Bắt đầu: 2-12h\nLike page từ tài khoản Việt Nam, giá rẻ\nTốc độ chậm hơn',
        speed: 'Chậm ~50-300 like / ngày',
        warranty: 'Không',
        canCancel: true,
        cancelFee: 100,
        dropRate: '20-30%'
      },
      { 
        id: 3, 
        name: 'Tăng follow việt sever 3', 
        price: 55, 
        min: 100, 
        max: 50000,
        description: 'Bắt đầu: 1-8h\nFollow page từ tài khoản Việt Nam\nGiá vừa phải, chất lượng tốt',
        speed: 'Trung bình ~100-400 follow / ngày',
        warranty: 'Không',
        canCancel: true,
        cancelFee: 100,
        dropRate: '15-25%'
      },
    ]
  },
  'page-review': {
    icon: Star,
    title: 'Tăng Đánh Giá Page Facebook',
    description: 'Tăng đánh giá 5 sao cho Fanpage Facebook.',
    category: 'Facebook',
    packages: [
      { 
        id: 1, 
        name: 'Tăng đánh giá page 5 sao sever 1', 
        price: 200, 
        min: 10, 
        max: 1000,
        description: 'Bắt đầu: 2-12h\nĐánh giá 5 sao từ tài khoản Việt Nam thật\nKèm nội dung review tự động',
        speed: 'Trung bình ~10-50 review / ngày',
        warranty: 'Không',
        canCancel: false,
        dropRate: '5-15%'
      },
    ]
  },
  'group-member': {
    icon: Users,
    title: 'Tăng Thành Viên Group / Nhóm Facebook',
    description: 'Tăng thành viên cho nhóm Facebook. Member từ tài khoản thật.',
    category: 'Facebook',
    packages: [
      { 
        id: 1, 
        name: 'Tăng Thành Viên Group sever 1', 
        price: 70, 
        min: 100, 
        max: 50000,
        description: 'Bắt đầu: 2-12h\nThành viên từ tài khoản Việt Nam thật\nTự động join group',
        speed: 'Trung bình ~100-500 member / ngày',
        warranty: 'Không',
        canCancel: true,
        cancelFee: 100,
        dropRate: '15-25%'
      },
    ]
  },
  'story-view': {
    icon: Eye,
    title: 'Tăng View Story Facebook',
    description: 'Tăng lượt xem story Facebook. View từ người dùng thật.',
    category: 'Facebook',
    packages: [
      { 
        id: 1, 
        name: 'Tăng view story facebook sever 1', 
        price: 15, 
        min: 100, 
        max: 100000,
        description: 'Bắt đầu: 1-3h\nView story từ tài khoản Việt Nam thật\nGiá rẻ, tốc độ nhanh',
        speed: 'Nhanh ~500-2000 view / ngày',
        warranty: 'Không',
        canCancel: true,
        cancelFee: 50,
        dropRate: '5-10%'
      },
    ]
  },
};
