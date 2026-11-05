import React, { useState, useEffect } from 'react';
import { 
  Crown, Coins, Share2, Copy, Check, Sparkles, Zap, Heart, 
  MapPin, ShieldCheck, ChevronRight, CreditCard, ExternalLink, RefreshCw, 
  Settings, UserCheck, Terminal, AlertTriangle
} from 'lucide-react';
import { profileApi, referralApi, paymentsApi, api } from '../../services/api';

interface ProfileViewProps {
  currentUser: any;
  onUpdateUser: (user: any) => void;
  onEditProfile: () => void;
  defaultOpenShop?: boolean;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ 
  currentUser, 
  onUpdateUser, 
  onEditProfile,
  defaultOpenShop = false 
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'vip' | 'wallet' | 'referral' | 'admin'>(
    defaultOpenShop ? 'vip' : 'profile'
  );

  // VIP Shop state
  const [selectedPlan, setSelectedPlan] = useState<'1w' | '1m' | '3m' | '1y'>('3m');
  const [selectedMethod, setSelectedMethod] = useState<'payme' | 'click' | 'stars'>('payme');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState('');
  const [paymentErrorMsg, setPaymentErrorMsg] = useState('');

  // Referral state
  const [refStats, setRefStats] = useState<any>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [redeemNotice, setRedeemNotice] = useState<string | null>(null);
  const [redeemError, setRedeemError] = useState<string | null>(null);

  // Load latest stats
  useEffect(() => {
    loadReferralStats();
  }, []);

  const loadReferralStats = async () => {
    try {
      const res = await referralApi.getStats();
      setRefStats(res);
    } catch (err) {
      console.error(err);
    }
  };

