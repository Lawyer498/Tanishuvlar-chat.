import React from 'react';
import { Flame, Heart, MessageCircle, User } from 'lucide-react';

export type NavigationTab = 'discovery' | 'likes' | 'matches' | 'profile';

interface BottomNavProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  likesCount?: number;
  matchesCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  likesCount = 0,
  matchesCount = 0,
}) => {
  const tabs = [
    {
      id: 'discovery' as NavigationTab,
      label: 'Anketalar',
      icon: Flame,
      badge: null,
    },
    {
      id: 'likes' as NavigationTab,
      label: "Like'larim",
      icon: Heart,
      badge: likesCount > 0 ? likesCount : null,
    },
    {
      id: 'matches' as NavigationTab,
      label: 'Chatlar',
      icon: MessageCircle,
      badge: matchesCount > 0 ? matchesCount : null,
    },
    {
      id: 'profile' as NavigationTab,
      label: 'Profil',
      icon: User,
      badge: null,
    },
  ];

  return (
    <div className="fixed bottom-0 inset-x-0 z-30 max-w-md mx-auto bg-[#121216]/95 backdrop-blur-xl border-t border-gray-800/80 px-2 py-2 select-none">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 relative flex flex-col items-center justify-center py-1.5 px-2 rounded-2xl transition-all ${
                isActive ? 'text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive
                      ? 'stroke-[2.5] text-purple-400 scale-110 drop-shadow-[0_0_8px_rgba(138,43,226,0.6)]'
                      : 'stroke-[1.8]'
                  } ${isActive && tab.id === 'likes' ? 'fill-purple-400' : ''}`}
                />

                {tab.badge !== null && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-purple-600 text-white text-[9px] font-extrabold flex items-center justify-center shadow-md">
                    {tab.badge}
                  </span>
                )}
              </div>

              <span
                className={`text-[11px] font-semibold mt-1 transition-colors ${
                  isActive ? 'text-white font-bold' : 'text-gray-400'
                }`}
              >
                {tab.label}
              </span>

              {/* ACTIVE GLOW PILL */}
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-0.5 shadow-[0_0_6px_#8A2BE2]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
