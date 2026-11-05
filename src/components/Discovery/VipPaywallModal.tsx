import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Crown, Sparkles, CheckCircle2, X, Zap, Shield, Heart } from 'lucide-react';

interface VipPaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenShop: () => void;
  title?: string;
  description?: string;
}

export const VipPaywallModal: React.FC<VipPaywallModalProps> = ({
  isOpen,
  onClose,
  onOpenShop,
  title = "Bu imkoniyat faqat VIP uchun! 💎",
  description = "Faqat qizlar yoki yigitlarni saralash, kim sizni yoqtirganini ko'rish va cheksiz like'lardan foydalanish uchun VIP obunaga o'ting.",
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-sm rounded-3xl bg-[#141418] border border-purple-500/40 p-6 shadow-2xl shadow-purple-950/60 text-white overflow-hidden"
        >
          {/* BACKGROUND GLOW */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-fuchsia-600/20 rounded-full blur-3xl pointer-events-none" />

          {/* CLOSE BUTTON */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* ICON & TITLE */}
          <div className="text-center pt-2">
            <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-purple-gradient p-0.5 shadow-lg shadow-purple-600/40">
              <div className="w-full h-full bg-[#121216] rounded-2xl flex items-center justify-center">
                <Crown className="w-8 h-8 text-yellow-400 fill-yellow-400" />
              </div>
            </div>

            <h3 className="text-lg font-bold text-white mb-2 leading-tight">
              {title}
            </h3>

            <p className="text-xs text-gray-300 leading-relaxed mb-5">
              {description}
            </p>
          </div>

          {/* VIP PERKS LIST */}
          <div className="space-y-2.5 mb-6 text-xs text-gray-200 bg-[#1c1c22]/80 rounded-2xl p-3.5 border border-purple-900/30">
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-md bg-purple-900/50 flex items-center justify-center text-purple-400 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span>Jins bo'yicha cheklovsiz saralash</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-md bg-purple-900/50 flex items-center justify-center text-purple-400 shrink-0">
                <Heart className="w-3.5 h-3.5 fill-purple-400 text-purple-400" />
              </div>
              <span>Cheksiz kunlik like bosish imkoniyati</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-md bg-purple-900/50 flex items-center justify-center text-purple-400 shrink-0">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span>Sizni kimlar yoqtirganini ochiq ko'rish</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-md bg-purple-900/50 flex items-center justify-center text-purple-400 shrink-0">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <span>Profilni qidiruvda eng yuqoriga chiqarish</span>
            </div>
          </div>

          {/* ACTION BUTTON */}
          <div className="space-y-2">
            <button
              onClick={() => {
                onClose();
                onOpenShop();
              }}
              className="w-full bg-purple-gradient hover:opacity-95 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-purple-600/40 text-sm transition-all"
            >
              <Crown className="w-4 h-4 fill-yellow-300 text-yellow-300" />
              <span>VIP xarid qilish ($0.99 dan)</span>
            </button>

            <button
              onClick={onClose}
              className="w-full py-2.5 text-xs text-gray-400 hover:text-white transition-colors"
            >
              Hozircha bepul davom etish
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default VipPaywallModal;
