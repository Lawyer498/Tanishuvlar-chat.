import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  Heart, X, Star, Zap, RotateCcw, MapPin, 
  ShieldCheck, Info, Sparkles, Filter, Crown, MessageCircle
} from 'lucide-react';
import { discoveryApi, interactionApi, referralApi } from '../../services/api';
import VipPaywallModal from './VipPaywallModal';

interface CardStackProps {
  currentUser: any;
  onOpenShop: () => void;
  onOpenChat: (partner: any) => void;
}

export const CardStack: React.FC<CardStackProps> = ({ currentUser, onOpenShop, onOpenChat }) => {
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [showBioModal, setShowBioModal] = useState(false);
  const [genderFilter, setGenderFilter] = useState<'all' | 'female' | 'male'>('all');
  const [history, setHistory] = useState<{ profile: any; action: string }[]>([]);

  // Modals & Popups
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [paywallTitle, setPaywallTitle] = useState("Bu imkoniyat faqat VIP uchun! 💎");
  const [paywallDesc, setPaywallDesc] = useState("Faqat qizlar yoki yigitlarni saralash uchun VIP obunaga o'ting.");
  const [matchData, setMatchData] = useState<any | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Load cards from API
  const loadCards = async (filter = genderFilter) => {
    setLoading(true);
    try {
      const res = await discoveryApi.getCards(filter);
      setCards(res.cards || []);
      setActivePhotoIndex(0);
    } catch (err: any) {
      if (err.response?.status === 403 || err.response?.data?.code === 'VIP_REQUIRED') {
        // Trigger VIP paywall modal immediately as required by business logic!
        setPaywallTitle("Jins bo'yicha saralash faqat VIP uchun! 💎");
        setPaywallDesc("Faqat qizlar yoki yigitlarni alohida saralab ko'rish imkoniyati VIP obunachilar uchun taqdim etiladi.");
        setPaywallOpen(true);
        // Reset filter back to all
        setGenderFilter('all');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCards(genderFilter);
  }, []);

  const handleGenderFilterChange = async (newFilter: 'all' | 'female' | 'male') => {
    // If user is not VIP and tries to choose female or male:
    if (!currentUser?.isVip && newFilter !== 'all') {
      setPaywallTitle("Jins bo'yicha saralash faqat VIP uchun! 💎");
      setPaywallDesc("Faqat qizlar yoki yigitlarni alohida ko'rish uchun VIP obunasini faollashtiring.");
      setPaywallOpen(true);
      return;
    }
    setGenderFilter(newFilter);
    loadCards(newFilter);
  };

  const currentCard = cards.length > 0 ? cards[0] : null;

  // Swipe Action Handler
  const handleSwipe = async (action: 'like' | 'skip' | 'super_like') => {
    if (!currentCard) return;

    const cardToHandle = currentCard;
    // Optimistically pop card
    setCards((prev) => prev.slice(1));
    setActivePhotoIndex(0);
    setHistory((prev) => [{ profile: cardToHandle, action }, ...prev]);

    try {
      if (action === 'like') {
        const res = await interactionApi.like(cardToHandle.id);
        if (res.isMatch) {
          triggerMatchCelebration(res.matchProfile || cardToHandle);
        }
      } else if (action === 'skip') {
        await interactionApi.skip(cardToHandle.id);
      } else if (action === 'super_like') {
        const res = await interactionApi.superLike(cardToHandle.id);
        if (res.isMatch) {
          triggerMatchCelebration(res.matchProfile || cardToHandle);
        }
      }
    } catch (err: any) {
      if (err.response?.data?.code === 'LIMIT_REACHED') {
        setPaywallTitle("Kunlik 20 ta bepul like tugadi! 🛑");
        setPaywallDesc("Kunlik bepul like limitiga yetdingiz. Cheksiz like bosish uchun VIP ga o'ting yoki do'stlaringizni taklif qiling!");
        setPaywallOpen(true);
      } else if (err.response?.data?.code === 'COINS_REQUIRED') {
        setPaywallTitle("Tanga yetarli emas ⭐");
        setPaywallDesc("Super like uchun 5 tanga yoki VIP obuna talab etiladi.");
        setPaywallOpen(true);
      }
    }
  };

  const triggerMatchCelebration = (partner: any) => {
    setMatchData(partner);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#8A2BE2', '#DA70D6', '#ff477e', '#ffffff'],
    });
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    if (!currentUser?.isVip) {
      setPaywallTitle("Orqaga qaytarish faqat VIP uchun! ↩️");
      setPaywallDesc("Tasodifan o'tkazib yuborilgan anketalarni orqaga qaytarish (Rewind) imkoniyati faqat VIP a'zolariga tegishli.");
      setPaywallOpen(true);
      return;
    }
    const last = history[0];
    setCards([last.profile, ...cards]);
    setHistory(history.slice(1));
  };

  const handleBoost = async () => {
    try {
      const res = await referralApi.redeem('boost');
      setActionNotice(res.message);
      setTimeout(() => setActionNotice(null), 3000);
    } catch (err: any) {
      setPaywallTitle("Top Boost faollashtirish ⚡");
      setPaywallDesc(err.response?.data?.error || "Profilingizni 24 soatga birinchi o'ringa ko'tarish uchun 50 ta tanga yoki VIP kerak!");
      setPaywallOpen(true);
    }
  };

  const handlePhotoNav = (e: React.MouseEvent, dir: 'next' | 'prev') => {
    e.stopPropagation();
    if (!currentCard?.photos) return;
    if (dir === 'next') {
      setActivePhotoIndex((prev) => (prev + 1) % currentCard.photos.length);
    } else {
      setActivePhotoIndex((prev) => (prev - 1 + currentCard.photos.length) % currentCard.photos.length);
    }
  };

  return (
    <div className="relative h-full flex flex-col justify-between max-w-md mx-auto select-none">
      {/* 1. TOP FILTER BAR */}
      <div className="px-4 pt-2 pb-1 flex items-center justify-between">
        <div className="flex items-center gap-1.5 bg-[#18181f] p-1 rounded-2xl border border-gray-800">
          <button
            onClick={() => handleGenderFilterChange('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              genderFilter === 'all'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Hammasi
          </button>
          <button
            onClick={() => handleGenderFilterChange('female')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 ${
              genderFilter === 'female'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span>Qizlar</span> 👩🏻
            {!currentUser?.isVip && <Crown className="w-2.5 h-2.5 text-yellow-400 ml-0.5" />}
          </button>
          <button
            onClick={() => handleGenderFilterChange('male')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 ${
              genderFilter === 'male'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span>Yigitlar</span> 🧔🏻‍♂️
            {!currentUser?.isVip && <Crown className="w-2.5 h-2.5 text-yellow-400 ml-0.5" />}
          </button>
        </div>

        {/* VIP BADGE OR UPGRADE BUTTON */}
        {currentUser?.isVip ? (
          <div className="flex items-center gap-1 bg-gradient-to-r from-amber-500/20 to-purple-500/20 border border-amber-500/40 text-amber-300 px-2.5 py-1 rounded-xl text-xs font-bold">
            <Crown className="w-3.5 h-3.5 fill-amber-400" />
            <span>VIP Faol</span>
          </div>
        ) : (
          <button
            onClick={onOpenShop}
            className="flex items-center gap-1 bg-purple-950/60 hover:bg-purple-900 border border-purple-600/50 text-purple-300 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>VIP olish</span>
          </button>
        )}
      </div>

      {actionNotice && (
        <div className="mx-4 my-1 p-2 bg-purple-900/90 border border-purple-400 text-center text-xs font-semibold text-white rounded-xl shadow-lg">
          {actionNotice}
        </div>
      )}

      {/* 2. CARD VIEWPORT */}
      <div className="flex-1 relative mx-3 my-2 min-h-[460px] max-h-[580px] flex items-center justify-center">
        {loading ? (
          <div className="text-center p-6 text-gray-400 space-y-3">
            <div className="w-12 h-12 border-3 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs">Yaqin atrofdagi anketalar yuklanmoqda...</p>
          </div>
        ) : cards.length === 0 ? (
          <div className="text-center p-6 bg-[#16161b] rounded-3xl border border-gray-800 space-y-4 max-w-xs shadow-xl">
            <div className="w-16 h-16 rounded-full bg-purple-900/40 border border-purple-500/50 flex items-center justify-center mx-auto text-purple-300">
              <MapPin className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white mb-1">Hozircha anketalar tugadi</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Yaqin atrofingizdagi barcha yangi profillarni ko'rib chiqdingiz. Qidiruv radiusini kengaytiring yoki birozdan so'ng kiring!
              </p>
            </div>
            <button
              onClick={() => loadCards('all')}
              className="w-full bg-purple-gradient text-white text-xs font-bold py-3 rounded-xl shadow-md"
            >
              Qayta yuklash
            </button>
          </div>
        ) : (
          <div className="relative w-full h-full">
            {/* NEXT CARD UNDERNEATH (DEPTH ILLUSION) */}
            {cards.length > 1 && (
              <div className="absolute inset-0 rounded-3xl overflow-hidden scale-95 translate-y-3 opacity-60 bg-gray-900 pointer-events-none border border-gray-800">
                <img
                  src={cards[1].photos[0]}
                  alt="Next candidate"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* ACTIVE SWIPEABLE CARD */}
            <SwipeCard
              key={currentCard.id}
              card={currentCard}
              activePhotoIndex={activePhotoIndex}
              onPhotoNav={handlePhotoNav}
              onSwipe={handleSwipe}
              onOpenBio={() => setShowBioModal(true)}
            />
          </div>
        )}
      </div>

      {/* 3. ACTION CONTROLS BAR */}
      <div className="px-6 py-3 flex items-center justify-between max-w-sm mx-auto w-full">
        {/* UNDO / REWIND */}
        <button
          onClick={handleUndo}
          title="Orqaga qaytarish (VIP)"
          className="w-11 h-11 rounded-full bg-[#1b1b22] border border-yellow-600/40 hover:border-yellow-400 text-yellow-400 flex items-center justify-center shadow-lg active:scale-95 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* SKIP (NOPE) */}
        <button
          onClick={() => handleSwipe('skip')}
          title="O'tkazib yuborish (Chapga)"
          className="w-14 h-14 rounded-full bg-[#1b1b22] border-2 border-red-500/70 hover:border-red-500 hover:bg-red-950/20 text-red-500 flex items-center justify-center shadow-xl active:scale-90 transition-all"
        >
          <X className="w-7 h-7 stroke-[2.5]" />
        </button>

        {/* SUPER LIKE */}
        <button
          onClick={() => handleSwipe('super_like')}
          title="Super Like ⭐"
          className="w-12 h-12 rounded-full bg-[#1b1b22] border border-blue-500/60 hover:border-blue-400 hover:bg-blue-950/20 text-blue-400 flex items-center justify-center shadow-lg active:scale-90 transition-all"
        >
          <Star className="w-6 h-6 fill-blue-400" />
        </button>

        {/* LIKE */}
        <button
          onClick={() => handleSwipe('like')}
          title="Yoqtirish (O'ngga)"
          className="w-14 h-14 rounded-full bg-[#1b1b22] border-2 border-green-500/70 hover:border-green-500 hover:bg-green-950/20 text-green-500 flex items-center justify-center shadow-xl active:scale-90 transition-all"
        >
          <Heart className="w-7 h-7 fill-green-500 stroke-[1.5]" />
        </button>

        {/* BOOST */}
        <button
          onClick={handleBoost}
          title="Profilni ko'tarish (Boost)"
          className="w-11 h-11 rounded-full bg-[#1b1b22] border border-purple-500/40 hover:border-purple-400 text-purple-400 flex items-center justify-center shadow-lg active:scale-95 transition-all"
        >
          <Zap className="w-4 h-4 fill-purple-400" />
        </button>
      </div>

      {/* 4. BIO DETAILS MODAL */}
      <AnimatePresence>
        {showBioModal && currentCard && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm p-3">
            <motion.div
              initial={{ y: 200, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 200, opacity: 0 }}
              className="w-full max-w-md bg-[#16161b] rounded-3xl p-5 border border-gray-800 text-white space-y-4 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold">{currentCard.name}, {currentCard.age}</h3>
                  {currentCard.isVerified && <ShieldCheck className="w-5 h-5 text-purple-400" />}
                </div>
                <button
                  onClick={() => setShowBioModal(false)}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-gray-300" />
                </button>
              </div>

              {/* Location Badge */}
              <div className="flex items-center gap-2 text-xs text-gray-400 bg-white/5 p-2 rounded-xl">
                <MapPin className="w-4 h-4 text-purple-400 shrink-0" />
                <span>{currentCard.districtName}, {currentCard.regionName}</span>
                {currentCard.distanceKm !== undefined && (
                  <span className="text-purple-400 font-bold ml-auto">{currentCard.distanceKm} km yaqin</span>
                )}
              </div>

              {/* Job */}
              {currentCard.jobTitle && (
                <div className="text-xs text-gray-300">
                  <span className="text-gray-500 font-semibold block mb-0.5">Kasbi:</span>
                  <p className="font-medium text-white">{currentCard.jobTitle}</p>
                </div>
              )}

              {/* Bio */}
              <div>
                <span className="text-xs text-gray-500 font-semibold block mb-1">O'zi haqida:</span>
                <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-line bg-[#1c1c22] p-3 rounded-2xl">
                  {currentCard.bio || "Ma'lumot kiritilmagan"}
                </p>
              </div>

              {/* Interests Tags */}
              {currentCard.interests && currentCard.interests.length > 0 && (
                <div>
                  <span className="text-xs text-gray-500 font-semibold block mb-2">Qiziqishlari:</span>
                  <div className="flex flex-wrap gap-2">
                    {currentCard.interests.map((tag: string, i: number) => (
                      <span key={i} className="text-xs px-3 py-1 rounded-full bg-purple-900/40 border border-purple-500/40 text-purple-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  setShowBioModal(false);
                  handleSwipe('like');
                }}
                className="w-full bg-purple-gradient py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>{currentCard.name} ga Like bosish</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. MATCH CELEBRATION POPUP */}
      <AnimatePresence>
        {matchData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="w-full max-w-sm rounded-3xl bg-[#141418] border-2 border-purple-500 p-6 text-center text-white relative shadow-2xl shadow-purple-600/50"
            >
              <div className="inline-block px-4 py-1 rounded-full bg-purple-600/40 border border-purple-400 text-xs font-bold text-purple-200 uppercase tracking-widest mb-3">
                Bu Juftlik! (It's a Match! 🎉)
              </div>

              <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-300 mb-1">
                Tabriklaymiz!
              </h2>
              <p className="text-xs text-gray-300 mb-6">
                Siz va <span className="font-bold text-white">{matchData.name}</span> bir-biringizni yoqtirdingiz!
              </p>

              {/* OVERLAPPING AVATARS */}
              <div className="flex items-center justify-center -space-x-4 mb-6">
                <div className="w-20 h-20 rounded-full border-4 border-purple-500 overflow-hidden shadow-lg shadow-purple-900/50">
                  <img
                    src={currentUser?.photos?.[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'}
                    alt="You"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-20 h-20 rounded-full border-4 border-fuchsia-500 overflow-hidden shadow-lg shadow-fuchsia-900/50">
                  <img
                    src={matchData.photos?.[0]}
                    alt="Partner"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <button
                  onClick={() => {
                    const p = matchData;
                    setMatchData(null);
                    onOpenChat(p);
                  }}
                  className="w-full bg-purple-gradient text-white font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/50"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Muloqotni boshlash (Chat)</span>
                </button>
                <button
                  onClick={() => setMatchData(null)}
                  className="w-full py-2.5 text-xs text-gray-400 hover:text-white"
                >
                  Tanishuvni davom ettirish
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. VIP PAYWALL MODAL */}
      <VipPaywallModal
        isOpen={paywallOpen}
        onClose={() => setPaywallOpen(false)}
        onOpenShop={onOpenShop}
        title={paywallTitle}
        description={paywallDesc}
      />
    </div>
  );
};

// ==============================================================================
// SWIPEABLE SINGLE CARD WITH FRAMER MOTION GESTURES
// ==============================================================================

interface SwipeCardProps {
  card: any;
  activePhotoIndex: number;
  onPhotoNav: (e: React.MouseEvent, dir: 'next' | 'prev') => void;
  onSwipe: (action: 'like' | 'skip' | 'super_like') => void;
  onOpenBio: () => void;
}

const SwipeCard: React.FC<SwipeCardProps> = ({
  card,
  activePhotoIndex,
  onPhotoNav,
  onSwipe,
  onOpenBio,
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);

  // Stamp Opacities based on drag coordinate
  const likeOpacity = useTransform(x, [20, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-20, -100], [0, 1]);
  const superLikeOpacity = useTransform(y, [-20, -90], [0, 1]);

  const handleDragEnd = (_e: any, info: any) => {
    const threshold = 90;
    if (info.offset.x > threshold) {
      onSwipe('like');
    } else if (info.offset.x < -threshold) {
      onSwipe('skip');
    } else if (info.offset.y < -threshold) {
      onSwipe('super_like');
    }
  };

  const currentPhoto = card.photos?.[activePhotoIndex] || card.photos?.[0];

  return (
    <motion.div
      style={{ x, y, rotate }}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
      className="absolute inset-0 rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing border border-white/10 shadow-2xl bg-black"
    >
      {/* CARD PHOTO */}
      <img
        src={currentPhoto}
        alt={card.name}
        className="w-full h-full object-cover pointer-events-none"
      />

      {/* PHOTO PROGRESS TABS */}
      {card.photos && card.photos.length > 1 && (
        <div className="absolute top-3 inset-x-3 flex gap-1 z-20">
          {card.photos.map((_: any, idx: number) => (
            <div
              key={idx}
              className={`h-1 flex-1 rounded-full transition-all duration-200 ${
                idx === activePhotoIndex ? 'bg-white shadow-sm' : 'bg-black/40'
              }`}
            />
          ))}
        </div>
      )}

      {/* TAP REGIONS FOR PHOTO BROWSING */}
      <div className="absolute inset-0 z-10 flex">
        <div
          onClick={(e) => onPhotoNav(e, 'prev')}
          className="w-1/2 h-full"
        />
        <div
          onClick={(e) => onPhotoNav(e, 'next')}
          className="w-1/2 h-full"
        />
      </div>

      {/* STAMPS: LIKE / NOPE / SUPER LIKE */}
      <motion.div
        style={{ opacity: likeOpacity }}
        className="absolute top-10 left-6 z-30 pointer-events-none border-4 border-green-500 text-green-500 font-black text-2xl px-4 py-1 rounded-2xl rotate-[-15deg] uppercase tracking-wider backdrop-blur-xs bg-black/20"
      >
        LIKE ❤️
      </motion.div>

      <motion.div
        style={{ opacity: nopeOpacity }}
        className="absolute top-10 right-6 z-30 pointer-events-none border-4 border-red-500 text-red-500 font-black text-2xl px-4 py-1 rounded-2xl rotate-[15deg] uppercase tracking-wider backdrop-blur-xs bg-black/20"
      >
        NOPE ❌
      </motion.div>

      <motion.div
        style={{ opacity: superLikeOpacity }}
        className="absolute bottom-32 inset-x-0 mx-auto w-fit z-30 pointer-events-none border-4 border-blue-400 text-blue-400 font-black text-xl px-4 py-1 rounded-2xl uppercase tracking-wider backdrop-blur-xs bg-black/40"
      >
        SUPER LIKE ⭐
      </motion.div>

      {/* GRADIENT OVERLAY */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none z-15" />

      {/* CARD INFO OVERLAY */}
      <div className="absolute inset-x-0 bottom-0 p-5 z-20 flex flex-col justify-end text-white pointer-events-none">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black tracking-tight">{card.name}, {card.age}</h2>
            {card.isVerified && (
              <ShieldCheck className="w-5 h-5 text-purple-400 fill-purple-400/20" />
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenBio();
            }}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center pointer-events-auto transition-transform active:scale-95"
          >
            <Info className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Location & Distance */}
        <div className="flex items-center gap-1.5 text-xs text-gray-300 font-medium mb-2">
          <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
          <span>{card.districtName || 'Toshkent tumani'}</span>
          {card.distanceKm !== undefined && (
            <span className="bg-purple-950/70 border border-purple-600/40 text-purple-300 text-[10px] px-2 py-0.5 rounded-full font-bold ml-1">
              📍 {card.distanceKm} km yaqin
            </span>
          )}
        </div>

        {/* Short Bio snippet */}
        {card.bio && (
          <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">
            {card.bio}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default CardStack;
