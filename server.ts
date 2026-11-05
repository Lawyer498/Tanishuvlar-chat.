/**
 * @file server.ts
 * Tanishuv UZ - Express Backend & Telegram Bot Server
 * Implements high-load dating application architecture with location sorting,
 * VIP paywall rules, Payme/Click/Telegram Stars payment webhooks,
 * referral validation, and Telegram WebApp integration.
 */

import express, { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { INITIAL_PROFILES, UserProfile } from './src/data/mockProfiles.ts';
import { calculateDistanceKm, REGIONS, DISTRICTS } from './src/data/locations.ts';
import { createTelegramBot } from './bot.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || process.env.BOT_TOKEN || '';

app.use(express.json());

// ==============================================================================
// IN-MEMORY / PERSISTENT DATA LAYER (Mirrors PostgreSQL schema.sql)
// ==============================================================================

interface InteractionRecord {
  actorId: string;
  targetId: string;
  action: 'like' | 'skip' | 'super_like';
  createdAt: string;
}

interface MatchRecord {
  id: string;
  user1Id: string;
  user2Id: string;
  matchedAt: string;
  isActive: boolean;
}

interface MessageRecord {
  id: string;
  matchId: string;
  senderId: string;
  text: string;
  createdAt: string;
}

interface TransactionRecord {
  id: string;
  userId: string;
  amountUsd: number;
  amountUzs: number;
  currency: 'USD' | 'UZS' | 'XTR';
  paymentMethod: 'payme' | 'click' | 'stars';
  status: 'pending' | 'success' | 'failed';
  vipDurationDays: number;
  coinsCount: number;
  createdAt: string;
}

// Global state stores (initialized with seed data)
const usersStore: Map<string, UserProfile> = new Map();
const interactionsStore: InteractionRecord[] = [];
const matchesStore: MatchRecord[] = [];
const messagesStore: MessageRecord[] = [];
const transactionsStore: TransactionRecord[] = [];
const referralsStore: { referrerId: string; invitedUserId: string; rewarded: boolean; createdAt: string }[] = [];

// Seed users
INITIAL_PROFILES.forEach((u) => {
  usersStore.set(u.id, { ...u });
});

// Default current session user (for testing/browser mode if no Telegram initData provided)
let currentSessionUserId = 'user-current-session';

function getOrCreateSessionUser(telegramUser?: { id: number; first_name?: string; last_name?: string; username?: string }) {
  const tgId = telegramUser?.id || 999888777;
  const existing = Array.from(usersStore.values()).find((u) => u.telegramId === tgId);
  if (existing) {
    return existing;
  }

  const newProfile: UserProfile = {
    id: currentSessionUserId,
    telegramId: tgId,
    username: telegramUser?.username || 'azizbek_uz',
    name: telegramUser?.first_name || 'Azizbek',
    age: 23,
    gender: 'male',
    bio: "Salom! Tanishuv UZ orqali yangi do'stlar va qiziqarli suhbatdosh qidiryapman ✨",
    photos: [
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80"
    ],
    isVerified: true,
    profileCompleted: true,
    republic: 'uzbekistan',
    regionId: 10,
    regionName: 'Toshkent shahri',
    districtId: 101,
    districtName: 'Yunusobod tumani',
    latitude: 41.3650,
    longitude: 69.2890,
    isVip: false,
    vipExpiresAt: null,
    coins: 30,
    referralCode: 'AZIZBEK_99',
    dailyLikesCount: 3,
    interests: ["Musiqa", "IT", "Sayohat", "Sport"],
    jobTitle: "Dasturchi"
  };

  usersStore.set(newProfile.id, newProfile);

  // Pre-seed 1 mutual like to showcase match & chat immediately
  interactionsStore.push({
    actorId: 'user-madina-01',
    targetId: newProfile.id,
    action: 'like',
    createdAt: new Date(Date.now() - 3600000).toISOString()
  });

  return newProfile;
}

// Initialize session user
getOrCreateSessionUser();

// ==============================================================================
// TELEGRAM INITDATA AUTH MIDDLEWARE
// ==============================================================================

function parseTelegramInitData(initDataRaw: string) {
  try {
    const params = new URLSearchParams(initDataRaw);
    const userParam = params.get('user');
    if (!userParam) return null;
    return JSON.parse(userParam);
  } catch (err) {
    return null;
  }
}

function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const initData = (req.headers['x-telegram-init-data'] as string) || '';
  const parsedUser = parseTelegramInitData(initData);
  
  let user: UserProfile | undefined;
  if (parsedUser && parsedUser.id) {
    user = getOrCreateSessionUser(parsedUser);
  } else {
    // Default session user
    user = usersStore.get(currentSessionUserId) || getOrCreateSessionUser();
  }

  (req as any).user = user;
  next();
}

