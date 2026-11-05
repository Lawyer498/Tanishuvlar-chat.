export interface LocationItem {
  id: number;
  type: 'republic' | 'region' | 'district';
  parentId?: number;
  nameUz: string;
  nameRu: string;
  isPopular?: boolean;
  lat?: number;
  lng?: number;
}

export const REPUBLICS: LocationItem[] = [
  { id: 1, type: 'republic', nameUz: "O'zbekiston Respublikasi", nameRu: "Республика Узбекистан" },
  { id: 2, type: 'republic', nameUz: "Qoraqalpog'iston Respublikasi", nameRu: "Республика Каракалпакстан" },
];

export const REGIONS: LocationItem[] = [
  // Tashkent City on top with star as required
  { id: 10, type: 'region', parentId: 1, nameUz: "Toshkent shahri ⭐", nameRu: "г. Ташкент ⭐", isPopular: true, lat: 41.311081, lng: 69.240562 },
  { id: 11, type: 'region', parentId: 1, nameUz: "Toshkent viloyati", nameRu: "Ташкентская область", lat: 41.2213, lng: 69.8597 },
  { id: 12, type: 'region', parentId: 1, nameUz: "Samarqand viloyati", nameRu: "Самаркандская область", isPopular: true, lat: 39.6542, lng: 66.9597 },
  { id: 13, type: 'region', parentId: 1, nameUz: "Buxoro viloyati", nameRu: "Бухарская область", lat: 39.7747, lng: 64.4286 },
  { id: 14, type: 'region', parentId: 1, nameUz: "Andijon viloyati", nameRu: "Андижанская область", lat: 40.7821, lng: 72.3442 },
  { id: 15, type: 'region', parentId: 1, nameUz: "Farg'ona viloyati", nameRu: "Ферганская область", lat: 40.3842, lng: 71.7843 },
  { id: 16, type: 'region', parentId: 1, nameUz: "Namangan viloyati", nameRu: "Наманганская область", lat: 40.9983, lng: 71.6726 },
  { id: 17, type: 'region', parentId: 1, nameUz: "Qashqadaryo viloyati", nameRu: "Кашкадарьинская область", lat: 38.8606, lng: 65.7891 },
  { id: 18, type: 'region', parentId: 1, nameUz: "Surxondaryo viloyati", nameRu: "Сурхандарьинская область", lat: 37.9409, lng: 67.5709 },
  { id: 19, type: 'region', parentId: 1, nameUz: "Jizzax viloyati", nameRu: "Джизакская область", lat: 40.1158, lng: 67.8422 },
  { id: 20, type: 'region', parentId: 1, nameUz: "Sirdaryo viloyati", nameRu: "Сырдарьинская область", lat: 40.4939, lng: 68.7844 },
  { id: 21, type: 'region', parentId: 1, nameUz: "Navoiy viloyati", nameRu: "Навоийская область", lat: 40.0844, lng: 65.3792 },
  { id: 22, type: 'region', parentId: 1, nameUz: "Xorazm viloyati", nameRu: "Хорезмская область", lat: 41.5562, lng: 60.6313 },
  { id: 23, type: 'region', parentId: 2, nameUz: "Qoraqalpog'iston Respublikasi (barcha tumanlar)", nameRu: "Республика Каракалпакстан", lat: 42.4619, lng: 59.6166 },
];

