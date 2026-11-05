/**
 * Tanishuv UZ - Telegraf Bot entrypoint for Node.js / VPS deployment
 */
import { createTelegramBot } from './bot.ts';
import dotenv from 'dotenv';

dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN || process.env.BOT_TOKEN;
const bot = createTelegramBot(token);

if (bot) {
  bot.launch().then(() => {
    console.log("🤖 [Tanishuv UZ Bot] Telegram bot muvaffaqiyatli ishga tushdi!");
  }).catch((err) => {
    console.error("Bot ishga tushishida xatolik:", err);
  });

  // Enable graceful stop
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
} else {
  console.log("⚠️ TELEGRAM_BOT_TOKEN topilmadi. Iltimos .env faylida ko'rsating.");
}

export default bot;
