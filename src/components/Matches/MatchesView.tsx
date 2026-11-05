import React, { useState, useEffect } from 'react';
import { MessageCircle, Search, ShieldCheck, Heart, Sparkles, ChevronRight } from 'lucide-react';
import { matchesApi } from '../../services/api';

interface MatchesViewProps {
  currentUser: any;
  onSelectChat: (partner: any, matchId: string) => void;
  onExplore: () => void;
}

export const MatchesView: React.FC<MatchesViewProps> = ({ currentUser, onSelectChat, onExplore }) => {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    setLoading(true);
    try {
      const res = await matchesApi.getMatches();
      setMatches(res.matches || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredMatches = matches.filter((m) => {
    const partnerName = m.partner?.name || '';
    return partnerName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="h-full flex flex-col p-4 max-w-md mx-auto select-none overflow-y-auto pb-24">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <span>Muloqotlar</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-900/60 text-purple-300 border border-purple-600/40">
              {matches.length}
            </span>
          </h1>
          <p className="text-xs text-gray-400">
            Bir-biringizni yoqtirgan juftliklar
          </p>
        </div>
      </div>

      {/* SEARCH INPUT */}
      <div className="relative mb-4">
        <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Juftliklar bo'yicha qidiruv..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#18181f] border border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
        />
      </div>

      {/* 1. NEW MATCHES TOP CAROUSEL */}
      {matches.length > 0 && (
        <div className="mb-5">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
            Yangi juftliklar
          </span>
          <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
            {matches.map((m) => (
              <button
                key={`car-${m.matchId}`}
                onClick={() => onSelectChat(m.partner, m.matchId)}
                className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none"
              >
                <div className="w-16 h-16 rounded-full p-0.5 bg-purple-gradient shadow-md shadow-purple-900/40 group-active:scale-95 transition-transform">
                  <div className="w-full h-full rounded-full overflow-hidden border-2 border-black">
                    <img
                      src={m.partner?.photos?.[0]}
                      alt={m.partner?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-gray-200 max-w-[64px] truncate">
                  {m.partner?.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 2. CHAT CONVERSATIONS LIST */}
      <div>
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
          Xabarlar
        </span>

        {loading ? (
          <div className="text-center py-12 text-gray-400">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs">Chatlar yuklanmoqda...</p>
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="text-center py-12 bg-[#16161c] rounded-3xl border border-gray-800 p-6 space-y-3">
            <div className="w-14 h-14 rounded-full bg-purple-950/50 border border-purple-500/40 flex items-center justify-center mx-auto text-purple-400">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-white">Hozircha chatlar mavjud emas</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Anketalarni ko'rib chiqing va like bosing. Har ikkalangiz bir-biringizni yoqtirganingizda shu yerda chat ochiladi!
            </p>
            <button
              onClick={onExplore}
              className="bg-purple-gradient text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md"
            >
              Anketalarni ko'rish
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredMatches.map((m) => (
              <div
                key={m.matchId}
                onClick={() => onSelectChat(m.partner, m.matchId)}
                className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#16161c] border border-gray-800 hover:border-purple-600/40 cursor-pointer active:scale-[0.99] transition-all"
              >
                {/* Partner Avatar */}
                <div className="relative w-13 h-13 rounded-2xl overflow-hidden shrink-0 border border-purple-500/30">
                  <img
                    src={m.partner?.photos?.[0]}
                    alt={m.partner?.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#16161c]" />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-white truncate">
                        {m.partner?.name}, {m.partner?.age}
                      </span>
                      {m.partner?.isVerified && (
                        <ShieldCheck className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      )}
                    </div>
                    <span className="text-[10px] text-gray-500 shrink-0">Hozirgina</span>
                  </div>
                  <p className="text-xs text-gray-400 truncate">
                    {m.lastMessage}
                  </p>
                </div>

                <ChevronRight className="w-4 h-4 text-gray-600 shrink-0" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchesView;