export const DISTRICTS: LocationItem[] = [
  // ==============================================================================
  // 1. TOSHKENT SHAHRI (12 ta tuman - to'liq)
  // ==============================================================================
  { id: 101, type: 'district', parentId: 10, nameUz: "Yunusobod tumani", nameRu: "Юнусабадский район", lat: 41.3650, lng: 69.2890 },
  { id: 102, type: 'district', parentId: 10, nameUz: "Chilonzor tumani", nameRu: "Чиланзарский район", lat: 41.2750, lng: 69.2050 },
  { id: 103, type: 'district', parentId: 10, nameUz: "Mirzo Ulug'bek tumani", nameRu: "Мирзо-Улугбекский район", lat: 41.3280, lng: 69.3340 },
  { id: 104, type: 'district', parentId: 10, nameUz: "Yakkasaroy tumani", nameRu: "Яккасарайский район", lat: 41.2820, lng: 69.2480 },
  { id: 105, type: 'district', parentId: 10, nameUz: "Mirobod tumani", nameRu: "Мирабадский район", lat: 41.2950, lng: 69.2780 },
  { id: 106, type: 'district', parentId: 10, nameUz: "Shayxontohur tumani", nameRu: "Шайхантахурский район", lat: 41.3210, lng: 69.2390 },
  { id: 107, type: 'district', parentId: 10, nameUz: "Olmazor tumani", nameRu: "Алмазарский район", lat: 41.3530, lng: 69.2230 },
  { id: 108, type: 'district', parentId: 10, nameUz: "Uchtepa tumani", nameRu: "Учтепинский район", lat: 41.2910, lng: 69.1760 },
  { id: 109, type: 'district', parentId: 10, nameUz: "Sergeli tumani", nameRu: "Сергелийский район", lat: 41.2260, lng: 69.2210 },
  { id: 110, type: 'district', parentId: 10, nameUz: "Yangihayot tumani", nameRu: "Янгихаётский район", lat: 41.1980, lng: 69.2080 },
  { id: 111, type: 'district', parentId: 10, nameUz: "Bektemir tumani", nameRu: "Бектемирский район", lat: 41.2180, lng: 69.3410 },
  { id: 112, type: 'district', parentId: 10, nameUz: "Yashnobod tumani", nameRu: "Яшнабадский район", lat: 41.2960, lng: 69.3320 },

  // ==============================================================================
  // 2. QORAQALPOG'ISTON RESPUBLIKASI (Barcha 16 ta tuman va shaharlar - to'liq)
  // ==============================================================================
  { id: 1401, type: 'district', parentId: 23, nameUz: "Nukus shahri (Poytaxt)", nameRu: "г. Нукус (Столица)", lat: 42.4619, lng: 59.6166 },
  { id: 1402, type: 'district', parentId: 23, nameUz: "Taxiatosh shahri", nameRu: "г. Тахиаташ", lat: 42.3411, lng: 59.5594 },
  { id: 1403, type: 'district', parentId: 23, nameUz: "Amudaryo tumani (Mang'it)", nameRu: "Амударьинский район", lat: 42.1167, lng: 60.1167 },
  { id: 1404, type: 'district', parentId: 23, nameUz: "Beruniy tumani", nameRu: "Берунийский район", lat: 41.6900, lng: 60.7500 },
  { id: 1405, type: 'district', parentId: 23, nameUz: "Bo'zatov tumani", nameRu: "Бозатауский район", lat: 42.9167, lng: 59.1333 },
  { id: 1406, type: 'district', parentId: 23, nameUz: "Chimboy tumani", nameRu: "Чимбайский район", lat: 42.9333, lng: 59.7667 },
  { id: 1407, type: 'district', parentId: 23, nameUz: "Ellikqal'a tumani (Bo'ston)", nameRu: "Элликкалинский район", lat: 41.7667, lng: 60.9167 },
  { id: 1408, type: 'district', parentId: 23, nameUz: "Kegeyli tumani", nameRu: "Кегейлийский район", lat: 42.7833, lng: 59.6000 },
  { id: 1409, type: 'district', parentId: 23, nameUz: "Mo'ynoq tumani", nameRu: "Муйнакский район", lat: 43.7667, lng: 59.0333 },
  { id: 1410, type: 'district', parentId: 23, nameUz: "Nukus tumani (Oqmang'it)", nameRu: "Нукусский район", lat: 42.5333, lng: 59.5833 },
  { id: 1411, type: 'district', parentId: 23, nameUz: "Qanliko'l tumani", nameRu: "Канлыкульский район", lat: 42.8167, lng: 59.0000 },
  { id: 1412, type: 'district', parentId: 23, nameUz: "Qo'ng'irot tumani", nameRu: "Кунградский район", lat: 43.0417, lng: 58.8417 },
  { id: 1413, type: 'district', parentId: 23, nameUz: "Qorao'zak tumani", nameRu: "Караузякский район", lat: 42.5667, lng: 60.0000 },
  { id: 1414, type: 'district', parentId: 23, nameUz: "Shumanay tumani", nameRu: "Шуманайский район", lat: 42.6000, lng: 59.1333 },
  { id: 1415, type: 'district', parentId: 23, nameUz: "Taxtako'pir tumani", nameRu: "Тахтакупырский район", lat: 43.0333, lng: 60.2833 },
  { id: 1416, type: 'district', parentId: 23, nameUz: "To'rtko'l tumani", nameRu: "Турткульский район", lat: 41.5600, lng: 60.9900 },
  { id: 1417, type: 'district', parentId: 23, nameUz: "Xo'jayli tumani", nameRu: "Ходжейлийский район", lat: 42.4000, lng: 59.4500 },

  // ==============================================================================
  // 3. TOSHKENT VILOYATI (Barcha tumanlar va shaharlar - to'liq)
  // ==============================================================================
  { id: 201, type: 'district', parentId: 11, nameUz: "Nurafshon shahri (Viloyat markazi)", nameRu: "г. Нурафшан", lat: 41.0422, lng: 69.3589 },
  { id: 202, type: 'district', parentId: 11, nameUz: "Chirchiq shahri", nameRu: "г. Чирчик", lat: 41.4689, lng: 69.5822 },
  { id: 203, type: 'district', parentId: 11, nameUz: "Olmaliq shahri", nameRu: "г. Алмалык", lat: 40.8522, lng: 69.5989 },
  { id: 204, type: 'district', parentId: 11, nameUz: "Angren shahri", nameRu: "г. Ангрен", lat: 41.0167, lng: 70.1436 },
  { id: 205, type: 'district', parentId: 11, nameUz: "Bekobod shahri", nameRu: "г. Бекабад", lat: 40.2167, lng: 69.2167 },
  { id: 206, type: 'district', parentId: 11, nameUz: "Yangiyo'l shahri", nameRu: "г. Янгиюль", lat: 41.1167, lng: 69.0500 },
  { id: 207, type: 'district', parentId: 11, nameUz: "Ohangaron shahri", nameRu: "г. Ахангаран", lat: 40.9067, lng: 69.6417 },
  { id: 208, type: 'district', parentId: 11, nameUz: "Bo'stonliq tumani (Chorvoq/G'azalkent)", nameRu: "Бостанлыкский район", lat: 41.6167, lng: 69.9500 },
  { id: 209, type: 'district', parentId: 11, nameUz: "Zangiota tumani", nameRu: "Зангиатинский район", lat: 41.2000, lng: 69.1167 },
  { id: 210, type: 'district', parentId: 11, nameUz: "Qibray tumani", nameRu: "Кибрайский район", lat: 41.3833, lng: 69.4667 },
  { id: 211, type: 'district', parentId: 11, nameUz: "Toshkent tumani (Keles)", nameRu: "Ташкентский район (Келес)", lat: 41.4050, lng: 69.2030 },
  { id: 212, type: 'district', parentId: 11, nameUz: "Parkent tumani", nameRu: "Паркентский район", lat: 41.2944, lng: 69.6764 },
  { id: 213, type: 'district', parentId: 11, nameUz: "Yangiyo'l tumani", nameRu: "Янгиюльский район", lat: 41.1300, lng: 69.0400 },
  { id: 214, type: 'district', parentId: 11, nameUz: "Chinoz tumani", nameRu: "Чиназский район", lat: 40.9400, lng: 68.7600 },
  { id: 215, type: 'district', parentId: 11, nameUz: "Yuqori Chirchiq tumani (Yangibozor)", nameRu: "Юкоричирчикский район", lat: 41.3200, lng: 69.6000 },
  { id: 216, type: 'district', parentId: 11, nameUz: "O'rta Chirchiq tumani (Toytepa)", nameRu: "Уртачирчикский район", lat: 41.0500, lng: 69.3600 },
  { id: 217, type: 'district', parentId: 11, nameUz: "Quyi Chirchiq tumani (Do'stobod)", nameRu: "Куйичирчикский район", lat: 40.8600, lng: 68.9700 },
  { id: 218, type: 'district', parentId: 11, nameUz: "Bekobod tumani (Zafar)", nameRu: "Бекабадский район", lat: 40.2800, lng: 69.2000 },
  { id: 219, type: 'district', parentId: 11, nameUz: "Bo'ka tumani", nameRu: "Букинский район", lat: 40.8100, lng: 69.1900 },
  { id: 220, type: 'district', parentId: 11, nameUz: "Piskent tumani", nameRu: "Пскентский район", lat: 40.9000, lng: 69.3500 },
  { id: 221, type: 'district', parentId: 11, nameUz: "Oqqo'rg'on tumani", nameRu: "Аккурганский район", lat: 40.9600, lng: 69.0300 },
  { id: 222, type: 'district', parentId: 11, nameUz: "Ohangaron tumani", nameRu: "Ахангаранский район", lat: 40.9100, lng: 69.6500 },

  // ==============================================================================
  // 4. SAMARQAND VILOYATI (Barcha tumanlar va shaharlar - to'liq)
  // ==============================================================================
  { id: 301, type: 'district', parentId: 12, nameUz: "Samarqand shahri", nameRu: "г. Самарканд", lat: 39.6542, lng: 66.9597 },
  { id: 302, type: 'district', parentId: 12, nameUz: "Kattaqo'rg'on shahri", nameRu: "г. Каттакурган", lat: 39.8978, lng: 66.2575 },
  { id: 303, type: 'district', parentId: 12, nameUz: "Samarqand tumani", nameRu: "Самаркандский район", lat: 39.6200, lng: 66.9000 },
  { id: 304, type: 'district', parentId: 12, nameUz: "Urgut tumani", nameRu: "Ургутский район", lat: 39.4000, lng: 67.2400 },
  { id: 305, type: 'district', parentId: 12, nameUz: "Pastdarg'om tumani (Juma)", nameRu: "Пастдаргомский район", lat: 39.6600, lng: 66.6800 },
  { id: 306, type: 'district', parentId: 12, nameUz: "Ishtixon tumani", nameRu: "Иштыханский район", lat: 39.9600, lng: 66.4900 },
  { id: 307, type: 'district', parentId: 12, nameUz: "Bulung'ur tumani", nameRu: "Булунгурский район", lat: 39.7600, lng: 67.2700 },
  { id: 308, type: 'district', parentId: 12, nameUz: "Jomboy tumani", nameRu: "Джамбайский район", lat: 39.7000, lng: 67.0900 },
  { id: 309, type: 'district', parentId: 12, nameUz: "Payariq tumani (Chelak)", nameRu: "Пайарыкский район", lat: 39.9900, lng: 66.8500 },
  { id: 310, type: 'district', parentId: 12, nameUz: "Toyloq tumani", nameRu: "Тайлакский район", lat: 39.6100, lng: 67.0800 },
  { id: 311, type: 'district', parentId: 12, nameUz: "Oqdaryo tumani (Loyish)", nameRu: "Акдарьинский район", lat: 39.8100, lng: 66.7200 },
  { id: 312, type: 'district', parentId: 12, nameUz: "Narpay tumani (Oqtosh)", nameRu: "Нарпайский район", lat: 40.0100, lng: 65.9300 },
  { id: 313, type: 'district', parentId: 12, nameUz: "Kattaqo'rg'on tumani (Payshanba)", nameRu: "Каттакурганский район", lat: 39.9200, lng: 66.2700 },
  { id: 314, type: 'district', parentId: 12, nameUz: "Paxtachi tumani (Ziyovuddin)", nameRu: "Пахтачийский район", lat: 40.0400, lng: 65.7100 },
  { id: 315, type: 'district', parentId: 12, nameUz: "Qo'shrabot tumani", nameRu: "Кошрабадский район", lat: 40.4000, lng: 66.6700 },
  { id: 316, type: 'district', parentId: 12, nameUz: "Nurobod tumani", nameRu: "Нурабадский район", lat: 39.6000, lng: 66.2800 },

  // ==============================================================================
  // 5. BUXORO VILOYATI (Barcha tumanlar va shaharlar - to'liq)
  // ==============================================================================
  { id: 401, type: 'district', parentId: 13, nameUz: "Buxoro shahri", nameRu: "г. Бухара", lat: 39.7747, lng: 64.4286 },
  { id: 402, type: 'district', parentId: 13, nameUz: "Kogon shahri", nameRu: "г. Каган", lat: 39.7200, lng: 64.5500 },
  { id: 403, type: 'district', parentId: 13, nameUz: "Buxoro tumani (Galaosiyo)", nameRu: "Бухарский район", lat: 39.8500, lng: 64.4500 },
  { id: 404, type: 'district', parentId: 13, nameUz: "G'ijduvon tumani", nameRu: "Гиждуванский район", lat: 40.1000, lng: 64.6700 },
  { id: 405, type: 'district', parentId: 13, nameUz: "Vobkent tumani", nameRu: "Вабкентский район", lat: 40.0200, lng: 64.5200 },
  { id: 406, type: 'district', parentId: 13, nameUz: "Jondor tumani", nameRu: "Жондорский район", lat: 39.7400, lng: 64.1800 },
  { id: 407, type: 'district', parentId: 13, nameUz: "Kogon tumani", nameRu: "Каганский район", lat: 39.7100, lng: 64.5400 },
  { id: 408, type: 'district', parentId: 13, nameUz: "Qorako'l tumani", nameRu: "Каракульский район", lat: 39.5000, lng: 63.8500 },
  { id: 409, type: 'district', parentId: 13, nameUz: "Olot tumani", nameRu: "Алатский район", lat: 39.4100, lng: 63.8000 },
  { id: 410, type: 'district', parentId: 13, nameUz: "Romitan tumani", nameRu: "Ромитанский район", lat: 39.9300, lng: 64.3800 },
  { id: 411, type: 'district', parentId: 13, nameUz: "Shofirkon tumani", nameRu: "Шафирканский район", lat: 40.1200, lng: 64.5000 },
  { id: 412, type: 'district', parentId: 13, nameUz: "Peshku tumani (Yangibozor)", nameRu: "Пешкунский район", lat: 40.0300, lng: 64.3200 },
  { id: 413, type: 'district', parentId: 13, nameUz: "Qorovulbozor tumani", nameRu: "Караулбазарский район", lat: 39.5000, lng: 64.7900 },

  // ==============================================================================
  // 6. ANDIJON VILOYATI (Barcha tumanlar va shaharlar - to'liq)
  // ==============================================================================
  { id: 501, type: 'district', parentId: 14, nameUz: "Andijon shahri", nameRu: "г. Андижан", lat: 40.7821, lng: 72.3442 },
  { id: 502, type: 'district', parentId: 14, nameUz: "Xonobod shahri", nameRu: "г. Ханабад", lat: 40.8000, lng: 73.0000 },
  { id: 503, type: 'district', parentId: 14, nameUz: "Andijon tumani (Kuyganyor)", nameRu: "Андижанский район", lat: 40.8600, lng: 72.3200 },
  { id: 504, type: 'district', parentId: 14, nameUz: "Asaka tumani", nameRu: "Асакинский район", lat: 40.6400, lng: 72.2400 },
  { id: 505, type: 'district', parentId: 14, nameUz: "Shahrixon tumani", nameRu: "Шахриханский район", lat: 40.7100, lng: 72.0500 },
  { id: 506, type: 'district', parentId: 14, nameUz: "Xo'jaobod tumani", nameRu: "Ходжаабадский район", lat: 40.6700, lng: 72.5600 },
  { id: 507, type: 'district', parentId: 14, nameUz: "Baliqchi tumani", nameRu: "Балыкчинский район", lat: 40.9300, lng: 71.9000 },
  { id: 508, type: 'district', parentId: 14, nameUz: "Bo'ston tumani (Bo'z)", nameRu: "Бозский район", lat: 40.7000, lng: 71.9200 },
  { id: 509, type: 'district', parentId: 14, nameUz: "Buloqboshi tumani", nameRu: "Булакбашинский район", lat: 40.6200, lng: 72.4800 },
  { id: 510, type: 'district', parentId: 14, nameUz: "Izboskan tumani (Poytug')", nameRu: "Избасканский район", lat: 40.9000, lng: 72.2500 },
  { id: 511, type: 'district', parentId: 14, nameUz: "Jalaquduq tumani (Oxunboboyev)", nameRu: "Джалакудукский район", lat: 40.7200, lng: 72.6300 },
  { id: 512, type: 'district', parentId: 14, nameUz: "Marhamat tumani", nameRu: "Мархаматский район", lat: 40.5000, lng: 72.3300 },
  { id: 513, type: 'district', parentId: 14, nameUz: "Oltinko'l tumani", nameRu: "Алтынкульский район", lat: 40.8000, lng: 72.1700 },
  { id: 514, type: 'district', parentId: 14, nameUz: "Paxtaobod tumani", nameRu: "Пахтаабадский район", lat: 40.9300, lng: 72.5000 },
  { id: 515, type: 'district', parentId: 14, nameUz: "Qo'rg'ontepa tumani (Qorasuv)", nameRu: "Кургантепинский район", lat: 40.7300, lng: 72.7600 },
  { id: 516, type: 'district', parentId: 14, nameUz: "Ulug'nor tumani (Oqoltin)", nameRu: "Улугнорский район", lat: 40.7400, lng: 71.7400 },

  // ==============================================================================
  // 7. FARG'ONA VILOYATI (Barcha tumanlar va shaharlar - to'liq)
  // ==============================================================================
  { id: 601, type: 'district', parentId: 15, nameUz: "Farg'ona shahri", nameRu: "г. Фергана", lat: 40.3842, lng: 71.7843 },
  { id: 602, type: 'district', parentId: 15, nameUz: "Marg'ilon shahri", nameRu: "г. Маргилан", lat: 40.4700, lng: 71.7100 },
  { id: 603, type: 'district', parentId: 15, nameUz: "Qo'qon shahri", nameRu: "г. Коканд", lat: 40.5300, lng: 70.9400 },
  { id: 604, type: 'district', parentId: 15, nameUz: "Quvasoy shahri", nameRu: "г. Кувасай", lat: 40.3000, lng: 72.0600 },
  { id: 605, type: 'district', parentId: 15, nameUz: "Quva tumani", nameRu: "Кувинский район", lat: 40.5200, lng: 72.0700 },
  { id: 606, type: 'district', parentId: 15, nameUz: "Oltiariq tumani", nameRu: "Алтыарыкский район", lat: 40.3900, lng: 71.4900 },
  { id: 607, type: 'district', parentId: 15, nameUz: "Rishton tumani", nameRu: "Риштанский район", lat: 40.3500, lng: 71.2800 },
  { id: 608, type: 'district', parentId: 15, nameUz: "Bag'dod tumani", nameRu: "Багдадский район", lat: 40.4600, lng: 71.2200 },
  { id: 609, type: 'district', parentId: 15, nameUz: "Beshariq tumani", nameRu: "Бешарыкский район", lat: 40.4300, lng: 70.6100 },
  { id: 610, type: 'district', parentId: 15, nameUz: "Buvayda tumani (Ibrat)", nameRu: "Бувайдинский район", lat: 40.5900, lng: 71.1000 },
  { id: 611, type: 'district', parentId: 15, nameUz: "Dang'ara tumani", nameRu: "Дангаринский район", lat: 40.5800, lng: 70.9100 },
  { id: 612, type: 'district', parentId: 15, nameUz: "Farg'ona tumani (Vodil)", nameRu: "Ферганский район", lat: 40.2300, lng: 71.7400 },
  { id: 613, type: 'district', parentId: 15, nameUz: "Furqat tumani (Navbahor)", nameRu: "Фуркатский район", lat: 40.5200, lng: 70.8000 },
  { id: 614, type: 'district', parentId: 15, nameUz: "Qo'shtepa tumani (Langar)", nameRu: "Куштепинский район", lat: 40.4300, lng: 71.6000 },
  { id: 615, type: 'district', parentId: 15, nameUz: "So'x tumani (Ravon)", nameRu: "Сохский район", lat: 39.9600, lng: 71.1300 },
  { id: 616, type: 'district', parentId: 15, nameUz: "Toshloq tumani", nameRu: "Ташлакский район", lat: 40.5200, lng: 71.7900 },
  { id: 617, type: 'district', parentId: 15, nameUz: "Uchko'prik tumani", nameRu: "Учкуприкский район", lat: 40.5400, lng: 71.0600 },
  { id: 618, type: 'district', parentId: 15, nameUz: "O'zbekiston tumani (Yaypan)", nameRu: "Узбекистанский район", lat: 40.4500, lng: 70.7300 },
  { id: 619, type: 'district', parentId: 15, nameUz: "Yozyovon tumani", nameRu: "Язъяванский район", lat: 40.6600, lng: 71.7500 },

  // ==============================================================================
  // 8. NAMANGAN VILOYATI (Barcha tumanlar va shaharlar - to'liq)
  // ==============================================================================
  { id: 701, type: 'district', parentId: 16, nameUz: "Namangan shahri", nameRu: "г. Наманган", lat: 40.9983, lng: 71.6726 },
  { id: 702, type: 'district', parentId: 16, nameUz: "Davlatobod tumani", nameRu: "Давлатабадский район", lat: 41.0120, lng: 71.6320 },
  { id: 703, type: 'district', parentId: 16, nameUz: "Yangi Namangan tumani", nameRu: "Янги Наманганский район", lat: 41.0310, lng: 71.6900 },
  { id: 704, type: 'district', parentId: 16, nameUz: "Chortoq tumani", nameRu: "Чартакский район", lat: 41.0700, lng: 71.8200 },
  { id: 705, type: 'district', parentId: 16, nameUz: "Chust tumani", nameRu: "Чустский район", lat: 41.0000, lng: 71.2300 },
  { id: 706, type: 'district', parentId: 16, nameUz: "Kosonsoy tumani", nameRu: "Касансайский район", lat: 41.2500, lng: 71.5500 },
  { id: 707, type: 'district', parentId: 16, nameUz: "Mingbuloq tumani (Jomasho'y)", nameRu: "Мингбулакский район", lat: 40.8200, lng: 71.5000 },
  { id: 708, type: 'district', parentId: 16, nameUz: "Namangan tumani (Toshbuloq)", nameRu: "Наманганский район", lat: 40.9400, lng: 71.6000 },
  { id: 709, type: 'district', parentId: 16, nameUz: "Norin tumani (Haqqulobod)", nameRu: "Нарынский район", lat: 40.8800, lng: 72.0300 },
  { id: 710, type: 'district', parentId: 16, nameUz: "Pop tumani", nameRu: "Папский район", lat: 40.8700, lng: 71.1000 },
  { id: 711, type: 'district', parentId: 16, nameUz: "To'raqo'rg'on tumani", nameRu: "Туракурганский район", lat: 41.0100, lng: 71.5100 },
  { id: 712, type: 'district', parentId: 16, nameUz: "Uychi tumani", nameRu: "Уйчинский район", lat: 41.0900, lng: 71.9100 },
  { id: 713, type: 'district', parentId: 16, nameUz: "Uchqo'rg'on tumani", nameRu: "Учкурганский район", lat: 41.1100, lng: 72.0800 },
  { id: 714, type: 'district', parentId: 16, nameUz: "Yangiqo'rg'on tumani", nameRu: "Янгикурганский район", lat: 41.1900, lng: 71.7300 },

  // ==============================================================================
  // 9. QASHQADARYO VILOYATI (Barcha tumanlar va shaharlar - to'liq)
  // ==============================================================================
  { id: 801, type: 'district', parentId: 17, nameUz: "Qarshi shahri", nameRu: "г. Карши", lat: 38.8606, lng: 65.7891 },
  { id: 802, type: 'district', parentId: 17, nameUz: "Shahrisabz shahri", nameRu: "г. Шахрисабз", lat: 39.0500, lng: 66.8300 },
  { id: 803, type: 'district', parentId: 17, nameUz: "Qarshi tumani (Beshkent)", nameRu: "Каршинский район", lat: 38.8200, lng: 65.7200 },
  { id: 804, type: 'district', parentId: 17, nameUz: "Shahrisabz tumani", nameRu: "Шахрисабзский район", lat: 39.0600, lng: 66.8400 },
  { id: 805, type: 'district', parentId: 17, nameUz: "Kitob tumani", nameRu: "Китабский район", lat: 39.1200, lng: 66.8800 },
  { id: 806, type: 'district', parentId: 17, nameUz: "Chiroqchi tumani", nameRu: "Чиракчинский район", lat: 39.0300, lng: 66.5700 },
  { id: 807, type: 'district', parentId: 17, nameUz: "Ko'kdala tumani (Yettitom)", nameRu: "Кукдалинский район", lat: 39.1500, lng: 66.3000 },
  { id: 808, type: 'district', parentId: 17, nameUz: "Dehqonobod tumani (Qorashina)", nameRu: "Дехканабадский район", lat: 38.3400, lng: 66.5000 },
  { id: 809, type: 'district', parentId: 17, nameUz: "G'uzor tumani", nameRu: "Гузарский район", lat: 38.6200, lng: 66.2500 },
  { id: 810, type: 'district', parentId: 17, nameUz: "Qamashi tumani", nameRu: "Камашинский район", lat: 38.8200, lng: 66.4700 },
  { id: 811, type: 'district', parentId: 17, nameUz: "Koson tumani", nameRu: "Касанский район", lat: 39.0400, lng: 65.5800 },
  { id: 812, type: 'district', parentId: 17, nameUz: "Kasbi tumani (Mug'lon)", nameRu: "Касбийский район", lat: 38.8600, lng: 65.4200 },
  { id: 813, type: 'district', parentId: 17, nameUz: "Mirishkor tumani (Yangi Mirishkor)", nameRu: "Миришкорский район", lat: 38.8700, lng: 65.1300 },
  { id: 814, type: 'district', parentId: 17, nameUz: "Muborak tumani", nameRu: "Мубарекский район", lat: 39.2600, lng: 65.1500 },
  { id: 815, type: 'district', parentId: 17, nameUz: "Nishon tumani (Yangi Nishon)", nameRu: "Нишанский район", lat: 38.6500, lng: 65.6800 },
  { id: 816, type: 'district', parentId: 17, nameUz: "Yakkabog' tumani", nameRu: "Яккабагский район", lat: 38.9800, lng: 66.6800 },

  // ==============================================================================
  // 10. SURXONDARYO VILOYATI (Barcha tumanlar va shaharlar - to'liq)
  // ==============================================================================
  { id: 901, type: 'district', parentId: 18, nameUz: "Termiz shahri", nameRu: "г. Термез", lat: 37.2286, lng: 67.2783 },
  { id: 902, type: 'district', parentId: 18, nameUz: "Termiz tumani (Uchqizil)", nameRu: "Термезский район", lat: 37.3600, lng: 67.2800 },
  { id: 903, type: 'district', parentId: 18, nameUz: "Denov tumani", nameRu: "Денауский район", lat: 38.2700, lng: 67.8900 },
  { id: 904, type: 'district', parentId: 18, nameUz: "Angor tumani", nameRu: "Ангорский район", lat: 37.4700, lng: 67.1400 },
  { id: 905, type: 'district', parentId: 18, nameUz: "Bandixon tumani", nameRu: "Бандиханский район", lat: 37.7500, lng: 67.2900 },
  { id: 906, type: 'district', parentId: 18, nameUz: "Boysun tumani", nameRu: "Байсунский район", lat: 38.2000, lng: 67.2000 },
  { id: 907, type: 'district', parentId: 18, nameUz: "Jarqo'rg'on tumani", nameRu: "Джаркурганский район", lat: 37.5100, lng: 67.4100 },
  { id: 908, type: 'district', parentId: 18, nameUz: "Muzrabot tumani (Xalqobod)", nameRu: "Музрабадский район", lat: 37.3500, lng: 66.8600 },
  { id: 909, type: 'district', parentId: 18, nameUz: "Oltinsoy tumani (Qarluq)", nameRu: "Алтынсайский район", lat: 38.4100, lng: 67.8500 },
  { id: 910, type: 'district', parentId: 18, nameUz: "Qiziriq tumani (Sariq)", nameRu: "Кизирикский район", lat: 37.6400, lng: 67.2400 },
  { id: 911, type: 'district', parentId: 18, nameUz: "Qumqo'rg'on tumani", nameRu: "Кумкурганский район", lat: 37.8200, lng: 67.5800 },
  { id: 912, type: 'district', parentId: 18, nameUz: "Sariosiyo tumani", nameRu: "Сариасийский район", lat: 38.4300, lng: 67.9500 },
  { id: 913, type: 'district', parentId: 18, nameUz: "Sherobod tumani", nameRu: "Шерабадский район", lat: 37.6700, lng: 66.9700 },
  { id: 914, type: 'district', parentId: 18, nameUz: "Sho'rchi tumani", nameRu: "Шурчинский район", lat: 38.0000, lng: 67.7800 },
  { id: 915, type: 'district', parentId: 18, nameUz: "Uzun tumani", nameRu: "Узунский район", lat: 38.3500, lng: 68.1000 },

  // ==============================================================================
  // 11. JIZZAX VILOYATI (Barcha tumanlar va shaharlar - to'liq)
  // ==============================================================================
  { id: 1001, type: 'district', parentId: 19, nameUz: "Jizzax shahri", nameRu: "г. Джизак", lat: 40.1158, lng: 67.8422 },
  { id: 1002, type: 'district', parentId: 19, nameUz: "Sharof Rashidov tumani (Uchtepa)", nameRu: "Шараф-Рашидовский район", lat: 40.1000, lng: 67.9000 },
  { id: 1003, type: 'district', parentId: 19, nameUz: "Zomin tumani", nameRu: "Зааминский район", lat: 39.9600, lng: 68.4000 },
  { id: 1004, type: 'district', parentId: 19, nameUz: "Baxmal tumani (O'smat)", nameRu: "Бахмальский район", lat: 39.7800, lng: 68.4100 },
  { id: 1005, type: 'district', parentId: 19, nameUz: "G'allaorol tumani", nameRu: "Галляаральский район", lat: 40.0200, lng: 67.5900 },
  { id: 1006, type: 'district', parentId: 19, nameUz: "Do'stlik tumani", nameRu: "Дустликский район", lat: 40.5300, lng: 68.0300 },
  { id: 1007, type: 'district', parentId: 19, nameUz: "Forish tumani (Yangiqishloq)", nameRu: "Фаришский район", lat: 40.5800, lng: 67.1800 },
  { id: 1008, type: 'district', parentId: 19, nameUz: "Mirzacho'l tumani (Gagarin)", nameRu: "Мирзачульский район", lat: 40.6600, lng: 68.1800 },
  { id: 1009, type: 'district', parentId: 19, nameUz: "Paxtakor tumani", nameRu: "Пахтакорский район", lat: 40.3100, lng: 67.9500 },
  { id: 1010, type: 'district', parentId: 19, nameUz: "Yangiobod tumani (Balandchaqir)", nameRu: "Янгиабадский район", lat: 40.0500, lng: 68.8200 },
  { id: 1011, type: 'district', parentId: 19, nameUz: "Zafarobod tumani", nameRu: "Зафарабадский район", lat: 40.3800, lng: 67.8700 },
  { id: 1012, type: 'district', parentId: 19, nameUz: "Zarbdor tumani", nameRu: "Зарбдарский район", lat: 40.1000, lng: 68.1600 },
  { id: 1013, type: 'district', parentId: 19, nameUz: "Arnasoy tumani (G'oliblar)", nameRu: "Арнасайский район", lat: 40.4800, lng: 67.7500 },

  // ==============================================================================
  // 12. SIRDARYO VILOYATI (Barcha tumanlar va shaharlar - to'liq)
  // ==============================================================================
  { id: 1101, type: 'district', parentId: 20, nameUz: "Guliston shahri", nameRu: "г. Гулистан", lat: 40.4939, lng: 68.7844 },
  { id: 1102, type: 'district', parentId: 20, nameUz: "Shirin shahri", nameRu: "г. Ширин", lat: 40.2300, lng: 69.1700 },
  { id: 1103, type: 'district', parentId: 20, nameUz: "Yangiyer shahri", nameRu: "г. Янгиер", lat: 40.2700, lng: 68.8200 },
  { id: 1104, type: 'district', parentId: 20, nameUz: "Guliston tumani (Dehqonobod)", nameRu: "Гулистанский район", lat: 40.5300, lng: 68.8400 },
  { id: 1105, type: 'district', parentId: 20, nameUz: "Boyovut tumani", nameRu: "Баяутский район", lat: 40.4200, lng: 68.9700 },
  { id: 1106, type: 'district', parentId: 20, nameUz: "Mirzaobod tumani (Navro'z)", nameRu: "Мирзаабадский район", lat: 40.4800, lng: 68.6400 },
  { id: 1107, type: 'district', parentId: 20, nameUz: "Oqoltin tumani (Sardoba)", nameRu: "Акалтынский район", lat: 40.4300, lng: 68.3200 },
  { id: 1108, type: 'district', parentId: 20, nameUz: "Sardoba tumani (Paxtaobod)", nameRu: "Сардобинский район", lat: 40.2500, lng: 68.4200 },
  { id: 1109, type: 'district', parentId: 20, nameUz: "Sayxunobod tumani (Sayxun)", nameRu: "Сайхунабадский район", lat: 40.6700, lng: 68.8800 },
  { id: 1110, type: 'district', parentId: 20, nameUz: "Sirdaryo tumani (Baxt sh.)", nameRu: "Сырдарьинский район", lat: 40.8400, lng: 68.6600 },
  { id: 1111, type: 'district', parentId: 20, nameUz: "Xovos tumani", nameRu: "Хавастский район", lat: 40.2100, lng: 68.8500 },

  // ==============================================================================
  // 13. NAVOIY VILOYATI (Barcha tumanlar va shaharlar - to'liq)
  // ==============================================================================
  { id: 1201, type: 'district', parentId: 21, nameUz: "Navoiy shahri", nameRu: "г. Навои", lat: 40.0844, lng: 65.3792 },
  { id: 1202, type: 'district', parentId: 21, nameUz: "Zarafshon shahri", nameRu: "г. Зарафшан", lat: 41.5700, lng: 64.2000 },
  { id: 1203, type: 'district', parentId: 21, nameUz: "Karmana tumani", nameRu: "Карманинский район", lat: 40.1400, lng: 65.3600 },
  { id: 1204, type: 'district', parentId: 21, nameUz: "Qiziltepa tumani", nameRu: "Кызылтепинский район", lat: 40.0300, lng: 64.8200 },
  { id: 1205, type: 'district', parentId: 21, nameUz: "Xatirchi tumani (Yangirabot)", nameRu: "Хатырчинский район", lat: 40.0200, lng: 65.9500 },
  { id: 1206, type: 'district', parentId: 21, nameUz: "Navbahor tumani (Beshrabot)", nameRu: "Навбахорский район", lat: 40.2300, lng: 65.4100 },
  { id: 1207, type: 'district', parentId: 21, nameUz: "Nurota tumani", nameRu: "Нуратинский район", lat: 40.5600, lng: 65.6900 },
  { id: 1208, type: 'district', parentId: 21, nameUz: "Konimex tumani", nameRu: "Канимехский район", lat: 40.2800, lng: 65.1600 },
  { id: 1209, type: 'district', parentId: 21, nameUz: "Tomdi tumani (Tomdibuloq)", nameRu: "Тамдынский район", lat: 41.6000, lng: 64.6000 },
  { id: 1210, type: 'district', parentId: 21, nameUz: "Uchquduq tumani", nameRu: "Учкудукский район", lat: 42.1500, lng: 63.5500 },

  // ==============================================================================
  // 14. XORAZM VILOYATI (Barcha tumanlar va shaharlar - to'liq)
  // ==============================================================================
  { id: 1301, type: 'district', parentId: 22, nameUz: "Urganch shahri", nameRu: "г. Ургенч", lat: 41.5562, lng: 60.6313 },
  { id: 1302, type: 'district', parentId: 22, nameUz: "Xiva shahri", nameRu: "г. Хива", lat: 41.3783, lng: 60.3639 },
  { id: 1303, type: 'district', parentId: 22, nameUz: "Urganch tumani (Qorovul)", nameRu: "Ургенчский район", lat: 41.5900, lng: 60.5500 },
  { id: 1304, type: 'district', parentId: 22, nameUz: "Xiva tumani", nameRu: "Хивинский район", lat: 41.3800, lng: 60.3500 },
  { id: 1305, type: 'district', parentId: 22, nameUz: "Bog'ot tumani", nameRu: "Багатский район", lat: 41.3500, lng: 60.8200 },
  { id: 1306, type: 'district', parentId: 22, nameUz: "Gurlan tumani", nameRu: "Гурленский район", lat: 41.8500, lng: 60.4000 },
  { id: 1307, type: 'district', parentId: 22, nameUz: "Xonqa tumani", nameRu: "Ханкинский район", lat: 41.4700, lng: 60.7700 },
  { id: 1308, type: 'district', parentId: 22, nameUz: "Hazorasp tumani", nameRu: "Хазараспский район", lat: 41.3200, lng: 61.0700 },
  { id: 1309, type: 'district', parentId: 22, nameUz: "Qo'shko'prik tumani", nameRu: "Кошкупырский район", lat: 41.5300, lng: 60.3500 },
  { id: 1310, type: 'district', parentId: 22, nameUz: "Shovot tumani", nameRu: "Шаватский район", lat: 41.6700, lng: 60.3000 },
  { id: 1311, type: 'district', parentId: 22, nameUz: "Yangiariq tumani", nameRu: "Янгиарыкский район", lat: 41.3600, lng: 60.6000 },
  { id: 1312, type: 'district', parentId: 22, nameUz: "Yangibozor tumani", nameRu: "Янгибазарский район", lat: 41.7300, lng: 60.5800 },
  { id: 1313, type: 'district', parentId: 22, nameUz: "Tuproqqal'a tumani (Pitonak)", nameRu: "Тупраккалинский район", lat: 41.2200, lng: 61.3100 },
];

/**
 * Calculate Haversine distance in km between two GPS coordinates
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}
