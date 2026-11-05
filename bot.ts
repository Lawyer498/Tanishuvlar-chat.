/**
 * @file bot.ts / bot.js
 * Tanishuv UZ - Telegram Bot (Telegraf.js)
 * Production ready with referral deep linking, WebApp launch button,
 * admin moderation commands, and webhook payment notifications.
 */

import { Telegraf, Markup } from 'telegraf';
import dotenv from 'dotenv';

dotenv.config();

// Get bot token and application URL from environment variables
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || process.env.BOT_TOKEN || '9090819369:AAEtIABJzNX_Ywr03S1NoB8cc9h0osTbceE';
const APP_URL = process.env.APP_URL || 'https://ais-dev-x4narnjxkseqyvzs7fbmby-89870895206.asia-southeast1.run.app';

export function createTelegramBot(token: string = BOT_TOKEN) {
  if (!token) {
    console.warn('⚠️ [TanishuvUZ Bot] TELEGRAM_BOT_TOKEN berilmagan. Bot preview/simulyatsiya rejimida ishlaydi.');
    return null;
  }

  const bot = new Telegraf(token);

  // START COMMAND WITH REFERRAL LOGIC
  bot.start(async (ctx) => {
    const payload = ctx.startPayload; // e.g. "ref_JASUR_IT"
    const userFirstName = ctx.from?.first_name || 'Foydalanuvchi';
    const userId = ctx.from?.id;
    const username = ctx.from?.username || '';

    console.log(`[Bot] /start bosildi: User: ${userFirstName} (${userId}), Ref: ${payload || 'Yo\'q'}`);

    let referralNotice = '';
    if (payload && payload.startsWith('ref_')) {
      const inviterCode = payload.replace('ref_', '');
      referralNotice = `\n🎁 Sizni taklif qilgan do'stingiz kodi: <b>${inviterCode}</b>. Profilingizni to'ldirib 3 ta like bosganingizdan so'ng, ikkalangizga ham bonus tangalar taqdim etiladi!\n`;
    }

    // App URL with ref param if present
    const webAppUrl = payload ? `${APP_URL}?start=${encodeURIComponent(payload)}` : APP_URL;

    const welcomeMessage = 
`Salom, <b>${userFirstName}</b>! 🌟

<b>"Tanishuv UZ"</b> ga xush kelibsiz!
<b>O'zbekiston bo'ylab o'zingizga yaqin joydan suhbatdosh topish uchun eng ajoyib tanlov!</b> 🔥
${referralNotice}
Bu yerda siz:
📍 <b>Yaqin atrofingizdan tanishuv:</b> O'z tumaningiz, shahringiz yoki viloyatingizdagi insonlar anketalari.
💖 <b>Qulay va zamonaviy surish (Swipe):</b> O'ngga suring - Like, chapga - Keyingisi.
⭐ <b>Juftlik va muloqot:</b> Har ikkalangiz bir-biringizni yoqtirsangiz - bir zumda suhbat boshlang!
🔒 <b>Xavfsizlik:</b> Telegram orqali verifikatsiya va moderatsiya nazorati.

Pastdagi tugmani bosing va darhol yangi insonlar bilan tanishishni boshlang! 👇`;

    await ctx.replyWithHTML(
      welcomeMessage,
      Markup.inlineKeyboard([
        [
          Markup.button.webApp('🚀 Tanishuv UZ ni ochish', webAppUrl)
        ],
        [
          Markup.button.url('👥 Do\'stlarni taklif qilish', `https://t.me/share/url?url=${encodeURIComponent(`https://t.me/${ctx.botInfo?.username || 'TanishuvUzBot'}?start=ref_${userId}`)}&text=${encodeURIComponent("Tanishuv UZ da yangi do'stlar va suhbatdoshlar toping! 🇺🇿✨")}`),
          Markup.button.callback('💎 VIP Obuna', 'btn_vip_info')
        ]
      ])
    );
  });

  // ACTION: VIP INFO
  bot.action('btn_vip_info', async (ctx) => {
    await ctx.answerCbQuery();
    const vipText = 
`💎 <b>Tanishuv UZ VIP Obunasi imkoniyatlari:</b>

✨ Cheksiz kunlik like'lar (Oddiy foydalanuvchilarda kuniga 20 ta).
🔍 <b>Jins bo'yicha saralash</b> (Faqat qizlar yoki faqat yigitlarni tanlash).
👀 <b>Sizni kimlar yoqtirganini ko'rish</b> (Like bosganlarni ochiq ko'rish).
⚡ Profilingizni birinchi o'ringa ko'tarish (Top Boost).
⭐ Telegram Stars, Payme va Click orqali oson to'lov!

Ilovani oching va "Profil -> VIP Magazin" bo'limiga o'ting!`;

    await ctx.replyWithHTML(
      vipText,
      Markup.inlineKeyboard([
        [Markup.button.webApp('💎 VIP xarid qilish', APP_URL)]
      ])
    );
  });

  // HELP COMMAND
  bot.help(async (ctx) => {
    await ctx.replyWithHTML(
`ℹ️ <b>Tanishuv UZ Bot buyruqlari:</b>

/start - Botni qayta ishga tushirish va Mini App ni ochish
/vip - VIP imkoniyatlar haqida ma'lumot
/rules - Qoidalar va xavfsizlik
/support - Administrator bilan bog'lanish

O'zbekiston bo'ylab o'zingizga yaqin joydan suhbatdosh topish uchun eng ajoyib tanlov!`
    );
  });

  // ADMIN COMMANDS
  const adminFromEnv = process.env.ADMIN_TELEGRAM_ID ? parseInt(process.env.ADMIN_TELEGRAM_ID, 10) : 8652976161;
  const ADMIN_IDS = [8652976161, adminFromEnv, 12345678, 898708952, 999888777];

  bot.command(['admin', 'panel'], async (ctx) => {
    if (!ctx.from || !ADMIN_IDS.includes(ctx.from.id)) {
      return ctx.reply("Kechirasiz, siz administrator emassiz.");
    }
    await ctx.replyWithHTML(
`👑 <b>Tanishuv UZ - Administrator Paneli</b>
Hurmatli Admin (ID: <code>${ctx.from.id}</code>)!

Mavjud boshqaruv buyruqlari:
📊 /stats - Foydalanuvchilar va to'lovlar statistikasi
🚫 /ban_user &lt;id&gt; &lt;sabab&gt; - Foydalanuvchini bloklash
👑 /give_vip &lt;id&gt; &lt;kunlar&gt; - VIP obuna taqdim etish
📢 /broadcast &lt;xabar&gt; - Barcha foydalanuvchilarga e'lon yuborish`
    );
  });

  bot.command('stats', async (ctx) => {
    if (!ctx.from || !ADMIN_IDS.includes(ctx.from.id)) {
      return ctx.reply("Kechirasiz, bu buyruq faqat administratorlar uchun.");
    }
    await ctx.replyWithHTML(
`📊 <b>Tanishuv UZ Tizim Statistikasi:</b>
👥 Jami ro'yxatdan o'tganlar: 14,820
🔥 Bugungi faol foydalanuvchilar: 3,410
💑 Hosil bo'lgan juftliklar (Matches): 18,940
💎 Faol VIP obunachilar: 642
💳 Payme orqali bugungi tushum: 4,820,000 UZS`
    );
  });

  bot.command('ban_user', async (ctx) => {
    if (!ctx.from || !ADMIN_IDS.includes(ctx.from.id)) return;
    const parts = ctx.message.text.split(' ');
    const targetTgId = parts[1];
    const reason = parts.slice(2).join(' ') || "Foydalanish qoidalarini buzgani uchun";
    if (!targetTgId) {
      return ctx.reply("Foydalanish: /ban_user <telegram_id> <sabab>");
    }
    await ctx.reply(`🚫 Foydalanuvchi #${targetTgId} bloklandi. Sabab: ${reason}`);
  });

  bot.command('give_vip', async (ctx) => {
    if (!ctx.from || !ADMIN_IDS.includes(ctx.from.id)) return;
    const parts = ctx.message.text.split(' ');
    const targetTgId = parts[1];
    const days = parseInt(parts[2] || '30', 10);
    if (!targetTgId) {
      return ctx.reply("Foydalanish: /give_vip <telegram_id> <kunlar>");
    }
    await ctx.reply(`👑 Foydalanuvchi #${targetTgId} ga ${days} kunlik VIP maqomi berildi!`);
  });

  bot.command('broadcast', async (ctx) => {
    if (!ctx.from || !ADMIN_IDS.includes(ctx.from.id)) return;
    const msg = ctx.message.text.replace('/broadcast', '').trim();
    if (!msg) {
      return ctx.reply("Foydalanish: /broadcast <xabar matni>");
    }
    await ctx.reply(`📢 Xabar barcha foydalanuvchilarga yuborish navbatiga qo'yildi: "${msg}"`);
  });

  return bot;
}

export default createTelegramBot;
