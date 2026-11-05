/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { authApi, profileApi, matchesApi } from './services/api';
import TelegramFrame from './components/Common/TelegramFrame';
import CardStack from './components/Discovery/CardStack';
import LikesView from './components/Likes/LikesView';
import MatchesView from './components/Matches/MatchesView';
import ProfileView from './components/Profile/ProfileView';
import ChatView from './components/Chat/ChatView';
import OnboardingWizard from './components/Onboarding/OnboardingWizard';
import BottomNav, { NavigationTab } from './components/Navigation/BottomNav';

export default function App() {
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<NavigationTab>('discovery');
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Active Chat State
  const [activeChat, setActiveChat] = useState<{ partner: any; matchId: string } | null>(null);

  // Badge counts
  const [likesCount, setLikesCount] = useState(0);
  const [matchesCount, setMatchesCount] = useState(0);

  // Auto-open VIP shop flag when triggered from Discovery / Likes
  const [defaultOpenShop, setDefaultOpenShop] = useState(false);

  useEffect(() => {
    initApp();
  }, []);

  const initApp = async () => {
    setLoading(true);
    try {
      // Login or identify user via Telegram initData
      const authRes = await authApi.login();
      if (authRes.user) {
        setCurrentUser(authRes.user);
      }
      // Load badges
      refreshCounts();
    } catch (err) {
      console.error("Initialization error:", err);
    } finally {
      setLoading(false);
    }
  };

  const refreshCounts = async () => {
    try {
      const [likesRes, matchesRes] = await Promise.all([
        matchesApi.getLikes().catch(() => ({ likes: [] })),
        matchesApi.getMatches().catch(() => ({ matches: [] })),
      ]);
      setLikesCount(likesRes.likes?.length || 0);
      setMatchesCount(matchesRes.matches?.length || 0);
    } catch (e) {
      // Ignore
    }
  };

  const handleOpenShop = () => {
    setDefaultOpenShop(true);
    setActiveTab('profile');
  };

  const handleOpenChat = (partner: any, matchId?: string) => {
    setActiveChat({
      partner,
      matchId: matchId || `match-${Date.now()}`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col items-center justify-center p-4">
        <div className="w-14 h-14 rounded-2xl bg-purple-gradient p-0.5 shadow-xl shadow-purple-600/40 animate-pulse mb-4">
          <div className="w-full h-full bg-[#121216] rounded-2xl flex items-center justify-center font-black text-2xl text-purple-400">
            T
          </div>
        </div>
        <h2 className="text-lg font-bold tracking-tight text-white mb-1">Tanishuv UZ</h2>
        <p className="text-xs text-gray-400">Telegram Mini App ishga tushmoqda...</p>
      </div>
    );
  }

  // If profile not completed or user explicitly wants to edit onboarding
  if (!currentUser?.profileCompleted || isEditingProfile) {
    return (
      <TelegramFrame>
        <OnboardingWizard
          initialUser={currentUser}
          onComplete={(updatedUser) => {
            setCurrentUser(updatedUser);
            setIsEditingProfile(false);
            refreshCounts();
          }}
        />
      </TelegramFrame>
    );
  }

  return (
    <TelegramFrame>
      <div className="relative h-full flex flex-col justify-between">
        {/* MAIN TAB CONTENT */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'discovery' && (
            <CardStack
              currentUser={currentUser}
              onOpenShop={handleOpenShop}
              onOpenChat={(partner) => handleOpenChat(partner)}
            />
          )}

          {activeTab === 'likes' && (
            <LikesView
              currentUser={currentUser}
              onOpenShop={handleOpenShop}
              onOpenChat={(partner) => handleOpenChat(partner)}
            />
          )}

          {activeTab === 'matches' && (
            <MatchesView
              currentUser={currentUser}
              onSelectChat={(partner, matchId) => handleOpenChat(partner, matchId)}
              onExplore={() => setActiveTab('discovery')}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileView
              currentUser={currentUser}
              onUpdateUser={(updated) => setCurrentUser(updated)}
              onEditProfile={() => setIsEditingProfile(true)}
              defaultOpenShop={defaultOpenShop}
            />
          )}
        </div>

        {/* ACTIVE CHAT OVERLAY */}
        {activeChat && (
          <ChatView
            partner={activeChat.partner}
            matchId={activeChat.matchId}
            currentUser={currentUser}
            onBack={() => {
              setActiveChat(null);
              refreshCounts();
            }}
          />
        )}

        {/* FIXED BOTTOM NAVIGATION */}
        <BottomNav
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            if (tab !== 'profile') setDefaultOpenShop(false);
          }}
          likesCount={likesCount}
          matchesCount={matchesCount}
        />
      </div>
    </TelegramFrame>
  );
}
