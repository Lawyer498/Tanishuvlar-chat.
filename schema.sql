-- ==============================================================================
-- TANISHUV UZ - PostgreSQL Database Schema
-- Production Ready Schema for Telegram Mini App & Bot
-- Target Market: Uzbekistan (Latin Script)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "cube";
CREATE EXTENSION IF NOT EXISTS "earthdistance";

-- 2. ENUMS
DO $$ BEGIN
    CREATE TYPE location_type AS ENUM ('republic', 'region', 'district');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE republic_type AS ENUM ('uzbekistan', 'karakalpakstan');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE gender_type AS ENUM ('male', 'female');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE interaction_action AS ENUM ('like', 'skip', 'super_like');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_currency AS ENUM ('USD', 'UZS', 'XTR');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_method_type AS ENUM ('payme', 'click', 'stars');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE transaction_status AS ENUM ('pending', 'success', 'failed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. LOCATIONS TABLE (Republic -> Region -> District)
CREATE TABLE IF NOT EXISTS locations (
    id SERIAL PRIMARY KEY,
    type location_type NOT NULL,
    parent_id INT REFERENCES locations(id) ON DELETE CASCADE,
    name_uz VARCHAR(150) NOT NULL,
    name_ru VARCHAR(150) NOT NULL,
    sort_order INT DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_locations_parent_id ON locations(parent_id);
CREATE INDEX IF NOT EXISTS idx_locations_type ON locations(type);

-- 4. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    telegram_id BIGINT UNIQUE NOT NULL,
    username VARCHAR(64),
    phone_number VARCHAR(32),

    -- Profile Information
    name VARCHAR(100),
    age INT CHECK (age IS NULL OR age > 17),
    gender gender_type,
    bio TEXT,
    photos TEXT[] DEFAULT '{}',
    is_verified BOOLEAN DEFAULT FALSE,
    profile_completed BOOLEAN DEFAULT FALSE,

    -- Location Hierarchy (CRITICAL)
    republic republic_type DEFAULT 'uzbekistan',
    region_id INT REFERENCES locations(id) ON DELETE SET NULL,
    district_id INT REFERENCES locations(id) ON DELETE SET NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),

    -- Monetization & Stats
    is_vip BOOLEAN DEFAULT FALSE,
    vip_expires_at TIMESTAMP WITH TIME ZONE,
    coins INT DEFAULT 0 CHECK (coins >= 0),
    referral_code VARCHAR(32) UNIQUE NOT NULL,
    referred_by UUID REFERENCES users(id) ON DELETE SET NULL,
    referral_reward_claimed BOOLEAN DEFAULT FALSE,

    -- Daily Interaction Limits
    daily_likes_count INT DEFAULT 0,
    last_reset_date DATE DEFAULT CURRENT_DATE,

    -- Status & Moderation
    is_banned BOOLEAN DEFAULT FALSE,
    ban_reason TEXT,
    last_active_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_telegram_id ON users(telegram_id);
CREATE INDEX IF NOT EXISTS idx_users_gender ON users(gender);
CREATE INDEX IF NOT EXISTS idx_users_region_id ON users(region_id);
CREATE INDEX IF NOT EXISTS idx_users_district_id ON users(district_id);
CREATE INDEX IF NOT EXISTS idx_users_is_vip ON users(is_vip);
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON users(referral_code);
CREATE INDEX IF NOT EXISTS idx_users_location_lat_lng ON users(latitude, longitude);

-- 5. INTERACTIONS TABLE (Like, Skip, Super Like)
CREATE TABLE IF NOT EXISTS interactions (
    id BIGSERIAL PRIMARY KEY,
    actor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action interaction_action NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_actor_target UNIQUE (actor_id, target_id),
    CONSTRAINT chk_not_self_interaction CHECK (actor_id <> target_id)
);

CREATE INDEX IF NOT EXISTS idx_interactions_actor_target ON interactions(actor_id, target_id);
CREATE INDEX IF NOT EXISTS idx_interactions_target_action ON interactions(target_id, action);

-- 6. MATCHES TABLE
CREATE TABLE IF NOT EXISTS matches (
    id BIGSERIAL PRIMARY KEY,
    user1_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user2_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    matched_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    CONSTRAINT uq_matches_pair UNIQUE (user1_id, user2_id),
    CONSTRAINT chk_match_order CHECK (user1_id < user2_id)
);

CREATE INDEX IF NOT EXISTS idx_matches_user1 ON matches(user1_id);
CREATE INDEX IF NOT EXISTS idx_matches_user2 ON matches(user2_id);

-- 7. MESSAGES TABLE (Chat within matches)
CREATE TABLE IF NOT EXISTS messages (
    id BIGSERIAL PRIMARY KEY,
    match_id BIGINT NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_messages_match_id ON messages(match_id, created_at);

-- 8. TRANSACTIONS TABLE (Payme, Click, Telegram Stars)
CREATE TABLE IF NOT EXISTS transactions (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount_usd DECIMAL(10, 2),
    amount_uzs BIGINT,
    currency payment_currency NOT NULL,
    payment_method payment_method_type NOT NULL,
    status transaction_status DEFAULT 'pending',
    vip_duration_days INT DEFAULT 0,
    coins_count INT DEFAULT 0,
    external_transaction_id VARCHAR(128),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);

-- 9. REPORTS TABLE (Moderation)
CREATE TABLE IF NOT EXISTS reports (
    id BIGSERIAL PRIMARY KEY,
    reporter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reported_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reason VARCHAR(255) NOT NULL,
    comment TEXT,
    status VARCHAR(32) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);

-- ==============================================================================
-- SEED DATA: REPUBLICS & REGIONS & DISTRICTS
-- ==============================================================================

-- Republics
INSERT INTO locations (id, type, parent_id, name_uz, name_ru, sort_order) VALUES
(1, 'republic', NULL, 'O''zbekiston Respublikasi', 'Республика Узбекистан', 1),
(2, 'republic', NULL, 'Qoraqalpog''iston Respublikasi', 'Республика Каракалпакстан', 2)
ON CONFLICT (id) DO NOTHING;

-- Regions (O'zbekiston)
-- Notice Tashkent City has sort_order 1 to appear at the very top with star icon!
INSERT INTO locations (id, type, parent_id, name_uz, name_ru, sort_order) VALUES
(10, 'region', 1, 'Toshkent shahri ⭐', 'г. Ташкент ⭐', 1),
(11, 'region', 1, 'Toshkent viloyati', 'Ташкентская область', 2),
(12, 'region', 1, 'Samarqand viloyati', 'Самаркандская область', 3),
(13, 'region', 1, 'Buxoro viloyati', 'Бухарская область', 4),
(14, 'region', 1, 'Andijon viloyati', 'Андижанская область', 5),
(15, 'region', 1, 'Farg''ona viloyati', 'Ферганская область', 6),
(16, 'region', 1, 'Namangan viloyati', 'Наманганская область', 7),
(17, 'region', 1, 'Qashqadaryo viloyati', 'Кашкадарьинская область', 8),
(18, 'region', 1, 'Surxondaryo viloyati', 'Сурхандарьинская область', 9),
(19, 'region', 1, 'Jizzax viloyati', 'Джизакская область', 10),
(20, 'region', 1, 'Sirdaryo viloyati', 'Сырдарьинская область', 11),
(21, 'region', 1, 'Navoiy viloyati', 'Навоийская область', 12),
(22, 'region', 1, 'Xorazm viloyati', 'Хорезмская область', 13),
(23, 'region', 2, 'Qoraqalpog''iston hududi', 'Территория Каракалпакстана', 14)
ON CONFLICT (id) DO NOTHING;

-- -- Districts of Tashkent City (id 10) - 12 ta tuman to'liq
INSERT INTO locations (type, parent_id, name_uz, name_ru) VALUES
('district', 10, 'Yunusobod tumani', 'Юнусабадский район'),
('district', 10, 'Chilonzor tumani', 'Чиланзарский район'),
('district', 10, 'Mirzo Ulug''bek tumani', 'Мирзо-Улугбекский район'),
('district', 10, 'Yakkasaroy tumani', 'Яккасарайский район'),
('district', 10, 'Mirobod tumani', 'Мирабадский район'),
('district', 10, 'Shayxontohur tumani', 'Шайхантахурский район'),
('district', 10, 'Olmazor tumani', 'Алмазарский район'),
('district', 10, 'Uchtepa tumani', 'Учтепинский район'),
('district', 10, 'Sergeli tumani', 'Сергелийский район'),
('district', 10, 'Yangihayot tumani', 'Янгихаётский район'),
('district', 10, 'Bektemir tumani', 'Бектемирский район'),
('district', 10, 'Yashnobod tumani', 'Яшнабадский район');

-- Districts of Karakalpakstan (id 23) - 16 tuman va shaharlar to'liq
INSERT INTO locations (type, parent_id, name_uz, name_ru) VALUES
('district', 23, 'Nukus shahri (Poytaxt)', 'г. Нукус (Столица)'),
('district', 23, 'Taxiatosh shahri', 'г. Тахиаташ'),
('district', 23, 'Amudaryo tumani (Mang''it)', 'Амударьинский район'),
('district', 23, 'Beruniy tumani', 'Берунийский район'),
('district', 23, 'Bo''zatov tumani', 'Бозатауский район'),
('district', 23, 'Chimboy tumani', 'Чимбайский район'),
('district', 23, 'Ellikqal''a tumani (Bo''ston)', 'Элликкалинский район'),
('district', 23, 'Kegeyli tumani', 'Кегейлийский район'),
('district', 23, 'Mo''ynoq tumani', 'Муйнакский район'),
('district', 23, 'Nukus tumani (Oqmang''it)', 'Нукусский район'),
('district', 23, 'Qanliko''l tumani', 'Канлыкульский район'),
('district', 23, 'Qo''ng''irot tumani', 'Кунградский район'),
('district', 23, 'Qorao''zak tumani', 'Караузякский район'),
('district', 23, 'Shumanay tumani', 'Шуманайский район'),
('district', 23, 'Taxtako''pir tumani', 'Тахтакупырский район'),
('district', 23, 'To''rtko''l tumani', 'Турткульский район'),
('district', 23, 'Xo''jayli tumani', 'Ходжейлийский район');

-- Districts of Tashkent Region (id 11) - to'liq
INSERT INTO locations (type, parent_id, name_uz, name_ru) VALUES
('district', 11, 'Nurafshon shahri (Viloyat markazi)', 'г. Нурафшан'),
('district', 11, 'Chirchiq shahri', 'г. Чирчик'),
('district', 11, 'Olmaliq shahri', 'г. Алмалык'),
('district', 11, 'Angren shahri', 'г. Ангрен'),
('district', 11, 'Bekobod shahri', 'г. Бекабад'),
('district', 11, 'Yangiyo''l shahri', 'г. Янгиюль'),
('district', 11, 'Ohangaron shahri', 'г. Ахангаран'),
('district', 11, 'Bo''stonliq tumani (Chorvoq)', 'Бостанлыкский район'),
('district', 11, 'Zangiota tumani', 'Зангиатинский район'),
('district', 11, 'Qibray tumani', 'Кибрайский район'),
('district', 11, 'Toshkent tumani (Keles)', 'Ташкентский район'),
('district', 11, 'Parkent tumani', 'Паркентский район'),
('district', 11, 'Yangiyo''l tumani', 'Янгиюльский район'),
('district', 11, 'Chinoz tumani', 'Чиназский район'),
('district', 11, 'Yuqori Chirchiq tumani', 'Юкоричирчикский район'),
('district', 11, 'O''rta Chirchiq tumani', 'Уртачирчикский район'),
('district', 11, 'Quyi Chirchiq tumani', 'Куйичирчикский район'),
('district', 11, 'Bekobod tumani', 'Бекабадский район'),
('district', 11, 'Bo''ka tumani', 'Букинский район'),
('district', 11, 'Piskent tumani', 'Пскентский район'),
('district', 11, 'Oqqo''rg''on tumani', 'Аккурганский район'),
('district', 11, 'Ohangaron tumani', 'Ахангаранский район');

-- Districts of Samarkand (id 12) - to'liq
INSERT INTO locations (type, parent_id, name_uz, name_ru) VALUES
('district', 12, 'Samarqand shahri', 'г. Самарканд'),
('district', 12, 'Kattaqo''rg''on shahri', 'г. Каттакурган'),
('district', 12, 'Samarqand tumani', 'Самаркандский район'),
('district', 12, 'Urgut tumani', 'Ургутский район'),
('district', 12, 'Pastdarg''om tumani', 'Пастдаргомский район'),
('district', 12, 'Ishtixon tumani', 'Иштыханский район'),
('district', 12, 'Bulung''ur tumani', 'Булунгурский район'),
('district', 12, 'Jomboy tumani', 'Джамбайский район'),
('district', 12, 'Payariq tumani', 'Пайарыкский район'),
('district', 12, 'Toyloq tumani', 'Тайлакский район'),
('district', 12, 'Oqdaryo tumani', 'Акдарьинский район'),
('district', 12, 'Narpay tumani', 'Нарпайский район'),
('district', 12, 'Kattaqo''rg''on tumani', 'Каттакурганский район'),
('district', 12, 'Paxtachi tumani', 'Пахтачийский район'),
('district', 12, 'Qo''shrabot tumani', 'Кошрабадский район'),
('district', 12, 'Nurobod tumani', 'Нурабадский район');

-- Districts of Bukhara (id 13) - to'liq
INSERT INTO locations (type, parent_id, name_uz, name_ru) VALUES
('district', 13, 'Buxoro shahri', 'г. Бухара'),
('district', 13, 'Kogon shahri', 'г. Каган'),
('district', 13, 'Buxoro tumani', 'Бухарский район'),
('district', 13, 'G''ijduvon tumani', 'Гиждуванский район'),
('district', 13, 'Vobkent tumani', 'Вабкентский район'),
('district', 13, 'Jondor tumani', 'Жондорский район'),
('district', 13, 'Kogon tumani', 'Каганский район'),
('district', 13, 'Qorako''l tumani', 'Каракульский район'),
('district', 13, 'Olot tumani', 'Алатский район'),
('district', 13, 'Romitan tumani', 'Ромитанский район'),
('district', 13, 'Shofirkon tumani', 'Шафирканский район'),
('district', 13, 'Peshku tumani', 'Пешкунский район'),
('district', 13, 'Qorovulbozor tumani', 'Караулбазарский район');

-- Districts of Andijan (id 14) - to'liq
INSERT INTO locations (type, parent_id, name_uz, name_ru) VALUES
('district', 14, 'Andijon shahri', 'г. Андижан'),
('district', 14, 'Xonobod shahri', 'г. Ханабад'),
('district', 14, 'Andijon tumani', 'Андижанский район'),
('district', 14, 'Asaka tumani', 'Асакинский район'),
('district', 14, 'Shahrixon tumani', 'Шахриханский район'),
('district', 14, 'Xo''jaobod tumani', 'Ходжаабадский район'),
('district', 14, 'Baliqchi tumani', 'Балыкчинский район'),
('district', 14, 'Bo''ston tumani (Bo''z)', 'Бозский район'),
('district', 14, 'Buloqboshi tumani', 'Булакбашинский район'),
('district', 14, 'Izboskan tumani', 'Избасканский район'),
('district', 14, 'Jalaquduq tumani', 'Джалакудукский район'),
('district', 14, 'Marhamat tumani', 'Мархаматский район'),
('district', 14, 'Oltinko''l tumani', 'Алтынкульский район'),
('district', 14, 'Paxtaobod tumani', 'Пахтаабадский район'),
('district', 14, 'Qo''rg''ontepa tumani', 'Кургантепинский район'),
('district', 14, 'Ulug''nor tumani', 'Улугнорский район');

-- Districts of Fergana (id 15) - to'liq
INSERT INTO locations (type, parent_id, name_uz, name_ru) VALUES
('district', 15, 'Farg''ona shahri', 'г. Фергана'),
('district', 15, 'Marg''ilon shahri', 'г. Маргилан'),
('district', 15, 'Qo''qon shahri', 'г. Коканд'),
('district', 15, 'Quvasoy shahri', 'г. Кувасай'),
('district', 15, 'Quva tumani', 'Кувинский район'),
('district', 15, 'Oltiariq tumani', 'Алтыарыкский район'),
('district', 15, 'Rishton tumani', 'Риштанский район'),
('district', 15, 'Bag''dod tumani', 'Багдадский район'),
('district', 15, 'Beshariq tumani', 'Бешарыкский район'),
('district', 15, 'Buvayda tumani', 'Бувайдинский район'),
('district', 15, 'Dang''ara tumani', 'Дангаринский район'),
('district', 15, 'Farg''ona tumani', 'Ферганский район'),
('district', 15, 'Furqat tumani', 'Фуркатский район'),
('district', 15, 'Qo''shtepa tumani', 'Куштепинский район'),
('district', 15, 'So''x tumani', 'Сохский район'),
('district', 15, 'Toshloq tumani', 'Ташлакский район'),
('district', 15, 'Uchko''prik tumani', 'Учкуприкский район'),
('district', 15, 'O''zbekiston tumani', 'Узбекистанский район'),
('district', 15, 'Yozyovon tumani', 'Язъяванский район');

-- Districts of Namangan (id 16) - to'liq
INSERT INTO locations (type, parent_id, name_uz, name_ru) VALUES
('district', 16, 'Namangan shahri', 'г. Наманган'),
('district', 16, 'Davlatobod tumani', 'Давлатабадский район'),
('district', 16, 'Yangi Namangan tumani', 'Янги Наманганский район'),
('district', 16, 'Chortoq tumani', 'Чартакский район'),
('district', 16, 'Chust tumani', 'Чустский район'),
('district', 16, 'Kosonsoy tumani', 'Касансайский район'),
('district', 16, 'Mingbuloq tumani', 'Мингбулакский район'),
('district', 16, 'Namangan tumani', 'Наманганский район'),
('district', 16, 'Norin tumani', 'Нарынский район'),
('district', 16, 'Pop tumani', 'Папский район'),
('district', 16, 'To''raqo''rg''on tumani', 'Туракурганский район'),
('district', 16, 'Uychi tumani', 'Уйчинский район'),
('district', 16, 'Uchqo''rg''on tumani', 'Учкурганский район'),
('district', 16, 'Yangiqo''rg''on tumani', 'Янгикурганский район');

-- Districts of Qashqadaryo (id 17) - to'liq
INSERT INTO locations (type, parent_id, name_uz, name_ru) VALUES
('district', 17, 'Qarshi shahri', 'г. Карши'),
('district', 17, 'Shahrisabz shahri', 'г. Шахрисабз'),
('district', 17, 'Qarshi tumani', 'Каршинский район'),
('district', 17, 'Shahrisabz tumani', 'Шахрисабзский район'),
('district', 17, 'Kitob tumani', 'Китабский район'),
('district', 17, 'Chiroqchi tumani', 'Чиракчинский район'),
('district', 17, 'Ko''kdala tumani', 'Кукдалинский район'),
('district', 17, 'Dehqonobod tumani', 'Дехканабадский район'),
('district', 17, 'G''uzor tumani', 'Гузарский район'),
('district', 17, 'Qamashi tumani', 'Камашинский район'),
('district', 17, 'Koson tumani', 'Касанский район'),
('district', 17, 'Kasbi tumani', 'Касбийский район'),
('district', 17, 'Mirishkor tumani', 'Миришкорский район'),
('district', 17, 'Muborak tumani', 'Мубарекский район'),
('district', 17, 'Nishon tumani', 'Нишанский район'),
('district', 17, 'Yakkabog'' tumani', 'Яккабагский район');

-- Districts of Surxondaryo (id 18) - to'liq
INSERT INTO locations (type, parent_id, name_uz, name_ru) VALUES
('district', 18, 'Termiz shahri', 'г. Термез'),
('district', 18, 'Termiz tumani', 'Термезский район'),
('district', 18, 'Denov tumani', 'Денауский район'),
('district', 18, 'Angor tumani', 'Ангорский район'),
('district', 18, 'Bandixon tumani', 'Бандиханский район'),
('district', 18, 'Boysun tumani', 'Байсунский район'),
('district', 18, 'Jarqo''rg''on tumani', 'Джаркурганский район'),
('district', 18, 'Muzrabot tumani', 'Музрабадский район'),
('district', 18, 'Oltinsoy tumani', 'Алтынсайский район'),
('district', 18, 'Qiziriq tumani', 'Кизирикский район'),
('district', 18, 'Qumqo''rg''on tumani', 'Кумкурганский район'),
('district', 18, 'Sariosiyo tumani', 'Сариасийский район'),
('district', 18, 'Sherobod tumani', 'Шерабадский район'),
('district', 18, 'Sho''rchi tumani', 'Шурчинский район'),
('district', 18, 'Uzun tumani', 'Узунский район');

-- Districts of Jizzax (id 19) - to'liq
INSERT INTO locations (type, parent_id, name_uz, name_ru) VALUES
('district', 19, 'Jizzax shahri', 'г. Джизак'),
('district', 19, 'Sharof Rashidov tumani', 'Шараф-Рашидовский район'),
('district', 19, 'Zomin tumani', 'Зааминский район'),
('district', 19, 'Baxmal tumani', 'Бахмальский район'),
('district', 19, 'G''allaorol tumani', 'Галляаральский район'),
('district', 19, 'Do''stlik tumani', 'Дустликский район'),
('district', 19, 'Forish tumani', 'Фаришский район'),
('district', 19, 'Mirzacho''l tumani', 'Мирзачульский район'),
('district', 19, 'Paxtakor tumani', 'Пахтакорский район'),
('district', 19, 'Yangiobod tumani', 'Янгиабадский район'),
('district', 19, 'Zafarobod tumani', 'Зафарабадский район'),
('district', 19, 'Zarbdor tumani', 'Зарбдарский район'),
('district', 19, 'Arnasoy tumani', 'Арнасайский район');

-- Districts of Sirdaryo (id 20) - to'liq
INSERT INTO locations (type, parent_id, name_uz, name_ru) VALUES
('district', 20, 'Guliston shahri', 'г. Гулистан'),
('district', 20, 'Shirin shahri', 'г. Ширин'),
('district', 20, 'Yangiyer shahri', 'г. Янгиер'),
('district', 20, 'Guliston tumani', 'Гулистанский район'),
('district', 20, 'Boyovut tumani', 'Баяутский район'),
('district', 20, 'Mirzaobod tumani', 'Мирзаабадский район'),
('district', 20, 'Oqoltin tumani', 'Акалтынский район'),
('district', 20, 'Sardoba tumani', 'Сардобинский район'),
('district', 20, 'Sayxunobod tumani', 'Сайхунабадский район'),
('district', 20, 'Sirdaryo tumani', 'Сырдарьинский район'),
('district', 20, 'Xovos tumani', 'Хавастский район');

-- Districts of Navoiy (id 21) - to'liq
INSERT INTO locations (type, parent_id, name_uz, name_ru) VALUES
('district', 21, 'Navoiy shahri', 'г. Навои'),
('district', 21, 'Zarafshon shahri', 'г. Зарафшан'),
('district', 21, 'Karmana tumani', 'Карманинский район'),
('district', 21, 'Qiziltepa tumani', 'Кызылтепинский район'),
('district', 21, 'Xatirchi tumani', 'Хатырчинский район'),
('district', 21, 'Navbahor tumani', 'Навбахорский район'),
('district', 21, 'Nurota tumani', 'Нуратинский район'),
('district', 21, 'Konimex tumani', 'Канимехский район'),
('district', 21, 'Tomdi tumani', 'Тамдынский район'),
('district', 21, 'Uchquduq tumani', 'Учкудукский район');

-- Districts of Xorazm (id 22) - to'liq
INSERT INTO locations (type, parent_id, name_uz, name_ru) VALUES
('district', 22, 'Urganch shahri', 'г. Ургенч'),
('district', 22, 'Xiva shahri', 'г. Хива'),
('district', 22, 'Urganch tumani', 'Ургенчский район'),
('district', 22, 'Xiva tumani', 'Хивинский район'),
('district', 22, 'Bog''ot tumani', 'Багатский район'),
('district', 22, 'Gurlan tumani', 'Гурленский район'),
('district', 22, 'Xonqa tumani', 'Ханкинский район'),
('district', 22, 'Hazorasp tumani', 'Хазараспский район'),
('district', 22, 'Qo''shko''prik tumani', 'Кошкупырский район'),
('district', 22, 'Shovot tumani', 'Шаватский район'),
('district', 22, 'Yangiariq tumani', 'Янгиарыкский район'),
('district', 22, 'Yangibozor tumani', 'Янгибазарский район'),
('district', 22, 'Tuproqqal''a tumani', 'Тупраккалинский район');

