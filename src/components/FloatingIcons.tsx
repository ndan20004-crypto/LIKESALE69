import React from 'react';
import { Facebook, Instagram, Heart, ThumbsUp, AtSign, Star, MessageCircle, Hash, Send } from 'lucide-react';
import TikTokIcon from './icons/TikTokIcon';

export default function FloatingIcons() {
  // Tăng số lượng icon lên 60 (gấp 5 lần)
  const icons = [
    // Set 1
    { Icon: Facebook, color: 'text-blue-400/40', delay: '0s', duration: '20s', path: 1 },
    { Icon: Instagram, color: 'text-pink-400/40', delay: '2s', duration: '25s', path: 2 },
    { Icon: Heart, color: 'text-red-400/40', delay: '4s', duration: '18s', path: 3 },
    { Icon: ThumbsUp, color: 'text-blue-300/40', delay: '1s', duration: '22s', path: 4 },
    { Icon: AtSign, color: 'text-purple-400/40', delay: '3s', duration: '19s', path: 5 },
    { Icon: Star, color: 'text-yellow-400/40', delay: '5s', duration: '24s', path: 6 },
    { Icon: MessageCircle, color: 'text-cyan-400/40', delay: '2.5s', duration: '21s', path: 7 },
    { Icon: Heart, color: 'text-pink-300/40', delay: '6s', duration: '23s', path: 8 },
    { Icon: ThumbsUp, color: 'text-indigo-400/40', delay: '4.5s', duration: '20s', path: 9 },
    { Icon: AtSign, color: 'text-blue-200/40', delay: '1.5s', duration: '26s', path: 10 },
    
    // Set 2
    { Icon: Facebook, color: 'text-blue-500/35', delay: '7s', duration: '21s', path: 11 },
    { Icon: Instagram, color: 'text-pink-500/35', delay: '8s', duration: '19s', path: 12 },
    { Icon: Heart, color: 'text-red-500/35', delay: '0.5s', duration: '24s', path: 1 },
    { Icon: Star, color: 'text-yellow-500/35', delay: '3.5s', duration: '22s', path: 2 },
    { Icon: MessageCircle, color: 'text-cyan-500/35', delay: '5.5s', duration: '20s', path: 3 },
    { Icon: ThumbsUp, color: 'text-blue-400/35', delay: '7.5s', duration: '23s', path: 4 },
    { Icon: AtSign, color: 'text-purple-500/35', delay: '2.2s', duration: '25s', path: 5 },
    { Icon: Hash, color: 'text-green-400/35', delay: '4.2s', duration: '21s', path: 6 },
    { Icon: Send, color: 'text-blue-300/35', delay: '6.2s', duration: '19s', path: 7 },
    { Icon: Heart, color: 'text-red-300/35', delay: '1.8s', duration: '22s', path: 8 },
    
    // Set 3
    { Icon: Facebook, color: 'text-blue-600/40', delay: '9s', duration: '20s', path: 9 },
    { Icon: Instagram, color: 'text-pink-600/40', delay: '10s', duration: '24s', path: 10 },
    { Icon: Star, color: 'text-yellow-300/40', delay: '11s', duration: '18s', path: 11 },
    { Icon: ThumbsUp, color: 'text-indigo-500/40', delay: '0.8s', duration: '21s', path: 12 },
    { Icon: MessageCircle, color: 'text-cyan-600/40', delay: '2.8s', duration: '23s', path: 1 },
    { Icon: Heart, color: 'text-pink-400/40', delay: '4.8s', duration: '19s', path: 2 },
    { Icon: AtSign, color: 'text-purple-300/40', delay: '6.8s', duration: '25s', path: 3 },
    { Icon: Hash, color: 'text-green-500/40', delay: '8.8s', duration: '20s', path: 4 },
    { Icon: Send, color: 'text-blue-500/40', delay: '3.3s', duration: '22s', path: 5 },
    { Icon: Star, color: 'text-yellow-600/40', delay: '5.3s', duration: '24s', path: 6 },
    
    // Set 4
    { Icon: Facebook, color: 'text-blue-300/35', delay: '12s', duration: '23s', path: 7 },
    { Icon: Instagram, color: 'text-pink-300/35', delay: '13s', duration: '21s', path: 8 },
    { Icon: Heart, color: 'text-red-600/35', delay: '1.2s', duration: '20s', path: 9 },
    { Icon: ThumbsUp, color: 'text-blue-600/35', delay: '3.2s', duration: '24s', path: 10 },
    { Icon: MessageCircle, color: 'text-cyan-300/35', delay: '5.2s', duration: '19s', path: 11 },
    { Icon: Star, color: 'text-yellow-400/35', delay: '7.2s', duration: '22s', path: 12 },
    { Icon: AtSign, color: 'text-purple-600/35', delay: '9.2s', duration: '25s', path: 1 },
    { Icon: Hash, color: 'text-green-300/35', delay: '2.6s', duration: '21s', path: 2 },
    { Icon: Send, color: 'text-blue-400/35', delay: '4.6s', duration: '23s', path: 3 },
    { Icon: Heart, color: 'text-pink-500/35', delay: '6.6s', duration: '20s', path: 4 },
    
    // Set 5
    { Icon: Facebook, color: 'text-blue-400/40', delay: '14s', duration: '22s', path: 5 },
    { Icon: Instagram, color: 'text-pink-400/40', delay: '0.3s', duration: '24s', path: 6 },
    { Icon: Star, color: 'text-yellow-500/40', delay: '2.3s', duration: '19s', path: 7 },
    { Icon: ThumbsUp, color: 'text-indigo-300/40', delay: '4.3s', duration: '21s', path: 8 },
    { Icon: MessageCircle, color: 'text-cyan-500/40', delay: '6.3s', duration: '23s', path: 9 },
    { Icon: Heart, color: 'text-red-400/40', delay: '8.3s', duration: '20s', path: 10 },
    { Icon: AtSign, color: 'text-purple-400/40', delay: '10.3s', duration: '25s', path: 11 },
    { Icon: Hash, color: 'text-green-600/40', delay: '3.7s', duration: '22s', path: 12 },
    { Icon: Send, color: 'text-blue-600/40', delay: '5.7s', duration: '24s', path: 1 },
    { Icon: Star, color: 'text-yellow-300/40', delay: '7.7s', duration: '21s', path: 2 },
  ];

  // TikTok icons - 10 thêm vào
  const tiktokIcons = [
    { delay: '3.5s', duration: '22s', path: 3 },
    { delay: '5.5s', duration: '19s', path: 4 },
    { delay: '7.5s', duration: '24s', path: 5 },
    { delay: '1.3s', duration: '21s', path: 6 },
    { delay: '4.3s', duration: '23s', path: 7 },
    { delay: '6.3s', duration: '20s', path: 8 },
    { delay: '8.3s', duration: '25s', path: 9 },
    { delay: '2.7s', duration: '22s', path: 10 },
    { delay: '5.2s', duration: '19s', path: 11 },
    { delay: '7.8s', duration: '24s', path: 12 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Regular Lucide Icons */}
      {icons.map((item, index) => {
        // Tính toán vị trí - cho phép bay gần form hơn
        const isLeftSide = index % 2 === 0;
        
        let left, top;
        
        if (isLeftSide) {
          // Bên trái: 0-35% (gần form hơn)
          left = `${(index * 5) % 35}%`;
        } else {
          // Bên phải: 65-100% (gần form hơn)
          left = `${65 + (index * 5) % 35}%`;
        }
        
        // Phân bố dọc tự do hơn: 0-100%
        top = `${(index * 11 + 5) % 95}%`;
        
        return (
          <div
            key={index}
            className={`absolute ${item.color}`}
            style={{
              animation: `float${item.path} ${item.duration} infinite ease-in-out`,
              animationDelay: item.delay,
              left,
              top,
            }}
          >
            <item.Icon className="size-6" />
          </div>
        );
      })}

      {/* TikTok Icons */}
      {tiktokIcons.map((item, index) => {
        const isLeftSide = index % 2 === 0;
        // TikTok cũng bay gần hơn
        const left = isLeftSide ? `${5 + (index * 4) % 30}%` : `${65 + (index * 4) % 30}%`;
        const top = `${5 + (index * 9) % 90}%`;
        
        return (
          <div
            key={`tiktok-${index}`}
            className="absolute text-slate-300/40"
            style={{
              animation: `float${item.path} ${item.duration} infinite ease-in-out`,
              animationDelay: item.delay,
              left,
              top,
            }}
          >
            <TikTokIcon className="size-6" />
          </div>
        );
      })}

      <style>{`
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(30px, -20px) rotate(5deg); }
          50% { transform: translate(-20px, -40px) rotate(-5deg); }
          75% { transform: translate(-30px, -20px) rotate(3deg); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(-40px, 30px) rotate(-8deg); }
          66% { transform: translate(25px, -25px) rotate(8deg); }
        }
        @keyframes float3 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(20px, 35px) rotate(6deg); }
          50% { transform: translate(-35px, 15px) rotate(-6deg); }
          75% { transform: translate(15px, -30px) rotate(4deg); }
        }
        @keyframes float4 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          30% { transform: translate(-25px, -35px) rotate(-7deg); }
          60% { transform: translate(40px, 20px) rotate(7deg); }
        }
        @keyframes float5 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(-30px, 25px) rotate(5deg); }
          50% { transform: translate(35px, -15px) rotate(-5deg); }
          75% { transform: translate(-15px, 30px) rotate(3deg); }
        }
        @keyframes float6 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(25px, -30px) rotate(-6deg); }
          66% { transform: translate(-40px, 25px) rotate(6deg); }
        }
        @keyframes float7 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(35px, 20px) rotate(4deg); }
          50% { transform: translate(-20px, 35px) rotate(-4deg); }
          75% { transform: translate(25px, -25px) rotate(2deg); }
        }
        @keyframes float8 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          30% { transform: translate(-35px, -25px) rotate(-5deg); }
          60% { transform: translate(30px, 30px) rotate(5deg); }
        }
        @keyframes float9 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(-25px, 30px) rotate(7deg); }
          50% { transform: translate(30px, -35px) rotate(-7deg); }
          75% { transform: translate(-35px, 20px) rotate(4deg); }
        }
        @keyframes float10 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(35px, -25px) rotate(-4deg); }
          66% { transform: translate(-30px, 30px) rotate(4deg); }
        }
        @keyframes float11 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(20px, -35px) rotate(6deg); }
          50% { transform: translate(-30px, 20px) rotate(-6deg); }
          75% { transform: translate(25px, 25px) rotate(3deg); }
        }
        @keyframes float12 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          30% { transform: translate(-35px, 30px) rotate(-5deg); }
          60% { transform: translate(35px, -20px) rotate(5deg); }
        }
      `}</style>
    </div>
  );
}