// ==============================================================================
// API ROUTES
// ==============================================================================

// 1. AUTH
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { initData } = req.body;
  const parsedUser = parseTelegramInitData(initData || '');
  const user = getOrCreateSessionUser(parsedUser);
  res.json({
    success: true,
    user,
    message: "Tizimga muvaffaqiyatli kirildi"
  });
});

// 2. PROFILE
app.get('/api/profile/me', authMiddleware, (req: Request, res: Response) => {
  const user = (req as any).user as UserProfile;
  const freshUser = usersStore.get(user.id) || user;
  const remainingLikes = freshUser.isVip ? 9999 : Math.max(0, 20 - freshUser.dailyLikesCount);
  
  res.json({
    user: freshUser,
    remainingLikes,
    maxDailyLikes: freshUser.isVip ? 'Cheksiz' : 20,
  });
});

app.post('/api/profile/update', authMiddleware, (req: Request, res: Response) => {
  const user = (req as any).user as UserProfile;
  const { name, age, gender, republic, regionId, districtId, bio, photos, latitude, longitude, interests, jobTitle } = req.body;

  // Validation: Age must be greater than 17 (18+)
  if (age !== undefined && age < 18) {
    return res.status(400).json({
      error: "Yoshingiz 18 dan katta bo'lishi shart! (O'zbekiston qonunchiligi va xavfsizlik talabi)"
    });
  }

  if (photos && Array.isArray(photos) && photos.length < 2) {
    return res.status(400).json({
      error: "Kamida 2 ta fotosurat yuklashingiz shart!"
    });
  }

  const regionObj = REGIONS.find(r => r.id === Number(regionId));
  const districtObj = DISTRICTS.find(d => d.id === Number(districtId));

  const updated: UserProfile = {
    ...user,
    name: name || user.name,
    age: age !== undefined ? Number(age) : user.age,
    gender: gender || user.gender,
    republic: republic || user.republic,
    regionId: regionId ? Number(regionId) : user.regionId,
    regionName: regionObj ? regionObj.nameUz : user.regionName,
    districtId: districtId ? Number(districtId) : user.districtId,
    districtName: districtObj ? districtObj.nameUz : user.districtName,
    bio: bio !== undefined ? bio : user.bio,
    photos: photos || user.photos,
    latitude: latitude || (districtObj?.lat ?? user.latitude),
    longitude: longitude || (districtObj?.lng ?? user.longitude),
    interests: interests || user.interests,
    jobTitle: jobTitle || user.jobTitle,
    profileCompleted: true,
  };

  usersStore.set(user.id, updated);

  res.json({
    success: true,
    user: updated,
    message: "Profilingiz muvaffaqiyatli yangilandi!"
  });
});

