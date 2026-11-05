import axios from 'axios';

// Get Telegram initData if available in Telegram WebApp environment
export function getTelegramInitData(): string {
  if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.initData) {
    return (window as any).Telegram.WebApp.initData;
  }
  // Fallback for development/browser preview testing
  return localStorage.getItem('tanishuv_dev_init_data') || 'query_id=AAHd&user=%7B%22id%22%3A999888777%2C%22first_name%22%3A%22Azizbek%22%2C%22last_name%22%3A%22Safarov%22%2C%22username%22%3A%22azizbek_uz%22%7D&auth_date=1730000000&hash=mockhash12345';
}

export const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach Telegram Auth Header
api.interceptors.request.use((config) => {
  const initData = getTelegramInitData();
  if (initData) {
    config.headers['X-Telegram-Init-Data'] = initData;
  }
  return config;
});

// Response error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If backend returns VIP_REQUIRED or LIMIT_REACHED, preserve payload
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async () => {
    const initData = getTelegramInitData();
    const res = await api.post('/auth/login', { initData });
    return res.data;
  },
};

export const profileApi = {
  getMe: async () => {
    const res = await api.get('/profile/me');
    return res.data;
  },
  updateProfile: async (data: any) => {
    const res = await api.post('/profile/update', data);
    return res.data;
  },
};

export const discoveryApi = {
  getCards: async (genderFilter?: string) => {
    const params: any = {};
    if (genderFilter && genderFilter !== 'all') {
      params.gender = genderFilter;
    }
    const res = await api.get('/discover/cards', { params });
    return res.data;
  },
};

export const interactionApi = {
  like: async (targetId: string) => {
    const res = await api.post('/interactions/like', { targetId });
    return res.data;
  },
  skip: async (targetId: string) => {
    const res = await api.post('/interactions/skip', { targetId });
    return res.data;
  },
  superLike: async (targetId: string) => {
    const res = await api.post('/interactions/super_like', { targetId });
    return res.data;
  },
};

export const matchesApi = {
  getMatches: async () => {
    const res = await api.get('/matches');
    return res.data;
  },
  getLikes: async () => {
    const res = await api.get('/likes');
    return res.data;
  },
  getChatMessages: async (matchId: string) => {
    const res = await api.get(`/chat/${matchId}/messages`);
    return res.data;
  },
  sendMessage: async (matchId: string, text: string) => {
    const res = await api.post(`/chat/${matchId}/messages`, { text });
    return res.data;
  },
};

export const referralApi = {
  getStats: async () => {
    const res = await api.get('/referral/stats');
    return res.data;
  },
  redeem: async (type: 'boost' | 'likes') => {
    const res = await api.post('/referral/redeem', { type });
    return res.data;
  },
};

export const paymentsApi = {
  createInvoice: async (payload: {
    planId: string;
    paymentMethod: 'payme' | 'click' | 'stars';
    amountUzs: number;
    amountUsd: number;
    currency: 'UZS' | 'USD' | 'XTR';
    vipDurationDays: number;
  }) => {
    const res = await api.post('/payments/create-invoice', payload);
    return res.data;
  },
  simulateWebhook: async (transactionId: string) => {
    const res = await api.post('/payments/webhook', { transactionId });
    return res.data;
  },
};

export default api;
