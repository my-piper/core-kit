import { Telegraf } from "telegraf";

const bot = new Telegraf<MyContext>(TELEGRAM_BOT_TOKEN);

export default bot;