// 3. DISCOVERY (The Core Algorithm)
app.get('/api/discover/cards', authMiddleware, (req: Request, res: Response) => {
  const user = (req as any).user as UserProfile;
  const requestedGender = req.query.gender as string;

  // SPECIFIC BUSINESS RULE 1: Gender Filter Paywall
  // If user is NOT VIP and requests gender filter -> Reject with VIP_REQUIRED
  if (requestedGender && requestedGender !== 'all' && !user.isVip) {
    return res.status(403).json({
      code: "VIP_REQUIRED",
      error: "Jins bo'yicha saralash faqat VIP obunachilar uchun mavjud! VIP obunaga o'ting va o'zingiz xohlagan qizlar yoki yigitlarni saralang."
    });
  }

  // Get list of targets user has already interacted with (liked/skipped)
  const interactedTargetIds = new Set(
    interactionsStore
      .filter(i => i.actorId === user.id)
      .map(i => i.targetId)
  );

  // Filter candidates
  let candidates = Array.from(usersStore.values()).filter(u => {
    if (u.id === user.id) return false;
    if (interactedTargetIds.has(u.id)) return false;
    
    // If VIP filter applied
    if (user.isVip && requestedGender && requestedGender !== 'all') {
      if (u.gender !== requestedGender) return false;
    }
    return true;
  });

  // Calculate distance & location priority
  const scored = candidates.map(c => {
    let distanceKm = 15;
    if (user.latitude && user.longitude && c.latitude && c.longitude) {
      distanceKm = calculateDistanceKm(user.latitude, user.longitude, c.latitude, c.longitude);
    }

    // Location priority tier:
    // Tier 1: Same district (highest priority)
    // Tier 2: Same region
    // Tier 3: Other regions, sorted by GPS distance
    let priorityTier = 3;
    if (c.districtId === user.districtId) {
      priorityTier = 1;
    } else if (c.regionId === user.regionId) {
      priorityTier = 2;
    }

    return {
      profile: c,
      distanceKm,
      priorityTier,
    };
  });

  // Sort by priorityTier first, then by distanceKm
  scored.sort((a, b) => {
    if (a.priorityTier !== b.priorityTier) {
      return a.priorityTier - b.priorityTier;
    }
    return a.distanceKm - b.distanceKm;
  });

  // Free users: max 20 per day / batch
  const limit = user.isVip ? 50 : 20;
  const resultCards = scored.slice(0, limit).map(s => ({
    ...s.profile,
    distanceKm: s.distanceKm,
  }));

  res.json({
    cards: resultCards,
    total: resultCards.length,
    userIsVip: user.isVip,
  });
});