  const copyReferralLink = () => {
    const link = refStats?.referralLink || `https://t.me/TanishuvUzBot?start=ref_${currentUser?.referralCode}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // VIP PRICING PLANS
  const VIP_PLANS = [
    {
      id: '1w',
      title: '1 Hafta',
      days: 7,
      priceUsd: 0.99,
      priceUzs: 12000,
      priceStars: 50,
      badge: null,
    },
    {
      id: '1m',
      title: '1 Oy',
      days: 30,
      priceUsd: 2.49,
      priceUzs: 30000,
      priceStars: 130,
      badge: 'Ommabop',
    },
    {
      id: '3m',
      title: '3 Oy',
      days: 90,
      priceUsd: 5.99,
      priceUzs: 75000,
      priceStars: 300,
      badge: '⭐ Eng foydali (Best Value)',
      highlight: true,
    },
    {
      id: '1y',
      title: '1 Yil',
      days: 365,
      priceUsd: 14.99,
      priceUzs: 185000,
      priceStars: 750,
      badge: 'Maksimal tejov',
    },
  ];

  const handleCheckout = async () => {
    setIsProcessingPayment(true);
    setPaymentSuccessMsg('');
    setPaymentErrorMsg('');

    const plan = VIP_PLANS.find(p => p.id === selectedPlan)!;

    try {
      // 1. Create Invoice via backend
      const invoice = await paymentsApi.createInvoice({
        planId: plan.id,
        paymentMethod: selectedMethod,
        amountUzs: plan.priceUzs,
        amountUsd: plan.priceUsd,
        currency: selectedMethod === 'stars' ? 'XTR' : 'UZS',
        vipDurationDays: plan.days,
      });

      // 2. Simulate Webhook confirmation for instant VIP activation
      const webhookRes = await paymentsApi.simulateWebhook(invoice.transactionId);
      if (webhookRes.user) {
        onUpdateUser(webhookRes.user);
        setPaymentSuccessMsg(`🎉 Tabriklaymiz! ${plan.title} VIP obunasi muvaffaqiyatli faollashtirildi!`);
      }
    } catch (err: any) {
      setPaymentErrorMsg(err.response?.data?.error || "To'lov jarayonida xatolik yuz berdi.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleRedeem = async (type: 'boost' | 'likes') => {
    setRedeemNotice(null);
    setRedeemError(null);
    try {
      const res = await referralApi.redeem(type);
      setRedeemNotice(res.message);
      // Reload profile to refresh coin balance
      const me = await profileApi.getMe();
      if (me.user) onUpdateUser(me.user);
      loadReferralStats();
    } catch (err: any) {
      setRedeemError(err.response?.data?.error || "Tanga yetarli emas!");
    }
  };

  // Developer simulation helper: toggle VIP directly for instant testing
  const handleToggleVip = async () => {
    try {
      const res = await api.post('/dev/toggle-vip');
      if (res.data.user) onUpdateUser(res.data.user);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddCoins = async () => {
    try {
      const res = await api.post('/dev/add-coins');
      if (res.data.user) onUpdateUser(res.data.user);
      loadReferralStats();
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetLikes = async () => {
    try {
      const res = await api.post('/dev/reset-likes');
      if (res.data.user) onUpdateUser(res.data.user);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="h-full flex flex-col p-4 max-w-md mx-auto select-none overflow-y-auto pb-24">
      {/* 1. PROFILE HEADER CARD */}
      <div className="p-4 rounded-3xl bg-[#16161c] border border-gray-800 shadow-xl mb-4 relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-purple-500/50 shrink-0">
            <img
              src={currentUser?.photos?.[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'}
              alt={currentUser?.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <h2 className="text-base font-bold text-white truncate">
                {currentUser?.name}, {currentUser?.age}
              </h2>
              {currentUser?.isVerified && (
                <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" />
              )}
            </div>

            <div className="flex items-center gap-1 text-xs text-gray-400">
              <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span className="truncate">{currentUser?.districtName || 'Toshkent'}</span>
            </div>

            {/* VIP Status line */}
            <div className="mt-1.5 flex items-center gap-2">
              {currentUser?.isVip ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <Crown className="w-3 h-3 fill-amber-400" />
                  VIP Faol (Cheksiz like)
                </span>
              ) : (
                <span className="text-[11px] text-gray-500">
                  Bepul obuna ({currentUser?.dailyLikesCount || 0}/20 like)
                </span>
              )}
            </div>
          </div>

          <button
            onClick={onEditProfile}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 transition-colors"
            title="Profilni tahrirlash"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* STATS STRIP: Coins, Likes, Matches */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-gray-800 text-center">
          <div className="bg-[#121216] p-2 rounded-xl">
            <span className="text-[10px] text-gray-400 block">Tangalar</span>
            <span className="text-xs font-bold text-yellow-400 flex items-center justify-center gap-1">
              <Coins className="w-3 h-3" />
              {currentUser?.coins || 0}
            </span>
          </div>

          <div className="bg-[#121216] p-2 rounded-xl">
            <span className="text-[10px] text-gray-400 block">Kunlik like</span>
            <span className="text-xs font-bold text-purple-300">
              {currentUser?.isVip ? 'Cheksiz' : `${20 - (currentUser?.dailyLikesCount || 0)} ta qoldi`}
            </span>
          </div>

          <div className="bg-[#121216] p-2 rounded-xl">
            <span className="text-[10px] text-gray-400 block">ID raqam</span>
            <span className="text-xs font-mono font-bold text-gray-300">
              #{currentUser?.telegramId || '999888'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. SUB-NAVIGATION TABS */}
      <div className="flex items-center gap-1.5 bg-[#16161c] p-1.5 rounded-2xl border border-gray-800 mb-4 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('vip')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all whitespace-nowrap ${
            activeTab === 'vip'
              ? 'bg-purple-gradient text-white shadow-md'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Crown className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300" />
          <span>VIP Magazin</span>
        </button>

        <button
          onClick={() => setActiveTab('wallet')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all whitespace-nowrap ${
            activeTab === 'wallet'
              ? 'bg-purple-gradient text-white shadow-md'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Coins className="w-3.5 h-3.5 text-yellow-400" />
          <span>Tanga hamyon</span>
        </button>

        <button
          onClick={() => setActiveTab('referral')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all whitespace-nowrap ${
            activeTab === 'referral'
              ? 'bg-purple-gradient text-white shadow-md'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Referral</span>
        </button>

        <button
          onClick={() => setActiveTab('admin')}
          className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all ${
            activeTab === 'admin'
              ? 'bg-purple-gradient text-white'
              : 'text-gray-400 hover:text-white'
          }`}
          title="Boshqaruv / VPS"
        >
          <Terminal className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* TAB CONTENT: VIP SHOP */}
      {activeTab === 'vip' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-1.5">
              <Crown className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span>VIP Obuna tariflari</span>
            </h3>
            <p className="text-xs text-gray-400">
              Cheksiz like, jins bo'yicha saralash va sizni yoqtirganlarni ochiq ko'rish imkoniyati!
            </p>
          </div>

          {/* PRICING CARDS */}
          <div className="grid grid-cols-2 gap-2.5">
            {VIP_PLANS.map((plan) => {
              const isSelected = selectedPlan === plan.id;
              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id as any)}
                  className={`relative p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-purple-950/40 border-purple-500 shadow-lg shadow-purple-900/40'
                      : 'bg-[#16161c] border-gray-800 hover:border-gray-700'
                  } ${plan.highlight ? 'ring-1 ring-purple-500/50' : ''}`}
                >
                  {plan.badge && (
                    <span className="absolute -top-2.5 left-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-[9px] font-extrabold text-white px-2 py-0.5 rounded-full shadow-md">
                      {plan.badge}
                    </span>
                  )}

                  <h4 className="text-xs font-bold text-white mt-1 mb-1">{plan.title}</h4>
                  <div className="text-base font-black text-white">
                    ${plan.priceUsd}
                  </div>
                  <div className="text-[11px] text-gray-400 font-medium">
                    {plan.priceUzs.toLocaleString()} so'm
                  </div>
                  <div className="text-[10px] text-yellow-400/90 font-medium mt-1">
                    ⭐ {plan.priceStars} Stars (XTR)
                  </div>
                </div>
              );
            })}
          </div>

          {/* PAYMENT METHOD SELECTOR - PAYME FOCUSED */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                To'lov tizimi (Asosiy: Payme)
              </span>
              <span className="text-[10px] text-cyan-400 font-bold bg-cyan-950/60 border border-cyan-800/50 px-2 py-0.5 rounded-full">
                Uzcard & Humo
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => setSelectedMethod('payme')}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                  selectedMethod === 'payme'
                    ? 'bg-gradient-to-r from-[#112435] to-[#181822] border-cyan-400 text-white shadow-lg shadow-cyan-950/50'
                    : 'bg-[#16161c] border-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center font-black text-cyan-400 text-sm">
                    P
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>Payme to'lov tizimi</span>
                      <span className="text-[9px] bg-cyan-500 text-black font-extrabold px-1.5 py-0.2 rounded">TAVSIYA ETILADI</span>
                    </div>
                    <span className="text-[11px] text-gray-400">O'zbekistonning barcha Uzcard va Humo kartalari</span>
                  </div>
                </div>
                <div className="w-5 h-5 rounded-full border border-cyan-400 flex items-center justify-center bg-cyan-400 text-black">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </button>

              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('click')}
                  className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                    selectedMethod === 'click'
                      ? 'bg-[#182740] border-blue-400 text-white shadow-md'
                      : 'bg-[#16161c] border-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-blue-400">Click Up</div>
                    <span className="text-[10px] text-gray-400">Uzcard / Humo</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('stars')}
                  className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                    selectedMethod === 'stars'
                      ? 'bg-[#2b2416] border-yellow-400 text-white shadow-md'
                      : 'bg-[#16161c] border-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-yellow-400">Telegram Stars</div>
                    <span className="text-[10px] text-gray-400">⭐ XTR</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* CHECKOUT ACTION */}
          <button
            onClick={handleCheckout}
            disabled={isProcessingPayment}
            className="w-full bg-purple-gradient hover:opacity-95 text-white font-black py-4 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-purple-600/40 text-sm transition-all disabled:opacity-50"
          >
            <Crown className="w-4 h-4 fill-yellow-300 text-yellow-300" />
            <span>
              {isProcessingPayment
                ? "To'lov tekshirilmoqda..."
                : `${selectedMethod.toUpperCase()} orqali to'lash ($${VIP_PLANS.find(p => p.id === selectedPlan)?.priceUsd})`}
            </span>
          </button>

          {paymentSuccessMsg && (
            <div className="p-3 rounded-xl bg-green-950/60 border border-green-700 text-green-300 text-xs text-center font-medium">
              {paymentSuccessMsg}
            </div>
          )}

          {paymentErrorMsg && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-700 text-red-300 text-xs text-center font-medium">
              {paymentErrorMsg}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: COIN WALLET */}
      {activeTab === 'wallet' && (
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-gradient-to-br from-purple-950/40 to-[#181822] border border-purple-500/30 text-center">
            <Coins className="w-10 h-10 text-yellow-400 mx-auto mb-2" />
            <span className="text-xs text-gray-400">Mavjud tangalar balansi</span>
            <div className="text-3xl font-black text-yellow-400 my-1">
              {currentUser?.coins || 0} <span className="text-sm font-normal text-gray-300">tanga</span>
            </div>
            <p className="text-[11px] text-gray-400 max-w-xs mx-auto">
              Do'stlaringizni taklif qilib yoki maxsus aksiyalarda qatnashib bepul tangalar to'plang!
            </p>
          </div>

          {/* REDEEM OPTIONS */}
          <div>
            <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
              Tangalarni xizmatlarga almashtirish:
            </h4>
            <div className="space-y-2.5">
              {/* Option 1: Boost */}
              <div className="p-3.5 rounded-2xl bg-[#16161c] border border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-900/50 flex items-center justify-center text-purple-400">
                    <Zap className="w-5 h-5 fill-purple-400" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">Top Profile Boost (1 kun)</h5>
                    <p className="text-[10px] text-gray-400">Profilingiz 24 soatga birinchi o'ringa ko'tariladi</p>
                  </div>
                </div>
                <button
                  onClick={() => handleRedeem('boost')}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shrink-0 transition-all shadow-md"
                >
                  50 tanga
                </button>
              </div>

              {/* Option 2: +5 Likes */}
              <div className="p-3.5 rounded-2xl bg-[#16161c] border border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-green-900/50 flex items-center justify-center text-green-400">
                    <Heart className="w-5 h-5 fill-green-400" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">+5 ta Qo'shimcha Like</h5>
                    <p className="text-[10px] text-gray-400">Kunlik limit tugaganda qo'shimcha like'lar</p>
                  </div>
                </div>
                <button
                  onClick={() => handleRedeem('likes')}
                  className="px-3 py-1.5 rounded-xl bg-green-600 hover:bg-green-500 text-white text-xs font-bold shrink-0 transition-all shadow-md"
                >
                  20 tanga
                </button>
              </div>

              {/* SPECIFIC BUSINESS RULE NOTICE: DO NOT ALLOW REDEEMING COINS FOR VIP */}
              <div className="p-3 rounded-2xl bg-amber-950/20 border border-amber-800/40 flex items-center gap-2 text-[11px] text-amber-300">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                <span>Qoida: Tangalarni VIP obunasiga almashtirib bo'lmaydi. VIP faqat to'lov orqali olinadi.</span>
              </div>
            </div>
          </div>

          {redeemNotice && (
            <div className="p-3 rounded-xl bg-green-950/60 border border-green-700 text-green-300 text-xs text-center font-medium">
              {redeemNotice}
            </div>
          )}

          {redeemError && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-700 text-red-300 text-xs text-center font-medium">
              {redeemError}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: REFERRAL SYSTEM */}
      {activeTab === 'referral' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white mb-1">Referral dasturi 🎁</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Do'stlaringizni taklif qiling va ikkalangiz ham bepul tangalarga ega bo'ling!
            </p>
          </div>

          {/* REFERRAL LINK BOX */}
          <div className="p-4 rounded-2xl bg-[#16161c] border border-gray-800 space-y-3">
            <span className="text-[11px] font-semibold text-gray-400 uppercase">
              Sizning maxsus taklif havolangiz:
            </span>
            <div className="flex items-center gap-2 bg-[#101014] p-2.5 rounded-xl border border-gray-800">
              <span className="text-xs text-purple-300 font-mono truncate flex-1">
                {refStats?.referralLink || `https://t.me/TanishuvUzBot?start=ref_${currentUser?.referralCode}`}
              </span>
              <button
                onClick={copyReferralLink}
                className="p-2 rounded-lg bg-purple-600/80 hover:bg-purple-600 text-white shrink-0 transition-colors"
                title="Nusxa olish"
              >
                {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {copiedLink && (
              <span className="text-[11px] text-green-400 font-medium block text-center">
                Havola nusxalandi! Do'stlaringizga yuboring.
              </span>
            )}

            <a
              href={`https://t.me/share/url?url=${encodeURIComponent(refStats?.referralLink || `https://t.me/TanishuvUzBot?start=ref_${currentUser?.referralCode}`)}&text=${encodeURIComponent("O'zbekiston bo'ylab o'zingizga yaqin joydan suhbatdosh topish uchun eng ajoyib tanlov! Tanishuv UZ ga qo'shiling 🌟")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Telegram orqali ulashish</span>
            </a>
          </div>

          {/* RULES CARD */}
          <div className="p-4 rounded-2xl bg-[#16161c] border border-purple-900/30 space-y-2 text-xs text-gray-300">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Bonus olish shartlari:</span>
            </h4>
            <ul className="space-y-1.5 text-[11px] text-gray-400 list-disc list-inside">
              <li>Do'stingiz havola orqali botga kirishi va profilini to'ldirishi kerak.</li>
              <li>Feyk hisoblarning oldini olish uchun, do'stingiz <b>kamida 3 ta like</b> bosishi shart.</li>
              <li>Shart bajarilgach, sizga <b className="text-yellow-400">50 tanga</b>, do'stingizga esa <b className="text-yellow-400">20 tanga</b> taqdim etiladi!</li>
            </ul>
          </div>
        </div>
      )}

      {/* TAB CONTENT: ADMIN / VPS DEPLOYMENT & DEV TOOLS */}
      {activeTab === 'admin' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-purple-400" />
              <span>Dev & VPS Boshqaruvi</span>
            </h3>
            <p className="text-xs text-gray-400">
              Ilovani test qilish va VPS serverga deploy qilish bo'yicha ko'rsatmalar.
            </p>
          </div>

          {/* ADMIN PROFILE CARD */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/60 to-[#1e142b] border border-purple-500/40 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                <span>Bosh Admin Profili</span>
              </span>
              <span className="text-[10px] bg-green-500/20 text-green-300 border border-green-500/40 px-2 py-0.5 rounded-full font-bold">
                Ulangan
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
              <div className="bg-black/40 p-2 rounded-xl">
                <span className="text-gray-400 block text-[10px]">Admin Telegram ID:</span>
                <span className="font-mono font-bold text-yellow-400">8652976161</span>
              </div>
              <div className="bg-black/40 p-2 rounded-xl">
                <span className="text-gray-400 block text-[10px]">To'lov integratsiyasi:</span>
                <span className="font-bold text-cyan-400">Payme (Asosiy)</span>
              </div>
            </div>
            <div className="text-[11px] text-gray-300 bg-black/30 p-2.5 rounded-xl border border-gray-800">
              <span className="text-gray-400 block text-[10px] mb-1">Bot orqali boshqaruv buyruqlari:</span>
              <div className="font-mono text-[10px] text-purple-300 space-y-0.5">
                <div>/admin - Boshqaruv paneli</div>
                <div>/stats - Statistika va tushumlar</div>
                <div>/give_vip &lt;id&gt; &lt;kun&gt; - VIP berish</div>
                <div>/ban_user &lt;id&gt; - Bloklash</div>
              </div>
            </div>
          </div>

          {/* TEST CONTROLS */}
          <div className="p-4 rounded-2xl bg-[#16161c] border border-gray-800 space-y-3">
            <span className="text-xs font-bold text-white block">Tezkor test tugmalari:</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleToggleVip}
                className="py-2.5 px-3 rounded-xl bg-purple-950/60 border border-purple-600/40 text-purple-300 text-xs font-bold hover:bg-purple-900/60"
              >
                {currentUser?.isVip ? "VIP ni o'chirish" : "VIP ni yoqish"}
              </button>
              <button
                onClick={handleAddCoins}
                className="py-2.5 px-3 rounded-xl bg-yellow-950/60 border border-yellow-600/40 text-yellow-300 text-xs font-bold hover:bg-yellow-900/60"
              >
                +50 Tanga qo'shish
              </button>
              <button
                onClick={handleResetLikes}
                className="col-span-2 py-2.5 px-3 rounded-xl bg-gray-800 text-gray-200 text-xs font-bold hover:bg-gray-700"
              >
                Kunlik like hisoblagichini 0 ga tushirish
              </button>
            </div>
          </div>

          {/* VPS SETUP INSTRUCTIONS */}
          <div className="p-4 rounded-2xl bg-[#16161c] border border-gray-800 space-y-2 text-xs text-gray-300">
            <span className="font-bold text-white block">VPS da ishga tushirish (Tayyor parametrlar):</span>
            <div className="bg-black/50 p-2.5 rounded-xl font-mono text-[10px] text-purple-300 space-y-1">
              <div># 1. PostgreSQL ma'lumotlar bazasini yuklash:</div>
              <div className="text-gray-400">psql -U postgres -d tanishuv_db -f schema.sql</div>
              <div className="mt-1"># 2. .env fayliga kiritilgan sozlamalar:</div>
              <div className="text-cyan-400">TELEGRAM_BOT_TOKEN="9090819369:AAEtIABJzNX_Ywr03S1NoB8cc9h0osTbceE"</div>
              <div className="text-yellow-400">ADMIN_TELEGRAM_ID="8652976161"</div>
              <div className="text-gray-400">PAYME_MERCHANT_ID="6510a123"</div>
              <div className="mt-1"># 3. PM2 orqali ishga tushirish:</div>
              <div className="text-gray-400">npm run build && pm2 start server.ts --name tanishuv</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileView;
