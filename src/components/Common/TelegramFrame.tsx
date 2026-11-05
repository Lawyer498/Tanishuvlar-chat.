import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, Shield, Sparkles, MessageCircle, ExternalLink } from 'lucide-react';

interface TelegramFrameProps {
  children: React.ReactNode;
}

export const TelegramFrame: React.FC<TelegramFrameProps> = ({ children }) => {
  const [isInsideTelegram, setIsInsideTelegram] = useState(false);
  const [isMobileFrameView, setIsMobileFrameView] = useState(true);

  useEffect(() => {
    // Check if running inside Telegram WebApp
    const tg = (window as any).Telegram?.WebApp;
    if (tg && tg.initData) {
      setIsInsideTelegram(true);
      tg.ready?.();
      tg.expand?.();
      // Set Telegram header and theme colors
      if (tg.setHeaderColor) tg.setHeaderColor('#0f0f0f');
      if (tg.setBackgroundColor) tg.setBackgroundColor('#0f0f0f');
    }
  }, []);

  if (isInsideTelegram) {
    // Direct rendering inside native Telegram WebApp
    return <div className="w-full min-h-screen bg-[#0f0f0f] text-white">{children}</div>;
  }

  // Browser / AI Studio preview rendering:
  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-start p-0 sm:p-4">
      {/* PREVIEW TOOLBAR (Only shown in browser preview) */}
      <div className="w-full max-w-md hidden sm:flex items-center justify-between mb-2 px-3 py-1.5 rounded-xl bg-[#141418] border border-gray-800 text-xs">
        <div className="flex items-center gap-1.5 text-purple-300 font-bold">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span>Telegram Mini App Simulyatori</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMobileFrameView(!isMobileFrameView)}
            className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-gray-300 text-[11px] transition-colors"
          >
            {isMobileFrameView ? <Monitor className="w-3 h-3" /> : <Smartphone className="w-3 h-3" />}
            <span>{isMobileFrameView ? 'Keng ekran' : 'Telefon korpusi'}</span>
          </button>
        </div>
      </div>

      {/* CONTAINER */}
      <div
        className={`w-full ${
          isMobileFrameView
            ? 'max-w-md h-[100dvh] sm:h-[860px] sm:rounded-[36px] sm:border-[5px] sm:border-[#22222a] sm:shadow-[0_0_50px_rgba(138,43,226,0.2)]'
            : 'max-w-2xl min-h-screen'
        } bg-[#0f0f0f] flex flex-col overflow-hidden relative`}
      >
        {/* TELEGRAM MINI APP NATIVE-LOOK HEADER */}
        <div className="px-4 py-2.5 bg-[#121216] border-b border-gray-800/80 flex items-center justify-between shrink-0 select-none">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-purple-gradient flex items-center justify-center font-black text-xs text-white shadow-sm">
              T
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-white">Tanishuv UZ</span>
                <span className="text-[10px] bg-purple-950/80 text-purple-300 px-1.5 py-0.2 rounded font-medium border border-purple-800/50">
                  Bot
                </span>
              </div>
              <p className="text-[10px] text-gray-400">bot</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-400 text-xs">
            <span className="w-2 h-2 rounded-full bg-green-500" title="Online" />
            <span className="text-[11px] text-gray-400">🇺🇿 O'zbekiston</span>
          </div>
        </div>

        {/* APP CONTENT */}
        <div className="flex-1 overflow-y-auto relative bg-[#0f0f0f]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default TelegramFrame;