// 4. INTERACTIONS (Like, Skip, Super Like)
app.post('/api/interactions/like', authMiddleware, (req: Request, res: Response) => {
  const user = (req as any).user as UserProfile;
  const { targetId } = req.body;

  if (!targetId || targetId === user.id) {
    return res.status(400).json({ error: "Noto'g'ri foydalanuvchi" });
  }

  // Daily limit check for Free users (20 likes per day)
  if (!user.isVip && user.dailyLikesCount >= 20) {
    return res.status(403).json({
      code: "LIMIT_REACHED",
      error: "Kunlik 20 ta bepul like tugadi! VIP obunaga o'ting yoki do'stlaringizni taklif qilib tanga evaziga qo'shimcha like oling."
    });
  }

  // Record interaction
  user.dailyLikesCount += 1;
  usersStore.set(user.id, user);

  interactionsStore.push({
    actorId: user.id,
    targetId,
    action: 'like',
    createdAt: new Date().toISOString()
  });

  // Referral Validation:
  // Award coins ONLY when the referred user completes profile AND performs 3 likes
  if (user.referredBy && user.dailyLikesCount >= 3) {
    const refRecord = referralsStore.find(r => r.invitedUserId === user.id && !r.rewarded);
    if (refRecord) {
      refRecord.rewarded = true;
      const inviter = usersStore.get(refRecord.referrerId);
      if (inviter) {
        inviter.coins += 50; // 50 coins to inviter!
        usersStore.set(inviter.id, inviter);
      }
      user.coins += 20; // 20 coins bonus to user!
      usersStore.set(user.id, user);
    }
  }

  // Check reciprocal like -> MATCH!
  const reciprocal = interactionsStore.find(
    i => i.actorId === targetId && i.targetId === user.id && (i.action === 'like' || i.action === 'super_like')
  );

  let isMatch = false;
  let matchRecord: MatchRecord | null = null;
  const targetUser = usersStore.get(targetId);

  if (reciprocal) {
    isMatch = true;
    const matchId = `match-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    matchRecord = {
      id: matchId,
      user1Id: user.id,
      user2Id: targetId,
      matchedAt: new Date().toISOString(),
      isActive: true
    };
    matchesStore.push(matchRecord);

    // Initial greeting
    messagesStore.push({
      id: `msg-${Date.now()}`,
      matchId: matchRecord.id,
      senderId: targetId,
      text: "Salom! Siz bilan bir-birimizni yoqtirganimizdan xursandman 😊",
      createdAt: new Date().toISOString()
    });
  }

  res.json({
    success: true,
    isMatch,
    matchProfile: isMatch ? targetUser : null,
    remainingLikes: user.isVip ? 'Cheksiz' : Math.max(0, 20 - user.dailyLikesCount)
  });
});

app.post('/api/interactions/skip', authMiddleware, (req: Request, res: Response) => {
  const user = (req as any).user as UserProfile;
  const { targetId } = req.body;

  interactionsStore.push({
    actorId: user.id,
    targetId,
    action: 'skip',
    createdAt: new Date().toISOString()
  });

  res.json({ success: true });
});

app.post('/api/interactions/super_like', authMiddleware, (req: Request, res: Response) => {
  const user = (req as any).user as UserProfile;
  const { targetId } = req.body;

  if (!user.isVip && user.coins < 5) {
    return res.status(403).json({
      code: "COINS_REQUIRED",
      error: "Super Like bosish uchun 5 ta tanga yoki VIP obuna kerak!"
    });
  }

  if (!user.isVip) {
    user.coins -= 5;
    usersStore.set(user.id, user);
  }

  interactionsStore.push({
    actorId: user.id,
    targetId,
    action: 'super_like',
    createdAt: new Date().toISOString()
  });

  // Treat as high priority like
  const reciprocal = interactionsStore.find(
    i => i.actorId === targetId && i.targetId === user.id && (i.action === 'like' || i.action === 'super_like')
  );

  let isMatch = false;
  const targetUser = usersStore.get(targetId);

  if (reciprocal) {
    isMatch = true;
    const matchId = `match-${Date.now()}`;
    matchesStore.push({
      id: matchId,
      user1Id: user.id,
      user2Id: targetId,
      matchedAt: new Date().toISOString(),
      isActive: true
    });
  }

  res.json({
    success: true,
    isMatch,
    matchProfile: isMatch ? targetUser : null,
    coins: user.coins
  });
});

// 5. MATCHES & CHAT
app.get('/api/matches', authMiddleware, (req: Request, res: Response) => {
  const user = (req as any).user as UserProfile;
  const userMatches = matchesStore.filter(m => m.user1Id === user.id || m.user2Id === user.id);

  const enriched = userMatches.map(m => {
    const partnerId = m.user1Id === user.id ? m.user2Id : m.user1Id;
    const partner = usersStore.get(partnerId);
    const msgs = messagesStore.filter(msg => msg.matchId === m.id);
    const lastMsg = msgs.length > 0 ? msgs[msgs.length - 1] : null;

    return {
      matchId: m.id,
      matchedAt: m.matchedAt,
      partner,
      lastMessage: lastMsg ? lastMsg.text : 'Yangi juftlik! Suhbatni boshlang ✨',
      lastMessageTime: lastMsg ? lastMsg.createdAt : m.matchedAt,
    };
  });

  res.json({ matches: enriched });
});

app.get('/api/likes', authMiddleware, (req: Request, res: Response) => {
  const user = (req as any).user as UserProfile;
  // Users who liked me
  const receivedLikes = interactionsStore.filter(i => i.targetId === user.id && (i.action === 'like' || i.action === 'super_like'));
  
  const likers = receivedLikes.map(l => {
    const profile = usersStore.get(l.actorId);
    if (!profile) return null;
    return {
      ...profile,
      likedAt: l.createdAt,
      isSuperLike: l.action === 'super_like'
    };
  }).filter(Boolean);

  res.json({
    likes: likers,
    userIsVip: user.isVip,
    count: likers.length
  });
});

app.get('/api/chat/:matchId/messages', authMiddleware, (req: Request, res: Response) => {
  const { matchId } = req.params;
  const msgs = messagesStore.filter(m => m.matchId === matchId);
  res.json({ messages: msgs });
});

app.post('/api/chat/:matchId/messages', authMiddleware, (req: Request, res: Response) => {
  const user = (req as any).user as UserProfile;
  const { matchId } = req.params;
  const { text } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({ error: "Xabar matni bo'sh bo'lishi mumkin emas" });
  }

  const newMsg: MessageRecord = {
    id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    matchId,
    senderId: user.id,
    text: text.trim(),
    createdAt: new Date().toISOString()
  };

  messagesStore.push(newMsg);

  // Simulated auto-reply after 2 seconds for interactive testing
  setTimeout(() => {
    const match = matchesStore.find(m => m.id === matchId);
    if (match) {
      const partnerId = match.user1Id === user.id ? match.user2Id : match.user1Id;
      const partner = usersStore.get(partnerId);
      const autoResponses = [
        "Ajoyib! Siz bilan suhbatlashish juda maroqli 😊",
        "Qaysi tumanda yashaysiz? Bo'sh vaqtingizda nimalar bilan shug'ullanasiz?",
        "Rahmat javobingiz uchun! Menga profilingizdagi rasm juda yoqdi ✨",
        "Kofe ichishga vaqtingiz bo'lsa, bir kun ko'rishsak bo'ladi ☕",
      ];
      const randomText = autoResponses[Math.floor(Math.random() * autoResponses.length)];
      messagesStore.push({
        id: `msg-${Date.now()}-reply`,
        matchId,
        senderId: partnerId,
        text: randomText,
        createdAt: new Date().toISOString()
      });
    }
  }, 2000);

  res.json({ success: true, message: newMsg });
});

// 6. PAYMENTS (Payme, Click, Telegram Stars)
app.post('/api/payments/create-invoice', authMiddleware, (req: Request, res: Response) => {
  const user = (req as any).user as UserProfile;
  const { planId, paymentMethod, amountUzs, amountUsd, currency, vipDurationDays } = req.body;

  const transactionId = `tx-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

  const tx: TransactionRecord = {
    id: transactionId,
    userId: user.id,
    amountUsd: amountUsd || 0,
    amountUzs: amountUzs || 0,
    currency: currency || 'UZS',
    paymentMethod: paymentMethod || 'payme',
    status: 'pending',
    vipDurationDays: vipDurationDays || 30,
    coinsCount: 0,
    createdAt: new Date().toISOString()
  };

  transactionsStore.push(tx);

  // Build checkout URL / link simulation
  let paymentUrl = '';
  if (paymentMethod === 'payme') {
    // Payme merchant checkout scheme
    paymentUrl = `https://checkout.paycom.uz/${Buffer.from(`m=6510a123&ac.user_id=${user.id}&a=${amountUzs * 100}`).toString('base64')}`;
  } else if (paymentMethod === 'click') {
    // Click merchant checkout scheme
    paymentUrl = `https://my.click.uz/services/pay?service_id=12345&merchant_id=6789&amount=${amountUzs}&transaction_param=${transactionId}`;
  } else {
    // Telegram Stars (XTR)
    paymentUrl = `https://t.me/tanishuv_bot?start=invoice_${transactionId}`;
  }

  res.json({
    success: true,
    transactionId,
    paymentUrl,
    message: `${paymentMethod.toUpperCase()} orqali to'lov hisobi yaratildi!`
  });
});

app.post('/api/payments/webhook', (req: Request, res: Response) => {
  const { transactionId } = req.body;
  const tx = transactionsStore.find(t => t.id === transactionId);

  if (!tx) {
    return res.status(404).json({ error: "Tranzaksiya topilmadi" });
  }

  tx.status = 'success';
  const targetUser = usersStore.get(tx.userId);
  if (targetUser) {
    targetUser.isVip = true;
    const expires = new Date();
    expires.setDate(expires.getDate() + (tx.vipDurationDays || 30));
    targetUser.vipExpiresAt = expires.toISOString();
    usersStore.set(targetUser.id, targetUser);
  }

  res.json({
    success: true,
    message: "To'lov qabul qilindi va VIP maqomi faollashtirildi!",
    user: targetUser
  });
});

// 7. REFERRAL SYSTEM
app.get('/api/referral/stats', authMiddleware, (req: Request, res: Response) => {
  const user = (req as any).user as UserProfile;
  const invited = referralsStore.filter(r => r.referrerId === user.id);

  res.json({
    referralCode: user.referralCode,
    referralLink: `https://t.me/TanishuvUzBot?start=ref_${user.referralCode}`,
    totalInvited: invited.length,
    rewardedCount: invited.filter(r => r.rewarded).length,
    coins: user.coins,
    rules: "Do'stingiz ro'yxatdan o'tib, profilini to'ldirib 3 ta like bosganida sizga 50 tanga, do'stingizga 20 tanga beriladi!"
  });
});

app.post('/api/referral/redeem', authMiddleware, (req: Request, res: Response) => {
  const user = (req as any).user as UserProfile;
  const { type } = req.body; // 'boost' or 'likes'

  // SPECIFIC BUSINESS RULE 2:
  // "DO NOT allow exchanging coins for VIP subscription"
  if (type === 'vip') {
    return res.status(400).json({
      error: "Tangalarni VIP obunaga almashtirish mumkin emas! VIP faqat to'lov orqali faollashtiriladi."
    });
  }

  if (type === 'boost') {
    if (user.coins < 50) {
      return res.status(400).json({ error: "Top Boost uchun kamida 50 tanga kerak!" });
    }
    user.coins -= 50;
    usersStore.set(user.id, user);
    return res.json({
      success: true,
      message: "Profilingiz 24 soatga Top o'ringa ko'tarildi (Boost faol)!",
      remainingCoins: user.coins
    });
  }

  if (type === 'likes') {
    if (user.coins < 20) {
      return res.status(400).json({ error: "+5 Like olish uchun 20 tanga kerak!" });
    }
    user.coins -= 20;
    user.dailyLikesCount = Math.max(0, user.dailyLikesCount - 5);
    usersStore.set(user.id, user);
    return res.json({
      success: true,
      message: "+5 ta qo'shimcha Like balansingizga qo'shildi!",
      remainingCoins: user.coins,
      remainingLikes: Math.max(0, 20 - user.dailyLikesCount)
    });
  }

  res.status(400).json({ error: "Noto'g'ri almashtirish turi" });
});

// DEV HELPER: Switch user role / toggle VIP
app.post('/api/dev/toggle-vip', authMiddleware, (req: Request, res: Response) => {
  const user = (req as any).user as UserProfile;
  user.isVip = !user.isVip;
  if (user.isVip) {
    user.vipExpiresAt = new Date(Date.now() + 30 * 86400000).toISOString();
  } else {
    user.vipExpiresAt = null;
  }
  usersStore.set(user.id, user);
  res.json({ success: true, isVip: user.isVip, user });
});

app.post('/api/dev/add-coins', authMiddleware, (req: Request, res: Response) => {
  const user = (req as any).user as UserProfile;
  user.coins += 50;
  usersStore.set(user.id, user);
  res.json({ success: true, coins: user.coins, user });
});

app.post('/api/dev/reset-likes', authMiddleware, (req: Request, res: Response) => {
  const user = (req as any).user as UserProfile;
  user.dailyLikesCount = 0;
  usersStore.set(user.id, user);
  res.json({ success: true, dailyLikesCount: user.dailyLikesCount, user });
});

// ==============================================================================
// INIT TELEGRAF BOT & VITE DEV SERVER
// ==============================================================================

async function startServer() {
  // Initialize Telegram Bot with HTTPS Webhook & Polling fallback
  if (BOT_TOKEN) {
    try {
      const bot = createTelegramBot(BOT_TOKEN);
      if (bot) {
        // Webhook endpoint for Telegram updates
        app.post('/api/telegram/webhook', (req, res) => {
          bot.handleUpdate(req.body, res).then(() => {
            if (!res.headersSent) res.sendStatus(200);
          }).catch((err: any) => {
            console.error("Webhook handle error:", err);
            if (!res.headersSent) res.sendStatus(500);
          });
        });

        const appUrl = process.env.APP_URL || 'https://ais-dev-x4narnjxkseqyvzs7fbmby-89870895206.asia-southeast1.run.app';
        const webhookUrl = `${appUrl}/api/telegram/webhook`;

        bot.telegram.setWebhook(webhookUrl).then(() => {
          console.log(`🤖 [Telegram Bot] HTTPS Webhook muvaffaqiyatli o'rnatildi: ${webhookUrl}`);
        }).catch(err => {
          console.warn('⚠️ [Telegram Bot] Webhook o\'rnatishda xatolik, polling rejimiga o\'tilmoqda:', err.message);
          bot.launch().then(() => {
            console.log('🤖 [Telegram Bot] Telegraf bot Polling rejimida ishga tushdi!');
          }).catch(e => {
            console.warn('⚠️ [Telegram Bot] Launch error:', e.message);
          });
        });
      }
    } catch (botErr) {
      console.warn('⚠️ [Telegram Bot] Initialization notice:', botErr);
    }
  } else {
    console.log('ℹ️ [Tanishuv UZ] Bot token kiritilmagan.');
  }

  // Vite middleware mounting in development
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 [Tanishuv UZ] Server http://localhost:${PORT} da ishga tushdi!`);
  });
}

startServer();
