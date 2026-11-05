export interface UserProfile {
  id: string;
  telegramId: number;
  username: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  bio: string;
  photos: string[];
  isVerified: boolean;
  profileCompleted: boolean;
  republic: 'uzbekistan' | 'karakalpakstan';
  regionId: number;
  regionName: string;
  districtId: number;
  districtName: string;
  latitude: number;
  longitude: number;
  isVip: boolean;
  vipExpiresAt?: string | null;
  coins: number;
  referralCode: string;
  referredBy?: string | null;
  dailyLikesCount: number;
  interests?: string[];
  jobTitle?: string;
}

export const INITIAL_PROFILES: UserProfile[] = [
  {
    id: "user-madina-01",
    telegramId: 890123401,
    username: "madina_uz",
    name: "Madina",
    age: 22,
    gender: "female",
    bio: "Toshkent Davlat Jahon Tillari Universiteti talabasi. Kitoblar, kofe va sokin oqshomlar shaydosi ☕📖. Samimiy va maqsadli insonlarni hurmat qilaman.",
    photos: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80"
    ],
    isVerified: true,
    profileCompleted: true,
    republic: "uzbekistan",
    regionId: 10,
    regionName: "Toshkent shahri",
    districtId: 101,
    districtName: "Yunusobod tumani",
    latitude: 41.3650,
    longitude: 69.2890,
    isVip: false,
    coins: 40,
    referralCode: "MADINA22",
    dailyLikesCount: 0,
    interests: ["Kofe", "Kitobxonlik", "Sayohat", "Til o'rganish"],
    jobTitle: "Ingliz tili repetitori"
  },
  {
    id: "user-jasur-02",
    telegramId: 890123402,
    username: "jasur_dev",
    name: "Jasur",
    age: 25,
    gender: "male",
    bio: "Senior Frontend Engineer 💻. IT sohasida ishlayman. Bo'sh vaqtlarda sport zal, futbol va tog' sayohatlari ⛰️. Hayotda o'z maqsadiga ega qizlar bilan suhbatlashishni xohlayman.",
    photos: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80"
    ],
    isVerified: true,
    profileCompleted: true,
    republic: "uzbekistan",
    regionId: 10,
    regionName: "Toshkent shahri",
    districtId: 103,
    districtName: "Mirzo Ulug'bek tumani",
    latitude: 41.3280,
    longitude: 69.3340,
    isVip: true,
    vipExpiresAt: "2026-12-31T23:59:59Z",
    coins: 150,
    referralCode: "JASUR_IT",
    dailyLikesCount: 0,
    interests: ["Dasturlash", "Fitnes", "Startaplar", "Fotografiya"],
    jobTitle: "IT Loyiha menejeri"
  },
  {
    id: "user-shahzoda-03",
    telegramId: 890123403,
    username: "shahzodaxon",
    name: "Shahzoda",
    age: 21,
    gender: "female",
    bio: "Dizayner va rassomlik ishqibozi 🎨. Milliy madaniyat va zamonaviy uslub uyg'unligi. Shirin suhbat va qadriyatlarni qadrlayman.",
    photos: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80"
    ],
    isVerified: true,
    profileCompleted: true,
    republic: "uzbekistan",
    regionId: 10,
    regionName: "Toshkent shahri",
    districtId: 102,
    districtName: "Chilonzor tumani",
    latitude: 41.2750,
    longitude: 69.2050,
    isVip: false,
    coins: 25,
    referralCode: "SHAHZODA",
    dailyLikesCount: 0,
    interests: ["UI/UX Dizayn", "San'at", "Moda", "Kino"],
    jobTitle: "Grafik dizayner"
  },
  {
    id: "user-bekzod-04",
    telegramId: 890123404,
    username: "bekzod_sam",
    name: "Bekzod",
    age: 26,
    gender: "male",
    bio: "Samarqandlikman, hozirda Toshkentda xususiy biznes yurita man 💼. Samimiyat va hurmat har bir munosabatning kaliti deb bilaman.",
    photos: [
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80"
    ],
    isVerified: true,
    profileCompleted: true,
    republic: "uzbekistan",
    regionId: 12,
    regionName: "Samarqand viloyati",
    districtId: 301,
    districtName: "Samarqand shahri",
    latitude: 39.6542,
    longitude: 66.9597,
    isVip: false,
    coins: 10,
    referralCode: "BEK_SAM",
    dailyLikesCount: 0,
    interests: ["Tadbirkorlik", "Avtomobillar", "Gastronomiya", "Sayohat"],
    jobTitle: "Biznes egasi"
  },
  {
    id: "user-nilufar-05",
    telegramId: 890123405,
    username: "nilu_bux",
    name: "Nilufar",
    age: 23,
    gender: "female",
    bio: "Tibbiyot sohasi xodimi 🩺. Odamlarga yordam berishni sevaman. Bo'sh vaqtda pazandachilik va musiqa tinglash menga xush yoqadi 🍰🎶.",
    photos: [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80"
    ],
    isVerified: true,
    profileCompleted: true,
    republic: "uzbekistan",
    regionId: 13,
    regionName: "Buxoro viloyati",
    districtId: 401,
    districtName: "Buxoro shahri",
    latitude: 39.7747,
    longitude: 64.4286,
    isVip: false,
    coins: 60,
    referralCode: "NILUFAR_B",
    dailyLikesCount: 0,
    interests: ["Salomatlik", "Pazandachilik", "Klassik musiqa", "Piyoda yurish"],
    jobTitle: "Vrach-terapevt"
  },
  {
    id: "user-dilshod-06",
    telegramId: 890123406,
    username: "dilshod_fargona",
    name: "Dilshod",
    age: 27,
    gender: "male",
    bio: "Farg'onalikman. Logistika va xalqaro savdo sohasidaman ✈️. Doimo ijobiy kayfiyatda yurishni ma'qul ko'raman. Yangi do'stlar orttirishdan mamnunman.",
    photos: [
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1480429370139-e0132c086e2a?auto=format&fit=crop&w=800&q=80"
    ],
    isVerified: false,
    profileCompleted: true,
    republic: "uzbekistan",
    regionId: 15,
    regionName: "Farg'ona viloyati",
    districtId: 601,
    districtName: "Farg'ona shahri",
    latitude: 40.3842,
    longitude: 71.7843,
    isVip: true,
    vipExpiresAt: "2026-11-20T23:59:59Z",
    coins: 80,
    referralCode: "DILSHOD_F",
    dailyLikesCount: 0,
    interests: ["Xalqaro savdo", "Sport", "Shaxmat", "Fotografiya"],
    jobTitle: "Logistika menejeri"
  },
  {
    id: "user-rayhon-07",
    telegramId: 890123407,
    username: "rayhon_tosh",
    name: "Rayhon",
    age: 24,
    gender: "female",
    bio: "Toshkent markazida yashayman. Marketing va media 📱. Dunyo bo'ylab sayohat qilish va qiziqarli shaxslar bilan suhbat qurish orzuim.",
    photos: [
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
    ],
    isVerified: true,
    profileCompleted: true,
    republic: "uzbekistan",
    regionId: 10,
    regionName: "Toshkent shahri",
    districtId: 104,
    districtName: "Yakkasaroy tumani",
    latitude: 41.2820,
    longitude: 69.2480,
    isVip: false,
    coins: 30,
    referralCode: "RAYHON_T",
    dailyLikesCount: 0,
    interests: ["SMM", "Kofe", "Kinematografiya", "Yoga"],
    jobTitle: "SMM Mutaxassisi"
  },
  {
    id: "user-sarvar-08",
    telegramId: 890123408,
    username: "sarvar_and",
    name: "Sarvar",
    age: 24,
    gender: "male",
    bio: "Andijon shahrida yashayman. Bank moliya sohasida faoliyat yuritaman 📊. Halollik, hazilkashlik va pozitivlik hayotiy shiorim.",
    photos: [
      "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=800&q=80"
    ],
    isVerified: true,
    profileCompleted: true,
    republic: "uzbekistan",
    regionId: 14,
    regionName: "Andijon viloyati",
    districtId: 501,
    districtName: "Andijon shahri",
    latitude: 40.7821,
    longitude: 72.3442,
    isVip: false,
    coins: 15,
    referralCode: "SARVAR_AND",
    dailyLikesCount: 0,
    interests: ["Moliya", "Kitoblar", "Bilyard", "Kiber sport"],
    jobTitle: "Bank xodimi"
  }
];
