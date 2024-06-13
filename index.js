const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

// جایگزین کردن توکن ربات تلگرام و لینک کانال
const TELEGRAM_TOKEN = 'YOUR_TELEGRAM_BOT_TOKEN';
const CHANNEL_LINK = 'https://t.me/your_channel';

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const keyboard = {
    inline_keyboard: [
      [{ text: 'دریافت لینک ارجاع', callback_data: 'referral' }],
      [{ text: 'کانال', url: CHANNEL_LINK }],
    ],
  };

  bot.sendMessage(chatId, 'لطفاً یکی را انتخاب کنید:', { reply_markup: keyboard });
});

bot.on('callback_query', (callbackQuery) => {
  const userId = callbackQuery.from.id;
  const data = callbackQuery.data;

  if (data === 'referral') {
    // ذخیره امتیازات در یک فایل محلی یا پایگاه داده
    fs.appendFile('static/game.js', `\nscore += 10;  // User ID: ${userId}`, (err) => {
      if (err) throw err;
      bot.answerCallbackQuery(callbackQuery.id, { text: 'لینک ارجاع شما ایجاد شد و امتیازات به حساب شما اضافه شد.' });
    });
  }
});