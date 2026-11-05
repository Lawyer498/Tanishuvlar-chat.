import React, { useState, useEffect } from 'react';
import { Heart, Lock, Crown, ShieldCheck, Sparkles, MapPin } from 'lucide-react';
import { matchesApi } from '../../services/api';

interface LikesViewProps {
  currentUser: any;
  onOpenShop: () => void;
  onOpenChat: (partner: any) => void;
}

export const LikesView: React.FC<LikesViewProps> = ({ currentUser, onOpenShop, onOpenChat }) => {
  const [likes, setLikes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLikes();
  }, []);

  const loadLikes = async () => {
    setLoading(true);
    try {
      const res = await matchesApi.getLikes();
      setLikes(res.likes || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isVip = currentUser?.isVip;

  return (
    <div className="h-full flex flex-col p-4 max-w-md mx-auto select-none overflow-y-auto pb-24">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <span>Like'larim</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-900/60 text-purple-300 border border-purple-600/40">
              {likes.length}
            </span>
          </h1>
          <p className="text-xs text-gray-400">
            Sizga qiziqish bildirgan va like bosgan insonlar
          </p>
        </div>

        {!isVip && (
          <button
            onClick={onOpenShop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-gradient text-white text-xs font-bold shadow-lg shadow-purple-600/30"
          >
            <Crown className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300" />
            <span>VIP bilan ochish</span>
          </button>
        )}
      </div>

      {/* VIP PROMOTION BANNER FOR FREE USERS */}
      {!isVip && (
        <div className="mb-4 p-4 rounded-2xl bg-gradient-to-r from-purple-950/70 to-[#1e142b] border border-purple-600/40 shadow-xl relative overflow-hidden">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/30 flex items-center justify-center shrink-0 border border-purple-500/50">
              <Lock className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white mb-1">
                Sizni kimlar yoqtirganini bilmoqchimisiz?
              </h3>
              <p className="text-[11px] text-gray-300 leading-relaxed mb-3">
                Oddiy rejimda fotosuratlar xiralashtirilgan. VIP a'zolar esa anketalarni to'liq ko'rib, darhol suhbat boshlashlari mumkin!
              </p>
              <button
                onClick={onOpenShop}
                className="bg-purple-gradient text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Barcha {likes.length} ta anketani ochish</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LIKES GRID */}
      {loading ? (
        <div className="text-center py-16 text-gray-400">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs">Yuklanmoqda...</p>
        </div>
      ) : likes.length === 0 ? (
        <div className="text-center py-16 bg-[#16161c] rounded-3xl border border-gray-800 p-6 space-y-3">
          <div className="w-14 h-14 rounded-full bg-purple-950/50 border border-purple-500/40 flex items-center justify-center mx-auto text-purple-400">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-white">Hozircha like'lar yo'q</h3>
          <p className="text-xs text-gray-400">
            Profilingizga yaxshiroq suratlar qo'shing yoki "Top Boost" orqali e'tiborni oshiring!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {likes.map((liker) => (
            <div
              key={liker.id}
              onClick={() => {
                if (isVip) {
                  onOpenChat(liker);
                } else {
                  onOpenShop();
                }
              }}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden border border-gray-800 bg-[#16161c] cursor-pointer shadow-lg hover:border-purple-500/60 transition-all"
            >
              {/* Photo (Blurred if free user, clear if VIP) */}
              <img
                src={liker.photos?.[0]}
                alt={liker.name}
                className={`w-full h-full object-cover transition-all duration-300 ${
                  isVip ? 'group-hover:scale-105' : 'blur-md scale-110 filter'
                }`}
              />

              {/* LOCK OVERLAY FOR FREE USERS */}
              {!isVip && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex flex-col items-center justify-center p-3 text-center">
                  <div className="w-9 h-9 rounded-full bg-purple-900/80 border border-purple-500/60 flex items-center justify-center text-white mb-2 shadow-lg">
                    <Lock className="w-4 h-4 text-purple-200" />
                  </div>
                  <span className="text-[11px] font-bold text-white">Ko'rish uchun VIP</span>
                </div>
              )}

              {/* GRADIENT OVERLAY */}
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

              {/* INFO BADGE */}
              <div className="absolute inset-x-0 bottom-0 p-3 z-10 text-white">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-sm">
                    {isVip ? `${liker.name}, ${liker.age}` : `${liker.name[0]}***, ${liker.age}`}
                  </span>
                  {liker.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-gray-300 mt-0.5">
                  <MapPin className="w-3 h-3 text-purple-400" />
                  <span className="truncate">{liker.districtName || liker.regionName}</span>
                </div>
              </div>

              {/* SUPER LIKE BADGE IF APPLICABLE */}
              {liker.isSuperLike && (
                <div className="absolute top-2 left-2 bg-blue-600/90 text-[10px] font-extrabold px-2 py-0.5 rounded-md text-white shadow-md">
                  ⭐ Super Like
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LikesView;
